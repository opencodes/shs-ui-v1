/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Music, Speaker, Mic, Film, Play, Square, Sparkles, VolumeX, Check } from 'lucide-react';
import { playProceduralMusic, playProceduralSFX, playSynthChime } from '../utils/audioEngine';

export default function AuralisStudioSection() {
  const [activeMedia, setActiveMedia] = useState<'none' | 'music' | 'sfx' | 'voices' | 'image_video'>('none');
  const [musicType, setMusicType] = useState<'ambient' | 'cyberpunk' | 'futuristic'>('ambient');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [sfxTriggeredCount, setSfxTriggeredCount] = useState(0);

  // Background play cleanup
  let stopMusicFn: (() => void) | null = null;

  const handleToggleMusic = (type: 'ambient' | 'cyberpunk' | 'futuristic') => {
    setMusicType(type);
    
    if (isPlayingMusic && activeMedia === 'music') {
      // If clicking same music, turn off
      setIsPlayingMusic(false);
      setActiveMedia('none');
      playProceduralSFX('sparkle');
    } else {
      // Toggle on
      setIsPlayingMusic(true);
      setActiveMedia('music');
      playProceduralSFX('chime');
    }
  };

  useEffect(() => {
    let stopFn: (() => void) | null = null;
    if (isPlayingMusic && activeMedia === 'music') {
      stopFn = playProceduralMusic(musicType);
    }

    return () => {
      if (stopFn) {
        stopFn();
      }
    };
  }, [isPlayingMusic, musicType, activeMedia]);

  const triggerSFXPlay = (category: string) => {
    setActiveMedia('sfx');
    playProceduralSFX(category);
    setSfxTriggeredCount(prev => prev + 1);
    
    // Auto clear active state after flash delay
    setTimeout(() => {
      setActiveMedia('none');
    }, 400);
  };

  return (
    <section id="studio" className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24 bg-[#F7F7F5]">
      {/* Selector ribbon header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] font-bold tracking-widest bg-[#E5E2E1] text-black px-3.5 py-1.5 rounded-full uppercase">
          Auralis Studio
        </span>
        <div className="h-px bg-[#E7E7E4] flex-grow opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
        <div className="lg:col-span-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans text-black leading-none tracking-tight">
            Create, edit, and localize in one workspace
          </h2>
        </div>
        <div className="lg:col-span-6 flex items-end">
          <p className="text-zinc-500 font-sans leading-relaxed text-[16px] md:text-[18px]">
            Master your assets with unified controls. Seamlessly generate background instrumentation, organic Foley sweeps, text translations, and synthetic speaker clones inside a single continuous media deck.
          </p>
        </div>
      </div>

      {/* Two standard studio overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#FCFCFB] rounded-3xl p-8 border border-[#E7E7E4] h-[280px] flex flex-col justify-between relative overflow-hidden group hover:shadow-xs transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#e5e2e1]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-start z-10">
            <span className="text-xs font-bold text-zinc-400 font-mono">PANEL 01 / MODULES</span>
            <span className="text-zinc-300 group-hover:text-black transition-colors"><Film className="w-5 h-5" /></span>
          </div>
          <div className="z-10">
            <h4 className="text-xl font-bold tracking-tight mb-2">Soft Editor UI</h4>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Sequence synthetic recordings, manage multi-layered timelines, insert vocal breaths, and adjust localized language tracks in real-time.
            </p>
          </div>
        </div>

        <div className="bg-[#FCFCFB] rounded-3xl p-8 border border-[#E7E7E4] h-[280px] flex flex-col justify-between relative overflow-hidden group hover:shadow-xs transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#e5e2e1]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex justify-between items-start z-10">
            <span className="text-xs font-bold text-zinc-400 font-mono">PANEL 02 / AUDIO</span>
            <span className="text-zinc-300 group-hover:text-black transition-colors"><Speaker className="w-5 h-5" /></span>
          </div>
          <div className="z-10">
            <h4 className="text-xl font-bold tracking-tight mb-2">Transcript Panel</h4>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              Instantly compile transcript alignments. Export clean timestamp formats, track dual speakers, and trigger instant voice-over translation macros.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 4 columns at the bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        
        {/* MUSIC MODULE */}
        <div className="bg-[#F3F2EF] rounded-3xl p-6 border border-[#E7E7E4] flex flex-col justify-between min-h-[220px] transition-all hover:bg-[#E5E2E1]/40 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white rounded-2xl border border-[#E7E7E4] text-black">
              <Music className={`w-5 h-5 ${isPlayingMusic ? 'text-indigo-600 animate-bounce' : ''}`} />
            </div>
            {isPlayingMusic && (
              <span className="text-[9px] font-bold text-indigo-600 bg-white border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">
                Active synth
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Procedural sound</span>
              <h4 className="text-sm font-bold text-zinc-800">Atmospheric Music</h4>
            </div>

            {/* Music type presets selector inside */}
            <div className="flex gap-1 bg-white/70 p-1 rounded-lg border border-[#E7E7E4]">
              <button
                id="music-preset-ambient"
                onClick={() => handleToggleMusic('ambient')}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer ${
                  isPlayingMusic && musicType === 'ambient' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-600 hover:text-zinc-800'
                }`}
              >
                Ambient C#
              </button>
              <button
                id="music-preset-cyber"
                onClick={() => handleToggleMusic('cyberpunk')}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer ${
                  isPlayingMusic && musicType === 'cyberpunk' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-600 hover:text-zinc-800'
                }`}
              >
                Gritty E
              </button>
              <button
                id="music-preset-future"
                onClick={() => handleToggleMusic('futuristic')}
                className={`flex-1 text-[10px] font-bold py-1.5 rounded transition-all cursor-pointer ${
                  isPlayingMusic && musicType === 'futuristic' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-600 hover:text-zinc-800'
                }`}
              >
                Psy-Fi D
              </button>
            </div>
          </div>
        </div>

        {/* SFX FOLEY MODULE */}
        <div className="bg-[#F3F2EF] rounded-3xl p-6 border border-[#E7E7E4] flex flex-col justify-between min-h-[220px] transition-all hover:bg-[#E5E2E1]/40 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-white rounded-2xl border border-[#E7E7E4] text-black">
              <Speaker className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Synthesized foley</span>
              <h4 className="text-sm font-bold text-zinc-800">Dynamic SFX</h4>
            </div>

            <div className="grid grid-cols-2 gap-1">
              <button
                id="sfx-trigger-laser"
                onClick={() => triggerSFXPlay('laser')}
                className="text-[10px] font-bold max-h-8 bg-white border border-[#E7E7E4] hover:bg-zinc-100 py-1.5 rounded cursor-pointer transition-all"
              >
                Laser sweep
              </button>
              <button
                id="sfx-trigger-spark"
                onClick={() => triggerSFXPlay('sparkle')}
                className="text-[10px] font-bold max-h-8 bg-white border border-[#E7E7E4] hover:bg-zinc-100 py-1.5 rounded cursor-pointer transition-all"
              >
                Chime bell
              </button>
              <button
                id="sfx-trigger-sub"
                onClick={() => triggerSFXPlay('sub')}
                className="text-[10px] font-bold max-h-8 bg-white border border-[#E7E7E4] hover:bg-zinc-100 py-1.5 rounded cursor-pointer transition-all"
              >
                Sub drop
              </button>
              <button
                id="sfx-trigger-chime"
                onClick={() => triggerSFXPlay('feedback')}
                className="text-[10px] font-bold max-h-8 bg-white border border-[#E7E7E4] hover:bg-zinc-100 py-1.5 rounded cursor-pointer transition-all"
              >
                Sweep up
              </button>
            </div>
          </div>
        </div>

        {/* VOICE CASTING CLONING MODULE */}
        <div 
          onClick={() => {
            playSynthChime();
            const el = document.getElementById('playground-anchor');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#F3F2EF] rounded-3xl p-6 border border-[#E7E7E4] flex flex-col justify-between min-h-[220px] transition-all hover:bg-[#E5E2E1]/40 cursor-pointer relative group"
        >
          <div className="p-3 bg-white rounded-2xl border border-[#E7E7E4] text-black self-start">
            <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Vocal matrix</span>
            <h4 className="text-sm font-bold text-zinc-800 mb-1">Human-Level Voices</h4>
            <span className="text-[11px] text-indigo-500 font-semibold flex items-center gap-1 group-hover:underline">
              Casting list ({5} voices) →
            </span>
          </div>
        </div>

        {/* IMAGE & VIDEO CLIPPING MODULE */}
        <div 
          onClick={() => {
            playProceduralSFX('sparkle');
            alert("This module aggregates synced animation keyframes with vocal timings for seamless lipsync avatar outputs.");
          }}
          className="bg-[#F3F2EF] rounded-3xl p-6 border border-[#E7E7E4] flex flex-col justify-between min-h-[220px] transition-all hover:bg-[#E5E2E1]/40 cursor-pointer relative group"
        >
          <div className="p-3 bg-white rounded-2xl border border-[#E7E7E4] text-black self-start">
            <Film className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          </div>

          <div className="mt-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-0.5">Media sync</span>
            <h4 className="text-sm font-bold text-zinc-800 mb-1">Image & Video Integrator</h4>
            <span className="text-[11px] text-zinc-400 font-medium leading-tight block">
              Generate synced frames in perfect rhythm
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
