import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Hero = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%'])

  return (
    <section id="hero" className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-black" style={{marginTop: '4.5rem'}}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex flex-col items-center justify-center"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto object-contain"
          style={{
            width: '100%',
            maxWidth: '100vw',
            height: 'auto',
            maxHeight: '80vh',
            objectFit: 'contain',
            background: 'black',
            display: 'block',
            borderRadius: '2vw',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
          }}
        >
          <source src="/src/assets/hero video TSC.mp4" type="video/mp4" />
        </video>
      
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 z-10" style={{ marginTop: '2vw' }}>
          <button
            className="btn-secondary group text-white font-semibold px-8 py-4 rounded-full shadow-lg"
            onClick={() => {
              document.getElementById('projects')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              })
            }}
          >
            <span className="relative z-10">See Projects</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-teal to-secondary-orange opacity-80 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
          </button>
          
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
