import Image from "next/legacy/image"
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const teamMembers = [
  {
    id: 1,
    name: 'Rohith Sobti',
    role: 'Co-founder and CEO',
    image: '/assets/rohit.png',
    description: 'Rohith is the visionary force behind The Shakti Collective—a creative leader driven by the belief that art can reshape culture. His journey started with a radical idea: what if we built a space where marginalized voices weren\'t just heard, but celebrated as the heartbeat of our work?',
    philosophy: '"If your art doesn\'t move you, it won\'t move anyone else."',
    accomplishments: [
      'Founded The Shakti Collective to amplify marginalized voices in music and culture',
      'Strategic vision for Mahavatar Narsimha\'s cultural impact and marketing approach',
      'Building communities that thrive on authenticity, not algorithms',
      'Creating pathways for artists who\'ve been overlooked by mainstream systems'
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/rohitsobti/',
      instagram: 'https://www.instagram.com/rohitsobti1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    },
  },
  {
    id: 2,
    name: 'Sandesh Shandaliya',
    role: 'Co-founder and Mentor',
    image: '/assets/sandesh.jpg',
    description: 'Sandesh carries decades of music and cultural wisdom. He\'s the keeper of tradition who pushes boundaries—someone who understands that honoring the past and creating the future aren\'t opposing forces. His mentorship anchors our work in authenticity.',
    philosophy: '"Music is a dialogue between generations. We\'re just listening and responding."',
    accomplishments: [
      'Decades of music composition expertise and cultural curation',
      'Mentored generations of emerging artists with integrity and rigor',
      'Strategic visionary guiding TSC\'s cultural direction and values',
      'Bridge between tradition and innovation in Indian music landscape'
    ],
    socials: {
      instagram: 'https://www.instagram.com/sandeshshandilya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    },
  },
  {
    id: 4,
    name: 'Deepank Soni',
    role: 'G.O.A.T (Master of Motion)',
    image: '/assets/deepank.jpg',
    description: 'Deepank is our master of motion—an artist who understands that every frame, every second of movement carries intention. He doesn\'t just animate; he translates emotion into visual language that pierces the soul.',
    philosophy: '"Motion is meaning. Every pixel deserves purpose."',
    accomplishments: [
      'Expert in translating cultural narratives into compelling visual experiences',
      'Strategic marketing minds behind viral campaigns that sparked conversations',
      'Master of motion graphics that bridge art and commerce authentically',
      'Collaborative force in bringing ambitious creative visions to life'
    ],
    socials: {
      linkedin: 'https://www.linkedin.com/in/deepank-soni-bab014243/',
      instagram: 'https://www.instagram.com/deepank_soni_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    },
  },
  {
    id: 3,
    name: 'Laksh Maheshwari',
    role: 'Master Storyteller',
    image: '/assets/laksh.jpg',
    description: 'Laksh weaves narratives that stay with people long after they\'re told. He\'s the voice that captures what others feel but can\'t articulate—turning personal struggles into universal stories that build bridges between cultures.',
    philosophy: '"Every story is a seed. Plant it in the right soil and it transforms worlds."',
    accomplishments: [
      'Crafted compelling narratives across music, film, and cultural projects',
      'Cultural strategist who builds authentic connections between art and audiences',
      'Master of finding truth in stories others overlook',
      'Created pathways for marginalized voices through authentic storytelling'
    ],
    socials: {
      instagram : "https://www.instagram.com/single.handedly?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
    },
  },
]

export default function Team() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <section id="team" className="py-20 px-6 bg-cream">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-pumpkin font-black text-xs uppercase tracking-widest mb-2">WHO MADE IT</p>
          <h2 className="heading-font text-5xl md:text-6xl font-black text-wine mb-4">MEET THE TEAM</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              layoutId={`card-${member.id}`}
              onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
              className={`group cursor-pointer transition-all duration-500 ${expandedId === member.id ? 'md:col-span-2 lg:col-span-2 md:row-span-2' : ''}`}
              layout
            >
              <AnimatePresence mode="wait">
                {expandedId === member.id ? (
                  <motion.div
                    key={`expanded-${member.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.36 }}
                    className="rounded-2xl overflow-hidden bg-gradient-to-b from-transparent via-chestnut/60 to-wine/80 shadow-2xl"
                  >
                    <div className="relative h-56 w-full">
                      <Image src={member.image} alt={member.name} layout="fill" objectFit="cover" />
                      <div className="absolute inset-0 bg-black/35 flex items-end p-4">
                        <div>
                          <h3 className="text-2xl font-black text-cream">{member.name}</h3>
                          <p className="text-cream/90 text-sm">{member.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-chestnut/10">
                      <p className="text-sm text-wine/90 mb-3">{member.description}</p>
                      {member.philosophy && (
                        <p className="text-sm italic text-pumpkin mb-4 font-semibold">{member.philosophy}</p>
                      )}
                      <h4 className="text-xs font-black uppercase tracking-wider mb-2">Selected Works</h4>
                      <ul className="text-sm space-y-1">
                        {member.accomplishments.map((a,i)=>(<li key={i}> {a}</li>))}
                      </ul>
                      <div className="flex gap-3 mt-4">
                        {member.socials.instagram && <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-pumpkin rounded text-cream text-xs" onClick={e=>e.stopPropagation()}>View Profile</a>}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`collapsed-${member.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-80 rounded-2xl overflow-hidden group/card cursor-pointer"
                  >
                    <Image 
                      src={member.image} 
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover/card:scale-110 transition-transform duration-500"
                    />
                    <motion.div
                      initial={{ opacity: 0.6 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-pumpkin via-wine/40 to-transparent"
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 flex flex-col justify-end p-6"
                    >
                      <h3 className="text-2xl font-black text-cream mb-1">{member.name}</h3>
                      <p className="text-cream/90 font-bold text-sm">{member.role}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute top-4 right-4 bg-cream/20 hover:bg-cream/40 rounded-full p-2 transition-colors"
                    >
                      <span className="text-cream text-xs font-black">+</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12 text-wine/60 text-xs uppercase tracking-wider font-bold">
          Click on any card to see achievements
        </div>
      </div>
    </section>
  )
}
