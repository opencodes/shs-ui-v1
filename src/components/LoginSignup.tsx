/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Mail, Lock, User, Sparkles, Server, Zap } from 'lucide-react';
import { playProceduralSFX, playSynthChime } from '../utils/audioEngine';
import { UserProfile } from '../types';

interface LoginSignupProps {
  onSuccess: (profile: UserProfile) => void;
  initialMode?: 'login' | 'signup';
  onNavToHome: () => void;
}

export default function LoginSignup({ onSuccess, initialMode = 'login', onNavToHome }: LoginSignupProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const playChime = () => {
    playSynthChime();
  };

  const handleQuickLogin = (role: 'admin' | 'user') => {
    setIsSubmitting(true);
    playProceduralSFX('chime');
    
    setTimeout(() => {
      let mockProfile: UserProfile;

      if (role === 'admin') {
        mockProfile = {
          name: 'Sarah Jenkins',
          email: 'sarah.jenkins@auralis.io',
          role: 'admin',
          tier: 'Enterprise Elite',
          apiKey: 'aur_live_9a8b7c6d5e4f3g2h1i',
          voiceQuotaUsed: 21.4,
          voiceQuotaLimit: 100.0,
          createdAt: '2026-01-15'
        };
      } else {
        mockProfile = {
          name: 'Alex Rivera',
          email: 'alex.rivera@devmail.com',
          role: 'user',
          tier: 'Developer Pro',
          apiKey: 'aur_live_1d2e3f4g5h6i7j8k9l',
          voiceQuotaUsed: 1.8,
          voiceQuotaLimit: 10.0,
          createdAt: '2026-04-10'
        };
      }

      setIsSubmitting(false);
      onSuccess(mockProfile);
      playProceduralSFX('sparkle');
    }, 850);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please completely fill in email and password lines.');
      playProceduralSFX('laser');
      return;
    }

    if (mode === 'signup' && !fullName) {
      setErrorMessage('Full name is required to initialize customized neural presets.');
      playProceduralSFX('laser');
      return;
    }

    setIsSubmitting(true);
    playProceduralSFX('chime');

    setTimeout(() => {
      const mockProfile: UserProfile = {
        name: mode === 'signup' ? fullName : 'Loyal Explorer',
        email: email,
        role: 'user', // Default is user role, can be toggled in profile interface
        tier: 'Free Trial',
        apiKey: 'aur_live_' + Math.random().toString(36).substr(2, 18),
        voiceQuotaUsed: 0.0,
        voiceQuotaLimit: 2.0,
        createdAt: new Date().toISOString().split('T')[0]
      };

      setIsSubmitting(false);
      onSuccess(mockProfile);
      playProceduralSFX('sparkle');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6 bg-white shrink-0 relative overflow-hidden">
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[10%] left-[20%] w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-indigo-50/50 to-blue-50/60 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-purple-50/50 to-pink-50/60 blur-[100px]" />
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10 py-10">
        
        {/* Left Side Section: Visual Splash & Benefits */}
        <div className="hidden lg:flex lg:col-span-6 flex-col pr-4 select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full w-fit mb-6 text-indigo-600">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase">Auralis Platform v4.2</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.08] font-sans">
            The next generation of <span className="text-indigo-600 bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text">conversational AI</span> audio.
          </h1>
          
          <p className="text-sm font-medium text-zinc-500 mt-4 leading-relaxed max-w-sm">
            Connect to the ultimate high-fidelity neural voice pipeline. Accelerate synthetic responses with built-in voice quality controls, customized audio buffers, and latency shaping.
          </p>

          <div className="h-px bg-zinc-200/80 my-8 w-11/12" />

          {/* Value props */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-800 tracking-wider">Sub-Millisecond latency</h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Real-time audio buffer flushes optimized for custom voice agent models and instant stream handshakes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-800 tracking-wider">Customizable Speech Presets</h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Train or calibrate your personal profile's vocal weights with emotional cues, breathing controls, and pitch limits.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase text-zinc-800 tracking-wider">Developer-Authoritative Metrics</h3>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Inspect deep synthetic operations, metrics, active logs, and WebSocket throttling from the central console.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Dual-Column Auth Form Box */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)]"
          >
            {/* Toggle Mode Ribbon */}
            <div className="flex bg-[#F3F4F6] p-1 rounded-full border border-[#E5E7EB] mb-8">
              <button
                id="auth-toggle-login"
                onClick={() => { setMode('login'); playChime(); }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'login' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-black'
                }`}
              >
                Access Login
              </button>
              <button
                id="auth-toggle-signup"
                onClick={() => { setMode('signup'); playChime(); }}
                className={`flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  mode === 'signup' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-black'
                }`}
              >
                Create Signup
              </button>
            </div>

            {/* Title and Branding */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 font-sans">
                {mode === 'login' ? 'Welcome back to Auralis' : 'Deploy your vocal pipeline'}
              </h2>
              <p className="text-xs text-zinc-500 mt-2 font-medium">
                {mode === 'login' 
                  ? 'Provide credentials to load high-fidelity neural voices' 
                  : 'Sign up to get 2.0 hours of synthesized neural speech free'}
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-ping" />
                <p className="text-xs font-semibold text-red-600 leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* Main form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4.5">
              {mode === 'signup' && (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="auth-fullName" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      id="auth-fullName"
                      type="text"
                      placeholder="e.g. Liam Sterling"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] focus:outline-none focus:border-black text-xs font-sans text-neutral-800 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-email" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Work Email address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="auth-email"
                    type="email"
                    placeholder="developer@auralis.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] focus:outline-none focus:border-black text-xs font-sans text-neutral-800 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-password" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    id="auth-password"
                    type="password"
                    placeholder="Container safety key"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-[#E5E7EB] focus:outline-none focus:border-black text-xs font-sans text-neutral-800 transition-colors"
                  />
                </div>
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white hover:bg-neutral-800 py-3.5 rounded-full text-xs font-bold tracking-widest uppercase mt-4 shadow-md items-center justify-center flex gap-2 scale-98 active:scale-95 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Server className="w-4 h-4 animate-spin" />
                    Synthesizing Entry Token...
                  </>
                ) : mode === 'login' ? (
                  <>
                    Confirm Credentials <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Initialize Sandbox <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Separator line */}
            <div className="relative my-8 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E7EB]" />
              </div>
              <span className="relative bg-white px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                Instant Demo Bypass
              </span>
            </div>

            {/* Quick Entrance Buttons for convenient verification */}
            <div className="grid grid-cols-2 gap-3.5">
              <button
                id="quick-login-admin"
                onClick={() => handleQuickLogin('admin')}
                className="p-3 bg-indigo-50/20 border border-indigo-100 hover:bg-indigo-50/60 rounded-2xl text-left cursor-pointer transition-all group"
              >
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.11em] flex items-center gap-1 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  Elite Admin
                </span>
                <p className="text-[10px] text-zinc-500 group-hover:text-black leading-snug font-medium">
                  Access Sarah (Enterprise Admin)
                </p>
              </button>

              <button
                id="quick-login-dev"
                onClick={() => handleQuickLogin('user')}
                className="p-3 bg-emerald-50/20 border border-emerald-100 hover:bg-emerald-50/60 rounded-2xl text-left cursor-pointer transition-all group"
              >
                <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-[0.11em] flex items-center gap-1 mb-1">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  Developer Pro
                </span>
                <p className="text-[10px] text-zinc-500 group-hover:text-black leading-snug font-medium">
                  Access Alex (Developer tier)
                </p>
              </button>
            </div>

            {/* Go back or home link */}
            <div className="text-center mt-6">
              <button
                id="auth-return-home"
                onClick={() => { playSynthChime(); onNavToHome(); }}
                className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider hover:text-black hover:underline"
              >
                ← Return to main playground
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
