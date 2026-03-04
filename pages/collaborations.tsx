import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import { Button } from '@/components/buttons/Button';
import { CMSGrid } from '@/components/cards/CMSCard';
import { cms } from '@/lib/cms';
import { cn } from '@/lib/utils';

export default function CollaborationsPage() {
  // Get proof tiles for case studies
  const caseStudies = cms.getProofTiles().map(tile => ({
    image: tile.image,
    title: tile.title,
    subtitle: 'Case Study',
    description: tile.summary,
    ctaLabel: 'Read Story',
    ctaHref: tile.link,
  }));

  // Sample partnerships data
  const partnerships = [
    {
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&h=500&fit=crop',
      title: 'Brand IP Creation',
      subtitle: 'Partnership',
      description: 'Co-create original cultural IP for brands seeking authentic storytelling',
      ctaLabel: 'Learn More',
      ctaHref: '#',
    },
    {
      image: 'https://images.unsplash.com/photo-1533635107eb7e7eb3b99f7d4b3e0c0d?w=500&h=500&fit=crop',
      title: 'Content Production',
      subtitle: 'Services',
      description: 'Full production support from concept to launch across multiple formats',
      ctaLabel: 'Learn More',
      ctaHref: '#',
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=500&fit=crop',
      title: 'Talent Partnerships',
      subtitle: 'Collaborations',
      description: 'Connect with emerging artists for exclusive projects and campaigns',
      ctaLabel: 'Learn More',
      ctaHref: '#',
    },
  ];

  return (
    <>
      <Head>
        <title>Collaborations - TSC</title>
        <meta
          name="description"
          content="Partner with TSC to create groundbreaking cultural IP and engage emerging talent"
        />
      </Head>

      {/* Hero */}
      <Section background="cream" padding="xl" className="min-h-[60vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp">
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">
              Unfold cultural IP for your brand.
            </h1>
            <p className="text-xl md:text-2xl text-slate-medium max-w-2xl">
              Strategic partnerships that connect brands with authentic emerging talent and groundbreaking creative
              ideas.
            </p>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* Partnership Models */}
      <Section background="white" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Partnership Models</h2>
          </UnfoldReveal>

          <CMSGrid items={partnerships} columns="3" variant="ip" />
        </Container>
      </Section>

      {/* Process Timeline */}
      <Section background="cream-dark" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Our Process</h2>
            <p className="text-lg text-slate-medium mt-4">From brief to scale, we guide you every step</p>
          </UnfoldReveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-teal-dark to-transparent" />

            <div className="space-y-16 md:space-y-24">
              {[
                {
                  phase: 'Brief',
                  description:
                    'Understand your story, vision, and cultural objectives. Align on goals and success metrics.',
                  icon: '📋',
                },
                {
                  phase: 'Create',
                  description:
                    'Ideate with our artist network. Develop concepts that resonate with culture and commerce.',
                  icon: '🎨',
                },
                {
                  phase: 'Launch',
                  description:
                    'Produce and distribute across channels. Activate with authentic artist partnerships.',
                  icon: '🚀',
                },
                {
                  phase: 'Scale',
                  description:
                    'Measure impact. Iterate and expand successful initiatives across markets and formats.',
                  icon: '📈',
                },
              ].map((step, index) => (
                <UnfoldReveal key={step.phase} variant="slideInLeft" delay={index * 0.1}>
                  <motion.div
                    className={cn(
                      'md:flex md:gap-12',
                      index % 2 === 1 && 'md:flex-row-reverse'
                    )}
                    whileHover={{ x: index % 2 === 1 ? 8 : -8 }}
                  >
                    {/* Content */}
                    <div className="flex-1 mb-8 md:mb-0">
                      <h3 className="text-3xl font-bold text-charcoal mb-4">{step.phase}</h3>
                      <p className="text-lg text-slate-medium leading-relaxed">{step.description}</p>
                    </div>

                    {/* Timeline marker */}
                    <div className="flex-shrink-0 hidden md:flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-white border-4 border-teal-dark flex items-center justify-center text-3xl z-10">
                        {step.icon}
                      </div>
                    </div>

                    {/* Mobile icon */}
                    <div className="md:hidden flex gap-4 items-start mb-8">
                      <div className="text-4xl flex-shrink-0">{step.icon}</div>
                    </div>
                  </motion.div>
                </UnfoldReveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Case Studies */}
      <Section background="white" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Case Studies</h2>
            <p className="text-lg text-slate-medium mt-4">See our impact in action</p>
          </UnfoldReveal>

          <CMSGrid items={caseStudies} columns="2" variant="proof" />
        </Container>
      </Section>

      {/* CTA */}
      <Section background="teal" padding="xl">
        <Container className="text-center">
          <UnfoldReveal variant="fadeUp" className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to collaborate?</h2>
            <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
              Let's create something that moves culture forward. Share your vision and let's explore what's possible.
            </p>
            <Button variant="primary" size="lg" className="bg-cream text-teal-dark hover:bg-cream-dark">
              Start a Conversation
            </Button>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}
