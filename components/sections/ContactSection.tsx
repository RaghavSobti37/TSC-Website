import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

type UserType = 'artist' | 'brand' | 'producer' | null;

/**
 * Contact Section
 * Dynamic contact form with user type selector
 */
export default function ContactSection() {
  const [userType, setUserType] = useState<UserType>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    // Artist fields
    genres: '',
    experience: '',
    lookingFor: '',
    // Brand fields
    company: '',
    budget: '',
    campaignType: '',
    // Producer fields
    focusArea: '',
    capital: '',
    timeline: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send to API
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userType,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          message: '',
          genres: '',
          experience: '',
          lookingFor: '',
          company: '',
          budget: '',
          campaignType: '',
          focusArea: '',
          capital: '',
          timeline: '',
        });
        setUserType(null);

        // Reset after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Section
      id="contact"
      background="charcoal"
      padding="xl"
      className="relative py-24"
    >
      <Container className="max-w-4xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-6 font-signika">
            Get in Touch
          </h2>
          <p className="text-lg text-cream/80 font-alan-sans">
            Tell us about yourself and how we can help you achieve your dreams
          </p>
        </motion.div>

        {/* Success state */}
        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 bg-charcoal/50 backdrop-blur"
            >
              <motion.div className="bg-cream rounded-2xl p-12 text-center max-w-md" layout>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="text-6xl mb-4"
                >
                  ✓
                </motion.div>
                <h3 className="text-2xl font-bold text-charcoal mb-2 font-signika">
                  Thank You!
                </h3>
                <p className="text-slate-600 font-alan-sans">
                  We'll be in touch within 48 hours to discuss your opportunities.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* User type selector */}
          <div>
            <label className="block text-cream font-semibold font-signika mb-4">
              I am a...
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 'artist', label: 'Artist 🎨', description: 'Creator / Performer' },
                { value: 'brand', label: 'Brand 🤝', description: 'Company / Organization' },
                { value: 'producer', label: 'Producer 💼', description: 'Financier / Investor' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setUserType(option.value as UserType)}
                  className={`p-4 rounded-xl border-2 transition-all font-alan-sans ${
                    userType === option.value
                      ? 'border-pumpkin bg-pumpkin/20'
                      : 'border-cream/20 hover:border-cream/40'
                  }`}
                >
                  <p className="font-semibold text-cream font-signika">
                    {option.label}
                  </p>
                  <p className="text-xs text-cream/70">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Common fields */}
          <div>
            <label className="block text-cream font-semibold font-signika mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder-cream/50 rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-cream font-semibold font-signika mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder-cream/50 rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
              placeholder="your@email.com"
            />
          </div>

          {/* Artist-specific fields */}
          <AnimatePresence>
            {userType === 'artist' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-cream font-semibold font-signika mb-2">
                    Genres
                  </label>
                  <input
                    type="text"
                    name="genres"
                    value={formData.genres}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder-cream/50 rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
                    placeholder="e.g., Hip-hop, Indie, Electronic"
                  />
                </div>
                <div>
                  <label className="block text-cream font-semibold font-signika mb-2">
                    Years of Experience
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
                  >
                    <option value="">Select experience level</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brand-specific fields */}
          <AnimatePresence>
            {userType === 'brand' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-cream font-semibold font-signika mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder-cream/50 rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-cream font-semibold font-signika mb-2">
                    Budget Range
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
                  >
                    <option value="">Select budget range</option>
                    <option value="50k-100k">₹50k - ₹100k</option>
                    <option value="100k-500k">₹100k - ₹500k</option>
                    <option value="500k-1m">₹500k - ₹1M</option>
                    <option value="1m+">₹1M+</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Producer-specific fields */}
          <AnimatePresence>
            {userType === 'producer' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-cream font-semibold font-signika mb-2">
                    Focus Area
                  </label>
                  <input
                    type="text"
                    name="focusArea"
                    value={formData.focusArea}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder-cream/50 rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
                    placeholder="e.g., Music, Content, Film"
                  />
                </div>
                <div>
                  <label className="block text-cream font-semibold font-signika mb-2">
                    Available Capital
                  </label>
                  <select
                    name="capital"
                    value={formData.capital}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans"
                  >
                    <option value="">Select capital range</option>
                    <option value="1m-5m">₹1M - ₹5M</option>
                    <option value="5m-10m">₹5M - ₹10M</option>
                    <option value="10m+">₹10M+</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message field */}
          <div>
            <label className="block text-cream font-semibold font-signika mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={5}
              className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder-cream/50 rounded-xl focus:outline-none focus:border-pumpkin transition-all font-alan-sans resize-none"
              placeholder="Tell us about your project or interests..."
            />
          </div>

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={!userType || !formData.name || !formData.email || !formData.message}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-pumpkin text-cream font-bold rounded-xl hover:bg-pumpkin-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed font-signika"
          >
            Send Message →
          </motion.button>
        </motion.form>
      </Container>
    </Section>
  );
}
