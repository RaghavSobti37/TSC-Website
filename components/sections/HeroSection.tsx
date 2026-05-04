import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Hero Section - TSC Revamp
 * "Unfolding artists' force" — talent-first culture engine
 * Dual CTAs: Artists + Brands
 */
export default function HeroSection({
  activeSection,
  setActiveSection,
}: {
  activeSection?: string;
  setActiveSection?: (section: string) => void;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const scrollToSection = (id: string) => {
    if (setActiveSection) setActiveSection(id);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const rippleColors = [
    '#0B5147', '#D4622D', '#126D5E', '#E07548', '#0B5147',
    '#D4622D', '#126D5E', '#E07548', '#0B5147', '#D4622D',
    '#126D5E', '#E07548',
  ];

  const ripplePositions = [
    [150, 200], [500, 120], [850, 180], [80, 450], [120, 750],
    [300, 900], [550, 950], [880, 820], [920, 350], [950, 600],
    [250, 500], [750, 520],
  ];

  return (
    <section
      id="hero"
      className="relative w-screen min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-black" />

      {/* Teal glow — top-right */}
      <motion.div
        className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-br from-teal-dark via-teal-dark to-transparent rounded-full blur-3xl opacity-15 pointer-events-none"
        animate={!reducedMotion ? { y: [0, -20, 0], x: [0, 10, 0] } : {}}
        transition={!reducedMotion ? { duration: 8, repeat: Infinity, ease: 'easeInOut' } : {}}
      />

      {/* Pumpkin glow — bottom-left */}
      <motion.div
        className="absolute bottom-0 left-0 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-br from-pumpkin to-transparent rounded-full blur-3xl opacity-10 pointer-events-none"
        animate={!reducedMotion ? { y: [0, 20, 0], x: [0, -10, 0] } : {}}
        transition={!reducedMotion ? { duration: 10, repeat: Infinity, ease: 'easeInOut' } : {}}
      />

      {/* Dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'url("/patterns/textures/dots.svg")', backgroundSize: '36px 36px' }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/50" />

      {/* ── Ripple circles ── */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {ripplePositions.map(([cx, cy], i) => (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={58}
            fill="none"
            stroke={rippleColors[i]}
            strokeWidth="1.5"
            opacity="0.35"
            animate={!reducedMotion ? { r: [58, 380], opacity: [0.35, 0] } : {}}
            transition={
              !reducedMotion
                ? { duration: 3 + (i % 5) * 0.15, repeat: Infinity, ease: 'easeOut', delay: i * 0.28 }
                : {}
            }
          />
        ))}
      </motion.svg>

      {/* ── Main content ──
          pt accounts for fixed header (~80px nav + 16px gap = ~96px)
          pb provides room for the scroll hint without content crowding */}
      <motion.div
        className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-8 md:px-12 text-center flex flex-col items-center pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-pumpkin font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] mb-4 sm:mb-5 md:mb-6 font-alan-sans"
        >
          A Talent-First Global Culture Engine
        </motion.p>

        {/* Main headline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 sm:mb-8 md:mb-10 w-full"
        >
          {/* METEORS */}
          <motion.h1
            variants={lineVariants}
            className="text-[13vw] xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-signika text-cream leading-[0.88] tracking-tighter"
          >
            METEORS
          </motion.h1>

          {/* "to" divider */}
          <motion.div
            variants={lineVariants}
            className="flex items-center justify-center gap-3 sm:gap-5 my-2 sm:my-3"
          >
            <div className="h-px bg-pumpkin/50 flex-1 max-w-[60px] sm:max-w-[100px] md:max-w-[140px]" />
            <span className="text-pumpkin font-alan-sans text-xs sm:text-sm uppercase tracking-[0.25em]">to</span>
            <div className="h-px bg-pumpkin/50 flex-1 max-w-[60px] sm:max-w-[100px] md:max-w-[140px]" />
          </motion.div>

          {/* MAESTROS */}
          <motion.h1
            variants={lineVariants}
            className="text-[13vw] xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold font-signika text-transparent bg-clip-text bg-gradient-to-r from-cream via-pumpkin to-cream leading-[0.88] tracking-tighter"
          >
            MAESTROS
          </motion.h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-sm sm:text-base md:text-lg text-cream/75 font-alan-sans leading-relaxed max-w-xl md:max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12"
        >
          Unfolding artists&apos; force — a living ecosystem where emerging talent prepares, creates, produces, and monetizes their craft globally.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-sm sm:max-w-none"
        >
          {/* Artist CTA — filled */}
          <button
            onClick={() => scrollToSection('artist-path-section')}
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-full bg-pumpkin text-cream font-bold font-signika text-sm sm:text-base tracking-wide hover:bg-pumpkin/90 transition-all duration-300 shadow-lg shadow-pumpkin/30 hover:shadow-pumpkin/50 hover:scale-[1.03] active:scale-[0.98]"
          >
            I&apos;m an Artist →
          </button>

          {/* Brand CTA — ghost */}
          <button
            onClick={() => scrollToSection('brand-collab')}
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-full border-2 border-cream/35 text-cream font-bold font-signika text-sm sm:text-base tracking-wide hover:border-cream/70 hover:bg-cream/8 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            I&apos;m a Brand
          </button>
        </motion.div>

        {/* Scroll hint — below CTAs, sits in natural flow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="mt-12 sm:mt-14 md:mt-16 flex flex-col items-center gap-1.5"
        >
          <motion.div
            animate={!reducedMotion ? { y: [0, 6, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 sm:h-10 bg-gradient-to-b from-cream/35 to-transparent"
          />
          <span className="text-cream/25 text-[10px] sm:text-xs font-alan-sans uppercase tracking-[0.22em]">
            Scroll
          </span>
        </motion.div>
      </motion.div>

      {/* Corner accents — hidden on very small screens */}
      <div className="hidden sm:block absolute top-6 left-6 md:top-8 md:left-8 w-12 md:w-16 h-12 md:h-16 border-l-2 border-t-2 border-cream/10" />
      <div className="hidden sm:block absolute bottom-6 right-6 md:bottom-8 md:right-8 w-12 md:w-16 h-12 md:h-16 border-r-2 border-b-2 border-cream/10" />
    </section>
  );
}
