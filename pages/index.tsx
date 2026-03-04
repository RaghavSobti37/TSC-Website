import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import LineDrawSVG from '@/components/animations/LineDrawSVG';
import MaskImage from '@/components/animations/MaskImage';
import UnfoldAccordion from '@/components/animations/UnfoldAccordion';
import InfinityEcosystem from '@/components/sections/InfinityEcosystem';
import { Button, CTACluster } from '@/components/buttons/Button';
import { CMSGrid } from '@/components/cards/CMSCard';
import { cn } from '@/lib/utils';

/**
 * Home Page - TSC Website 2.0
 * Implements the UNFOLD design system with all brand motifs
 */
export default function Home() {
  // Sample ecosystem nodes (will be replaced with CMS data)
  const ecosystemNodes = [
    {
      id: 'prepare',
      label: 'PREPARE',
      title: 'Online Courses',
      description: 'Master your craft',
      content: (
        <div>
          <p className="text-base mb-4">
            Learn from industry mentors through structured online courses designed to help artists
            develop their fundamental skills.
          </p>
          <a href="/academy" className="text-teal-primary font-semibold hover:text-teal-dark">
            Explore Courses →
          </a>
        </div>
      ),
    },
    {
      id: 'create',
      label: 'CREATE',
      title: 'Creation Cafés',
      description: 'Collaborate and innovate',
      content: (
        <div>
          <p className="text-base mb-4">
            Join creative spaces where artists collaborate, experiment, and develop new work in a
            supportive community environment.
          </p>
          <a href="/ecosystem" className="text-teal-primary font-semibold hover:text-teal-dark">
            Learn More →
          </a>
        </div>
      ),
    },
    {
      id: 'produce',
      label: 'PRODUCE',
      title: 'Pitch & Production',
      description: 'Bring ideas to life',
      content: (
        <div>
          <p className="text-base mb-4">
            Submit your ideas for production support, mentorship, and resources to develop your
            projects from concept to reality.
          </p>
          <a href="/ecosystem" className="text-teal-primary font-semibold hover:text-teal-dark">
            Start Pitching →
          </a>
        </div>
      ),
    },
    {
      id: 'monetize',
      label: 'MONETIZE',
      title: 'Brand Collaborations',
      description: 'Create with purpose',
      content: (
        <div>
          <p className="text-base mb-4">
            Partner with brands and cultural partners to monetize your work and reach new
            audiences globally.
          </p>
          <a href="/collaborations" className="text-teal-primary font-semibold hover:text-teal-dark">
            Explore Partnerships →
          </a>
        </div>
      ),
    },
    {
      id: 'replicate',
      label: 'REPLICATE',
      title: 'Creation Campuses',
      description: 'Scale impact worldwide',
      content: (
        <div>
          <p className="text-base mb-4">
            Expand TSC's model to new epicentres globally, bringing our talent-centric approach
            to emerging creative hubs.
          </p>
          <a href="/about" className="text-teal-primary font-semibold hover:text-teal-dark">
            About Our Network →
          </a>
        </div>
      ),
    },
  ];

  // Sample proof of work cards
  const proofTiles = [
    {
      image: 'https://images.unsplash.com/photo-1516239482537-e3c3f11cb3a2?w=500&h=500&fit=crop',
      title: 'TSC Academy',
      subtitle: 'Education',
      description: 'Mentorship-driven courses for emerging artists',
      ctaLabel: 'Explore',
      ctaHref: '/academy',
    },
    {
      image: 'https://images.unsplash.com/photo-1514567152633-dd10c67f0314?w=500&h=500&fit=crop',
      title: 'Main Bhi Artist',
      subtitle: 'Community',
      description: 'Global artist community and collaboration hub',
      ctaLabel: 'Join',
      ctaHref: '/artists',
    },
    {
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop',
      title: 'IP Creations',
      subtitle: 'Portfolio',
      description: 'Breakthrough stories and musical productions',
      ctaLabel: 'View',
      ctaHref: '/ip',
    },
    {
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
      title: 'Brand Partnerships',
      subtitle: 'Collaborations',
      description: 'Cultural IP creation for global brands',
      ctaLabel: 'Discover',
      ctaHref: '/collaborations',
    },
  ];

  // UNFOLD Grid tiles
  const unfoldGridTiles = [
    'Potential',
    'Opportunities',
    'Genres',
    'Cultures',
    'Geographies',
    'Communities',
    'Collaborations',
    'Talent',
    'Styles',
    'Fandoms',
    'IPs',
    'Exports',
  ];

  // Problem panels for "Why We Were Born"
  const problemPanels = [
    {
      id: 'hegemony',
      title: 'A hegemony of labels',
      content:
        'The music and entertainment industry has long been dominated by traditional gatekeepers who control who gets heard and who remains silent. Artists lack autonomy over their work, their narrative, and their future.',
      image:
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
    },
    {
      id: 'algorithms',
      title: 'Serving algorithms & commerce makes for predictability',
      content:
        'When platforms prioritize engagement metrics and profit margins, true artistic expression gets buried. Innovation is sacrificed for algorithmic optimization, leading to a homogenized cultural landscape.',
      image:
        'https://images.unsplash.com/photo-1514567152633-dd10c67f0314?w=600&h=600&fit=crop',
    },
    {
      id: 'ecosystem',
      title: 'No single talent nurture-to-monetize ecosystem',
      content:
        'Artists face fragmented journeys with no cohesive support system. They must navigate multiple platforms, services, and partners, often with conflicting interests, losing focus on their craft.',
      image:
        'https://images.unsplash.com/photo-1516579318957-70fcd650d840?w=600&h=600&fit=crop',
    },
    {
      id: 'connection',
      title: 'No direct connect with fans',
      content:
        'The artist-to-fan relationship is mediated by platforms and intermediaries. Direct connection, community building, andAuthentic relationships are impossible in this structure.',
      image:
        'https://images.unsplash.com/photo-1516239482537-e3c3f11cb3a2?w=600&h=600&fit=crop',
    },
  ];

  const values = [
    {
      word: 'Fearlessness',
      description: 'We embrace risk and boldly challenge the status quo.',
    },
    {
      word: 'Integrity',
      description: 'We champion authentic voices and transparent relationships.',
    },
    {
      word: 'Optimism',
      description: 'We believe in the power of culture to create positive change.',
    },
    {
      word: 'Transparency',
      description: 'We operate with openness and accountability in all partnerships.',
    },
  ];

  return (
    <>
      <Head>
        <title>The Soul Company - A New Ecosystem for Artists & Brands</title>
        <meta
          name="description"
          content="The Soul Company is a global ecosystem for emerging artists and brands to co-create cultural IP. We empower artists by providing mentorship, resources, and a direct path to monetization."
        />
        <meta property="og:title" content="The Soul Company - A New Ecosystem for Artists & Brands" />
        <meta property="og:description" content="The Soul Company is a global ecosystem for emerging artists and brands to co-create cultural IP. We empower artists by providing mentorship, resources, and a direct path to monetization." />
      </Head>

      {/* Hero Section */}
      <Section background="cream" padding="xl" className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Headline & CTAs */}
          <UnfoldReveal variant="slideInLeft" className="space-y-8">
            {/* Brand mark SVG animation */}
            <LineDrawSVG
              svgPath="M 20 50 Q 30 40 40 50 Q 50 60 40 70 Q 30 60 20 50 M 60 50 Q 70 40 80 50 Q 90 60 80 70 Q 70 60 60 50"
              strokeColor="#0B5147"
              strokeWidth={1}
              width={100}
              height={100}
              duration={2.5}
            />

            {/* H1 Headline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-charcoal leading-tight">
                Putting artists
                <br />
                <span className="text-teal-dark">in control.</span>
              </h1>
            </motion.div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-lg md:text-xl text-slate-medium max-w-lg"
            >
              A talent-centric global culture-creation engine.
            </motion.p>

            {/* UNFOLD Link */}
            <motion.a
              href="#unfold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="inline-flex text-teal-primary font-semibold hover:gap-2 gap-1 transition-all"
              whileHover={{ x: 4 }}
            >
              UNFOLD our manifesto →
            </motion.a>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row gap-4 md:gap-6 pt-4"
            >
              <Button variant="primary" size="lg">
                Join as Artist
              </Button>
              <Button variant="outline" size="lg">
                Partner with TSC
              </Button>
            </motion.div>
          </UnfoldReveal>

          {/* Right: Hero Image/Video */}
          <UnfoldReveal variant="slideInRight" className="hidden lg:block">
            <div className="aspect-square rounded-lg overflow-hidden bg-cream-dark">
              <img
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=800&fit=crop"
                alt="Artists in action"
                className="w-full h-full object-cover"
              />
            </div>
          </UnfoldReveal>
        </Container>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-2xl text-teal-dark">↓</div>
        </motion.div>
      </Section>

      {/* Why We Were Born - Problem Tension */}
      <Section background="white" padding="xl" id="why">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-charcoal mb-4">
              Why we were born
            </h2>
            <p className="text-lg md:text-xl text-slate-medium max-w-2xl">
              The tension between what is and what could be.
            </p>
          </UnfoldReveal>

          <UnfoldAccordion items={problemPanels} variant="single" />
        </Container>
      </Section>

      {/* Bridge: Spot → Monetize Timeline */}
      <Section background="cream" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">
              Spot → Mentor → Nurture → Launch → Monetise
            </h2>
          </UnfoldReveal>

          {/* Timeline visualization */}
          <div className="relative py-16">
            <svg
              viewBox="0 0 1000 100"
              className="w-full h-auto"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Timeline line */}
              <motion.line
                x1="50"
                y1="50"
                x2="950"
                y2="50"
                stroke="#0B5147"
                strokeWidth="3"
                initial={{ strokeDashoffset: 900 }}
                whileInView={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.5, ease: 'easeInOut' }}
                strokeDasharray="900"
              />

              {/* Timeline dots and labels */}
              {['Spot', 'Mentor', 'Nurture', 'Launch', 'Monetise'].map((label, i) => {
                const x = 50 + (i * 900) / 4;
                return (
                  <g key={label}>
                    <motion.circle
                      cx={x}
                      cy="50"
                      r="12"
                      fill="#0B5147"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: i * 0.2 + 0.5 }}
                    />
                    <motion.text
                      x={x}
                      y="75"
                      textAnchor="middle"
                      className="text-sm font-semibold fill-charcoal"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 + 0.7 }}
                    >
                      {label}
                    </motion.text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Container>
      </Section>

      {/* Infinity Ecosystem */}
      <Section background="teal" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16 text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Infinity Ecosystem
            </h2>
            <p className="text-lg text-cream max-w-2xl">
              A living, breathing system where artists thrive at every stage.
            </p>
          </UnfoldReveal>

          <InfinityEcosystem nodes={ecosystemNodes} />
        </Container>
      </Section>

      {/* For Conscious Globalists */}
      <Section background="cream" padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 md:mb-24">
            {[
              {
                title: 'For artists seeking meaning beyond noise',
                desc: 'A home where your voice matters and your art changes culture.',
              },
              {
                title: 'For audiences seeking emotion over doom-scrolling',
                desc: 'Authentic stories and transformative cultural experiences.',
              },
              {
                title: 'For culture-investors & brands shaping future culture',
                desc: 'Strategic partnerships that create authentic cultural IP.',
              },
            ].map((item, i) => (
              <UnfoldReveal key={i} variant="slideInLeft" delay={i * 0.1}>
                <h3 className="text-2xl font-bold text-charcoal mb-4">{item.title}</h3>
                <p className="text-slate-medium text-base leading-relaxed">{item.desc}</p>
              </UnfoldReveal>
            ))}
          </div>

          <MaskImage
            src="https://images.unsplash.com/photo-1514607687887-7419c7b47e5d?w=1200&h=600&fit=crop"
            alt="Global creative community"
            className="rounded-lg overflow-hidden"
            direction="top"
            duration={1.2}
          />
        </Container>
      </Section>

      {/* UNFOLD Grid */}
      <Section background="white" padding="xl" id="unfold">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">
              Unfold what's possible
            </h2>
          </UnfoldReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {unfoldGridTiles.map((tile, i) => (
              <UnfoldReveal key={tile} variant="scaleUp" delay={i * 0.05}>
                <motion.div
                  className="aspect-square bg-cream rounded-lg flex items-center justify-center text-center p-4 cursor-pointer hover:bg-teal-dark hover:text-cream transition-all duration-300 border border-cream-dark hover:border-teal-dark group"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div>
                    <p className="font-bold text-charcoal group-hover:text-cream transition-colors">
                      {tile}
                    </p>
                    <p className="text-xs text-slate-light group-hover:text-cream-light transition-colors mt-2">
                      Explore
                    </p>
                  </div>
                </motion.div>
              </UnfoldReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Proof of Work */}
      <Section background="cream-dark" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">
              Alive & at work
            </h2>
            <p className="text-slate-medium text-lg mt-4">
              See the real impact TSC is creating in culture and commerce.
            </p>
          </UnfoldReveal>

          <CMSGrid items={proofTiles} columns="2" variant="proof" />
        </Container>
      </Section>

      {/* Values Section */}
      <Section background="charcoal" padding="xl">
        <Container>
          <div className="space-y-12">
            <UnfoldReveal variant="fadeUp" className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold">What drives us</h2>
            </UnfoldReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, i) => (
                <UnfoldReveal key={value.word} variant="fadeUp" delay={i * 0.1}>
                  <motion.div
                    className="group cursor-pointer"
                    whileHover={{ y: -4 }}
                  >
                    <h3 className="text-2xl md:text-3xl font-bold text-cream mb-4">
                      {value.word}
                    </h3>
                    <motion.p
                      className="text-slate-light text-sm leading-relaxed h-12 overflow-hidden"
                      initial={{ maxHeight: 0, opacity: 0 }}
                      whileHover={{ maxHeight: 100, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {value.description}
                    </motion.p>
                  </motion.div>
                </UnfoldReveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section background="cream" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-8">
              Your journey starts here
            </h2>
          </UnfoldReveal>

          <CTACluster
            className="max-w-3xl mx-auto"
            items={[
              {
                label: 'Apply as Artist',
                description: 'Join to be mentored, guided to realising your potential',
                href: '/contact?type=artist',
              },
              {
                label: 'Partner Brief',
                description: 'Brief a story/problem; we create cultural IP',
                href: '/contact?type=brand',
              },
              {
                label: 'Co-Create with TSC',
                description: 'Co-create original music-to-scripts pipeline',
                href: '/contact?type=producer',
              },
            ]}
          />
        </Container>
      </Section>
    </>
  );
}
