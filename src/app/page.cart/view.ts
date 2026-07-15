import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public cartItems: any[] = [];

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        this.loadCart();
        await this.service.render();
    }

    public loadCart() {
        try {
            this.cartItems = JSON.parse(localStorage.getItem('market-cart') || '[]');
        } catch (e) {
            this.cartItems = [];
        }
    }

    public saveCart() {
        localStorage.setItem('market-cart', JSON.stringify(this.cartItems));
        window.dispatchEvent(new Event('market-cart-updated'));
    }

    public get cartCount() {
        return this.cartItems.reduce((sum: number, item: any) => {
            return sum + Number(item.quantity || 0);
        }, 0);
    }

    public get shopCount() {
        const shops = this.cartItems
            .map((item: any) => item.shop)
            .filter((shop: string) => Boolean(shop));
        return new Set(shops).size;
    }

    public get subtotal() {
        return this.cartItems.reduce((sum: number, item: any) => {
            return sum + Number(item.price || 0) * Number(item.quantity || 0);
        }, 0);
    }

    public async changeQuantity(item: any, delta: number) {
        const current = Number(item.quantity || 1);
        const stock = Number(item.stock || 99);
        item.quantity = Math.max(1, Math.min(stock, current + delta));
        this.saveCart();
        await this.service.render();
    }

    public async toggleSubstitute(item: any) {
        item.substitute = !item.substitute;
        this.saveCart();
        await this.service.render();
    }

    public async removeItem(item: any) {
        const confirmed = await this.service.modal.show({
            title: '상품을 뺄까요?',
            message: item.name + '을(를) 장바구니에서 삭제합니다.',
            action: '삭제',
            cancel: '취소',
            status: 'warning',
            actionBtn: 'warning'
        });
        if (!confirmed) return;

        this.cartItems = this.cartItems.filter((row: any) => row.id !== item.id);
        this.saveCart();
        await this.service.render();
    }

    public async clearCart() {
        const confirmed = await this.service.modal.show({
            title: '장바구니를 비울까요?',
            message: '담아둔 모든 상품이 삭제됩니다.',
            action: '전체 삭제',
            cancel: '취소',
            status: 'warning',
            actionBtn: 'warning'
        });
        if (!confirmed) return;

        this.cartItems = [];
        this.saveCart();
        await this.service.render();
    }

    public startCheckout() {
        if (this.cartItems.length === 0) return;
        this.service.href('/checkout/1');
    }
}
