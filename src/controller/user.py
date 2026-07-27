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


class Controller(wiz.controller("base")):
    def __init__(self):
        super().__init__()
        if wiz.session.has("id") is False:
            wiz.response.redirect("/access/login")
        try:
            struct = wiz.model("struct")
            user = struct.user.get(wiz.session.get("id"))
        except Exception:
            user = None
        if user is None:
            wiz.session.clear()
            wiz.response.redirect("/access/login")
        role = struct.rbac.normalize_role(user.get("role"))
        if role not in ROLE_DESTINATIONS:
            wiz.session.clear()
            wiz.response.redirect("/access/login")
        wiz.session.set(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            role=role,
            roleLabel=struct.rbac.role_label(role),
            permissions=struct.rbac.permissions_for(role)
        )
