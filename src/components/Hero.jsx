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
      <div className="w-full flex items-center justify-center overflow-hidden" style={{ background: 'black' }}>
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
          }}
        >
          <source src="/src/assets/hero video TSC.mp4" type="video/mp4" />
        </video>
      </div>
      {/* Ensure buttons start after the bottom of the video, matching video width */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-6 z-10" style={{ marginTop: '2vw' }}>
        <button
          className="btn-primary relative group text-white font-semibold px-8 py-4 rounded-full shadow-lg"
          onClick={() => {
            document.getElementById('artists')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }}
        >
          <span className="relative z-10">Explore Our Artists</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-teal to-secondary-orange opacity-80 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        </button>
        <button
          className="btn-secondary group text-white font-semibold px-8 py-4 rounded-full shadow-lg"
          onClick={() => {
            document.getElementById('about')?.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }}
        >
          <span className="relative z-10">Learn More</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-teal to-secondary-orange opacity-80 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
        </button>
      </div>
    </section>
  )
}

export default Hero
