import { OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit, OnDestroy {
    public tab: string = 'benefits';
    public routerSub: any;
    public tabs: any[] = [
        { key: 'benefits', label: '회원혜택 · 적립금', icon: '🎁' },
        { key: 'delivery', label: '배달몰 안내', icon: '🛵' }
    ];

    constructor(public service: Service, public router: Router) { }

    public async ngOnInit() {
        await this.service.init();
        this.syncTab();
        this.routerSub = this.router.events.subscribe(async (event: any) => {
            if (event instanceof NavigationEnd && location.pathname.indexOf('/guide') === 0) {
                this.syncTab();
                await this.service.render();
            }
        });
        await this.service.render();
    }

    public ngOnDestroy() {
        if (this.routerSub) this.routerSub.unsubscribe();
    }

    public syncTab() {
        const next = WizRoute.segment.tab || location.pathname.split('/')[2] || 'benefits';
        this.tab = next === 'delivery' ? 'delivery' : 'benefits';
    }

    public goTab(tab: string) {
        this.service.href('/guide/' + (tab === 'delivery' ? 'delivery' : 'benefits'));
    }

    public tabClass(tab: string) {
        const base = 'flex min-h-12 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-[11px] font-black transition';
        return this.tab === tab
            ? base + ' bg-white text-[#2E7D32] shadow-sm ring-1 ring-[#DCE7DA]'
            : base + ' text-[#7A6C61]';
    }
}
