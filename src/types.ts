/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  email: string;
  role: 'user' | 'admin';
  tier: 'Free Trial' | 'Developer Pro' | 'Enterprise Elite';
  apiKey: string;
  voiceQuotaUsed: number;
  voiceQuotaLimit: number;
  createdAt: string;
}

export interface VoicePreset {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  description: string;
  accent: string;
  emotionalTone: string;
  sampleText: string;
  avatarSeed: string;
}

export interface GeneratedSpeech {
  id: string;
  text: string;
  voice: VoicePreset;
  pitch: number; // 0.5 to 1.5
  speed: number; // 0.5 to 2.0
  createdAt: string;
  audioDuration: string;
  audioBlobUrl?: string;
  isCustom?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  audioUrl?: string;
}

export interface DemoVoice {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'aria',
    name: 'Aria',
    gender: 'female',
    description: 'Warm, empathetic, and highly conversational. Ideal for narratives, meditations, and audiobooks.',
    accent: 'US English',
    emotionalTone: 'Conversational',
    sampleText: 'Welcome back. Take a deep breath, and let’s begin our mindfulness session for today.',
    avatarSeed: 'aria'
  },
  {
    id: 'marcus',
    name: 'Marcus',
    gender: 'male',
    description: 'Deep, resonant, and authoritative. Excellent for business presentations, news, and documentaries.',
    accent: 'UK English / RP',
    emotionalTone: 'Professional',
    sampleText: 'Our research indicates that real-time neural audio processing significantly increases key user engagement metrics.',
    avatarSeed: 'marcus'
  },
  {
    id: 'elena',
    name: 'Elena',
    gender: 'female',
    description: 'Crisp, articulate, and friendly. Perfect for customer support, IVR systems, and educational content.',
    accent: 'US English',
    emotionalTone: 'Friendly',
    sampleText: 'Hi, I’ve located your deployment statistics. Your current service is active and operating at peak stability.',
    avatarSeed: 'elena'
  },
  {
    id: 'julian',
    name: 'Julian',
    gender: 'male',
    description: 'Youthful, energetic, and relatable. Great for advertisements, tech reviews, and social media media summaries.',
    accent: 'Australian English',
    emotionalTone: 'Excited',
    sampleText: 'Check this out! With Auralis Agents, you can build fullvoice bots that listen and react instantly. It’s absolutely mental!',
    avatarSeed: 'julian'
  },
  {
    id: 'seraphina',
    name: 'Seraphina',
    gender: 'female',
    description: 'Whispery, textured, and moody. Excels in artistic recordings, game development, and cinematic cues.',
    accent: 'Mid-Atlantic',
    emotionalTone: 'Mysterious',
    sampleText: 'In the quiet spacing between the pulses, a secondary signal begins to construct itself...',
    avatarSeed: 'seraphina'
  }
];

export const DEMO_TEXT_SCRIPTS = [
  {
    id: 's1',
    label: 'Mindfulness Narration',
    text: 'Aria - Welcome back. Take a deep breath, settle into your cushion, and let’s begin our daily mindfulness session.',
  },
  {
    id: 's2',
    label: 'Corporate Overview',
    text: 'Marcus - Our newly deployed research foundation enables developers to instantiate realistic vocal agents with sub-fifty millisecond latency.',
  },
  {
    id: 's3',
    label: 'IVR Support Flow',
    text: 'Elena - Thank you for calling Auralis Support Services. To inquire about custom enterprise routing or API keys, press one.',
  },
  {
    id: 's4',
    label: 'Advertising Promotion',
    text: 'Julian - Looking to bring your digital interfaces to life? Auralis delivers human-level vocal synthesizers designed for extreme scale.',
  }
];
