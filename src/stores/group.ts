import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useUserStore } from './user';
import type { User } from './user';

const userStore = useUserStore();

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
  members: User[] | undefined;
  ownerEmail: string;
}

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [] as Group[],
    group: null as Group | null,
  }),
  getters: {
    getGroupById: (state) => {
      return (id: string) => state.groups.find((group) => group.id === id);
    },
    getAllGroups: (state) => state.groups,
  },
  actions: {
    async createGroup(group: Group) {
      await api.post('/api/groups', { name: group.name });
      await userStore.fetchCurrentUser();
    },
    async fetchGroup(id: string ) {
      const { data } = await api.get('/api/groups/' + id);
      this.group = data;
    },
    async sendInvitation(groupId: string, email: string) {
      await api.post(`/api/groups/${groupId}/invite`, {
        subject: `Invitation to join group ${this.group?.name}`,
        body: `You have been invited to join the group ${this.group?.name}.\n Please accept the invitation via link: ${process.env.FRONTEND_URL}/groups/${groupId}/invitation-accepted`,
        inviteeEmail: email,
      });
    },
  },
});
