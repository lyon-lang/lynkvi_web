import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNav } from './BottomNav';
import { DynamicBackground } from './DynamicBackground';
import { motion, useScroll, useSpring } from 'framer-motion';

export const Layout: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="app-wrapper">
      <DynamicBackground />
      
      {!isAuthPage && (
        <>
          <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary origin-left z-[100]"
            style={{ scaleX }}
          />
          <Navbar />
        </>
      )}
      
      <main className={`flex-1 ${!isAuthPage ? 'pb-24 md:pb-0 md:pt-20' : ''}`}>
        <Outlet />
      </main>

      {!isAuthPage && <BottomNav />}
      
      {!isAuthPage && (
        <footer className="footer container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="logo-group">
                <div className="logo-circle animate-pulse">
                  <span>L</span>
                </div>
                <span className="logo-text">Lynkvi</span>
              </div>
              <p className="footer-tagline">Connecting the world through premium interaction.</p>
            </div>
            
            <div className="footer-links-group">
              {[
                { title: "Platform", links: ["Explore", "Creators", "Safety"] },
                { title: "Company", links: ["About", "Careers", "Contact"] },
                { title: "Legal", links: ["Privacy", "Terms", "Cookies"] }
              ].map((col, i) => (
                <div key={i} className="footer-col">
                  <h4>{col.title}</h4>
                  {col.links.map((link, j) => (
                    <motion.a 
                      key={j} 
                      href="#" 
                      whileHover={{ x: 5, color: "white" }}
                    >
                      {link}
                    </motion.a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Lynkvi. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};
