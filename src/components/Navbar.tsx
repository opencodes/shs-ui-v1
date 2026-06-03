/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, AudioLines, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface NavbarProps {
  onNavClick: (sectionId: string) => void;
  activeSection: string;
  currentUser: UserProfile | null;
  currentView: string;
  onViewChange: (view: 'home' | 'login' | 'signup' | 'profile' | 'admin' | 'vendors') => void;
}

export default function Navbar({ onNavClick, activeSection, currentUser, currentView, onViewChange }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: 'hero' },
    { label: 'Vendors', href: 'vendors' },
    { label: 'Auralis Studio', href: 'studio' },
    { label: 'Auralis Agents', href: 'agents' },
    { label: 'Live Sandbox', href: 'sandbox' },
    { label: 'Enterprise', href: 'enterprise' },
    { label: 'Pricing', href: 'pricing' }
  ];

  const handleNav = (id: string) => {
    setIsOpen(false);
    if (id === 'vendors') {
      onViewChange('vendors');
      return;
    }
    onViewChange('home');
    setTimeout(() => {
      onNavClick(id);
    }, 50);
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[#E7E7E4]/70 bg-white/85 backdrop-blur-md transition-all">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex justify-between items-center h-[72px]">
        {/* Brand Logo */}
        <div className="flex items-center gap-12">
          <button 
            id="nav-logo"
            onClick={() => handleNav('hero')}
            className="flex items-center gap-2 text-[20px] font-bold tracking-tighter text-zinc-950 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center">
              <AudioLines className="w-5 h-5 text-white animate-pulse-slow" />
            </div>
            <span className="font-sans font-semibold">Auralis</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                id={`nav-${item.href}`}
                onClick={() => handleNav(item.href)}
                className={`text-sm font-medium tracking-tight transition-colors duration-200 cursor-pointer ${
                  (item.href === 'vendors' && currentView === 'vendors') || (currentView === 'home' && activeSection === item.href)
                    ? 'text-black font-semibold'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {currentUser?.role === 'admin' && (
              <button
                id="nav-admin-console"
                onClick={() => onViewChange('admin')}
                className={`text-sm font-bold tracking-tight transition-colors duration-200 cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'text-indigo-600 font-extrabold'
                    : 'text-indigo-500 hover:text-indigo-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Console
              </button>
            )}
          </div>
        </div>

        {/* Right Call-To-Action */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <button
                id="nav-profile-btn"
                onClick={() => onViewChange('profile')}
                className={`text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                  currentView === 'profile'
                    ? 'bg-zinc-50 text-black border-zinc-300'
                    : 'text-zinc-500 hover:text-black border-transparent hover:border-zinc-200'
                }`}
              >
                <User className="w-4 h-4 text-zinc-400" />
                My Profile
              </button>

              <button
                id="nav-user-avatar"
                onClick={() => onViewChange('profile')}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black border transition-all cursor-pointer ${
                  currentUser.role === 'admin'
                    ? 'bg-black text-white border-black'
                    : 'bg-indigo-600 text-white border-indigo-500'
                }`}
              >
                {currentUser.name.substring(0, 2).toUpperCase()}
              </button>
            </div>
          ) : (
            <>
              <button
                id="nav-login-btn"
                onClick={() => onViewChange('login')}
                className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black transition-colors cursor-pointer"
              >
                Log in
              </button>
              <button
                id="nav-signup-btn"
                onClick={() => onViewChange('signup')}
                className="bg-black text-white hover:bg-zinc-800 transition-colors px-5 py-2.5 rounded-full text-sm font-semibold tracking-tight shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                Sign up <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          {currentUser && (
            <button
              id="nav-mobile-avatar-btn"
              onClick={() => { setIsOpen(false); onViewChange('profile'); }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold border ${
                currentUser.role === 'admin' ? 'bg-black text-white' : 'bg-indigo-600 text-white'
              }`}
            >
              {currentUser.name.substring(0, 2).toUpperCase()}
            </button>
          )}
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="text-zinc-800 p-2 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#E7E7E4] bg-white overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  id={`nav-mobile-${item.href}`}
                  onClick={() => handleNav(item.href)}
                  className={`text-left py-2.5 text-base font-medium border-b border-[#E7E7E4]/40 last:border-0 ${
                    (item.href === 'vendors' && currentView === 'vendors') || (currentView === 'home' && activeSection === item.href) ? 'text-black font-semibold' : 'text-zinc-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {currentUser?.role === 'admin' && (
                <button
                  id="nav-mobile-admin"
                  onClick={() => { setIsOpen(false); onViewChange('admin'); }}
                  className="text-indigo-600 font-bold border-b border-[#E7E7E4]/40 last:border-0 flex items-center gap-1.5 py-2.5 text-base text-left"
                >
                  <Shield className="w-4 h-4" />
                  Admin Console
                </button>
              )}

              <div className="flex flex-col gap-3 pt-4 border-t border-[#E7E7E4]/80">
                {currentUser ? (
                  <>
                    <button
                      id="nav-mobile-profile"
                      onClick={() => { setIsOpen(false); onViewChange('profile'); }}
                      className="w-full text-center py-3 border border-[#E7E7E4] rounded-full text-sm font-semibold text-zinc-700"
                    >
                      Configure Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="nav-mobile-login"
                      onClick={() => { setIsOpen(false); onViewChange('login'); }}
                      className="w-full text-center py-3 border border-[#E7E7E4] rounded-full text-sm font-semibold text-zinc-700"
                    >
                      Log In Session
                    </button>
                    <button
                      id="nav-mobile-signup"
                      onClick={() => { setIsOpen(false); onViewChange('signup'); }}
                      className="w-full text-center py-3 bg-black text-white rounded-full text-sm font-semibold shadow-sm"
                    >
                      Sign up free
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
