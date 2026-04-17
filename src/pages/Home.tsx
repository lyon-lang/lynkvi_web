import React from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { ModelGrid } from '../components/ModelGrid';

export const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <ModelGrid />
      </motion.div>
      
      <section className="cta-section container">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="cta-card glass ripple-effect"
        >
          <h2 className="cta-title">Ready to start your journey?</h2>
          <p className="cta-text">Join thousands of creators and fans connecting every day.</p>
          <div className="hero-btns">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="btn-primary"
            >
              Join as Creator
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hero-btn-secondary"
            >
              Create Account
            </motion.button>
          </div>
        </motion.div>
      </section>
    </>
  );
};
