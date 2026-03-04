import React, { useState } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import { Button } from '@/components/buttons/Button';
import { cn } from '@/lib/utils';

type UserType = 'artist' | 'brand' | 'producer' | null;

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    links: '',
    companyName: '',
    projectDetails: '',
    isSubmitting: false,
    isSuccess: false,
  });

  const userTypeOptions = [
    {
      id: 'artist',
      label: 'Join as Artist',
      description: 'Get mentorship and develop your creative potential',
      icon: '🎨',
    },
    {
      id: 'brand',
      label: 'Partner with TSC',
      description: 'Create cultural IP and collaborate with emerging talent',
      icon: '🤝',
    },
    {
      id: 'producer',
      label: 'Co-Create with TSC',
      description: 'Co-produce original content and build strategic partnerships',
      icon: '🎬',
    },
  ];

  const handleTypeSelect = (type: UserType) => {
    setSelectedType(type);
    setFormData({ ...formData, isSuccess: false });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, POST to /api/leads
      console.log('Form submitted:', { type: selectedType, ...formData });

      setFormData((prev) => ({
        ...prev,
        isSuccess: true,
        isSubmitting: false,
      }));

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          links: '',
          companyName: '',
          projectDetails: '',
          isSubmitting: false,
          isSuccess: false,
        });
        setSelectedType(null);
      }, 3000);
    } catch (error) {
      setFormData((prev) => ({ ...prev, isSubmitting: false }));
      console.error('Form submission error:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Contact TSC - Let's Connect</title>
        <meta name="description" content="Get in touch with the talent-centric culture engine" />
      </Head>

      {/* Hero */}
      <Section background="cream" padding="xl" className="min-h-[50vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp" className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">
              Let's connect.
            </h1>
            <p className="text-xl md:text-2xl text-slate-medium max-w-2xl mx-auto">
              Whether you're an artist seeking mentorship, a brand looking to create cultural IP, or a producer
              ready to co-create, we want to hear from you.
            </p>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* Form Section */}
      <Section background="white" padding="xl">
        <Container className="max-w-3xl">
          <AnimatePresence mode="wait">
            {!selectedType ? (
              // User type selector
              <motion.div
                key="selector"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <UnfoldReveal variant="fadeUp" className="mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-charcoal text-center mb-4">
                    How can we help you unfold?
                  </h2>
                </UnfoldReveal>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userTypeOptions.map((option, index) => (
                    <UnfoldReveal
                      key={option.id}
                      variant="slideInLeft"
                      delay={index * 0.1}
                    >
                      <motion.button
                        onClick={() => handleTypeSelect(option.id as UserType)}
                        className="group p-6 rounded-lg border-2 border-cream-dark hover:border-teal-dark hover:bg-cream transition-all text-left h-full"
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-4xl mb-4">{option.icon}</div>
                        <h3 className="text-xl font-bold text-charcoal mb-2 group-hover:text-teal-dark transition-colors">
                          {option.label}
                        </h3>
                        <p className="text-sm text-slate-medium">{option.description}</p>
                      </motion.button>
                    </UnfoldReveal>
                  ))}
                </div>
              </motion.div>
            ) : formData.isSuccess ? (
              // Success state
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-6">✓</div>
                <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                  Thank you!
                </h2>
                <p className="text-lg text-slate-medium max-w-lg mx-auto mb-8">
                  We've received your application and will be in touch within 48 hours.
                </p>
                <p className="text-slate-light text-sm">
                  In the meantime, check out our{' '}
                  <a href="/academy" className="text-teal-primary font-semibold hover:text-teal-dark">
                    Academy
                  </a>
                  {' '}or explore our{' '}
                  <a href="/ip" className="text-teal-primary font-semibold hover:text-teal-dark">
                    IP portfolio
                  </a>
                  .
                </p>
              </motion.div>
            ) : (
              // Form
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-8">
                  <button
                    onClick={() => handleTypeSelect(null)}
                    className="text-teal-primary font-semibold hover:text-teal-dark flex items-center gap-1"
                    type="button"
                  >
                    ← Change selection
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-charcoal mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-charcoal mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  {/* Artist-specific fields */}
                  {selectedType === 'artist' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Portfolio/Social Links
                        </label>
                        <input
                          type="text"
                          name="links"
                          value={formData.links}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                          placeholder="https://spotify.com/artist/you, https://instagram.com/you"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Tell us about your craft
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows={5}
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                          placeholder="What's your artistic journey? What brings you to TSC?"
                        />
                      </div>
                    </>
                  )}

                  {/* Brand-specific fields */}
                  {selectedType === 'brand' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Company Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                          placeholder="Your company"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Project Brief *
                        </label>
                        <textarea
                          name="projectDetails"
                          value={formData.projectDetails}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                          placeholder="Describe your project, collaboration goals, and what you're looking to create with TSC"
                        />
                      </div>
                    </>
                  )}

                  {/* Producer-specific fields */}
                  {selectedType === 'producer' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Organization Name *
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                          placeholder="Production company or fund name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-charcoal mb-2">
                          Co-Creation Opportunity *
                        </label>
                        <textarea
                          name="projectDetails"
                          value={formData.projectDetails}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 rounded-lg border border-cream-dark focus:border-teal-dark focus:outline-none transition-colors bg-cream"
                          placeholder="What's your vision for collaboration? What content or pipeline are you interested in co-producing?"
                        />
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={formData.isSubmitting}
                    disabled={formData.isSubmitting}
                  >
                    {formData.isSubmitting ? 'Submitting...' : 'Send My Application'}
                  </Button>

                  <p className="text-xs text-slate-light text-center">
                    We respect your privacy. Your data will only be used to connect with you about opportunities.
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Section>

      {/* FAQ or additional info */}
      <Section background="cream-dark" padding="lg">
        <Container>
          <UnfoldReveal variant="fadeUp" className="text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Explore Academy',
                  description: 'Check out our mentorship programs',
                  href: '/academy',
                },
                {
                  title: 'View IP Portfolio',
                  description: "See what we're creating",
                  href: '/ip',
                },
                {
                  title: 'Meet the Team',
                  description: 'Learn about our mentors',
                  href: '/about',
                },
              ].map((link) => (
                <motion.a
                  key={link.title}
                  href={link.href}
                  className="p-6 bg-white rounded-lg hover:shadow-md transition-all block hover:text-teal-primary"
                  whileHover={{ y: -4 }}
                >
                  <h3 className="font-bold text-charcoal mb-2">{link.title}</h3>
                  <p className="text-sm text-slate-medium">{link.description}</p>
                </motion.a>
              ))}
            </div>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}
