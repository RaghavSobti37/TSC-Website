import React from 'react';
import { motion } from 'framer-motion';
import ReadMore from '@/components/ui/ReadMore';

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
      className="relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, #008080, #008080 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, #008080, #008080 1px, transparent 1px, transparent 48px)',
      }} />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-orange font-black text-xs uppercase tracking-[0.3em] mb-4 font-alan-sans text-center"
        >
          The Reality
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black font-signika text-center leading-tight mb-6 sm:mb-8"
        >
          Most artists are{' '}
          <span className="text-orange">Meteors</span> —<br className="hidden sm:block" />
          brilliant flashes that fade fast.
        </motion.h2>

        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-base sm:text-lg md:text-xl text-black/70 font-alan-sans leading-relaxed"
          >
            <ReadMore 
              text="The music industry is broken for emerging artists. Talent is everywhere. Mentorship, structure, and monetization pathways are not. The gap between potential and opportunity has never been wider."
              maxLength={120}
            />
          </motion.div>
        </div>

        {/* Stats grid — More balanced size on web */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="text-center py-10 sm:py-12 px-6 sm:px-8 rounded-[3.5rem] border border-black/5 bg-black/[0.03] backdrop-blur-sm flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] hover:border-orange/20 transition-all duration-500"
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black text-orange font-signika mb-4 sm:mb-6">{stat.value}</div>
              <div className="text-xs sm:text-sm md:text-base text-black/60 font-alan-sans leading-snug max-w-[140px] sm:max-w-[160px]">{stat.label}</div>
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
              className="p-6 sm:p-8 rounded-2xl bg-white text-black border border-teal/20 transition-all shadow-sm"
            >
              <div className="text-3xl mb-4 opacity-90">{item.icon}</div>
              <h3 className="text-lg sm:text-xl font-bold font-signika mb-3 text-teal">{item.title}</h3>
              <ReadMore 
                text={item.desc}
                maxLength={80}
                className="text-black/70 font-alan-sans text-sm sm:text-base leading-relaxed"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
