import { Button } from '@/components/buttons/Button';
import { CMSGrid } from '@/components/cards/CMSCard';
import Container from '@/components/layout/Container';
import Section from '@/components/layout/Section';
import { cms } from '@/lib/cms';
import Head from 'next/head';
import React, { useState } from 'react';
import UnfoldReveal from '@/components/animations/UnfoldReveal';

export default function IPPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const allIPs = cms.getIPs();
  const typeFilters = Array.from(new Set(allIPs.map(ip => ip.type)));
  const statusFilters = Array.from(new Set(allIPs.map(ip => ip.status)));


  const filteredIP = allIPs
    .map((ip) => ({
      image: ip.heroImage,
      title: ip.title,
      subtitle: ip.type,
      description: ip.logline,
      tags: [ip.status],
      ctaLabel: ip.ctaLabel,
      ctaHref: `/ip/${ip.slug}`,
    }))
    .filter((ip) => {
      const typeMatch = !selectedType || ip.subtitle === selectedType;
      const statusMatch = !selectedStatus || (ip.tags && ip.tags.some((tag) => tag === selectedStatus));
      return typeMatch && statusMatch;
    });

  return (
    <>
      <Head>
        <title>IP & Stories - TSC</title>
        <meta name="description" content="Explore TSC's portfolio of cultural IP and creative stories" />
      </Head>

      {/* Hero */}
      <Section background="cream" padding="xl" className="min-h-[50vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp">
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">
              IP & Stories
            </h1>
            <p className="text-lg md:text-xl text-slate-medium max-w-2xl">
              Breakthrough cultural IP created at the intersection of talent, technology, and commerce.
            </p>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* Filter Section */}
      <Section background="white" padding="lg">
        <Container>
          <div className="space-y-6">
            {/* Type Filter */}
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-charcoal mb-4">
                Type
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedType(null)}
                  variant={selectedType === null ? 'primary' : 'outline'}
                  size="sm"
                >
                  All Types
                </Button>
                {typeFilters.map((type) => (
                  <Button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    variant={selectedType === type ? 'secondary' : 'outline'}
                    size="sm"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h3 className="text-sm uppercase tracking-widest font-bold text-charcoal mb-4">
                Status
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedStatus(null)}
                  variant={selectedStatus === null ? 'primary' : 'outline'}
                  size="sm"
                >
                  All Status
                </Button>
                {statusFilters.map((status) => (
                  <Button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    variant={selectedStatus === status ? 'secondary' : 'outline'}
                    size="sm"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* IP Grid */}
      <Section background="cream-dark" padding="lg">
        <Container>
          {filteredIP.length > 0 ? (
            <CMSGrid items={filteredIP} columns="3" variant="ip" />
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-slate-medium">
                No IP matching your filters. Try adjusting your selection.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
