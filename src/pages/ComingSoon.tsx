import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const ComingSoon: React.FC<{ feature: string }> = ({ feature }) => {
  const navigate = useNavigate();

  return (
    <div className="container py-20 flex-center flex-col text-center min-h-[70vh]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-24 h-24 rounded-[32px] bg-amber-500/10 border border-amber-500/20 flex-center mb-8 text-amber-500"
      >
        <Construction size={48} />
      </motion.div>
      
      <h1 className="text-4xl font-extrabold mb-4">{feature} Coming Soon</h1>
      <p className="text-white/40 max-w-md mx-auto mb-10 text-lg">
        We're working hard to bring the {feature.toLowerCase()} feature to Lynkvi Web. 
        In the meantime, you can access this feature on our mobile app.
      </p>

      <div className="flex gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="btn-secondary px-8 py-4 rounded-2xl flex items-center gap-2 border border-white/10"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
        <Link to="/" className="btn-primary px-8 py-4 rounded-2xl no-underline">
          Return Home
        </Link>
      </div>
    </div>
  );
};
