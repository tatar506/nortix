
import React, { useState, useEffect } from 'react';
import { User, Chat, AuthState, CallState } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AuthScreen from './components/AuthScreen';
import CallOverlay from './components/CallOverlay';
import SettingsModal from './components/SettingsModal';
import SearchScreen from './components/SearchScreen';
import CreateGroupModal from './components/CreateGroupModal';
import { api } from './services/api';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'chats' | 'search' | 'settings'>('chats');
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>({
    isActive: false,
    participant: null,
    isScreenSharing: false,
    type: 'audio'
  });

  // Fetch data on mount
  useEffect(() => {
    const init = async () => {
      const savedUser = localStorage.getItem('nortix_user');
      const token = localStorage.getItem('nortix_token');
      
      if (savedUser && token) {
        try {
          const user = JSON.parse(savedUser);
          setAuth({ user, isAuthenticated: true });
          const userChats = await api.getChats();
          setChats(userChats);
        } catch (e) {
          console.error("Failed to fetch initial data", e);
          handleLogout();
        }
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const handleLogin = async (username: string) => {
    try {
      // Здесь будет реальный запрос к вашему API на Render
      const response = await api.login(username, 'password_placeholder'); 
      setAuth({ user: response.user, isAuthenticated: true });
      localStorage.setItem('nortix_user', JSON.stringify(response.user));
      localStorage.setItem('nortix_token', response.token);
      
      const userChats = await api.getChats();
      setChats(userChats);
    } catch (e) {
      alert("Login failed. Make sure your Render server is up!");
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('nortix_user');
    localStorage.removeItem('nortix_token');
    setChats([]);
    setActiveChat(null);
  };

  const startCall = (participant: User) => {
    setCallState({
      isActive: true,
      participant,
      isScreenSharing: false,
      type: 'audio'
    });
  };

  const endCall = () => {
    setCallState(prev => ({ ...prev, isActive: false }));
  };

  const createGroup = async (name: string, members: string[]) => {
    try {
      const newChat = await api.createGroup(name, members);
      setChats([newChat, ...chats]);
      setActiveChat(newChat);
      setIsGroupModalOpen(false);
    } catch (e) {
      alert("Failed to create group");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-blue-400 font-bold tracking-widest animate-pulse">CONNECTING TO NORTIX...</p>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0c] text-white overflow-hidden relative">
      <div className={`${activeChat && 'hidden md:flex'} w-full md:w-[320px] lg:w-[380px] h-full border-r border-white/5`}>
        <Sidebar 
          user={auth.user!} 
          chats={chats} 
          activeChatId={activeChat?.id}
          onChatSelect={setActiveChat}
          onViewChange={setView}
          onCreateGroup={() => setIsGroupModalOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      <main className={`${!activeChat && 'hidden md:flex'} flex-1 h-full relative`}>
        {activeChat ? (
          <ChatWindow 
            chat={activeChat} 
            currentUser={auth.user!} 
            onBack={() => setActiveChat(null)} 
            onCall={() => startCall({ id: '2', username: 'remote', displayName: activeChat.name, avatar: activeChat.avatar || '', status: 0 as any })}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-4">
            <div className="p-6 bg-blue-500/10 rounded-full">
              <div className="text-blue-400 w-12 h-12 flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-medium text-white">Choose a conversation</h2>
            <p className="max-w-xs text-center text-sm">Select a person or group from the left to start chatting.</p>
          </div>
        )}
      </main>

      {view === 'settings' && (
        <SettingsModal user={auth.user!} onClose={() => setView('chats')} onUpdate={(u) => setAuth({ ...auth, user: u })} />
      )}
      
      {view === 'search' && (
        <SearchScreen 
          onClose={() => setView('chats')} 
          onChatSelect={(c) => { 
            setActiveChat(c); 
            setView('chats'); 
            if (!chats.find(chat => chat.id === c.id)) setChats([c, ...chats]);
          }} 
        />
      )}

      {isGroupModalOpen && (
        <CreateGroupModal onClose={() => setIsGroupModalOpen(false)} onCreate={createGroup} />
      )}

      {callState.isActive && (
        <CallOverlay state={callState} onHangup={endCall} onToggleScreenShare={() => setCallState(p => ({ ...p, isScreenSharing: !p.isScreenSharing }))} />
      )}
    </div>
  );
};

export default App;
