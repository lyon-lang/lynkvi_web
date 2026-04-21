import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Phone, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Model } from '../services/modelsService';

interface ModelCardProps {
  model: Model;
  index: number;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, index }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="model-card"
    >
      <Link to={`/profile/${model.userId}`} style={{ textDecoration: 'none' }}>
        <div className="card-image-wrapper relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          {imgError || !model.profileImageUrl ? (
            <div className="w-full h-full flex-center bg-zinc-900 text-white/20">
              <User size={64} />
            </div>
          ) : (
            <img 
              src={model.profileImageUrl} 
              alt={model.displayName} 
              className="card-image w-full h-full" 
              style={{ objectFit: 'cover' }}
              onError={() => setImgError(true)}
            />
          )}
          
          {/* Status Badge */}
          {model.isOnline && (
            <div className="absolute top-3 left-3 flex items-center gap-2 glass px-3 py-1.5 rounded-full z-10 box-shadow-sm">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--online)' }} />
              <span className="text-[10px] uppercase font-black tracking-tighter text-white">Online</span>
            </div>
          )}

          {/* Bottom Overlay & Info */}
          <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 30%, transparent 60%)' }} />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="glass px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-md text-white/80">
                <MapPin size={10} className="text-primary" /> 
                <span>{model.country || 'Global'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-xl leading-tight" style={{ margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {model.displayName}
              </h3>
              <div className="flex items-center gap-1 text-accent font-black text-sm" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                <Star size={14} fill="currentColor" />
                <span>{model.ratingAverage?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-content p-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none mb-1">Rate</span>
              <div className="text-lg font-black text-primary">
                ${model.callPricePerMinute?.toFixed(1) || '0.0'}<span className="text-xs text-white/40 ml-0.5">/min</span>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="glass flex-center rounded-2xl hover:bg-white/10 transition-colors" style={{ width: '44px', height: '44px', border: '1px solid var(--border)' }}>
                <MessageCircle size={18} className="text-white/60" />
              </div>
              <div className="flex-center rounded-2xl hover:brightness-110 transition-all" style={{ width: '44px', height: '44px', background: 'var(--primary-gradient)', boxShadow: '0 8px 16px rgba(255,45,85,0.3)' }}>
                <Phone size={18} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
