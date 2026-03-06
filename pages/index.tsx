'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import HeroSection from '@/components/sections/HeroSection';
import InfinityEcosystem from '@/components/sections/InfinityEcosystem';
import ValuesSection from '@/components/sections/ValuesSection';
import IPGallerySection from '@/components/sections/IPGallerySection';
import AcademySection from '@/components/sections/AcademySection';
import CollaborationsSection from '@/components/sections/CollaborationsSection';
import ArtistsSection from '@/components/sections/ArtistsSection';
import ContactSection from '@/components/sections/ContactSection';

/**
 * TSC Website 2.0 - Single Page Scroller
 *
 * Cinematic, borderless architecture with continuous content flow
 * Hero → Ecosystem → IP Gallery → Academy → Collaborations → Contact → Artists → Footer
 */
export default function Home() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolling, setIsScrolling] = useState(false);

  // Ecosystem nodes data
  const ecosystemNodes = [
    {
      id: 'prepare',
      label: 'PREPARE',
      title: 'Courses & Mentorship',
      content: (
        <div className="space-y-3">
          <p className="text-base mb-4 text-charcoal">
            Master your fundamentals through industry-led courses and one-on-one mentorship. Learn production, songwriting, visual design, and business.
          </p>
          <a href="#academy" className="text-pumpkin font-semibold hover:text-cream transition-colors">
            Explore Academy →
          </a>
        </div>
      ),
    },
    {
      id: 'create',
      label: 'CREATE',
      title: 'Creation Cafés',
      content: (
        <div className="space-y-3">
          <p className="text-base mb-4 text-charcoal">
            Access world-class studios and creative spaces. Collaborate with peers in facilitated environments designed for innovation and experimentation.
          </p>
          <a href="#ip-gallery" className="text-pumpkin font-semibold hover:text-cream transition-colors">
            See Projects →
          </a>
        </div>
      ),
    },
    {
      id: 'produce',
      label: 'PRODUCE',
      title: 'Production Support',
      content: (
        <div className="space-y-3">
          <p className="text-base mb-4 text-charcoal">
            Get funding, technical support, and production resources. From grants to recording to distribution, we've got the infrastructure.
          </p>
          <a href="#contact" className="text-pumpkin font-semibold hover:text-cream transition-colors">
            Get Support →
          </a>
        </div>
      ),
    },
    {
      id: 'monetize',
      label: 'MONETIZE',
      title: 'Brand Partnerships',
      content: (
        <div className="space-y-3">
          <p className="text-base mb-4 text-charcoal">
            Connect with brands and cultural partners. Monetize your work through authentic collaborations that align with your values.
          </p>
          <a href="#collaborations" className="text-pumpkin font-semibold hover:text-cream transition-colors">
            Learn More →
          </a>
        </div>
      ),
    },
    {
      id: 'replicate',
      label: 'REPLICATE',
      title: 'Global Impact',
      content: (
        <div className="space-y-3">
          <p className="text-base mb-4 text-charcoal">
            Scale your impact globally. Expand to new markets, build communities, and influence culture across borders and continents.
          </p>
          <a href="#artists" className="text-pumpkin font-semibold hover:text-cream transition-colors">
            Join Community →
          </a>
        </div>
      ),
    },
  ];

  // Handle scroll to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'hero',
        'ecosystem',
        'values',
        'ip-gallery',
        'academy',
        'collaborations',
        'contact',
        'artists',
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 3;

      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;

          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const throttledScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
        handleScroll();
        setTimeout(() => setIsScrolling(false), 100);
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [isScrolling]);

  return (
    <>
      <Head>
        <title>The Shakti Collective - A Living Ecosystem for Artists & Brands</title>
        <meta
          name="description"
          content="The Shakti Collective is a global, cinematic ecosystem for emerging artists and brands to co-create cultural IP. Mentorship, resources, and direct monetization."
        />
        <meta property="og:title" content="The Shakti Collective - Living Ecosystem" />
        <meta property="og:description" content="A cinematic, borderless experience. Artists at the center. Culture unleashed." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Scroll Container */}
      <main className="scroll-smooth scroll-behavior-smooth">
        {/* Hero Section */}
        <section id="hero">
          <HeroSection activeSection={activeSection} setActiveSection={setActiveSection} />
        </section>

        {/* Infinity Ecosystem */}
        <section id="ecosystem">
          <InfinityEcosystem nodes={ecosystemNodes} />
        </section>

        {/* Values Section */}
        {/* <section id="values">
          <ValuesSection />
        </section> */}

        {/* IP & Stories Gallery */}
        <section id="ip-gallery">
          <IPGallerySection />
        </section>

        {/* Academy Timeline */}
        <section id="academy">
          <AcademySection />
        </section>

        {/* Collaborations */}
        <section id="collaborations">
          <CollaborationsSection />
        </section>

        {/* Artists Community */}
        <section id="artists">
          <ArtistsSection />
        </section>

        {/* Contact Form */}
        <section id="contact">
          <ContactSection />
        </section>
      </main>

      {/* Smooth scroll behavior */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          background-color: #000;
        }
        body {
          overflow-x: hidden;
          background-color: #000;
        }
        .scroll-behavior-auto {
          scroll-behavior: auto !important;
        }
      `}</style>
    </>
  );
}
