import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public loading: boolean = false;
    public members: any[] = [];
    public search: any = { text: '', role: '' };
    public roles: any[] = [
        { value: 'super_admin', label: '총괄관리자' },
        { value: 'product_manager', label: '상품관리자' },
        { value: 'order_manager', label: '주문관리자' },
        { value: 'market_butler', label: '마켓 버틀러' },
        { value: 'butler_pending', label: '마켓 버틀러 승인 대기' },
        { value: 'merchant', label: '상인' },
        { value: 'consumer', label: '소비자' }
    ];
    public showInviteModal: boolean = false;
    public inviteData: any = this.emptyInviteData();

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        if (!this.hasPermission('admin.accounts.manage')) {
            this.service.href('/admin/overview');
            return;
        }
        await this.load();
    }

    public hasPermission(permission: string) {
        const permissions = this.service.auth.session?.permissions || [];
        return permissions.indexOf(permission) >= 0;
    }

    public emptyInviteData() {
        return { identifier: '', email: '', name: '', password: '', role: 'product_manager' };
    }

    public async load() {
        this.loading = true;
        await this.service.render();
        const { code, data } = await wiz.call('list', this.search);
        if (code === 200) {
            this.members = (data || []).map((member: any) => ({ ...member, editName: member.name, editRole: member.role }));
        } else if (code === 403) {
            this.service.href('/admin/overview');
            return;
        }
        this.loading = false;
        await this.service.render();
    }

    public async filterByRole(role: string) {
        this.search.role = this.search.role === role ? '' : role;
        await this.load();
    }

    public async openInvite() {
        this.inviteData = this.emptyInviteData();
        this.showInviteModal = true;
        await this.service.render();
    }

    public async invite() {
        if (!this.inviteData.identifier || !this.inviteData.email || !this.inviteData.name || !this.inviteData.password) {
            await this.service.modal.error('아이디, 이메일, 이름, 초기 비밀번호를 모두 입력해 주세요.');
            return;
        }
        const { code, data } = await wiz.call('invite', this.inviteData);
        if (code === 200) {
            await this.service.modal.success('계정과 역할이 생성되었습니다.');
            this.showInviteModal = false;
            await this.load();
        } else {
            await this.service.modal.error(data?.message || data || '계정 생성에 실패했습니다.');
        }
    }

    public async updateMember(member: any) {
        const { code, data } = await wiz.call('update', {
            id: member.id,
            name: member.editName,
            role: member.editRole
        });
        if (code === 200) {
            await this.service.modal.success('계정 정보와 역할을 저장했습니다.');
            await this.load();
        } else {
            await this.service.modal.error(data?.message || data || '계정 수정에 실패했습니다.');
        }
    }

    public async approveButler(member: any) {
        member.editRole = 'market_butler';
        const { code, data } = await wiz.call('update', {
            id: member.id,
            name: member.editName,
            role: member.editRole
        });
        if (code === 200) {
            await this.service.modal.success('마켓 버틀러 가입을 승인했습니다.');
            await this.load();
        } else {
            member.editRole = member.role;
            await this.service.modal.error(data?.message || data || '마켓 버틀러 승인에 실패했습니다.');
        }
    }

    public async removeMember(member: any) {
        const confirmed = await this.service.modal.show({
            title: '계정 제거',
            message: member.name + ' 계정을 제거하시겠습니까?',
            action: '제거',
            cancel: '취소',
            actionBtn: 'error',
            status: 'error'
        });
        if (!confirmed) return;
        const { code, data } = await wiz.call('remove', { id: member.id });
        if (code === 200) {
            await this.load();
        } else {
            await this.service.modal.error(data?.message || data || '계정 제거에 실패했습니다.');
        }
    }

    public roleName(role: string) {
        return this.roles.find((item: any) => item.value === role)?.label || role;
    }

    public roleClass(role: string) {
        switch (role) {
            case 'super_admin': return 'bg-purple-100 text-purple-700';
            case 'product_manager': return 'bg-emerald-100 text-emerald-700';
            case 'order_manager': return 'bg-blue-100 text-blue-700';
            case 'market_butler': return 'bg-teal-100 text-teal-700';
            case 'butler_pending': return 'bg-amber-100 text-amber-700';
            case 'merchant': return 'bg-orange-100 text-orange-700';
            case 'consumer': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    }
}
