import React from 'react';
import { motion } from 'framer-motion';

export const DynamicBackground: React.FC = () => {
  return (
    <div className="bg-fixed bg-inset-0 bg-z-negative bg-overflow-hidden bg-pointer-events-none">
      {/* Primary Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="bg-absolute glow-1 rounded-full"
      />
      
      {/* Secondary Glow */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="bg-absolute glow-2 rounded-full"
      />

      {/* Floating Accent */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.8, 1.1, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="bg-absolute glow-3 rounded-full"
      />

      <div className="bg-absolute bg-inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] noise-overlay" />
    </div>
  );
};
