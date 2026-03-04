import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import YouTubeHero from '@/components/video/YouTubeHero';

/**
 * Hero Section - The Eternal Arc
 * Cinematic split-canvas with video, Arc visualization, light leaks, and editorial text
 */
export default function HeroSection() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 1.2 },
    },
    hover: { scale: 1.05, borderColor: '#ffecd1' },
  };

  return (
    <section
      id="hero"
      className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-charcoal flex items-center justify-center"
    >
      {/* Hero Video - YouTube Embed */}
      <YouTubeHero videoId="EcOa9o7KFsw" />

      {/* Film Grain Texture Overlay */}
      <div
        className="absolute inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" /%3E%3C/filter%3E%3Crect width="200" height="200" fill="white" filter="url(%23noise)" /%3E%3C/svg%3E")',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Light Leak Overlays - Teal/Cream Gradients */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-dark to-transparent rounded-full blur-3xl opacity-20 pointer-events-none"
        animate={
          !reducedMotion
            ? {
                y: [0, -20, 0],
                x: [0, 10, 0],
              }
            : {}
        }
        transition={
          !reducedMotion
            ? { duration: 8, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-cream to-transparent rounded-full blur-3xl opacity-15 pointer-events-none"
        animate={
          !reducedMotion
            ? {
                y: [0, 20, 0],
                x: [0, -10, 0],
              }
            : {}
        }
        transition={
          !reducedMotion
            ? { duration: 10, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      />

      {/* Arc Visualization - SVG Based */}
      <motion.svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        viewBox="0 0 1000 1000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1.5 }}
      >
        {/* Outer arc */}
        <motion.circle
          cx="500"
          cy="500"
          r="400"
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="2"
          animate={
            !reducedMotion
              ? { rotate: 360 }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 20, repeat: Infinity, ease: 'linear' }
              : {}
          }
        />
        {/* Inner arc */}
        <motion.circle
          cx="500"
          cy="500"
          r="250"
          fill="none"
          stroke="url(#arcGradient)"
          strokeWidth="1.5"
          animate={
            !reducedMotion
              ? { rotate: -360 }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 25, repeat: Infinity, ease: 'linear' }
              : {}
          }
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#083d3a" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#ffecd1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#b74b02" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Content Container - Editorial Layout */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Headline - Staggered Line Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <motion.h1
            variants={lineVariants}
            className="text-7xl md:text-8xl lg:text-9xl font-bold font-signika text-cream leading-[0.95] tracking-tighter"
          >
            A LIVING
          </motion.h1>
          <motion.h1
            variants={lineVariants}
            className="text-7xl md:text-8xl lg:text-9xl font-bold font-signika text-transparent bg-clip-text bg-gradient-to-r from-cream via-pumpkin to-cream leading-[0.95] tracking-tighter"
          >
            ECOSYSTEM
          </motion.h1>
        </motion.div>

        {/* Subheading - Editorial Copy */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16 space-y-6"
        >
          <motion.p
            variants={lineVariants}
            className="text-lg md:text-xl text-cream/90 font-alan-sans leading-relaxed max-w-2xl mx-auto"
          >
            For emerging artists and brands to co-create cultural IP.
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="text-lg md:text-xl text-cream/80 font-alan-sans leading-relaxed max-w-2xl mx-auto"
          >
            Mentorship, resources, and direct monetization.
          </motion.p>
        </motion.div>

        {/* CTA Button - Ghost Style */}
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          className="px-10 py-4 border-2 border-cream/40 text-cream font-signika font-semibold rounded-full hover:border-cream hover:bg-cream/10 transition-all duration-300 backdrop-blur-sm"
        >
          EXPLORE NOW
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={
              !reducedMotion ? { y: [0, 8, 0] } : {}
            }
            transition={
              !reducedMotion ? { duration: 2, repeat: Infinity } : {}
            }
            className="w-0.5 h-12 bg-gradient-to-b from-cream to-transparent"
          />
          <p className="text-xs text-cream/60 font-alan-sans tracking-widest">
            SCROLL TO EXPLORE
          </p>
        </motion.div>
      </motion.div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-cream/20" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-cream/20" />
    </section>
  );
}

