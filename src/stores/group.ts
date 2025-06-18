import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useUserStore } from './user';

const userStore = useUserStore();

export interface Group {
  id: string;
  name: string;
  description: string;
  avatar: string;
}

export const useGroupStore = defineStore('group', {
  state: () => ({
    groups: [] as Group[],
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
      await userStore.fetchUser();
    },
  },
});
