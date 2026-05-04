import React, { useState, FormEvent } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';

export default function ArtistPath() {
  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    place: '',
    instagram: '',
    spotify: '',
    youtube: '',
    mobile: '',
    email: '',
    artistIdentity: '',
    trainingDetails: '',
    coreSkills: '',
    strengthsUniqueness: '',
    dailyTime: '',
    mentorName: '',
    songsReleased: '',
    showsPerformed: '',
    currentFans: '',
    currentSetup: '',
    currentlyWorkingOn: '',
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
        <title>Artist Path & Journey | The Shakti Collective</title>
      </Head>

      <main className="min-h-screen bg-[#050505] text-white pt-36 md:pt-48 pb-16 px-2 sm:px-6 relative overflow-hidden">
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
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 sm:p-10 md:p-12 backdrop-blur-sm"
            >
              <div className="text-center mb-10">
                <div className="inline-block text-center">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-cream font-signika mb-2">
                    The Artist Path
                  </h1>
                  <p 
                    className="text-pumpkin font-black text-xs sm:text-sm md:text-base uppercase tracking-wider font-alan-sans w-full"
                    style={{ textAlignLast: 'justify' }}
                  >
                    From Potential to Professional
                  </p>
                </div>
                <p className="text-lg text-cream-dark/70 font-alan-sans max-w-2xl mx-auto mt-6">
                  Tell us about your artist journey. Where you've been, where you are, and where you're heading.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* 1. The Essentials */}
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">
                      1. The Essentials
                    </h3>
                    <p className="text-sm sm:text-base text-cream-dark/70 font-alan-sans">
                      Let’s start with the basics so we know who you are and where to find your work.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Full Name: (The name on your ID) *</label>
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
                      <label className="text-sm font-semibold text-cream-dark/90">Stage Name / Identity: (If different from above)</label>
                      <input
                        type="text"
                        name="stageName"
                        value={formData.stageName}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Where are you based? (Your current city/home base) *</label>
                      <input
                        required
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-cream-dark/90 block">Digital Footprint: Drop your links for Instagram, Spotify, and YouTube so we can dive into your world.</label>
                      <input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleChange}
                        placeholder="Instagram Profile URL"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                      <input
                        type="text"
                        name="spotify"
                        value={formData.spotify}
                        onChange={handleChange}
                        placeholder="Spotify Artist URL"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                      <input
                        type="text"
                        name="youtube"
                        value={formData.youtube}
                        onChange={handleChange}
                        placeholder="YouTube Channel URL"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-sm font-semibold text-cream-dark/90 block">Direct Line: Your Mobile Number and Email Address. *</label>
                      <input
                        required
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Mobile Number"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. The "Why" Behind the Music */}
                <div className="space-y-6 pt-4">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">
                      2. The "Why" Behind the Music
                    </h3>
                    <p className="text-sm sm:text-base text-cream-dark/70 font-alan-sans">
                      Every artist has a "why?" Tell us about yours.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">The Artist Identity: Complete this sentence: "I am an artist because..." (Is it a need to express, a specific message, or a lifelong calling?) *</label>
                      <textarea
                        required
                        name="artistIdentity"
                        value={formData.artistIdentity}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">The Foundation: Tell us about your formal or informal training. Have you spent years in vocal riyaaz, mastered an instrument, studied composition, or locked yourself in a room to learn music production? Give us the backstory. *</label>
                      <textarea
                        required
                        name="trainingDetails"
                        value={formData.trainingDetails}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* 3. The "What": Your Fingerprint */}
                <div className="space-y-6 pt-4">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">
                      3. The "What": Your Fingerprint
                    </h3>
                    <p className="text-sm sm:text-base text-cream-dark/70 font-alan-sans">
                      What makes your sound yours?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Core Skills: What is your "primary" weapon? (e.g., Lyric writing, soulful vocals, complex arrangements). *</label>
                      <textarea
                        required
                        name="coreSkills"
                        value={formData.coreSkills}
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Strengths & Uniqueness: In a world full of music, what is that one thing you do that nobody else can? What’s your "X-factor"? *</label>
                      <textarea
                        required
                        name="strengthsUniqueness"
                        value={formData.strengthsUniqueness}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">The Daily Grind: How many hours a day do you honestly dedicate to your craft? *</label>
                      <input
                        required
                        type="text"
                        name="dailyTime"
                        value={formData.dailyTime}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Lineage: Do you have a Guruji or Mentor who has shaped your journey?</label>
                      <input
                        type="text"
                        name="mentorName"
                        value={formData.mentorName}
                        onChange={handleChange}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. The "Where": Your Current Pulse */}
                <div className="space-y-6 pt-4">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">
                      4. The "Where": Your Current Pulse
                    </h3>
                    <p className="text-sm sm:text-base text-cream-dark/70 font-alan-sans">
                      Let’s look at the data and the gear.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Track Record: How many songs have you officially released, and how many live shows have you headlined or performed at? *</label>
                      <div className="space-y-4">
                        <input
                          required
                          type="number"
                          name="songsReleased"
                          placeholder="Songs Released"
                          value={formData.songsReleased}
                          onChange={handleChange}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                        />
                        <input
                          required
                          type="number"
                          name="showsPerformed"
                          placeholder="Live Shows Performed"
                          value={formData.showsPerformed}
                          onChange={handleChange}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">The Tribe: Who is listening to you right now? Describe your current fan base (Age, vibe, location). *</label>
                      <textarea
                        required
                        name="currentFans"
                        value={formData.currentFans}
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">The Toolkit: What does your setup look like? Mention your DAW (Logic, Ableton, FL Studio, etc.), any specific studio gear, or awards you’ve picked up along the way. *</label>
                      <textarea
                        required
                        name="currentSetup"
                        value={formData.currentSetup}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Current Projects: What’s cooking in the studio right now? (New singles, music videos, or tour prep). *</label>
                      <textarea
                        required
                        name="currentlyWorkingOn"
                        value={formData.currentlyWorkingOn}
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Discipline: What does your daily practice (Riyaaz) look like? Beyond music, do you have rituals (Gym, Meditation, Yoga) that keep your mind sharp? *</label>
                      <textarea
                        required
                        name="dailyRituals"
                        value={formData.dailyRituals}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* 5. The "Next Step": What do you need? */}
                <div className="space-y-6 pt-4">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">
                      5. The "Next Step": What do you need?
                    </h3>
                    <p className="text-sm sm:text-base text-cream-dark/70 font-alan-sans">
                      Growth requires resources. Be specific about what would change the game for you.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Skill Gaps: What do you want to learn next? *</label>
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
                      <label className="text-sm font-semibold text-cream-dark/90">Guidance: What kind of mentorship are you looking for? *</label>
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
                      <label className="text-sm font-semibold text-cream-dark/90">Curation: Do you need help polishing your audio, video, artwork, or live stage design? *</label>
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
                      <label className="text-sm font-semibold text-cream-dark/90">The Fandom Engine: What’s missing in your growth? (e.g., Better distribution, social media content strategy, tour bookings, or high-level collaborations). *</label>
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
                </div>

                {/* 6. The Aspirational Goal */}
                <div className="space-y-6 pt-4">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">
                      6. The Aspirational Goal
                    </h3>
                    <p className="text-sm sm:text-base text-cream-dark/70 font-alan-sans">
                      Imagine it is exactly one year from today. You are looking back at your most successful year ever.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">
                        What is your "North Star" goal for the next 12 months? (Think big—beyond what you think is "realistic." Is it a certain festival slot? A million streams? A specific collaboration?) *
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
                  </div>
                </div>

                {/* 7. Open Mic */}
                <div className="space-y-6 pt-4">
                  <div className="border-b border-white/10 pb-3">
                    <h3 className="text-2xl sm:text-3xl font-bold text-cream font-alan-sans mb-1">
                      7. Open Mic
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-cream-dark/90">Is there anything else we missed? Use this space to share any stories, thoughts, or visions that don't fit into a box.</label>
                      <textarea
                        name="anythingElse"
                        value={formData.anythingElse}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-cream focus:border-teal-light focus:ring-1 focus:ring-teal-light outline-none transition-all resize-none"
                      ></textarea>
                    </div>
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
