import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MessageCircle, Phone, Heart, Share2, Shield, 
  MapPin, Image as ImageIcon, Video, 
  Lock, ArrowLeft, MoreVertical, Flag, Ban, CreditCard, ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { modelsService } from '../services/modelsService';
import { useAuth } from '../context/AuthContext';

export const ModelProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'media'>('about');
  const [showOptions, setShowOptions] = useState(false);

  const { data: model, isLoading: modelLoading } = useQuery({
    queryKey: ['model', id],
    queryFn: () => modelsService.getModelById(id!),
    enabled: !!id,
  });

  const { data: media } = useQuery({
    queryKey: ['model-media', id],
    queryFn: () => modelsService.getModelMedia(id!),
    enabled: !!id,
  });

  if (modelLoading) {
    return (
      <div className="min-h-screen flex-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-black mb-4">Model not found</h2>
        <Link to="/explore" className="btn-primary">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deep text-white pb-32">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex gap-4">
          <button className="p-3 glass rounded-full hover:bg-white/10 transition-colors">
            <Share2 size={20} />
          </button>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-3 glass rounded-full hover:bg-white/10 transition-colors relative"
          >
            <MoreVertical size={20} />
            <AnimatePresence>
              {showOptions && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 mt-4 w-48 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-2"
                >
                  <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left">
                    <Flag size={18} className="text-white/50" /> Report User
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition-colors rounded-xl text-sm font-medium text-red-500 text-left">
                    <Ban size={18} /> Block
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={model.profileImageUrl || 'https://via.placeholder.com/1200x1200'} 
          className="w-full h-full object-cover"
          alt={model.displayName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deep via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="container -mt-20 relative z-10 px-4">
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black">{model.displayName}</h1>
                {model.isOnline && (
                  <div className="w-3 h-3 bg-online rounded-full shadow-[0_0_12px_var(--online)] animate-pulse" />
                )}
              </div>
              <div className="flex items-center gap-3 text-white/60 font-medium">
                <MapPin size={16} className="text-primary" />
                <span>{model.country || 'International'}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span>Verified Creator</span>
              </div>
            </div>
            <button className="p-5 glass rounded-3xl hover:bg-red-500/20 transition-all border-white/10 group">
              <Heart size={28} className="group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass p-4 rounded-3xl text-center">
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Rating</p>
              <p className="text-xl font-black flex-center gap-1">
                <Star size={16} fill="var(--accent)" className="text-accent" />
                {model.ratingAverage?.toFixed(1)}
              </p>
            </div>
            <div className="glass p-4 rounded-3xl text-center">
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Followers</p>
              <p className="text-xl font-black">{model.followerCount || '2.4K'}</p>
            </div>
            <div className="glass p-4 rounded-3xl text-center">
              <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Status</p>
              <p className={`text-xl font-black ${model.isOnline ? 'text-online' : 'text-white/40'}`}>
                {model.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex gap-8 mb-8 border-b border-white/5">
              <button 
                onClick={() => setActiveTab('about')}
                className={`pb-4 px-2 text-lg font-black transition-all relative ${activeTab === 'about' ? 'text-white' : 'text-white/40'}`}
              >
                About
                {activeTab === 'about' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('media')}
                className={`pb-4 px-2 text-lg font-black transition-all relative ${activeTab === 'media' ? 'text-white' : 'text-white/40'}`}
              >
                Gallery
                {activeTab === 'media' && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'about' ? (
                <motion.div 
                  key="about" 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-8"
                >
                  <section>
                    <h3 className="text-lg font-black mb-3 text-white/50 uppercase tracking-widest">Biography</h3>
                    <p className="text-white/80 leading-relaxed text-lg">
                      {model.bio || `${model.displayName} is a verified creator, bringing premium content and engaging interactions to Lynkvi.`}
                    </p>
                  </section>

                  <section className="glass p-6 rounded-[32px] border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent/20 flex-center">
                        <CreditCard className="text-accent" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">Fan Club</h4>
                        <p className="text-xs text-white/50">Join for exclusive media & chats</p>
                      </div>
                      <ChevronRight className="text-white/30" />
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div 
                  key="media"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="grid grid-cols-3 gap-2"
                >
                  {media?.length ? media.map((item: any) => (
                    <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={item.url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                      {item.isPremium && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex-center">
                          <Lock size={20} className="text-accent" />
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center glass rounded-3xl border-dashed border-white/10">
                      <ImageIcon className="mx-auto mb-4 text-white/20" size={48} />
                      <p className="text-white/40">No media gallery yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-gradient-to-t from-bg-deep to-transparent">
        <div className="max-w-md mx-auto flex gap-4">
          <button 
            onClick={() => isAuthenticated ? navigate(`/chat/${model.userId}`) : navigate('/login')}
            className="flex-1 btn-secondary h-16 rounded-3xl !border-primary/30 !bg-primary/10"
          >
            <MessageCircle size={24} className="mr-2 text-primary" /> Chat
          </button>
          <button className="flex-[1.5] btn-primary h-16 rounded-3xl">
            <Phone size={24} className="mr-2" /> Call Now
          </button>
        </div>
      </div>
    </div>
  );
};
