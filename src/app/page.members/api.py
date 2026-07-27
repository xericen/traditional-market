import re

struct = wiz.model("struct")


def require_account_manager():
    if not struct.rbac.has_permission(wiz.session.get("role", ""), "admin.accounts.manage"):
        wiz.response.status(403, message="관리자 계정 관리 권한이 없습니다.")


def validate_role(role):
    normalized = struct.rbac.normalize_role(role)
    if normalized not in struct.rbac.MANAGEABLE_ROLES:
        raise ValueError("올바른 역할을 선택해 주세요.")
    return normalized


def list():
    require_account_manager()
    text = wiz.request.query("text", "").strip()
    role = wiz.request.query("role", "").strip()
    if role:
        role = validate_role(role)
    members = struct.user.list(text=text, role=role)
    colors = [
        "bg-indigo-100 text-indigo-700", "bg-pink-100 text-pink-700",
        "bg-green-100 text-green-700", "bg-amber-100 text-amber-700",
        "bg-cyan-100 text-cyan-700", "bg-violet-100 text-violet-700",
    ]
    for i, member in enumerate(members):
        member["avatarColor"] = colors[i % len(colors)]
        member["joined"] = str(member.get("created", ""))[:10]
    wiz.response.status(200, members)


def invite():
    require_account_manager()
    identifier = wiz.request.query("identifier", "").strip()
    email = wiz.request.query("email", "").strip()
    name = wiz.request.query("name", "").strip()
    password = wiz.request.query("password", "")
    try:
        role = validate_role(wiz.request.query("role", "consumer").strip())
        if re.match(r"^[A-Za-z0-9._-]{3,32}$", identifier) is None:
            raise ValueError("아이디는 영문, 숫자, 마침표, 밑줄, 하이픈으로 3~32자 입력해 주세요.")
        if not email or "@" not in email:
            raise ValueError("올바른 이메일을 입력해 주세요.")
        if not name:
            raise ValueError("이름을 입력해 주세요.")
        if len(password) < 8:
            raise ValueError("초기 비밀번호는 8자 이상 입력해 주세요.")
        if struct.user.find(identifier) or struct.user.find(email):
            raise ValueError("이미 등록된 아이디 또는 이메일입니다.")
        struct.user.create(dict(
            id=identifier, email=email, password=password, name=name, mobile="", role=role
        ))
    except ValueError as error:
        wiz.response.status(400, message=str(error))
    wiz.response.status(200)


def update():
    require_account_manager()
    user_id = wiz.request.query("id", "").strip()
    name = wiz.request.query("name", "").strip()
    try:
        role = validate_role(wiz.request.query("role", "").strip())
        current = struct.user.get(user_id)
        if current is None:
            raise ValueError("계정을 찾을 수 없습니다.")
        current_role = struct.rbac.normalize_role(current.get("role"))
        if user_id == wiz.session.get("id") and role != current_role:
            raise ValueError("현재 로그인한 계정의 역할은 변경할 수 없습니다.")
        if current_role == "super_admin" and role != "super_admin" and struct.user.count(role="super_admin") <= 1:
            raise ValueError("최소 한 명의 총괄관리자가 필요합니다.")
        member = struct.user.update_account(user_id, name=name, role=role)
    except ValueError as error:
        wiz.response.status(400, message=str(error))
    wiz.response.status(200, member)


def remove():
    require_account_manager()
    user_id = wiz.request.query("id", "").strip()
    if not user_id:
        wiz.response.status(400, message="ID가 필요합니다.")
    if user_id == wiz.session.get("id"):
        wiz.response.status(400, message="현재 로그인한 계정은 제거할 수 없습니다.")
    member = struct.user.get(user_id)
    if member is None:
        wiz.response.status(404, message="계정을 찾을 수 없습니다.")
    if struct.rbac.is_super_admin(member.get("role")) and struct.user.count(role="super_admin") <= 1:
        wiz.response.status(400, message="최소 한 명의 총괄관리자가 필요합니다.")
    struct.user.db.delete(id=user_id)
    wiz.response.status(200)
