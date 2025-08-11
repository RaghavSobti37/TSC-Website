import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const Artists = () => {
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
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Sample artist data - you can replace with real data
  const artists = [
    {
      id: 1,
      name: "Maya Sharma",
      specialty: "Abstract Expressionism",
      story: "Maya's work explores the intersection of traditional Indian art with contemporary emotions.",
      image: "/src/assets/option 1.png",
      featured: true
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

  return (
    <section id="artists" className="py-20 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary-teal)] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--secondary-orange)] rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="heading-font text-4xl md:text-5xl font-bold text-white mb-6">
              Our <span className="text-gradient">Artists</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-teal)] to-[var(--secondary-orange)] mx-auto mb-8" />
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Meet the talented artists who bring their stories to life through their incredible work.
            </p>
          </motion.div>

          {/* Featured Artist */}
          {artists.filter(artist => artist.featured).map(artist => (
            <motion.div
              key={artist.id}
              variants={itemVariants}
              className="mb-20"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-full h-auto rounded-2xl shadow-2xl"
                    />
                  </motion.div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-[var(--secondary-orange)] font-medium text-sm uppercase tracking-wider">
                        Featured Artist
                      </span>
                      <h3 className="heading-font text-3xl md:text-4xl font-bold text-white mt-2">
                        {artist.name}
                      </h3>
                      <p className="text-[var(--primary-teal)] text-lg font-medium mt-2">
                        {artist.specialty}
                      </p>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {artist.story}
                    </p>
                    <motion.button
                      className="px-6 py-3 bg-gradient-to-r from-[var(--primary-teal)] to-[var(--light-teal)] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View Portfolio
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Other Artists Grid */}
          <motion.div variants={itemVariants}>
            <h3 className="heading-font text-2xl md:text-3xl font-bold text-white text-center mb-12">
              More Amazing Artists
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.filter(artist => !artist.featured).map(artist => (
                <motion.div
                  key={artist.id}
                  className="group bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="aspect-w-16 aspect-h-12 overflow-hidden">
                    <img 
                      src={artist.image} 
                      alt={artist.name} 
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h4 className="heading-font text-xl font-semibold text-white mb-2">
                      {artist.name}
                    </h4>
                    <p className="text-[var(--primary-teal)] text-sm font-medium mb-3">
                      {artist.specialty}
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                      {artist.story}
                    </p>
                    <motion.button
                      className="text-[var(--primary-teal)] hover:text-[var(--light-teal)] font-medium text-sm transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      Learn More →
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <motion.button
              className="px-8 py-4 bg-[var(--secondary-orange)] text-white font-semibold rounded-full hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Become an Artist
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Artists
