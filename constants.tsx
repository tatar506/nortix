
import React from 'react';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Send, 
  Paperclip, 
  Smile,
  LogOut,
  UserPlus,
  ShieldAlert,
  Trash2,
  Monitor,
  PhoneOff,
  User,
  ChevronLeft
} from 'lucide-react';

// ЗАМЕНИ ЭТОТ URL НА СВОЙ ПОСЛЕ ДЕПЛОЯ НА RENDER
export const API_BASE_URL = 'https://your-nortix-server.onrender.com/api';

export const ICONS = {
  Chat: <MessageSquare size={20} />,
  Groups: <Users size={20} />,
  Settings: <Settings size={20} />,
  Search: <Search size={20} />,
  Call: <Phone size={20} />,
  Video: <Video size={20} />,
  More: <MoreVertical size={20} />,
  Send: <Send size={20} />,
  Attach: <Paperclip size={20} />,
  Emoji: <Smile size={20} />,
  Logout: <LogOut size={20} />,
  AddUser: <UserPlus size={20} />,
  Block: <ShieldAlert size={20} />,
  Delete: <Trash2 size={20} />,
  ScreenShare: <Monitor size={20} />,
  Hangup: <PhoneOff size={24} />,
  Profile: <User size={20} />,
  Back: <ChevronLeft size={24} />,
  ShieldAlert: <ShieldAlert size={20} />
};

export const COLORS = {
  primary: '#3b82f6',
  background: '#0a0a0c',
  sidebar: '#121216',
  chatBg: '#18181b',
  accent: '#6366f1',
  danger: '#ef4444'
};
