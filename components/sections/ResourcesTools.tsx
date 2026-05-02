import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['All', 'Production', 'Mixing', 'Vocals', 'Business'];

const freeTools = [
  {
    id: 1,
    title: 'Vital Synth',
    category: 'Production',
    description: 'A visual synthesizer. See what you play. Free spectral warping wavetable synth.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop', // Placeholder
  },
  {
    id: 2,
    title: 'Spitfire LABS',
    category: 'Production',
    description: 'An infinite series of free software instruments, made by musicians and sampling experts in London.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070&auto=format&fit=crop', // Placeholder
  },
  {
    id: 3,
    title: 'Valhalla Supermassive',
    category: 'Mixing',
    description: 'Mind-blowing reverbs, delays, and modulation effects. Perfect for creating huge spaces.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?q=80&w=2070&auto=format&fit=crop', // Placeholder
  },
  {
    id: 4,
    title: 'TDR Nova',
    category: 'Mixing',
    description: 'A parallel dynamic equalizer. Appears in the familiar layout of a parametric equalizer, with full dynamics processing.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1516280440502-6c58fb0bfb0f?q=80&w=2070&auto=format&fit=crop', // Placeholder
  },
  {
    id: 5,
    title: 'Vocal Doubler by iZotope',
    category: 'Vocals',
    description: 'A free plug-in designed to enhance your vocal with a natural doubling effect.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1525362081669-2b476bb628c3?q=80&w=1974&auto=format&fit=crop', // Placeholder
  },
  {
    id: 6,
    title: 'Indie Artist Contract Templates',
    category: 'Business',
    description: 'Free split sheet and basic collaboration agreement templates for independent artists.',
    link: '#',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop', // Placeholder
  },
];

export default function ResourcesTools() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = activeCategory === 'All'
    ? freeTools
    : freeTools.filter(tool => tool.category === activeCategory);

  return (
    <section className="py-16 sm:py-24 bg-teal-dark px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pumpkin/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-light/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-pumpkin font-black text-xs uppercase tracking-widest mb-2 font-alan-sans"
          >
            Curated Assets
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-cream font-signika"
          >
            Free Tools & Assets
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-cream-dark/80 max-w-2xl mx-auto mt-4 text-sm sm:text-base"
          >
            A growing directory of the best free resources, plugins, and tools handpicked by our community of creators.
          </motion.p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {categories.map((category, index) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.05 }}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-pumpkin text-cream shadow-[0_0_15px_rgba(183,75,2,0.4)]'
                  : 'bg-teal-primary/50 text-cream-dark/70 hover:bg-teal-primary hover:text-cream'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Tools Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-teal-primary/20 border border-teal-light/30 rounded-2xl overflow-hidden hover:bg-teal-primary/40 transition-colors group flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <div className="absolute inset-0 bg-teal-dark/40 group-hover:bg-teal-dark/20 transition-colors duration-500 z-10"></div>
                  <img
                    src={tool.image}
                    alt={tool.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-teal-dark/80 backdrop-blur-sm text-cream-light text-xs font-bold px-3 py-1 rounded-full border border-teal-light/50">
                      {tool.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-cream mb-2 font-signika group-hover:text-pumpkin transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-cream-dark/70 text-sm leading-relaxed mb-6 flex-1">
                    {tool.description}
                  </p>
                  
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-flex items-center gap-2 text-pumpkin font-semibold text-sm hover:text-cream transition-colors"
                  >
                    <span>Get Resource</span>
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
