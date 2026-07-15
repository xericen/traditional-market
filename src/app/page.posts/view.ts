import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public searchText: string = '';
    public selectedCategory: string = '전체';
    public sortBy: string = 'recommended';

    public categories: any[] = [
        { name: '전체', icon: '🧺' },
        { name: '시그니처', icon: '🎁' },
        { name: '전·떡', icon: '🥞' },
        { name: '국수', icon: '🍜' },
        { name: '채소', icon: '🥬' },
        { name: '반찬', icon: '🥢' },
        { name: '정육', icon: '🥩' },
        { name: '간식', icon: '🍯' }
    ];

    public products: any[] = [
        { id: 'hongchongtteok', category: '전·떡', name: '홍총떡 5장', shop: '김명자 홍총떡', price: 12000, unit: '1팩', stock: 14, cutoff: '16:00', emoji: '🥞', bg: 'bg-[#FFE6C9]', signature: true, butlerPick: true },
        { id: 'olchaengi', category: '국수', name: '올챙이국수 밀키트', shop: '홍천손맛집', price: 15000, unit: '2인분', stock: 9, cutoff: '15:30', emoji: '🍜', bg: 'bg-[#FFF3BF]', signature: true, butlerPick: true },
        { id: 'signature-box', category: '시그니처', name: '홍천시장 시그니처 상자', shop: '홍천중앙시장 상인회', price: 39000, unit: '1상자', stock: 6, cutoff: '15:30', emoji: '🎁', bg: 'bg-[#F5DFCF]', signature: true, butlerPick: true },
        { id: 'namul-box', category: '채소', name: '오늘의 산나물 꾸러미', shop: '봉숙이네 채소', price: 8900, unit: '1상자', stock: 21, cutoff: '17:00', emoji: '🥬', bg: 'bg-[#DFF3E2]', signature: false, butlerPick: true },
        { id: 'bean-sprout', category: '채소', name: '아삭 콩나물 300g', shop: '봉숙이네 채소', price: 2500, unit: '1봉', stock: 32, cutoff: '17:00', emoji: '🌱', bg: 'bg-[#E7F3DE]', signature: false, butlerPick: false },
        { id: 'jeonbyeong', category: '전·떡', name: '메밀전병 6개', shop: '덕이네 전집', price: 10000, unit: '1팩', stock: 11, cutoff: '16:30', emoji: '🥟', bg: 'bg-[#FCE8D2]', signature: false, butlerPick: true },
        { id: 'janggajji', category: '반찬', name: '산마늘 장아찌', shop: '홍천댁 반찬', price: 7900, unit: '400g', stock: 18, cutoff: '17:30', emoji: '🥢', bg: 'bg-[#E8F1D7]', signature: false, butlerPick: false },
        { id: 'hanwoo', category: '정육', name: '홍천 한우 불고기', shop: '중앙축산', price: 24500, unit: '500g', stock: 4, cutoff: '14:30', emoji: '🥩', bg: 'bg-[#F7D9D2]', signature: false, butlerPick: true },
        { id: 'honey', category: '간식', name: '홍천 아카시아꿀', shop: '산골양봉원', price: 18000, unit: '500g', stock: 13, cutoff: '17:00', emoji: '🍯', bg: 'bg-[#FFF0B8]', signature: false, butlerPick: false }
    ];

    public filteredProducts: any[] = [];
    public cartAnnouncement: string = '';

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        const queryCategory = new URLSearchParams(location.search).get('category');
        if (queryCategory && this.categories.some((item: any) => item.name === queryCategory)) {
            this.selectedCategory = queryCategory;
        }
        await this.applyFilters();
    }

    public async selectCategory(category: string) {
        this.selectedCategory = category;
        await this.applyFilters();
    }

    public async applyFilters() {
        const keyword = this.searchText.trim().toLowerCase();
        let rows = this.products.filter((product: any) => {
            const categoryMatch = this.selectedCategory === '전체'
                || (this.selectedCategory === '시그니처' && product.signature)
                || product.category === this.selectedCategory;
            const textMatch = !keyword
                || product.name.toLowerCase().indexOf(keyword) >= 0
                || product.shop.toLowerCase().indexOf(keyword) >= 0;
            return categoryMatch && textMatch;
        });

        if (this.sortBy === 'low') rows = rows.sort((a: any, b: any) => a.price - b.price);
        if (this.sortBy === 'stock') rows = rows.sort((a: any, b: any) => b.stock - a.stock);
        if (this.sortBy === 'recommended') {
            rows = rows.sort((a: any, b: any) => Number(b.butlerPick) - Number(a.butlerPick));
        }

        this.filteredProducts = rows;
        await this.service.render();
    }

    public async resetFilters() {
        this.searchText = '';
        this.selectedCategory = '전체';
        this.sortBy = 'recommended';
        await this.applyFilters();
    }

    public categoryClass(category: string) {
        const base = 'inline-flex h-11 items-center gap-2 rounded-full border px-4 text-xs font-extrabold transition';
        return this.selectedCategory === category
            ? base + ' border-[#E96B2C] bg-[#E96B2C] text-white shadow-sm'
            : base + ' border-[#E1D5CA] bg-[#FFFDF8] text-[#65574C] hover:border-[#F1B46F] hover:bg-[#FFF5E8]';
    }

    private isMotionTargetVisible(element: HTMLElement | null) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        return rect.width > 0
            && rect.height > 0
            && style.display !== 'none'
            && style.visibility !== 'hidden';
    }

    private getCartMotionTarget() {
        const bottomTarget = document.querySelector('[data-cart-motion-target="bottom"]') as HTMLElement;
        const headerTarget = document.querySelector('[data-cart-motion-target="header"]') as HTMLElement;

        if (this.isMotionTargetVisible(bottomTarget)) return bottomTarget;
        if (this.isMotionTargetVisible(headerTarget)) return headerTarget;
        return null;
    }

    private async playCartMotion(product: any, source: HTMLElement) {
        const target = this.getCartMotionTarget();
        const reduceMotion = window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!source || !target || reduceMotion) return;

        const sourceRect = source.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const size = 38;
        const startX = sourceRect.left + sourceRect.width / 2;
        const startY = sourceRect.top + sourceRect.height / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const arcHeight = Math.max(54, Math.min(96, Math.abs(deltaY) * 0.2));

        const flyer = document.createElement('span');
        flyer.textContent = product.emoji || '🛒';
        flyer.setAttribute('aria-hidden', 'true');
        flyer.setAttribute('data-cart-motion', 'active');
        Object.assign(flyer.style, {
            position: 'fixed',
            left: (startX - size / 2) + 'px',
            top: (startY - size / 2) + 'px',
            zIndex: '2147483646',
            display: 'flex',
            width: size + 'px',
            height: size + 'px',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid rgba(233, 107, 44, 0.3)',
            borderRadius: '999px',
            background: '#FFFDF8',
            boxShadow: '0 10px 26px rgba(70, 49, 33, 0.24)',
            fontSize: '20px',
            lineHeight: '1',
            pointerEvents: 'none',
            willChange: 'transform, opacity'
        });
        document.body.appendChild(flyer);

        try {
            source.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(0.84)', offset: 0.35 },
                { transform: 'scale(1.08)', offset: 0.7 },
                { transform: 'scale(1)' }
            ], {
                duration: 260,
                easing: 'ease-out'
            });

            const flight = flyer.animate([
                {
                    transform: 'translate3d(0, 0, 0) scale(0.58)',
                    opacity: 0.25,
                    offset: 0
                },
                {
                    transform: 'translate3d(0, -8px, 0) scale(1.05)',
                    opacity: 1,
                    offset: 0.14
                },
                {
                    transform: 'translate3d(' + (deltaX * 0.55) + 'px, ' + (deltaY * 0.52 - arcHeight) + 'px, 0) scale(0.88)',
                    opacity: 1,
                    offset: 0.58
                },
                {
                    transform: 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0) scale(0.2)',
                    opacity: 0.1,
                    offset: 1
                }
            ], {
                duration: 640,
                easing: 'cubic-bezier(0.22, 0.72, 0.24, 1)',
                fill: 'forwards'
            });

            await flight.finished;

            const landing = target.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.2)', offset: 0.38 },
                { transform: 'scale(0.94)', offset: 0.72 },
                { transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
            await landing.finished;
        } catch (e) {
            // 애니메이션 취소 여부와 관계없이 장바구니 저장 상태는 유지한다.
        } finally {
            flyer.remove();
        }
    }

    public async addToCart(product: any, event: Event) {
        event.preventDefault();
        event.stopPropagation();
        const source = event.currentTarget as HTMLElement;

        let cart: any[] = [];
        try {
            cart = JSON.parse(localStorage.getItem('market-cart') || '[]');
        } catch (e) {
            cart = [];
        }

        const found = cart.find((item: any) => item.id === product.id);
        if (found) {
            found.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1, substitute: true });
        }

        const quantity = found ? found.quantity : 1;
        localStorage.setItem('market-cart', JSON.stringify(cart));
        this.cartAnnouncement = product.name + ' 장바구니에 담았습니다. 현재 ' + quantity + '개입니다.';
        window.dispatchEvent(new Event('market-cart-updated'));
        await this.service.render();
        await this.playCartMotion(product, source);
    }
}
