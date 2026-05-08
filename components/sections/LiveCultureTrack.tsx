import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

interface Reel {
  id: string;
  artistName: string;
  songTitle: string;
  thumbnail: string;
  spotifyUrl?: string;
  youtubeUrl?: string;
}

/**
 * Live Culture Track
 * Horizontal scrollable reel cards with mock data
 */
export default function LiveCultureTrack() {
  const [hoviredId, setHoveredId] = useState<string | null>(null);

  const mockReels: Reel[] = [
    {
      id: 'reel-1',
      artistName: 'Aarav Singh',
      songTitle: 'Urban Meets Roots',
      thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
      spotifyUrl: '#',
      youtubeUrl: '#',
    },
    {
      id: 'reel-2',
      artistName: 'Priya Devi',
      songTitle: 'Monsoon Dreams',
      thumbnail: 'https://images.unsplash.com/photo-1514567152633-dd10c67f0314?w=500&h=500&fit=crop',
      spotifyUrl: '#',
      youtubeUrl: '#',
    },
    {
      id: 'reel-3',
      artistName: 'The Collective',
      songTitle: 'Untitled Experiment #42',
      thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop',
      spotifyUrl: '#',
      youtubeUrl: '#',
    },
    {
      id: 'reel-4',
      artistName: 'Maya Acoustic',
      songTitle: 'Lullaby for the City',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=500&fit=crop',
      spotifyUrl: '#',
      youtubeUrl: '#',
    },
    {
      id: 'reel-5',
      artistName: 'DJ Rhythm',
      songTitle: 'Electric Dawn',
      thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&h=500&fit=crop',
      spotifyUrl: '#',
      youtubeUrl: '#',
    },
  ];

  return (
    <Section
      id="live-culture"
      background="white"
      padding="xl"
      className="relative py-24 bg-white"
    >
      <Container className="max-w-full px-4 sm:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 font-signika">
            Live Culture Track
          </h2>
          <p className="text-lg text-black/60 font-alan-sans">
            Featured artist releases from our ecosystem
          </p>
        </motion.div>

        {/* Horizontal scrollable track */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {mockReels.map((reel, index) => (
              <motion.a
                key={reel.id}
                href={reel.spotifyUrl || '#'}
                onHoverStart={() => setHoveredId(reel.id)}
                onHoverEnd={() => setHoveredId(null)}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden group cursor-pointer relative snap-center"
              >
                {/* Reel card container */}
                <div className="relative w-full h-full bg-charcoal">
                  {/* Thumbnail image */}
                  <img
                    src={reel.thumbnail}
                    alt={`${reel.artistName} - ${reel.songTitle}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-80" />

                  {/* Play button on hover */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: hoviredId === reel.id ? 1 : 0,
                      scale: hoviredId === reel.id ? 1 : 0.8,
                    }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-orange flex items-center justify-center text-white text-2xl hover:bg-orange/80 transition-all">
                      ▶
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {/* Artist name */}
                    <h3 className="text-xl font-bold text-cream mb-2 font-signika line-clamp-1">
                      {reel.artistName}
                    </h3>

                    {/* Song title */}
                    <p className="text-sm text-cream/80 mb-4 font-alan-sans line-clamp-2">
                      {reel.songTitle}
                    </p>

                    {/* Links */}
                    <div className="flex gap-3">
                      {reel.spotifyUrl && (
                        <a
                          href={reel.spotifyUrl}
                          onClick={(e) => e.preventDefault()}
                          className="w-8 h-8 rounded-full bg-orange/80 hover:bg-orange flex items-center justify-center text-white text-xs font-bold transition-all"
                        >
                          S
                        </a>
                      )}
                      {reel.youtubeUrl && (
                        <a
                          href={reel.youtubeUrl}
                          onClick={(e) => e.preventDefault()}
                          className="w-8 h-8 rounded-full bg-orange/80 hover:bg-orange flex items-center justify-center text-white text-xs font-bold transition-all"
                        >
                          Y
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            viewport={{ once: true }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none"
          >
            <div className="text-orange text-sm font-semibold font-alan-sans">
              ← Scroll →
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <a href="#artists" className="inline-block px-8 py-3 bg-orange text-white rounded-full font-semibold hover:bg-orange/80 transition-all font-signika">
            Discover More Artists →
          </a>
        </motion.div>
      </Container>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </Section>
  );
}
