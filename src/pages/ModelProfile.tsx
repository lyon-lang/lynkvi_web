import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, MessageCircle, Phone, Heart, Share2, Shield, 
  MapPin, Calendar, Image as ImageIcon, Video, 
  Lock, ArrowLeft, MoreVertical, Flag, Ban, CreditCard, ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { modelsService, Model, Media } from '../services/modelsService';
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

  const { data: media, isLoading: mediaLoading } = useQuery({
    queryKey: ['model-media', id],
    queryFn: () => modelsService.getModelMedia(id!),
    enabled: !!id,
  });

  if (modelLoading) {
    return (
      <div className="container py-20 flex-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Model not found</h2>
        <Link to="/explore" className="text-primary font-semibold">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      {/* Back Button & Header Actions */}
      <div className="container relative z-20 pt-6 flex justify-between items-center h-0 overflow-visible">
        <button 
          onClick={() => navigate(-1)} 
          className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="p-3 glass rounded-full hover:bg-white/10 transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          <AnimatePresence>
            {showOptions && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 mt-2 w-48 glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 p-2"
              >
                <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left">
                  <Share2 size={18} className="text-white/50" /> Share Profile
                </button>
                <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left">
                  <Flag size={18} className="text-white/50" /> Report User
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition-colors rounded-xl text-sm font-medium text-red-400 text-left text-red-500">
                  <Ban size={18} /> Block User
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hero / Cover Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">
        <img 
          src={model.profileImageUrl || 'https://via.placeholder.com/1200x600'} 
          className="w-full h-full object-cover"
          alt={model.displayName}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
      </div>

      <div className="container -mt-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar / Profile Info */}
          <div className="lg:w-1/3">
            <div className="glass p-8 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-extrabold flex items-center gap-3">
                    {model.displayName}
                    {model.isOnline && <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] animate-pulse" />}
                  </h1>
                  <p className="text-primary font-medium mt-1">@{model.userId}</p>
                </div>
                <button className="p-4 glass rounded-3xl hover:bg-red-500/20 transition-all border-white/10 group">
                  <Heart size={24} className="group-hover:scale-110 group-hover:fill-red-500 group-hover:text-red-500 transition-all" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="glass p-4 rounded-2xl text-center border-white/5">
                  <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Rating</p>
                  <p className="font-bold flex items-center justify-center gap-1">
                    <Star size={14} fill="#fbbf24" className="text-amber-400" />
                    {model.ratingAverage?.toFixed(1)}
                  </p>
                </div>
                <div className="glass p-4 rounded-2xl text-center border-white/5">
                  <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Fans</p>
                  <p className="font-bold">{model.followerCount || '2.4K'}</p>
                </div>
                <div className="glass p-4 rounded-2xl text-center border-white/5">
                  <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Status</p>
                  <p className={`font-bold ${model.isOnline ? 'text-emerald-400' : 'text-white/40'}`}>
                    {model.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => isAuthenticated ? navigate(`/chat/${model.userId}`) : navigate('/login')}
                  className="btn-primary w-full py-5 rounded-3xl flex-center gap-3 text-lg"
                >
                  <MessageCircle size={22} /> Send Message
                </button>
                <div className="flex gap-4">
                  <button className="flex-1 glass border-white/10 py-4 rounded-3xl flex-center gap-3 font-bold hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                    <Phone size={20} className="text-emerald-500" /> ${model.callPricePerMinute}/min
                  </button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-white/60">
                  <MapPin size={18} />
                  <span>{model.country || 'International'}</span>
                </div>
                <div className="flex items-center gap-3 text-white/60">
                  <Shield size={18} />
                  <span>Verified Creator</span>
                </div>
              </div>
            </div>

            {/* Fan Club Promo */}
            <div className="mt-8 glass p-6 rounded-[32px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 flex-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div>
                  <h4 className="font-bold">Join Fan Club</h4>
                  <p className="text-xs text-white/50">Unlock exclusive media</p>
                </div>
              </div>
              <ChevronRight className="text-amber-500" size={24} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="flex gap-8 mb-8 border-b border-white/5">
              <button 
                onClick={() => setActiveTab('about')}
                className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'about' ? 'text-white' : 'text-white/40'}`}
              >
                About
                {activeTab === 'about' && (
                  <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab('media')}
                className={`pb-4 px-2 font-bold transition-all relative ${activeTab === 'media' ? 'text-white' : 'text-white/40'}`}
              >
                Media {media?.length ? `(${media.length})` : ''}
                {activeTab === 'media' && (
                  <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
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
                  className="space-y-10"
                >
                  <section>
                    <h3 className="text-xl font-bold mb-4">Bio</h3>
                    <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line">
                      {model.bio || `${model.displayName} is a premium performer on Lynkvi, known for ${model.category} content and engaging interactions. Connect today for a personalized experience.`}
                    </p>
                  </section>

                  {/* Interests / Categories */}
                  <section>
                    <h3 className="text-xl font-bold mb-4">Speaks</h3>
                    <div className="flex flex-wrap gap-3">
                      {['English', 'Spanish', 'French'].map(lang => (
                        <span key={lang} className="px-4 py-2 glass rounded-2xl border-white/5 text-sm font-medium">{lang}</span>
                      ))}
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div 
                  key="media"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {mediaLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="aspect-square glass rounded-3xl animate-pulse" />
                      ))}
                    </div>
                  ) : media && media.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {media.map((item) => (
                        <div key={item.id} className="relative aspect-square group cursor-pointer">
                          <img 
                            src={item.url} 
                            className="w-full h-full object-cover rounded-[32px] border border-white/5 group-hover:scale-[1.02] transition-transform duration-500" 
                            alt="Model Media"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex-center">
                            {item.type === 'video' ? <Video size={32} /> : <ImageIcon size={32} />}
                          </div>
                          {item.isPremium && (
                            <div className="absolute top-4 right-4 glass p-2 rounded-xl backdrop-blur-md">
                              <Lock size={16} className="text-amber-500" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 glass rounded-[40px] border border-dashed border-white/10">
                      <ImageIcon className="mx-auto mb-4 text-white/20" size={48} />
                      <p className="text-white/40">No media uploaded yet.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
