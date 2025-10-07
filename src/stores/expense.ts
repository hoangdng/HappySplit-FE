import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export interface Expense {
  id: string | undefined;
  date: string | undefined;
  description: string;
  amount: number;
  createdAt: Date | undefined;
  groupId: string | undefined;
  createdByUserId: string | undefined;
  lastModifiedByUserId: string | undefined;
  expenseShares: ExpenseShare[];
}

export interface ExpenseShare {
  id: string | undefined;
  owingUserId: string;
  amount: number;
}

export const useExpenseStore = defineStore('expense', {
  state: () => ({
    expenses: [] as Expense[],
  }),
  getters: {
    getExpenseById: (state) => {
      return (id: string) => state.expenses.find((expense) => expense.id === id);
    },
    getExpenseByGroupId: (state) => {
      return (groupId: string) => state.expenses.filter((expense) => expense.groupId === groupId);
    },
    getExpenseByUserId: (state) => {
      return (userId: string) =>
        state.expenses.filter((expense) => expense.createdByUserId === userId);
    },
  },
  actions: {
    async createExpense(expense: Expense) {
      const response = await api.post('/api/expenses', expense);
      this.expenses.push(response.data);
    },
    async fetchExpenseById(id: string) {
      try {
        const { data } = await api.get(`/api/expenses/${id}`);
        this.expenses = [data];
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        this.expenses = [];
      }
    },
    async fetchExpensesByGroup(groupId: string) {
      try {
        const { data } = await api.get(`/api/groups/${groupId}/expenses`);
        this.expenses = data;
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
        this.expenses = [];
      }
    }
  },
});
