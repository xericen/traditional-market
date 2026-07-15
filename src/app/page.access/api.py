session = wiz.model("portal/season/session").use()
struct = wiz.model("struct")

ROLE_DESTINATIONS = {
    "admin": "/admin/overview",
    "merchant": "/merchant/overview",
    "consumer": "/dashboard",
}
SIGNUP_ROLES = ("merchant", "consumer")

def destination_for(role):
    return ROLE_DESTINATIONS.get(role, "/access/login")

def open_session(user):
    session.clear()
    session.set(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"]
    )

def check():
    user_id = session.get("id", None)
    if user_id is None:
        wiz.response.status(200, status=False, session={})

    user = None
    try:
        struct.user.ensure_default_accounts()
        user = struct.user.get(user_id)
    except Exception:
        user = None

    if user is None or user.get("role") not in ROLE_DESTINATIONS:
        session.clear()
        wiz.response.status(200, status=False, session={})

    open_session(user)
    wiz.response.status(200, status=True, session=user)

def login():
    identifier = wiz.request.query("identifier", "").strip()
    password = wiz.request.query("password", "")

    if not identifier or not password:
        wiz.response.status(400, message="아이디와 비밀번호를 입력해 주세요.")

    user = None
    lookup_error = False
    try:
        struct.user.ensure_default_accounts()
        user = struct.user.authenticate(identifier, password)
    except Exception:
        lookup_error = True

    if lookup_error:
        wiz.response.status(503, message="로그인 정보를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.")
    if user is None:
        wiz.response.status(401, message="아이디 또는 비밀번호가 올바르지 않습니다.")
    if user.get("role") not in ROLE_DESTINATIONS:
        wiz.response.status(403, message="접근 권한이 설정되지 않은 계정입니다.")

    open_session(user)
    wiz.response.status(
        200,
        role=user["role"],
        destination=destination_for(user["role"])
    )

def register():
    identifier = wiz.request.query("identifier", "").strip()
    password = wiz.request.query("password", "")
    password_confirm = wiz.request.query("passwordConfirm", "")
    name = wiz.request.query("name", "").strip()
    mobile = wiz.request.query("mobile", "").strip()
    role = wiz.request.query("role", "").strip()

    if role not in SIGNUP_ROLES:
        wiz.response.status(400, message="가입 유형은 상인 또는 소비자만 선택할 수 있습니다.")
    if password != password_confirm:
        wiz.response.status(400, message="비밀번호 확인이 일치하지 않습니다.")

    user = None
    error_message = None
    try:
        struct.user.ensure_default_accounts()
        user = struct.user.register(
            identifier=identifier,
            password=password,
            name=name,
            role=role,
            mobile=mobile
        )
    except ValueError as error:
        error_message = str(error)
    except Exception:
        error_message = "회원가입을 완료하지 못했습니다. 입력 정보를 확인해 주세요."

    if error_message is not None:
        wiz.response.status(400, message=error_message)

    open_session(user)
    wiz.response.status(
        200,
        role=user["role"],
        destination=destination_for(user["role"])
    )

def logout():
    session.clear()
    wiz.response.status(200, status=True)
