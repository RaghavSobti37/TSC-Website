import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import { CMSGrid } from '@/components/cards/CMSCard';
import { Button } from '@/components/buttons/Button';
import { cn } from '@/lib/utils';
import { cms } from '@/lib/cms';

export default function AcademyPage() {
  // Get courses from CMS and transform to card format
  const courseData = cms.getCourses();
  const courses = courseData.map(course => ({
    image: course.image,
    title: course.title,
    subtitle: `Mentor: ${course.mentor}`,
    description: course.description,
    ctaLabel: course.ctaLabel,
    ctaHref: `/academy/${course.slug}`,
  }));

  // Sample courses data for reference (kept for reference)
  const sampleCourses = [
    {
      image: 'https://images.unsplash.com/photo-1514607687887-7419c7b47e5d?w=500&h=500&fit=crop',
      title: 'Music Production Fundamentals',
      subtitle: 'Mentor: Alex Rivera',
      description: 'Learn the foundations of modern music production from concept to mastering.',
      ctaLabel: 'Enroll',
      ctaHref: '/academy/music-production',
    },
    {
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
      title: 'Storytelling Through Film',
      subtitle: 'Mentor: Sophie Chen',
      description: 'Master narrative techniques and visual storytelling for the digital age.',
      ctaLabel: 'Enroll',
      ctaHref: '/academy/storytelling-film',
    },
    {
      image: 'https://images.unsplash.com/photo-1516239482537-e3c3f11cb3a2?w=500&h=500&fit=crop',
      title: 'Artist Branding & Marketing',
      subtitle: 'Mentor: Marcus Johnson',
      description: 'Build your personal brand and connect authentically with your audience.',
      ctaLabel: 'Enroll',
      ctaHref: '/academy/artist-branding',
    },
    {
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=500&h=500&fit=crop',
      title: 'Digital Art & Design',
      subtitle: 'Mentor: Luna Park',
      description: 'Explore cutting-edge tools and techniques in digital creative arts.',
      ctaLabel: 'Enroll',
      ctaHref: '/academy/digital-art',
    },
  ];

  // Mentors
  const mentors = [
    {
      name: 'Alex Rivera',
      role: 'Producer & Sound Designer',
      specialty: 'Music Production',
    },
    {
      name: 'Sophie Chen',
      role: 'Filmmaker & Director',
      specialty: 'Visual Storytelling',
    },
    {
      name: 'Marcus Johnson',
      role: 'Business Strategist',
      specialty: 'Artist Development',
    },
    {
      name: 'Luna Park',
      role: 'Digital Artist',
      specialty: 'Visual Arts',
    },
  ];

  return (
    <>
      <Head>
        <title>TSC Academy - Unfold your craft into a career</title>
        <meta
          name="description"
          content="Learn from industry mentors and develop your creative career at TSC Academy"
        />
      </Head>

      {/* Hero Section */}
      <Section background="cream" padding="xl" className="min-h-[60vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp">
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">
              Unfold your craft into a career.
            </h1>
            <p className="text-xl md:text-2xl text-slate-medium mb-8 max-w-2xl">
              Mentorship-driven courses designed to take you from emerging talent to industry professional.
            </p>
            <Button variant="primary" size="lg">
              Explore Courses
            </Button>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* The Artist Path Timeline */}
      <Section background="white" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">The Artist Path</h2>
            <p className="text-lg text-slate-medium mt-4">
              A structured journey from learning to monetization
            </p>
          </UnfoldReveal>

          <div className="space-y-8">
            {[
              {
                stage: 'Foundation',
                description: 'Build core skills and knowledge in your craft',
                courses: 3,
              },
              {
                stage: 'Creation',
                description: 'Develop your unique voice and first portfolio pieces',
                courses: 4,
              },
              {
                stage: 'Collaboration',
                description: 'Work with peers on collaborative projects',
                courses: 'Ongoing',
              },
              {
                stage: 'Launch',
                description: 'Present work to potential partners and audiences',
                courses: '1 per quarter',
              },
            ].map((step, index) => (
              <UnfoldReveal key={step.stage} variant="slideInLeft" delay={index * 0.1}>
                <div className="flex gap-8 pb-8 border-b border-cream-dark last:border-b-0">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-teal-dark text-cream flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-charcoal mb-2">{step.stage}</h3>
                    <p className="text-slate-medium text-base mb-4">{step.description}</p>
                    <p className="text-sm text-slate-light">
                      ~{typeof step.courses === 'number' ? `${step.courses} courses` : step.courses}
                    </p>
                  </div>
                </div>
              </UnfoldReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Courses Grid */}
      <Section background="cream-dark" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Featured Courses</h2>
          </UnfoldReveal>

          <CMSGrid items={courses} columns="2" variant="course" />
        </Container>
      </Section>

      {/* Mentors Section */}
      <Section background="white" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal">Learn from Mentors</h2>
            <p className="text-lg text-slate-medium mt-4">
              Industry veterans dedicated to your creative growth
            </p>
          </UnfoldReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mentors.map((mentor, index) => (
              <UnfoldReveal key={mentor.name} variant="scaleUp" delay={index * 0.1}>
                <motion.div className="bg-cream rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-24 h-24 bg-teal-dark rounded-full mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-charcoal mb-1">{mentor.name}</h4>
                  <p className="text-sm text-slate-light mb-2">{mentor.role}</p>
                  <span className="inline-block px-3 py-1 bg-white rounded-full text-xs font-semibold text-teal-primary">
                    {mentor.specialty}
                  </span>
                </motion.div>
              </UnfoldReveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Community Section */}
      <Section background="teal" padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <UnfoldReveal variant="slideInLeft" className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Main Bhi Artist</h2>
              <p className="text-lg text-cream mb-6">
                Join our global community of artists supporting each others' creative journeys.
              </p>
              <ul className="space-y-3 text-base mb-8">
                <li className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Connect with 1000+ artists worldwide</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Share work and get feedback</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Collaborate on projects</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Access exclusive resources</span>
                </li>
              </ul>
              <Button variant="primary" size="lg" className="bg-cream text-teal-dark hover:bg-cream-dark">
                Join Community
              </Button>
            </UnfoldReveal>

            <UnfoldReveal variant="slideInRight">
              <div className="aspect-square bg-cream rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516239482537-e3c3f11cb3a2?w=600&h=600&fit=crop"
                  alt="Artists community"
                  className="w-full h-full object-cover"
                />
              </div>
            </UnfoldReveal>
          </div>
        </Container>
      </Section>

      {/* Demo Day / Incubation */}
      <Section background="white" padding="xl">
        <Container>
          <UnfoldReveal variant="fadeUp" className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">Demo Day</h2>
            <p className="text-lg text-slate-medium max-w-2xl mx-auto mb-8">
              Showcase your work to industry partners, investors, and media. Our quarterly Demo Days provide
              a platform for emerging talent to gain visibility and opportunity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {['Previous Showcases', 'Upcoming Dates', 'Investor Network'].map((item, i) => (
                <UnfoldReveal key={item} variant="slideInLeft" delay={i * 0.1}>
                  <motion.div
                    className="bg-cream rounded-lg p-8 hover:shadow-md transition-shadow"
                    whileHover={{ y: -4 }}
                  >
                    <p className="text-4xl font-bold text-teal-dark mb-4">
                      {i === 0 ? '12' : i === 1 ? '4' : '50+'}
                    </p>
                    <h4 className="font-bold text-charcoal">{item}</h4>
                  </motion.div>
                </UnfoldReveal>
              ))}
            </div>

            <Button variant="primary" size="lg">
              Apply for Demo Day
            </Button>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* CTA */}
      <Section background="charcoal" padding="xl">
        <Container className="text-center">
          <UnfoldReveal variant="fadeUp" className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to unfold your potential?</h2>
            <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
              Your artistic journey starts here. Join hundreds of artists transforming their craft into careers.
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <Button variant="primary" size="lg" className="bg-cream text-charcoal hover:bg-cream-dark">
                Enroll Now
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-charcoal">
                Apply as Mentor
              </Button>
            </div>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}
