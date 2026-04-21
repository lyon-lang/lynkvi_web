import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, MessageCircle, Phone, MapPin, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { modelsService, type Model } from '../services/modelsService';
import { ModelCard } from '../components/ModelCard';
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
          <h1 className="text-4xl font-black mb-2">Discovery</h1>
          <p className="text-white/50">Find and connect with top-rated performers.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" style={{ flex: 1, minWidth: '280px' }}>
            <Search className="absolute text-white/30" size={20} style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Search creators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass w-full rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-primary/50 transition-all font-semibold"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)' }}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-2xl border transition-all glass flex-center ${showFilters ? 'text-primary' : 'text-white/70'}`}
            style={{ borderColor: showFilters ? 'var(--primary)' : 'var(--border)', cursor: 'pointer' }}
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
            className={`px-6 py-3 rounded-full whitespace-nowrap transition-all font-bold text-sm ${
              category === cat 
                ? 'bg-primary border-primary text-white' 
                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
            }`}
            style={{ border: '1px solid', cursor: 'pointer', background: category === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)', borderColor: category === cat ? 'var(--primary)' : 'var(--border)' }}
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
            <div className="glass p-6 rounded-3xl flex flex-wrap gap-8" style={{ border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setOnlyOnline(!onlyOnline)}>
                <div className={`w-6 h-6 rounded-lg border flex-center transition-all ${onlyOnline ? 'bg-primary' : ''}`} style={{ borderColor: onlyOnline ? 'var(--primary)' : 'var(--border)' }}>
                  {onlyOnline && <CheckCircle2 size={16} className="text-white" />}
                </div>
                <span className="text-sm font-bold text-white/80">Show only online models</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid-layout">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="model-card glass h-full" style={{ height: '300px', animation: 'pulse 1.5s infinite' }} />
          ))
        ) : filteredModels?.length === 0 ? (
          <div className="w-full text-center py-20 glass rounded-3xl" style={{ borderStyle: 'dashed' }}>
            <p className="text-xl text-white/40 font-bold">No models found matching your criteria.</p>
            <button onClick={() => {setCategory('All'); setSearch(''); setOnlyOnline(false);}} className="text-primary mt-4 font-bold" style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>Clear all filters</button>
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
