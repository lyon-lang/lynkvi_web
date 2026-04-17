import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Phone, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { modelsService } from '../services/modelsService';
import { Link } from 'react-router-dom';

export const ModelGrid: React.FC = () => {
  const { data: models, isLoading, error } = useQuery({
    queryKey: ['featured-models'],
    queryFn: () => modelsService.getFeaturedModels(8),
  });

  if (error) {
    return (
      <div className="section-header text-red-500">
        <p>Error loading models...</p>
      </div>
    );
  }

  return (
    <section className="model-grid-section container">
      <div className="section-header">
        <h2 className="section-title">Featured <span className="gradient-text">Models</span></h2>
        <p className="section-subtitle">Connect with high-rated performers available right now.</p>
      </div>

      <div className="grid-layout">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="model-card glass h-[400px] animate-pulse bg-white/5" />
          ))
        ) : models?.length === 0 ? (
          <div className="w-full text-center text-white/50 col-span-full py-20">
            <p>No models found at the moment.</p>
          </div>
        ) : (
          models?.map((model, index) => (
            <motion.div 
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="model-card glass"
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
                  <button className="like-btn glass" onClick={(e) => e.preventDefault()}>
                    <Heart size={18} />
                  </button>
                </div>

                <div className="card-content">
                  <div className="card-header">
                    <h3 className="card-name text-white">{model.displayName}</h3>
                    <div className="card-rating">
                      <Star size={14} fill="currentColor" />
                      <span>{model.ratingAverage?.toFixed(1) || '0.0'}</span>
                    </div>
                  </div>

                  <p className="card-category">{model.category || 'Lifestyle'}</p>

                  <div className="card-footer">
                    <div className="price-tag">
                      <span className="price text-white">${model.callPricePerMinute?.toFixed(2) || '0.00'}</span>
                      <span className="unit">/ min</span>
                    </div>
                    
                    <div className="action-btns">
                      <Link to={`/chat/${model.userId}`} className="icon-btn glass" title="Send Message" onClick={(e) => e.stopPropagation()}>
                        <MessageCircle size={18} />
                      </Link>
                      <button className="icon-btn primary" title="Direct Call" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                        <Phone size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
      
      <div className="text-center mt-12">
        <Link to="/explore" className="btn-secondary no-underline inline-flex items-center gap-2 group">
          View All Creators <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
};

import { ArrowRight } from 'lucide-react';
