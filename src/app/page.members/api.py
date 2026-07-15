struct = wiz.model("struct")

ALLOWED_ROLES = ("admin", "merchant", "consumer")

def list():
    text = wiz.request.query("text", "")
    role = wiz.request.query("role", "")

    members = struct.user.list(text=text, role=role)
    colors = [
        "bg-indigo-100 text-indigo-700",
        "bg-pink-100 text-pink-700",
        "bg-green-100 text-green-700",
        "bg-amber-100 text-amber-700",
        "bg-cyan-100 text-cyan-700",
        "bg-violet-100 text-violet-700",
    ]
    for i, member in enumerate(members):
        member["avatarColor"] = colors[i % len(colors)]
        member["joined"] = str(member.get("created", ""))[:10]

    wiz.response.status(200, members)

def invite():
    email = wiz.request.query("email", "").strip()
    role = wiz.request.query("role", "consumer").strip()

    if not email:
        wiz.response.status(400, message="이메일을 입력해 주세요.")
    if role not in ALLOWED_ROLES:
        wiz.response.status(400, message="올바른 역할을 선택해 주세요.")

    existing = struct.user.find(email)
    if existing:
        wiz.response.status(400, message="이미 등록된 사용자입니다.")

    struct.user.create(dict(
        email=email,
        password="welcome1",
        name=email.split("@")[0],
        role=role
    ))
    wiz.response.status(200)

def remove():
    id = wiz.request.query("id", "")
    if not id:
        wiz.response.status(400, message="ID가 필요합니다.")

    if id == wiz.session.get("id"):
        wiz.response.status(400, message="현재 로그인한 계정은 제거할 수 없습니다.")

    struct.user.db.delete(id=id)
    wiz.response.status(200)
