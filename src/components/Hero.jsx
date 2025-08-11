import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Hero = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%'])

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden section-dark">
      {/* Floating Background Orbs */}
      <div className="absolute inset-0 z-0">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`floating-orb absolute ${
              i % 2 === 0 ? 'bg-primary-teal' : 'bg-secondary-orange'
            }`}
            style={{
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Background Video with Enhanced Parallax */}
      <motion.div 
        className="absolute inset-0 z-10 parallax-element"
        style={{ y, scale }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src="/src/assets/dummy video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 gradient-overlay" />
      </motion.div>

      {/* Content with Enhanced Animation */}
      <motion.div 
        className="relative z-20 text-center px-6 max-w-6xl mx-auto parallax-element"
        style={{ opacity, y: textY }}
      >
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ 
            duration: 1.5, 
            delay: 0.2,
            type: "spring",
            stiffness: 100
          }}
          className="mb-12"
        >
          <div className="relative inline-block">
            <img 
              src="/src/assets/only text.png" 
              alt="The Shakti Collective" 
              className="mx-auto max-w-md w-full h-auto drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-teal/20 to-secondary-orange/20 blur-xl animate-pulse" />
          </div>
        </motion.div>

        {/* Main Heading with Staggered Animation */}
        <motion.div className="space-y-4 mb-8">
          <motion.h1
            className="heading-font text-hero text-white leading-tight"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
          >
            Where Stories
          </motion.h1>
          <motion.h1
            className="heading-font text-hero text-gradient leading-tight"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          >
            Become Art
          </motion.h1>
        </motion.div>

        {/* Subtitle with Enhanced Typography */}
        <motion.p
          className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          We are a platform where artists transform their stories into powerful visual narratives. 
          <span className="block mt-2 text-lg opacity-80">
            Every piece of art has a story, and every story deserves to be told.
          </span>
        </motion.p>

        {/* Enhanced CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.7 }}
        >
          <motion.button
            className="btn-primary relative group"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('artists')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }}
          >
            <span className="relative z-10">Explore Our Artists</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-teal to-secondary-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
          </motion.button>
          
          <motion.button
            className="btn-secondary group"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document.getElementById('about')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }}
          >
            <span className="relative z-10">Learn More</span>
            <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
          </motion.button>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
        >
          {[
            { number: "500+", label: "Artists" },
            { number: "1000+", label: "Stories" },
            { number: "50k+", label: "Artworks" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center glass-effect rounded-2xl p-6 hover-lift"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-gray-300 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <motion.div
          className="flex flex-col items-center cursor-pointer group"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }}
          whileHover={{ y: -5 }}
        >
          <span className="text-white text-sm font-medium mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
            Scroll to explore
          </span>
          <motion.div
            className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center group-hover:border-primary-teal transition-colors"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <motion.div
              className="w-1 h-4 bg-white/70 rounded-full mt-3 group-hover:bg-primary-teal transition-colors"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent z-15" />
    </section>
  )
}

export default Hero
