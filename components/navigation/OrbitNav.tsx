import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface OrbitNavProps {
  activeSection?: string;
}

/**
 * Orbit Navigation
 * Frosted glass pill at bottom-center with expandable menu
 */
export default function OrbitNav({ activeSection }: OrbitNavProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const pillars = [
    {
      name: 'Discover',
      items: [
        { label: 'IP & Stories', sectionId: 'ip-gallery' },
        { label: 'Academia', sectionId: 'academy' },
        { label: 'About', href: '#' },
      ],
    },
    {
      name: 'Create',
      items: [
        { label: 'Academy', sectionId: 'academy' },
        { label: 'Collaborations', sectionId: 'collaborations' },
        { label: 'Creation Spaces', href: '#' },
      ],
    },
    {
      name: 'Connect',
      items: [
        { label: 'Artists', sectionId: 'artists' },
        { label: 'Collaborations', sectionId: 'collaborations' },
        { label: 'Contact', sectionId: 'contact' },
      ],
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Orbit Nav */}
      <motion.nav
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {/* Main pill container */}
        <motion.div
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          className="relative"
        >
          {/* Background frosted glass pill */}
          <motion.div
            animate={{
              width: isExpanded ? 'auto' : '280px',
              height: isExpanded ? 'auto' : '56px',
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-full px-6 py-3 shadow-2xl"
          >
            {/* Pill content */}
            <div className="flex items-center justify-between h-full">
              {/* Logo / Home link */}
              <button
                onClick={() => scrollToSection('hero')}
                className="text-cream font-bold font-signika text-lg flex-shrink-0 hover:text-pumpkin transition-colors"
              >
                TSC
              </button>

              {/* Main nav items - visible when expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-8 ml-6 flex-wrap"
                  >
                    {pillars.map((pillar) => (
                      <motion.div
                        key={pillar.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="group relative"
                      >
                        <button className="text-cream font-semibold font-signika hover:text-pumpkin transition-colors text-sm">
                          {pillar.name}
                        </button>

                        {/* Dropdown menu */}
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute top-full mt-2 left-0 bg-charcoal/95 backdrop-blur border border-cream/20 rounded-xl py-2 whitespace-nowrap hidden group-hover:block shadow-xl"
                        >
                          {pillar.items.map((item) => (
                            <button
                              key={item.label}
                              onClick={() =>
                                item.sectionId ? scrollToSection(item.sectionId) : null
                              }
                              className="w-full text-left px-4 py-2 text-cream/80 text-sm hover:text-cream hover:bg-pumpkin/20 transition-colors font-alan-sans"
                            >
                              {item.label}
                            </button>
                          ))}
                        </motion.div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Buttons - visible when expanded */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-3 ml-6 flex-shrink-0"
                  >
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => scrollToSection('contact')}
                      className="px-4 py-2 bg-pumpkin text-cream rounded-full font-semibold text-xs hover:bg-pumpkin-dark transition-all font-signika whitespace-nowrap"
                    >
                      Join
                    </motion.button>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => scrollToSection('collaborations')}
                      className="px-4 py-2 border border-cream/50 text-cream rounded-full font-semibold text-xs hover:border-cream hover:bg-cream/10 transition-all font-signika whitespace-nowrap"
                    >
                      Partner
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Scroll indicator dots */}
          {!isExpanded && (
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {['hero', 'ecosystem', 'ip-gallery', 'contact'].map((sectionId, i) => (
                <motion.div
                  key={sectionId}
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeSection === sectionId ? 'bg-pumpkin' : 'bg-cream/40'
                  }`}
                  animate={{
                    scale: activeSection === sectionId ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.nav>

      {/* Mobile menu toggle (hidden on desktop) */}
      <motion.button
        className="lg:hidden fixed bottom-8 right-8 z-50 w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-cream font-bold text-xl">☰</span>
      </motion.button>
    </>
  );
}
