import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Artists from './components/Artists'
import Team from './components/Team'
import Footer from './components/Footer'

function App() {
  const [scrollY, setScrollY] = useState(0)
  const { scrollYProgress } = useScroll()
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%'])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      {/* Background Elements for Parallax */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, 
            rgba(95, 179, 163, ${0.05 + scrollY * 0.0001}) 0%, 
            rgba(255, 87, 34, ${0.03 + scrollY * 0.00005}) 100%)`,
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10">
        <Navbar scrollY={scrollY} />
        <Hero />
        <About />
        <Artists />
        <Team />
        <Footer />
      </div>
    </div>
  )
}

export default App
