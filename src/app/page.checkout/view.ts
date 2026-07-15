import { OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit, OnDestroy {
    public step: number = 1;
    public routerSub: any;
    public cartItems: any[] = [];
    public deliveryMethod: string = 'delivery';
    public pickupSlot: string = '오늘 16:00 ~ 17:00';
    public selectedCouponId: string = 'welcome';
    public usePoints: boolean = false;
    public paymentMethod: string = 'onnuri';
    public rememberDelivery: boolean = true;
    public processing: boolean = false;

    public delivery: any = {
        name: '',
        mobile: '',
        address: '',
        memo: ''
    };

    public coupons: any[] = [
        {
            id: 'welcome',
            title: '첫 주문 3,000원 할인',
            description: '홍천장날 첫 주문 전용 쿠폰',
            amount: 3000,
            minOrder: 0,
            badge: '추천'
        },
        {
            id: 'market-day',
            title: '장날 10% 할인',
            description: '상품 30,000원 이상 · 최대 5,000원',
            rate: 0.1,
            maxDiscount: 5000,
            minOrder: 30000,
            badge: '최대 혜택'
        },
        {
            id: 'none',
            title: '쿠폰을 사용하지 않음',
            description: '다른 혜택만 적용할게요.',
            amount: 0,
            minOrder: 0,
            badge: ''
        }
    ];

    public paymentMethods: any[] = [
        { id: 'onnuri', label: '모바일 온누리상품권', description: '상품권 충전 · 결제 API 연동 예정', icon: '온', badge: '혜택 결제', prototype: true },
        { id: 'hongcheon', label: '홍천사랑상품권', description: '홍천 지역상품권 결제 연동 예정', icon: '홍', badge: '지역 혜택', prototype: true },
        { id: 'card', label: '신용 · 체크카드', description: '등록 카드 또는 새 카드', icon: '💳' },
        { id: 'easy', label: '간편결제', description: '카카오페이 · 네이버페이', icon: 'P' },
        { id: 'bank', label: '계좌이체', description: '실시간 계좌이체', icon: '🏦' }
    ];

    constructor(public service: Service, public router: Router) { }

    public async ngOnInit() {
        await this.service.init();
        this.loadCart();

        if (this.cartItems.length === 0) {
            this.service.href('/cart');
            return;
        }

        this.loadDeliveryProfile();
        this.loadDraft();
        if (!this.couponAvailable(this.selectedCoupon)) {
            this.selectedCouponId = 'welcome';
        }
        this.syncStep();

        this.routerSub = this.router.events.subscribe(async (event: any) => {
            if (event instanceof NavigationEnd && location.pathname.indexOf('/checkout') === 0) {
                this.syncStep();
                await this.service.render();
                this.scrollToTop();
            }
        });

        await this.service.render();
    }

    public ngOnDestroy() {
        if (this.routerSub) this.routerSub.unsubscribe();
    }

    public syncStep() {
        const routeStep = String(WizRoute.segment.step || location.pathname.split('/')[2] || '1');
        this.step = routeStep === '2' ? 2 : 1;
    }

    public loadCart() {
        try {
            this.cartItems = JSON.parse(localStorage.getItem('market-cart') || '[]');
        } catch (e) {
            this.cartItems = [];
        }
    }

    public loadDeliveryProfile() {
        try {
            const saved = JSON.parse(localStorage.getItem('market-delivery') || '{}');
            this.delivery = { ...this.delivery, ...saved };
        } catch (e) { }
    }

    public loadDraft() {
        try {
            const draft = JSON.parse(localStorage.getItem('market-checkout') || '{}');
            if (draft.delivery) this.delivery = { ...this.delivery, ...draft.delivery };
            if (draft.deliveryMethod) this.deliveryMethod = draft.deliveryMethod;
            if (draft.pickupSlot) this.pickupSlot = draft.pickupSlot;
            if (draft.selectedCouponId) this.selectedCouponId = draft.selectedCouponId;
            if (typeof draft.usePoints === 'boolean') this.usePoints = draft.usePoints;
            if (draft.paymentMethod) this.paymentMethod = draft.paymentMethod;
            if (typeof draft.rememberDelivery === 'boolean') this.rememberDelivery = draft.rememberDelivery;
        } catch (e) { }
    }

    public saveDraft() {
        const draft = {
            delivery: this.delivery,
            deliveryMethod: this.deliveryMethod,
            pickupSlot: this.pickupSlot,
            selectedCouponId: this.selectedCouponId,
            usePoints: this.usePoints,
            paymentMethod: this.paymentMethod,
            rememberDelivery: this.rememberDelivery
        };
        localStorage.setItem('market-checkout', JSON.stringify(draft));
    }

    public get itemCount() {
        return this.cartItems.reduce((sum: number, item: any) => {
            return sum + Number(item.quantity || 0);
        }, 0);
    }

    public get subtotal() {
        return this.cartItems.reduce((sum: number, item: any) => {
            return sum + Number(item.price || 0) * Number(item.quantity || 0);
        }, 0);
    }

    public get shippingFee() {
        return this.deliveryMethod === 'delivery' && this.cartItems.length > 0 ? 3500 : 0;
    }

    public couponAvailable(coupon: any) {
        return this.subtotal >= Number(coupon.minOrder || 0);
    }

    public couponAmount(coupon: any) {
        if (!coupon || !this.couponAvailable(coupon)) return 0;
        if (coupon.rate) {
            return Math.min(
                Math.floor(this.subtotal * Number(coupon.rate)),
                Number(coupon.maxDiscount || this.subtotal)
            );
        }
        return Math.min(Number(coupon.amount || 0), this.subtotal);
    }

    public get selectedCoupon() {
        return this.coupons.find((coupon: any) => coupon.id === this.selectedCouponId) || this.coupons[2];
    }

    public get selectedCouponLabel() {
        return this.selectedCoupon.title;
    }

    public get couponDiscount() {
        return this.couponAmount(this.selectedCoupon);
    }

    public get pointDiscount() {
        if (!this.usePoints) return 0;
        const payable = Math.max(0, this.subtotal + this.shippingFee - this.couponDiscount);
        return Math.min(1200, payable);
    }

    public get discountTotal() {
        return this.couponDiscount + this.pointDiscount;
    }

    public get total() {
        return Math.max(0, this.subtotal + this.shippingFee - this.discountTotal);
    }

    public get paymentLabel() {
        const selected = this.paymentMethods.find((method: any) => method.id === this.paymentMethod);
        return selected ? selected.label : '결제 수단';
    }

    public get selectedPayment() {
        return this.paymentMethods.find((method: any) => method.id === this.paymentMethod) || this.paymentMethods[0];
    }

    public get isPaymentPrototype() {
        return Boolean(this.selectedPayment?.prototype);
    }

    public get checkoutButtonLabel() {
        return this.isPaymentPrototype
            ? '상품권 결제 체험하기'
            : this.total.toLocaleString('ko-KR') + '원 결제하기';
    }

    public get deliveryTitle() {
        return this.deliveryMethod === 'pickup' ? '홍천중앙시장 픽업' : '집으로 배송';
    }

    public get deliveryDescription() {
        if (this.deliveryMethod === 'pickup') {
            return this.pickupSlot + ' · 마켓 버틀러 픽업 부스';
        }
        return this.delivery.address || '배송 주소를 입력해 주세요.';
    }

    public async selectDelivery(method: string) {
        this.deliveryMethod = method;
        this.saveDraft();
        await this.service.render();
    }

    public async selectCoupon(coupon: any) {
        if (!this.couponAvailable(coupon)) return;
        this.selectedCouponId = coupon.id;
        this.saveDraft();
        await this.service.render();
    }

    public async togglePoints() {
        this.usePoints = !this.usePoints;
        this.saveDraft();
        await this.service.render();
    }

    public async selectPayment(method: string) {
        this.paymentMethod = method;
        this.saveDraft();
        await this.service.render();
    }

    public async toggleRememberDelivery() {
        this.rememberDelivery = !this.rememberDelivery;
        this.saveDraft();
        await this.service.render();
    }

    public deliveryError() {
        if (this.deliveryMethod !== 'delivery') {
            if (!this.pickupSlot) {
                return { message: '희망 픽업 시간을 선택해 주세요.', field: 'pickup-slot' };
            }
            return null;
        }

        if (!String(this.delivery.name || '').trim()) {
            return { message: '받는 분 이름을 입력해 주세요.', field: 'delivery-name' };
        }

        const phone = String(this.delivery.mobile || '').replace(/[^0-9]/g, '');
        if (phone.length < 10 || phone.length > 11 || phone.indexOf('01') !== 0) {
            return { message: '받는 분 연락처를 정확히 입력해 주세요.', field: 'delivery-mobile' };
        }

        if (!String(this.delivery.address || '').trim()) {
            return { message: '배송 주소를 입력해 주세요.', field: 'delivery-address' };
        }

        return null;
    }

    public async showDeliveryError(error: any) {
        await this.service.modal.warning(error.message, false, '확인');
        setTimeout(() => {
            const field = document.getElementById(error.field) as HTMLElement;
            if (field) field.focus();
        }, 0);
    }

    public async goToPayment() {
        const error = this.deliveryError();
        if (error) {
            await this.showDeliveryError(error);
            return;
        }

        if (this.deliveryMethod === 'delivery' && this.rememberDelivery) {
            localStorage.setItem('market-delivery', JSON.stringify(this.delivery));
        }

        this.saveDraft();
        this.service.href('/checkout/2');
    }

    public goToDelivery() {
        this.saveDraft();
        this.service.href('/checkout/1');
    }

    public back() {
        if (this.step === 2) {
            this.goToDelivery();
            return;
        }
        this.service.href('/cart');
    }

    public scrollToTop() {
        const container = document.querySelector('.market-device-content') as HTMLElement;
        if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    }

    public async checkout() {
        if (this.processing || this.cartItems.length === 0) return;

        const error = this.deliveryError();
        if (error) {
            this.service.href('/checkout/1');
            await this.service.sleep(100);
            await this.showDeliveryError(error);
            return;
        }

        if (!this.paymentMethod) {
            await this.service.modal.warning('결제 수단을 선택해 주세요.', false, '확인');
            return;
        }

        const confirmed = await this.service.modal.show({
            title: this.isPaymentPrototype ? '상품권 결제 화면을 체험할까요?' : '결제를 진행할까요?',
            message: this.isPaymentPrototype
                ? this.paymentLabel + ' 연동 전 시연입니다. 실제 충전이나 결제 없이 주문 흐름만 확인합니다.'
                : this.paymentLabel + '로 ' + this.total.toLocaleString('ko-KR') + '원을 결제하고 주문을 접수합니다.',
            action: this.isPaymentPrototype ? '체험 계속' : '결제하기',
            cancel: '취소',
            status: 'success',
            actionBtn: 'success'
        });
        if (!confirmed) return;

        this.processing = true;
        await this.service.render();

        try {
            const now = new Date();
            const order = {
                id: 'HC' + String(Date.now()).slice(-8),
                created: now.toISOString(),
                status: 'received',
                statusLabel: '주문 접수',
                method: this.deliveryMethod,
                pickupSlot: this.pickupSlot,
                delivery: JSON.parse(JSON.stringify(this.delivery)),
                items: JSON.parse(JSON.stringify(this.cartItems)),
                subtotal: this.subtotal,
                shippingFee: this.shippingFee,
                discount: this.discountTotal,
                couponId: this.selectedCouponId,
                couponLabel: this.selectedCouponLabel,
                couponDiscount: this.couponDiscount,
                pointsUsed: this.pointDiscount,
                total: this.total,
                paymentMethod: this.paymentMethod,
                paymentLabel: this.paymentLabel,
                paymentStatus: 'paid',
                paymentMode: this.isPaymentPrototype ? 'prototype-local-voucher' : 'prototype-general',
                paidAt: now.toISOString(),
                butler: '김민서 버틀러'
            };

            let orders: any[] = [];
            try {
                orders = JSON.parse(localStorage.getItem('market-orders') || '[]');
            } catch (e) {
                orders = [];
            }

            orders.unshift(order);
            localStorage.setItem('market-orders', JSON.stringify(orders));
            localStorage.removeItem('market-cart');
            localStorage.removeItem('market-checkout');
            window.dispatchEvent(new Event('market-cart-updated'));
        } catch (e) {
            this.processing = false;
            await this.service.render();
            await this.service.modal.error('결제 정보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
            return;
        }

        await this.service.sleep(650);
        this.service.href('/orders?placed=1');
    }
}
