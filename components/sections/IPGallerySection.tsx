import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

interface IPItem {
  id: string;
  title: string;
  type: string;
  status: string;
  logline: string;
  thumbnail: string;
}

/**
 * IP & Stories Gallery Section
 * Showcase TSC's cultural IP creations
 */
export default function IPGallerySection() {
  const ipItems: IPItem[] = [
    {
      id: 'ip-1',
      title: 'Himalayan Harmonies',
      type: 'Music Series',
      status: 'Active',
      logline: 'Blending traditional folk with modern production',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=600&fit=crop',
    },
    {
      id: 'ip-2',
      title: 'Young Gunns',
      type: 'Content Series',
      status: 'Active',
      logline: 'Stories of emerging artists breaking barriers',
      thumbnail: 'https://images.unsplash.com/photo-1514567152633-dd10c67f0314?w=600&h=600&fit=crop',
    },
    {
      id: 'ip-3',
      title: 'Insta Music League',
      type: 'Competition',
      status: 'In Progress',
      logline: 'Talent discovery through short-form content',
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=600&fit=crop',
    },
    {
      id: 'ip-4',
      title: 'Havells mYOUsic',
      type: 'Brand Collab',
      status: 'Active',
      logline: 'Creating home music experiences',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=600&h=600&fit=crop',
    },
    {
      id: 'ip-5',
      title: 'Motojojo Community',
      type: 'Lifestyle IP',
      status: 'Active',
      logline: 'Urban culture meets two-wheeler community',
      thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&h=600&fit=crop',
    },
    {
      id: 'ip-6',
      title: 'Divine Trance',
      type: 'Music Production',
      status: 'Planning',
      logline: 'Spiritual electronic music exploration',
      thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop',
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
      className="relative py-24"
    >
      <Container className="max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6 font-signika">
            IP & Stories
          </h2>
          <p className="text-lg text-slate-600 font-alan-sans max-w-2xl mx-auto">
            Cultural properties and breakthrough stories created through our ecosystem
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ipItems.map((item, index) => (
            <motion.a
              key={item.id}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 20px 40px rgba(183, 75, 2, 0.2)',
              }}
              className="group relative rounded-2xl overflow-hidden bg-charcoal h-96 cursor-pointer border-2 border-transparent hover:border-pumpkin transition-all duration-300"
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
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {/* Type badge */}
                <div className="inline-block px-3 py-1 bg-pumpkin text-cream text-xs font-bold rounded-full mb-3 font-signika">
                  {item.type}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-cream mb-2 font-signika line-clamp-2">
                  {item.title}
                </h3>

                {/* Logline */}
                <p className="text-cream/80 font-alan-sans text-sm mb-4 line-clamp-1">
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
          <a href="#collaborations" className="inline-block px-8 py-3 bg-pumpkin text-cream rounded-full font-semibold hover:bg-pumpkin-dark transition-all font-signika">
            Build Cultural IP With Us →
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}
