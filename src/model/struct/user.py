import datetime
import os
import re
import bcrypt


class User:
    ROLE_SUPER_ADMIN = "super_admin"
    ROLE_PRODUCT_MANAGER = "product_manager"
    ROLE_ORDER_MANAGER = "order_manager"
    ROLE_MARKET_BUTLER = "market_butler"
    ROLE_BUTLER_PENDING = "butler_pending"
    ROLE_MERCHANT = "merchant"
    ROLE_CONSUMER = "consumer"
    ALLOWED_ROLES = (
        ROLE_SUPER_ADMIN,
        ROLE_PRODUCT_MANAGER,
        ROLE_ORDER_MANAGER,
        ROLE_MARKET_BUTLER,
        ROLE_BUTLER_PENDING,
        ROLE_MERCHANT,
        ROLE_CONSUMER,
    )
    SIGNUP_ROLES = (ROLE_MARKET_BUTLER, ROLE_MERCHANT, ROLE_CONSUMER)

    DEFAULT_ACCOUNTS = (
        dict(
            id="admin",
            email="admin",
            name="홍천상인회 총괄관리자",
            role=ROLE_SUPER_ADMIN,
            password_env="MARKET_ADMIN_PASSWORD"
        ),
        dict(
            id="admin2",
            email="admin2",
            name="홍천상인회 상품관리자",
            role=ROLE_PRODUCT_MANAGER,
            password_env="MARKET_ADMIN2_PASSWORD"
        ),
        dict(
            id="admin3",
            email="admin3",
            name="홍천상인회 주문관리자",
            role=ROLE_ORDER_MANAGER,
            password_env="MARKET_ADMIN3_PASSWORD"
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
        if isinstance(password, str):
            password = password.encode("utf-8")
        return bcrypt.hashpw(password, bcrypt.gensalt()).decode("utf-8")

    def _check_password(self, password, hashed):
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
        user["role"] = self.core.rbac.normalize_role(user.get("role"))
        user["roleLabel"] = self.core.rbac.role_label(user.get("role"))
        user["permissions"] = self.core.rbac.permissions_for(user.get("role"))
        return user

    def find(self, identifier):
        identifier = str(identifier or "").strip()
        if not identifier:
            return None
        user = self.db.get(id=identifier)
        if user is None:
            user = self.db.get(email=identifier)
        return user

    def authenticate(self, identifier, password):
        user = self.find(identifier)
        if user is None or not self._check_password(password, user.get("password", "")):
            return None
        return self._without_password(user)

    def get(self, id=None):
        return self._without_password(self.db.get(id=id))

    def list(self, text="", role=""):
        kwargs = {}
        like = None
        normalized_role = self.core.rbac.normalize_role(role)
        if normalized_role:
            kwargs["role"] = normalized_role
        if text:
            kwargs["name"] = text
            like = "name"
        rows = self.db.rows(orderby="created", order="ASC", like=like, **kwargs)
        return [self._without_password(row) for row in rows]

    def create(self, data):
        data = dict(data)
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        data["role"] = self.core.rbac.normalize_role(data.get("role") or self.ROLE_CONSUMER)
        if data["role"] not in self.ALLOWED_ROLES:
            raise ValueError("올바른 역할을 선택해 주세요.")
        if not data.get("id"):
            data["id"] = str(data.get("email") or "").strip()
        if not data.get("email"):
            data["email"] = data["id"]
        data["password"] = self._hash_password(data["password"])
        data["created"] = now
        data["updated"] = now
        return self.db.insert(data)

    def register(self, identifier, password, name, role, mobile=""):
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
            raise ValueError("회원가입은 마켓 버틀러, 상인 또는 소비자 계정만 지원합니다.")
        if self.find(identifier) is not None:
            raise ValueError("이미 사용 중인 아이디입니다.")
        stored_role = self.ROLE_BUTLER_PENDING if role == self.ROLE_MARKET_BUTLER else role
        self.create(dict(
            id=identifier, email=identifier, password=password, name=name, mobile=mobile, role=stored_role
        ))
        return self.get(identifier)

    def ensure_default_accounts(self):
        """환경변수가 설정된 기본 계정을 보장하고 기존 admin 역할을 총괄관리자로 마이그레이션합니다."""
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        result = []
        try:
            self.db.update(dict(role=self.ROLE_SUPER_ADMIN, updated=now), role="admin")
        except Exception:
            pass
        for account in self.DEFAULT_ACCOUNTS:
            current = self.db.get(id=account["id"])
            if current is None:
                password = os.environ.get(account["password_env"], "")
                if not password:
                    continue
                self.db.insert(dict(
                    id=account["id"], email=account["email"], password=self._hash_password(password),
                    name=account["name"], mobile="", role=account["role"], created=now, updated=now
                ))
            elif account["id"] == "admin" and current.get("role") == "admin":
                self.db.update(dict(role=self.ROLE_SUPER_ADMIN, updated=now), id=account["id"])
            result.append(self.get(account["id"]))
        return result

    def update_account(self, id, name=None, role=None, mobile=None):
        current = self.db.get(id=id)
        if current is None:
            raise ValueError("계정을 찾을 수 없습니다.")
        fields = {}
        if name is not None:
            name = str(name).strip()
            if not name:
                raise ValueError("이름을 입력해 주세요.")
            fields["name"] = name
        if role is not None:
            role = self.core.rbac.normalize_role(role)
            if role not in self.ALLOWED_ROLES:
                raise ValueError("올바른 역할을 선택해 주세요.")
            fields["role"] = role
        if mobile is not None:
            fields["mobile"] = str(mobile).strip()
        fields["updated"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.db.update(fields, id=id)
        return self.get(id)

    def update_profile(self, id, **fields):
        fields["updated"] = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.db.update(fields, id=id)

    def change_password(self, id, current_password, new_password):
        user = self.db.get(id=id)
        if user is None or not self._check_password(current_password, user.get("password", "")):
            return False
        self.db.update(dict(
            password=self._hash_password(new_password),
            updated=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ), id=id)
        return True

    def count(self, **kwargs):
        return self.db.count(**kwargs) or 0


Model = User
