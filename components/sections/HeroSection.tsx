import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FishyButton } from '@/components/ui/fishy-button';

/**
 * Hero Section - The Eternal Arc
 * Cinematic split-canvas with video, Arc visualization, light leaks, and editorial text
 * Fades out smoothly as user scrolls down or clicks Explore
 */
export default function HeroSection({ 
  activeSection, 
  setActiveSection 
}: { 
  activeSection?: string; 
  setActiveSection?: (section: string) => void;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduce-motion: reduce)').matches;
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
      className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center transition-opacity duration-800"

    >
      {/* Black Background with Pattern Gradients for Continuity */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Teal Pattern Gradient - Top Right */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-dark via-teal-dark to-transparent rounded-full blur-3xl opacity-15 pointer-events-none"
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

      {/* Pumpkin Pattern Gradient - Bottom Left */}
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-pumpkin to-transparent rounded-full blur-3xl opacity-10 pointer-events-none"
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

      {/* Subtle Dotted Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url("/patterns/textures/dots.svg")',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Dark Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

      {/* Random Ripple Circles - Spread everywhere */}
      <motion.svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Circle 1 - Top Left */}
        <motion.circle
          cx="150"
          cy="200"
          r="60"
          fill="none"
          stroke="#0B5147"
          strokeWidth="2"
          opacity="0.4"
          animate={
            !reducedMotion
              ? { r: [60, 380], opacity: [0.4, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.2, repeat: Infinity, ease: 'easeOut' }
              : {}
          }
        />
        {/* Circle 2 - Top Center */}
        <motion.circle
          cx="500"
          cy="120"
          r="55"
          fill="none"
          stroke="#D4622D"
          strokeWidth="2"
          opacity="0.38"
          animate={
            !reducedMotion
              ? { r: [55, 370], opacity: [0.38, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.1, repeat: Infinity, ease: 'easeOut', delay: 0.25 }
              : {}
          }
        />
        {/* Circle 3 - Top Right */}
        <motion.circle
          cx="850"
          cy="180"
          r="65"
          fill="none"
          stroke="#126D5E"
          strokeWidth="2"
          opacity="0.4"
          animate={
            !reducedMotion
              ? { r: [65, 390], opacity: [0.4, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }
              : {}
          }
        />
        {/* Circle 4 - Left Upper */}
        <motion.circle
          cx="80"
          cy="450"
          r="58"
          fill="none"
          stroke="#E07548"
          strokeWidth="2"
          opacity="0.36"
          animate={
            !reducedMotion
              ? { r: [58, 375], opacity: [0.36, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 2.95, repeat: Infinity, ease: 'easeOut', delay: 0.75 }
              : {}
          }
        />
        {/* Circle 5 - Left Lower */}
        <motion.circle
          cx="120"
          cy="750"
          r="62"
          fill="none"
          stroke="#0B5147"
          strokeWidth="2"
          opacity="0.39"
          animate={
            !reducedMotion
              ? { r: [62, 385], opacity: [0.39, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.15, repeat: Infinity, ease: 'easeOut', delay: 1 }
              : {}
          }
        />
        {/* Circle 6 - Bottom Left */}
        <motion.circle
          cx="300"
          cy="900"
          r="57"
          fill="none"
          stroke="#D4622D"
          strokeWidth="2"
          opacity="0.4"
          animate={
            !reducedMotion
              ? { r: [57, 372], opacity: [0.4, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.05, repeat: Infinity, ease: 'easeOut', delay: 1.25 }
              : {}
          }
        />
        {/* Circle 7 - Bottom Center */}
        <motion.circle
          cx="550"
          cy="950"
          r="61"
          fill="none"
          stroke="#126D5E"
          strokeWidth="2"
          opacity="0.37"
          animate={
            !reducedMotion
              ? { r: [61, 382], opacity: [0.37, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.2, repeat: Infinity, ease: 'easeOut', delay: 1.5 }
              : {}
          }
        />
        {/* Circle 8 - Bottom Right */}
        <motion.circle
          cx="880"
          cy="820"
          r="59"
          fill="none"
          stroke="#E07548"
          strokeWidth="2"
          opacity="0.41"
          animate={
            !reducedMotion
              ? { r: [59, 378], opacity: [0.41, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 2.9, repeat: Infinity, ease: 'easeOut', delay: 1.75 }
              : {}
          }
        />
        {/* Circle 9 - Right Upper */}
        <motion.circle
          cx="920"
          cy="350"
          r="63"
          fill="none"
          stroke="#0B5147"
          strokeWidth="2"
          opacity="0.38"
          animate={
            !reducedMotion
              ? { r: [63, 388], opacity: [0.38, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.25, repeat: Infinity, ease: 'easeOut', delay: 2 }
              : {}
          }
        />
        {/* Circle 10 - Right Center */}
        <motion.circle
          cx="950"
          cy="600"
          r="56"
          fill="none"
          stroke="#D4622D"
          strokeWidth="2"
          opacity="0.4"
          animate={
            !reducedMotion
              ? { r: [56, 368], opacity: [0.4, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.1, repeat: Infinity, ease: 'easeOut', delay: 2.25 }
              : {}
          }
        />
        {/* Circle 11 - Center Left Offset */}
        <motion.circle
          cx="250"
          cy="500"
          r="64"
          fill="none"
          stroke="#126D5E"
          strokeWidth="2"
          opacity="0.39"
          animate={
            !reducedMotion
              ? { r: [64, 392], opacity: [0.39, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.05, repeat: Infinity, ease: 'easeOut', delay: 2.5 }
              : {}
          }
        />
        {/* Circle 12 - Center Right Offset */}
        <motion.circle
          cx="750"
          cy="520"
          r="58"
          fill="none"
          stroke="#E07548"
          strokeWidth="2"
          opacity="0.4"
          animate={
            !reducedMotion
              ? { r: [58, 376], opacity: [0.4, 0] }
              : {}
          }
          transition={
            !reducedMotion
              ? { duration: 3.15, repeat: Infinity, ease: 'easeOut', delay: 2.75 }
              : {}
          }
        />
      </motion.svg>

      {/* Content Container - Editorial Layout */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Headline - Staggered Line Reveal */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 sm:mb-10 md:mb-12"
        >
          <motion.h1
            variants={lineVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-signika text-cream leading-[0.95] tracking-tighter"
          >
            A LIVING
          </motion.h1>
          <motion.h1
            variants={lineVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-signika text-transparent bg-clip-text bg-gradient-to-r from-cream via-pumpkin to-cream leading-[0.95] tracking-tighter"
          >
            ECOSYSTEM
          </motion.h1>
        </motion.div>

        {/* Subheading - Editorial Copy */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 sm:mb-12 md:mb-16 space-y-4 sm:space-y-6"
        >
          <motion.p
            variants={lineVariants}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-cream/90 font-alan-sans leading-relaxed max-w-2xl mx-auto"
          >
            For emerging artists and brands to co-create cultural IP.
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-cream/80 font-alan-sans leading-relaxed max-w-2xl mx-auto"
          >
            Mentorship, resources, and direct monetization.
          </motion.p>
        </motion.div>

        {/* CTA Button - Ghost Style */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          className="flex justify-center"
        >
          <FishyButton 
            variant="pumpkin" 
            width="clamp(200px, 80vw, 420px)"
            height="clamp(50px, 12vw, 81px)"
            onClick={() => {
              if (setActiveSection) {
                setActiveSection('ecosystem');
                setTimeout(() => {
                  const ecosystem = document.getElementById('ecosystem');
                  if (ecosystem) {
                    ecosystem.scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }
            }}
          >
            Explore
          </FishyButton>
        </motion.div>
      </motion.div>

      {/* Decorative Corner Accents */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-cream/20" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-cream/20" />
    </section>
  );
}

