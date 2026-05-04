import React from 'react';
import { motion } from 'framer-motion';

/**
 * ProblemSection — "The industry is broken for emerging artists"
 * Defines the gap TSC fills: talent exists, but no structure to sustain it.
 */
export default function ProblemSection() {
  const stats = [
    { value: '30%', label: 'Independent artists in streaming top charts' },
    { value: '70%', label: 'Established artists dominate revenue' },
    { value: '1 in 1000', label: 'Viral artists sustain a lasting career' },
  ];

  return (
    <section
      id="problem"
      className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 bg-cream overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, #083D3A, #083D3A 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #083D3A, #083D3A 1px, transparent 1px, transparent 48px)',
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-pumpkin font-black text-xs uppercase tracking-[0.3em] mb-4 font-alan-sans text-center"
        >
          The Reality
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal font-signika text-center leading-tight mb-6 sm:mb-8"
        >
          Most artists are{' '}
          <span className="text-pumpkin">Meteors</span> —<br className="hidden sm:block" />
          brilliant flashes that fade fast.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-base sm:text-lg md:text-xl text-charcoal/70 font-alan-sans leading-relaxed max-w-3xl mx-auto text-center mb-16 sm:mb-20"
        >
          The music industry is broken for emerging artists. Talent is everywhere. Mentorship, structure, and monetization pathways are not. The gap between potential and opportunity has never been wider.
        </motion.p>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center p-8 rounded-2xl border border-charcoal/10 bg-white/60 backdrop-blur-sm"
            >
              <div className="text-4xl sm:text-5xl font-bold text-pumpkin font-signika mb-3">{stat.value}</div>
              <div className="text-sm sm:text-base text-charcoal/60 font-alan-sans leading-snug">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* The problems */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: '⚡',
              title: 'No Mentorship Structure',
              desc: 'Aspiring artists lack access to consistent, quality guidance from industry veterans who\'ve done it before.',
            },
            {
              icon: '🎯',
              title: 'No Clear Path',
              desc: 'Without a roadmap from craft to career, most artists stay stuck in cycles of hustle with no sustainable progression.',
            },
            {
              icon: '💰',
              title: 'No Monetization Framework',
              desc: 'Creating is one thing. Turning your artistry into a business that funds your creative freedom is another entirely.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: i * 0.15 + 0.2 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-2xl bg-teal-dark text-cream border border-teal-light/20"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold font-signika mb-3">{item.title}</h3>
              <p className="text-cream/70 font-alan-sans text-sm sm:text-base leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
