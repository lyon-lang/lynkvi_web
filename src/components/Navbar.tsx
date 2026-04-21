import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Globe, LogIn, User as UserIcon, LogOut, Settings, CreditCard, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowProfileMenu(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`nav-header ${scrolled ? 'scrolled' : ''}`}
    >
      <nav className="nav-container glass">
        <Link to="/" className="logo-group">
          <div className="logo-circle">
            <span className="text-white">L</span>
          </div>
          <span className="logo-text">Lynkvi</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="nav-links hidden md:flex items-center gap-8">
          <Link to="/explore" className={`nav-link ${isActive('/explore') ? 'active' : ''}`}>
            <Globe size={18} /> Explore
          </Link>
          <Link to="/chat" className={`nav-link ${isActive('/chat') ? 'active' : ''}`}>
            <MessageSquare size={18} /> Chat
          </Link>
          <Link to="/calls" className={`nav-link ${isActive('/calls') ? 'active' : ''}`}>
            <Phone size={18} /> Calls
          </Link>
        </div>

        <div className="nav-actions flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <motion.button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center gap-3 glass py-2 px-4 rounded-full border-white/20"
                style={{ padding: '8px 16px' }}
              >
                <div className="w-8 h-8 rounded-full flex-center text-xs font-bold" style={{ width: '32px', height: '32px', background: 'var(--primary-gradient)', border: '1px solid rgba(255,255,255,0.3)' }}>
                  {user?.displayName?.[0] || 'U'}
                </div>
                <span className="text-sm font-semibold hidden sm:inline">{user?.displayName}</span>
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 glass border-white/10 rounded-2xl overflow-hidden z-50 p-2 shadow-2xl"
                      style={{ width: '224px', top: '100%' }}
                    >
                      <div className="px-4 py-3 mb-2" style={{ borderBottom: '1px solid var(--border)' }}>
                        <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Account</p>
                        <p className="text-sm font-semibold text-primary flex items-center gap-2 mt-1">
                          <CreditCard size={14} /> {user?.coins || 0} Coins
                        </p>
                      </div>
                      
                      <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left" style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}>
                        <UserIcon size={18} className="text-white/50" /> Profile
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left" style={{ border: 'none', background: 'transparent', color: 'white', cursor: 'pointer' }}>
                        <Settings size={18} className="text-white/50" /> Settings
                      </button>
                      
                      <div className="my-2" style={{ height: '1px', background: 'var(--border)' }} />
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition-colors rounded-xl text-sm font-medium text-left"
                        style={{ border: 'none', background: 'transparent', color: '#ff4444', cursor: 'pointer' }}
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <Link to="/login" className="btn-secondary text-xs sm:text-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-xs sm:text-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  );
};
