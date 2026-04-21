import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, MessageCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const BottomNav: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Hide BottomNav on Model Profile pages to avoid overlap with action bar
  const isProfilePage = location.pathname.startsWith('/profile/');
  if (isProfilePage) return null;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { 
      icon: User, 
      label: 'Profile', 
      path: isAuthenticated ? `/profile/${user?.id}` : '/login' 
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass mx-4 mb-4 rounded-3xl h-16 flex items-center justify-around px-2 shadow-2xl" style={{ border: '1px solid var(--border)' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex flex-col items-center gap-1 transition-all duration-300 relative px-4 ${
                isActive ? 'text-primary' : 'text-white/40'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active"
                    className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
