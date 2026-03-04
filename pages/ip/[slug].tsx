import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import MaskImage from '@/components/animations/MaskImage';
import { Button } from '@/components/buttons/Button';
import { cms } from '@/lib/cms';

interface IPDetailPageProps {
  ip: ReturnType<typeof cms.getIPBySlug>;
}

export default function IPDetailPage({ ip }: IPDetailPageProps) {
  if (!ip) {
    return (
      <>
        <Head>
          <title>IP Not Found - TSC</title>
        </Head>
        <Section background="cream" padding="xl" className="min-h-[60vh] flex items-center justify-center">
          <Container className="text-center">
            <h1 className="text-5xl font-bold text-charcoal mb-6">IP Not Found</h1>
            <p className="text-xl text-slate-medium mb-8">The IP you're looking for doesn't exist.</p>
            <Link href="/ip">
              <Button variant="primary" size="lg">
                Back to All IP
              </Button>
            </Link>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{ip.title} - TSC</title>
        <meta name="description" content={ip.logline} />
        <meta property="og:title" content={ip.title} />
        <meta property="og:description" content={ip.logline} />
        <meta property="og:image" content={ip.heroImage} />
      </Head>

      {/* Hero */}
      <Section background="cream" padding="xl" className="min-h-[70vh] flex items-center justify-center">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <UnfoldReveal variant="slideInLeft">
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-teal-dark text-cream rounded-full text-sm font-semibold mb-6">
                  {ip.type}
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">{ip.title}</h1>
              <p className="text-2xl text-slate-medium mb-6 leading-relaxed">{ip.logline}</p>
              <p className="text-lg text-slate-medium mb-8">{ip.subtitle}</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg">
                  {ip.ctaLabel}
                </Button>
                <Link href="/ip">
                  <Button variant="outline" size="lg">
                    View All IP
                  </Button>
                </Link>
              </div>
            </UnfoldReveal>

            <UnfoldReveal variant="slideInRight">
              <MaskImage
                src={ip.heroImage}
                alt={ip.title}
                className="rounded-lg overflow-hidden"
                direction="left"
              />
            </UnfoldReveal>
          </div>
        </Container>
      </Section>

      {/* Overview */}
      <Section background="white" padding="xl">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <UnfoldReveal variant="fadeUp" className="mb-12">
                <h2 className="text-4xl font-bold text-charcoal mb-6">About this IP</h2>
                <p className="text-lg text-slate-medium leading-relaxed mb-6">{ip.description}</p>
              </UnfoldReveal>

              {/* Status */}
              <UnfoldReveal variant="fadeUp" className="mb-12">
                <h3 className="text-2xl font-bold text-charcoal mb-4">Status</h3>
                <p className="text-lg">
                  <span className="inline-block px-4 py-2 bg-cream rounded-full text-charcoal font-semibold">
                    {ip.status}
                  </span>
                </p>
              </UnfoldReveal>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Cultural Rootedness */}
              <UnfoldReveal variant="slideInRight">
                <div className="bg-cream rounded-lg p-6">
                  <h4 className="text-lg font-bold text-charcoal mb-3">Cultural Rootedness</h4>
                  <p className="text-slate-medium">{ip.culturalRootedness}</p>
                </div>
              </UnfoldReveal>

              {/* Contemporary Format */}
              <UnfoldReveal variant="slideInRight">
                <div className="bg-cream rounded-lg p-6">
                  <h4 className="text-lg font-bold text-charcoal mb-3">Contemporary Format</h4>
                  <p className="text-slate-medium">{ip.contemporaryFormat}</p>
                </div>
              </UnfoldReveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* Partnerships & Tags */}
      <Section background="cream-dark" padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Partnerships */}
            <UnfoldReveal variant="slideInLeft">
              <h3 className="text-2xl font-bold text-charcoal mb-6">Partnerships</h3>
              <div className="space-y-3">
                {ip.partnerships.map((partner, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-teal-dark font-bold">✓</span>
                    <span className="text-slate-medium">{partner}</span>
                  </motion.div>
                ))}
              </div>
            </UnfoldReveal>

            {/* Monetization Tags */}
            <UnfoldReveal variant="slideInRight">
              <h3 className="text-2xl font-bold text-charcoal mb-6">Monetization Models</h3>
              <div className="flex flex-wrap gap-3">
                {ip.monetisationTags.map((tag, index) => (
                  <motion.span
                    key={index}
                    className="inline-block px-4 py-2 bg-teal-dark text-cream rounded-full text-sm font-semibold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
            </UnfoldReveal>
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="teal" padding="xl">
        <Container className="text-center">
          <UnfoldReveal variant="fadeUp" className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Interested in collaborating?</h2>
            <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
              Let's explore how {ip.title} can amplify your brand or expand your creative vision.
            </p>
            <Link href="/contact?type=brand">
              <Button variant="primary" size="lg" className="bg-cream text-teal-dark hover:bg-cream-dark">
                Start a Conversation
              </Button>
            </Link>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const ip = cms.getIPBySlug(params.slug);

  if (!ip) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ip,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const ips = cms.getIPs();

  return {
    paths: ips.map((ip) => ({
      params: {
        slug: ip.slug,
      },
    })),
    fallback: 'blocking',
  };
}
