/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// A high-fidelity interactive browser audio engine that outputs real sounds,
// including Text to Speech, procedural synth patterns for Music, and organic SFX sweeps.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Text to Speech Speaker
export function speakText(
  text: string,
  gender: 'female' | 'male' | 'neutral',
  pitch: number = 1.0,
  rate: number = 1.0,
  onStart?: () => void,
  onEnd?: () => void,
  onBoundary?: (charIndex: number) => void
): () => void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    // Play a nice synth confirmation chime instead
    playSynthChime();
    if (onStart) onStart();
    setTimeout(() => { if (onEnd) onEnd(); }, 1500);
    return () => {};
  }

  // Cancel any active speaking
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.pitch = pitch; // Default 1 (range 0 to 2)
  utterance.rate = rate;   // Default 1 (range 0.1 to 10)

  // Find a suitable voice in the system matching the requested gender/accent
  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  if (voices.length > 0) {
    // Score voices based on matching details
    const scores = voices.map(v => {
      let score = 0;
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();

      // Check language (prefer english)
      if (lang.includes('en')) score += 10;
      
      // Look for gender hints
      if (gender === 'female') {
        if (/zira|samantha|karen|veena|hazel|moira|tessa|female|girl|woman|siri/i.test(name)) score += 5;
      } else {
        if (/david|mark|george|ravi|male|boy|man|google tom|premium/i.test(name)) score += 5;
      }
      return { voice: v, score };
    });

    scores.sort((a, b) => b.score - a.score);
    if (scores[0] && scores[0].score > 0) {
      selectedVoice = scores[0].voice;
    }
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.error('SpeechSynthesis error:', e);
    if (onEnd) onEnd();
  };

  if (onBoundary) {
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        onBoundary(event.charIndex);
      }
    };
  }

  window.speechSynthesis.speak(utterance);

  // Return a cancellation function
  return () => {
    window.speechSynthesis.cancel();
  };
}

// Ensure voices are loaded (Chrome/Safari async issue)
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.getVoices();
}

// 2. Play beautiful synthesized system feedback
export function playSynthChime() {
  try {
    const ctx = getAudioContext();
    const time = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, time); // C5
    osc1.frequency.exponentialRampToValueAtTime(880.00, time + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(261.63, time); // C4
    osc2.frequency.exponentialRampToValueAtTime(440.00, time + 0.18); // A4

    gainNode.gain.setValueAtTime(0.001, time);
    gainNode.gain.exponentialRampToValueAtTime(0.15, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(time);
    osc1.stop(time + 0.6);
    osc2.start(time);
    osc2.stop(time + 0.6);
  } catch (e) {
    console.error('Audio synthesizer error:', e);
  }
}

// 3. Play deep, cinematic procedural ambient drones (Auralis Studio Music Module)
let activeDrone: { stop: () => void } | null = null;

export function playProceduralMusic(type: string): () => void {
  if (activeDrone) {
    activeDrone.stop();
    activeDrone = null;
  }

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.12, now + 1.0); // Smooth fade in
    masterGain.connect(ctx.destination);

    const oscillators: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    let frequencies: number[] = [110, 165, 220, 330]; // Perfect fifth / minor key setup

    if (type === 'cyberpunk' || type === 'SFX' || type === 'aggressive') {
      frequencies = [82.41, 123.47, 164.81, 246.94]; // E Aeolian / dark gritty tone
    } else if (type === 'ambient' || type === 'calm') {
      frequencies = [130.81, 196.00, 261.63, 392.00, 523.25]; // C Major / pure serene dome
    } else if (type === 'futuristic' || type === 'bright') {
      frequencies = [146.83, 220.00, 293.66, 440.00, 587.33]; // D Major / ethereal lift
    }

    // Spawn 4 notes with organic slow LFO pulse filters
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      // Slight detune for fat ambient chorus
      osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);

      // Filter settings
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, now);
      // Sweep index filter
      filter.Q.setValueAtTime(3, now);

      // Soft volume per voice
      gain.gain.setValueAtTime(0.02, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      // Low frequency modulation simulation
      const lfoFreq = 0.05 + idx * 0.03;
      filter.frequency.linearRampToValueAtTime(freq * 1.5, now + 5);
      
      osc.start(now);
      oscillators.push(osc);
      gains.push(gain);
    });

    const stopFn = () => {
      const stopNow = ctx.currentTime;
      masterGain.gain.setValueAtTime(masterGain.gain.value, stopNow);
      masterGain.gain.exponentialRampToValueAtTime(0.001, stopNow + 1.2); // Long tail fade out
      setTimeout(() => {
        oscillators.forEach(o => {
          try { o.stop(); } catch (err) {}
        });
      }, 1500);
    };

    activeDrone = { stop: stopFn };
    return stopFn;
  } catch (e) {
    console.error('Procedural music error:', e);
    return () => {};
  }
}

// 4. Play dynamic modular sound effects in real-time (Auralis Studio SFX Module)
export function playProceduralSFX(category: string) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0.001, now);

    if (category === 'laser' || category === 'SFX') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3000, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.linearRampToValueAtTime(0.001, now + 0.35);
      
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (category === 'sparkle' || category === 'bright') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(4400, now + 0.15);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.15, now + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.start(now);
      osc.stop(now + 0.3);
    } else if (category === 'bass' || category === 'sub') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.45);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);

      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.linearRampToValueAtTime(0.001, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.5);
    } else if (category === 'chime' || category === 'feedback') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);

      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (err) {
    console.warn('Procedural SFX error:', err);
  }
}
