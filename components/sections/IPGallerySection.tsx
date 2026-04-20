import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import { Button } from '@/components/buttons/Button';

interface IPItem {
  id: string;
  title: string;
  type: string;
  status: string;
  logline: string;
  thumbnail: string;
  link?: string;
}

/**
 * IP & Stories Gallery Section
 * Showcase TSC's cultural IP creations
 */
export default function IPGallerySection() {
  const ipItems: IPItem[] = [
    {
      id: 'ip-1',
      title: 'Mahavatar Narsimha',
      type: 'Business Strategy / Core Marketing',
      status: 'Archived',
      logline: 'The highest-earning animated film of all time in India — built from devotion, teamwork, and purpose.',
      thumbnail: '/assets/Movie_images_117.jpg',
    },
    {
      id: 'ip-2',
      title: 'TSC Academy',
      type: 'Artist Development',
      status: 'Active',
      logline: 'Unfold yourself — from within to the world. A sanctuary where artists reclaim their voice.',
      thumbnail: '/assets/tsc academy.png',
      link: 'https://tscacademy.in',
    },
    {
      id: 'ip-3',
      title: 'Main Bhi Artist',
      type: 'Community & Activism',
      status: 'Active',
      logline: 'A rebellion dressed as community. A home for the quiet music dreamers.',
      thumbnail: '/assets/mba banner.png',
    },
    {
      id: 'ip-4',
      title: 'Artiste First',
      type: 'Strategic Partnerships',
      status: 'Active',
      logline: 'Consulting with creators on strategy and brand partnerships without compromising their soul.',
      thumbnail: '/assets/image.png',
    },
    {
      id: 'ip-5',
      title: 'Insta Music League',
      type: 'Competition',
      status: 'Archived',
      logline: 'Talent discovery through short-form content.',
      thumbnail: 'assets/IML Logo (1)@3x.png',
      link: 'https://iml.tscacademy.in',
    },
    {
      id: 'ip-6',
      title: 'Havells mYOUsic',
      type: 'Brand Collab',
      status: 'Active',
      logline: 'Creating home music experiences with India\'s leading electrical brand.',
      thumbnail: 'assets/havells logo 2 (2).png',
      link: 'https://havellsmyousic.com',
    },
  ];

  const statusColors: Record<string, string> = {
    'Active': 'bg-sea-foam text-charcoal',
    'In Progress': 'bg-mustard text-charcoal',
    'Planning': 'bg-wine/80 text-cream',
    'Archived': 'bg-slate-400 text-charcoal',
  };

  return (
    <Section
      id="ip-gallery"
      background="cream"
      padding="xl"
      className="relative py-12 sm:py-16 md:py-24"
    >
      <Container className="max-w-6xl px-4 sm:px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 md:mb-16 text-center"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4 sm:mb-6 font-signika">
            IP & Stories
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 font-alan-sans max-w-2xl mx-auto">
            Cultural properties and breakthrough stories created through our ecosystem
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {ipItems.map((item, index) => (
            <motion.a
              key={item.id}
              href={item.link || "#"}
              target={item.link ? "_blank" : undefined}
              rel={item.link ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(183, 75, 2, 0.2)',
              }}
              className="group relative rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden bg-charcoal h-64 sm:h-72 md:h-96 cursor-pointer border-2 border-transparent hover:border-pumpkin transition-all duration-300"
            >
              {/* Image */}
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {/* Type badge */}
                <div className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-pumpkin text-cream text-xs font-bold rounded-full mb-2 sm:mb-3 font-signika">
                  {item.type}
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-cream mb-1 sm:mb-2 font-signika line-clamp-2">
                  {item.title}
                </h3>

                {/* Logline */}
                <p className="text-cream/80 font-alan-sans text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-1">
                  {item.logline}
                </p>

                {/* Status and CTA */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}>
                    {item.status}
                  </span>
                  <motion.span
                    className="text-pumpkin font-bold"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </div>

              {/* Static content (visible always) */}
              <div className="absolute top-0 left-0 right-0 p-6">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[item.status]}`}>
                  {item.status}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const collaborations = document.getElementById('collaborations');
                if (collaborations) {
                  collaborations.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              Build Cultural IP With Us →
            </Button>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
