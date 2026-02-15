
export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away'
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: UserStatus;
  bio?: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'image' | 'system';
  isDeleted?: boolean;
}

export interface Chat {
  id: string;
  name: string;
  type: 'private' | 'group';
  participants: string[];
  lastMessage?: Message;
  avatar?: string;
  ownerId?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface CallState {
  isActive: boolean;
  participant: User | null;
  isScreenSharing: boolean;
  type: 'audio';
}
