import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

const testimonials = [
  {
    name: 'SHRADHA MISHRA',
    role: 'Winner of Saregama 2025',
    text: 'Sandesh Shandilya Sir has been more than a mentor to me. He has been my guiding angel, my godfather, my support, and the reason I walk this musical journey with confidence and gratitude. Through his teachings, I found my voice, my purpose, and the soul of my art.',
    image: '/assets/academy/shradha.jpg',
  },
  {
    name: 'DEEPANK SONI',
    role: 'Singer Songwriter',
    text: "Having seen this course come to life, I can confidently say it's pure gold. No other course approaches music composition the way this one does. Sandesh Sir's method of explanation is truly unique. This course reveals the true philosophy and inner world of creation.",
    image: '/assets/academy/deepank.jpg',
  },
  {
    name: 'VASAV VASHISHT',
    role: 'The Samarpan Collective & Kalakul',
    text: 'Attending a session with Sandesh ji was a very calming and inspiring. Not only will you learn how to craft your imagination and translate into music, but I believe it also helps a musician bring out his/her emotions perfectly in their compositions.',
    image: '/assets/academy/vasav.jpg',
  },
];

export default function AcademyTestimonials() {
  return (
    <Section id="testimonials" background="cream-dark" padding="xl">
      <Container>
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div>
            <div className="text-6xl text-pumpkin/20 font-serif leading-none mb-[-20px] font-bold">&quot;</div>
            <h2 className="text-4xl md:text-5xl font-bold text-teal-dark font-signika">
              Artist Testimonials
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-teal-dark/5 flex flex-col relative"
            >
              <div className="absolute top-8 right-10 text-6xl text-teal-dark/5 font-serif leading-none italic font-bold opacity-10">&quot;</div>
              
              <p className="text-slate-medium font-alan-sans text-sm leading-relaxed mb-10 flex-1 italic relative z-10">
                {t.text}
              </p>

              <div className="flex items-center gap-6 pt-8 border-t border-slate-lightest">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-pumpkin/30 flex-shrink-0">
                  <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-teal-dark font-bold font-signika tracking-tight">{t.name}</h4>
                  <p className="text-xs font-bold text-pumpkin font-alan-sans uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
