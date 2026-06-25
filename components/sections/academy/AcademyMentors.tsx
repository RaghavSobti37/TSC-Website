import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, PenLine } from 'lucide-react';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

const featuredMentors = [
  {
    name: 'Sandesh Shandilya',
    role: 'Acclaimed Film Composer & Music Director',
    bio: 'An acclaimed music director, recognized for 50+ films, 30+ years in the Industry, a Filmfare nomination & 7Bn+ streams. Creator of iconic songs like Aaoge Jab Tum, Piya Basanti & many more.',
    image: '/assets/academy/sandesh.jpg',
    logos: [
      '/assets/academy/aaoge-jab-tum.jpg',
      '/assets/academy/k3g.jpg',
      '/assets/academy/piya-basanti.jpg',
      '/assets/academy/chameli.jpg'
    ]
  },
  {
    name: 'Prasad Khaparde',
    role: 'Legendary Hindustani Classical Vocalist',
    bio: 'Renowned Hindustani classical vocalist of international repute with over 30 years of illustrious career. A master of the Rampur Sahaswan gharana, trained under Padma Bhushan Ustad Rashid Khan Sahab.',
    image: '/assets/academy/prasadji.jpg',
    logos: [
      '/assets/academy/ustad_rashid_khan.jpg',
      '/assets/academy/coke-studio.png',
      '/assets/academy/iccr.jpeg',
      '/assets/academy/kala.jpg'
    ]
  },
  {
    name: 'Rohit Sobti',
    role: 'Ex VP at Yashraj Films | Artists Curator',
    bio: '27+ years of creating & monetizing intellectual property across Entertainment, Music & Brand Licensing. Managed music labels for legends like Arijit Singh, Vishal Bhardwaj, and Amit Trivedi.',
    image: '/assets/academy/rohit.png',
    logos: [
      '/assets/academy/yrf.png.png',
      '/assets/academy/sony.jpg',
      '/assets/academy/universal-music-group-n-v--600.png',
      '/assets/academy/bmg.jpg'
    ]
  }
];

const mentorSessions = [
  {
    name: 'Luca Petracca',
    role: 'Music Producer & Film Composer',
    desc: 'Master the end-to-end process of producing professional music for your songs. From recording and arrangement to mixing and mastering, Luca Petracca guides you through DAW training, orchestration, and film music production for singer-songwriters.',
    image: '/assets/academy/luca.jpg',
    icon: <Headphones className="w-10 h-10 text-wine" />,
  },
  {
    name: 'Geet Sagar',
    role: 'Singer, Lyricist & X Factor India Winner',
    desc: 'Learn the art of singing and songwriting from the winner of X Factor India. Geet Sagar shares 20+ years of experience as a singer, lyricist, and RJ to help you find your unique voice and craft songs that stand out in the mainstream.',
    image: '/assets/academy/geetsagar.jpg',
    icon: <PenLine className="w-10 h-10 text-wine" />,
  },
];

export default function AcademyMentors() {
  return (
    <Section id="mentors" background="cream" padding="xl">
      <Container>
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-charcoal font-signika mb-6"
          >
            Our Mentors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-medium font-alan-sans max-w-2xl mx-auto leading-relaxed"
          >
            We define international standards. Our mentors are only the best artists in the world
            with proven craft and impeccable track records.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          {featuredMentors.map((mentor, index) => (
            <motion.article
              key={mentor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white p-8 rounded-3xl border border-slate-lightest shadow-lg hover:shadow-2xl transition-all duration-400 group"
            >
              <h3 className="text-2xl font-bold text-charcoal font-signika mb-1">{mentor.name}</h3>
              <p className="text-sm font-bold text-mustard font-alan-sans mb-6 uppercase tracking-wider">{mentor.role}</p>

              <div className="h-80 overflow-hidden rounded-2xl mb-8">
                <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover transition-all duration-700" />
              </div>

              <p className="text-slate-medium font-alan-sans text-base leading-relaxed mb-8 h-24 overflow-hidden line-clamp-4">
                {mentor.bio}
              </p>

              <div className="grid grid-cols-4 gap-3">
                {mentor.logos.map((logo, i) => (
                  <div key={i} className="aspect-square rounded-lg bg-cream flex items-center justify-center p-2 border border-slate-lightest transition-all">
                    <img src={logo} alt="Work" className="max-w-full max-h-full object-contain" />
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-charcoal font-signika mb-4">Mentor Sessions</h3>
          <p className="text-lg text-slate-medium font-alan-sans">Upcoming courses with industry experts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {mentorSessions.map((mentor, index) => (
            <motion.article
              key={mentor.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-lightest shadow-lg text-left"
            >
              <div className="h-56 overflow-hidden rounded-2xl mb-6 relative">
                <img src={mentor.image} alt={mentor.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-mustard text-charcoal text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Revealing Soon
                </div>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="opacity-80">{mentor.icon}</div>
                <div>
                  <h4 className="text-xl font-bold text-charcoal font-signika">{mentor.name}</h4>
                  <p className="text-sm font-bold text-mustard font-alan-sans uppercase tracking-wider">{mentor.role}</p>
                </div>
              </div>
              <p className="text-base text-slate-medium font-alan-sans leading-relaxed">{mentor.desc}</p>
            </motion.article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
