import { OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit, OnDestroy {
    public mode: string = 'login';
    public routerSub: any;
    public showPassword: boolean = false;
    public loading: boolean = false;
    public errorMessage: string = '';

    public loginData: any = { identifier: '', password: '' };
    public signupData: any = {
        role: 'consumer', name: '', identifier: '', mobile: '', password: '', passwordConfirm: ''
    };

    public signupRoles: any[] = [
        { value: 'market_butler', label: '마켓 버틀러', icon: '👔', description: '상품·재고·주문 운영을 맡아요. 가입 후 승인이 필요해요.' },
        { value: 'merchant', label: '상인', icon: '🏪', description: '내 점포 현황을 확인해요.' },
        { value: 'consumer', label: '소비자', icon: '🧺', description: '상품을 둘러보고 주문해요.' }
    ];

    constructor(public service: Service, public router: Router) { }

    public async ngOnInit() {
        await this.service.init();
        if (this.service.auth.status) {
            location.href = this.destinationForRole(this.service.auth.session?.role);
            return;
        }
        this.syncMode();
        this.routerSub = this.router.events.subscribe(async (event: any) => {
            if (event instanceof NavigationEnd) {
                this.syncMode();
                await this.service.render();
            }
        });
        await this.service.render();
    }

    public ngOnDestroy() {
        if (this.routerSub) this.routerSub.unsubscribe();
    }

    public syncMode() {
        const pathMode = location.pathname.split('/')[2] || '';
        const requested = WizRoute.segment.mode || pathMode;
        this.mode = requested === 'signup' ? 'signup' : 'login';
        this.errorMessage = '';
        this.showPassword = false;
    }

    public goMode(mode: string) {
        this.service.href('/access/' + mode);
    }

    public modeTabClass(mode: string) {
        const base = 'flex h-10 flex-1 items-center justify-center rounded-xl text-[11px] font-black transition';
        return this.mode === mode
            ? base + ' bg-white text-[#2E7D32] shadow-sm ring-1 ring-[#E3D8CE]'
            : base + ' text-[#8B7E73]';
    }

    public signupRoleClass(role: string) {
        const base = 'relative flex min-h-[52px] cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition'
            + (role === 'market_butler' ? ' col-span-2' : '');
        return this.signupData.role === role
            ? base + ' border-[#2E7D32] bg-[#EDF6EB] ring-1 ring-[#2E7D32]/10'
            : base + ' border-[#E3D8CE] bg-[#FFFDF8] hover:border-[#B7CDB3]';
    }

    public async selectSignupRole(role: string) {
        if (['market_butler', 'merchant', 'consumer'].indexOf(role) < 0) return;
        this.signupData.role = role;
        this.errorMessage = '';
        await this.service.render();
    }

    public signupButtonLabel() {
        if (this.signupData.role === 'market_butler') return '마켓 버틀러 가입 신청';
        if (this.signupData.role === 'merchant') return '상인으로 회원가입';
        return '소비자로 회원가입';
    }

    public async togglePassword() {
        this.showPassword = !this.showPassword;
        await this.service.render();
    }

    public destinationForRole(role: string) {
        if (['admin', 'super_admin', 'product_manager', 'order_manager', 'market_butler'].indexOf(role) >= 0) return '/admin/overview';
        if (role === 'merchant') return '/merchant/overview';
        if (role === 'consumer') return '/dashboard';
        return '/access/login';
    }

    public responseMessage(data: any, fallback: string) {
        if (typeof data === 'string') return data;
        return data?.message || fallback;
    }

    public async login() {
        this.errorMessage = '';
        const payload = JSON.parse(JSON.stringify(this.loginData));
        if (!payload.identifier) {
            this.errorMessage = '아이디를 입력해 주세요.';
            await this.service.render();
            return;
        }
        if (!payload.password) {
            this.errorMessage = '비밀번호를 입력해 주세요.';
            await this.service.render();
            return;
        }
        this.loading = true;
        await this.service.render();
        const { code, data } = await wiz.call('login', payload);
        this.loading = false;
        if (code === 200) {
            location.href = data?.destination || '/dashboard';
            return;
        }
        this.errorMessage = this.responseMessage(data, '로그인 정보를 다시 확인해 주세요.');
        await this.service.render();
    }

    public async signup() {
        this.errorMessage = '';
        const payload = JSON.parse(JSON.stringify(this.signupData));
        if (['market_butler', 'merchant', 'consumer'].indexOf(payload.role) < 0) {
            this.errorMessage = '가입 유형을 선택해 주세요.';
            await this.service.render();
            return;
        }
        if (!payload.name || !payload.identifier || !payload.password) {
            this.errorMessage = '이름, 아이디, 비밀번호를 모두 입력해 주세요.';
            await this.service.render();
            return;
        }
        if (payload.password !== payload.passwordConfirm) {
            this.errorMessage = '비밀번호 확인이 일치하지 않습니다.';
            await this.service.render();
            return;
        }
        this.loading = true;
        await this.service.render();
        const { code, data } = await wiz.call('register', payload);
        this.loading = false;
        if (code === 200) {
            if (data?.pending) {
                await this.service.modal.success(data?.message || '마켓 버틀러 가입 신청이 완료되었습니다.');
                this.service.href('/access/login');
                return;
            }
            location.href = data?.destination || this.destinationForRole(payload.role);
            return;
        }
        this.errorMessage = this.responseMessage(data, '회원가입 정보를 다시 확인해 주세요.');
        await this.service.render();
    }
}
