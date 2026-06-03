/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SlidersHorizontal, LayoutGrid, List, MapPin, Star, 
  ShieldCheck, Loader2, ChevronDown, X, Phone, Mail, ExternalLink, 
  Tag, Filter, AlertCircle, RotateCcw, ArrowUpDown, Sparkles, Check
} from 'lucide-react';
import { playSynthChime } from '../utils/audioEngine';

// Vendor Interface Definition
export interface Vendor {
  id: string;
  name: string;
  category: string;
  city: 'San Francisco' | 'Tokyo' | 'London' | 'Berlin' | 'New York' | 'Sydney';
  rating: number;
  reviewsCount: number;
  description: string;
  tags: string[];
  isVerified: boolean;
  contactEmail: string;
  contactPhone: string;
  website: string;
  iconBg: string;
  specialty: string;
}

// Complete rich mock dataset of vendors
const MOCK_VENDORS: Vendor[] = [
  {
    id: 'v1',
    name: 'Sonitus Core Laboratories',
    category: 'Acoustic Hardware',
    city: 'Berlin',
    rating: 4.9,
    reviewsCount: 142,
    description: 'Pioneering manufacturers of ultra-high fidelity reference microphones and spatial soundproof materials tailored for next-generation generative AI voice actors.',
    tags: ['Microphones', 'Acoustics', 'Studio Gear'],
    isVerified: true,
    contactEmail: 'engineering@sonitus.de',
    contactPhone: '+49 30 8910293',
    website: 'https://sonitus.de',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
    specialty: 'Spatial acoustics arrays & active field monitoring'
  },
  {
    id: 'v2',
    name: 'VocalSynergy Synthetics',
    category: 'Vocal AI Engineering',
    city: 'San Francisco',
    rating: 4.8,
    reviewsCount: 94,
    description: 'Specialists in custom text-to-speech engine optimization, emotional layer fine-tuning, and ultra-low latency API bindings for virtual customer agents.',
    tags: ['TTS', 'LLMs', 'API Proxy'],
    isVerified: true,
    contactEmail: 'partners@vocalsynergy.ai',
    contactPhone: '+1 (415) 555-0192',
    website: 'https://vocalsynergy.ai',
    iconBg: 'bg-gradient-to-br from-indigo-600 to-blue-600',
    specialty: 'High-fidelity emotional speech cloning pipelines'
  },
  {
    id: 'v3',
    name: 'Acoustic Grid Systems',
    category: 'Cloud Sound Systems',
    city: 'Tokyo',
    rating: 4.7,
    reviewsCount: 118,
    description: 'Providing edge cloud distribution for spatial sound rendering, ambient noise cancellation, and high-security multi-user stream orchestrations.',
    tags: ['Cloud Streaming', 'Edge Nodes', 'WSS Node'],
    isVerified: true,
    contactEmail: 'info@acousticgrids.jp',
    contactPhone: '+81 3 5555 0143',
    website: 'https://acousticgrids.co.jp',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    specialty: 'Global low-latency dynamic audio streaming'
  },
  {
    id: 'v4',
    name: 'Elysian Soundscape Studios',
    category: 'Creative Audio Design',
    city: 'London',
    rating: 4.9,
    reviewsCount: 76,
    description: 'Award-winning sound directors specializing in procedural foley synthesis, deep ambient backdrops, and narrative flow engineering for premium brands.',
    tags: ['Procedural Foley', 'Music Synthesis', 'Ambient'],
    isVerified: false,
    contactEmail: 'creatives@elysiansounds.co.uk',
    contactPhone: '+44 20 7946 0918',
    website: 'https://elysiansounds.co.uk',
    iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
    specialty: 'Aural worldbuilding and sensory flow paths'
  },
  {
    id: 'v5',
    name: 'DSP Nexus Technologies',
    category: 'DSP Integration',
    city: 'Sydney',
    rating: 4.6,
    reviewsCount: 52,
    description: 'Providing expert embedded hardware integrations for Digital Signal Processing, multi-band compression filters, and native voice noise-gate chips.',
    tags: ['DSP Integration', 'Hardware Chips', 'Noise Gate'],
    isVerified: true,
    contactEmail: 'integrations@dspnexus.com.au',
    contactPhone: '+61 2 9876 5432',
    website: 'https://dspnexus.com.au',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-650',
    specialty: 'Embedded real-time filtering & FPGA sound cards'
  },
  {
    id: 'v6',
    name: '3D Spatial Audio Labs',
    category: 'Spatial Sound Labs',
    city: 'Berlin',
    rating: 4.9,
    reviewsCount: 88,
    description: 'Specialized HRTF filter libraries, head-tracking sound decoders, and immersive binaural rendering templates designed for cinematic headsets and XR.',
    tags: ['HRTF', 'Spatialized', 'Binaural', 'VR'],
    isVerified: true,
    contactEmail: 'spatial@3daudiolabs.de',
    contactPhone: '+49 30 55562810',
    website: 'https://3daudiolabs.de',
    iconBg: 'bg-gradient-to-br from-sky-500 to-violet-700',
    specialty: 'Head-Related Transfer Function algorithmic modeling'
  },
  {
    id: 'v7',
    name: 'Synapse Neural Vocoder',
    category: 'Neural Vocoder Synthesis',
    city: 'Tokyo',
    rating: 4.8,
    reviewsCount: 104,
    description: 'Pioneering neural vocoders that capture complex human breathing, micro-tremors, and voice contours to eliminate the robotic drone entirely.',
    tags: ['Vocoder', 'Neural Networks', 'Bio-acoustic'],
    isVerified: true,
    contactEmail: 'vocoder@synapse.jp',
    contactPhone: '+81 3 4567 8910',
    website: 'https://synapse-vocoder.jp',
    iconBg: 'bg-gradient-to-br from-fuchsia-600 to-indigo-800',
    specialty: 'Realtime GAN-based neural voice reconstructors'
  },
  {
    id: 'v8',
    name: 'Aura Emotion Modeling',
    category: 'Speech Emotion Modeling',
    city: 'New York',
    rating: 4.7,
    reviewsCount: 65,
    description: 'Fine-tuning voice generation layers to include authentic emotional expressions like excitement, empathy, hesitation, and breath punctuation.',
    tags: ['Emotion Layers', 'SSML', 'Humanization'],
    isVerified: false,
    contactEmail: 'empathy@auramodeling.com',
    contactPhone: '+1 (212) 555-8734',
    website: 'https://auramodeling.com',
    iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    specialty: 'Sub-audible breathing insertion & cadence models'
  },
  {
    id: 'v9',
    name: 'Helix Procedural Engines',
    category: 'Procedural Sound Engines',
    city: 'Sydney',
    rating: 4.5,
    reviewsCount: 47,
    description: 'Algorithmic audio generation engines that create physical impact sound waves, environmental cues, and complex mechanical sound layers in real-time.',
    tags: ['Procedural Sync', 'Interactive Physics', 'Game Audio'],
    isVerified: true,
    contactEmail: 'helix-engines@helix.com.au',
    contactPhone: '+61 2 8734 1122',
    website: 'https://helixengines.com.au',
    iconBg: 'bg-gradient-to-br from-rose-500 to-amber-600',
    specialty: 'Real-time synthesizer equations for vector physical assets'
  },
  {
    id: 'v10',
    name: 'FoleyForge & FX',
    category: 'Foley & Sound FX',
    city: 'London',
    rating: 4.8,
    reviewsCount: 92,
    description: 'Supplying a state-of-the-art catalog of sound signatures and uncompressed procedural audio effects ready for dynamic software triggers.',
    tags: ['SFX Cues', 'Footsteps', 'Ambient Loops'],
    isVerified: true,
    contactEmail: 'sfx@foleyforge.co.uk',
    contactPhone: '+44 20 8769 0120',
    website: 'https://foleyforge.co.uk',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    specialty: 'Custom soundscapes and high-velocity foley assets'
  },
  {
    id: 'v11',
    name: 'Vortex Signal Cancelation',
    category: 'Echo Cancelation Labs',
    city: 'Berlin',
    rating: 4.6,
    reviewsCount: 55,
    description: 'Advanced signal cancelation libraries that isolate ambient workspace echo and device noise for remote telemetry pipelines.',
    tags: ['Echo Isolation', 'Noise Gate', 'SDK Filters'],
    isVerified: false,
    contactEmail: 'cancelation@vortex.de',
    contactPhone: '+49 30 7654 3210',
    website: 'https://vortex-cancelation.de',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-lime-600',
    specialty: 'Multi-microphone acoustic beamforming arrays'
  },
  {
    id: 'v12',
    name: 'Resolute Pitch Trackers',
    category: 'Real-time Pitch Trackers',
    city: 'London',
    rating: 4.9,
    reviewsCount: 135,
    description: 'C++ embedded SDK micro-drivers offering zero-delay pitch estimation, frequency scale snapping, and phase-locked loop signal adjustments.',
    tags: ['Pitch Shift', 'Autotune Engine', 'C++', 'Embedded'],
    isVerified: true,
    contactEmail: 'pitch@resoluteaudio.co.uk',
    contactPhone: '+44 20 7432 0987',
    website: 'https://resoluteaudio.co.uk',
    iconBg: 'bg-gradient-to-br from-sky-600 to-indigo-950',
    specialty: 'Phase-covariant monophonic & polyphonic pitch tracking'
  },
  {
    id: 'v13',
    name: 'CyberBiometric Voice Systems',
    category: 'Biometric Voice Auth',
    city: 'Tokyo',
    rating: 4.7,
    reviewsCount: 71,
    description: 'Highly secure acoustic verification pathways mapping voiceprint frequencies, dental structure resonance, and nasal passage curves.',
    tags: ['Voiceprint', 'Security Auth', 'E2EE Encryption'],
    isVerified: true,
    contactEmail: 'auth@cyberbiometric.jp',
    contactPhone: '+81 3 9876 5432',
    website: 'https://cyberbiometric.co.jp',
    iconBg: 'bg-gradient-to-br from-red-500 to-rose-700',
    specialty: 'Anti-spoofing voice print verification neural chips'
  },
  {
    id: 'v14',
    name: 'Ultralow Low-Latency APIs',
    category: 'Low-Latency APIs',
    city: 'San Francisco',
    rating: 4.8,
    reviewsCount: 156,
    description: 'Sub-30ms global WebRTC routing relays and serverless audio pipelines that aggregate, process, and broadcast conversations in real-time.',
    tags: ['WebRTC Gateway', 'Serverless Relay', 'Sub-30ms'],
    isVerified: true,
    contactEmail: 'api@ultralow.io',
    contactPhone: '+1 (415) 555-0145',
    website: 'https://ultralow.io',
    iconBg: 'bg-gradient-to-br from-amber-500 to-red-650',
    specialty: 'Edge-node dynamic clustering for fluid voice conversations'
  },
  {
    id: 'v15',
    name: 'Apex Field Monitors',
    category: 'Active Field Monitors',
    city: 'New York',
    rating: 4.9,
    reviewsCount: 201,
    description: 'Smart biophysically adjusted monitors that calibrate output sound waves in real-time based on the exact shape of human ears and room furniture.',
    tags: ['Smart Speakers', 'Room Tuning', 'Acoustic Calibration'],
    isVerified: true,
    contactEmail: 'calibrations@apexmonitors.com',
    contactPhone: '+1 (212) 555-0199',
    website: 'https://apexmonitors.com',
    iconBg: 'bg-gradient-to-br from-indigo-700 to-violet-900',
    specialty: 'Biophysically tailored digital spatial sound monitors'
  },
  {
    id: 'v16',
    name: 'Neumann Wave Transducers',
    category: 'Legacy Audio Transducers',
    city: 'Berlin',
    rating: 4.9,
    reviewsCount: 310,
    description: 'Crafting legacy reference microphone diaphragms and pristine hardware sound pick-ups for classical instrument recording in acoustic studios.',
    tags: ['Transducers', 'Prisline Recording', 'Microphone Hardware'],
    isVerified: true,
    contactEmail: 'reception@neumannwave.de',
    contactPhone: '+49 30 1122 3344',
    website: 'https://neumannwave.de',
    iconBg: 'bg-gradient-to-br from-zinc-700 to-zinc-950',
    specialty: 'Uncolored analog gold-sputtered capsule manufacturing'
  },
  {
    id: 'v17',
    name: 'FMOD-Nexus Middleware',
    category: 'Game Audio Middleware',
    city: 'Tokyo',
    rating: 4.7,
    reviewsCount: 82,
    description: 'Providing elite middleware integrations, dynamic mix matrices, and spatial positioning engine plugins for Unity, Unreal, and custom assemblies.',
    tags: ['FMOD Script', 'Wwise SDK', 'Mixing Matrix', 'C# Bind'],
    isVerified: false,
    contactEmail: 'integrations@fmodnexus.jp',
    contactPhone: '+81 3 3322 1100',
    website: 'https://fmodnexus.co.jp',
    iconBg: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    specialty: 'Adaptive multi-threaded runtime game audio mixers'
  },
  {
    id: 'v18',
    name: 'WebRTC Live Relay Networks',
    category: 'WebRTC Live Relay',
    city: 'San Francisco',
    rating: 4.8,
    reviewsCount: 129,
    description: 'Dynamic server configurations utilizing modern WebSocket protocols and WebRTC peer negotiation relays for extreme audio sync across continents.',
    tags: ['VoIP Network', 'ICE Servers', 'Turn Node', 'Stun'],
    isVerified: true,
    contactEmail: 'ops@webrtclive.net',
    contactPhone: '+1 (415) 555-0255',
    website: 'https://webrtclive.net',
    iconBg: 'bg-gradient-to-br from-emerald-600 to-teal-500',
    specialty: 'Auto-healing global voice telemetry bridging maps'
  },
  {
    id: 'v19',
    name: 'Prism Smart Acoustic Panels',
    category: 'Smart Acoustic Panels',
    city: 'Berlin',
    rating: 4.6,
    reviewsCount: 63,
    description: 'Active panels that adjust physical density dynamically through built-in micro-actuators to tune home studio reverberation times automatically.',
    tags: ['Active Panels', 'Piezo Damping', 'Acoustic Tune'],
    isVerified: true,
    contactEmail: 'sales@prismpanels.de',
    contactPhone: '+49 30 8765 4321',
    website: 'https://prismpanels.de',
    iconBg: 'bg-gradient-to-br from-amber-600 to-orange-550',
    specialty: 'Actuator-driven variable reflection damping matrices'
  },
  {
    id: 'v20',
    name: 'Acoustic Instinct Generatives',
    category: 'Generative Audio Synths',
    city: 'London',
    rating: 4.8,
    reviewsCount: 110,
    description: 'Intelligent synthesis architectures that generate procedural synthesizer structures and dynamic brand sound motifs in real-time on host machines.',
    tags: ['Generative Loops', 'Synthesizer Synth', 'Dynamic Brand Logo'],
    isVerified: false,
    contactEmail: 'creative@acousticinstinct.co.uk',
    contactPhone: '+44 20 8976 5432',
    website: 'https://acousticinstinct.co.uk',
    iconBg: 'bg-gradient-to-br from-purple-600 to-fuchsia-600',
    specialty: 'Procedural brand theme and generative loop synthesis'
  },
  {
    id: 'v21',
    name: 'BioSound Neural Textures',
    category: 'Bio-Acoustic Textures',
    city: 'Sydney',
    rating: 4.7,
    reviewsCount: 39,
    description: 'Simulating complex human bio-acoustic soundscapes like joint movements, bloodstream loops, and respiratory flows for clinical diagnostic engines.',
    tags: ['Clinical Audio', 'Bio-textures', 'Biometric Waves'],
    isVerified: true,
    contactEmail: 'research@biosound.com.au',
    contactPhone: '+61 2 7654 3210',
    website: 'https://biosound.com.au',
    iconBg: 'bg-gradient-to-br from-rose-600 to-pink-500',
    specialty: 'High-frequency biologic micro-vibration mapping models'
  },
  {
    id: 'v22',
    name: 'Vortex Dynamic Control Gates',
    category: 'Dynamic Control Gates',
    city: 'Tokyo',
    rating: 4.8,
    reviewsCount: 112,
    description: 'Supplying adaptive hardware & software compression noise-gates designed to track and eliminate random micro-noises in remote workspaces.',
    tags: ['Noise Gates', 'Dynamic Compresser', 'Filter Array'],
    isVerified: true,
    contactEmail: 'gates@vortexsound.jp',
    contactPhone: '+81 3 5554 3322',
    website: 'https://vortexsound.co.jp',
    iconBg: 'bg-gradient-to-br from-teal-600 to-green-600',
    specialty: 'Sub-millisecond sliding scale noise suppression gates'
  },
  {
    id: 'v23',
    name: 'Resolute Encoders & Decoders',
    category: 'Multi-Channel Encoders',
    city: 'New York',
    rating: 4.9,
    reviewsCount: 167,
    description: 'Providing pristine multi-channel signal compressors and lossless dynamic spatial decoders mapping to standard 7.1.4 and 9.1.6 formats.',
    tags: ['Encoders', 'Decoders', 'Dolby Atmos Codec', 'FLAC Core'],
    isVerified: true,
    contactEmail: 'codecs@resoluteencoders.com',
    contactPhone: '+1 (212) 555-8844',
    website: 'https://resoluteencoders.com',
    iconBg: 'bg-gradient-to-br from-zinc-800 to-indigo-900',
    specialty: 'Zero-delay proprietary metadata spatial wave packagers'
  },
  {
    id: 'v24',
    name: 'UltraSonic Transmitters Inc.',
    category: 'Ultrasonic Transmitters',
    city: 'Sydney',
    rating: 4.4,
    reviewsCount: 34,
    description: 'Developing high-frequency directional speakers capable of projecting unhearable ultrasound carriers that decode into audio directly inside human ears.',
    tags: ['Directional Sound', 'Ultrasound Arrays', 'Holographic Beam'],
    isVerified: false,
    contactEmail: 'engineering@ultrasonictransmitters.com.au',
    contactPhone: '+61 2 9110 2233',
    website: 'https://ultrasonictransmitters.com.au',
    iconBg: 'bg-gradient-to-br from-orange-600 to-red-500',
    specialty: 'Focused holographic sonic beam projecting arrays'
  },
  {
    id: 'v25',
    name: 'Conversational Voice Agents Inc.',
    category: 'Conversational Agents',
    city: 'San Francisco',
    rating: 4.8,
    reviewsCount: 189,
    description: 'High-availability low-latency conversation engines combining natural audio filters with real-time semantic processing for fluid virtual actors.',
    tags: ['Conversational Voice', 'AI Actors', 'Agent Response'],
    isVerified: true,
    contactEmail: 'agents@conversationalvoice.ai',
    contactPhone: '+1 (415) 555-0299',
    website: 'https://conversationalvoice.ai',
    iconBg: 'bg-gradient-to-br from-blue-700 to-purple-700',
    specialty: 'Turn-taking detection & backchannel hum models'
  }
];

