import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import LineDrawSVG from '@/components/animations/LineDrawSVG';

interface Course {
  id: string;
  title: string;
  mentor: string;
  level: string;
  description: string;
  icon: string;
}

/**
 * Academy Section - The Artist Path
 * Vertical timeline showing artist development path
 */
export default function AcademySection() {
  const stages = [
    {
      id: 'foundation',
      title: 'Foundation',
      description: 'Master your fundamentals with guided courses and mentorship',
    },
    {
      id: 'creation',
      title: 'Creation',
      description: 'Develop your unique voice in our creative spaces',
    },
    {
      id: 'collaboration',
      title: 'Collaboration',
      description: 'Partner with peers and industry professionals',
    },
    {
      id: 'launch',
      title: 'Launch',
      description: 'Take your work to the world with brand partnerships',
    },
  ];

  const courses: Course[] = [
    {
      id: 'course-1',
      title: 'Music Production Fundamentals',
      mentor: 'Prod. Maya',
      level: 'Beginner',
      description: 'Learn the basics of modern music production',
      icon: '🎵',
    },
    {
      id: 'course-2',
      title: 'Storytelling for Artists',
      mentor: 'Dev. Aarav',
      level: 'Intermediate',
      description: 'Craft compelling narratives around your art',
      icon: '📖',
    },
    {
      id: 'course-3',
      title: 'Artist Branding & Rights',
      mentor: 'Priya Sharma',
      level: 'Intermediate',
      description: 'Protect and monetize your intellectual property',
      icon: '🛡️',
    },
  ];

  return (
    <Section
      id="academy"
      background="transparent"
      padding="xl"
      className="relative py-24 bg-gradient-to-br from-sea-foam to-peacock"
    >
      <Container className="max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-6 font-signika">
            The Artist Path
          </h2>
          <p className="text-lg text-cream/90 font-alan-sans max-w-2xl mx-auto">
            A structured journey from aspiring artist to globally recognized creator
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-20">
          {/* Timeline line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-96 bg-gradient-to-b from-cream/50 to-transparent" />

          {/* Timeline stages */}
          <div className="space-y-12">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className={`flex items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              >
                {/* Content */}
                <div className="flex-1 bg-cream/10 rounded-xl p-6 border border-cream/20 backdrop-blur">
                  <h3 className="text-2xl font-bold text-cream mb-2 font-signika">
                    {stage.title}
                  </h3>
                  <p className="text-cream/80 font-alan-sans">
                    {stage.description}
                  </p>
                </div>

                {/* Timeline dot */}
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex-shrink-0 w-4 h-4 bg-cream rounded-full ring-4 ring-cream/50"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-3xl font-bold text-cream mb-8 font-signika text-center">
            Featured Courses
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-cream/10 rounded-xl p-6 border border-cream/20 hover:border-cream/50 transition-all hover:bg-cream/20 group cursor-pointer backdrop-blur"
              >
                {/* Icon */}
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {course.icon}
                </div>

                {/* Course title */}
                <h4 className="text-xl font-bold text-cream mb-2 font-signika">
                  {course.title}
                </h4>

                {/* Description */}
                <p className="text-cream/80 font-alan-sans text-sm mb-4">
                  {course.description}
                </p>

                {/* Mentor */}
                <p className="text-cream/70 font-alan-sans text-sm mb-3">
                  Mentor: <span className="font-semibold">{course.mentor}</span>
                </p>

                {/* Level badge */}
                <div className="inline-block px-3 py-1 bg-cream/20 text-cream rounded-full text-xs font-semibold mb-4 font-signika">
                  {course.level}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-cream font-bold text-sm flex items-center gap-2 group/btn"
                >
                  Enroll Now →
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a href="#contact" className="inline-block px-8 py-3 bg-cream text-peacock rounded-full font-semibold hover:bg-cream/90 transition-all font-signika">
            Start Your Artist Path →
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}
