import React from 'react';
import { motion } from 'framer-motion';

interface QuoteLineProps {
  quote: string;
  author?: string;
  bg?: 'cream' | 'dark';
}

/**
 * QuoteLine — Full-width cinematic quote divider
 */
export default function QuoteLine({ quote, author, bg = 'cream' }: QuoteLineProps) {
  const isDark = bg === 'dark';

  return (
    <section
      className={`relative py-14 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden ${
        isDark ? 'bg-charcoal' : 'bg-cream'
      }`}
    >
      {/* Decorative line left */}
      <motion.div
        className={`absolute left-0 top-1/2 -translate-y-1/2 h-px w-1/4 ${
          isDark ? 'bg-gradient-to-r from-transparent to-cream/20' : 'bg-gradient-to-r from-transparent to-charcoal/15'
        }`}
        initial={{ scaleX: 0, originX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true }}
      />
      {/* Decorative line right */}
      <motion.div
        className={`absolute right-0 top-1/2 -translate-y-1/2 h-px w-1/4 ${
          isDark ? 'bg-gradient-to-l from-transparent to-cream/20' : 'bg-gradient-to-l from-transparent to-charcoal/15'
        }`}
        initial={{ scaleX: 0, originX: 1 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        viewport={{ once: true }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className={`text-3xl mb-4 ${isDark ? 'text-pumpkin/40' : 'text-pumpkin/30'}`}
        >
          ❝
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          viewport={{ once: true }}
          className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold font-signika leading-tight italic ${
            isDark ? 'text-cream' : 'text-charcoal'
          }`}
        >
          {quote}
        </motion.p>
        {author && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className={`mt-4 text-sm font-alan-sans uppercase tracking-[0.2em] ${
              isDark ? 'text-cream/40' : 'text-charcoal/40'
            }`}
          >
            — {author}
          </motion.p>
        )}
      </div>
    </section>
  );
}
