/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Users, Activity, Cpu, Server, ShieldCheck, Database, RefreshCw, 
  Trash2, Sliders, Command, TrendingUp, LogOut, LayoutDashboard, 
  Terminal, Shield, Settings, Bell, CircleDot, ChevronRight, CornerDownRight,
  HardDrive, Smartphone, Upload, Plus, Check, Eye, Info, RotateCcw,
  FileArchive, Settings2, SlidersHorizontal, Search, Calendar, ChevronDown, X,
  ArrowUpRight
} from 'lucide-react';
import { playProceduralSFX, playSynthChime } from '../utils/audioEngine';

interface AdminPageProps {
  onExitDashboard: () => void;
}

export default function AdminPage({ onExitDashboard }: AdminPageProps) {
  const [modelSelector, setModelSelector] = useState<'aur_v4_ultra' | 'aur_v3_hybrid'>('aur_v4_ultra');
  const [soundBufferThrottle, setSoundBufferThrottle] = useState(30); // millisecond wait
  const [systemThrottled, setSystemThrottled] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'logs' | 'devices'>('metrics');
  
  // Simulated Devices collection
  const [devices, setDevices] = useState([
    { id: 'AUR-X-89312', name: 'Ambient Soundstage Core-01', type: 'Neural Core', environment: 'Production', active: true, hifi: true, portCount: 8, sampling: 95, fileUploadedName: 'voiceprint-core-init.bin' },
    { id: 'AUR-X-21408', name: 'Sarah\'s Desktop Emulator', type: 'Emulation Hub', environment: 'Development', active: true, hifi: false, portCount: 2, sampling: 60, fileUploadedName: null },
    { id: 'AUR-X-90117', name: 'Tokyo Studio Beam Microphone', type: 'Ambient Mic', environment: 'Sandbox', active: false, hifi: true, portCount: 4, sampling: 120, fileUploadedName: 'tokyo-calibration.json' },
  ]);

  // Form State definitions for Generic Form UI Kit
  const [devName, setDevName] = useState('');
  const [devSerial, setDevSerial] = useState('AUR-X-' + Math.floor(Math.random() * 90000 + 10000));
  const [devType, setDevType] = useState('Neural Core');
  const [devDesc, setDevDesc] = useState('');
  const [devSampling, setDevSampling] = useState(85);
  const [devPortCount, setDevPortCount] = useState(4);
  const [devEnv, setDevEnv] = useState('Sandbox');
  const [devHifi, setDevHifi] = useState(true);
  const [devAutoUpdate, setDevAutoUpdate] = useState(false);
  const [devSslSecure, setDevSslSecure] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Brand-new generic form elements states (Typeahead, Date, Range Selectors)
  const [datacenterSearch, setDatacenterSearch] = useState('');
  const [selectedDatacenter, setSelectedDatacenter] = useState('Asia-East (Taiwan) - GCP');
  const [isDatacenterOpen, setIsDatacenterOpen] = useState(false);
  
  const datacentersList = [
    'US-East (Virginia) - AWS',
    'US-West (Oregon) - AWS',
    'EU-West (Ireland) - AWS',
    'EU-Central (Frankfurt) - AWS',
    'Asia-East (Taiwan) - GCP',
    'Asia-North (Tokyo) - GCP',
    'SA-East (São Paulo) - GCP',
    'US-South (Texas) - Azure',
    'Local Edge Node (San Francisco)'
  ];

  const filteredDatacenters = datacentersList.filter(dc => 
    dc.toLowerCase().includes(datacenterSearch.toLowerCase())
  );

  const [maintenanceDate, setMaintenanceDate] = useState('2026-06-15');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // Schedule Date Range state
  const [scheduleStart, setScheduleStart] = useState('2026-06-03');
  const [scheduleEnd, setScheduleEnd] = useState('2026-06-10');
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
  
  // Numerical Range Slider (Min/Max operational limits)
  const [bandwidthMin, setBandwidthMin] = useState(25);
  const [bandwidthMax, setBandwidthMax] = useState(75);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop handles
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      playSynthChime();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      playSynthChime();
    }
  };

  const removeUploadedFile = () => {
    setUploadedFileName(null);
    playProceduralSFX('laser');
  };

  const handleRandomizeSerial = () => {
    playSynthChime();
    setDevSerial('AUR-X-' + Math.floor(Math.random() * 90000 + 10000));
  };

  const handleResetForm = () => {
    playProceduralSFX('laser');
    setDevName('');
    setDevDesc('');
    setDevSampling(85);
    setDevPortCount(4);
    setDevEnv('Sandbox');
    setDevHifi(true);
    setDevAutoUpdate(false);
    setDevSslSecure(true);
    setUploadedFileName(null);
    setValidationError('');
    
    // Clear brand-new elements
    setDatacenterSearch('');
    setSelectedDatacenter('Asia-East (Taiwan) - GCP');
    setMaintenanceDate('2026-06-15');
    setScheduleStart('2026-06-03');
    setScheduleEnd('2026-06-10');
    setBandwidthMin(25);
    setBandwidthMax(75);
    setIsDatacenterOpen(false);
    setIsDatePickerOpen(false);
    setIsDateRangePickerOpen(false);
  };

  const handleProvisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devName.trim()) {
      playProceduralSFX('laser');
      setValidationError('Device/Context Name is required to bind hardware nodes.');
      return;
    }
    
    setValidationError('');
    playProceduralSFX('sparkle');
    
    const newDevice = {
      id: devSerial,
      name: devName.trim(),
      type: devType,
      environment: devEnv,
      active: true,
      hifi: devHifi,
      portCount: devPortCount,
      sampling: devSampling,
      fileUploadedName: uploadedFileName,
      // Generic Form UI Kit dynamic responses:
      datacenter: selectedDatacenter,
      maintenanceDate,
      scheduleStart,
      scheduleEnd,
      bandwidthRange: `${bandwidthMin}% - ${bandwidthMax}%`
    };
    
    setDevices(prev => [newDevice, ...prev]);
    
    // Append operational container logs
    setLogs(prev => [
      {
        id: Date.now(),
        level: 'SUCCESS',
        message: `Registered device "${newDevice.name}" on ${newDevice.datacenter} successfully [Maint: ${newDevice.maintenanceDate}, BW Limits: ${newDevice.bandwidthRange}]. DSP pipeline initialized.`,
        stamp: new Date().toLocaleTimeString().substring(0, 8)
      },
      ...prev
    ]);
    
    setSuccessToast(`Dynamic node "${newDevice.name}" provisioned.`);
    setTimeout(() => setSuccessToast(''), 6000);
    
    // Clean form elements
    setDevName('');
    setDevDesc('');
    setDevSampling(85);
    setDevPortCount(4);
    setDevEnv('Sandbox');
    setDevHifi(true);
    setDevAutoUpdate(false);
    setDevSslSecure(true);
    setUploadedFileName(null);
    setDevSerial('AUR-X-' + Math.floor(Math.random() * 90000 + 10000));
    
    // Clear operational elements
    setDatacenterSearch('');
    setSelectedDatacenter('Asia-East (Taiwan) - GCP');
    setMaintenanceDate('2026-06-15');
    setScheduleStart('2026-06-03');
    setScheduleEnd('2026-06-10');
    setBandwidthMin(25);
    setBandwidthMax(75);
    setIsDatacenterOpen(false);
    setIsDatePickerOpen(false);
    setIsDateRangePickerOpen(false);
  };
  
  // Real-time telemetry log items
  const [logs, setLogs] = useState<Array<{ id: number; level: 'INFO' | 'SUCCESS' | 'WARN'; message: string; stamp: string }>>([
    { id: 1, level: 'INFO', message: 'Ready state listener initialized on cluster auralis-east-04', stamp: '16:32:01' },
    { id: 2, level: 'SUCCESS', message: 'WebSocket speech synthesizer synchronized client-key (aur_live_***)', stamp: '16:32:45' },
    { id: 3, level: 'INFO', message: 'Recycling model parameters caching memory nodes', stamp: '16:33:12' },
    { id: 4, level: 'SUCCESS', message: 'Preloaded Aria (conversational female US) voice stem mapping inside frame buffer', stamp: '16:33:55' },
  ]);

  const [simulatedUsers, setSimulatedUsers] = useState([
    { id: 1, name: 'Sarah Jenkins', email: 'sarah.jenkins@auralis.io', tier: 'Enterprise Elite', status: 'Active', usage: '21.4 / 100 hrs' },
    { id: 2, name: 'Alex Rivera', email: 'alex.rivera@devmail.com', tier: 'Developer Pro', status: 'Active', usage: '1.8 / 10 hrs' },
    { id: 3, name: 'Takahiro Sato', email: 't.sato@techcorp.jp', tier: 'Enterprise Elite', status: 'Active', usage: '82.9 / 100 hrs' },
    { id: 4, name: 'Elena Rostova', email: 'elena.rostova@voiceai.com', tier: 'Developer Pro', status: 'Inactive', usage: '7.4 / 10 hrs' },
    { id: 5, name: 'Michael Chen', email: 'm.chen@synthlabs.io', tier: 'Free Trial', status: 'Throttled', usage: '2.0 / 2 hrs' },
  ]);

  // Command panel actions
  const triggerTrashCache = () => {
    playProceduralSFX('laser');
    setLogs(prev => [
      { id: Date.now(), level: 'WARN', message: 'Admin discarded 1.25 GB system parameters voiceprint cache manually.', stamp: new Date().toLocaleTimeString().substring(0, 8) },
      ...prev
    ]);
  };

  const triggerThrottleToggle = () => {
    playSynthChime();
    setSystemThrottled(!systemThrottled);
    setLogs(prev => [
      { id: Date.now(), level: 'WARN', message: `Database global synthesizer throttling state modified to: ${!systemThrottled ? 'ENABLED (95ms safety buffer)' : 'DISABLED (None)'}`, stamp: new Date().toLocaleTimeString().substring(0, 8) },
      ...prev
    ]);
  };

  const modelChange = (id: 'aur_v4_ultra' | 'aur_v3_hybrid') => {
    playProceduralSFX('sparkle');
    setModelSelector(id);
    setLogs(prev => [
      { id: Date.now(), level: 'INFO', message: `Active neural voice-generation weights loaded to: ${id === 'aur_v4_ultra' ? 'Auralis v4 Ultra-Conversational' : 'Auralis v3 Hybrid-Speed'}`, stamp: new Date().toLocaleTimeString().substring(0, 8) },
      ...prev
    ]);
  };

  const triggerResetUsers = () => {
    playSynthChime();
    setSimulatedUsers(prev => prev.map(u => ({ ...u, status: 'Active' })));
    setLogs(prev => [
      { id: Date.now(), level: 'SUCCESS', message: 'Admin unlocked all temporary developer account caps to ACTIVE.', stamp: new Date().toLocaleTimeString().substring(0, 8) },
      ...prev
    ]);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex text-zinc-900 font-sans">
      
      {/* SIDEBAR: SaaS Dashboard Menu Panel */}
      <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col justify-between shrink-0 border-r border-zinc-900 select-none">
        
        {/* Brand logo details */}
        <div className="flex flex-col">
          <div className="h-16 flex items-center px-6 gap-2 border-b border-zinc-900">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-xs font-black tracking-widest text-white uppercase font-sans">AURALIS</span>
              <p className="text-[10px] text-zinc-500 font-semibold tracking-wide uppercase">Admin Operations</p>
            </div>
          </div>

          {/* Sidebar Menu items */}
          <nav className="p-4 flex flex-col gap-1">
            <span className="px-3 text-[9px] font-bold uppercase tracking-widest text-zinc-600 block mb-2">Systems</span>

            <button
              id="sidebar-metrics"
              onClick={() => { playSynthChime(); setActiveTab('metrics'); }}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'metrics' 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Tuning Parameters
            </button>

            <button
              id="sidebar-users"
              onClick={() => { playSynthChime(); setActiveTab('users'); }}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'users' 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Users className="w-4 h-4" />
              Developer Accounts
            </button>

            <button
              id="sidebar-devices"
              onClick={() => { playSynthChime(); setActiveTab('devices'); }}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'devices' 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <HardDrive className="w-4 h-4" />
              Registered Devices
            </button>

            <button
              id="sidebar-logs"
              onClick={() => { playSynthChime(); setActiveTab('logs'); }}
              className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'logs' 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'hover:bg-zinc-900/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Container Node Logs
            </button>
          </nav>
        </div>

        {/* Action triggers and public loop-back link at bottom */}
        <div className="p-4 border-t border-zinc-900 flex flex-col gap-3">
          <div className="bg-zinc-900 p-3.5 rounded-xl border border-zinc-800">
            <span className="text-[9px] font-bold uppercase text-zinc-500 tracking-wider">Session Admin</span>
            <p className="text-xs font-bold text-zinc-300 mt-1">Sarah Jenkins</p>
            <p className="text-[10px] text-zinc-600 font-mono truncate">Sarah.Jenkins@auralis.io</p>
          </div>

          <button
            id="sidebar-exit-btn"
            onClick={() => { playProceduralSFX('chime'); onExitDashboard(); }}
            className="w-full bg-[#EF4444]/10 text-red-400 hover:bg-[#EF4444]/20 border border-red-500/20 py-2.5 px-3 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit Admin Console
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER PAGE AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* UPPER MAIN HEADER TOPBAR */}
        <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase text-zinc-400 tracking-widest">Clusters status</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              auralis-prod-active
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => playSynthChime()}
              className="p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-zinc-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-700"> Sarah Jenkins </span>
              <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-black uppercase shadow-inner">
                SA
              </div>
            </div>
          </div>
        </header>

        {/* MIDDLE CONTENT ROUTED AREA */}
        <div className="flex-grow overflow-auto p-8 relative">
          
          {/* TAB 1: METRICS & SYSTEM PARAMETERS */}
          {activeTab === 'metrics' && (
            <div className="flex flex-col gap-8 max-w-[1200px]">
              {/* Header Details */}
              <div>
                <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Neural synthesis global tuner</h1>
                <p className="text-xs text-zinc-500 mt-1">Calibrate latency algorithms, sound buffer limits, and custom vector cache lines</p>
              </div>

              {/* Three grid metric nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white border border-zinc-200 p-6 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">WebSocket node traffic</span>
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-zinc-950 font-mono">1,842</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Simulated concurrent stream connections</p>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">System pipeline latency</span>
                    <Cpu className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-zinc-950 font-mono">31.4 ms</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Average pipeline synthesis delay</p>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 p-6 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.01)] flex flex-col justify-between">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Global cluster load</span>
                    <Server className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-zinc-950 font-mono">{soundBufferThrottle === 30 ? '38.2 %' : '15.4 %'}</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Real-time parameters node capacity</p>
                  </div>
                </div>
              </div>

              {/* Advanced configuration layout mapping */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Advanced slider details */}
                <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col gap-6">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">Neural synthesis global tuner</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Control live performance weights across sandboxed networks</p>
                  </div>

                  {/* Weights */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">Active synthesis weights model</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
                      <button
                        onClick={() => modelChange('aur_v4_ultra')}
                        className={`p-4 rounded-2xl text-left border cursor-pointer transition-all ${
                          modelSelector === 'aur_v4_ultra'
                            ? 'bg-zinc-950 border-black text-white shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <h4 className="text-xs font-bold leading-none">Auralis-v4 Ultra (HD)</h4>
                        <p className={`text-[10px] mt-2 leading-relaxed ${modelSelector === 'aur_v4_ultra' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          Optimized for hyper-realistic conversational cues & breathing.
                        </p>
                      </button>

                      <button
                        onClick={() => modelChange('aur_v3_hybrid')}
                        className={`p-4 rounded-2xl text-left border cursor-pointer transition-all ${
                          modelSelector === 'aur_v3_hybrid'
                            ? 'bg-zinc-950 border-black text-white shadow-sm'
                            : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <h4 className="text-xs font-bold leading-none">Auralis-v3 Fast Hybrid</h4>
                        <p className={`text-[10px] mt-2 leading-relaxed ${modelSelector === 'aur_v3_hybrid' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          Optimized for ultra-low latency interactive dialogue nodes.
                        </p>
                      </button>
                    </div>
                  </div>

                  <div className="h-px bg-zinc-200" />

                  {/* Range Slider */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Sound Buffer Delay Throttle</span>
                        <p className="text-[10px] text-zinc-500 mt-0.5">Calibrates parameters before flushing audio pipeline caches.</p>
                      </div>
                      <span className="text-xs font-black font-mono bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-lg text-zinc-800">
                        {soundBufferThrottle} ms
                      </span>
                    </div>

                    <input
                      id="admin-range-control"
                      type="range"
                      min="10"
                      max="150"
                      step="5"
                      value={soundBufferThrottle}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setSoundBufferThrottle(val);
                        if (val % 25 === 0) playProceduralSFX('sparkle');
                      }}
                      className="w-full h-1.5 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-black"
                    />

                    <div className="flex justify-between items-center text-[9px] font-semibold text-zinc-400 uppercase font-mono">
                      <span>10ms (Real-time limit)</span>
                      <span>150ms (Stable buffer)</span>
                    </div>
                  </div>
                </div>

                {/* Operations side override widget */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-zinc-900 text-zinc-400 p-6 rounded-[2rem] border border-zinc-800 flex flex-col gap-5">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Platform command overrides</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">Bypass system defaults during outages</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={triggerTrashCache}
                        className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-500 p-3 rounded-xl text-left cursor-pointer transition-colors flex items-center gap-3 text-zinc-200"
                      >
                        <Trash2 className="w-4 h-4 text-zinc-400" />
                        <div>
                          <span className="text-xs font-bold block text-white">Flush Voice Cache</span>
                          <p className="text-[9px] text-zinc-400">Frees allocated memory streams.</p>
                        </div>
                      </button>

                      <button
                        onClick={triggerThrottleToggle}
                        className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-500 p-3 rounded-xl text-left cursor-pointer transition-colors flex items-center justify-between text-zinc-200"
                      >
                        <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-zinc-400" />
                          <div>
                            <span className="text-xs font-bold block text-white font-sans">Throttle Database</span>
                            <p className="text-[9px] text-zinc-400">Slow query safety buffer mode.</p>
                          </div>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${systemThrottled ? 'bg-amber-400' : 'bg-zinc-600'}`} />
                      </button>

                      <button
                        onClick={triggerResetUsers}
                        className="w-full bg-zinc-800 border border-zinc-700 hover:border-zinc-500 p-3 rounded-xl text-left cursor-pointer transition-colors flex items-center gap-3 text-zinc-200"
                      >
                        <RefreshCw className="w-4 h-4 text-zinc-400" />
                        <div>
                          <span className="text-xs font-bold block text-white font-sans">Reset developer status</span>
                          <p className="text-[9px] text-zinc-400">Unblocks standard rate limiting.</p>
                        </div>
                      </button>
                    </div>

                    <div className="h-px bg-zinc-800 mt-1" />

                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider font-semibold text-zinc-500">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      SYSTEM STATUS NORMAL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SIMULATED DEV ACCOUNTS */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-8 max-w-[1200px]">
              <div>
                <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Systems Developer Accounts</h1>
                <p className="text-xs text-zinc-500 mt-1">Review concurrent subscriptions, live limits, and throttle status keys</p>
              </div>

              <div className="bg-white border border-zinc-200 rounded-[2rem] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <div className="p-6 border-b border-zinc-100 bg-[#F9FAFB]/75 flex justify-between items-center px-8">
                  <span className="text-xs font-black tracking-wider uppercase text-zinc-400">Client nodes registry</span>
                  <p className="text-[10px] font-bold text-zinc-500 font-mono">Total {simulatedUsers.length} accounts</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-zinc-550 lowercase font-bold text-[10px] uppercase text-zinc-500 tracking-widest font-mono">
                        <th className="py-4.5 px-8">Developer Profile</th>
                        <th className="py-4.5 px-8">Subscription Tier</th>
                        <th className="py-4.5 px-8">Vocal Cache Used</th>
                        <th className="py-4.5 px-8">Telemetry State</th>
                        <th className="py-4.5 px-8 text-right">Interrogate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 text-xs">
                      {simulatedUsers.map(user => (
                        <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="py-5 px-8">
                            <span className="text-xs font-black text-zinc-900 block">{user.name}</span>
                            <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">{user.email}</span>
                          </td>
                          <td className="py-5 px-8">
                            <span className="text-[10px] font-bold tracking-tight bg-indigo-50 border border-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full select-none">
                              {user.tier}
                            </span>
                          </td>
                          <td className="py-5 px-8 text-zinc-700 font-mono font-medium">
                            {user.usage}
                          </td>
                          <td className="py-5 px-8">
                            <span className={`inline-flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider ${
                              user.status === 'Active' ? 'text-emerald-600' : user.status === 'Throttled' ? 'text-amber-500' : 'text-zinc-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : user.status === 'Throttled' ? 'bg-amber-400' : 'bg-zinc-400'
                              }`} />
                              {user.status}
                            </span>
                          </td>
                          <td className="py-5 px-8 text-right">
                            <button
                              onClick={() => {
                                playProceduralSFX('laser');
                                setSimulatedUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'Throttled' ? 'Active' : 'Throttled' } : u));
                              }}
                              className="text-[10px] font-extrabold uppercase text-neutral-600 hover:text-black cursor-pointer bg-zinc-100 hover:bg-zinc-200 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-zinc-300"
                            >
                              {user.status === 'Throttled' ? 'Reset Limits' : 'Impose Throttle'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTAINER OPERATIONS TERMINAL LOGS */}
          {activeTab === 'logs' && (
            <div className="flex flex-col gap-8 max-w-[1200px]">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Container Node logs</h1>
                  <p className="text-xs text-zinc-500 mt-1">Audit trail of runtime models, parameters flushed, and API queries</p>
                </div>

                <button
                  onClick={() => { playProceduralSFX('laser'); setLogs([]); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-black cursor-pointer underline transition-colors"
                >
                  Clear operations display feed
                </button>
              </div>

              {/* Logs visual terminal */}
              <div className="bg-zinc-950 border border-zinc-900 rounded-[1.5rem] p-6 shadow-2xl relative select-text">
                <div className="absolute top-4 right-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0 animate-ping" />
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Streaming LIVE logs feed</span>
                </div>

                <div className="font-mono text-xs text-zinc-400 flex flex-col gap-3 max-h-[500px] overflow-y-auto leading-relaxed">
                  {logs.length === 0 ? (
                    <span className="text-zinc-600 italic">Logger display flushed. Trigger synthesis parameters or weights to initiate database records.</span>
                  ) : (
                    logs.map(log => (
                      <div key={log.id} className="flex gap-4 items-start border-l-2 border-zinc-800 pl-3.5">
                        <span className="text-zinc-600 font-bold select-none shrink-0 font-sans">[{log.stamp}]</span>
                        <span className={`font-mono font-bold uppercase text-[10px] select-none ${
                          log.level === 'SUCCESS' ? 'text-emerald-400' : log.level === 'WARN' ? 'text-amber-400' : 'text-blue-400'
                        }`}>
                          {log.level}
                        </span>
                        <span className="text-zinc-200 select-all">{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEVICE PROVISIONING (THE ULTIMATE FORM UI KIT) */}
          {activeTab === 'devices' && (
            <div className="flex flex-col gap-8 max-w-[1200px] animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
                    <HardDrive className="w-6 h-6 text-indigo-600" />
                    Device Provisioning Console
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    Inject device hardware profiles into the active sound pool. Utilizes clean responsive input paradigms.
                  </p>
                </div>
                
                {successToast && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    {successToast}
                  </motion.div>
                )}
              </div>

              {/* Grid content split column */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* ADVANCED GENERIC FORM UI KIT CORES */}
                <form 
                  onSubmit={handleProvisionSubmit}
                  className="lg:col-span-8 bg-white border border-zinc-200 rounded-[2rem] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col gap-6"
                >
                  <div className="flex items-center gap-2 border-b border-zinc-100 pb-4">
                    <Settings2 className="w-4 h-4 text-zinc-500" />
                    <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">Generic Form UI Element Kit</span>
                  </div>

                  {validationError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 shrink-0 animate-pulse" />
                      {validationError}
                    </div>
                  )}

                  {/* ELEMENT 1 & 2: TEXT INPUTS (Dual row) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="form-dev-name" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Device / Context Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="form-dev-name"
                        type="text"
                        placeholder="e.g. San Francisco Recorders"
                        value={devName}
                        onChange={(e) => setDevName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-indigo-500 focus:outline-none text-xs font-sans text-zinc-800 transition-all placeholder:text-zinc-400"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="form-dev-serial" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Node Serial Hash <span className="text-zinc-300 font-normal">(Auto-Generated)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="form-dev-serial"
                          type="text"
                          readOnly
                          value={devSerial}
                          className="w-full pl-4 pr-11 py-3 rounded-xl bg-zinc-100/80 border border-zinc-200 text-xs font-mono text-zinc-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleRandomizeSerial}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-black hover:bg-zinc-200/60 rounded-lg transition-colors cursor-pointer"
                          title="Generate new serial hash"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ELEMENT 3 & 4: SELECT DROPDOWN AND NUMBER COUNTER */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="form-dev-type" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Device Type Category
                      </label>
                      <select
                        id="form-dev-type"
                        value={devType}
                        onChange={(e) => setDevType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50/55 border border-zinc-200 hover:border-zinc-300 focus:border-indigo-500 focus:outline-none text-xs font-sans text-zinc-700 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a1a1aa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-11.6L18.4%2057.8a17.6%2017.6%200%200%200-11.6%2013%2517.6%2017.6%200%200%200%204.8%2017.2L135%20211c4%203.7%209%205.7%2014%205.7s10-2%2014-5.7l123.5-124c6.3-6.4%206.3-16.6%200-23.2z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px_10px] bg-[right_1rem_center] bg-no-repeat"
                      >
                        <option value="Neural Core">Neural Core (Pipeline DSP)</option>
                        <option value="Emulation Hub">Emulation Hub (Client-Sim)</option>
                        <option value="Ambient Mic">Ambient Mic (High-Fi Feed)</option>
                        <option value="Smart Speaker">Smart Speaker Terminal</option>
                        <option value="Vocal Array">Vocal Array Rig</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        Stream Port Allocation Limit
                      </label>
                      <div className="flex bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden h-[42px] items-center">
                        <button
                          type="button"
                          onClick={() => { playSynthChime(); setDevPortCount(c => Math.max(1, c - 1)); }}
                          className="w-12 h-full text-zinc-500 hover:text-black hover:bg-zinc-200/50 transition-colors uppercase font-bold text-lg select-none cursor-pointer"
                        >
                          -
                        </button>
                        <div className="flex-1 text-center font-mono text-xs font-bold text-zinc-800">
                          {devPortCount} concurrent ports
                        </div>
                        <button
                          type="button"
                          onClick={() => { playSynthChime(); setDevPortCount(c => Math.min(32, c + 1)); }}
                          className="w-12 h-full text-zinc-500 hover:text-black hover:bg-zinc-200/50 transition-colors uppercase font-bold text-lg select-none cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ELEMENT 4B & 4C: TYPEAHEAD SEARCH SELECT & CALENDAR DATE PICKER (DUAL COL GRID) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* TYPEAHEAD SEARCH */}
                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                        <Search className="w-3 h-3 text-indigo-500 shrink-0" />
                        Target Datacenter Node (Typeahead Search)
                      </label>
                      <div className="relative">
                        <button
                          id="form-datacenter-trigger"
                          type="button"
                          onClick={() => { playSynthChime(); setIsDatacenterOpen(!isDatacenterOpen); setIsDatePickerOpen(false); setIsDateRangePickerOpen(false); }}
                          className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 flex justify-between items-center transition-all cursor-pointer h-[42px]"
                        >
                          <span className="truncate">{selectedDatacenter || "Select a cluster..."}</span>
                          <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isDatacenterOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDatacenterOpen && (
                          <div className="absolute left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-2.5 animate-fade-in flex flex-col gap-2.5">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                              <input
                                type="text"
                                placeholder="Search clusters (AWS, GCP, Azure...)..."
                                value={datacenterSearch}
                                onChange={(e) => setDatacenterSearch(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 text-xs font-sans rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-indigo-500 text-zinc-800"
                                autoFocus
                              />
                              {datacenterSearch && (
                                <button
                                  type="button"
                                  onClick={() => setDatacenterSearch('')}
                                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            
                            <div className="max-h-40 overflow-y-auto flex flex-col gap-1 pr-1">
                              {filteredDatacenters.length === 0 ? (
                                <p className="text-[11px] text-zinc-400 italic py-2 text-center select-none">No clusters found matching "{datacenterSearch}"</p>
                              ) : (
                                filteredDatacenters.map((dc) => (
                                  <button
                                    key={dc}
                                    type="button"
                                    onClick={() => {
                                      playSynthChime();
                                      setSelectedDatacenter(dc);
                                      setIsDatacenterOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                                      selectedDatacenter === dc 
                                        ? 'bg-zinc-950 text-white' 
                                        : 'text-zinc-700 hover:bg-zinc-100'
                                    }`}
                                  >
                                    <span>{dc}</span>
                                    {selectedDatacenter === dc && <Check className="w-3 h-3" />}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* SINGLE DATE PICKER */}
                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                        <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                        Maintenance Schedule (Date Picker)
                      </label>
                      <div className="relative">
                        <button
                          id="form-datepicker-trigger"
                          type="button"
                          onClick={() => { playSynthChime(); setIsDatePickerOpen(!isDatePickerOpen); setIsDatacenterOpen(false); setIsDateRangePickerOpen(false); }}
                          className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 flex justify-between items-center transition-all cursor-pointer h-[42px]"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                            <span className="truncate">{maintenanceDate ? new Date(maintenanceDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : "Select date..."}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {isDatePickerOpen && (
                          <div className="absolute right-0 left-0 sm:left-auto sm:w-[280px] mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-3.5 animate-fade-in flex flex-col gap-3">
                            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 select-none">
                              <span className="text-xs font-bold text-zinc-800">June 2026</span>
                              <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase">Slots Open</span>
                            </div>
                            
                            <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-zinc-400 select-none">
                              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                            </div>
                            
                            {/* Calendar Days for June 2026. Starts on Monday (June 1st), total 30 days */}
                            <div className="grid grid-cols-7 gap-1">
                              {/* Empty space for Sunday */}
                              <div className="h-6" />
                              {Array.from({ length: 30 }).map((_, idx) => {
                                const dayNum = idx + 1;
                                const dayNumStr = String(dayNum).padStart(2, '0');
                                const dateStr = `2026-06-${dayNumStr}`;
                                const isSelected = maintenanceDate === dateStr;
                                return (
                                  <button
                                    key={dayNum}
                                    type="button"
                                    onClick={() => {
                                      playSynthChime();
                                      setMaintenanceDate(dateStr);
                                      setIsDatePickerOpen(false);
                                    }}
                                    className={`h-6 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                      isSelected 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'text-zinc-700 hover:bg-zinc-100'
                                    }`}
                                  >
                                    {dayNum}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[9px] text-zinc-400 text-center select-none font-medium mt-1">Select June calendar slot for maintenance loop</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                  </div>

                  {/* ELEMENT 5: TEXTAREA WITH CHARACTER LIMIT */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <label htmlFor="form-dev-desc" className="text-zinc-400">
                        Node Deployment Notes / metadata
                      </label>
                      <span className={`font-mono ${devDesc.length > 220 ? 'text-amber-500' : 'text-zinc-300'}`}>
                        {devDesc.length} / 250
                      </span>
                    </div>
                    <textarea
                      id="form-dev-desc"
                      placeholder="e.g. Back-channel voice synthesis routing mapped through secure edge tunnels"
                      value={devDesc}
                      maxLength={250}
                      onChange={(e) => setDevDesc(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 focus:bg-white border border-zinc-200 focus:border-indigo-500 focus:outline-none text-xs font-sans text-zinc-800 leading-relaxed transition-all placeholder:text-zinc-400 resize-none"
                    />
                  </div>

                  {/* ELEMENT 6: DYNAMIC SLIDER WITH GRAPHICAL VALUE INDICATOR */}
                  <div className="flex flex-col gap-1.5 bg-zinc-50/50 border border-zinc-100 p-5 rounded-2xl w-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sampling frequency multiplier</span>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Fine tune local DSP oscillator speeds</p>
                      </div>
                      <span className="text-xs font-black font-mono bg-white border border-zinc-200 px-2.5 py-1 rounded-lg text-indigo-600 shadow-sm">
                        {devSampling} kHz
                      </span>
                    </div>
                    <div className="flex gap-4 items-center mt-2.5">
                      <span className="text-[10px] font-bold text-zinc-400 font-mono">16kHz</span>
                      <input
                        id="form-dev-range"
                        type="range"
                        min="16"
                        max="192"
                        step="1"
                        value={devSampling}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setDevSampling(val);
                          if (val % 22 === 0) playProceduralSFX('sparkle');
                        }}
                        className="flex-1 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="text-[10px] font-bold text-zinc-400 font-mono">192kHz</span>
                    </div>
                  </div>

                  {/* ELEMENT 6B & 6C: RANGE PICKERS (DATE RANGE & NUMERICAL RANGE SLIDER) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    {/* DATE RANGE PICKER */}
                    <div className="flex flex-col gap-1.5 relative">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                        <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                        Operating Schedule (Date Range Picker)
                      </label>
                      <div className="relative">
                        <button
                          id="form-range-picker-trigger"
                          type="button"
                          onClick={() => { playSynthChime(); setIsDateRangePickerOpen(!isDateRangePickerOpen); setIsDatacenterOpen(false); setIsDatePickerOpen(false); }}
                          className="w-full text-left px-4 py-3 rounded-xl bg-zinc-50/50 hover:bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 flex justify-between items-center transition-all cursor-pointer h-[42px]"
                        >
                          <div className="flex items-center gap-1 truncate font-mono text-xs text-zinc-700">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500 shrink-0 mr-1.5" />
                            <span>{scheduleStart}</span>
                            <span className="text-zinc-300 font-sans mx-1 select-none">→</span>
                            <span className="text-indigo-600 font-bold">{scheduleEnd}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${isDateRangePickerOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDateRangePickerOpen && (
                          <div className="absolute right-0 left-0 sm:left-auto sm:w-[280px] mt-1.5 bg-white border border-zinc-200 rounded-xl shadow-xl z-50 p-3.5 animate-fade-in flex flex-col gap-3">
                            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 select-none">
                              <span className="text-xs font-bold text-zinc-800 font-sans">June 2026 Schedule Range</span>
                              <span className="text-[9px] font-mono text-indigo-600 font-bold uppercase">Active Loop</span>
                            </div>

                            <div className="flex gap-2 items-center">
                              <div className="flex-1">
                                <span className="text-[9px] text-zinc-400 font-bold uppercase block mb-1 font-sans">Start Day</span>
                                <select 
                                  value={scheduleStart.split('-')[2]} 
                                  onChange={(e) => {
                                    playSynthChime();
                                    const day = e.target.value;
                                    setScheduleStart(`2026-06-${day}`);
                                  }}
                                  className="w-full p-2 text-xs font-mono rounded bg-zinc-50 border border-zinc-200 cursor-pointer text-zinc-800"
                                >
                                  {Array.from({ length: 15 }).map((_, i) => {
                                    const dayStr = String(i + 1).padStart(2, '0');
                                    return <option key={dayStr} value={dayStr}>{dayStr} (Jun 2026)</option>;
                                  })}
                                </select>
                              </div>
                              <div className="flex-1">
                                <span className="text-[9px] text-zinc-400 font-bold uppercase block mb-1 font-sans">Ending Day</span>
                                <select 
                                  value={scheduleEnd.split('-')[2]} 
                                  onChange={(e) => {
                                    playSynthChime();
                                    const day = e.target.value;
                                    setScheduleEnd(`2026-06-${day}`);
                                  }}
                                  className="w-full p-2 text-xs font-mono rounded bg-zinc-50 border border-zinc-200 cursor-pointer text-zinc-800"
                                >
                                  {Array.from({ length: 15 }).map((_, i) => {
                                    const dayStr = String(i + 16).padStart(2, '0');
                                    return <option key={dayStr} value={dayStr}>{dayStr} (Jun 2026)</option>;
                                  })}
                                </select>
                              </div>
                            </div>

                            <div className="p-2 bg-indigo-50/50 rounded-lg text-[9px] text-zinc-500 font-sans border border-indigo-100">
                              <span className="font-bold text-indigo-900 block mb-0.5 select-none">Configured Operating Band:</span>
                              June {scheduleStart.split('-')[2]} to June {scheduleEnd.split('-')[2]}, 2026
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* DUAL NUMERICAL LIMIT RANGE SLIDER */}
                    <div className="flex flex-col gap-1.5 bg-zinc-50/55 border border-zinc-200 p-3 rounded-xl w-full">
                      <div className="flex justify-between items-center select-none">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1 leading-none">
                          <SlidersHorizontal className="w-3 h-3 text-indigo-500 shrink-0" />
                          Bandwidth Limits (Range Picker)
                        </span>
                        <div className="flex items-center gap-1 text-[9px] font-extrabold font-mono text-indigo-600 bg-white border border-zinc-200 px-1.5 py-0.5 rounded shadow-sm">
                          <span>{bandwidthMin}%</span>
                          <span className="text-zinc-300">-</span>
                          <span>{bandwidthMax}%</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-1 select-none">
                        <div className="relative">
                          <div className="h-1 bg-zinc-200 rounded-full w-full relative">
                            <div 
                              className="absolute h-1 bg-indigo-600 rounded-full" 
                              style={{ 
                                left: `${bandwidthMin}%`, 
                                right: `${100 - bandwidthMax}%` 
                              }} 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-0.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] font-bold text-zinc-400 uppercase">Min</span>
                            <input 
                              type="range"
                              min="0"
                              max="45"
                              value={bandwidthMin}
                              onChange={(e) => {
                                playSynthChime();
                                setBandwidthMin(parseInt(e.target.value));
                              }}
                              className="h-1 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] font-bold text-zinc-400 uppercase">Max</span>
                            <input 
                              type="range"
                              min="55"
                              max="100"
                              value={bandwidthMax}
                              onChange={(e) => {
                                playSynthChime();
                                setBandwidthMax(parseInt(e.target.value));
                              }}
                              className="h-1 bg-zinc-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                  </div>

                  {/* ELEMENT 7: RADIO CARDS ENVIRONMENT SELECTOR */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Deployment Environment Network
                    </span>
                    <div className="grid grid-cols-3 gap-3.5 mt-1">
                      {['Development', 'Sandbox', 'Production'].map((env) => {
                        const isSelected = devEnv === env;
                        return (
                          <button
                            key={env}
                            type="button"
                            onClick={() => { playSynthChime(); setDevEnv(env); }}
                            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                              isSelected 
                                ? 'bg-zinc-950 border-zinc-950 text-white shadow-sm' 
                                : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold font-sans">{env}</span>
                              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center p-[2px] ${
                                isSelected ? 'border-white' : 'border-zinc-300'
                              }`}>
                                {isSelected && <div className="w-full h-full rounded-full bg-white animate-fade-in" />}
                              </div>
                            </div>
                            <p className={`text-[9px] mt-1.5 select-none ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                              {env === 'Production' ? 'Live public nodes' : env === 'Sandbox' ? 'Internal tests pool' : 'Local developer env'}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ELEMENT 8 & 9: MULTIPLE CHECKBOX & INLINE TOGGLE SWITCH */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* CHECKBOX ELEMENTS COLLECTION */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Option Directives</span>
                      
                      <label htmlFor="form-dev-hifi" className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-zinc-600 hover:text-black">
                        <div className="relative flex items-center">
                          <input
                            id="form-dev-hifi"
                            type="checkbox"
                            checked={devHifi}
                            onChange={(e) => { playSynthChime(); setDevHifi(e.target.checked); }}
                            className="peer sr-only"
                          />
                          <div className={`w-4 h-4 rounded border transition-colors ${
                            devHifi ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300 hover:border-zinc-400'
                          } flex items-center justify-center`}>
                            {devHifi && <Check className="w-3 h-3 stroke-[3px]" />}
                          </div>
                        </div>
                        <span className="font-semibold font-sans">High-Fidelity Stem Model</span>
                      </label>

                      <label htmlFor="form-dev-autoupdate" className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-zinc-600 hover:text-black mt-1">
                        <div className="relative flex items-center">
                          <input
                            id="form-dev-autoupdate"
                            type="checkbox"
                            checked={devAutoUpdate}
                            onChange={(e) => { playSynthChime(); setDevAutoUpdate(e.target.checked); }}
                            className="peer sr-only"
                          />
                          <div className={`w-4 h-4 rounded border transition-colors ${
                            devAutoUpdate ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300 hover:border-zinc-400'
                          } flex items-center justify-center`}>
                            {devAutoUpdate && <Check className="w-3 h-3 stroke-[3px]" />}
                          </div>
                        </div>
                        <span className="font-semibold font-sans">Perform automatic sync updates</span>
                      </label>
                    </div>

                    {/* DYNAMIC TOGGLE SWITCH COMPONENT */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Security Directives</span>
                      
                      <div className="flex items-center justify-between bg-zinc-50 border border-zinc-100 p-3 rounded-xl mt-0.5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-zinc-800">SSL WebSockets Secure</span>
                          <span className="text-[9px] text-zinc-400 font-mono">WSS:// network handshake rule</span>
                        </div>
                        
                        <button
                          id="form-dev-ssl-toggle"
                          type="button"
                          onClick={() => { playSynthChime(); setDevSslSecure(!devSslSecure); }}
                          className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer focus:outline-none ${
                            devSslSecure ? 'bg-indigo-600' : 'bg-zinc-300'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                            devSslSecure ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ELEMENT 10: CUSTOM DRAG & DROP FILE UPLOADER */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Calibration Payload File Bundle</span>
                    
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                        isDragOver 
                          ? 'border-indigo-500 bg-indigo-50/20' 
                          : 'border-zinc-300 hover:border-indigo-400 hover:bg-zinc-50/40'
                      }`}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden" 
                        accept=".bin,.json,.zip"
                      />
                      
                      {uploadedFileName ? (
                        <div className="flex items-center gap-3 bg-white border border-zinc-200 px-4 py-2.5 rounded-xl shadow-sm animate-fade-in group" onClick={(e) => e.stopPropagation()}>
                          <FileArchive className="w-5 h-5 text-indigo-500 shrink-0" />
                          <div className="text-left">
                            <span className="text-xs font-bold text-zinc-800 font-mono truncate max-w-[200px] block">{uploadedFileName}</span>
                            <span className="text-[9px] text-zinc-400 uppercase font-bold tracking-wider">Loaded calibration node file</span>
                          </div>
                          <button
                            type="button"
                            onClick={removeUploadedFile}
                            className="p-1 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
                            title="Remove target file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="p-2.5 bg-zinc-100 rounded-xl text-zinc-400 group-hover:text-indigo-500">
                            <Upload className="w-4 h-4" />
                          </div>
                          <p className="text-xs font-bold text-zinc-700">Drag & drop context payload file here, or click to browse</p>
                          <p className="text-[9px] text-zinc-400 uppercase font-mono font-bold">Accepts optional BIN, JSON, or ZIP packages (Max 80MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* FORM TRIGGER ACTIONS */}
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-100 mt-2">
                    <button
                      id="form-btn-reset"
                      type="button"
                      onClick={handleResetForm}
                      className="px-5 py-3 hover:bg-zinc-100 text-zinc-500 hover:text-black rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-zinc-200"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Form Elements
                    </button>

                    <button
                      id="form-btn-submit"
                      type="submit"
                      className="px-6 py-3 bg-black text-white hover:bg-zinc-800 rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer scale-100 hover:shadow-lg"
                    >
                      <Plus className="w-4 h-4 text-white" />
                      Provision Device Node
                    </button>
                  </div>
                </form>

                {/* SIDEBAR PREVIEW COLUMN */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  
                  {/* METRIC CARD */}
                  <div className="bg-zinc-950 text-zinc-400 p-6 rounded-[2rem] border border-zinc-900 select-none flex flex-col gap-5">
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-widest">Active provisioned stats</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">Network registry diagnostic ratios</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                        <span className="text-[10px] font-bold uppercase text-zinc-500">Hardware Nodes Online</span>
                        <span className="font-mono text-xs font-bold text-white bg-indigo-950/80 px-2 py-0.5 rounded-md text-indigo-200 border border-indigo-900">
                          {devices.filter(d => d.active).length} nodes
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                        <span className="text-[10px] font-bold uppercase text-zinc-500">Hi-Fi Stems Active</span>
                        <span className="font-mono text-xs font-bold text-white bg-emerald-950/80 px-2 py-0.5 rounded-md text-emerald-200 border border-emerald-900">
                          {devices.filter(d => d.hifi).length} models
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-zinc-900">
                        <span className="text-[10px] font-bold uppercase text-zinc-500">Total Provisioned Devices</span>
                        <span className="font-mono text-xs font-bold text-zinc-300">
                          {devices.length} slots
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800">
                      <div className="flex gap-2 items-start shrink-0">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-zinc-400 leading-relaxed font-sans font-medium">
                          All provisioned nodes listed below compile instantly into the telemetry routing tables. Switch tabs to logs or accounts to view live pipeline reports.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE DEVICES PREVIEW LIST */}
                  <div className="bg-white border border-zinc-200 p-6 rounded-[2rem] shadow-[0_4px_24px_rgba(0,0,0,0.015)] flex flex-col gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest">Mock Hardware list</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5 font-medium">Real-time update stream list</p>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {devices.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic">No nodes provisioned. Use the UI Kit form on the left to add one.</p>
                      ) : (
                        devices.map((dev) => (
                          <div key={dev.id} className="p-3.5 bg-zinc-50/50 hover:bg-zinc-50 rounded-xl border border-zinc-200/80 hover:border-zinc-300 transition-all flex flex-col gap-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-black text-zinc-900 block truncate">{dev.name}</span>
                                <span className="text-[9px] font-mono font-bold text-zinc-400 mt-0.5 block">{dev.id}</span>
                              </div>
                              <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${
                                dev.environment === 'Production' 
                                  ? 'bg-rose-50 border border-rose-100 text-rose-600'
                                  : dev.environment === 'Sandbox'
                                  ? 'bg-amber-50 border border-amber-100 text-amber-600'
                                  : 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                              }`}>
                                {dev.environment}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-semibold text-zinc-500 pt-1 border-t border-zinc-200/40">
                              <span className="font-sans">{dev.type}</span>
                              <div className="flex items-center gap-1.5 font-mono text-[9px]">
                                <span className={`w-1.5 h-1.5 rounded-full ${dev.active ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                                <span>{dev.sampling}kHz</span>
                              </div>
                            </div>

                            {/* Supplementary newly provisioned properties */}
                            {(dev as any).datacenter && (
                              <div className="text-[9px] text-zinc-400 font-sans border-t border-zinc-200/40 pt-1.5 flex flex-col gap-1 select-none">
                                <div className="flex justify-between items-center bg-zinc-50/50 p-1 px-1.5 rounded">
                                  <span className="font-bold">Node Cluster:</span>
                                  <span className="truncate text-zinc-600 font-medium max-w-[140px]">{(dev as any).datacenter}</span>
                                </div>
                                <div className="flex justify-between font-mono text-[8px] text-zinc-400">
                                  <span>Maint: {(dev as any).maintenanceDate}</span>
                                  <span>BW Cap: {(dev as any).bandwidthRange}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
