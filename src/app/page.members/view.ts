import { OnInit } from '@angular/core';
import { Service } from '@wiz/libs/portal/season/service';

export class Component implements OnInit {
    public loading: boolean = false;
    public members: any[] = [];

    public search: any = {
        text: '',
        role: ''
    };

    public roles: string[] = ['merchant', 'consumer', 'admin'];

    public showInviteModal: boolean = false;
    public inviteData: any = { email: '', role: 'consumer' };

    constructor(public service: Service) { }

    public async ngOnInit() {
        await this.service.init();
        if (!this.service.auth.allow.role('admin', '/access/login')) return;
        await this.load();
    }

    public async load() {
        this.loading = true;
        await this.service.render();

        const { code, data } = await wiz.call('list', this.search);
        if (code === 200) {
            this.members = data || [];
        }

        this.loading = false;
        await this.service.render();
    }

    public async filterByRole(role: string) {
        this.search.role = this.search.role === role ? '' : role;
        await this.load();
    }

    public async openInvite() {
        this.inviteData = { email: '', role: 'consumer' };
        this.showInviteModal = true;
        await this.service.render();
    }

    public async invite() {
        if (!this.inviteData.email) {
            await this.service.modal.error('이메일을 입력해 주세요.');
            return;
        }

        const { code, data } = await wiz.call('invite', this.inviteData);
        if (code === 200) {
            await this.service.modal.success('계정이 생성되었습니다. 초기 비밀번호는 welcome1입니다.');
            this.showInviteModal = false;
            await this.load();
        } else {
            await this.service.modal.error(data?.message || data || '계정 생성에 실패했습니다.');
        }
    }

    public async removeMember(member: any) {
        const res = await this.service.modal.show({
            title: '계정 제거',
            message: member.name + ' 계정을 제거하시겠습니까?',
            action: '제거',
            actionBtn: 'error',
            status: 'error'
        });
        if (!res) return;

        const { code } = await wiz.call('remove', { id: member.id });
        if (code === 200) {
            await this.load();
        }
    }

    public roleName(role: string) {
        if (role === 'admin') return '마켓버틀러';
        if (role === 'merchant') return '상인';
        if (role === 'consumer') return '소비자';
        return role;
    }

    public roleClass(role: string) {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700';
            case 'merchant': return 'bg-orange-100 text-orange-700';
            case 'consumer': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    }
}
