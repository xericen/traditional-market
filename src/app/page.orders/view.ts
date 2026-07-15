import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public orders: any[] = [];
    public selectedOrder: any = null;
    public showPlaced: boolean = false;

    public steps: any[] = [
        { key: 'received', label: '주문 접수', hint: '버틀러 배정' },
        { key: 'inspecting', label: '현장 검수', hint: '수량 · 상태 확인' },
        { key: 'ready', label: '준비 완료', hint: '포장 완료' },
        { key: 'completed', label: '배송 · 픽업', hint: '전달 완료' }
    ];

    public inspectionChecks: string[] = ['수량 확인', '신선도', '포장 상태', '누락 · 파손'];

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        this.showPlaced = new URLSearchParams(location.search).get('placed') === '1';
        this.loadOrders();
        await this.service.render();
    }

    public loadOrders() {
        try {
            this.orders = JSON.parse(localStorage.getItem('market-orders') || '[]');
        } catch (e) {
            this.orders = [];
        }

        if (this.orders.length === 0) {
            this.orders = [this.demoOrder()];
        }

        this.selectedOrder = this.orders[0];
    }

    public demoOrder() {
        return {
            id: 'HC24071001',
            created: '2026-07-10T09:18:00.000Z',
            status: 'inspecting',
            method: 'delivery',
            isDemo: true,
            butler: '김민서 버틀러',
            delivery: { address: '서울시 마포구 월드컵로 12' },
            items: [
                { id: 'olchaengi', name: '올챙이국수 밀키트', shop: '홍천손맛집', price: 15000, quantity: 2, emoji: '🍜', bg: 'bg-[#FFF3BF]' },
                { id: 'hongchongtteok', name: '홍총떡 5장', shop: '김명자 홍총떡', price: 12000, quantity: 1, emoji: '🥞', bg: 'bg-[#FFE6C9]' }
            ],
            subtotal: 42000,
            shippingFee: 3500,
            discount: 3000,
            total: 42500
        };
    }

    public currentStep() {
        if (!this.selectedOrder) return 0;
        const status = this.selectedOrder.status;
        if (status === 'received') return 0;
        if (status === 'inspecting' || status === 'substitute') return 1;
        if (status === 'ready' || status === 'shipped' || status === 'pickup_ready') return 2;
        if (status === 'completed') return 3;
        return 0;
    }

    public isStepDone(index: number) {
        return index < this.currentStep() || this.selectedOrder.status === 'completed';
    }

    public stepCircleClass(index: number) {
        if (index < this.currentStep() || this.selectedOrder.status === 'completed') {
            return 'border-[#2E7D32] bg-[#2E7D32] text-white';
        }
        if (index === this.currentStep()) {
            return 'border-[#2E7D32] bg-[#DFF3E2] text-[#2E7D32] shadow-[0_0_0_5px_rgba(46,125,50,0.10)]';
        }
        return 'border-[#D9CCC1] bg-[#FFFDF8] text-[#9A8D82]';
    }

    public progressWidth() {
        return (this.currentStep() / 3 * 75) + '%';
    }

    public inspectionDoneCount() {
        const step = this.currentStep();
        if (step === 0) return 0;
        if (step === 1) return 2;
        return 4;
    }

    public butlerMessage() {
        const status = this.selectedOrder.status;
        if (status === 'received') return '주문을 확인했어요. 곧 점포별로 상품을 모으러 갈게요.';
        if (status === 'inspecting') return '상품을 모아 수량과 신선도를 확인하고 있어요. 포장 전 결과를 알려드릴게요.';
        if (status === 'ready') return '모든 상품의 검수와 포장이 끝났어요. 전달 준비를 시작합니다.';
        if (status === 'completed') return '안전하게 전달을 마쳤습니다. 홍천시장의 맛있는 시간을 즐겨주세요.';
        return '버틀러가 주문을 확인하고 있습니다.';
    }

    public statusLabel(status: string) {
        const labels: any = {
            received: '주문 접수',
            inspecting: '마켓 버틀러 검수 중',
            substitute: '대체 승인 대기',
            ready: '준비 완료',
            shipped: '배송 중',
            pickup_ready: '픽업 대기',
            completed: '전달 완료',
            cancelled: '취소'
        };
        return labels[status] || status;
    }

    public statusClass(status: string) {
        const base = 'inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold';
        if (status === 'inspecting') return base + ' bg-[#DFF3E2] text-[#2E7D32]';
        if (status === 'ready' || status === 'pickup_ready') return base + ' bg-[#FFE6C9] text-[#A95625]';
        if (status === 'completed') return base + ' bg-[#E6F0FF] text-[#2D6CDF]';
        if (status === 'cancelled') return base + ' bg-[#F2ECE8] text-[#8A7D73]';
        return base + ' bg-[#FFF3BF] text-[#8A651A]';
    }

    public formatDate(value: string) {
        const date = new Date(value);
        return date.getFullYear() + '년 ' + (date.getMonth() + 1) + '월 ' + date.getDate() + '일 ' + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
    }

    public shortDate(value: string) {
        const date = new Date(value);
        return (date.getMonth() + 1) + '.' + date.getDate();
    }

    public itemCount(order: any) {
        return order.items.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0);
    }

    public async selectOrder(order: any) {
        this.selectedOrder = order;
        this.showPlaced = false;
        await this.service.render();
    }

    public async reorder() {
        let cart: any[] = [];
        try {
            cart = JSON.parse(localStorage.getItem('market-cart') || '[]');
        } catch (e) {
            cart = [];
        }

        for (const item of this.selectedOrder.items) {
            const found = cart.find((row: any) => row.id === item.id);
            if (found) found.quantity += item.quantity;
            else cart.push({ ...item, substitute: true });
        }

        localStorage.setItem('market-cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('market-cart-updated'));
        this.service.href('/cart');
    }

    public async contactButler() {
        await this.service.modal.show({
            title: '버틀러에게 문의',
            message: '주문번호 ' + this.selectedOrder.id + '로 문의가 접수되었습니다. 확인 후 연락드릴게요.',
            action: '확인',
            cancel: false,
            status: 'success',
            actionBtn: 'success'
        });
    }

    public async cancelOrder() {
        const confirmed = await this.service.modal.show({
            title: '주문을 취소할까요?',
            message: '현장 검수가 시작되기 전까지만 바로 취소할 수 있습니다.',
            action: '주문 취소',
            cancel: '계속 진행',
            status: 'warning',
            actionBtn: 'warning'
        });
        if (!confirmed) return;

        this.selectedOrder.status = 'cancelled';
        const stored = this.orders.filter((order: any) => !order.isDemo);
        localStorage.setItem('market-orders', JSON.stringify(stored));
        await this.service.render();
    }
}
