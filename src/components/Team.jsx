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
      bio: "Passionate about connecting artists with their audience and building meaningful creative communities.",
      image: "/src/assets/option 1.png",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Head of Artist Relations",
      bio: "Dedicated to supporting artists and helping them share their stories with the world.",
      image: "/src/assets/option 2.png",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Technology Lead",
      bio: "Building the digital infrastructure that powers creative storytelling.",
      image: "/src/assets/option 1.png",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    },
    {
      id: 4,
      name: "Aisha Patel",
      role: "Community Manager",
      bio: "Fostering connections and building a vibrant community of artists and art lovers.",
      image: "/src/assets/option 2.png",
      social: {
        linkedin: "#",
        twitter: "#",
        instagram: "#"
      }
    }
  ]

  return (
  <section id="team" className="section-dark relative overflow-hidden py-16 flex justify-center">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-primary-teal rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-secondary-orange rounded-full blur-2xl" />
      </div>

      <div className="container relative z-10">
    <div className="content-wrapper mx-auto text-center">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="section-header">
            <h2 className="heading-font text-section-title font-bold text-gray-900 section-title">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            
            <p className="text-lead text-gray-600 text-wrapper font-light element-spacing-lg">
              The passionate individuals behind The Shakti Collective, working together to create a platform where 
              <span className="text-gradient font-medium"> art and stories converge</span>.
            </p>
          </motion.div>

          {/* Team Grid */}
          <motion.div variants={itemVariants} className="flex flex-row flex-wrap gap-6 justify-center items-stretch w-full px-2 md:px-0">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                className="group card shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift border border-primary-teal flex flex-col items-center w-full"
                style={{background: 'linear-gradient(135deg, #5fb3a3 0%, #ff5722 100%)'}}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                custom={index}
              >
                <div className="w-full h-32 flex items-center justify-center overflow-hidden mb-2">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-24 h-24 object-cover rounded-full border-2 border-secondary-orange group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="w-full flex flex-col items-center">
                  <h3 className="heading-font text-base font-semibold text-white mb-1" style={{textShadow: '0 0 8px #23232a, 0 0 2px #fff'}}>
                    {member.name}
                  </h3>
                  <p className="font-medium text-xs mb-1" style={{color: '#fff', textShadow: '0 0 4px #23232a'}}>
                    {member.role}
                  </p>
                  <p className="text-white text-xs text-center element-spacing max-h-12 overflow-hidden" style={{textShadow: '0 0 2px #23232a'}}>
                    {member.bio}
                  </p>
                  {/* Social Links */}
                  <div className="flex space-x-2 mb-2">
                    {Object.entries(member.social).map(([platform, url]) => (
                      <motion.a
                        key={platform}
                        href={url}
                        className="w-7 h-7 bg-[#23232a] rounded-full flex items-center justify-center text-primary-teal hover:bg-primary-teal hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {/* ...existing icon code... */}
                        {platform === 'linkedin' && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"/>
                          </svg>
                        )}
                        {platform === 'twitter' && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"/>
                          </svg>
                        )}
                        {platform === 'instagram' && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 5.5a4.5 4.5 0 11-.001 9.001A4.5 4.5 0 0110 5.5zm0 7.5a3 3 0 100-6 3 3 0 000 6zm5.5-7.5a1 1 0 11-2 0 1 1 0 012 0zM10 2c-2.206 0-2.481.009-3.344.048-.861.04-1.45.179-1.966.38a3.963 3.963 0 00-1.429.929 3.963 3.963 0 00-.93 1.43c-.2.515-.339 1.104-.379 1.965C2.009 7.519 2 7.794 2 10s.009 2.481.048 3.344c.04.861.179 1.45.38 1.966.204.552.478 1.021.929 1.429.408.451.877.725 1.43.93.515.2 1.104.339 1.965.379.863.039 1.138.048 3.344.048s2.481-.009 3.344-.048c.861-.04 1.45-.179 1.966-.38a3.963 3.963 0 001.429-.929 3.963 3.963 0 00.93-1.43c.2-.515.339-1.104.379-1.965.039-.863.048-1.138.048-3.344s-.009-2.481-.048-3.344c-.04-.861-.179-1.45-.38-1.966a3.963 3.963 0 00-.929-1.429 3.963 3.963 0 00-1.43-.93c-.515-.2-1.104-.339-1.965-.379C12.481 2.009 12.206 2 10 2zm0 16c-2.157 0-2.421-.009-3.27-.047-.834-.038-1.288-.173-1.59-.288a2.678 2.678 0 01-.976-.633 2.678 2.678 0 01-.633-.976c-.115-.302-.25-.756-.288-1.59C3.209 12.421 3.2 12.157 3.2 10s.009-2.421.047-3.27c.038-.834.173-1.288.288-1.59.14-.362.367-.687.633-.976.289-.266.614-.493.976-.633.302-.115.756-.25 1.59-.288C7.579 3.209 7.843 3.2 10 3.2s2.421.009 3.27.047c.834.038 1.288.173 1.59.288.362.14.687.367.976.633.266.289.493.614.633.976.115.302.25.756.288 1.59.038.849.047 1.113.047 3.27s-.009 2.421-.047 3.27c-.038.834-.173-1.288-.288-1.59a2.678 2.678 0 01-.633-.976 2.678 2.678 0 01-.976-.633c-.302-.115-.756-.25-1.59-.288-.849-.038-1.113-.047-3.27-.047z"/>
                          </svg>
                        )}
                      </motion.a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Join Team CTA */}
          <motion.div
            variants={itemVariants}
            className="section-header"
          >
            <div className="bg-gradient-to-r from-primary-teal to-light-teal rounded-2xl card-lg text-center">
              <h3 className="heading-font text-card-title font-bold text-white section-title">
                Want to Join Our Team?
              </h3>
              <p className="text-white/90 text-body element-spacing text-wrapper">
                We're always looking for passionate individuals who share our vision of empowering artists and celebrating creativity. 
                Join us in building the future of artistic storytelling and make a meaningful impact in the creative community.
              </p>
              <motion.button
                className="px-12 py-5 bg-white text-primary-teal font-bold text-lg rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                View Open Positions
              </motion.button>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Team
