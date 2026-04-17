import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Send, Phone, Video, 
  Smile, Paperclip, 
  ChevronLeft, Info, Check, CheckCheck,
  Circle, MessageCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService, type Conversation, type Message } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

export const Chat: React.FC = () => {
  const { id: activeChatId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const { data: conversations, isLoading: convsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => chatService.getConversations(),
  });

  // Fetch messages for active chat
  const { data: messages, isLoading: msgsLoading } = useQuery({
    queryKey: ['messages', activeChatId],
    queryFn: () => chatService.getMessages(activeChatId!),
    enabled: !!activeChatId,
    refetchInterval: 3000, // Basic polling for real-time feel until socket is in
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (text: string) => chatService.sendMessage(activeChatId!, text),
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', activeChatId], (old: Message[] | undefined) => [...(old || []), newMessage]);
      setMessageText('');
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatId) return;
    sendMessageMutation.mutate(messageText);
  };

  const filteredConversations = conversations?.filter(c => 
    c.otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations?.find(c => c.otherUser.id === activeChatId);

  return (
    <div className="container py-6 h-[calc(100vh-120px)] flex gap-6 overflow-hidden">
      {/* Conversations List */}
      <div className={`w-full lg:w-1/3 glass rounded-[32px] border border-white/10 flex flex-col overflow-hidden transition-all ${activeChatId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-white/5">
          <h2 className="text-2xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {convsLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse" />
            ))
          ) : filteredConversations?.length === 0 ? (
            <div className="text-center py-20 text-white/30">
              <p>No conversations found</p>
            </div>
          ) : (
            filteredConversations?.map((conv) => (
              <button
                key={conv.otherUser.id}
                onClick={() => navigate(`/chat/${conv.otherUser.id}`)}
                className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 group ${
                  activeChatId === conv.otherUser.id ? 'bg-primary shadow-lg shadow-primary/20' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 border border-white/10">
                    <img src={conv.otherUser.avatarUrl || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                  </div>
                  {conv.otherUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#121214]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold truncate">{conv.otherUser.displayName}</h4>
                    <span className={`text-[10px] ${activeChatId === conv.otherUser.id ? 'text-white/70' : 'text-white/30'}`}>
                      {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${activeChatId === conv.otherUser.id ? 'text-white/80' : 'text-white/40'}`}>
                    {conv.lastMessage.senderId === currentUser?.id ? 'You: ' : ''}{conv.lastMessage.content}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-white text-primary rounded-full flex-center text-[10px] font-bold">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={`flex-1 glass rounded-[32px] border border-white/10 flex flex-col overflow-hidden transition-all ${!activeChatId ? 'hidden lg:flex' : 'flex'}`}>
        {!activeChatId ? (
          <div className="flex-1 flex-center flex-col text-white/20 p-10 text-center">
            <div className="w-24 h-24 rounded-full bg-white/5 flex-center mb-6">
              <MessageCircle size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white/40">Your Inbox</h3>
            <p className="max-w-xs">Select a conversation from the left to start chatting with your matches.</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/chat')} className="lg:hidden p-2 -ml-2 text-white/50">
                  <ChevronLeft size={24} />
                </button>
                <div className="relative cursor-pointer" onClick={() => navigate(`/profile/${activeChatId}`)}>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/10">
                    <img src={activeConv?.otherUser.avatarUrl || 'https://via.placeholder.com/100'} alt="" className="w-full h-full object-cover" />
                  </div>
                  {activeConv?.otherUser.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#121214]" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold cursor-pointer" onClick={() => navigate(`/profile/${activeChatId}`)}>
                    {activeConv?.otherUser.displayName || 'Loading...'}
                  </h4>
                  <p className="text-[10px] md:text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                    <Circle size={8} fill="currentColor" className="animate-pulse" /> Active Now
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all"><Phone size={20} /></button>
                <button className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all"><Video size={20} /></button>
                <button className="p-3 text-white/40 hover:text-white hover:bg-white/5 rounded-2xl transition-all"><Info size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-black/10">
              {msgsLoading ? (
                <div className="flex-center h-full">
                  <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="text-center py-6">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Beginning of your story</p>
                  </div>
                  {messages?.map((msg) => {
                    const isMine = msg.senderId === currentUser?.id;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        key={msg.id} 
                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                          <div className={`p-4 rounded-3xl text-sm md:text-base ${
                            isMine 
                              ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20' 
                              : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                          }`}>
                            {msg.content}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1.5 px-2">
                             <span className="text-[10px] text-white/30 font-medium">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMine && (
                              msg.readAt ? <CheckCheck size={12} className="text-emerald-400" /> : <Check size={12} className="text-white/30" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-white/5 bg-white/[0.02]">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2 md:gap-4 bg-white/5 border border-white/10 rounded-[32px] p-2 pr-4 transition-all focus-within:border-primary/50 focus-within:bg-white/[0.08]">
                <button type="button" className="p-3 text-white/30 hover:text-white transition-colors"><Paperclip size={20} /></button>
                <textarea 
                  rows={1}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-sm md:text-base max-h-32 resize-none custom-scrollbar"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button type="button" className="p-3 text-white/30 hover:text-white transition-colors hidden md:block"><Smile size={20} /></button>
                <button 
                  type="submit" 
                  disabled={!messageText.trim() || sendMessageMutation.isPending}
                  className={`p-3 rounded-2xl transition-all shadow-lg ${
                    messageText.trim() ? 'bg-primary text-white shadow-primary/30 hover:scale-105 active:scale-95' : 'text-white/20'
                  }`}
                >
                  <Send size={20} fill={messageText.trim() ? "currentColor" : "none"} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
