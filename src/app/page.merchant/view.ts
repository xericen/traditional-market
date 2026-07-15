import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public todayLabel: string = '';

    public salesBreakdown: any[] = [
        {
            name: '홍총떡 5장',
            quantity: 3,
            unit: '팩',
            amount: 36000,
            emoji: '🥞',
            bg: 'bg-[#FFE6C9]'
        }
    ];

    public paymentBreakdown: any[] = [
        { label: '모바일 상품권', amount: 24000 },
        { label: '카드·간편결제', amount: 12000 }
    ];

    public merchantProducts: any[] = [
        {
            name: '홍총떡 5장',
            category: '전·떡',
            price: 12000,
            unit: '1팩',
            stock: 14,
            sold: 3,
            cutoff: '16:00',
            emoji: '🥞',
            bg: 'bg-[#FFE6C9]',
            status: '판매 중',
            confirmedAt: '오늘 09:10'
        }
    ];

    public storeSchedule: any[] = [
        {
            label: '점포 영업',
            note: '오늘 정상 영업',
            value: '09:00~18:00',
            icon: '🏪',
            bg: 'bg-[#EDF6EB]'
        },
        {
            label: '버틀러 방문',
            note: '주문 상품 수거',
            value: '오늘 14:00',
            icon: '🚶',
            bg: 'bg-[#FFF3BF]'
        },
        {
            label: '온라인 주문 마감',
            note: '이후 주문은 내일 준비',
            value: '오늘 16:00',
            icon: '⏰',
            bg: 'bg-[#FFE6C9]'
        },
        {
            label: '다음 정산',
            note: '금액 확인 중',
            value: '금요일 예정',
            icon: '💳',
            bg: 'bg-[#E6F0FF]'
        }
    ];

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();

        const now = new Date();
        const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        this.todayLabel = (now.getMonth() + 1) + '월 ' + now.getDate() + '일 ' + weekdays[now.getDay()] + '요일';

        const currentTab = WizRoute.segment.tab || location.pathname.split('/')[2] || 'overview';
        if (currentTab !== 'overview') {
            this.service.href('/merchant/overview');
            return;
        }

        await this.service.render();
    }
}
