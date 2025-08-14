import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Artists from './components/Artists'
import Projects from './components/Projects'
import Team from './components/Team'
import Footer from './components/Footer'

function App() {
  const [scrollY, setScrollY] = useState(0)
  const { scrollYProgress } = useScroll()
  
  // Smooth scroll progress for the indicator
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Enhanced parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 0.3])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const throttledScroll = throttle(handleScroll, 16) // 60fps
    
    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [])

  // Throttle function for better performance
  const throttle = (func, limit) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  return (
    <div className="relative">
      {/* Scroll Progress Indicator */}
      <motion.div
        className="scroll-indicator fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-teal via-light-teal to-secondary-orange z-50 origin-left"
        style={{ scaleX }}
      />

  {/* Enhanced Background Elements with Parallax - limited to hero only */}
      
      {/* Main Content with Enhanced Flow */}
      <div className="relative z-10">
        <Navbar scrollY={scrollY} />
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Hero />
        </motion.div>

        {/* About Section with Transition */}
        <motion.div
          className="section-transition"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <About />
        </motion.div>

        {/* Artists Section with Enhanced Transition */}
        <motion.div
          className="section-transition"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Artists />
        </motion.div>

        {/* Projects Section */}
        <motion.div
          className="section-transition"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Projects />
        </motion.div>

        {/* Team Section */}
        <motion.div
          className="section-transition"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Team />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <Footer />
        </motion.div>
      </div>

      {/* Intersection Observer for Smooth Reveals */}
      <style jsx global>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .reveal-on-scroll.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Smooth scrolling for the entire page */
        html {
          scroll-behavior: smooth;
        }
        
        /* Enhanced scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, var(--primary-teal), var(--secondary-orange));
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, var(--light-teal), var(--primary-teal));
        }
      `}</style>
    </div>
  )
}

export default App
