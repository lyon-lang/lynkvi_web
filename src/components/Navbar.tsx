import React, { useState, useEffect } from 'react';
import { MessageSquare, Phone, Globe, LogIn, User as UserIcon, LogOut, Settings, CreditCard } from 'lucide-react';
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
        <Link to="/" className="logo-group no-underline">
          <div className="logo-circle">
            <span>L</span>
          </div>
          <span className="logo-text">Lynkvi</span>
        </Link>

        <div className="nav-links">
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

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="relative">
              <motion.button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary flex items-center gap-3 glass py-2 px-4 rounded-full border-white/20"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex-center text-xs font-bold border border-white/30">
                  {user?.displayName?.[0] || 'U'}
                </div>
                <span className="text-sm font-semibold max-w-[100px] truncate">{user?.displayName}</span>
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 glass border-white/10 rounded-2xl overflow-hidden z-50 p-2 shadow-2xl"
                    >
                      <div className="px-4 py-3 border-b border-white/10 mb-2">
                        <p className="text-xs text-white/40 uppercase font-bold tracking-wider">Account</p>
                        <p className="text-sm font-semibold text-secondary flex items-center gap-2 mt-1">
                          <CreditCard size={14} /> {user?.coins || 0} Coins
                        </p>
                      </div>
                      
                      <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left">
                        <UserIcon size={18} className="text-white/50" /> Profile
                      </button>
                      <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-white/5 transition-colors rounded-xl text-sm font-medium text-left">
                        <Settings size={18} className="text-white/50" /> Settings
                      </button>
                      
                      <div className="h-px bg-white/10 my-2" />
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-500/10 transition-colors rounded-xl text-sm font-medium text-red-400 text-left"
                      >
                        <LogOut size={18} /> Sign Out
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary no-underline">
                <LogIn size={18} /> Sign In
              </Link>
              <Link to="/register" className="btn-primary no-underline">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};
