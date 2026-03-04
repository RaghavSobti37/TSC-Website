import React from 'react';
import Head from 'next/head';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import InfinityEcosystem from '@/components/sections/InfinityEcosystem';
import { Button } from '@/components/buttons/Button';

export default function EcosystemPage() {
  const ecosystemNodes = [
    {
      id: 'prepare',
      label: 'PREPARE',
      title: 'Online Courses & Learning',
      description: 'Master your craft with mentors',
      content: (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-charcoal">What it means</h4>
          <p className="text-base text-slate-medium">
            Building foundational skills and knowledge through structured learning from experienced mentors.
          </p>

          <h4 className="text-lg font-bold text-charcoal mt-6">What we do</h4>
          <ul className="list-disc list-inside space-y-2 text-slate-medium">
            <li>Curated courses across music, film, and creative arts</li>
            <li>One-on-one mentorship from industry professionals</li>
            <li>Community learning cohorts and peer feedback</li>
            <li>Portfolio development workshops</li>
          </ul>

          <a
            href="/academy"
            className="inline-block mt-6 text-teal-primary font-semibold hover:text-teal-dark transition-colors"
          >
            Explore Academy →
          </a>
        </div>
      ),
    },
    {
      id: 'create',
      label: 'CREATE',
      title: 'Creation Spaces & Community',
      description: 'Collaborate with peers',
      content: (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-charcoal">What it means</h4>
          <p className="text-base text-slate-medium">
            Bringing artists together in collaborative spaces where ideas flourish and work comes to life.
          </p>

          <h4 className="text-lg font-bold text-charcoal mt-6">What we do</h4>
          <ul className="list-disc list-inside space-y-2 text-slate-medium">
            <li>Physical and virtual creation cafés</li>
            <li>Cross-discipline collaboration opportunities</li>
            <li>Community events and showcases</li>
            <li>Peer feedback and quality assurance</li>
          </ul>

          <a
            href="/artists"
            className="inline-block mt-6 text-teal-primary font-semibold hover:text-teal-dark transition-colors"
          >
            Meet Our Artists →
          </a>
        </div>
      ),
    },
    {
      id: 'produce',
      label: 'PRODUCE',
      title: 'Production & Development',
      description: 'Develop your projects',
      content: (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-charcoal">What it means</h4>
          <p className="text-base text-slate-medium">
            Providing resources, expertise, and investment to transform creative concepts into finished works.
          </p>

          <h4 className="text-lg font-bold text-charcoal mt-6">What we do</h4>
          <ul className="list-disc list-inside space-y-2 text-slate-medium">
            <li>Pitch support and project development</li>
            <li>Production funding and resources</li>
            <li>Technical and creative direction</li>
            <li>Distribution partnerships</li>
          </ul>

          <a
            href="/contact"
            className="inline-block mt-6 text-teal-primary font-semibold hover:text-teal-dark transition-colors"
          >
            Submit Your Project →
          </a>
        </div>
      ),
    },
    {
      id: 'monetize',
      label: 'MONETIZE',
      title: 'Partnerships & Revenue',
      description: 'Create sustainable income',
      content: (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-charcoal">What it means</h4>
          <p className="text-base text-slate-medium">
            Creating multiple revenue streams through strategic partnerships and brand collaborations.
          </p>

          <h4 className="text-lg font-bold text-charcoal mt-6">What we do</h4>
          <ul className="list-disc list-inside space-y-2 text-slate-medium">
            <li>Brand collaboration facilitation</li>
            <li>Licensing opportunities</li>
            <li>Direct fan support platforms</li>
            <li>Commercial partnerships</li>
          </ul>

          <a
            href="/collaborations"
            className="inline-block mt-6 text-teal-primary font-semibold hover:text-teal-dark transition-colors"
          >
            Explore Partnerships →
          </a>
        </div>
      ),
    },
    {
      id: 'replicate',
      label: 'REPLICATE',
      title: 'Global Expansion',
      description: 'Scale worldwide',
      content: (
        <div className="space-y-4">
          <h4 className="text-lg font-bold text-charcoal">What it means</h4>
          <p className="text-base text-slate-medium">
            Expanding our artist-centric model to new cities and creative hubs globally.
          </p>

          <h4 className="text-lg font-bold text-charcoal mt-6">What we do</h4>
          <ul className="list-disc list-inside space-y-2 text-slate-medium">
            <li>Epicentre establishment in emerging hubs</li>
            <li>Local artist network building</li>
            <li>Cultural exchange programs</li>
            <li>Global collaboration network</li>
          </ul>

          <a
            href="/about"
            className="inline-block mt-6 text-teal-primary font-semibold hover:text-teal-dark transition-colors"
          >
            About TSC →
          </a>
        </div>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>TSC Ecosystem - UNFOLD your potential</title>
        <meta
          name="description"
          content="The living ecosystem: PREPARE, CREATE, PRODUCE, MONETIZE, REPLICATE"
        />
      </Head>

      {/* Hero Section */}
      <Section background="cream" padding="xl" className="min-h-[60vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp">
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">
              UNFOLD — The Living Ecosystem
            </h1>
            <p className="text-xl md:text-2xl text-slate-medium mb-4 max-w-2xl">
              PREPARE → CREATE → PRODUCE → MONETIZE → REPLICATE
            </p>
            <p className="text-lg text-slate-medium max-w-2xl">
              Everything an artist needs to develop their craft, create their best work, and build a sustainable career.
            </p>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* Interactive Ecosystem Diagram */}
      <Section background="white" padding="xl">
        <Container>
          <InfinityEcosystem nodes={ecosystemNodes} />
        </Container>
      </Section>

      {/* Bottom CTA */}
      <Section background="teal" padding="xl">
        <Container className="text-center">
          <UnfoldReveal variant="fadeUp">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Let's unfold a pathway for you.
            </h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Button variant="primary" size="lg" className="bg-cream text-charcoal hover:bg-cream-dark">
                Apply as Artist
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal">
                Partner with TSC
              </Button>
            </div>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}
