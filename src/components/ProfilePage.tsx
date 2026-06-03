/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Key, Copy, Check, LogOut, Award, RefreshCw, Layers, CheckCircle } from 'lucide-react';
import { playProceduralSFX, playSynthChime } from '../utils/audioEngine';
import { UserProfile } from '../types';

interface ProfilePageProps {
  profile: UserProfile;
  onChangeProfile: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
  onNavigateToSandbox: () => void;
}

export default function ProfilePage({ profile, onChangeProfile, onLogout, onNavigateToSandbox }: ProfilePageProps) {
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);

  const triggerCopy = () => {
    navigator.clipboard.writeText(profile.apiKey);
    setCopiedKey(true);
    playProceduralSFX('sparkle');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const regenerateApiKey = () => {
    setIsRegeneratingKey(true);
    playProceduralSFX('chime');
    
    setTimeout(() => {
      const generated = 'aur_live_' + Math.random().toString(36).substr(2, 18);
      onChangeProfile({ apiKey: generated });
      setIsRegeneratingKey(false);
      playProceduralSFX('sparkle');
    }, 1000);
  };

  const toggleRole = () => {
    const nextRole = profile.role === 'admin' ? 'user' : 'admin';
    onChangeProfile({ 
      role: nextRole,
      tier: nextRole === 'admin' ? 'Enterprise Elite' : 'Developer Pro',
      voiceQuotaLimit: nextRole === 'admin' ? 100.0 : 10.0
    });
    playSynthChime();
    alert(`Your role was successfully modified to: ${nextRole.toUpperCase()}. This will update available navigation targets.`);
  };

  const handleLogout = () => {
    playProceduralSFX('chime');
    onLogout();
  };

  const quotaPercent = Math.min(100, Math.round((profile.voiceQuotaUsed / profile.voiceQuotaLimit) * 100));

  return (
    <div className="min-h-[calc(100vh-72px)] bg-white px-6 lg:px-8 py-16 flex justify-center items-start">
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[15%] right-[25%] w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-indigo-50 to-emerald-50/50 blur-[120px]" />
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT CARD: Short Profile Intro avatar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-[#E5E7EB] rounded-[2rem] bg-[#F3F4F6]/50 p-6 flex flex-col items-center text-center shadow-xs"
          >
            {/* Avatar block with customizable tone */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black shadow-inner uppercase ${
              profile.role === 'admin' ? 'bg-black text-white' : 'bg-indigo-600 text-white'
            }`}>
              {profile.name.substring(0, 2)}
            </div>

            <div className="mt-4 flex flex-col items-center">
              <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border mb-2 select-none tracking-widest ${
                profile.role === 'admin' 
                  ? 'bg-black text-white border-black' 
                  : 'bg-indigo-50 text-indigo-600 border-indigo-200'
              }`}>
                {profile.role.toUpperCase()}
              </span>

              <h3 className="text-lg font-black text-neutral-900 leading-snug">{profile.name}</h3>
              <p className="text-xs text-zinc-500 font-medium">{profile.email}</p>
            </div>

            {/* Quick action to toggle account role */}
            <div className="w-full h-px bg-[#E5E7EB] my-5" />

            <div className="w-full flex flex-col gap-2">
              <button
                id="toggle-role-btn"
                onClick={toggleRole}
                className="w-full py-2.5 px-3 bg-white border border-[#E5E7EB] hover:bg-[#F3F4F6] rounded-xl text-[11px] font-bold text-neutral-700 tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-zinc-500" />
                Switch to {profile.role === 'admin' ? 'Developer' : 'Administrator'}
              </button>

              <button
                id="profile-logout-btn"
                onClick={handleLogout}
                className="w-full py-2.5 px-3 hover:bg-red-50 hover:text-red-600 rounded-xl text-[11px] font-bold text-zinc-500 tracking-wide transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out session
              </button>
            </div>
          </motion.div>

          {/* Quick billing promo node */}
          <div className="border border-[#E5E7EB] p-5 rounded-2xl bg-white">
            <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
              <Award className="w-4 h-4 text-emerald-500" />
              SLA tier status
            </h4>
            <p className="text-xs font-bold text-zinc-800 mb-1">{profile.tier}</p>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Fully redundant cloud storage enabled. Voiceprints optimized for cluster routing.
            </p>
          </div>
        </div>

        {/* RIGHT CARD: API credentials summary */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-[#E5E7EB] rounded-[2rem] bg-white p-6 md:p-8 flex flex-col gap-6 shadow-[0_12px_40px_rgba(0,0,0,0.015)]"
          >
            <div>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 leading-snug">Vocal pipeline settings</h2>
              <p className="text-xs text-zinc-400 font-medium">Configure synthetic quotas and secure API keys</p>
            </div>

            {/* Vocal quota section */}
            <div className="flex flex-col gap-2 bg-[#F3F4F6]/50 p-5 rounded-[1.5rem] border border-[#E5E7EB]/70">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-zinc-600">Synthesized Recording Quota</span>
                <span className="font-mono text-neutral-800">
                  {profile.voiceQuotaUsed.toFixed(1)} / {profile.voiceQuotaLimit.toFixed(1)} hrs used
                </span>
              </div>
              <div className="w-full bg-zinc-200 h-2 rounded-full overflow-hidden mt-1 inline-flex">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400 mt-1">
                <span>Free basic bandwidth</span>
                <span>Resetting in {28} days</span>
              </div>
            </div>

            {/* API credential tokens list */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Secure developer credentials</h3>
                <span className="text-[10px] font-mono bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-600">
                  Active WebSocket Key
                </span>
              </div>

              <div className="flex items-center gap-3 bg-[#F3F4F6] p-3.5 rounded-2xl border border-[#E5E7EB] relative overflow-hidden">
                <Key className="w-4.5 h-4.5 text-zinc-500 shrink-0" />
                <span className="text-xs font-mono text-zinc-700 overflow-hidden text-ellipsis whitespace-nowrap pr-24 flex-grow select-all">
                  {apiKeyVisible ? profile.apiKey : '• • • • • • • • • • • • • • • • • • • • ' + profile.apiKey.substring(12)}
                </span>

                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    id="profile-toggle-api-visibility"
                    onClick={() => setApiKeyVisible(!apiKeyVisible)}
                    className="text-[10px] font-bold text-zinc-500 bg-white border border-[#E5E7EB] px-2.5 py-1.5 rounded-lg hover:text-black transition-colors cursor-pointer"
                  >
                    {apiKeyVisible ? 'Hide key' : 'Reveal key'}
                  </button>
                  <button
                    id="profile-copy-api"
                    onClick={triggerCopy}
                    className="p-1.5 bg-white border border-[#E5E7EB] rounded-lg text-zinc-500 hover:text-black hover:border-zinc-400 transition-colors cursor-pointer flex items-center justify-center"
                    title="Copy API secret"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* API keys regeneration actions */}
              <div className="flex justify-between items-center mt-1">
                <p className="text-[11px] text-zinc-400 font-medium">
                  Do not share credentials publicly. Bypassed safely on server requests.
                </p>
                
                <button
                  id="profile-refresh-api"
                  disabled={isRegeneratingKey}
                  onClick={regenerateApiKey}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer disabled:text-zinc-400"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingKey ? 'animate-spin' : ''}`} />
                  {isRegeneratingKey ? 'Regenerating...' : 'Regenerate secure credential'}
                </button>
              </div>
            </div>

            <div className="h-px bg-[#E5E7EB] my-1" />

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-zinc-900 mb-1">Developer integrations catalog</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 border border-[#E5E7EB] rounded-2xl bg-white hover:border-zinc-300 transition-colors">
                  <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block mb-0.5">WS STREAM</span>
                  <h5 className="text-xs font-bold text-zinc-800">Real-time Audio Streams</h5>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                    Connect bidirectional WebSocket nodes to receive audio byte streams.
                  </p>
                </div>

                <div className="p-4 border border-[#E5E7EB] rounded-2xl bg-white hover:border-zinc-300 transition-colors">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest block mb-0.5">REST ENDPOINT</span>
                  <h5 className="text-xs font-bold text-zinc-800">Batch synthesis files</h5>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-normal">
                    POST text payloads to trigger server-side audio file rendering.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA back to play sandbox */}
            <div className="mt-4 flex self-end gap-3 w-full sm:w-auto">
              <button
                id="profile-nav-sandbox"
                onClick={() => { playSynthChime(); onNavigateToSandbox(); }}
                className="w-full sm:w-auto bg-black text-white hover:bg-neutral-800 px-6 py-3 rounded-full text-xs font-bold tracking-widest uppercase transition-all shadow-md cursor-pointer text-center"
              >
                Access Voice Sandbox
              </button>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
