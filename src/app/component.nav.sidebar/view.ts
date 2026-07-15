import { HostListener, OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public cartCount: number = 0;

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        this.loadCartCount();
        await this.service.render();
    }

    public loadCartCount() {
        try {
            const items = JSON.parse(localStorage.getItem('market-cart') || '[]');
            this.cartCount = items.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);
        } catch (e) {
            this.cartCount = 0;
        }
    }

    @HostListener('window:market-cart-updated')
    public async onCartUpdated() {
        this.loadCartCount();
        await this.service.render();
    }

    @HostListener('window:storage')
    public async onStorageUpdated() {
        this.loadCartCount();
        await this.service.render();
    }

    public role() {
        return this.service.auth.session?.role || '';
    }

    public isConsumer() {
        return this.role() === 'consumer';
    }

    public isMerchant() {
        return this.role() === 'merchant';
    }

    public isAdmin() {
        return this.role() === 'admin';
    }

    public roleLabel() {
        if (this.isAdmin()) return '마켓버틀러';
        if (this.isMerchant()) return '상인 점포';
        return '소비자';
    }

    public homeLink() {
        if (this.isAdmin()) return '/admin/overview';
        if (this.isMerchant()) return '/merchant/overview';
        return '/dashboard';
    }

    public isActive(link: string) {
        if (link === '/dashboard') {
            return location.pathname === '/' || location.pathname === '/dashboard';
        }
        if (link === '/cart' && location.pathname.indexOf('/checkout') === 0) {
            return true;
        }
        return location.pathname.indexOf(link) === 0;
    }

    public desktopClass(link: string) {
        const base = 'rounded-xl px-3.5 py-2 text-[13px] font-bold transition';
        return this.isActive(link)
            ? base + ' bg-[#FFF0DD] text-[#B3531E]'
            : base + ' text-[#6F6258] hover:bg-[#F5EEE7] hover:text-[#2F241D]';
    }

    public mobileClass(link: string) {
        const base = 'flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-bold transition';
        return this.isActive(link)
            ? base + ' bg-[#FFF0DD] text-[#B3531E]'
            : base + ' text-[#76695E]';
    }
}
