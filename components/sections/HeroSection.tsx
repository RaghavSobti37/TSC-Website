import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import { Button } from '@/components/buttons/Button';

/**
 * Hero Section - "The Eternal Arc"
 * Full viewport hero with staggered text reveal and cinematic backdrop
 */
export default function HeroSection() {
  // Staggered text animation
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: 'easeOut',
      },
    }),
  };

  const heroLines = [
    'Spot.',
    'Mentor.',
    'Nurture.',
    'Launch.',
    'Monetise.',
  ];

  return (
    <Section
      id="hero"
      background="transparent"
      padding="xl"
      className="relative h-screen w-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background gradient/video container */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-cream-dark opacity-90" />

      {/* Decorative blobs */}
      <motion.div
        className="absolute top-10 right-10 w-96 h-96 rounded-full bg-pumpkin opacity-10 blur-3xl"
        animate={{
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-teal-dark opacity-10 blur-3xl"
        animate={{
          y: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Content container */}
      <Container className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Main headline with staggered reveal */}
        <div className="space-y-4 mb-12">
          {heroLines.map((line, i) => (
            <motion.h1
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={textVariants}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-charcoal leading-[0.95] font-signika"
            >
              {line}
            </motion.h1>
          ))}
        </div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-alan-sans"
        >
          A living ecosystem where artists at the centre co-create, collaborate, and monetize with cultural authenticity.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a href="#contact" className="text-base font-semibold">
            <Button
              variant="primary"
              size="lg"
              className="text-base font-semibold"
            >
              Join as Artist
            </Button>
          </a>
          <a href="#collaborations" className="text-base font-semibold">
            <Button
              variant="secondary"
              size="lg"
              className="text-base font-semibold"
            >
              Partner with TSC
            </Button>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          viewport={{ once: true }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-pumpkin text-2xl"
          >
            ↓
          </motion.div>
          <p className="text-sm text-slate-500 mt-2 font-alan-sans">Scroll to explore</p>
        </motion.div>
      </Container>
    </Section>
  );
}
