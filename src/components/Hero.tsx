import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Shield, Sparkles, Zap, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Scroll Effect
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Mouse Follow Effect
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set((clientX / innerWidth - 0.5) * 40);
    mouseY.set((clientY / innerHeight - 0.5) * 40);
  };

  const titleWords = "Experience Premium Interaction with Top Creators".split(" ");

  return (
    <section 
      ref={containerRef} 
      className="hero-section py-20 relative overflow-hidden" 
      onMouseMove={handleMouseMove}
      style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}
    >
      <motion.div style={{ y: y1, opacity }} className="hero-glow" />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="glass px-6 py-2 rounded-full flex items-center gap-2 mb-10"
            style={{ border: '1px solid rgba(255, 45, 85, 0.4)', background: 'rgba(255, 45, 85, 0.05)' }}
          >
            <Sparkles size={16} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Global Live Interaction Platform</span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
            style={{ maxWidth: '1000px', lineHeight: '0.95', color: 'white' }}
          >
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.2 + i * 0.08,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className={word === "Premium" || word === "Creators" ? "text-primary" : "text-white"}
                style={{ display: 'inline-block', marginRight: '0.15em' }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-lg md:text-xl text-white/50 mb-12 font-medium"
            style={{ maxWidth: '700px', lineHeight: '1.6' }}
          >
            Connect through high-quality video calls, real-time messaging, and exclusive content in a secure, encrypted environment.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-6 mb-20"
          >
            <Link 
              to="/explore"
              className="btn-primary"
              style={{ padding: '20px 48px', fontSize: '1.1rem' }}
            >
              Explore Now <ArrowRight size={20} className="ml-2" />
            </Link>
            <Link 
              to="/register"
              className="btn-secondary"
              style={{ padding: '20px 48px', fontSize: '1.1rem' }}
            >
              Become a Creator
            </Link>
          </motion.div>

          <motion.div 
            style={{ y: y2 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            {[
              { icon: Zap, value: "124k+", label: "Active Users" },
              { icon: Shield, value: "Secure", label: "Encrypted" },
              { icon: Star, value: "4.9/5", label: "User Rating" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + i * 0.2 }}
                className="flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-2xl glass flex-center" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                  <stat.icon size={24} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
