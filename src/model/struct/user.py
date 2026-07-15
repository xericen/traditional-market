import datetime
import os
import re
import bcrypt

class User:
    ROLE_ADMIN = "admin"
    ROLE_MERCHANT = "merchant"
    ROLE_CONSUMER = "consumer"
    ALLOWED_ROLES = (ROLE_ADMIN, ROLE_MERCHANT, ROLE_CONSUMER)
    SIGNUP_ROLES = (ROLE_MERCHANT, ROLE_CONSUMER)

    DEFAULT_ACCOUNTS = (
        dict(
            id="admin",
            email="admin",
            name="홍천상인회 마켓버틀러",
            role=ROLE_ADMIN,
            password_env="MARKET_ADMIN_PASSWORD"
        ),
        dict(
            id="merchant",
            email="merchant",
            name="홍천중앙시장 상인",
            role=ROLE_MERCHANT,
            password_env="MARKET_MERCHANT_PASSWORD"
        ),
        dict(
            id="consumer",
            email="consumer",
            name="홍천장날 소비자",
            role=ROLE_CONSUMER,
            password_env="MARKET_CONSUMER_PASSWORD"
        ),
    )

    def __init__(self, core):
        self.core = core
        self.db = core.orm.use("user")

    def _hash_password(self, password):
        """비밀번호 bcrypt 해시"""
        if isinstance(password, str):
            password = password.encode("utf-8")
        return bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")

    def _check_password(self, password, hashed):
        """비밀번호 검증"""
        if not password or not hashed:
            return False
        if isinstance(password, str):
            password = password.encode("utf-8")
        if isinstance(hashed, str):
            hashed = hashed.encode("utf-8")
        try:
            return bcrypt.checkpw(password, hashed)
        except (TypeError, ValueError):
            return False

    def _without_password(self, user):
        if user is None:
            return None
        user = dict(user)
        user.pop("password", None)
        return user

    def find(self, identifier):
        """아이디 또는 기존 이메일로 사용자 조회"""
        identifier = str(identifier or "").strip()
        if not identifier:
            return None
        user = self.db.get(id=identifier)
        if user is None:
            user = self.db.get(email=identifier)
        return user

    def authenticate(self, identifier, password):
        """아이디(또는 기존 이메일)와 비밀번호 인증"""
        user = self.find(identifier)
        if user is None:
            return None
        if not self._check_password(password, user.get("password", "")):
            return None
        return self._without_password(user)

    def get(self, id=None):
        """사용자 단건 조회 (비밀번호 제외)"""
        return self._without_password(self.db.get(id=id))

    def list(self, text="", role=""):
        """사용자 목록 조회"""
        kwargs = dict()
        like = None

        if role:
            kwargs["role"] = role
        if text:
            kwargs["name"] = text
            like = "name"

        rows = self.db.rows(
            orderby="created",
            order="ASC",
            like=like,
            **kwargs
        )
        return [self._without_password(row) for row in rows]

    def create(self, data):
        """bcrypt 해시를 적용해 사용자 생성"""
        data = dict(data)
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data["password"] = self._hash_password(data["password"])
        data["created"] = now
        data["updated"] = now
        if not data.get("role"):
            data["role"] = self.ROLE_CONSUMER
        return self.db.insert(data)

    def register(self, identifier, password, name, role, mobile=""):
        """상인·소비자 회원가입"""
        identifier = str(identifier or "").strip()
        name = str(name or "").strip()
        role = str(role or "").strip()
        mobile = str(mobile or "").strip()

        if re.match(r"^[A-Za-z0-9._-]{3,32}$", identifier) is None:
            raise ValueError("아이디는 영문, 숫자, 마침표, 밑줄, 하이픈으로 3~32자 입력해 주세요.")
        if len(str(password or "")) < 8:
            raise ValueError("비밀번호는 8자 이상 입력해 주세요.")
        if not name:
            raise ValueError("이름을 입력해 주세요.")
        if role not in self.SIGNUP_ROLES:
            raise ValueError("회원가입은 상인 또는 소비자 계정만 지원합니다.")
        if self.find(identifier) is not None:
            raise ValueError("이미 사용 중인 아이디입니다.")

        self.create(dict(
            id=identifier,
            email=identifier,
            password=password,
            name=name,
            mobile=mobile,
            role=role
        ))
        return self.get(identifier)

    def ensure_default_accounts(self):
        """요청된 마켓버틀러·상인·소비자 기본 계정을 멱등적으로 보장"""
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        result = []

        for account in self.DEFAULT_ACCOUNTS:
            current = self.db.get(id=account["id"])
            if current is None:
                password = os.environ.get(account["password_env"], "")
                if not password:
                    continue
                self.db.insert(dict(
                    id=account["id"],
                    email=account["email"],
                    password=self._hash_password(password),
                    name=account["name"],
                    mobile="",
                    role=account["role"],
                    created=now,
                    updated=now
                ))
            result.append(self.get(account["id"]))

        return result

    def update_profile(self, id, **fields):
        """프로필 업데이트"""
        fields["updated"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.db.update(fields, id=id)

    def change_password(self, id, current_password, new_password):
        """현재 비밀번호 검증 후 변경"""
        user = self.db.get(id=id)
        if user is None:
            return False
        if not self._check_password(current_password, user.get("password", "")):
            return False
        self.db.update(dict(
            password=self._hash_password(new_password),
            updated=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ), id=id)
        return True

    def count(self, **kwargs):
        """사용자 수 조회"""
        return self.db.count(**kwargs) or 0

Model = User
