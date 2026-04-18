import { api } from './api';
import type { User } from './authService';

export const userService = {
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/users/profile', data);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async addCoins(amount: number): Promise<User> {
    const response = await api.patch<User>('/users/coins/add', { amount });
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async getProfileViews() {
    const response = await api.get('/users/views');
    return response.data;
  }
};
