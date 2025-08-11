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
    <section id="about" className="section-gradient relative overflow-hidden py-20">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="floating-orb absolute top-20 left-10 w-96 h-96 bg-primary-teal" />
        <div className="floating-orb absolute bottom-20 right-10 w-64 h-64 bg-secondary-orange" />
        <div className="floating-orb absolute top-1/2 left-1/3 w-32 h-32 bg-light-teal" />
      </div>

      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-gray-50/90 to-white/95" />
      </motion.div>

      <div className="container relative z-10">
        <div className="content-wrapper">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
          {/* Section Header with Enhanced Design */}
          <motion.div variants={itemVariants} className="section-header">
            <h2 className="heading-font text-section-title text-gray-900 section-title">
              About <span className="text-gradient">The Shakti Collective</span>
            </h2>
            
            <p className="text-lead text-gray-600 text-wrapper font-light element-spacing-lg">
              We believe that every artist has a unique story to tell, and every story has the power to 
              <span className="text-gradient font-medium"> inspire, heal, and transform</span>.
            </p>
          </motion.div>

          {/* Main Content with Enhanced Layout */}
          <div className="grid-2 items-center element-spacing-lg">
            <motion.div variants={itemVariants} className="order-2 lg:order-1">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-teal to-secondary-orange rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <img 
                  src="/src/assets/shakti 2.png" 
                  alt="Artistic representation" 
                  className="relative w-full h-auto rounded-3xl shadow-2xl hover-lift group-hover:shadow-3xl transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 lg:order-2 space-y-8">
              <div>
                <h3 className="heading-font text-card-title text-gray-900 leading-tight element-spacing">
                  Empowering Artists Through 
                  <span className="text-gradient block">Authentic Storytelling</span>
                </h3>
                
                <div className="space-y-6 text-gray-700">
                  <p className="text-body">
                    The Shakti Collective is more than just a platform—it's a 
                    <span className="font-semibold text-primary-teal"> thriving community</span> where artists can share their 
                    authentic stories and transform them into powerful visual narratives.
                  </p>
                  
                  <p className="text-body">
                    We understand that behind every brushstroke, every sculpture, and every digital creation 
                    lies a <span className="font-semibold text-secondary-orange">personal journey</span> waiting to be discovered.
                  </p>
                  
                  <p className="text-body">
                    Our mission is to provide artists with the space, support, and audience they need to 
                    share their stories with the world, celebrating diversity, creativity, and the raw human 
                    experience that drives artistic expression.
                  </p>
                </div>
              </div>

              <motion.button
                className="btn-primary group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Join Our Community</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Enhanced Values Grid */}
          <motion.div variants={itemVariants}>
            <div className="section-header">
              <h3 className="heading-font text-card-title font-semibold text-gray-900 section-title">
                Our Core Values
              </h3>
            </div>

            <div className="grid-3">
              {[
                {
                  title: "Authentic Stories",
                  description: "We value genuine narratives that come from real experiences, emotions, and the depths of human creativity.",
                  icon: "📖",
                  gradient: "from-blue-500 to-purple-600"
                },
                {
                  title: "Creative Freedom",
                  description: "Artists have complete freedom to express themselves in their unique style, without compromise or limitation.",
                  icon: "🎨",
                  gradient: "from-primary-teal to-light-teal"
                },
                {
                  title: "Community Support",
                  description: "A supportive network of artists, collectors, and art enthusiasts who celebrate each other's success.",
                  icon: "🤝",
                  gradient: "from-secondary-orange to-red-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary-teal to-secondary-orange rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                  
                  <div className="relative bg-white rounded-2xl card shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <div className="text-center">
                      <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      
                      <h4 className="heading-font text-card-title font-semibold text-gray-900 element-spacing">
                        {feature.title}
                      </h4>
                      
                      <p className="text-body text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                    
                    {/* Decorative element */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gradient-to-r from-primary-teal to-secondary-orange rounded-full" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Call to Action Section */}
          <motion.div 
            variants={itemVariants}
            className="section-header"
          >
            <div className="bg-gradient-to-r from-primary-teal via-light-teal to-secondary-orange p-1 rounded-3xl max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl card-lg text-center">
                <h3 className="heading-font text-card-title font-semibold text-gray-900 section-title">
                  Ready to Share Your Story?
                </h3>
                <p className="text-body text-gray-600 element-spacing text-wrapper">
                  Join thousands of artists who have found their voice and audience through our platform. 
                  Start your creative journey today and become part of a community that celebrates authentic storytelling through art.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <motion.button
                    className="px-12 py-5 bg-gradient-to-r from-primary-teal to-light-teal text-white font-bold text-lg rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get Started Today
                  </motion.button>
                  <motion.button
                    className="px-12 py-5 border-3 border-primary-teal text-primary-teal font-bold text-lg rounded-full hover:bg-primary-teal hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section Transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  )
}

export default About
