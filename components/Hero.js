import { motion } from 'framer-motion'
import Image from 'next/legacy/image'
import { useState, useEffect } from 'react'

export default function Hero() {
  const patterns = [
    "/assets/Patterns/LogoArtboard 17@300x-8.png",
    "/assets/Patterns/LogoArtboard 18@300x-8.png",
    "/assets/Patterns/LogoArtboard 19@300x-8.png",
    "/assets/Patterns/LogoArtboard 20@300x-8.png"
  ];

  const [currentPattern, setCurrentPattern] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPattern((prev) => (prev + 1) % patterns.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      <div className="pattern-container absolute inset-0 w-full">
        <motion.div 
          key={currentPattern}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full flex"
        >
          {/* Left Pattern */}
          <div className="w-1/2 h-full relative">
            <Image 
              src={patterns[currentPattern]} 
              alt="Background Pattern Left" 
              layout="fill" 
              objectFit="cover"
              quality={100}
              priority
              className="opacity-50"
              style={{
                objectPosition: 'right center',
                transform: 'scale(1.1)'
              }}
            />
          </div>
          {/* Right Pattern */}
          <div className="w-1/2 h-full relative">
            <Image 
              src={patterns[currentPattern]} 
              alt="Background Pattern Right" 
              layout="fill" 
              objectFit="cover"
              quality={100}
              priority
              className="opacity-50"
              style={{
                objectPosition: 'left center',
                transform: 'scale(1.1)'
              }}
            />
          </div>
        </motion.div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-cream text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-comfortaa text-5xl md:text-7xl font-bold mb-4"
        >
          <span className="text-gradient">
            The Shakti Collective
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl font-light tracking-wider mb-8 text-cream/80"
        >
          Music , Stories , Culture forward
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a href="#projects" className="btn-primary">View Our Work</a>
          <a href="https://www.instagram.com/the_shakti_collective?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Join the Community
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="scroll-down-animation"
        >
          <div className="mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span className="">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  )
}