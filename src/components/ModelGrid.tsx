import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { modelsService } from '../services/modelsService';
import { Link } from 'react-router-dom';
import { ModelCard } from './ModelCard';

export const ModelGrid: React.FC = () => {
  const { data: models, isLoading, error } = useQuery({
    queryKey: ['featured-models'],
    queryFn: () => modelsService.getFeaturedModels(8),
  });

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>Error loading models...</p>
      </div>
    );
  }

  return (
    <section className="py-20 container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div style={{ maxWidth: '600px' }}>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Featured <span className="text-primary">Models</span>
          </h2>
          <p className="text-lg text-white/50">
            Connect with high-rated performers available right now.
          </p>
        </div>
        <Link to="/explore" className="btn-secondary hidden md:inline-flex items-center">
          View All <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>

      <div className="grid-layout">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="model-card h-full" style={{ height: '300px', animation: 'pulse 1.5s infinite' }} />
          ))
        ) : models?.length === 0 ? (
          <div className="w-full text-center py-20 glass rounded-3xl" style={{ borderStyle: 'dashed' }}>
            <p className="text-xl text-white/40 font-bold">No models found at the moment.</p>
          </div>
        ) : (
          models?.map((model, index) => (
            <ModelCard key={model.id} model={model} index={index} />
          ))
        )}
      </div>
      
      <div className="text-center mt-12 md:hidden">
        <Link to="/explore" className="btn-secondary w-full py-4 text-center">
          View All Creators <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </section>
  );
};
