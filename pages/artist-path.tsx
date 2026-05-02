import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function ArtistPath() {
  const [formData, setFormData] = useState({
    fullName: '',
    instagramId: '',
    spotifyId: '',
    youtubeChannel: '',
    mobile: '',
    email: '',
    place: '',
    artistType: '',
    trainingDetails: '',
    coreSkills: '',
    strengths: '',
    uniqueness: '',
    dailyTime: '',
    mentorName: '',
    songsReleased: '',
    showsPerformed: '',
    currentFans: '',
    currentSetup: '',
    currentlyWorkingOn: '',
    riyaazTime: '',
    dailyRituals: '',
    learningNeeds: '',
    mentorshipNeeds: '',
    curationNeeds: '',
    fandomNeeds: '',
    aspirationalGoal: '',
    anythingElse: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/artist-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (!result.success) {
        setErrorMsg(result.error || 'Failed to submit. Please try again.');
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Artist Path & Journey | The Soul Company</title>
      </Head>

      <main className="min-h-screen bg-[#050505] text-white pt-36 md:pt-48 pb-16 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-dark/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pumpkin/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-teal-primary/20 border border-teal-light/30 rounded-2xl p-8 sm:p-12 text-center"
            >
              <CheckCircle2 className="w-16 h-16 text-teal-light mx-auto mb-6" />
              <h2 className="text-2xl sm:text-3xl font-bold text-cream font-signika mb-4">
                Thank You for Sharing
              </h2>
              <p className="text-cream-dark/80 mb-8">
                Your journey has been recorded. We'll be in touch soon to see how we can support your growth.
              </p>
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center gap-2 bg-teal-dark hover:bg-teal-light text-cream px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Return to Home <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 sm:p-10 md:p-12 backdrop-blur-sm"
            >
              <div className="text-center mb-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cream font-signika mb-4">
                  The Artist Path
                </h1>
                <p className="text-lg text-cream-dark/70 font-alan-sans max-w-2xl mx-auto">
                  Tell us about your artist journey. Where you've been, where you are, and where you're heading.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans border-b border-white/10 pb-3">
                    1. Basic Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Full Name *</label>
                      <input
                        required
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Mobile *</label>
                      <input
                        required
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Email *</label>
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Place *</label>
                      <input
                        required
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Instagram ID</label>
                      <input
                        type="text"
                        name="instagramId"
                        value={formData.instagramId}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Spotify ID</label>
                      <input
                        type="text"
                        name="spotifyId"
                        value={formData.spotifyId}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">YouTube Channel</label>
                      <input
                        type="text"
                        name="youtubeChannel"
                        value={formData.youtubeChannel}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Why? */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans border-b border-white/10 pb-3">
                    2. Why?
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What kind of artist are you? *</label>
                    <input
                      required
                      type="text"
                      name="artistType"
                      value={formData.artistType}
                      onChange={handleChange}
                      placeholder="e.g., Singer, Composer, Producer..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">Have you had formal training in singing, composition, playing an instrument, or music production? We'd love to hear the details! *</label>
                    <textarea
                      required
                      name="trainingDetails"
                      value={formData.trainingDetails}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* What? */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans border-b border-white/10 pb-3">
                    3. What?
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What are your core skills as an artist? *</label>
                    <textarea
                      required
                      name="coreSkills"
                      value={formData.coreSkills}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What do you feel are your biggest strengths in your art? *</label>
                    <textarea
                      required
                      name="strengths"
                      value={formData.strengths}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What makes your art unique to you? *</label>
                    <textarea
                      required
                      name="uniqueness"
                      value={formData.uniqueness}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">How much time do you dedicate to your art every day? *</label>
                    <input
                      required
                      type="text"
                      name="dailyTime"
                      value={formData.dailyTime}
                      onChange={handleChange}
                      placeholder="e.g., 2 hours, 30 minutes..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">Do you have a Guruji or mentor? If so, what is their name?</label>
                    <input
                      type="text"
                      name="mentorName"
                      value={formData.mentorName}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Where do you stand today? */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans border-b border-white/10 pb-3">
                    4. Where do you stand today?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">How many songs have you released till now? *</label>
                      <input
                        required
                        type="number"
                        name="songsReleased"
                        value={formData.songsReleased}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">How many live shows have you performed? *</label>
                      <input
                        required
                        type="number"
                        name="showsPerformed"
                        value={formData.showsPerformed}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">How many people would you say are your current fans or core listeners? *</label>
                    <input
                      required
                      type="text"
                      name="currentFans"
                      value={formData.currentFans}
                      onChange={handleChange}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What kind of setup do you currently have? (e.g., gears, studio, Awards, DAW, etc.) *</label>
                    <textarea
                      required
                      name="currentSetup"
                      value={formData.currentSetup}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What are you currently working on? (e.g., new songs, performances, content, etc.) *</label>
                    <textarea
                      required
                      name="currentlyWorkingOn"
                      value={formData.currentlyWorkingOn}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">How much time do you dedicate to Riyaaz/practice each day? *</label>
                      <input
                        required
                        type="text"
                        name="riyaazTime"
                        value={formData.riyaazTime}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">What are your daily rituals? (e.g., Meditation, Sports, Gym, Yoga) *</label>
                      <input
                        required
                        type="text"
                        name="dailyRituals"
                        value={formData.dailyRituals}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* What you need */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans border-b border-white/10 pb-3">
                    5. What you need
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What are you looking to learn right now? *</label>
                    <textarea
                      required
                      name="learningNeeds"
                      value={formData.learningNeeds}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">What kind of mentorship are you seeking? *</label>
                    <textarea
                      required
                      name="mentorshipNeeds"
                      value={formData.mentorshipNeeds}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">Do you need help with curation? (e.g., Audio, video, Artwork, Live Show etc) *</label>
                    <textarea
                      required
                      name="curationNeeds"
                      value={formData.curationNeeds}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">How can we help you build your fandom? (e.g., Release, Content, Shows, Exposure, Collaborations, Connections) *</label>
                    <textarea
                      required
                      name="fandomNeeds"
                      value={formData.fandomNeeds}
                      onChange={handleChange}
                      rows={2}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Aspirational Goal & Others */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans border-b border-white/10 pb-3">
                    6. Aspirational Goal
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-cream-dark/90">
                      What is your aspirational goal for the next one year? *
                      <span className="block text-xs font-normal mt-1 opacity-70">
                        (An aspirational target is an ambitious, high-level goal set beyond current capabilities, designed to inspire maximum effort, innovation, and long-term growth rather than strict, immediate achievement. Unlike fixed targets, they act as a "North Star" encouraging progress towards a desired future state.)
                      </span>
                    </label>
                    <textarea
                      required
                      name="aspirationalGoal"
                      value={formData.aspirationalGoal}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="text-sm font-semibold text-cream-dark/90">Is there anything else you'd like to share with us? (Feel free to include links!)</label>
                    <textarea
                      name="anythingElse"
                      value={formData.anythingElse}
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-pumpkin hover:bg-pumpkin-dark text-cream font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(183,75,2,0.3)] hover:shadow-[0_0_30px_rgba(183,75,2,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Your Journey'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
