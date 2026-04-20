import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Shield, Sparkles, Zap, ArrowRight } from 'lucide-react';
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

  const titleWords = "Connect with Your Influencers Like Never Before".split(" ");

  return (
    <section 
      ref={containerRef} 
      className="hero-section" 
      onMouseMove={handleMouseMove}
    >
      <motion.div style={{ y: y1, opacity }} className="hero-glow" />
      
      <div className="container hero-content">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="hero-badge animate-float"
        >
          <Sparkles size={16} />
          <span>New: Global Live Gifting is here!</span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-[1.1]"
        >
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2 + i * 0.05,
              }}
              className={word === "Influencers" ? "text-primary" : "text-white"}
              style={{ display: 'inline-block', marginRight: '0.25em' }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="hero-subtitle"
        >
          Experience high-quality video calls, real-time messaging, and exclusive content in a secure, premium environment.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Link 
            to="/explore"
            className="btn-primary"
          >
            Explore Now <ArrowRight size={20} className="ml-2" />
          </Link>
          <Link 
            to="/register"
            className="btn-secondary"
          >
            Become a Creator
          </Link>
        </motion.div>

        <motion.div 
          style={{ y: y2 }}
          className="hero-stats"
        >
          {[
            { icon: Zap, value: "124k+", label: "Active Users" },
            { icon: Shield, value: "Secure", label: "Verified Profiles" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + i * 0.2 }}
              className="hero-stat"
            >
              <stat.icon size={20} className="stat-icon" />
              <div>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Decorative Floating Elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute bottom-20 left-10 opacity-20 pointer-events-none"
      >
        <div className="w-16 h-16 rounded-xl glass border-primary rotate-12" />
      </motion.div>
    </section>
  );
};
