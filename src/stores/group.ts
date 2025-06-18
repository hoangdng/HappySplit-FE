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
    async fetchGroup(id: string | undefined) {
      if (!id) {
        console.error('Group ID is required to fetch group details');
        return;
      }
      const { data } = await api.get('/api/groups/' + id);
      console.log('Fetched group:', data);
      this.group = data;
    },
  },
});
