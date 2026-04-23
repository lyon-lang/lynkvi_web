import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Sparkles, Globe, Apple, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:px-6 py-12 md:py-20">
      {/* Dynamic Background */}
      <div className="login-bg" />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-heavy p-8 md:p-14 rounded-[40px] w-full max-w-[460px] relative z-10"
        style={{ 
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        <div className="text-center mb-10">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(255,45,85,0.1)', border: '1px solid rgba(255,45,85,0.3)' }}
          >
            <Sparkles size={14} className="text-primary animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-widest text-white">Elite Access</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-white">
            Welcome <span className="text-primary">Back</span>
          </h1>
          
          <p className="text-white/40 text-sm md:text-base font-medium max-w-[280px] mx-auto leading-relaxed">
            Elevate your presence and connect with world-class creators.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="p-4 rounded-2xl flex items-center gap-3 bg-red-500/10 border border-red-500/20">
                <AlertCircle size={18} className="text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-500/90">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Identifier</label>
            <div className="input-group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass w-full"
                placeholder="Email Address"
                required
              />
              <Mail className="input-icon" size={20} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Credential</label>
            <div className="input-group">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass w-full"
                placeholder="Password"
                required
              />
              <Lock className="input-icon" size={18} />
            </div>
            <div className="flex justify-end pr-1">
              <Link to="/forgot-password" title="Recovery Access?" className="text-[10px] font-black uppercase text-white/20 hover:text-primary transition-colors tracking-tighter">
                Lost Access?
              </Link>
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={loading}
            className="shimmer-btn btn-primary w-full py-5 rounded-2xl flex-center gap-3 font-black text-lg shadow-xl shadow-primary/20 transition-all"
          >
            {loading ? 'Verifying...' : (
              <>
                Sign In <ArrowRight size={22} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-10">
          <div className="flex items-center gap-4 text-white/5 mb-8">
            <div className="h-[1px] flex-1 bg-current" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/10">Or connect with</span>
            <div className="h-[1px] flex-1 bg-current" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              type="button"
              whileHover={{ y: -2, background: 'rgba(255,255,255,0.1)' }}
              className="social-btn py-4 flex-center gap-2 font-bold text-[11px] tracking-wide"
            >
              <Globe size={16} /> Google
            </motion.button>
            <motion.button 
              type="button"
              whileHover={{ y: -2, background: 'rgba(255,255,255,0.1)' }}
              className="social-btn py-4 flex-center gap-2 font-bold text-[11px] tracking-wide"
            >
              <Apple size={16} /> Apple
            </motion.button>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-white/20">
          New here? {' '}
          <Link to="/register" className="text-primary hover:text-secondary transition-colors ml-1">
            Apply for account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
