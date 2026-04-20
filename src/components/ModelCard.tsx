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
    <Link to={`/profile/${model.userId}`} className="no-underline">
      <div className="card-image-wrapper">
        <img 
          src={model.profileImageUrl || 'https://via.placeholder.com/400x600'} 
          alt={model.displayName} 
          className="card-image" 
        />
        {model.isOnline && (
          <div className="online-badge">
            <div className="online-dot" />
            <span>Online</span>
          </div>
        )}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
          <div className="glass px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 backdrop-blur-md">
            <MapPin size={10} className="text-white/70" /> {model.country || 'Global'}
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="card-name text-white">{model.displayName}</h3>
          <div className="card-rating">
            <Star size={12} fill="currentColor" />
            <span>{model.ratingAverage?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-[12px] font-bold text-primary">
            ${model.callPricePerMinute?.toFixed(1) || '0.0'}/min
          </div>
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full glass flex-center">
              <MessageCircle size={14} className="text-white/70" />
            </div>
            <div className="w-7 h-7 rounded-full bg-primary flex-center shadow-lg shadow-primary/20">
              <Phone size={14} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);
