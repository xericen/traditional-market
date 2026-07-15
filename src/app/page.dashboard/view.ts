import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public todayLabel: string = '';
    public isPlaying: boolean = false;
    public soundOn: boolean = false;

    public promises: any[] = [
        { title: '매일 아침 등록', text: '오늘 상품만' },
        { title: '현장 직접 확인', text: '청년 버틀러' },
        { title: '배송 · 픽업', text: '원하는 방식으로' }
    ];

    public categories: any[] = [
        { name: '전체', icon: '🧺' },
        { name: '시그니처', icon: '🎁' },
        { name: '전·떡', icon: '🥞' },
        { name: '국수', icon: '🍜' },
        { name: '채소', icon: '🥬' },
        { name: '반찬', icon: '🥢' },
        { name: '정육', icon: '🥩' }
    ];

    public products: any[] = [
        { id: 'hongchongtteok', name: '홍총떡 5장', shop: '김명자 홍총떡', price: 12000, unit: '1팩', stock: 14, cutoff: '16:00', emoji: '🥞', bg: 'bg-[#FFE6C9]', signature: true },
        { id: 'olchaengi', name: '올챙이국수 밀키트', shop: '홍천손맛집', price: 15000, unit: '2인분', stock: 9, cutoff: '15:30', emoji: '🍜', bg: 'bg-[#FFF3BF]', signature: true },
        { id: 'namul-box', name: '오늘의 산나물 꾸러미', shop: '봉숙이네 채소', price: 8900, unit: '1상자', stock: 21, cutoff: '17:00', emoji: '🥬', bg: 'bg-[#DFF3E2]', signature: false }
    ];

    public features: any[] = [
        { icon: '🔎', title: '버틀러 현장 검수', text: '수량·신선도·포장을 직접 확인해요.' },
        { icon: '💬', title: '검수 결과 알림', text: '준비 과정과 대체 제안을 바로 알려드려요.' },
        { icon: '📦', title: '한 번에 배송·픽업', text: '여러 점포 상품도 주문 한 번으로 받아요.' }
    ];

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        const now = new Date();
        this.todayLabel = (now.getMonth() + 1) + '월 ' + now.getDate() + '일';
        await this.service.render();
    }

    public async toggleVideo() {
        this.isPlaying = !this.isPlaying;
        await this.service.render();
    }

    public async toggleSound() {
        this.soundOn = !this.soundOn;
        await this.service.render();
    }

    public goCategory(category: string) {
        const query = category === '전체' ? '' : '?category=' + encodeURIComponent(category);
        this.service.href('/posts' + query);
    }

    public async addToCart(product: any, event: Event) {
        event.preventDefault();
        event.stopPropagation();

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

        localStorage.setItem('market-cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('market-cart-updated'));
        await this.service.modal.success(product.name + '을(를) 장바구니에 담았습니다.');
        await this.service.render();
    }
}
