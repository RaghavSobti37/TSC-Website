import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-[var(--primary-teal)] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-[var(--secondary-orange)] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="heading-font text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-gradient">The Shakti Collective</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[var(--primary-teal)] to-[var(--secondary-orange)] mx-auto mb-8" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We believe that every artist has a unique story to tell, and every story has the power to inspire, heal, and transform.
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div variants={itemVariants}>
              <img 
                src="/src/assets/shakti 2.png" 
                alt="Artistic representation" 
                className="w-full h-auto rounded-2xl shadow-2xl hover-lift"
              />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="heading-font text-3xl font-semibold text-gray-900 mb-4">
                Empowering Artists Through Storytelling
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                The Shakti Collective is more than just a platform—it's a community where artists can share their 
                authentic stories and transform them into powerful visual narratives. We understand that behind 
                every brushstroke, every sculpture, and every digital creation lies a personal journey.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our mission is to provide artists with the space, support, and audience they need to share their 
                stories with the world. We celebrate diversity, creativity, and the raw human experience that 
                drives artistic expression.
              </p>
              <motion.button
                className="mt-6 px-6 py-3 bg-[var(--primary-teal)] text-white font-semibold rounded-lg hover:bg-[var(--light-teal)] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Our Community
              </motion.button>
            </motion.div>
          </div>

          {/* Values/Features Grid */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authentic Stories",
                description: "We value genuine narratives that come from real experiences and emotions.",
                icon: "📖"
              },
              {
                title: "Creative Freedom",
                description: "Artists have complete freedom to express themselves in their unique style.",
                icon: "🎨"
              },
              {
                title: "Community Support",
                description: "A supportive network of artists, collectors, and art enthusiasts.",
                icon: "🤝"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover-lift"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="heading-font text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
