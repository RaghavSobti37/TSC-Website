import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden"
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-teal rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-orange rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10">
        {/* Main Footer Content */}
        <div className="section-spacing grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center space-x-3 element-spacing"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src="/src/assets/only logo.png" 
                alt="The Shakti Collective" 
                className="h-12 w-auto"
              />
              <span className="heading-font text-card-title font-semibold text-white card" style={{textShadow: '0 0 8px #23232a, 0 0 2px #fff'}}>
                The Shakti Collective
              </span>
            </motion.div>
            <p className="text-white text-body max-w-md element-spacing" style={{textShadow: '0 0 2px #23232a', background: 'linear-gradient(135deg, #5fb3a3 0%, #ff5722 100%)', borderRadius: '1rem', padding: '1rem'}}>
              Empowering artists to share their stories through powerful visual narratives. 
              Join our community where creativity meets authentic storytelling.
            </p>
            <div className="flex space-x-6">
              {[
                { name: 'Facebook', icon: 'facebook' },
                { name: 'Instagram', icon: 'instagram' },
                { name: 'Twitter', icon: 'twitter' },
                { name: 'LinkedIn', icon: 'linkedin' }
              ].map((social) => (
                <motion.a
                  key={social.name}
                  href="#"
                  className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary-teal transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">{social.name}</span>
                  {/* Simple icon placeholder - you can replace with actual icons */}
                  <div className="w-5 h-5 bg-current rounded opacity-60"></div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="heading-font text-card-subtitle font-semibold element-spacing">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { name: 'About Us', href: '#about' },
                { name: 'Our Artists', href: '#artists' },
                { name: 'Meet the Team', href: '#team' },
                { name: 'Contact', href: '#contact' }
              ].map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-300 hover:text-primary-teal transition-colors duration-200 text-body"
                    whileHover={{ x: 5 }}
                    onClick={(e) => {
                      e.preventDefault()
                      const element = document.querySelector(link.href)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="heading-font text-card-subtitle font-semibold element-spacing">Support</h3>
            <ul className="space-y-4">
              {[
                { name: 'Help Center', href: '#' },
                { name: 'Community Guidelines', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-300 hover:text-primary-teal transition-colors duration-200 text-body"
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="section-spacing border-t border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="heading-font text-card-title font-semibold element-spacing section-title">
              Stay Connected with Our Community
            </h3>
            <p className="text-gray-300 text-body element-spacing text-wrapper">
              Get updates on new artists, featured stories, and community events. Be the first to discover 
              emerging talent and never miss out on inspiring creative content.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-teal transition-colors"
              />
              <motion.button
                className="px-10 py-4 bg-gradient-to-r from-primary-teal to-light-teal text-white font-bold rounded-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="element-spacing border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-small">
            © {currentYear} The Shakti Collective. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary-teal text-small transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-teal text-small transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-teal text-small transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-primary-teal to-secondary-orange text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1, y: -3 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </motion.footer>
  )
}

export default Footer
