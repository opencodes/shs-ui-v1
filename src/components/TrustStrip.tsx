/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Zap, Sparkles, Layers, RefreshCw, Layers2, ShieldCheck, Box, Activity, Cpu } from 'lucide-react';

export default function TrustStrip() {
  const logos = [
    { name: 'Velocity', icon: Sparkles, color: 'text-rose-500' },
    { name: 'Nexus', icon: Box, color: 'text-indigo-500' },
    { name: 'Lumina', icon: Cpu, color: 'text-amber-500' },
    { name: 'Stack', icon: Layers, color: 'text-purple-500' },
    { name: 'Quanta', icon: Layers2, color: 'text-emerald-500' },
    { name: 'Orbital', icon: RefreshCw, color: 'text-blue-500' },
    { name: 'Scalar', icon: Activity, color: 'text-teal-500' },
  ];

  // Double the list for seamless continuous infinite marquee scrolling
  const marqueeLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <section className="w-full bg-[#F7F7F5] border-y border-[#E7E7E4]/55 py-10 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-8 mb-6">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-center text-zinc-400 uppercase">
          Trusted by leading developers and enterprises worldwide
        </p>
      </div>

      <div className="relative w-full flex overflow-x-hidden">
        {/* Soft edge blur overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F7F7F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F7F7F5] to-transparent z-10 pointer-events-none" />

        <div className="flex whitespace-nowrap animate-marquee-slow group">
          {marqueeLogos.map((logo, idx) => {
            const Icon = logo.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-2.5 mx-12 text-zinc-500 hover:text-black transition-colors duration-200 cursor-pointer"
              >
                <Icon className={`w-5 h-5 ${logo.color} opacity-45 group-hover:opacity-100 transition-opacity`} />
                <span className="font-sans font-bold tracking-tighter text-sm uppercase italic">
                  {logo.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
