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
    <section id="artists" className="bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-teal rounded-full blur-3xl"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary-orange rounded-full blur-3xl"
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

      <div className="container relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="content-wrapper"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="section-header">
            <h2 className="heading-font text-section-title text-white section-title">
              Our <span className="text-gradient">Artists</span>
            </h2>
            
            <p className="text-lead text-gray-300 text-wrapper font-light element-spacing-lg">
              Meet the talented artists who bring their stories to life through their 
              <span className="text-gradient font-medium"> incredible work</span>.
            </p>
          </motion.div>

          {/* Featured Artist */}
          {artists.filter(artist => artist.featured).map(artist => (
            <motion.div
              key={artist.id}
              variants={itemVariants}
              className="element-spacing-lg"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 card-lg">
                <div className="grid-2 items-center">
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
                  <div className="space-y-8">
                    <div>
                      <span className="text-secondary-orange font-medium text-small uppercase tracking-wider">
                        Featured Artist
                      </span>
                      <h3 className="heading-font text-card-title font-bold text-white mt-2">
                        {artist.name}
                      </h3>
                      <p className="text-primary-teal text-body font-medium mt-2">
                        {artist.specialty}
                      </p>
                    </div>
                    <p className="text-gray-300 text-body">
                      {artist.story}
                    </p>
                    <motion.button
                      className="btn-primary"
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
            <div className="section-header">
              <h3 className="heading-font text-card-title font-bold text-white section-title">
                More Amazing Artists
              </h3>
            </div>
            
            <div className="grid-3">
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
                  <div className="card">
                    <h4 className="heading-font text-card-subtitle font-semibold text-white element-spacing">
                      {artist.name}
                    </h4>
                    <p className="text-primary-teal text-small font-medium element-spacing">
                      {artist.specialty}
                    </p>
                    <p className="text-gray-300 text-small element-spacing">
                      {artist.story}
                    </p>
                    <motion.button
                      className="text-primary-teal hover:text-light-teal font-medium text-small transition-colors"
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
            className="section-header"
          >
            <h3 className="heading-font text-card-title font-bold text-white section-title element-spacing">
              Join Our Artist Community
            </h3>
            <p className="text-body text-gray-300 text-wrapper element-spacing">
              Ready to showcase your art and share your story? Become part of our growing community of passionate artists 
              and connect with art lovers who appreciate authentic creativity.
            </p>
            <motion.button
              className="px-12 py-5 bg-gradient-to-r from-secondary-orange to-red-500 text-white font-bold text-lg rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 mx-auto"
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
