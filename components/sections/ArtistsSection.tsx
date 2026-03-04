import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

interface Artist {
  id: string;
  name: string;
  roles: string[];
  bio: string;
  image: string;
  segment: string;
}

interface ArtistCategory {
  id: string;
  title: string;
  description: string;
  artists: Artist[];
  color: string;
}

/**
 * Artists Section
 * Community showcase with artist avatars and hover cards
 */
export default function ArtistsSection() {
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);

  const categories: ArtistCategory[] = [
    {
      id: 'collective',
      title: 'Artist Collective',
      description: 'The core group of multidisciplinary creators',
      color: 'pumpkin',
      artists: [
        {
          id: 'artist-1',
          name: 'Aarav Singh',
          roles: ['Music Producer', 'Songwriter'],
          bio: 'Urban music innovator blending tradition with technology',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          segment: 'tsc-records',
        },
        {
          id: 'artist-2',
          name: 'Priya Devi',
          roles: ['Director', 'Cinematographer'],
          bio: 'Visual storyteller capturing cultural narratives',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
          segment: 'tsc-films',
        },
        {
          id: 'artist-3',
          name: 'Dev Sharma',
          roles: ['Animator', 'Game Designer'],
          bio: 'Interactive media artist exploring digital artistry',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          segment: 'tsc-digital',
        },
        {
          id: 'artist-4',
          name: 'Maya Acoustic',
          roles: ['Singer', 'Composer'],
          bio: 'Classical roots, contemporary voice',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          segment: 'tsc-musicals',
        },
        {
          id: 'artist-5',
          name: 'Ravi Patel',
          roles: ['Painter', 'Installation Artist'],
          bio: 'Contemporary artist exploring cultural identity',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          segment: 'tsc-artists',
        },
        {
          id: 'artist-6',
          name: 'Zara Khan',
          roles: ['DJ', 'Music Producer'],
          bio: 'Electronic music pioneer with global reach',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          segment: 'tsc-records',
        },
      ],
    },
    {
      id: 'visual-creators',
      title: 'Visual Creators',
      description: 'Photographers, designers, and digital artists',
      color: 'wine',
      artists: [
        {
          id: 'artist-7',
          name: 'Ananya Gupta',
          roles: ['Photographer'],
          bio: 'Documentary photographer showcasing stories',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          segment: 'tsc-stories',
        },
        {
          id: 'artist-8',
          name: 'Vikram Das',
          roles: ['Graphic Designer', 'UX Designer'],
          bio: 'Visual designer with cultural sensibility',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          segment: 'tsc-digital',
        },
        {
          id: 'artist-9',
          name: 'Sneha Reddy',
          roles: ['Illustrator', 'Concept Artist'],
          bio: 'Digital artist creating immersive worlds',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          segment: 'tsc-artists',
        },
        {
          id: 'artist-10',
          name: 'Arjun Nair',
          roles: ['3D Artist', 'Motion Designer'],
          bio: 'Creating motion graphics and 3D experiences',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
          segment: 'tsc-films',
        },
      ],
    },
    {
      id: 'cultural-leaders',
      title: 'Cultural Leaders',
      description: 'Mentors and thought leaders shaping the ecosystem',
      color: 'sea-foam',
      artists: [
        {
          id: 'artist-11',
          name: 'Dr. Rajesh Verma',
          roles: ['Mentor', 'Music Theorist'],
          bio: 'Guiding next generation of artists',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
          segment: 'tsc-academy',
        },
        {
          id: 'artist-12',
          name: 'Kavya Singh',
          roles: ['Producer', 'Cultural Strategist'],
          bio: 'Building bridges between tradition and innovation',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
          segment: 'tsc-stories',
        },
      ],
    },
  ];

  return (
    <Section
      id="artists"
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
            Our Artist Community
          </h2>
          <p className="text-lg text-slate-600 font-alan-sans max-w-2xl mx-auto">
            Meet the talented creators across our ecosystem
          </p>
        </motion.div>

        {/* Categories */}
        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.15, duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            {/* Category heading */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-charcoal mb-2 font-signika">
                {category.title}
              </h3>
              <p className="text-slate-600 font-alan-sans">
                {category.description}
              </p>
            </div>

            {/* Artist grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {category.artists.map((artist) => (
                <motion.button
                  key={artist.id}
                  onHoverStart={() => setHoveredArtistId(artist.id)}
                  onHoverEnd={() => setHoveredArtistId(null)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  viewport={{ once: true }}
                  className="relative group text-left"
                >
                  {/* Avatar circle */}
                  <div className={`w-full aspect-square rounded-full overflow-hidden border-4 border-${category.color} group-hover:border-${category.color} group-hover:shadow-lg transition-all duration-300`}>
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Hover card */}
                  <AnimatePresence>
                    {hoveredArtistId === artist.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-b from-charcoal/80 to-charcoal flex flex-col items-center justify-center p-4 z-10"
                      >
                        <h4 className="text-cream font-bold text-sm text-center mb-1 font-signika line-clamp-2">
                          {artist.name}
                        </h4>
                        <p className="text-xs text-cream/80 text-center mb-2 font-alan-sans line-clamp-1">
                          {artist.roles[0]}
                        </p>
                        <p className="text-xs text-cream/70 text-center line-clamp-2 font-alan-sans">
                          {artist.bio}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Name below avatar */}
                  <div className="mt-3">
                    <p className="font-semibold text-charcoal text-sm font-signika text-center line-clamp-2">
                      {artist.name}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Main Bhi Artist CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-pumpkin to-wine rounded-2xl p-12 text-center text-cream"
        >
          <h3 className="text-3xl font-bold mb-4 font-signika">
            Main Bhi Artist
          </h3>
          <p className="text-lg mb-8 font-alan-sans opacity-90">
            Join our global artist community and be part of the movement
          </p>
          <a href="#contact" className="inline-block px-8 py-3 bg-cream text-pumpkin rounded-full font-semibold hover:bg-cream/90 transition-all font-signika">
            Join the Community →
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}