export default function VendorsPage() {
  // Navigation / View state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('rating-desc');
  
  // Pagination / Infinite scroll state
  const [displayCount, setDisplayCount] = useState<number>(6);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  
  // Advanced contact details modal
  const [activeContactVendor, setActiveContactVendor] = useState<Vendor | null>(null);

  const loaderRef = useRef<HTMLDivElement>(null);

  // Lists of unique values for dropdowns / filters
  const categoriesList = [
    'All',
    'Acoustic Hardware',
    'Vocal AI Engineering',
    'Cloud Sound Systems',
    'Creative Audio Design',
    'DSP Integration',
    'Spatial Sound Labs',
    'Neural Vocoder Synthesis',
    'Speech Emotion Modeling',
    'Procedural Sound Engines',
    'Foley & Sound FX',
    'Echo Cancelation Labs',
    'Real-time Pitch Trackers',
    'Biometric Voice Auth',
    'Low-Latency APIs',
    'Active Field Monitors',
    'Legacy Audio Transducers',
    'Game Audio Middleware',
    'WebRTC Live Relay',
    'Smart Acoustic Panels',
    'Generative Audio Synths',
    'Bio-Acoustic Textures',
    'Dynamic Control Gates',
    'Multi-Channel Encoders',
    'Ultrasonic Transmitters',
    'Conversational Agents'
  ];
  const citiesList = ['All', 'Berlin', 'London', 'New York', 'San Francisco', 'Sydney', 'Tokyo'];

  // Handle live query text changes
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setDisplayCount(6); // Reset pagination on filter change
  };

  // Reset all filters
  const handleResetFilters = () => {
    playSynthChime();
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedCity('All');
    setSortBy('rating-desc');
    setDisplayCount(6);
  };

  // Process filters and sorting
  const filteredVendors = MOCK_VENDORS.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vendor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
                          
    const matchesCategory = selectedCategory === 'All' || vendor.category === selectedCategory;
    const matchesCity = selectedCity === 'All' || vendor.city === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  const sortedAndFilteredVendors = [...filteredVendors].sort((a, b) => {
    if (sortBy === 'rating-desc') {
      return b.rating - a.rating;
    }
    if (sortBy === 'name-asc') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
    if (sortBy === 'reviews-desc') {
      return b.reviewsCount - a.reviewsCount;
    }
    return 0;
  });

  // Infinite Scroll logic: Simulate asynchronous loading when clicking "Load More" or scrolling to the bottom
  const visibleVendors = sortedAndFilteredVendors.slice(0, displayCount);
  const hasMore = displayCount < sortedAndFilteredVendors.length;

  const loadMoreItems = () => {
    if (isLoadingMore || !hasMore) return;
    
    setIsLoadingMore(true);
    playSynthChime();
    
    setTimeout(() => {
      setDisplayCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 800);
  };

  // Intersection Observer for Automatic Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoadingMore, displayCount, sortedAndFilteredVendors]);

  return (
    <div className="flex-grow bg-zinc-50/50 min-h-screen py-10 px-4 md:px-8 mt-[72px]">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 px-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-extrabold uppercase rounded-full select-none">
                Auralis Directory
              </span>
              <span className="text-[10px] text-zinc-400 font-mono font-semibold">
                {sortedAndFilteredVendors.length} Nodes verified
              </span>
            </div>
            <h1 className="text-3xl font-sans font-black tracking-tight text-zinc-950 flex items-center gap-2">
              Sound Integration Partners
            </h1>
            <p className="text-sm text-zinc-500 max-w-xl mt-1 leading-relaxed">
              Discover verified hardware suppliers, voice model engineering studios, cloud sound system integrators, and acoustic design agencies globally linked with Auralis.
            </p>
          </div>
          
          {/* Grid / List Layout Selector */}
          <div className="flex items-center gap-1.5 self-start md:self-auto bg-white border border-zinc-200 p-1.5 rounded-xl shadow-sm">
            <button
              id="view-grid-btn"
              onClick={() => { playSynthChime(); setViewMode('grid'); }}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                viewMode === 'grid' 
                  ? 'bg-zinc-950 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Grid
            </button>
            <button
              id="view-list-btn"
              onClick={() => { playSynthChime(); setViewMode('list'); }}
              className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                viewMode === 'list' 
                  ? 'bg-zinc-950 text-white shadow-sm' 
                  : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Dynamic Filters & Search Command Bar */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
          
          {/* Top Line: Search Input & Sort Options */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Search Box */}
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 shrink-0" />
              <input
                id="vendor-search-input"
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                placeholder="Search by vendor name, tags, description, features..."
                className="w-full pl-10 pr-10 py-3 text-sm font-sans rounded-xl bg-zinc-50 hover:bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-indigo-500 focus:bg-white text-zinc-800 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => { playSynthChime(); setSearchQuery(''); setDisplayCount(6); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Category Select */}
            <div className="lg:col-span-3">
              <div className="relative">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <select
                  id="vendor-sort-select"
                  value={sortBy}
                  onChange={(e) => { playSynthChime(); setSortBy(e.target.value); setDisplayCount(6); }}
                  className="w-full pl-10 pr-8 py-3 text-sm font-semibold rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer text-zinc-700 font-sans"
                >
                  <option value="rating-desc">Rating: Highest First</option>
                  <option value="reviews-desc">Most Reviews</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* City Dropdown Select */}
            <div className="lg:col-span-3">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <select
                  id="vendor-city-select"
                  value={selectedCity}
                  onChange={(e) => { playSynthChime(); setSelectedCity(e.target.value); setDisplayCount(6); }}
                  className="w-full pl-10 pr-8 py-3 text-sm font-semibold rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer text-zinc-700 font-sans"
                >
                  <option value="All">All Cities</option>
                  {citiesList.filter(city => city !== 'All').map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Line: Category Pills for fast filter */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-t border-zinc-100 pt-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4 w-full">
              {/* Category Dropdown Selector (Scales beautifully to 25+ categories) */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 select-none mr-1">
                  <Filter className="w-3.5 h-3.5 text-zinc-400" />
                  Filter Category:
                </span>
                <div className="relative">
                  <select
                    id="vendor-category-dropdown"
                    value={selectedCategory}
                    onChange={(e) => { playSynthChime(); setSelectedCategory(e.target.value); setDisplayCount(6); }}
                    className="pl-3 pr-8 py-1.5 text-xs font-bold rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer text-zinc-700 font-sans shadow-sm"
                  >
                    <option value="All">All Categories ({categoriesList.length - 1} options)</option>
                    {categoriesList.filter(cat => cat !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                </div>
              </div>

              {/* Quick Select Divider line */}
              <div className="hidden md:block h-4 w-px bg-zinc-200 shrink-0"></div>

              {/* Quick Select Buttons (the top 6 categories for super fast tracking) */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full grow scrollbar-thin">
                <span className="text-[10px] uppercase font-bold text-zinc-400 mr-1 select-none shrink-0">Quick Options:</span>
                {categoriesList.slice(0, 6).map(category => (
                  <button
                    key={category}
                    id={`filter-category-${category.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => { playSynthChime(); setSelectedCategory(category); setDisplayCount(6); }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold tracking-tight transition-all shrink-0 cursor-pointer ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white shadow-sm font-bold'
                        : 'bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-black hover:border-zinc-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {/* If selectedCategory is beyond the slice, show it as an active pill at the end! */}
                {!categoriesList.slice(0, 6).includes(selectedCategory) && (
                  <button
                    id={`filter-category-custom-active`}
                    onClick={() => { playSynthChime(); setSelectedCategory(selectedCategory); setDisplayCount(6); }}
                    className="px-3 py-1 rounded-full text-xs font-bold tracking-tight transition-all shrink-0 cursor-pointer bg-indigo-600 text-white shadow-sm flex items-center gap-1.5"
                  >
                    <span>{selectedCategory}</span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shrink-0"></span>
                  </button>
                )}
              </div>
            </div>

            {/* Clear Filters indicator */}
            {(searchQuery || selectedCategory !== 'All' || selectedCity !== 'All' || sortBy !== 'rating-desc') && (
              <button
                id="reset-filters-btn"
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer select-none shrink-0 ml-auto xl:ml-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Active Filters
              </button>
            )}
          </div>

        </div>

        {/* Vendors List / Grid Results */}
        <AnimatePresence mode="wait">
          {sortedAndFilteredVendors.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-zinc-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4 shadow-sm"
            >
              <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-200 animate-pulse text-zinc-400">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-800">No partner nodes found</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                  We could not find any active vendors matching your current search parameters. Trying clearing your category or city filter.
                </p>
              </div>
              <button
                id="no-results-reset-btn"
                onClick={handleResetFilters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : viewMode === 'grid' ? (
            
            // Grid Layout (Bento responsive structure)
            <motion.div
              key="grid-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleVendors.map((vendor) => (
                <motion.div
                  key={vendor.id}
                  layoutId={`vendor-card-${vendor.id}`}
                  className="bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-lg hover:border-zinc-300 transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Badge and verification status */}
                    <div className="flex justify-between items-start gap-2 mb-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase truncate max-w-[150px]">
                          {vendor.category}
                        </span>
                        <div className="flex items-center gap-1 text-zinc-500">
                          <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                          <span className="text-[11px] font-semibold">{vendor.city}</span>
                        </div>
                      </div>
                      
                      {vendor.isVerified && (
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[9px] font-extrabold select-none shrink-0 uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verified
                        </div>
                      )}
                    </div>

                    {/* Logo & Core Identifier */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${vendor.iconBg} flex items-center justify-center text-white font-serif font-black text-lg shadow-inner select-none shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                        {vendor.name.substring(0, 1)}
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="font-sans font-black text-base text-zinc-950 truncate group-hover:text-indigo-600 transition-colors">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5 select-none">
                          <div className="flex items-center text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <span className="text-[11px] font-bold ml-0.5">{vendor.rating}</span>
                          </div>
                          <span className="text-zinc-300 text-[10px] font-bold">•</span>
                          <span className="text-[10px] font-extrabold text-zinc-400 uppercase font-mono">{vendor.reviewsCount} reviews</span>
                        </div>
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-xs text-zinc-600 line-clamp-3 leading-relaxed mt-1">
                      {vendor.description}
                    </p>

                    {/* Specialty Indicator */}
                    <div className="mt-4 p-2.5 bg-zinc-50 border border-zinc-150 rounded-xl">
                      <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest block select-none">Specialty focus:</span>
                      <span className="text-[11px] text-zinc-700 font-medium block leading-tight mt-0.5 truncate">{vendor.specialty}</span>
                    </div>
                  </div>

                  {/* Foot tags and connect CTA */}
                  <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-1">
                      {vendor.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold font-mono text-zinc-400 uppercase px-2 py-0.5 bg-zinc-50 border border-zinc-150 rounded select-none">
                          #{tag.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                    
                    <button
                      id={`contact-vendor-${vendor.id}`}
                      onClick={() => { playSynthChime(); setActiveContactVendor(vendor); }}
                      className="w-full mt-1.5 py-2.5 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs tracking-tight rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-md"
                    >
                      <span>Connect with Node</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            
            // List Layout (Tabular row list item)
            <motion.div
              key="list-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm flex flex-col divide-y divide-zinc-200"
            >
              {visibleVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="p-5 hover:bg-zinc-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Visual icon badge */}
                    <div className={`w-12 h-12 rounded-xl ${vendor.iconBg} flex items-center justify-center text-white font-serif font-black text-lg shadow-inner select-none shrink-0 md:mt-1`}>
                      {vendor.name.substring(0, 1)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3 className="font-sans font-black text-base text-zinc-950 group-hover:text-indigo-600 transition-colors">
                          {vendor.name}
                        </h3>
                        {vendor.isVerified && (
                          <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-150 px-1.5 py-0.5 rounded text-[8px] font-extrabold select-none select-none shrink-0 uppercase tracking-widest">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified Node
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-zinc-400 font-extrabold bg-zinc-100 rounded px-1.5 select-none text-right shrink-0">
                          {vendor.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center gap-1 select-none">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          <b className="text-zinc-700">{vendor.city}</b>
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="flex items-center gap-0.5 text-amber-500 select-none">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <b>{vendor.rating}</b> ({vendor.reviewsCount} reviews)
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-[11px] text-zinc-400 italic font-normal truncate">Specialty: {vendor.specialty}</span>
                      </div>
                      
                      <p className="text-xs text-zinc-600 mt-2 leading-relaxed max-w-4xl line-clamp-2 md:line-clamp-none">
                        {vendor.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mt-3 select-none">
                        {vendor.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold font-mono text-zinc-400 uppercase px-2 py-0.5 bg-zinc-50 border border-zinc-150 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Trigger */}
                  <div className="flex items-center shrink-0">
                    <button
                      id={`contact-vendor-list-${vendor.id}`}
                      onClick={() => { playSynthChime(); setActiveContactVendor(vendor); }}
                      className="w-full md:w-auto px-5 py-3 bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs tracking-tight rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-md"
                    >
                      <span>Connect Node</span>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Infinite Scroll / Loading State indicator */}
        {sortedAndFilteredVendors.length > 0 && (
          <div 
            ref={loaderRef} 
            className="flex flex-col items-center justify-center py-10 text-center select-none"
          >
            {hasMore ? (
              <div className="flex flex-col items-center gap-3">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-zinc-500 bg-white border border-zinc-200 py-2.5 px-5 rounded-2xl h-11 shadow-sm">
                    <Loader2 className="w-4 h-4 text-indigo-500 animate-spin shrink-0" />
                    <span className="text-xs font-bold font-mono uppercase tracking-widest text-zinc-600">Querying adjacent cloud clusters...</span>
                  </div>
                ) : (
                  <>
                    <button
                      id="manual-load-more"
                      onClick={loadMoreItems}
                      className="px-6 py-3 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-black font-semibold text-xs tracking-tight rounded-xl flex items-center gap-2 shadow-sm transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Loader2 className="w-3.5 h-3.5 text-zinc-400" />
                      Load More Partners
                    </button>
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide">
                      Showing {displayCount} of {sortedAndFilteredVendors.length} matches • Scroll down to auto-load
                    </span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-zinc-400 bg-zinc-100 border border-zinc-200/50 py-2 px-4 rounded-xl text-[10px] font-mono font-bold uppercase select-none">
                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                All matched partner nodes loaded securely ({sortedAndFilteredVendors.length} of {sortedAndFilteredVendors.length})
              </div>
            )}
          </div>
        )}

      </div>

      {/* Advanced Connection Proposal Modal Dialog */}
      <AnimatePresence>
        {activeContactVendor && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-zinc-200 rounded-3xl w-full max-w-lg p-6 shadow-2xl relative"
            >
              <button
                id="close-contact-modal"
                onClick={() => { playSynthChime(); setActiveContactVendor(null); }}
                className="absolute right-4.5 top-4.5 text-zinc-400 hover:text-zinc-600 transition-colors p-1.5 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4 mb-5">
                <div className={`w-14 h-14 rounded-2xl ${activeContactVendor.iconBg} flex items-center justify-center text-white font-serif font-black text-xl shadow-inner select-none shrink-0`}>
                  {activeContactVendor.name.substring(0, 1)}
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-xl font-black font-sans leading-tight text-zinc-950 truncate max-w-xs">
                      {activeContactVendor.name}
                    </h2>
                    {activeContactVendor.isVerified && (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded text-[8px] font-extrabold select-none shrink-0 uppercase tracking-widest">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 font-semibold select-none">
                    <span className="flex items-center gap-0.5 text-indigo-500">
                      <MapPin className="w-3.5 h-3.5" />
                      {activeContactVendor.city}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] font-mono text-zinc-400 uppercase">{activeContactVendor.category}</span>
                  </div>
                </div>
              </div>

              {/* Partnership pitch */}
              <div className="bg-zinc-50 border border-zinc-150 rounded-2xl p-4 flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest select-none">Integrator Pitch:</span>
                  <p className="text-xs text-zinc-700 leading-relaxed mt-0.5">
                    {activeContactVendor.description}
                  </p>
                </div>
                
                <div className="border-t border-zinc-200/60 pt-2.5 flex flex-col gap-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-zinc-500 select-none">Technical Depth:</span>
                    <span className="font-bold text-indigo-600 font-sans">{activeContactVendor.specialty}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs mt-1">
                    <span className="font-semibold text-zinc-500 select-none">Global Quality:</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold select-none">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {activeContactVendor.rating} ({activeContactVendor.reviewsCount} verified audits)
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact direct credentials */}
              <div className="flex flex-col gap-2.5 mt-5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest select-none">Contact Credentials</span>
                
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href={`mailto:${activeContactVendor.contactEmail}`}
                    className="flex items-center gap-3 p-3 bg-zinc-50 hover:bg-indigo-50/50 border border-zinc-200 hover:border-indigo-200 rounded-xl transition-all font-mono text-[11px] text-zinc-700 font-bold cursor-pointer"
                  >
                    <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="truncate">{activeContactVendor.contactEmail}</span>
                  </a>
                  
                  <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-[11px] text-zinc-700 font-bold">
                    <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{activeContactVendor.contactPhone}</span>
                  </div>
                </div>
              </div>

              {/* Verified Badge / Sparkle Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span className="text-[10px] font-semibold text-zinc-400 select-none">Auralis secure bridging connection active</span>
                </div>
                <button
                  id="close-contact-modal-btn"
                  onClick={() => { playSynthChime(); setActiveContactVendor(null); }}
                  className="bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                >
                  Close Gate
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
