import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Hero = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video/Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/src/assets/dummy video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8"
        >
          <img 
            src="/src/assets/only text.png" 
            alt="The Shakti Collective" 
            className="mx-auto max-w-md w-full h-auto"
          />
        </motion.div>

        <motion.h1
          className="heading-font text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Where Stories Become
          <span className="block text-gradient">Art</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          We are a platform where artists transform their stories into powerful visual narratives. 
          Every piece of art has a story, and every story deserves to be told.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <motion.button
            className="px-8 py-4 bg-[var(--primary-teal)] text-white font-semibold rounded-full hover:bg-[var(--light-teal)] transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('artists').scrollIntoView({ behavior: 'smooth' })}
          >
            Explore Our Artists
          </motion.button>
          
          <motion.button
            className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
