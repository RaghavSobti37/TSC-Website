import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const Hero = () => {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '30%'])

  return (
    <section id="hero" className="relative w-screen h-screen min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black" style={{marginTop: '4.5rem'}}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover absolute inset-0"
        style={{ width: '100vw', height: '100vh', minHeight: '100vh', minWidth: '100vw', background: 'black' }}
      >
        <source src="/src/assets/Video_Generation_Based_on_Design.mp4" type="video/mp4" />
      </video>
      <div className="absolute bottom-0 left-0 w-full flex flex-col sm:flex-row items-center justify-center gap-6 pb-8 z-10">
        <button
          className="btn-primary relative group"
          onClick={() => {
            document.getElementById('artists')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }}
        >
          <span className="relative z-10">Explore Our Artists</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-teal to-secondary-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full" />
        </button>
        <button
          className="btn-secondary group"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }}
        >
          <span className="relative z-10">Learn More</span>
          <div className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
        </button>
      </div>
    </section>
  )
}

export default Hero
