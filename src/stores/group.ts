import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import { useUserStore } from './user';
import type { User } from './user';
import { useExpenseStore } from './expense';

const userStore = useUserStore();
const expenseStore = useExpenseStore();
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
    totalExpense: 0,
    totalOwe: 0,
    totalLoan: 0,
  }),
  getters: {
    getGroupById: (state) => {
      return (id: string) => state.groups.find((group) => group.id === id);
    },
    getAllGroups: (state) => state.groups,
    getTotalExpense: (state) => {
      const expenses = expenseStore.expenses.filter(
        (expense) => expense.groupId === state.group?.id,
      );
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    },
    getTotalOwe: (state) => {
      const expenses = expenseStore.expenses.filter(
        (expense) =>
          expense.groupId === state.group?.id &&
          expense.expenseShares[0]?.owingUserId !== userStore.user?.id,
      );
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    },
    getTotalLoan: (state) => {
       const expenses = expenseStore.expenses.filter(
        (expense) =>
          expense.groupId === state.group?.id &&
          expense.expenseShares[0]?.owingUserId === userStore.user?.id,
      );
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    },
  },
  actions: {
    async createGroup(group: Group) {
      await api.post('/api/groups', { name: group.name });
      await userStore.fetchCurrentUser();
    },
    async fetchGroup(id: string) {
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
