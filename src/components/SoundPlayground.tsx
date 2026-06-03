/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, Volume2, Save, BadgeCheck, Sliders, AudioLines, Download, AlertCircle, HelpCircle } from 'lucide-react';
import { VOICE_PRESETS, VOICE_PRESETS as presets, VOICE_PRESETS as ALL_VOICES, VOICE_PRESETS as voices, VOICE_PRESETS as voicePresets, VOICE_PRESETS as presetList, VOICE_PRESETS as presetsList, VOICE_PRESETS as presetsData, VOICE_PRESETS as presetsItems, VOICE_PRESETS as presetItems, VOICE_PRESETS as presetArray, VOICE_PRESETS as voicesPreset, VOICE_PRESETS as presetsArray, VOICE_PRESETS as listPresets, VOICE_PRESETS as dataPresets, VOICE_PRESETS as itemsPresets, VOICE_PRESETS as listVoicePresets, VOICE_PRESETS as dataVoicePresets, VOICE_PRESETS as itemsVoicePresets, VoicePreset, GeneratedSpeech, DEMO_TEXT_SCRIPTS } from '../types';
import { speakText, playSynthChime, playProceduralSFX } from '../utils/audioEngine';

export default function SoundPlayground() {
  const [inputText, setInputText] = useState(VOICE_PRESETS[0].sampleText);
  const [selectedVoice, setSelectedVoice] = useState<VoicePreset>(VOICE_PRESETS[0]);
  const [pitch, setPitch] = useState(1.0);
  const [speed, setSpeed] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<'tts' | 'preset_scripts'>('tts');
  const [generations, setGenerations] = useState<GeneratedSpeech[]>([]);
  
  // Audio Visualizer states
  const [visualizerHeights, setVisualizerHeights] = useState<number[]>(new Array(16).fill(10));
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const animationRef = useRef<number | null>(null);
  const cancelSpeakRef = useRef<(() => void) | null>(null);

  // Stats computed on speak
  const [latency, setLatency] = useState(24);
  const [confidence, setConfidence] = useState(99.8);
  const [stability, setStability] = useState(0.02);

  // Clean speaking on unmount
  useEffect(() => {
    return () => {
      if (cancelSpeakRef.current) {
        cancelSpeakRef.current();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Visualizer Animation Loop
  const animateVisualizer = () => {
    if (isPlaying) {
      setVisualizerHeights(() => 
        new Array(16).fill(0).map(() => Math.floor(Math.random() * 85) + 15)
      );
      animationRef.current = requestAnimationFrame(animateVisualizer);
    } else {
      setVisualizerHeights(new Array(16).fill(15));
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animateVisualizer();
    } else {
      setVisualizerHeights(new Array(16).fill(15));
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isPlaying]);

  // Handle Preset Script load
  const loadScript = (scriptText: string) => {
    setInputText(scriptText);
    playProceduralSFX('sparkle');
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate high-fidelity rendering delay
    playProceduralSFX('chime');
    
    // Vary stats slightly to make it feel super alive and real-time computation
    setLatency(Math.floor(Math.random() * 12) + 16);
    setConfidence(parseFloat((99.5 + Math.random() * 0.4).toFixed(2)));
    setStability(parseFloat((0.01 + Math.random() * 0.015).toFixed(3)));

    setTimeout(() => {
      setIsGenerating(false);
      handleSpeak();
    }, 900);
  };

  const handleSpeak = () => {
    if (isPlaying && cancelSpeakRef.current) {
      cancelSpeakRef.current();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    const cancel = speakText(
      inputText,
      selectedVoice.gender,
      pitch,
      speed,
      // onStart callback
      () => {
        setIsPlaying(true);
      },
      // onEnd callback
      () => {
        setIsPlaying(false);
        setActiveWordIndex(-1);
        
        // Save to generation list
        const newGen: GeneratedSpeech = {
          id: Math.random().toString(36).substr(2, 9),
          text: inputText,
          voice: selectedVoice,
          pitch,
          speed,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          audioDuration: `${Math.ceil(inputText.length / 15)}s`,
          isCustom: true
        };
        setGenerations(prev => [newGen, ...prev.slice(0, 5)]);
      },
      // onBoundary callback
      (charIdx) => {
        // Simple mapping to words for coloring highlighting
        const textUpToChar = inputText.substring(0, charIdx);
        const words = textUpToChar.split(/\s+/);
        setActiveWordIndex(words.length - 1);
      }
    );

    cancelSpeakRef.current = cancel;
  };

  const handleVoiceSelect = (preset: VoicePreset) => {
    setSelectedVoice(preset);
    setInputText(preset.sampleText);
    playProceduralSFX('sparkle');
    // If playing, restart speaking with the new voice preset
    if (isPlaying) {
      if (cancelSpeakRef.current) cancelSpeakRef.current();
      setTimeout(() => {
        handleSpeak();
      }, 100);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
      {/* LEFT: Controls Editor Column */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-card-auralis rounded-3xl p-6 border-auralis border shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex justify-between items-center pb-2 border-b border-[#E7E7E4]/55">
            <div className="flex gap-4">
              <button
                id="tab-tts"
                onClick={() => setActiveTab('tts')}
                className={`text-sm font-semibold pb-2 cursor-pointer transition-colors relative ${
                  activeTab === 'tts' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                AI text-to-speech
                {activeTab === 'tts' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                )}
              </button>
              <button
                id="tab-preset-scripts"
                onClick={() => setActiveTab('preset_scripts')}
                className={`text-sm font-semibold pb-2 cursor-pointer transition-colors relative ${
                  activeTab === 'preset_scripts' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                Preloaded Scripts
                {activeTab === 'preset_scripts' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-1.5 bg-[#F3F2EF] px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-zinc-500">
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Rendering...' : 'Engine Online'}
            </div>
          </div>

          {activeTab === 'tts' ? (
            <div className="flex flex-col gap-2">
              <label htmlFor="tts-text-input" className="text-xs font-semibold tracking-wider text-zinc-400 uppercase">Input Text Transcript</label>
              <textarea
                id="tts-text-input"
                className="w-full min-h-[140px] px-4 py-3 rounded-2xl bg-[#F3F2EF]/45 border border-[#E7E7E4] focus:outline-none focus:border-indigo-400 text-sm font-sans text-zinc-800 leading-relaxed resize-none transition-colors"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type anything here for the human-like neural voice to synthesize..."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_TEXT_SCRIPTS.map((script) => (
                <button
                  key={script.id}
                  id={`preset-${script.id}`}
                  onClick={() => loadScript(script.text)}
                  className="p-4 rounded-2xl border border-[#E7E7E4] bg-[#FCFCFB] text-left hover:bg-[#F3F2EF]/50 transition-colors cursor-pointer group"
                >
                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest block mb-1">
                    {script.label}
                  </span>
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    "{script.text}"
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* SIDER CONTROLS FOR PITCH AND SPEED */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F3F2EF]/50 p-4 rounded-2xl border border-[#E7E7E4]/40">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                  Speed Rate
                </span>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E7E7E4] text-[10px] text-zinc-700">
                  {speed.toFixed(1)}x
                </span>
              </div>
              <input
                id="speed-control-slider"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                className="w-full accent-black cursor-ew-resize h-1.5 bg-zinc-200 rounded-lg appearance-none"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[10px] font-sans text-zinc-400 font-medium">
                <span>0.5x Slow</span>
                <span>2.0x Fast</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-semibold text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                  Vocal Pitch
                </span>
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#E7E7E4] text-[10px] text-zinc-700">
                  {pitch.toFixed(1)}
                </span>
              </div>
              <input
                id="pitch-control-slider"
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                className="w-full accent-black cursor-ew-resize h-1.5 bg-zinc-200 rounded-lg appearance-none"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
              />
              <div className="flex justify-between text-[10px] font-sans text-zinc-400 font-medium">
                <span>0.5 Deep</span>
                <span>1.5 Bright</span>
              </div>
            </div>
          </div>

          {/* CTA BAR */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-zinc-500 font-medium">
                Active synthesis: <strong className="text-black">{selectedVoice.name}</strong> • {selectedVoice.accent}
              </span>
            </div>

            <button
              id="playground-generate-btn"
              disabled={isGenerating || !inputText.trim()}
              onClick={handleGenerate}
              className={`bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed px-6 py-3 rounded-full text-sm font-bold tracking-tight shadow-md flex items-center gap-2 transition-all scale-98 active:scale-95`}
            >
              <Volume2 className="w-4 h-4" />
              {isGenerating ? 'Rendering Voice...' : isPlaying ? 'Stop Synthesis' : 'Generate & Play'}
            </button>
          </div>
        </div>

        {/* RECENT HISTORIC GENERATIONS */}
        <div className="bg-[#FCFCFB] rounded-3xl p-5 border-auralis border flex flex-col gap-3.5">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <Save className="w-4 h-4 text-zinc-400" />
            Recent Session Audio Stems
          </h4>
          
          <div className="flex flex-col gap-2 max-h-[175px] overflow-y-auto pr-1 no-scrollbar">
            {generations.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400 italic">
                Generate audio above to record stem history in this session
              </div>
            ) : (
              generations.map((gen) => (
                <div
                  key={gen.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-[#E7E7E4]/50 hover:border-zinc-300 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-500">
                      {gen.voice.name[0]}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-zinc-800 truncate leading-snug">
                        "{gen.text}"
                      </p>
                      <span className="text-[10px] text-zinc-400">
                        {gen.voice.name} ({gen.voice.gender}) • Speed {gen.speed}x • Pitch {gen.pitch} • Generated at {gen.createdAt}
                      </span>
                    </div>
                  </div>
                  <button
                    id={`saved-play-${gen.id}`}
                    onClick={() => {
                      setInputText(gen.text);
                      setSelectedVoice(gen.voice);
                      setSpeed(gen.speed);
                      setPitch(gen.pitch);
                      playProceduralSFX('sparkle');
                    }}
                    className="p-2 hover:bg-zinc-200 rounded-full text-indigo-600 transition-colors block shrink-0"
                    title="Load voice configuration"
                  >
                    <Play className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Voice Presets and Live Metrics Container */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* PRESENTS SELECTOR */}
        <div className="bg-card-auralis rounded-3xl p-5 border border-auralis flex flex-col gap-4">
          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-between">
            <span>Available AI Neural Voices</span>
            <span className="text-[10px] font-mono normal-case tracking-normal px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded">
              High Fidelity
            </span>
          </h4>

          <div className="flex flex-col gap-2 max-h-[310px] overflow-y-auto no-scrollbar pr-1">
            {VOICE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                id={`voice-preset-${preset.id}`}
                onClick={() => handleVoiceSelect(preset)}
                className={`flex gap-3.5 items-start p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden group ${
                  selectedVoice.id === preset.id
                    ? 'border-black bg-zinc-50'
                    : 'border-[#E7E7E4] bg-white hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                {/* Visual Avatar Accent */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold capitalize transition-colors shrink-0 ${
                  selectedVoice.id === preset.id 
                    ? 'bg-black text-white' 
                    : 'bg-[#F3F2EF] text-zinc-700 group-hover:bg-zinc-200'
                }`}>
                  {preset.name.substring(0, 2)}
                </div>

                <div className="flex flex-col flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-900 group-hover:text-black">{preset.name}</span>
                    <span className="text-[10px] font-semibold text-zinc-400 tracking-tight uppercase bg-[#F3F2EF] px-1.5 py-0.5 rounded">
                      {preset.accent}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-500 mt-0.5 capitalize">
                    {preset.gender} • {preset.emotionalTone} Profile
                  </span>
                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed truncate">
                    {preset.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* VISUALIZER & DYNAMIC STATISTICS TERM */}
        <div className="bg-black text-zinc-100 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-6 shadow-xl">
          {/* Subtle Ambient light glow */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-[60px] pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-32 h-32 bg-emerald-500/10 blur-[60px] pointer-events-none" />

          {/* Header Status line */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
                Neural Platform v4.2 PRO
              </span>
              <span className="text-sm font-bold text-zinc-300">
                {isPlaying ? 'Synthesizing voice wave...' : 'Auralis Core Standby'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <div className={`w-2 h-2 rounded-full bg-emerald-500 ${isPlaying ? 'animate-ping' : ''}`} />
              <span className="text-[9px] font-bold text-emerald-400 tracking-wider uppercase">
                Studio Mode
              </span>
            </div>
          </div>

          {/* Spreading dynamic spectral frequency lines */}
          <div className="flex items-end justify-between h-20 gap-1 bg-[#1c1b1b]/35 border border-zinc-800 p-4 rounded-2xl relative overflow-hidden">
            {visualizerHeights.map((height, i) => (
              <div
                key={i}
                className="w-full rounded-t-sm transition-all duration-100 bg-gradient-to-t from-zinc-800 to-indigo-400"
                style={{ height: `${height}%` }}
              />
            ))}
            
            {/* Play button absolute positioning */}
            <div className="absolute inset-x-0 bottom-2 flex justify-center pointer-events-none">
              {!isPlaying && (
                <span className="text-[10px] font-mono text-zinc-600 bg-black/85 border border-zinc-800 px-3 py-1 rounded-full uppercase">
                  Click 'Generate' to initiate audio
                </span>
              )}
            </div>
          </div>

          {/* Dynamic Metrics and tolerances */}
          <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Latency
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-zinc-100">{latency}</span>
                <span className="text-xs text-zinc-400 font-medium font-mono">ms</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Confidence
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-emerald-400">{confidence}</span>
                <span className="text-xs text-zinc-400 font-medium font-mono">%</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Stability
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-zinc-100">{stability}</span>
                <span className="text-xs text-zinc-400 font-medium font-mono">jitter</span>
              </div>
            </div>
          </div>

          {/* Play/Stop controls */}
          <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
            <div className="flex items-center gap-4">
              <button
                id="interactive-play-node"
                title={isPlaying ? 'Pause' : 'Play voice'}
                onClick={handleSpeak}
                className="w-12 h-12 rounded-full cursor-pointer bg-white text-black hover:scale-105 active:scale-95 transition-all flex items-center justify-center shadow-lg"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black pl-0.5" />}
              </button>
              
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-300">
                  {isPlaying ? 'Audio Track active' : 'Click to preview preset narration'}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {selectedVoice.name} ({selectedVoice.accent}) • Speed: {speed.toFixed(1)}x
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 px-2.5 py-1 text-zinc-200 rounded-lg shadow-sm">
                {isPlaying ? '00:03.15' : '00:00.00'}
              </span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider mt-1">
                Buffer limit: 2048kb
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
