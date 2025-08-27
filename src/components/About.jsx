import React from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.2 })
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
  <section id="about" className="section-dark py-20 flex justify-center bg-gradient-to-br from-primary-teal via-light-teal to-secondary-orange font-sans">
      <div className="container relative z-10">
  <div className="content-wrapper mx-auto text-center">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Section Header with Enhanced Design and smooth transition from Projects */}
            <motion.div variants={itemVariants} className="section-header mb-8 animate__animated animate__fadeInUp">
              <h2 className="heading-font text-section-title section-title text-white">
                About <span className="text-gradient">us</span>
              </h2>
              <p className="text-lead text-gray-100 text-wrapper font-light element-spacing-lg">
                We believe that every artist has a unique story to tell, and every story has the power to
                <span className="text-gradient font-medium"> inspire, heal, and transform</span>.
              </p>
            </motion.div>
          </motion.div>

          {/* Main Content with Enhanced Layout */}
          <div className="grid-2 items-center element-spacing-lg">
            <motion.div variants={itemVariants} className="order-2 lg:order-1 flex justify-center">
              <div className="relative group w-32 h-32 md:w-40 md:h-40 bg-white/10 border-2 border-primary-teal rounded-2xl flex items-center justify-center shadow-lg">
                <img 
                  src="/src/assets/shakti 2.png" 
                  alt="Artistic representation" 
                  className="w-24 h-24 object-cover rounded-xl"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 lg:order-2 space-y-8">
              <div>
                <h3 className="heading-font text-card-title leading-tight element-spacing text-primary-teal">
                  Empowering Artists
                  <span className="block text-secondary-orange">Through Storytelling</span>
                </h3>
                <div className="space-y-4">
                  <p className="text-body">
                    The Shakti Collective is a <span className="font-semibold text-primary-teal">community</span> for artists to share and transform their stories into visual narratives.
                  </p>
                  <p className="text-body">
                    Behind every creation is a <span className="font-semibold text-secondary-orange">personal journey</span> waiting to be discovered.
                  </p>
                  <p className="text-body">
                    Our mission: provide space, support, and audience for artists to celebrate creativity and authentic expression.
                  </p>
                </div>
              </div>

              <motion.button
                className="btn-primary group bg-primary-teal text-white px-8 py-3 rounded-full shadow-lg hover:bg-secondary-orange transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Join Our Community</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Enhanced Values Grid */}

          {/* Call to Action Section */}
          <motion.div 
            variants={itemVariants}
            className="section-header"
          >
            <div className="bg-gradient-to-r from-primary-teal via-light-teal to-secondary-orange p-1 rounded-3xl max-w-4xl mx-auto">
              <div className="bg-[#23232a] card text-center">
                <h3 className="heading-font text-card-title font-semibold section-title text-white" style={{textShadow: '0 0 8px #23232a, 0 0 2px #fff'}}>
                  Ready to Share Your Story?
                </h3>
                <p className="text-body text-white element-spacing text-wrapper" style={{textShadow: '0 0 2px #23232a'}}>
                  Join thousands of artists who have found their voice and audience through our platform. 
                  Start your creative journey today and become part of a community that celebrates authentic storytelling through art.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.a
                    href="https://mainbhiartist.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-12 py-5 bg-gradient-to-r from-primary-teal via-light-teal to-secondary-orange text-white font-bold text-lg rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-primary-teal"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Submit Your Story
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Section Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  )
}

export default About
