import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Model } from '../services/modelsService';

interface ModelCardProps {
  model: Model;
  index: number;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="model-card"
  >
    <Link to={`/profile/${model.userId}`} style={{ textDecoration: 'none' }}>
      <div className="card-image-wrapper">
        <img 
          src={model.profileImageUrl || 'https://via.placeholder.com/400x600'} 
          alt={model.displayName} 
          className="card-image w-full h-full" 
          style={{ objectFit: 'cover' }}
        />
        {model.isOnline && (
          <div className="online-badge">
            <div className="online-dot" />
            <span>Online</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
          <div className="glass px-2 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
            <MapPin size={10} className="text-white/70" /> 
            <span>{model.country || 'Global'}</span>
          </div>
        </div>
      </div>

      <div className="card-content p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-white font-bold text-lg" style={{ margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {model.displayName}
          </h3>
          <div className="flex items-center gap-1 text-accent font-bold text-sm">
            <Star size={12} fill="currentColor" />
            <span>{model.ratingAverage?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm font-black text-primary">
            ${model.callPricePerMinute?.toFixed(1) || '0.0'}/min
          </div>
          <div className="flex gap-2">
            <div className="glass flex-center rounded-full" style={{ width: '32px', height: '32px' }}>
              <MessageCircle size={14} className="text-white/70" />
            </div>
            <div className="flex-center rounded-full" style={{ width: '32px', height: '32px', background: 'var(--primary)', boxShadow: '0 4px 12px rgba(255,45,85,0.3)' }}>
              <Phone size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);
