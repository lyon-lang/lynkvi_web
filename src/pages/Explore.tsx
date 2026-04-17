import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, MessageCircle, Phone, Heart, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { modelsService, type Model } from '../services/modelsService';
import { Link } from 'react-router-dom';

const CATEGORIES = ['All', 'Lifestyle', 'Gaming', 'Fitness', 'ASMR', 'Cosplay', 'Music'];

export const Explore: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [onlyOnline, setOnlyOnline] = useState(false);

  const { data: models, isLoading } = useQuery({
    queryKey: ['models', category, onlyOnline],
    queryFn: () => modelsService.getAllModels({ 
      category: category === 'All' ? undefined : category,
      isOnline: onlyOnline || undefined
    }),
  });

  const filteredModels = models?.filter(m => 
    m.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-10">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold mb-2">Discovery</h1>
          <p className="text-white/50">Find and connect with top-rated performers.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:border-primary/50 transition-all w-full md:w-80 glass"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-2xl border transition-all glass ${showFilters ? 'border-primary text-primary' : 'border-white/10 text-white/70'}`}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all border ${
              category === cat 
                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-10"
          >
            <div className="glass p-6 rounded-3xl border border-white/10 flex flex-wrap gap-8">
              <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setOnlyOnline(!onlyOnline)}>
                <div className={`w-6 h-6 rounded-md border flex-center transition-all ${onlyOnline ? 'bg-primary border-primary' : 'border-white/20'}`}>
                  {onlyOnline && <CheckCircle2 size={16} className="text-white" />}
                </div>
                <span className="text-sm font-medium">Show only online models</span>
              </div>
              {/* Add more filters as needed */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid-layout">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="model-card glass h-[400px] animate-pulse bg-white/5" />
          ))
        ) : filteredModels?.length === 0 ? (
          <div className="w-full text-center text-white/50 col-span-full py-20 glass rounded-3xl border border-dashed border-white/10">
            <p className="text-xl">No models found matching your criteria.</p>
            <button onClick={() => {setCategory('All'); setSearch(''); setOnlyOnline(false);}} className="text-primary mt-4 font-semibold">Clear all filters</button>
          </div>
        ) : (
          filteredModels?.map((model, index) => (
            <ModelCard key={model.id} model={model} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

const ModelCard: React.FC<{ model: Model; index: number }> = ({ model, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
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
        <button className="like-btn glass" onClick={(e) => { e.preventDefault(); /* TODO: Like */ }}>
          <Heart size={18} fill={model.isFavorited ? "currentColor" : "none"} className={model.isFavorited ? "text-red-500" : ""} />
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
            <button className="icon-btn primary" title="Direct Call" onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* TODO: Call */ }}>
              <Phone size={18} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);
