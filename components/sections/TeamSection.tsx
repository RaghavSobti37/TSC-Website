'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaInstagram } from 'react-icons/fa';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description: React.ReactNode;
  philosophy?: string;
  accomplishments: React.ReactNode[];
  socials: {
    linkedin?: string;
    instagram?: string;
  };
}

/**
 * Team Section - The founding team of The Shakti Collective
 * Click-to-expand cards with real team member data
 */
export default function TeamSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 'rohit-sobti',
      name: 'Rohit Sobti',
      role: 'Curator and Co-founder',
      image: '/assets/rohit.png',
      description: (
        <>
          Rohit Sobti is a <strong>visionary music and entertainment strategist</strong>,{' '}
          <strong>Co-Founder of The Shakti Collective</strong>, and a{' '}
          <strong>Harvard Business School (BEMS) and IIM Bangalore alumnus</strong>. With{' '}
          <strong>27+ years of experience</strong>, he has been at the forefront of{' '}
          <strong>creating and monetizing intellectual property</strong> across music, films, and
          brand ecosystems, architecting monetization strategies for catalogs totaling over XX
          streams.
        </>
      ),
      philosophy:
        '"Through The Shakti Collective and Artiste First, he continues to build scalable IPs and sustainable music businesses where creativity and commerce thrive together."',
      accomplishments: [
        <>
          A former <strong>Vice President at Yash Raj Films</strong> and a leader at global giants
          like <strong>Sony Music and Universal Music India</strong>, Rohit brings a rare blend of
          Ivy League business strategy and deep creative intuition.
        </>,
        <>
          His expertise in <strong>Intellectual Property Rights (IPR)</strong> and non-theatrical
          monetization has made him a pivotal figure in taking Indian music to a global stage.
        </>,
        <>
          His career is defined by building sustainable foundations for the industry, from leading
          strategy for massive IPs like <strong>Mahavatar Narsimha</strong> to scaling the music
          labels of India's most iconic artists, including Arijit Singh, Amit Trivedi, and Vishal
          Bhardwaj.
        </>,
        <>
          Today, Rohit is dedicated to professionalizing the <strong>creator economy</strong> and
          building new models of collaboration.
        </>,
      ],
      socials: {
        linkedin: 'https://www.linkedin.com/in/rohitsobti/',
        instagram:
          'https://www.instagram.com/rohitsobti1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      },
    },
    {
      id: 'sandesh-shandaliya',
      name: 'Sandesh Shandaliya',
      role: 'Music Composer and Co-founder',
      image: '/assets/sandesh.jpg',
      description: (
        <>
          An acclaimed <strong>music director</strong>, recognised for{' '}
          <strong>50+ films, 30+ years in the Industry</strong>, a{' '}
          <strong>Filmfare nomination</strong> &amp; <strong>7Bn+ streams</strong> across platforms.
          Creator of iconic songs like <strong>Aaoge Jab Tum, Piya Basanti</strong> &amp; many more.
          Made generation-defining music with ace directors for multiple Bollywood Blockbusters.
        </>
      ),
      accomplishments: [
        <>
          Iconic songs like <strong>&quot;Piya Basanti&quot;</strong>,{' '}
          <strong>&quot;Aaoge Jab Tum&quot;</strong>,{' '}
          <strong>&quot;Suraj Hua Maddham&quot;</strong>, and from the movie{' '}
          <strong>&quot;Chameli&quot;</strong>.
        </>,
        <>
          Recognised for <strong>50+ films</strong> and <strong>30+ years</strong> in the industry.
        </>,
        <>
          Garnered over <strong>7 billion streams</strong> across platforms.
        </>,
        <>
          Received a <strong>Filmfare nomination</strong> for his work.
        </>,
      ],
      socials: {
        instagram:
          'https://www.instagram.com/sandeshshandilya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      },
    },
  ];

  return (
    <section id="team" className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <p className="text-orange font-black text-xs uppercase tracking-widest mb-2 font-alan-sans">
            WHO MADE IT
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black font-signika">
            Meet the Team
          </h2>
        </motion.div>

        {/* Team Cards */}
        <div className="space-y-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              layoutId={`team-card-${member.id}`}
              onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
              className="cursor-pointer"
              layout
            >
              <AnimatePresence mode="wait">
                {expandedId === member.id ? (
                  /* -- Expanded State -- */
                  <motion.div
                    key={`expanded-${member.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.36 }}
                    className="rounded-2xl overflow-hidden bg-white shadow-2xl border border-black/5"
                  >
                    <div className="flex flex-col sm:flex-row gap-6 p-6 sm:p-8">
                      {/* Text Content */}
                      <div className="flex-1 order-2 sm:order-1">
                        <h3 className="text-2xl sm:text-3xl font-bold text-black mb-1 font-signika">
                          {member.name}
                        </h3>
                        <p className="text-orange font-bold text-sm mb-4 font-alan-sans uppercase tracking-wide">
                          {member.role}
                        </p>
                        <p className="text-sm sm:text-base text-black/80 mb-4 font-alan-sans leading-relaxed">
                          {member.description}
                        </p>
                        {member.philosophy && (
                          <p className="text-sm italic text-orange mb-5 font-semibold font-alan-sans border-l-4 border-orange/40 pl-4">
                            {member.philosophy}
                          </p>
                        )}
                        <h4 className="text-xs font-black uppercase tracking-wider mb-3 text-charcoal font-signika">
                          Selected Works &amp; Highlights
                        </h4>
                        <ul className="text-sm space-y-2 mb-5 font-alan-sans text-charcoal/80">
                          {member.accomplishments.map((a, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-pumpkin mt-0.5 flex-shrink-0">▸</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                        {/* Social Links */}
                        <div className="flex gap-3 flex-wrap">
                          {member.socials.linkedin && (
                            <a
                              href={member.socials.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-charcoal text-cream rounded-lg text-xs font-bold hover:bg-charcoal/80 transition-colors font-alan-sans whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaLinkedin size={14} />
                              LinkedIn
                            </a>
                          )}
                          {member.socials.instagram && (
                            <a
                              href={member.socials.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-pumpkin text-cream rounded-lg text-xs font-bold hover:bg-pumpkin/80 transition-colors font-alan-sans whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FaInstagram size={14} />
                              Instagram
                            </a>
                          )}
                        </div>
                      </div>
                      {/* Image */}
                      <div className="relative w-full sm:w-52 h-64 sm:h-72 flex-shrink-0 rounded-xl overflow-hidden order-1 sm:order-2 ring-2 ring-pumpkin/20">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* -- Collapsed State -- */
                  <motion.div
                    key={`collapsed-${member.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center bg-white rounded-2xl overflow-hidden shadow-lg p-5 sm:p-6 group/card hover:shadow-xl hover:border-pumpkin/30 border-2 border-transparent transition-all duration-300"
                  >
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-bold text-black mb-1 font-signika">
                        {member.name}
                      </h3>
                      <p className="text-orange font-bold text-xs sm:text-sm mb-2 font-alan-sans uppercase tracking-wide">
                        {member.role}
                      </p>
                      <p className="text-sm text-black/60 line-clamp-2 font-alan-sans">
                        {member.description}
                      </p>
                      <p className="text-xs text-orange font-bold mt-3 cursor-pointer font-alan-sans group-hover/card:translate-x-1 transition-transform duration-300">
                        Click to see more →
                      </p>
                    </div>
                    <div className="relative w-40 h-48 sm:w-48 sm:h-56 flex-shrink-0 rounded-xl overflow-hidden ring-2 ring-charcoal/10">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-charcoal/40 text-xs uppercase tracking-wider font-bold font-alan-sans"
        >
          Click on any card to see achievements
        </motion.div>
      </div>
    </section>
  );
}
