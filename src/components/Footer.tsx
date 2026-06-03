/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowRight, Twitter, Github, Globe, RefreshCcw, AudioLines } from 'lucide-react';
import { playSynthChime, playProceduralSFX } from '../utils/audioEngine';

interface FooterProps {
  onNavClick: (sectionId: string) => void;
}

export default function Footer({ onNavClick }: FooterProps) {
  
  const handleCTAAction = () => {
    playSynthChime();
    alert("Signing up for the developer beta sandbox... Welcome inside Auralis!");
  };

  const handleSalesAction = () => {
    playProceduralSFX('sparkle');
    alert("Our enterprise dispatch desk (rkjha.it.in@gmail.com) has received your request. Expect a customized pitch review within 2 hours.");
  };

  return (
    <footer className="w-full bg-[#F7F7F5] border-t border-[#E7E7E4]/70 pt-20 pb-12">
      {/* 1. Large bottom CTA block */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 mb-20 text-center flex flex-col items-center gap-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-sans text-black leading-none tracking-tight max-w-3xl">
          The future of voice starts here
        </h2>
        <p className="text-sm text-zinc-500 max-w-md leading-relaxed">
          Instantiate highly authentic neural vocal lines, customized foley, and smart chat operators. Start deploying in less than 5 minutes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <button
            id="footer-cta-get-started"
            onClick={handleCTAAction}
            className="bg-black text-white hover:bg-zinc-800 transition-all font-semibold tracking-tight text-sm px-6 py-3.5 rounded-full shadow-md cursor-pointer flex items-center gap-2 scale-98 active:scale-95"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </button>
          <button
            id="footer-cta-talk-sales"
            onClick={handleSalesAction}
            className="bg-transparent border border-zinc-300 text-black hover:bg-[#F3F2EF]/40 transition-all font-semibold tracking-tight text-sm px-6 py-3.5 rounded-full cursor-pointer flex items-center gap-1.5"
          >
            Talk to sales
          </button>
        </div>
      </div>

      {/* 2. Horizontal divider */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="h-px bg-[#E7E7E4]/85 w-full mb-10" />
      </div>

      {/* 3. Real footer links block */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
          <button
            onClick={() => onNavClick('hero')} 
            className="text-lg font-bold tracking-tighter text-black flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-black text-white flex items-center justify-center">
              <AudioLines className="w-4.5 h-4.5" />
            </div>
            <span className="font-sans font-semibold">Auralis</span>
          </button>
          
          <span className="text-xs text-zinc-400 font-sans">
            © 2026 Auralis AI. Engineered for precision.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <a
            href="https://twitter.com"
            target="_blank"
            referrerPolicy="no-referrer"
            className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors flex items-center gap-1"
          >
            <Twitter className="w-3.5 h-3.5" />
            Twitter
          </a>
          <a
            href="https://github.com"
            target="_blank"
            referrerPolicy="no-referrer"
            className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
          <button
            onClick={() => alert("Enterprise Service Level Agreement (SLA): 99.95% active availability. Standard global support is covered.")}
            className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            SLA SLA Core
          </button>
          <button
            onClick={() => alert("Auralis standard data privacy guidelines. Personal voiceprints are secure and fully localized to sandbox runtimes.")}
            className="text-xs font-semibold text-zinc-500 hover:text-black transition-colors cursor-pointer"
          >
            Privacy Code
          </button>
        </div>
      </div>
    </footer>
  );
}
