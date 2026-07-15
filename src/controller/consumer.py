import season

ROLE_DESTINATIONS = {
    "admin": "/admin/overview",
    "merchant": "/merchant/overview",
    "consumer": "/dashboard",
}

class Controller(wiz.controller("user")):
    def __init__(self):
        super().__init__()
        role = wiz.session.get("role")
        if role != "consumer":
            wiz.response.redirect(ROLE_DESTINATIONS.get(role, "/access/login"))
