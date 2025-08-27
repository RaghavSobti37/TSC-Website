import { motion, useScroll, useTransform } from 'framer-motion'

export default function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -100])

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
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
          className="text-lg md:text-xl font-light tracking-wider mb-8 text-gray-200"
        >
          Music , Stories , Culture forward
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button className="btn-primary">View Our Work</button>
          <a href="https://www.instagram.com/the_shakti_collective?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Join the Community
          </a>
        </motion.div>
      </div>
    </section>
  )
}