import { defineStore, acceptHMRUpdate } from 'pinia';
import type { Group } from './group';
import { api } from 'boot/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  groups: Group[] | undefined;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || null,
    profileImage: localStorage.getItem('profileImage') || null,
  }),

  getters: {
    isAuthenticated: (state) => {
      if (!state.token) return false;
      try {
        const tokenParts = state.token.split('.');
        if (tokenParts.length < 2 || !tokenParts[1]) return false;
        const payload = JSON.parse(atob(tokenParts[1]));
        // exp is in seconds since epoch
        return Date.now() < payload.exp * 1000;
      } catch {
        return false;
      }
    },
    getUserInfoFromToken: (state) => {
      if (!state.token) return null;

      let base64 = state.token.split('.')[1];
      base64 = base64!.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      // Properly decode UTF-8
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );

      const payload = JSON.parse(jsonPayload);
      return {
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        name: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      };
    },
  },

  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('token');
      this.profileImage = null;
      localStorage.removeItem('profileImage');
    },
    setProfileImage(url: string) {
      this.profileImage = url;
      localStorage.setItem('profileImage', url);
    },
    async fetchCurrentUser() {
      const { data } = await api.get('/api/users/me');
      this.user = data;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
