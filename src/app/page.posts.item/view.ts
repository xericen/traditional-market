import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public quantity: number = 1;
    public substitute: boolean = true;
    public favorite: boolean = false;
    public isPlaying: boolean = false;
    public activeInfo: string = 'product';

    public inspectionItems: string[] = ['수량 확인', '신선도 확인', '포장 상태', '누락 · 파손'];

    public products: any[] = [
        { id: 'hongchongtteok', name: '홍총떡 5장', shop: '김명자 홍총떡', price: 12000, unit: '1팩', stock: 14, cutoff: '16:00', emoji: '🥞', bg: 'bg-[#FFE6C9]', signature: true, category: '전·떡', butlerNote: '방금 부쳐 온기가 남아 있고 무채가 아삭해요. 오늘 첫 번째 추천입니다.', storeStory: '30년 넘게 같은 자리에서 메밀 반죽과 무채 소를 직접 준비합니다. 주문이 들어오면 그날 부친 홍총떡을 식혀 정성껏 포장해 드려요.' },
        { id: 'olchaengi', name: '올챙이국수 밀키트', shop: '홍천손맛집', price: 15000, unit: '2인분', stock: 9, cutoff: '15:30', emoji: '🍜', bg: 'bg-[#FFF3BF]', signature: true, category: '국수', butlerNote: '면과 육수를 따로 밀봉했습니다. 부모님께 보내기 좋은 구성으로 골랐어요.', storeStory: '홍천의 구수한 옥수수 올챙이국수를 집에서도 간편하게 즐기도록 육수와 고명을 한 팩에 담았습니다.' },
        { id: 'signature-box', name: '홍천시장 시그니처 상자', shop: '홍천중앙시장 상인회', price: 39000, unit: '1상자', stock: 6, cutoff: '15:30', emoji: '🎁', bg: 'bg-[#F5DFCF]', signature: true, category: '시그니처', butlerNote: '홍총떡, 올챙이국수, 산나물을 한 번에 검수해 상자 하나로 보내드려요.', storeStory: '홍천중앙시장의 대표 맛을 처음 접하는 분을 위해 상인회와 청년 버틀러가 함께 구성한 한정 상자입니다.' },
        { id: 'namul-box', name: '오늘의 산나물 꾸러미', shop: '봉숙이네 채소', price: 8900, unit: '1상자', stock: 21, cutoff: '17:00', emoji: '🥬', bg: 'bg-[#DFF3E2]', signature: false, category: '채소', butlerNote: '잎이 단단하고 선명한 것만 따로 골랐어요. 오늘 저녁 무침으로 좋아요.', storeStory: '홍천 인근 농가에서 아침에 들어온 채소와 산나물을 그날그날 선별해 판매하는 시장 채소 점포입니다.' },
        { id: 'bean-sprout', name: '아삭 콩나물 300g', shop: '봉숙이네 채소', price: 2500, unit: '1봉', stock: 32, cutoff: '17:00', emoji: '🌱', bg: 'bg-[#E7F3DE]', signature: false, category: '채소', butlerNote: '줄기가 통통하고 물러진 부분이 없어요. 국이나 무침에 쓰기 좋습니다.', storeStory: '매일 아침 들어온 신선 채소를 소분해 판매합니다. 필요한 만큼 부담 없이 주문할 수 있어요.' },
        { id: 'jeonbyeong', name: '메밀전병 6개', shop: '덕이네 전집', price: 10000, unit: '1팩', stock: 11, cutoff: '16:30', emoji: '🥟', bg: 'bg-[#FCE8D2]', signature: false, category: '전·떡', butlerNote: '오늘 부친 전병으로 피가 얇고 소가 넉넉합니다.', storeStory: '메밀 향이 살아 있는 얇은 피에 직접 볶은 김치 소를 넣어 매일 시장에서 부칩니다.' },
        { id: 'janggajji', name: '산마늘 장아찌', shop: '홍천댁 반찬', price: 7900, unit: '400g', stock: 18, cutoff: '17:30', emoji: '🥢', bg: 'bg-[#E8F1D7]', signature: false, category: '반찬', butlerNote: '간이 세지 않고 잎이 부드러워 고기와 곁들이기 좋아요.', storeStory: '홍천 제철 재료를 사용해 소량씩 담그는 반찬가게입니다.' },
        { id: 'hanwoo', name: '홍천 한우 불고기', shop: '중앙축산', price: 24500, unit: '500g', stock: 4, cutoff: '14:30', emoji: '🥩', bg: 'bg-[#F7D9D2]', signature: false, category: '정육', butlerNote: '마블링과 색을 확인했고 주문 후 바로 진공 포장합니다.', storeStory: '홍천 한우를 주문 단위로 손질하고 냉장 상태를 유지해 포장합니다.' },
        { id: 'honey', name: '홍천 아카시아꿀', shop: '산골양봉원', price: 18000, unit: '500g', stock: 13, cutoff: '17:00', emoji: '🍯', bg: 'bg-[#FFF0B8]', signature: false, category: '간식', butlerNote: '맑은 빛과 밀봉 상태를 확인했습니다. 선물 포장도 가능해요.', storeStory: '홍천 산자락에서 채밀한 아카시아꿀을 여과해 깨끗하게 병입합니다.' }
    ];

    public product: any = this.products[0];

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        const id = WizRoute.segment.id || 'hongchongtteok';
        this.product = this.products.find((item: any) => item.id === id) || this.products[0];
        await this.service.render();
    }

    public async changeQuantity(delta: number) {
        const next = this.quantity + delta;
        this.quantity = Math.max(1, Math.min(this.product.stock, next));
        await this.service.render();
    }

    public async toggleSubstitute() {
        this.substitute = !this.substitute;
        await this.service.render();
    }

    public async toggleFavorite() {
        this.favorite = !this.favorite;
        await this.service.render();
    }

    public async toggleVideo() {
        this.isPlaying = !this.isPlaying;
        await this.service.render();
    }

    public async selectInfo(type: string) {
        this.activeInfo = type;
        await this.service.render();
    }

    public mediaClass(type: string) {
        const base = 'flex h-16 items-center justify-center gap-2 rounded-2xl border text-xs font-extrabold transition';
        return this.activeInfo === type
            ? base + ' border-[#E96B2C] bg-[#FFF0DD] text-[#B6531E]'
            : base + ' border-[#E4D7CB] bg-[#FFFDF8] text-[#74665B] hover:bg-white';
    }

    public async addToCart(goCart: boolean) {
        let cart: any[] = [];
        try {
            cart = JSON.parse(localStorage.getItem('market-cart') || '[]');
        } catch (e) {
            cart = [];
        }

        const found = cart.find((item: any) => item.id === this.product.id);
        if (found) {
            found.quantity += this.quantity;
            found.substitute = this.substitute;
        } else {
            cart.push({ ...this.product, quantity: this.quantity, substitute: this.substitute });
        }

        localStorage.setItem('market-cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('market-cart-updated'));

        if (goCart) {
            this.service.href('/cart');
            return;
        }

        await this.service.modal.success(this.product.name + '을(를) 장바구니에 담았습니다.');
        await this.service.render();
    }
}
