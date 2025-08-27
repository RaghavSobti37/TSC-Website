import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Artists = () => {
  // Sample artist data - you can replace with real data
  const artists = [
    {
      id: 1,
      name: "Maya Sharma",
      specialty: "Abstract Expressionism",
      story: "Maya's work explores the intersection of traditional Indian art with contemporary emotions.",
      image: "/src/assets/option 1.png",
      featured: false
    },
    {
      id: 2,
      name: "Arjun Patel",
      specialty: "Digital Storytelling",
      story: "Through digital mediums, Arjun creates immersive narratives about urban life.",
      image: "/src/assets/option 2.png",
      featured: false
    },
    {
      id: 3,
      name: "Priya Gupta",
      specialty: "Mixed Media",
      story: "Priya's art combines traditional crafts with modern techniques to tell stories of resilience.",
      image: "/src/assets/option 1.png",
      featured: false
    },
    {
      id: 4,
      name: "Karan Singh",
      specialty: "Photography & Visual Arts",
      story: "Karan captures untold stories through his lens, focusing on social narratives.",
      image: "/src/assets/option 2.png",
      featured: false
    }
  ]

  const [hovered, setHovered] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);


  // 8 discs for the shelf effect
  const discs = Array.from({ length: 8 }, (_, i) => artists[i % artists.length]);
  const discGap = -50; // px
  const discSize = 180; // px
  const shelfWidth = discs.length * (discSize + discGap);


  // Track which disc is hovered
  const [hoveredDisc, setHoveredDisc] = useState(null);

  return (
  <section id="artists" className="relative flex flex-col items-center justify-center min-h-[600px] py-32 bg-gradient-to-br from-[#18181b] to-[#23232a]">
      <div className="section-header mb-12">
        <h2 className="heading-font text-section-title text-white section-title">
          Our <span className="text-gradient">Artists</span>
        </h2>
        <p className="text-lead text-gray-300 text-wrapper font-light element-spacing-lg">
          Meet the talented artists who bring their stories to life through their <span className="text-gradient font-medium">incredible work</span>.
        </p>
      </div>
      {/* Scroll right animation and navigation guideline */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-primary-teal relative">
        <div className="absolute left-4 top-2 flex items-center z-20">
          <div className="scroll-right-anim mr-2">
            <motion.div initial={{x: 0, opacity: 1}} animate={{x: 32, opacity: 0}} transition={{repeat: Infinity, duration: 1.2}} style={{width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)'}}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 8H12M12 8L8 4M12 8L8 12" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </motion.div>
          </div>
          <span className="text-white text-xs font-medium opacity-80">Scroll right to explore more artists</span>
        </div>
        <div
          className="relative flex items-center justify-start mx-auto"
          style={{
            minWidth: shelfWidth,
            height: discSize * 1.2,
            perspective: 1200,
            transformStyle: 'preserve-3d',
          }}
        >
          {discs.map((artist, i) => {
            const x = i * (discSize + discGap);
            return (
              <motion.div
                key={i}
                className="cursor-pointer group"
                style={{
                  position: 'absolute',
                  left: x,
                  top: '50%',
                  width: discSize,
                  height: discSize,
                  borderRadius: '50%',
                  boxShadow: hoveredDisc === i ? '0 8px 32px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.12)',
                  background: 'rgba(20,20,20,0.95)',
                  border: `2px solid ${hoveredDisc === i ? '#5fb3a3' : 'rgba(255,255,255,0.12)'}`,
                  zIndex: hoveredDisc === i ? 2 : 1,
                  transition: 'box-shadow 0.3s, border 0.3s, transform 0.5s cubic-bezier(.25,.8,.25,1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transform: `translateY(-50%)${hoveredDisc === i ? ' translateZ(90px) scale(1.2)' : ''}`
                }}
                onMouseEnter={() => setHoveredDisc(i)}
                onMouseLeave={() => setHoveredDisc(null)}
                onClick={() => setSelectedArtist(artist)}
              >
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-full object-cover rounded-full border-2 border-white/30 group-hover:border-primary-teal transition-all duration-300"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: discSize * 0.18,
                      height: discSize * 0.18,
                      background: '#18181b',
                      border: '3px solid #333',
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%)',
                      boxShadow: '0 0 8px 2px rgba(0,0,0,0.25) inset',
                      zIndex: 2,
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <motion.div
                  className="absolute left-1/2 bottom-0 w-auto px-4 bg-black/70 text-white text-xs text-center py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    transform: 'translateX(-50%)',
                    pointerEvents: 'none',
                    minWidth: '60%',
                    maxWidth: '90%',
                  }}
                >
                  {artist.name}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal for artist details */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtist(null)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
              initial={{ scale: 0.8, y: 80, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 80, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-primary-teal text-2xl font-bold"
                onClick={() => setSelectedArtist(null)}
                aria-label="Close"
              >
                &times;
              </button>
              <img
                src={selectedArtist.image}
                alt={selectedArtist.name}
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 border-4 border-primary-teal"
              />
              <h3 className="heading-font text-xl font-bold text-primary-teal mb-2 text-center">
                {selectedArtist.name}
              </h3>
              <p className="text-gray-700 text-center mb-2 font-medium">{selectedArtist.specialty}</p>
              <p className="text-gray-600 text-center mb-4">{selectedArtist.story}</p>
              <button className="btn-primary w-full mt-2">View Portfolio</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default Artists
