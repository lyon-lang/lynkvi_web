import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, Globe, Apple, ArrowRight } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      {/* Standalone Dark Background */}
      <div className="login-bg" />
      
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="auth-card p-10 md:p-12 rounded-[24px] w-full max-w-[380px] relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
          <p className="text-white/40 text-sm font-medium">Log in to your account to continue.</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="p-4 rounded-xl flex items-center gap-3 bg-red-500/10 border border-red-500/20">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-500/80 leading-snug">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 ml-1">Email Identifier</label>
            <div className="relative w-full">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input w-full"
                style={{ paddingLeft: '44px' }}
                placeholder="yours@example.com"
                required
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Password</label>
              <Link to="/forgot-password" title="Recovery Access?" className="text-[10px] font-black uppercase text-primary hover:text-white transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative w-full">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input w-full"
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="simple-btn w-full mt-2 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10">
          <div className="flex items-center gap-4 text-white/5 mb-8">
            <div className="h-[1px] flex-1 bg-white/5" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/10">Social Gateway</span>
            <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="social-lite flex items-center justify-center gap-2 hover:border-white/20">
              <Globe size={14} className="text-primary" /> Google
            </button>
            <button type="button" className="social-lite flex items-center justify-center gap-2 hover:border-white/20">
              <Apple size={14} /> Apple
            </button>
          </div>
        </div>

        <p className="mt-12 text-center text-[10px] font-black uppercase tracking-widest text-white/20">
          New to Lynkvi? {' '}
          <Link to="/register" className="text-primary hover:text-white transition-colors ml-1">
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
