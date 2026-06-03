/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Play, Pause, ChevronRight, Sparkles, Check, PhoneCall, AudioLines, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SoundPlayground from './SoundPlayground';
import { playSynthChime } from '../utils/audioEngine';

interface HeroProps {
  onStartClick: () => void;
}

export default function Hero({ onStartClick }: HeroProps) {
  const [activeTab, setActiveTab] = useState<'studio' | 'agents' | 'api'>('studio');
  const [showSandbox, setShowSandbox] = useState(false);

  const handleChimeAndSandbox = () => {
    playSynthChime();
    setShowSandbox(true);
    // Smooth scroll down to sandbox play zone
    setTimeout(() => {
      document.getElementById('playground-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <section id="hero" className="max-w-[1280px] mx-auto px-6 lg:px-8 pt-32 pb-20 flex flex-col gap-12">
      {/* 1. Header Text Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-sans leading-[1.05] tracking-tighter text-black select-none">
            AI audio<br />
            that sounds human
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <button
              id="hero-get-started"
              onClick={handleChimeAndSandbox}
              className="bg-black text-white hover:bg-zinc-800 transition-all font-semibold tracking-tight text-sm px-6 py-3.5 rounded-full shadow-md cursor-pointer flex items-center gap-2 scale-98 active:scale-95"
            >
              Get started free <ChevronRight className="w-4.5 h-4.5" />
            </button>
            <button
              id="hero-contact-sales"
              onClick={() => {
                playSynthChime();
                alert("Our representative (rkjha.it.in@gmail.it) has been notified. We will reach out shortly!");
              }}
              className="bg-white border text-black border-[#E7E7E4] hover:bg-[#F3F2EF]/50 transition-all font-semibold tracking-tight text-sm px-6 py-3.5 rounded-full cursor-pointer flex items-center gap-1.5"
            >
              <PhoneCall className="w-4 h-4 text-zinc-500" />
              Contact sales
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 lg:col-start-9 flex flex-col justify-between h-full pt-4">
          <p className="text-zinc-500 font-sans leading-relaxed text-[16px] md:text-[18px]">
            Auralis generates realistic, low-latency synthetic voices, atmospheric custom instrumentation, and interactive sound design systems tailored specifically for high-scale enterprise engineering platforms.
          </p>
          
          {/* Subtle rating block */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-1">
              <span className="w-6 h-6 rounded-full bg-indigo-200 border-2 border-[#F7F7F5] flex items-center justify-center text-[8px] font-bold">A</span>
              <span className="w-6 h-6 rounded-full bg-emerald-200 border-2 border-[#F7F7F5] flex items-center justify-center text-[8px] font-bold">M</span>
              <span className="w-6 h-6 rounded-full bg-amber-200 border-2 border-[#F7F7F5] flex items-center justify-center text-[8px] font-bold">E</span>
            </div>
            <span className="text-xs text-zinc-400 font-semibold">
              Loved by 12,000+ developers globally
            </span>
          </div>
        </div>
      </div>

      {/* 2. Ambient Product Showcase Interactive Dashboard */}
      <div id="product-showcase-panel" className="bg-[#F3F2EF] rounded-[2rem] p-6 md:p-8 flex flex-col relative overflow-hidden border border-[#E7E7E4] min-h-[440px] md:min-h-[520px] justify-between">
        {/* Top Control Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 z-10">
          <div className="flex bg-white/90 backdrop-blur p-1 rounded-full border border-[#E7E7E4] shadow-sm self-start">
            <button
              id="hero-tab-studio"
              onClick={() => { setActiveTab('studio'); playSynthChime(); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'studio' ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Auralis Studio
            </button>
            <button
              id="hero-tab-agents"
              onClick={() => { setActiveTab('agents'); playSynthChime(); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'agents' ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Auralis Agents
            </button>
            <button
              id="hero-tab-api"
              onClick={() => { setActiveTab('api'); playSynthChime(); }}
              className={`px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                activeTab === 'api' ? 'bg-black text-white' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Auralis API
            </button>
          </div>

          <div className="bg-white/95 backdrop-blur px-4 py-2.5 rounded-full border border-[#E7E7E4] flex items-center gap-2 self-start shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
              {activeTab === 'studio' && 'AI Voice Synthesizer'}
              {activeTab === 'agents' && 'Voice Conversational Node'}
              {activeTab === 'api' && 'Secure Websocket API'}
            </span>
          </div>
        </div>

        {/* Dynamic Blurry Gradients behind (simulating glowing sound energy) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-80 z-0">
          <motion.div
            animate={{
              scale: activeTab === 'studio' ? [1, 1.15, 1] : activeTab === 'agents' ? [1, 1.25, 1] : [1, 1.1, 1],
              rotate: activeTab === 'studio' ? [0, 15, -15, 0] : [0, -10, 10, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full bg-gradient-to-tr from-rose-400 to-orange-300 blur-[85px] absolute -ml-32 md:-ml-48"
          />
          <motion.div
            animate={{
              scale: activeTab === 'studio' ? [1, 1.2, 1] : activeTab === 'agents' ? [1.1, 1, 1.1] : [1, 1.3, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[350px] h-[350px] md:w-[450px] md:h-[450px] rounded-full bg-gradient-to-tr from-indigo-300 to-purple-400 blur-[90px] absolute"
          />
          <motion.div
            animate={{
              x: activeTab === 'api' ? [0, 40, -40, 0] : [0, -20, 20, 0],
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[240px] h-[240px] md:w-[300px] md:h-[300px] rounded-full bg-gradient-to-tr from-emerald-300 to-teal-200 blur-[80px] absolute ml-32 md:ml-48 mt-20"
          />
        </div>

        {/* Center Interactive Activation Board */}
        <div className="z-10 my-auto flex flex-col items-center gap-6 text-center max-w-xl mx-auto py-8">
          <button
            id="center-orb-play"
            onClick={handleChimeAndSandbox}
            className="w-24 h-24 bg-white hover:bg-zinc-50 hover:scale-105 active:scale-95 transition-all text-black rounded-full flex items-center justify-center shadow-xl border border-[#E7E7E4] group cursor-pointer"
          >
            <Play className="w-10 h-10 text-black fill-black pl-1 group-hover:text-indigo-600 group-hover:fill-indigo-600 transition-colors" />
          </button>
          
          <div className="flex flex-col gap-1.5">
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900">
              {activeTab === 'studio' && 'Synthesize custom vocal tracks'}
              {activeTab === 'agents' && 'Configure custom conversational operators'}
              {activeTab === 'api' && 'Generate secure API endpoints'}
            </h3>
            <p className="text-xs md:text-sm text-zinc-500 px-4 leading-relaxed font-semibold">
              {activeTab === 'studio' && 'Click play or scroll below to load the live voice generation workspace. Instantly configure, test, and save individual stems.'}
              {activeTab === 'agents' && 'Build high-fidelity chat prompts that speak back to users with human accuracy and sub-sec audio buffer lines.'}
              {activeTab === 'api' && 'Deploy scalable WebSockets for direct transcription and voice streams. Fully optimized with developer metrics.'}
            </p>
          </div>
        </div>

        {/* Bottom Horizontal Filter Strip */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-[#E7E7E4]/80 shadow-md">
          <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar items-center py-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-black bg-[#F3F2EF] px-3 py-1 rounded-full whitespace-nowrap">
              AI Voice Generator
            </span>
            <button onClick={handleChimeAndSandbox} className="text-xs font-semibold text-zinc-500 hover:text-black whitespace-nowrap cursor-pointer">
              Text to Speech
            </button>
            <button onClick={handleChimeAndSandbox} className="text-xs font-semibold text-zinc-500 hover:text-black whitespace-nowrap cursor-pointer">
              Procedural Music
            </button>
            <button onClick={handleChimeAndSandbox} className="text-xs font-semibold text-zinc-500 hover:text-black whitespace-nowrap cursor-pointer">
              Sound Effects
            </button>
            <button onClick={handleChimeAndSandbox} className="text-xs font-semibold text-zinc-500 hover:text-black whitespace-nowrap cursor-pointer">
              Voice Cloning
            </button>
          </div>

          <button
            id="hero-bottom-sandbox-link"
            onClick={handleChimeAndSandbox}
            className="bg-black text-white hover:bg-zinc-800 text-xs font-bold px-5 py-2.5 rounded-full text-center whitespace-nowrap cursor-pointer shadow-sm"
          >
            Open Live Sandbox
          </button>
        </div>
      </div>

      {/* 3. Anchored Live Sandbox Workspace Section */}
      <div id="playground-anchor" className="pt-8">
        <div className="flex flex-col gap-2 mb-6">
          <span className="text-[10px] font-bold tracking-[0.25em] text-indigo-500 uppercase">
            Interactive Node Demo
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-black">
            Liveness Vocal Playground
          </h2>
          <p className="text-xs text-zinc-400">
            Customize voice, parameters, and inputs. Click play to trigger high-fidelity synthesis in your browser using the local speaker engine.
          </p>
        </div>
        
        <SoundPlayground />
      </div>
    </section>
  );
}
