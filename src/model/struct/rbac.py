class RBAC:
    ROLE_SUPER_ADMIN = "super_admin"
    ROLE_PRODUCT_MANAGER = "product_manager"
    ROLE_ORDER_MANAGER = "order_manager"
    ROLE_MARKET_BUTLER = "market_butler"
    ROLE_BUTLER_PENDING = "butler_pending"
    LEGACY_ROLE_ALIASES = {"admin": ROLE_SUPER_ADMIN}

    ROLE_LABELS = {
        ROLE_SUPER_ADMIN: "총괄관리자",
        ROLE_PRODUCT_MANAGER: "상품관리자",
        ROLE_ORDER_MANAGER: "주문관리자",
        ROLE_MARKET_BUTLER: "마켓 버틀러",
        ROLE_BUTLER_PENDING: "마켓 버틀러 승인 대기",
        "merchant": "상인",
        "consumer": "소비자",
    }

    PERMISSIONS = {
        "system.policy.manage",
        "admin.accounts.manage",
        "events.approve",
        "system.backup",
        "products.review",
        "products.create",
        "products.update",
        "products.delete",
        "products.price.update",
        "inventory.update",
        "content.shorts.create",
        "content.banners.create",
        "notices.create",
        "orders.view",
        "orders.cancel.approve",
        "orders.shipping.update",
        "inquiries.reply",
        "sales.statistics.view",
        "sales.statistics.manage",
        "system.logs.view",
    }

    ROLE_PERMISSIONS = {
        ROLE_SUPER_ADMIN: PERMISSIONS,
        ROLE_PRODUCT_MANAGER: {
            "products.review",
            "products.create",
            "products.update",
            "products.delete",
            "products.price.update",
            "inventory.update",
            "content.shorts.create",
            "content.banners.create",
            "orders.view",
            "sales.statistics.view",
        },
        ROLE_ORDER_MANAGER: {
            "orders.view",
            "orders.cancel.approve",
            "orders.shipping.update",
            "inquiries.reply",
            "inventory.update",
            "sales.statistics.view",
        },
        ROLE_MARKET_BUTLER: {
            "products.review",
            "products.create",
            "products.update",
            "products.price.update",
            "inventory.update",
            "content.shorts.create",
            "orders.view",
            "orders.shipping.update",
            "inquiries.reply",
            "sales.statistics.view",
        },
    }

    STAFF_ROLES = tuple(ROLE_PERMISSIONS.keys())
    MANAGEABLE_ROLES = STAFF_ROLES + (ROLE_BUTLER_PENDING, "merchant", "consumer")

    def __init__(self, core=None):
        self.core = core

    def normalize_role(self, role):
        role = str(role or "").strip()
        return self.LEGACY_ROLE_ALIASES.get(role, role)

    def role_label(self, role):
        return self.ROLE_LABELS.get(self.normalize_role(role), str(role or ""))

    def permissions_for(self, role):
        normalized = self.normalize_role(role)
        return sorted(self.ROLE_PERMISSIONS.get(normalized, set()))

    def has_permission(self, role, permission):
        return permission in self.ROLE_PERMISSIONS.get(self.normalize_role(role), set())

    def is_staff(self, role):
        return self.normalize_role(role) in self.STAFF_ROLES

    def is_super_admin(self, role):
        return self.normalize_role(role) == self.ROLE_SUPER_ADMIN


Model = RBAC
