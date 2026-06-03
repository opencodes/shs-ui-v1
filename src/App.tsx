/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import VendorsPage from './components/VendorsPage';
import Footer from './components/Footer';
import LoginSignup from './components/LoginSignup';
import ProfilePage from './components/ProfilePage';
import AdminPage from './components/AdminPage';
import { playSynthChime } from './utils/audioEngine';
import { HelpCircle, Sparkles, X, Info, ShieldCheck } from 'lucide-react';
import { UserProfile } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'signup' | 'profile' | 'admin' | 'vendors'>('home');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('aur_user_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [activeSection, setActiveSection] = useState('hero');
  const [showNotification, setShowNotification] = useState(true);

  // Dynamic view change router
  const handleViewChange = (view: 'home' | 'login' | 'signup' | 'profile' | 'admin' | 'vendors') => {
    setCurrentView(view);
    window.scrollTo({ top: 0 });
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    localStorage.setItem('aur_user_session', JSON.stringify(profile));
    setCurrentView('profile');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aur_user_session');
    setCurrentView('home');
  };

  const handleProfileChange = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    localStorage.setItem('aur_user_session', JSON.stringify(updated));
  };

  // Smooth scroll helper
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // height offset of nav bar
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Dynamic active section spy on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

      const sections = ['hero', 'overview', 'studio', 'agents'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-950 flex flex-col relative overflow-hidden">
      
      {/* 1. Global Navigation - Hidden on admin console to mimic native saas admin dashboards */}
      {currentView !== 'admin' && (
        <Navbar 
          onNavClick={handleNavClick} 
          activeSection={activeSection} 
          currentUser={currentUser}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      )}

      {/* 2. Floating Live Beta Notification Box - Hidden on admin panel */}
      {currentView !== 'admin' && (
        <AnimatePresence>
          {showNotification && (
            <motion.div
              id="global-banner"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="fixed bottom-6 right-6 z-40 max-w-sm bg-black text-white p-4 rounded-2xl shadow-2xl border border-zinc-800 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2 bg-indigo-600 rounded text-[10px] font-bold uppercase tracking-wider">
                    sandbox ACTIVE
                  </div>
                  <span className="text-xs text-zinc-400 font-semibold font-mono">
                    Engine v4.2 PRO
                  </span>
                </div>
                <button
                  id="close-banner"
                  onClick={() => { setShowNotification(false); playSynthChime(); }}
                  className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3 items-start pr-2">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="text-xs font-bold font-sans text-zinc-100 leading-snug">
                    Interactive Audio Engaged
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Type speech prompts, trigger synthesized foley sweeps, or chat live with the synthetic operators. Fully audible feedback is active.
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  id="banner-ack-btn"
                  onClick={() => { setShowNotification(false); playSynthChime(); }}
                  className="text-[10px] font-extrabold uppercase tracking-widest text-white hover:underline"
                >
                  Dismiss tips
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div className={`${currentView === 'admin' ? '' : 'pt-[72px]'} flex-grow flex flex-col`}>
        {currentView === 'home' && (
          <Home onNavClick={handleNavClick} />
        )}

        {currentView === 'vendors' && (
          <VendorsPage />
        )}

        {currentView === 'login' && (
          <LoginSignup initialMode="login" onSuccess={handleAuthSuccess} onNavToHome={() => handleViewChange('home')} />
        )}

        {currentView === 'signup' && (
          <LoginSignup initialMode="signup" onSuccess={handleAuthSuccess} onNavToHome={() => handleViewChange('home')} />
        )}

        {currentView === 'profile' && currentUser && (
          <ProfilePage 
            profile={currentUser} 
            onChangeProfile={handleProfileChange} 
            onLogout={handleLogout} 
            onNavigateToSandbox={() => handleViewChange('home')} 
          />
        )}

        {currentView === 'profile' && !currentUser && (
          <LoginSignup initialMode="login" onSuccess={handleAuthSuccess} onNavToHome={() => handleViewChange('home')} />
        )}

        {currentView === 'admin' && (
          <AdminPage onExitDashboard={() => handleViewChange('home')} />
        )}
      </div>

      {/* 4. Complete footer and signoffs */}
      {currentView !== 'admin' && (
        <Footer onNavClick={handleNavClick} />
      )}
    </div>
  );
}
