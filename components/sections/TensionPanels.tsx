import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

interface TensionPanelItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Tension Panels - Why We Were Born
 * 4 accordion-style cards that expand on click/scroll
 */
export default function TensionPanels() {
  const [selectedId, setSelectedId] = useState<string | null>('hegemony');

  const panels: TensionPanelItem[] = [
    {
      id: 'hegemony',
      title: 'A hegemony of labels',
      description:
        'The music and entertainment industry has long been dominated by traditional gatekeepers who control who gets heard and who remains silent. Artists lack autonomy over their work, their narrative, and their future. True artistry is suppressed by corporate interests.',
      icon: '🔗',
    },
    {
      id: 'algorithms',
      title: 'Serving algorithms & commerce makes for predictability',
      description:
        'When platforms prioritize engagement metrics and profit margins, true artistic expression gets buried. Innovation is sacrificed for algorithmic optimization, leading to a homogenized cultural landscape. Authenticity is drowned out.',
      icon: '📊',
    },
    {
      id: 'ecosystem',
      title: 'No single talent nurture-to-monetize ecosystem',
      description:
        'Artists face fragmented journeys with no cohesive support system. They must navigate multiple platforms, services, and partners, often with conflicting interests, losing focus on their craft. The gap between aspiration and achievement is unbridged.',
      icon: '🌐',
    },
    {
      id: 'connection',
      title: 'No direct connect with fans',
      description:
        'The artist-to-fan relationship is mediated by platforms and intermediaries. Direct connection, community building, and authentic relationships are impossible in this structure. Artists are commodities, not creators.',
      icon: '❤️',
    },
  ];

  const colors = ['pumpkin', 'wine', 'sea-foam', 'peacock'];

  return (
    <Section
      id="tension-panels"
      background="charcoal"
      padding="xl"
      className="relative py-24"
    >
      <Container className="max-w-5xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-6 font-signika">
            Why We Were Born
          </h2>
          <p className="text-lg text-cream/80 font-alan-sans">
            Four problems we saw in the music and entertainment industry
          </p>
        </motion.div>

        {/* Tension panels grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {panels.map((panel, index) => (
            <motion.button
              key={panel.id}
              onClick={() => setSelectedId(selectedId === panel.id ? null : panel.id)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-left group relative overflow-hidden rounded-2xl h-full"
            >
              {/* Background with color rotation */}
              <div className={`bg-${colors[index]} absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />

              {/* Content container */}
              <div className="relative p-8 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{panel.icon}</span>
                    <motion.div
                      animate={{
                        rotate: selectedId === panel.id ? 180 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-cream opacity-50"
                    >
                      ▼
                    </motion.div>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-cream font-signika leading-tight">
                    {panel.title}
                  </h3>
                </div>

                {/* Description - Expandable */}
                <AnimatePresence>
                  {selectedId === panel.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-cream/80 font-alan-sans text-sm leading-relaxed"
                    >
                      {panel.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Border effect on hover/active */}
              <div
                className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 pointer-events-none ${
                  selectedId === panel.id ? `border-${colors[index]}` : 'border-cream/20 group-hover:border-cream/40'
                }`}
              />
            </motion.button>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-cream/80 font-alan-sans mb-6">
            We built TSC to solve all four of these problems at once.
          </p>
          <a
            href="#ecosystem"
            className="inline-block px-8 py-3 bg-pumpkin text-cream rounded-full font-semibold hover:bg-pumpkin-dark transition-all duration-300 font-signika"
          >
            Learn How →
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}
