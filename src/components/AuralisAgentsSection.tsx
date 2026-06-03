/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, ChevronRight, BarChart2, TrendingUp, Sparkles, Phone, HelpCircle } from 'lucide-react';
import { speakText, playProceduralSFX, playSynthChime } from '../utils/audioEngine';
import { ChatMessage } from '../types';

export default function AuralisAgentsSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'agent',
      text: 'Hello! I am your configured conversational agent. How can I assist you today?',
      timestamp: 'Today, 2:42 PM'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'latency' | 'calls' | 'fidelity'>('latency');
  
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    playProceduralSFX('sparkle');
    setIsTyping(true);

    // AI Agent automatic speaking response after dynamic delay
    setTimeout(() => {
      setIsTyping(false);
      
      let replyText = "I’ve queried the current kernel deploy indices. All clusters are fully updated and operating at peak stability of zero point zero two millisecond jitter.";
      
      const queryLower = userMsg.text.toLowerCase();
      if (queryLower.includes('latency') || queryLower.includes('slow')) {
        replyText = "Our response threshold is currently set to twenty-four milliseconds average, fully secure across all endpoints.";
      } else if (queryLower.includes('pricing') || queryLower.includes('cost')) {
        replyText = "Auralis enterprise plans start from zero point zero zero two dollars per audio minute. To upgrade, feel free to click pricing.";
      } else if (queryLower.includes('hi') || queryLower.includes('hello')) {
        replyText = "Hello! I am ready to evaluate high-scale voice pipelines. What can I check for you?";
      }

      const agentMsg: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);

      // Speak reply out loud with standard friendly TTS!
      speakText(replyText, 'female', 1.0, 1.05);

    }, 1500);
  };

  // SVG Chart points data defined mathematically
  const chartData = {
    latency: [
      { day: 'Mon', val: 55 },
      { day: 'Tue', val: 42 },
      { day: 'Wed', val: 32 },
      { day: 'Thu', val: 24 },
      { day: 'Fri', val: 26 },
      { day: 'Sat', val: 20 },
      { day: 'Sun', val: 18 }
    ],
    calls: [
      { day: 'Mon', val: 220 },
      { day: 'Tue', val: 310 },
      { day: 'Wed', val: 450 },
      { day: 'Thu', val: 560 },
      { day: 'Fri', val: 490 },
      { day: 'Sat', val: 320 },
      { day: 'Sun', val: 280 }
    ],
    fidelity: [
      { day: 'Mon', val: 94 },
      { day: 'Tue', val: 95 },
      { day: 'Wed', val: 98 },
      { day: 'Thu', val: 99.1 },
      { day: 'Fri', val: 99.8 },
      { day: 'Sat', val: 99.4 },
      { day: 'Sun', val: 99.8 }
    ]
  };

  const activePoints = chartData[selectedMetric];
  const maxAxisVal = selectedMetric === 'calls' ? 600 : selectedMetric === 'fidelity' ? 100 : 60;

  return (
    <section id="agents" className="max-w-[1280px] mx-auto px-6 lg:px-8 py-24 border-t border-[#E7E7E4]/50 bg-[#F7F7F5]">
      {/* Selector badge ribbon */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] font-bold tracking-widest bg-[#E5E2E1] text-black px-3.5 py-1.5 rounded-full uppercase">
          Auralis Agents
        </span>
        <div className="h-px bg-[#E7E7E4] flex-grow opacity-60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
        <div className="lg:col-span-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans text-black leading-none tracking-tight">
            Deploy agents that listen, respond, and act
          </h2>
        </div>
        <div className="lg:col-span-5 lg:col-start-8 flex items-end">
          <p className="text-zinc-500 font-sans leading-relaxed text-[16px] md:text-[18px]">
            Configure autonomous voice pipelines to field customer support, schedule tasks, and guide checkouts. Equipped with sub-fifty millisecond latency models and native Speech-to-Text capabilities.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* LEFT: Omnichannel Agent Conversational Sandbox */}
        <div className="bg-[#FCFCFB] rounded-3xl p-6 md:p-8 border border-[#E7E7E4] flex flex-col justify-between min-h-[480px] relative overflow-hidden group shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          {/* Decorative ambient color orb backdrop */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none select-none opacity-20">
            <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-r from-blue-300 to-cyan-100 blur-2xl absolute -ml-16 -mt-16" />
            <div className="w-[180px] h-[180px] rounded-full bg-gradient-to-r from-purple-300 to-pink-100 blur-2xl absolute ml-16 mt-16" />
          </div>

          <div className="flex justify-between items-center pb-4 border-b border-[#E7E7E4]/55 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-900">Agent Node #024-Live</span>
            </div>
            
            <div className="bg-[#F3F2EF] text-zinc-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Omnichannel agents
            </div>
          </div>

          {/* Messages scroll stream */}
          <div className="flex-grow flex flex-col gap-4 py-6 overflow-y-auto max-h-[260px] no-scrollbar z-10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`w-8 h-8 rounded-full border border-[#E7E7E4] flex items-center justify-center shrink-0 ${
                  msg.sender === 'user' ? 'bg-black text-white' : 'bg-[#F3F2EF] text-zinc-700'
                }`}>
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-zinc-800" />}
                </div>

                <div className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-xs font-sans leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-black text-white rounded-tr-xs' 
                      : 'bg-[#F3F2EF]/75 text-zinc-800 border border-[#E7E7E4]/40 rounded-tl-xs'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-zinc-400 font-mono tracking-wider">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 max-w-[85%] self-start">
                <div className="w-8 h-8 rounded-full bg-[#F3F2EF] border border-[#E7E7E4]/50 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-zinc-700" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#F3F2EF] text-xs text-zinc-400 italic">
                  Agent speaking...
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Command input prompt panel */}
          <div className="flex items-center gap-2 border-t border-[#E7E7E4]/55 pt-4 z-10">
            <input
              id="agent-chat-prompt-input"
              type="text"
              className="flex-grow px-4 py-3.5 rounded-full bg-[#F3F2EF]/50 border border-[#E7E7E4] focus:outline-none focus:border-black text-xs font-sans text-zinc-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask agent: 'What is our latency?' or custom query..."
            />
            <button
              id="agent-chat-send-btn"
              onClick={handleSendMessage}
              className="p-3.5 bg-black text-white rounded-full hover:bg-zinc-800 transition-all flex items-center justify-center shadow-md scale-98 active:scale-95 cursor-pointer shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* RIGHT: High-Fidelity SVG Interactive Analytics Widget */}
        <div className="bg-[#FCFCFB] rounded-3xl p-6 md:p-8 border border-[#E7E7E4] flex flex-col justify-between min-h-[480px] shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
          
          <div className="flex justify-between items-center pb-4 border-b border-[#E7E7E4]/55">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4" />
              Operational Performance
            </h4>

            <div className="bg-[#F3F2EF] text-zinc-600 px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Analytics
            </div>
          </div>

          {/* Inline switcher tabs for metrics list */}
          <div className="grid grid-cols-3 gap-2 bg-[#F3F2EF] p-1 rounded-xl border border-[#E7E7E4]/50 my-4">
            <button
              id="metric-switcher-latency"
              onClick={() => { setSelectedMetric('latency'); playProceduralSFX('sparkle'); }}
              className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'latency' ? 'bg-white text-black shadow' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Latency (ms)
            </button>
            <button
              id="metric-switcher-calls"
              onClick={() => { setSelectedMetric('calls'); playProceduralSFX('sparkle'); }}
              className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'calls' ? 'bg-white text-black shadow' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Minutes Call
            </button>
            <button
              id="metric-switcher-fidelity"
              onClick={() => { setSelectedMetric('fidelity'); playProceduralSFX('sparkle'); }}
              className={`py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
                selectedMetric === 'fidelity' ? 'bg-white text-black shadow' : 'text-zinc-500 hover:text-black'
              }`}
            >
              Fidelity Accuracy
            </button>
          </div>

          {/* SVG Custom-Drawn Responsive Chart Block */}
          <div className="flex-grow flex items-center justify-center py-4">
            <div className="w-full h-[180px] relative">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Reference Grid lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="#E7E7E4" strokeWidth="0.25" strokeDasharray="2,2" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#E7E7E4" strokeWidth="0.25" strokeDasharray="2,2" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#E7E7E4" strokeWidth="0.25" strokeDasharray="2,2" />

                {/* Draw Area polyline gradient fill */}
                <defs>
                  <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Convert data to SVG coordinate path string */}
                <path
                  d={`
                    M 0 100
                    ${activePoints.map((pt, idx) => {
                      const xCoord = (idx / (activePoints.length - 1)) * 100;
                      const yCoord = 100 - (pt.val / maxAxisVal) * 80; // Bound inside top margin
                      return `L ${xCoord} ${yCoord}`;
                    }).join(' ')}
                    L 100 100 Z
                  `}
                  fill="url(#chart-area-grad)"
                />

                {/* Continuous Stroke line */}
                <path
                  d={activePoints.map((pt, idx) => {
                    const xCoord = (idx / (activePoints.length - 1)) * 100;
                    const yCoord = 100 - (pt.val / maxAxisVal) * 80;
                    return `${idx === 0 ? 'M' : 'L'} ${xCoord} ${yCoord}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />

                {/* Dots on points */}
                {activePoints.map((pt, idx) => {
                  const xCoord = (idx / (activePoints.length - 1)) * 100;
                  const yCoord = 100 - (pt.val / maxAxisVal) * 80;
                  return (
                    <circle
                      key={idx}
                      cx={xCoord}
                      cy={yCoord}
                      r="2"
                      fill="#ffffff"
                      stroke="#4F46E5"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>

              {/* Day Labels positioned absolute underneath */}
              <div className="absolute inset-x-0 bottom-[-24px] flex justify-between text-[10px] font-semibold text-zinc-500 font-mono px-1">
                {activePoints.map((pt, idx) => (
                  <span key={idx}>{pt.day}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-[#E7E7E4]/55 pt-4 mt-4">
            <h5 className="text-sm font-bold text-zinc-900 mb-0.5">Deep Insights</h5>
            <p className="text-xs text-zinc-500 leading-relaxed">
              {selectedMetric === 'latency' && 'Our global edge routing keeps vocal latencies stably restricted below 24ms in primary hubs, ensuring no voice-lag or audio overlap.'}
              {selectedMetric === 'calls' && 'Total active call pipelines have expanded over 150% week-over-week, handling concurrency thresholds cleanly with immediate cluster balancing.'}
              {selectedMetric === 'fidelity' && 'Neural pronunciation evaluation score remains at 99.8% precision, eliminating low-quality digital vocal artifacts or clipping.'}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
