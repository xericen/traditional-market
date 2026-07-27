import { OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit, OnDestroy {
    public routerSub: any;

    constructor(public service: Service, public router: Router) { }

    public async ngOnInit() {
        await this.service.init();
        if (!this.enforceAccess()) return;
        this.routerSub = this.router.events.subscribe(async (event: any) => {
            if (event instanceof NavigationEnd) {
                if (!this.enforceAccess()) return;
                await this.service.render();
            }
        });
        await this.service.render();
    }

    public ngOnDestroy() {
        if (this.routerSub) this.routerSub.unsubscribe();
    }

    public requiredRole(path: string) {
        if (path.indexOf('/members') === 0) return 'account_manager';
        if (path.indexOf('/admin') === 0) return 'staff';
        if (path.indexOf('/merchant') === 0) return 'merchant';
        if (
            path.indexOf('/dashboard') === 0 || path.indexOf('/posts') === 0
            || path.indexOf('/cart') === 0 || path.indexOf('/checkout') === 0
            || path.indexOf('/orders') === 0
        ) return 'consumer';
        if (path.indexOf('/mypage') === 0) return 'authenticated';
        return '';
    }

    public isStaff(role: string) {
        return ['admin', 'super_admin', 'product_manager', 'order_manager', 'market_butler'].indexOf(role) >= 0;
    }

    public hasPermission(permission: string) {
        return (this.service.auth.session?.permissions || []).indexOf(permission) >= 0;
    }

    public roleHome(role: string) {
        if (this.isStaff(role)) return '/admin/overview';
        if (role === 'merchant') return '/merchant/overview';
        if (role === 'consumer') return '/dashboard';
        return '/access/login';
    }

    public enforceAccess() {
        const required = this.requiredRole(location.pathname);
        if (!required) return true;
        if (!this.service.auth.status) {
            location.href = '/access/login';
            return false;
        }
        const role = this.service.auth.session?.role;
        const allowed = required === 'authenticated'
            || (required === 'staff' && this.isStaff(role))
            || (required === 'account_manager' && this.hasPermission('admin.accounts.manage'))
            || role === required;
        if (!allowed) {
            location.href = this.roleHome(role);
            return false;
        }
        return true;
    }
}
