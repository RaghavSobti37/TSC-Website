import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import MaskImage from '@/components/animations/MaskImage';
import { Button } from '@/components/buttons/Button';
import { cms } from '@/lib/cms';

export default function AboutPage() {
  const team = cms.getTeam();

  return (
    <>
      <Head>
        <title>About TSC - Our Story & Mission</title>
        <meta name="description" content="Learn about The Spot Collective and our mission to put artists in control" />
      </Head>

      {/* Hero */}
      <Section background="cream" padding="xl" className="min-h-[60vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp">
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">
              About TSC
            </h1>
            <p className="text-xl md:text-2xl text-slate-medium max-w-2xl">
              The Spot Collective is a talent-centric global culture-creation engine dedicated to putting artists
              in control of their creative and commercial futures.
            </p>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* Mission Statement */}
      <Section background="white" padding="xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <UnfoldReveal variant="slideInLeft">
              <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
                Rooted yet Contemporary
              </h2>
              <p className="text-lg text-slate-medium mb-6 leading-relaxed">
                We believe artists deserve more than extraction. More than algorithms dictating their worth. More
                than fragmented systems disconnecting them from their audiences.
              </p>
              <p className="text-lg text-slate-medium leading-relaxed">
                TSC provides the ecosystem, mentorship, and partnerships artists need to build sustainable careers
                on their own terms. We're not managers or labels. We're architects of opportunity.
              </p>
            </UnfoldReveal>

            <UnfoldReveal variant="slideInRight">
              <MaskImage
                src="https://images.unsplash.com/photo-1516239482537-e3c3f11cb3a2?w=600&h=600&fit=crop"
                alt="TSC Mission"
                className="rounded-lg overflow-hidden"
                direction="top"
              />
            </UnfoldReveal>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section background="charcoal" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16 text-white">
            <h2 className="text-4xl md:text-5xl font-bold">What drives us</h2>
          </UnfoldReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                value: 'Fearlessness',
                description:
                  'We embrace risk and boldly challenge the status quo of how artists are supported and celebrated.',
              },
              {
                value: 'Integrity',
                description:
                  'We champion authentic voices and build transparent, equitable relationships with our community.',
              },
              {
                value: 'Optimism',
                description:
                  'We believe in the power of culture to create positive individual and social change.',
              },
              {
                value: 'Transparency',
                description:
                  'We operate with openness and accountability in all partnerships and decision-making.',
              },
            ].map((item, index) => (
              <UnfoldReveal key={item.value} variant="fadeUp" delay={index * 0.1}>
                <motion.div
                  className="border-l-4 border-teal-light pl-6"
                  whileHover={{ borderLeftColor: '#FDF6F1' }}
                >
                  <h3 className="text-2xl font-bold text-cream mb-3">{item.value}</h3>
                  <p className="text-slate-light leading-relaxed">{item.description}</p>
                </motion.div>
              </UnfoldReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section background="white" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Our Journey</h2>
          </UnfoldReveal>

          <div className="space-y-12">
            {[
              {
                year: '2020',
                title: 'TSC Founded',
                description:
                  'Started with a vision to create a better ecosystem for emerging artists across music, film, and creative arts.',
              },
              {
                year: '2021',
                title: 'First Academy Launch',
                description: 'Launched TSC Academy with mentorship programs in music production and digital art.',
              },
              {
                year: '2022',
                title: 'Global Expansion',
                description: 'Expanded to 12 countries with local creation cafés and partnership networks.',
              },
              {
                year: '2023',
                title: '1000+ Artists',
                description:
                  'Reached 1000+ artists in our ecosystem with successful collaborations and IP creations.',
              },
              {
                year: '2024',
                title: 'Cultural Impact',
                description:
                  'Launched UNFOLD: A new design and mission to redefine artist agency and culture creation.',
              },
            ].map((milestone, index) => (
              <UnfoldReveal key={milestone.year} variant="slideInLeft" delay={index * 0.08}>
                <motion.div
                  className="flex gap-8 pb-12 border-b border-cream-dark last:border-b-0"
                  whileHover={{ x: 8 }}
                >
                  <div className="flex-shrink-0 w-32">
                    <div className="text-3xl font-bold text-teal-dark">{milestone.year}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-charcoal mb-2">{milestone.title}</h4>
                    <p className="text-slate-medium text-base">{milestone.description}</p>
                  </div>
                </motion.div>
              </UnfoldReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Team Section */}
      <Section background="cream-dark" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Leadership</h2>
            <p className="text-lg text-slate-medium mt-4">
              Visionary creators and strategists guiding TSC's mission
            </p>
          </UnfoldReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <UnfoldReveal key={member.id} variant="scaleUp" delay={index * 0.1}>
                <motion.div
                  className="bg-white rounded-lg p-8 text-center hover:shadow-lg transition-shadow"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-32 h-32 bg-teal-dark rounded-full mx-auto mb-6 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-teal-primary mb-4">{member.role}</p>
                  <p className="text-slate-medium text-sm leading-relaxed">{member.bio}</p>
                </motion.div>
              </UnfoldReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Call to Action */}
      <Section background="teal" padding="xl">
        <Container className="text-center">
          <UnfoldReveal variant="fadeUp" className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Movement</h2>
            <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
              Whether you're an artist, brand partner, or fellow believer in creative empowerment, there's a place
              for you in the TSC ecosystem.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Button variant="primary" size="lg" className="bg-cream text-teal-dark hover:bg-cream-dark">
                Apply as Artist
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-dark">
                Let's Partner
              </Button>
            </div>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}
