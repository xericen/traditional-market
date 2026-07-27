class Struct:
    def __init__(self):
        self.orm = wiz.model("portal/season/orm")
        self.session = wiz.model("portal/season/session").use()
        self._User = wiz.model("struct/user")
        self._RBAC = wiz.model("struct/rbac")
        self._packages = {}

        self._init_tables()
        self._init_accounts()

    def _init_tables(self):
        """DB 테이블이 없으면 자동 생성"""
        for name in ["user"]:
            try:
                db = self.orm.use(name)
                db.orm.create_table(safe=True)
            except Exception:
                pass

    def _init_accounts(self):
        """역할별 기본 계정을 최초 로드 시 보장"""
        try:
            self.user.ensure_default_accounts()
        except Exception:
            pass

    def db(self, name):
        """ORM Wrapper 반환 (src/model/db/{name}.py)"""
        return self.orm.use(name)

    @property
    def user(self):
        """User Sub-Struct 접근 (호출마다 새 인스턴스)"""
        return self._User(self)

    @property
    def rbac(self):
        """역할 기반 권한 정책 접근"""
        return self._RBAC(self)

    def __getattr__(self, name):
        """알 수 없는 속성은 패키지 Struct에서 동적으로 로드"""
        if name.startswith("_"):
            raise AttributeError(name)
        if name not in self._packages:
            try:
                self._packages[name] = wiz.model(f"portal/{name}/struct")
            except Exception:
                raise AttributeError(f"Package '{name}' not found")
        return self._packages[name]

Model = Struct()
