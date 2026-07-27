import season

ROLE_DESTINATIONS = {
    "super_admin": "/admin/overview",
    "product_manager": "/admin/overview",
    "order_manager": "/admin/overview",
    "market_butler": "/admin/overview",
    "admin": "/admin/overview",
    "merchant": "/merchant/overview",
    "consumer": "/dashboard",
}


class Controller(wiz.controller("user")):
    def __init__(self):
        super().__init__()
        role = wiz.session.get("role")
        rbac = wiz.model("struct").rbac
        if not rbac.is_staff(role):
            wiz.response.redirect(ROLE_DESTINATIONS.get(role, "/access/login"))
