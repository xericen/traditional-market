import { OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit, OnDestroy {
    public tab: string = 'overview';
    public routerSub: any;
    public todayLabel: string = '';
    public orderSearch: string = '';

    public allTabs: any[] = [
        { key: 'overview', label: '판매 통계', icon: '📊', permission: 'sales.statistics.view' },
        { key: 'products', label: '상품 · 재고', icon: '🧺', anyPermissions: ['products.create', 'inventory.update'] },
        { key: 'orders', label: '주문 조회', icon: '🔔', permission: 'orders.view', badge: 3 },
        { key: 'inspection', label: '검수 · 고객응대', icon: '✅', permission: 'orders.shipping.update', badge: 2 },
        { key: 'dispatch', label: '배송 상태', icon: '🚚', permission: 'orders.shipping.update', badge: 2 }
    ];
    public tabs: any[] = [];

    public operatorScopes: any[] = [
        { title: '오전 현장 운영', text: '점포 순회 · 재고 확인 · 상품 촬영', icon: '🏪' },
        { title: '온라인 판매 운영', text: '상품 등록 · 가격 수정 · 품절 처리', icon: '🧺' },
        { title: '주문 이행 운영', text: '주문 확인 · 검수 증빙 · 포장 · 배송 인계', icon: '📦' }
    ];

    public stats: any[] = [
        { label: '오전 점포 순회', value: '12 / 16', note: '재고 확인 4곳 남음', icon: '🏪', bg: 'bg-[#EDF6EB]', tone: 'text-[#2E7D32]' },
        { label: '판매 상품 운영', value: 28, note: '가격 수정 2 · 품절 2', icon: '🧺', bg: 'bg-[#FFF3BF]', tone: 'text-[#A0731D]' },
        { label: '확인할 주문', value: 7, note: '신규 3 · 수거 중 4', icon: '🔔', bg: 'bg-[#FFE6C9]', tone: 'text-[#A95625]' },
        { label: '검수 · 배송 인계', value: 7, note: '검수 4 · 인계 3', icon: '🚚', bg: 'bg-[#E6F0FF]', tone: 'text-[#2D6CDF]' }
    ];

    public operationStages: any[] = [
        { key: 'products', title: '오전 점포 순회', text: '재고 · 가격 · 판매 가능 여부 확인', icon: '🏪', bg: 'bg-[#EDF6EB]' },
        { key: 'products', title: '사진 · 숏폼 촬영', text: '상품 사진 · 10~20초 현장 영상', icon: '🎥', bg: 'bg-[#E7F3F1]' },
        { key: 'products', title: '상품 판매 운영', text: '등록 · 가격 수정 · 품절 처리', icon: '🧺', bg: 'bg-[#FFF3BF]' },
        { key: 'orders', title: '주문 확인 · 수거', text: '신규 주문 확인 · 점포별 상품 수거', icon: '🔔', bg: 'bg-[#FFEFD4]' },
        { key: 'inspection', title: '품질 검수 · 포장', text: '검수 증빙 업로드 · 안전 포장', icon: '✅', bg: 'bg-[#FFE6C9]' },
        { key: 'dispatch', title: '배달업체 인계', text: '외부 배송 파트너 전달 · 고객 알림', icon: '🚚', bg: 'bg-[#E6F0FF]' }
    ];

    public tasks: any[] = [
        { title: '오전 점포 순회 4곳 남음', meta: '재고 · 가격 · 판매 여부 확인', icon: '🏪', bg: 'bg-[#EDF6EB]', tab: 'products' },
        { title: '한우 불고기 가격 · 재고 수정', meta: '마감 14:30 · 4개 남음', icon: '🥩', bg: 'bg-[#F7D9D2]', tab: 'products' },
        { title: '신규 주문 HC24071007 확인', meta: '2분 전 · 2개 점포 수거', icon: '🔔', bg: 'bg-[#FFF3BF]', tab: 'orders' },
        { title: 'HC24071001 검수 증빙 업로드', meta: '사진 또는 10~20초 영상', icon: '📷', bg: 'bg-[#FFE6C9]', tab: 'inspection' },
        { title: '배송 주문 2건 배달업체 인계', meta: '포장 완료 · 파트너 배정 대기', icon: '🚚', bg: 'bg-[#E6F0FF]', tab: 'dispatch' }
    ];

    public morningRounds: any[] = [
        { shop: '김명자 홍총떡', zone: '나동 04호', note: '재고 · 가격 · 상품 사진 · 숏폼 확인', done: true, checkedAt: '08:42' },
        { shop: '홍천손맛집', zone: '먹거리골목 03호', note: '재고 · 가격 · 상품 사진 · 숏폼 확인', done: true, checkedAt: '09:05' },
        { shop: '봉숙이네 채소', zone: '가동 07호', note: '재고 · 가격 · 상품 사진 · 숏폼 확인', done: false, checkedAt: '' },
        { shop: '중앙축산', zone: '가동 12호', note: '재고 · 가격 · 상품 사진 · 숏폼 확인', done: false, checkedAt: '' }
    ];

    public productForm: any = {
        shop: '김명자 홍총떡',
        category: '전·떡',
        name: '',
        price: null,
        unit: '1팩',
        stock: null,
        cutoff: '16:00',
        photo: false,
        video: false
    };

    public adminProducts: any[] = [
        { name: '홍총떡 5장', shop: '김명자 홍총떡', category: '전·떡', price: 12000, stock: 14, cutoff: '16:00', emoji: '🥞', bg: 'bg-[#FFE6C9]', visible: true },
        { name: '올챙이국수 밀키트', shop: '홍천손맛집', category: '국수', price: 15000, stock: 9, cutoff: '15:30', emoji: '🍜', bg: 'bg-[#FFF3BF]', visible: true },
        { name: '오늘의 산나물 꾸러미', shop: '봉숙이네 채소', category: '채소', price: 8900, stock: 21, cutoff: '17:00', emoji: '🥬', bg: 'bg-[#DFF3E2]', visible: true },
        { name: '홍천 한우 불고기', shop: '중앙축산', category: '정육', price: 24500, stock: 4, cutoff: '14:30', emoji: '🥩', bg: 'bg-[#F7D9D2]', visible: true }
    ];

    public orderInbox: any[] = [
        {
            id: 'HC24071007', customer: '박서준', mobile: '010-2451-8890', time: '10:24', statusLabel: '신규',
            summary: '홍천시장 시그니처 상자 외 1개', total: 51000, method: 'delivery', itemCount: 2,
            request: '부모님께 보내는 선물입니다. 포장 상태를 잘 확인해 주세요.',
            groups: [
                { shop: '홍천중앙시장 상인회', zone: '가동 12호', items: [{ name: '홍천시장 시그니처 상자', price: 39000, quantity: 1, emoji: '🎁', bg: 'bg-[#F5DFCF]' }] },
                { shop: '김명자 홍총떡', zone: '나동 04호', items: [{ name: '홍총떡 5장', price: 12000, quantity: 1, emoji: '🥞', bg: 'bg-[#FFE6C9]' }] }
            ]
        },
        {
            id: 'HC24071006', customer: '이선영', mobile: '010-9912-4402', time: '10:09', statusLabel: '신규',
            summary: '올챙이국수 밀키트 2개', total: 30000, method: 'pickup', itemCount: 2,
            request: '17시 이후에 찾으러 갈게요.',
            groups: [{ shop: '홍천손맛집', zone: '먹거리골목 03호', items: [{ name: '올챙이국수 밀키트', price: 15000, quantity: 2, emoji: '🍜', bg: 'bg-[#FFF3BF]' }] }]
        },
        {
            id: 'HC24071005', customer: '김하늘', mobile: '010-7440-1030', time: '09:51', statusLabel: '대체 확인',
            summary: '산나물 꾸러미 외 2개', total: 28700, method: 'delivery', itemCount: 4,
            groups: [
                { shop: '봉숙이네 채소', zone: '가동 07호', items: [{ name: '오늘의 산나물 꾸러미', price: 8900, quantity: 1, emoji: '🥬', bg: 'bg-[#DFF3E2]' }] },
                { shop: '홍천댁 반찬', zone: '나동 09호', items: [{ name: '산마늘 장아찌', price: 7900, quantity: 2, emoji: '🥢', bg: 'bg-[#E8F1D7]' }] }
            ]
        }
    ];

    public selectedAdminOrder: any = this.orderInbox[0];

    public inspectionItems: any[] = [
        { key: 'quantity', label: '수량 확인', hint: '주문 수량과 실제 수거 수량이 같은가요?', icon: '🔢' },
        { key: 'freshness', label: '신선도 · 상태', hint: '변색, 무름, 이상 냄새가 없는가요?', icon: '🌱' },
        { key: 'damage', label: '누락 · 파손', hint: '누락, 파손 또는 대체 내역을 모두 기록했나요?', icon: '🔎' }
    ];
    public inspection: any = { quantity: false, freshness: false, damage: false };
    public inspectionNote: string = '';
    public customerMessage: string = '상품 수량과 상태를 확인 중입니다. 포장이 끝나면 바로 알려드릴게요.';
    public proofAdded: boolean = false;
    public packagingItems: any[] = [
        { key: 'sealing', label: '상품별 밀봉 · 완충', hint: '누수와 파손을 막도록 상품별 포장을 마쳤나요?' },
        { key: 'temperature', label: '온도대별 분리', hint: '상온·냉장 상품을 배송 기준에 맞게 분리했나요?' },
        { key: 'label', label: '주문표 · 배송정보 부착', hint: '주문번호와 받는 사람 정보를 마지막으로 대조했나요?' }
    ];
    public packaging: any = { sealing: false, temperature: false, label: false };

    public dispatchOrders: any[] = [
        { id: 'HC24071003', customer: '정유진', summary: '홍총떡 외 2개', method: 'delivery', readyTime: '10:12', driver: '', tracking: '', handoffAt: '', done: false },
        { id: 'HC24071002', customer: '최민규', summary: '올챙이국수 밀키트 2개', method: 'pickup', readyTime: '09:58', pickupSlot: '오늘 16:00 ~ 17:00', locker: 'A-04', handoffAt: '', done: false }
    ];

    constructor(public service: Service, public router: Router) { }

    public async ngOnInit() {
        await this.service.init();
        this.tabs = this.allTabs.filter((item: any) => this.canAccessTab(item));
        if (this.tabs.length === 0) {
            this.service.href('/access/login');
            return;
        }
        const now = new Date();
        this.todayLabel = now.getFullYear() + '.' + String(now.getMonth() + 1).padStart(2, '0') + '.' + String(now.getDate()).padStart(2, '0');
        this.loadOrderWorkflow(this.selectedAdminOrder);
        this.syncTab();

        this.routerSub = this.router.events.subscribe(async (event: any) => {
            if (event instanceof NavigationEnd) {
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
        const next = WizRoute.segment.tab || location.pathname.split('/')[2] || 'overview';
        const valid = this.tabs.some((item: any) => item.key === next);
        this.tab = valid ? next : this.tabs[0].key;
        if (!valid && next !== this.tab) this.service.href('/admin/' + this.tab);
    }

    public goTab(tab: string) {
        if (!this.tabs.some((item: any) => item.key === tab)) return;
        this.service.href('/admin/' + tab);
    }

    public hasPermission(permission: string) {
        return (this.service.auth.session?.permissions || []).indexOf(permission) >= 0;
    }

    public canAccessTab(item: any) {
        if (item.permission) return this.hasPermission(item.permission);
        return (item.anyPermissions || []).some((permission: string) => this.hasPermission(permission));
    }

    public roleLabel() {
        return this.service.auth.session?.roleLabel || '관리자';
    }

    public async requirePermission(permission: string) {
        if (this.hasPermission(permission)) return true;
        await this.service.modal.warning('현재 역할에는 이 작업을 수행할 권한이 없습니다.', false, '확인');
        return false;
    }

    public tabClass(key: string) {
        const base = 'inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-xs font-extrabold transition';
        return this.tab === key
            ? base + ' bg-[#DFF3E2] text-[#2E7D32]'
            : base + ' text-[#657463] hover:bg-[#EEF4EC] hover:text-[#334A32]';
    }

    public currentTimeLabel() {
        const now = new Date();
        return String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    }

    public loadOrderWorkflow(order: any) {
        if (!order) return;
        if (!order.workflow) {
            order.workflow = {
                inspection: { quantity: false, freshness: false, damage: false },
                inspectionNote: '',
                customerMessage: '상품 수량과 상태를 확인 중입니다. 포장이 끝나면 바로 알려드릴게요.',
                proofAdded: false,
                packaging: { sealing: false, temperature: false, label: false },
                completed: false
            };
        }
        this.inspection = order.workflow.inspection;
        this.inspectionNote = order.workflow.inspectionNote;
        this.customerMessage = order.workflow.customerMessage;
        this.proofAdded = order.workflow.proofAdded;
        this.packaging = order.workflow.packaging;
    }

    public saveOrderWorkflow() {
        if (!this.selectedAdminOrder) return;
        if (!this.selectedAdminOrder.workflow) this.loadOrderWorkflow(this.selectedAdminOrder);
        this.selectedAdminOrder.workflow.inspection = this.inspection;
        this.selectedAdminOrder.workflow.inspectionNote = this.inspectionNote;
        this.selectedAdminOrder.workflow.customerMessage = this.customerMessage;
        this.selectedAdminOrder.workflow.proofAdded = this.proofAdded;
        this.selectedAdminOrder.workflow.packaging = this.packaging;
    }

    public morningRoundsDone() {
        return this.morningRounds.filter((round: any) => round.done).length;
    }

    public async toggleMorningRound(round: any) {
        if (!(await this.requirePermission('products.update'))) return;
        round.done = !round.done;
        if (round.done) {
            const now = new Date();
            round.checkedAt = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        } else {
            round.checkedAt = '';
        }
        await this.service.render();
    }

    public async simulateMedia(type: string) {
        const permission = type === 'video' ? 'content.shorts.create' : 'products.create';
        if (!(await this.requirePermission(permission))) return;
        this.productForm[type] = true;
        await this.service.render();
    }

    public async saveProduct() {
        if (!(await this.requirePermission('products.create'))) return;
        const price = Number(this.productForm.price);
        const stock = Number(this.productForm.stock);
        if (!this.productForm.name || price <= 0 || this.productForm.stock === null || stock < 0) {
            await this.service.modal.warning('상품명, 가격, 오늘 재고를 입력해 주세요.', false, '확인');
            return;
        }
        if (!this.productForm.photo || !this.productForm.video) {
            await this.service.modal.warning('상품 사진과 10~20초 숏폼 영상을 모두 등록해 주세요.', false, '확인');
            return;
        }

        const icons: any = { '전·떡': '🥞', '국수': '🍜', '채소': '🥬', '반찬': '🥢', '정육': '🥩' };
        this.adminProducts.unshift({
            name: this.productForm.name,
            shop: this.productForm.shop,
            category: this.productForm.category,
            price: price,
            stock: stock,
            cutoff: this.productForm.cutoff,
            emoji: icons[this.productForm.category] || '🧺',
            bg: 'bg-[#EDF6EB]',
            visible: stock > 0,
            updatedAt: '방금'
        });

        await this.service.modal.success('오늘 상품으로 등록되었습니다.');
        this.productForm.name = '';
        this.productForm.price = null;
        this.productForm.stock = null;
        this.productForm.photo = false;
        this.productForm.video = false;
        await this.service.render();
    }

    public activeProductCount() {
        return this.adminProducts.filter((item: any) => item.visible).length;
    }

    public async saveProductUpdate(product: any) {
        if (!(await this.requirePermission('products.price.update'))) return;
        if (!(await this.requirePermission('inventory.update'))) return;
        const price = Number(product.price);
        const stock = Number(product.stock);
        if (price <= 0 || stock < 0) {
            await this.service.modal.warning('판매가는 0원보다 크게, 재고는 0개 이상으로 입력해 주세요.', false, '확인');
            return;
        }
        product.price = price;
        product.stock = stock;
        product.visible = stock > 0;
        product.updatedAt = '방금';
        await this.service.modal.success(product.name + '의 가격·재고와 판매 상태를 반영했습니다.');
        await this.service.render();
    }

    public async saveStockUpdate(product: any) {
        if (!(await this.requirePermission('inventory.update'))) return;
        const stock = Number(product.stock);
        if (stock < 0) {
            await this.service.modal.warning('재고는 0개 이상으로 입력해 주세요.', false, '확인');
            return;
        }
        product.stock = stock;
        product.visible = stock > 0;
        product.updatedAt = '방금';
        await this.service.modal.success(product.name + '의 재고를 반영했습니다.');
        await this.service.render();
    }

    public async markProductSoldOut(product: any) {
        if (!(await this.requirePermission('inventory.update'))) return;
        const confirmed = await this.service.modal.show({
            title: '품절 처리',
            message: product.name + '의 재고를 0개로 바꾸고 소비자 화면에서 즉시 숨깁니다.',
            action: '품절 처리',
            cancel: '취소',
            status: 'warning',
            actionBtn: 'warning'
        });
        if (!confirmed) return;
        product.stock = 0;
        product.visible = false;
        product.updatedAt = '방금';
        await this.service.render();
    }

    public visibleOrders() {
        const keyword = this.orderSearch.trim().toLowerCase();
        if (!keyword) return this.orderInbox;
        return this.orderInbox.filter((order: any) =>
            order.id.toLowerCase().indexOf(keyword) >= 0
            || order.customer.toLowerCase().indexOf(keyword) >= 0
        );
    }

    public async selectAdminOrder(order: any) {
        this.saveOrderWorkflow();
        this.selectedAdminOrder = order;
        this.loadOrderWorkflow(order);
        await this.service.render();
    }

    public async acceptOrder() {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        if (this.selectedAdminOrder.accepted) return;
        this.selectedAdminOrder.accepted = true;
        this.selectedAdminOrder.statusLabel = '수거 중';
        await this.service.modal.success(this.selectedAdminOrder.id + ' 주문을 확인했습니다. 점포별 상품 수거를 시작합니다.');
        await this.service.render();
    }

    public collectedGroupCount() {
        if (!this.selectedAdminOrder) return 0;
        return this.selectedAdminOrder.groups.filter((group: any) => group.collected).length;
    }

    public orderReadyForInspection() {
        if (!this.selectedAdminOrder || !this.selectedAdminOrder.accepted) return false;
        return this.selectedAdminOrder.groups.every((group: any) =>
            group.collected && (!group.soldOut || group.substituteApproved)
        );
    }

    public async toggleCollection(group: any) {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        if (!this.selectedAdminOrder.accepted) {
            await this.service.modal.warning('먼저 주문을 확인하고 수거를 시작해 주세요.', false, '확인');
            return;
        }
        if (group.soldOut && !group.substituteApproved) {
            await this.service.modal.warning('품절 상품의 대체 제안과 고객 승인을 먼저 완료해 주세요.', false, '확인');
            return;
        }
        group.collected = !group.collected;
        this.selectedAdminOrder.statusLabel = this.orderReadyForInspection() ? '수거 완료' : '수거 중';
        await this.service.render();
    }

    public async markGroupSoldOut(group: any) {
        if (!(await this.requirePermission('inventory.update'))) return;
        if (!this.selectedAdminOrder.accepted) {
            await this.service.modal.warning('먼저 주문을 확인하고 수거를 시작해 주세요.', false, '확인');
            return;
        }
        const confirmed = await this.service.modal.show({
            title: '품절 상품 반영',
            message: group.shop + '의 주문 상품을 품절로 기록하고 판매 목록에서도 숨깁니다.',
            action: '품절 반영',
            cancel: '취소',
            status: 'warning',
            actionBtn: 'warning'
        });
        if (!confirmed) return;

        group.soldOut = true;
        group.collected = false;
        group.substituteRequested = false;
        group.substituteApproved = false;
        group.items.forEach((item: any) => {
            const product = this.adminProducts.find((candidate: any) => candidate.name === item.name);
            if (product) {
                product.stock = 0;
                product.visible = false;
                product.updatedAt = '방금';
            }
        });
        this.selectedAdminOrder.statusLabel = '대체 확인';
        await this.service.render();
    }

    public async proposeSubstitute(group: any) {
        if (!(await this.requirePermission('inquiries.reply'))) return;
        if (!group.soldOut) {
            await this.service.modal.warning('먼저 품절 상품을 반영한 뒤 대체상품을 제안해 주세요.', false, '확인');
            return;
        }
        if (group.substituteRequested && !group.substituteApproved) {
            const approved = await this.service.modal.show({
                title: '고객 승인 반영',
                message: group.shop + '의 대체상품을 고객이 승인한 것으로 기록합니다.',
                action: '승인 완료',
                cancel: '취소',
                status: 'success',
                actionBtn: 'success'
            });
            if (!approved) return;
            group.substituteApproved = true;
            this.selectedAdminOrder.statusLabel = '수거 중';
            await this.service.render();
            return;
        }
        const confirmed = await this.service.modal.show({
            title: '대체상품 제안',
            message: group.shop + '의 비슷한 상품을 촬영해 고객에게 승인 요청을 보냅니다.',
            action: '제안 보내기',
            cancel: '취소',
            status: 'warning',
            actionBtn: 'warning'
        });
        if (!confirmed) return;
        group.substituteRequested = true;
        this.selectedAdminOrder.statusLabel = '대체 승인 대기';
        await this.service.render();
    }

    public async startInspection() {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        if (!this.orderReadyForInspection()) {
            await this.service.modal.warning('모든 점포의 상품 수거를 완료한 뒤 검수를 시작해 주세요.', false, '확인');
            return;
        }
        this.selectedAdminOrder.statusLabel = '검수 중';
        this.loadOrderWorkflow(this.selectedAdminOrder);
        this.service.href('/admin/inspection');
    }

    public async sendMessage() {
        if (!(await this.requirePermission('inquiries.reply'))) return;
        await this.service.modal.success('고객 안내 메시지 화면을 열었습니다.');
    }

    public async toggleInspection(key: string) {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        this.inspection[key] = !this.inspection[key];
        await this.service.render();
    }

    public inspectionDone() {
        return this.inspectionItems.filter((item: any) => this.inspection[item.key]).length;
    }

    public inspectionProgress() {
        return Math.round(this.inspectionDone() / this.inspectionItems.length * 100);
    }

    public async togglePackaging(key: string) {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        this.packaging[key] = !this.packaging[key];
        await this.service.render();
    }

    public packagingDone() {
        return this.packagingItems.filter((item: any) => this.packaging[item.key]).length;
    }

    public preparationProgress() {
        const done = this.inspectionDone() + this.packagingDone() + (this.proofAdded ? 1 : 0);
        const total = this.inspectionItems.length + this.packagingItems.length + 1;
        return Math.round(done / total * 100);
    }

    public async addProof() {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        this.proofAdded = true;
        this.selectedAdminOrder.workflow.proofAdded = true;
        await this.service.render();
    }

    public async completeInspection() {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        if (!this.orderReadyForInspection()) {
            await this.service.modal.warning('주문 확인과 모든 점포의 상품 수거를 먼저 완료해 주세요.', false, '확인');
            return;
        }
        if (this.inspectionDone() < this.inspectionItems.length) {
            await this.service.modal.warning('검수 체크리스트를 모두 확인해 주세요.', false, '확인');
            return;
        }
        if (!this.proofAdded) {
            await this.service.modal.warning('고객에게 전달할 검수 사진 또는 영상을 등록해 주세요.', false, '확인');
            return;
        }
        if (this.packagingDone() < this.packagingItems.length) {
            await this.service.modal.warning('포장 체크리스트를 모두 완료해 주세요.', false, '확인');
            return;
        }

        this.saveOrderWorkflow();
        this.selectedAdminOrder.workflow.completed = true;
        this.selectedAdminOrder.statusLabel = '배송 인계 대기';
        const readyTime = this.currentTimeLabel();
        const existingDispatch = this.dispatchOrders.find((order: any) => order.id === this.selectedAdminOrder.id);
        if (existingDispatch) {
            existingDispatch.readyTime = readyTime;
            existingDispatch.done = false;
        } else {
            this.dispatchOrders.unshift({
                id: this.selectedAdminOrder.id,
                customer: this.selectedAdminOrder.customer,
                summary: this.selectedAdminOrder.summary,
                method: this.selectedAdminOrder.method,
                readyTime: readyTime,
                driver: '',
                tracking: '',
                pickupSlot: '오늘 16:00 ~ 17:00',
                locker: 'A-01',
                handoffAt: '',
                done: false
            });
        }
        await this.service.modal.success('품질 검수와 증빙 업로드, 포장을 완료했습니다. 배송 인계 대기로 전환합니다.');
        this.service.href('/admin/dispatch');
    }

    public async notifyCustomer(order: any) {
        if (!(await this.requirePermission('inquiries.reply'))) return;
        await this.service.modal.success(order.id + ' 고객에게 준비 상태 알림을 보냈습니다.');
    }

    public async completeDispatch(order: any) {
        if (!(await this.requirePermission('orders.shipping.update'))) return;
        if (order.method === 'delivery' && !order.driver) {
            await this.service.modal.warning('연계할 외부 배송 파트너를 먼저 선택해 주세요.', false, '확인');
            return;
        }
        if (order.method === 'delivery' && !order.tracking.trim()) {
            await this.service.modal.warning('외부 접수번호 또는 배달업체 인계 메모를 입력해 주세요.', false, '확인');
            return;
        }
        order.done = true;
        order.handoffAt = this.currentTimeLabel();
        const sourceOrder = this.orderInbox.find((item: any) => item.id === order.id);
        if (sourceOrder) {
            sourceOrder.statusLabel = order.method === 'pickup' ? '픽업 대기' : '배달업체 인계 완료';
            sourceOrder.handoffAt = order.handoffAt;
        }
        await this.service.modal.success(order.method === 'pickup' ? '픽업 대기로 전환했습니다.' : '배달업체 인계를 완료하고 고객에게 알렸습니다.');
        await this.service.render();
    }
}
