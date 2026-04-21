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
      <div className="h-full flex-center py-20">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: '4px solid var(--primary)', borderTopColor: 'transparent' }} />
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
    <div className="bg-bg-deep text-white pb-32">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex gap-4">
          <button className="p-3 glass rounded-full hover:bg-white/10 transition-colors" style={{ border: 'none', cursor: 'pointer' }}>
            <Share2 size={20} className="text-white" />
          </button>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-3 glass rounded-full hover:bg-white/10 transition-colors relative"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <MoreVertical size={20} className="text-white" />
            <AnimatePresence>
              {showOptions && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 mt-4 glass border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-2"
                  style={{ width: '192px', top: '100%' }}
                >
                  <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left" style={{ border: 'none', background: 'transparent', color: 'white' }}>
                    <Flag size={18} className="text-white/50" /> Report User
                  </button>
                  <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition-colors rounded-xl text-sm font-medium text-left" style={{ border: 'none', background: 'transparent', color: 'var(--primary)' }}>
                    <Ban size={18} /> Block
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="relative overflow-hidden" style={{ height: '60vh' }}>
        <img 
          src={model.profileImageUrl || 'https://via.placeholder.com/1200x1200'} 
          className="w-full h-full"
          style={{ objectFit: 'cover' }}
          alt={model.displayName}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-deep), transparent 50%, rgba(0,0,0,0.2))' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10" style={{ marginTop: '-80px' }}>
        <div className="flex flex-col gap-8">
          <div className="flex items-end justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl md:text-5xl font-black">{model.displayName}</h1>
                {model.isOnline && (
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: 'var(--online)', boxShadow: '0 0 12px var(--online)' }} />
                )}
              </div>
              <div className="flex items-center gap-4 text-white/60 font-semibold">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary" />
                  <span>{model.country || 'International'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-primary" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
            <button className="p-5 glass rounded-3xl hover:bg-red-500/20 transition-all group" style={{ border: '1px solid var(--border)' }}>
              <Heart size={28} className="group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass p-5 rounded-3xl text-center">
              <p className="text-xs text-white/40 uppercase font-black tracking-widest mb-1">Rating</p>
              <p className="text-2xl font-black flex justify-center items-center gap-1">
                <Star size={18} fill="var(--accent)" className="text-accent" />
                {model.ratingAverage?.toFixed(1)}
              </p>
            </div>
            <div className="glass p-5 rounded-3xl text-center">
              <p className="text-xs text-white/40 uppercase font-black tracking-widest mb-1">Followers</p>
              <p className="text-2xl font-black">{model.followerCount || '2.4K'}</p>
            </div>
            <div className="glass p-5 rounded-3xl text-center">
              <p className="text-xs text-white/40 uppercase font-black tracking-widest mb-1">Status</p>
              <p className={`text-2xl font-black ${model.isOnline ? 'text-online' : 'text-white/40'}`}>
                {model.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex gap-10 mb-8 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <button 
                onClick={() => setActiveTab('about')}
                className={`pb-4 px-2 text-xl font-black transition-all relative ${activeTab === 'about' ? 'text-white' : 'text-white/40'}`}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                About
                {activeTab === 'about' && (
                  <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ background: 'var(--primary)' }} />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('media')}
                className={`pb-4 px-2 text-xl font-black transition-all relative ${activeTab === 'media' ? 'text-white' : 'text-white/40'}`}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                Gallery
                {activeTab === 'media' && (
                  <motion.div layoutId="profile-tab-line" className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ background: 'var(--primary)' }} />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'about' ? (
                <motion.div 
                  key="about" 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-10"
                >
                  <section>
                    <h3 className="text-sm font-black text-white/30 uppercase tracking-widest mb-4">Biography</h3>
                    <p className="text-lg text-white/80 leading-relaxed">
                      {model.bio || `${model.displayName} is a verified premium creator, providing exclusive interactions and high-quality content for the Lynkvi community.`}
                    </p>
                  </section>

                  <section className="glass p-8 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(255,45,85,0.05), transparent)', borderColor: 'rgba(255,45,85,0.2)' }}>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl flex-center" style={{ background: 'rgba(255,204,0,0.1)' }}>
                        <CreditCard className="text-accent" size={32} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-black mb-1">Fan Club</h4>
                        <p className="text-white/50">Join to unlock exclusive media and priority messaging.</p>
                      </div>
                      <ChevronRight className="text-white/20" size={32} />
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div 
                  key="media"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-3 gap-3"
                >
                  {media?.length ? media.map((item: any) => (
                    <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={item.url} className="w-full h-full transition-transform group-hover:scale-110" style={{ objectFit: 'cover' }} alt="" />
                      {item.isPremium && (
                        <div className="absolute inset-0 flex-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                          <Lock size={32} className="text-accent" />
                        </div>
                      )}
                    </div>
                  )) : (
                    <div className="col-span-3 py-20 text-center glass rounded-3xl" style={{ borderStyle: 'dashed' }}>
                      <ImageIcon className="mx-auto mb-4 text-white/20" size={64} />
                      <p className="text-xl text-white/30 font-bold">No media gallery available yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-6" style={{ background: 'linear-gradient(to top, var(--bg-deep), transparent)' }}>
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="flex gap-4">
            <button 
              onClick={() => isAuthenticated ? navigate(`/chat/${model.userId}`) : navigate('/login')}
              className="flex-1 btn-secondary"
              style={{ height: '64px', borderRadius: '24px', fontSize: '1.125rem', borderColor: 'rgba(255,45,85,0.3)', background: 'rgba(255,45,85,0.05)' }}
            >
              <MessageCircle size={24} className="mr-2 text-primary" /> Chat
            </button>
            <button className="flex btn-primary" style={{ flex: '2', height: '64px', borderRadius: '24px', fontSize: '1.125rem' }}>
              <Phone size={24} className="mr-2" /> Start Video Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
