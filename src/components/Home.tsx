/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import Hero from './Hero';
import TrustStrip from './TrustStrip';
import PlatformOverview from './PlatformOverview';
import AuralisStudioSection from './AuralisStudioSection';
import AuralisAgentsSection from './AuralisAgentsSection';

interface HomeProps {
  onNavClick: (sectionId: string) => void;
}

export default function Home({ onNavClick }: HomeProps) {
  return (
    <main className="flex-grow">
      {/* Hero Section (Contains interactive playground) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Hero onStartClick={() => onNavClick('playground-anchor')} />
      </motion.div>

      {/* Brand marquee trust lines */}
      <TrustStrip />

      {/* Platform deep technical overview (with Neural Engine widget) */}
      <PlatformOverview />

      {/* Studio creation module (with music synths & SFX triggers) */}
      <AuralisStudioSection />

      {/* Intelligent agents module (with editable chat & dynamic SVG graphs) */}
      <AuralisAgentsSection />
    </main>
  );
}
