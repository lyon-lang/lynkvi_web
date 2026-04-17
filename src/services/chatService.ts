import { api } from './api';

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'gift';
  createdAt: string;
  readAt?: string;
}

export interface Conversation {
  id: string;
  otherUser: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    isOnline?: boolean;
  };
  lastMessage: Message;
  unreadCount: number;
}

export const chatService = {
  async getConversations(): Promise<Conversation[]> {
    const response = await api.get<Conversation[]>('/chats/conversations');
    return response.data;
  },

  async getMessages(otherUserId: string): Promise<Message[]> {
    const response = await api.get<Message[]>(`/chats/history/${otherUserId}`);
    return response.data;
  },

  async sendMessage(receiverId: string, content: string, type: Message['type'] = 'text'): Promise<Message> {
    const response = await api.post<Message>('/chats', {
      receiverId,
      content,
      type
    });
    return response.data;
  },

  async markAsRead(otherUserId: string): Promise<void> {
    await api.post(`/chats/read/${otherUserId}`);
  }
};
