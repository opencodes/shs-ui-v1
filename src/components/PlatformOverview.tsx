/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Edit3, AlignLeft, Play, Pause, SkipBack, SkipForward, BarChart2, CheckCircle, Flame, Layers } from 'lucide-react';
import { playProceduralSFX } from '../utils/audioEngine';

export default function PlatformOverview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerCount, setTimerCount] = useState(42.12);
  const [timelinePercent, setTimelinePercent] = useState(25);
  const [engineQ, setEngineQ] = useState('STUDIO MODE');
  const [latency, setLatency] = useState(24);
  const [confidence, setConfidence] = useState(99.8);
  const [stability, setStability] = useState(0.02);

  // Spectral bar mock values
  const [spectralData, setSpectralData] = useState([25, 40, 65, 55, 85, 95, 70, 45, 60, 30, 50, 20, 35, 15]);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        // Increment timer
        setTimerCount(prev => {
          const next = prev + 0.12;
          return next >= 260 ? 0 : parseFloat(next.toFixed(2));
        });
        
        // Advance timeline percentage
        setTimelinePercent(prev => {
          const next = prev + 0.6;
          return next >= 100 ? 0 : next;
        });

        // Simulate fluctuating spectral data
        setSpectralData(() => 
          new Array(14).fill(0).map(() => Math.floor(Math.random() * 85) + 15)
        );

        // Slightly jitter performance metrics
        setLatency(prev => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          const target = prev + delta;
          return target < 18 || target > 32 ? prev : target;
        });
      }, 120);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    playProceduralSFX('sparkle');
  };

  const handleSkipForward = () => {
    setTimerCount(0);
    setTimelinePercent(0);
    playProceduralSFX('sparkle');
  };

  return (
    <section id="overview" className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24 border-t border-[#E7E7E4]/50">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans text-black tracking-tight leading-none mb-6">
          Two platforms built on the same research foundation
        </h2>
        <p className="text-zinc-500 text-[16px] md:text-[18px] leading-relaxed">
          Whether you require an editing interface for narrative audiobooks or reliable conversation agents for customer success desks, both platforms share our human-centered neural acoustic layer.
        </p>
      </div>

      {/* Two cards in top grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Soft Editor UI Card */}
        <div className="bg-[#FCFCFB] rounded-3xl p-8 border border-[#E7E7E4] h-[320px] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/10 opacity-40 group-hover:opacity-75 transition-opacity" />
          
          <div className="flex justify-between items-start z-10">
            <span className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-indigo-500" />
            </span>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded">
              Auralis Studio Module
            </span>
          </div>

          <div className="z-10">
            <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-2">Soft Editor UI</h4>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
              A block-by-block editor allowing content creators to sequence statements, re-tune pauses, choose speaker profiles, and output seamless audio files.
            </p>
          </div>
        </div>

        {/* Transcript Panel Card */}
        <div className="bg-[#FCFCFB] rounded-3xl p-8 border border-[#E7E7E4] h-[320px] flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/10 opacity-40 group-hover:opacity-75 transition-opacity" />
          
          <div className="flex justify-between items-start z-10">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center">
              <AlignLeft className="w-5 h-5 text-emerald-500" />
            </span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded">
              Auralis Agents Module
            </span>
          </div>

          <div className="z-10">
            <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-2">Transcript Panel</h4>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
              Real-time speech-to-text transcript logs featuring speaker indicators, timestamp intervals, and smart translation layers.
            </p>
          </div>
        </div>
      </div>

      {/* Main Full-width dashboard visual container */}
      <div className="w-full bg-[#F3F2EF] rounded-[2.5rem] p-6 md:p-8 border border-[#E7E7E4] flex flex-col lg:flex-row gap-8 items-center justify-between relative overflow-hidden group">
        
        {/* Background visual art lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
          <div className="absolute w-[400px] h-[400px] border border-black/40 rounded-full -left-20 -top-20" />
          <div className="absolute w-[600px] h-[600px] border border-black/40 rounded-full -left-20 -top-20" />
        </div>

        {/* Info panel */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6 z-10 pr-0 lg:pr-8">
          <div className="flex items-center gap-2.5 bg-white/90 border border-[#E7E7E4] p-1.5 rounded-full self-start">
            <span className="text-[10px] font-bold text-black uppercase tracking-[0.2em] px-2.5">
              Unified Kernel
            </span>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-black leading-none">
            Deep-layer acoustic modeling
          </h3>

          <p className="text-sm text-zinc-500 leading-relaxed">
            Our models bypass phoneme dictionaries and construct audio waves representing real larynx articulation. The platform is capable of capturing vocal gasps, micro-pauses, and customized cadence variations natively.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-xs">✓</div>
              <span className="text-xs font-semibold text-zinc-700">Sub-50ms acoustic response threshold</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-xs">✓</div>
              <span className="text-xs font-semibold text-zinc-700">Multi-dialect vocal consistency across 24 lang arrays</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-600 text-xs">✓</div>
              <span className="text-xs font-semibold text-zinc-700">Dynamic amplitude control for sound design overlays</span>
            </div>
          </div>
        </div>

        {/* Live Terminal Widget */}
        <div className="w-full lg:w-1/2 flex justify-center z-10">
          <div className="w-full max-w-[430px] bg-white/35 backdrop-blur-3xl border border-white/50 rounded-[2rem] p-6 shadow-[0_24px_56px_rgba(0,0,0,0.06)] flex flex-col gap-6">
            
            {/* Widget top header */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-[9px] font-extrabold tracking-widest text-[#6B6B6B] uppercase">
                  NEURAL ENGINE V4.2 PRO
                </span>
                <span className="text-xs font-bold text-zinc-800">
                  {isPlaying ? 'Synthesizing voice wave...' : 'Auralis Core Standby'}
                </span>
              </div>
              
              <button
                id="widget-toggle-mode"
                onClick={() => {
                  setEngineQ(prev => prev === 'STUDIO MODE' ? 'BROADCAST MODE' : 'STUDIO MODE');
                  playProceduralSFX('sparkle');
                }}
                className="flex items-center gap-1.5 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/20 text-[9px] font-extrabold text-emerald-700 uppercase tracking-widest cursor-pointer"
              >
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                {engineQ}
              </button>
            </div>

            {/* Simulated spectrograph lines */}
            <div className="flex items-end justify-between h-20 gap-1 my-1">
              {spectralData.map((height, idx) => (
                <div
                  key={idx}
                  className="w-1.5 rounded-full bg-gradient-to-t from-indigo-300 to-purple-500 transition-all duration-150"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            {/* Performance indexes */}
            <div className="grid grid-cols-3 gap-4 border-t border-black/5 pt-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Latency</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold font-mono text-zinc-900">{latency}</span>
                  <span className="text-[10px] text-zinc-500 font-medium font-mono">ms</span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Confidence</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold font-mono text-zinc-900">{confidence}</span>
                  <span className="text-[10px] text-zinc-500 font-medium font-mono">%</span>
                </div>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-[#6B6B6B]">Stability</span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-bold font-mono text-zinc-900">{stability}</span>
                  <span className="text-[10px] text-zinc-500 font-medium font-mono">jitter</span>
                </div>
              </div>
            </div>

            {/* Control scrub and buttons */}
            <div className="flex items-center justify-between border-t border-black/5 pt-4">
              {/* Audio controller links */}
              <div className="flex items-center gap-4">
                <button
                  id="widget-skip-prev"
                  onClick={handleSkipForward}
                  title="Skip back"
                  className="text-zinc-400 hover:text-black transition-colors cursor-pointer"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>
                <button
                  id="widget-play-toggle"
                  onClick={handlePlayToggle}
                  className="w-10 h-10 rounded-full bg-black text-white hover:scale-105 active:scale-95 flex items-center justify-center shadow transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4.5 h-4.5 text-white fill-white" /> : <Play className="w-4.5 h-4.5 text-white fill-white pl-0.5" />}
                </button>
                <button
                  id="widget-skip-next"
                  onClick={handleSkipForward}
                  title="Forward reset"
                  className="text-zinc-400 hover:text-black transition-colors cursor-pointer"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Running clock indicator */}
              <div className="flex flex-col items-end">
                <span className="text-[11px] font-mono font-bold bg-white/60 text-zinc-800 px-2 py-0.5 rounded border border-[#E7E7E4]">
                  00:{timerCount < 10 ? '0' + timerCount.toFixed(2) : timerCount.toFixed(2)}
                </span>
                <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mt-1">
                  Total track: 04:20
                </span>
              </div>
            </div>

            {/* Progress timeline indicator bar */}
            <div className="w-full bg-zinc-200 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-black h-1 rounded-full transition-all duration-150"
                style={{ width: `${timelinePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
