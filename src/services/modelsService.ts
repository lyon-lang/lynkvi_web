import { api } from './api';

export interface Model {
  id: string;
  userId: string;
  displayName: string;
  category: string;
  ratingAverage: number;
  callPricePerMinute: number;
  isOnline: boolean;
  profileImageUrl: string;
  country?: string;
  bio?: string;
  followerCount?: number;
  isFavorited?: boolean;
}

export interface Media {
  id: string;
  url: string;
  type: 'image' | 'video';
  isPremium: boolean;
  price?: number;
}

// Transformation helper
const mapBackendToModel = (data: any): Model => ({
  id: data.id,
  userId: data.userId || data.user?.id,
  displayName: data.user?.name || data.displayName || 'Unknown Artist',
  category: data.category || 'Artist',
  ratingAverage: parseFloat(data.rating) || 0,
  callPricePerMinute: data.ratePerMinute || 0,
  isOnline: data.isOnline || false,
  profileImageUrl: data.user?.avatarUrl || data.profileImageUrl || '',
  country: data.location?.name || data.country || 'Global',
  bio: data.bio || '',
  followerCount: data.followerCount || 0,
  isFavorited: data.isFavorited || false,
});

export const modelsService = {
  getFeaturedModels: async (limit: number = 8): Promise<Model[]> => {
    try {
      const response = await api.get(`/models/featured?limit=${limit}`);
      return (response.data || []).map(mapBackendToModel);
    } catch (error) {
      console.error('Failed to fetch featured models:', error);
      return [];
    }
  },

  getAllModels: async (filters: any = {}): Promise<Model[]> => {
    try {
      const response = await api.get('/models', { params: filters });
      return (response.data || []).map(mapBackendToModel);
    } catch (error) {
      console.error('Failed to fetch models:', error);
      return [];
    }
  },

  getModelById: async (id: string): Promise<Model | null> => {
    try {
      const response = await api.get(`/models/${id}`);
      return mapBackendToModel(response.data);
    } catch (error) {
      console.error(`Failed to fetch model ${id}:`, error);
      return null;
    }
  },

  getModelMedia: async (id: string): Promise<Media[]> => {
    try {
      const response = await api.get(`/media/user/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch media for model ${id}:`, error);
      return [];
    }
  },

  toggleFavorite: async (id: string): Promise<boolean> => {
    try {
      const response = await api.post(`/models/${id}/favorite`);
      return response.data.isFavorited;
    } catch (error) {
      console.error(`Failed to toggle favorite for ${id}:`, error);
      return false;
    }
  },

  logView: async (id: string): Promise<void> => {
    try {
      await api.post(`/models/${id}/view`);
    } catch (error) {
      console.error(`Failed to log view for ${id}:`, error);
    }
  }
};
