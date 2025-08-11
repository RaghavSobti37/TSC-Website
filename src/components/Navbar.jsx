import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Navbar = ({ scrollY }) => {
  const [activeSection, setActiveSection] = useState('hero')
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    if (scrollY > lastScrollY && scrollY > 100) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
    setLastScrollY(scrollY)
  }, [scrollY, lastScrollY])

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'artists', label: 'Our Artists' },
    { id: 'team', label: 'Meet the Team' },
  ]

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveSection(sectionId)
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'glass-effect' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <img 
              src="/src/assets/only logo.png" 
              alt="The Shakti Collective" 
              className="h-10 w-auto"
            />
            <span className="heading-font text-xl font-semibold text-gradient">
              The Shakti Collective
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  activeSection === item.id
                    ? 'text-[var(--primary-teal)]'
                    : scrollY > 50
                    ? 'text-gray-700 hover:text-[var(--primary-teal)]'
                    : 'text-white hover:text-[var(--light-teal)]'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--primary-teal)]"
                    layoutId="activeSection"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className={`p-2 ${scrollY > 50 ? 'text-gray-700' : 'text-white'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
