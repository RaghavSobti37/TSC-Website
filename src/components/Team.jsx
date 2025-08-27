import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const Team = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const teamMembers = [
    {
      id: 1,
      name: "Raghav Raj Sobti",
      role: "Founder & Creative Director",
      bio: "Connecting artists with their audience.",
      image: "/src/assets/option 1.png",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Head of Artist Relations",
      bio: "Supporting artists to share their stories.",
      image: "/src/assets/option 2.png",
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Technology Lead",
      bio: "Building creative infrastructure.",
      image: "/src/assets/option 1.png",
    },
    {
      id: 4,
      name: "Aisha Patel",
      role: "Community Manager",
      bio: "Fostering connections in the community.",
      image: "/src/assets/option 2.png",
    },
    {
      id: 5,
      name: "Priya Singh",
      role: "Design Lead",
      bio: "Crafting beautiful user experiences.",
      image: "/src/assets/option 1.png",
    },
    {
      id: 6,
      name: "Alex Kim",
      role: "Marketing Strategist",
      bio: "Spreading the word about our mission.",
      image: "/src/assets/option 2.png",
    },
  ];

  return (
  <section id="team" className="section-dark py-20 px-4 md:px-0 font-sans">
      <div className="container relative z-10">
        <div className="content-wrapper mx-auto text-center">
          <div className="section-header mb-12">
            <h2 className="heading-font text-section-title text-primary-teal section-title">
              Meet the <span className="text-secondary-orange">Team</span>
            </h2>
            <p className="text-lead text-gray-400 text-wrapper font-light element-spacing-lg">
              The creative minds behind The Shakti Collective.
            </p>
          </div>
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                variants={itemVariants}
                className="card flex flex-col items-center justify-center shadow-lg border-2 border-primary-teal rounded-2xl p-6 bg-white/10 hover:bg-primary-teal/20 cursor-pointer hover:scale-105 transition-transform duration-300 min-h-[260px] max-w-[340px] mx-auto"
                whileHover={{ scale: 1.12, zIndex: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-full mb-2 shadow-lg transition-all duration-300 group-hover:scale-110" />
                <h3 className="text-xl font-bold text-primary-teal mb-1">{member.name}</h3>
                <p className="text-sm text-secondary-orange mb-1">{member.role}</p>
                <p className="text-sm text-gray-200 text-center mb-2">{member.bio}</p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs text-white bg-primary-teal px-3 py-1 rounded-full shadow-lg">More Info</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Team
