import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle, Sparkles, Chrome, Apple } from 'lucide-react';

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
    <div className="flex-center min-h-screen relative overflow-hidden px-4 py-20">
      {/* Immersive Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary opacity-20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary opacity-10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="glass p-10 md:p-14 rounded-[40px] w-full max-w-md relative z-10"
        style={{ border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(255,45,85,0.05)', border: '1px solid rgba(255,45,85,0.2)' }}
          >
            <Sparkles size={14} className="text-primary" />
            <span className="text-[10px] uppercase font-black tracking-widest text-white/90">Premium Experience</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Welcome Back</h1>
          <p className="text-white/40 font-medium">Continue your journey in the world of premium connections.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-5 rounded-[24px]"
            style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="input-group">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-glass"
              placeholder="Email Address"
              required
            />
            <Mail className="input-icon" size={20} />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-glass"
              placeholder="Password"
              required
            />
            <Lock className="input-icon" size={20} />
          </div>

          <div className="flex justify-end pr-2">
            <Link to="/forgot-password" size="sm" className="text-xs font-bold text-white/30 hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-5 rounded-2xl flex-center gap-3 font-black text-lg transition-all group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? 'Authenticating...' : (
                <>
                  Sign In <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-10 flex items-center gap-4 text-white/10">
          <div className="h-[1px] flex-1 bg-current" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Third-party access</span>
          <div className="h-[1px] flex-1 bg-current" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <button className="flex-center gap-2 glass py-4 rounded-2xl text-xs font-bold hover:bg-white/5 transition-colors">
            <Chrome size={18} /> Google
          </button>
          <button className="flex-center gap-2 glass py-4 rounded-2xl text-xs font-bold hover:bg-white/5 transition-colors">
            <Apple size={18} /> Apple ID
          </button>
        </div>

        <p className="mt-12 text-center text-white/40 text-sm font-medium">
          New to Lynkvi? {' '}
          <Link to="/register" className="text-primary hover:text-secondary transition-colors font-black">
            Create account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
