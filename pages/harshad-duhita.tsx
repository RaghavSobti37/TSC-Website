import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaYoutube, FaInstagram, FaSpotify, FaStar, FaCalendarCheck, FaMicrophoneAlt, FaAward, FaMusic } from 'react-icons/fa';

const HarshadDuhitaPage = () => {
  const achievements = [
    {
      year: "2024",
      title: "India's Got Talent Season 11",
      desc: "Golden Buzzer Winners & Semi-Finalists. Stunned the judges with their powerful 'Couple Singing' classical fusion.",
      icon: FaAward,
    },
    {
      year: "2024",
      title: "Viral Ganpati Release",
      desc: "'Gananayaka' (गणनायका) - A spiritual anthem that garnered massive social media attention.",
      icon: FaStar,
    },
    {
      year: "2023",
      title: "Original Soundtracks",
      desc: "Featured artists for the 'Raudra' Original Motion Picture Soundtrack.",
      icon: FaMusic,
    }
  ];

  const discography = [
    {
      title: "Gananayaka (Ganpati Song 2024)",
      type: "Devotional / Festive",
      spotify: "https://open.spotify.com/track/1utLt90yMwsYKYGAFqWOB5?si=6832f0a99fef4270",
      youtube: "https://www.youtube.com/watch?v=IcknSFj2rys"
    },
    {
      title: "Param Gahan Ish Kam",
      type: "Film Soundtrack (Raudra)",
      spotify: "https://open.spotify.com/track/3es2nsPDv6vOGc5sDMpCCS?si=abfe5d261c36482c",
    },
    {
      title: "Mere Bhole Bhandari",
      type: "Devotional",
      spotify: "https://open.spotify.com/track/0tgoY5Jz0Aa4QMDLSzoWNq?si=a6a35142d9ab4404",
    },
    {
      title: "Firale Te Nate Sare",
      type: "Classical Fusion",
      spotify: "https://open.spotify.com/track/1LpEXQtqUVP0Wk4rih6BBs?si=d72f1c8a7fc14660",
    },
    {
      title: "Raudra (Original Motion Picture Soundtrack)",
      type: "EP / Album",
      spotify: "https://open.spotify.com/album/0KMIJQiBrMBwHtsAWtCLpG?si=1JRO85ZMRFODvi5uqKrEZQ",
    }
  ];

  return (
    <div className="bg-cream selection:bg-orange selection:text-white">
      <Head>
        <title>Harshad & Duhita | Official Artist Page | TSC</title>
        <meta name="description" content="Official website of Harshad & Duhita. Golden Buzzer winners on India's Got Talent. Explore their music, discography, and book them for events." />
      </Head>

      {/* 1. Media / Hero Section - Blur Preserved Setup */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-32 overflow-hidden bg-black">
        {/* Blurred Background to fill space without stretching */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/artists/hnd-singing-2.jpeg"
            alt="Background Blur"
            fill
            className="object-cover opacity-30 blur-2xl scale-110"
            priority
          />
        </div>
        
        {/* Sharp Center Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/artists/hnd-singing-2.jpeg"
            alt="Harshad & Duhita Live"
            fill
            className="object-contain opacity-80"
            priority
          />
          {/* Top Blur/Gradient to prevent white space and blend with navbar */}
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black via-black/40 to-transparent h-[40%] blur-xl opacity-90 z-10 pointer-events-none" />
          {/* Bottom Gradient Blend */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/20 to-transparent h-32 z-10 pointer-events-none" />
        </div>

        <div className="relative z-20 container mx-auto px-4 text-center flex flex-col justify-between md:justify-center items-center h-[75vh] md:h-auto mt-4 md:mt-0 pb-10 md:pb-0">
          <div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-orange font-bold text-sm mb-4 md:mb-8"
            >
              <FaAward /> IGT SEASON 11 GOLDEN BUZZER
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-6xl md:text-9xl font-signika font-bold text-white mb-6 tracking-tighter drop-shadow-2xl"
            >
              Harshad & Duhita
            </motion.h1>
          </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-12 md:bottom-[8%] left-0 right-0 flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 w-full px-4 z-30"
        >
          <button
            onClick={() => document.getElementById('book-now')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-orange text-white font-bold text-lg md:text-xl hover:scale-105 transition-transform shadow-2xl shadow-orange/30 w-full sm:w-auto"
          >
            Book for Events
          </button>
          <a
            href="#discography"
            className="px-8 md:px-10 py-4 md:py-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg md:text-xl hover:bg-white/20 transition-all shadow-xl w-full sm:w-auto"
          >
            Explore Music
          </a>
        </motion.div>
      </section>

      {/* 2. Experience Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-orange uppercase tracking-widest mb-4">Milestones</h2>
              <h3 className="text-4xl md:text-7xl font-signika font-bold text-slate-dark mb-12 tracking-tighter">The Sound of Success</h3>
              <div className="space-y-12">
                {achievements.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex gap-6"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange text-xl">
                      <item.icon />
                    </div>
                    <div>
                      <h4 className="text-2xl font-signika font-bold text-slate-dark mb-2">{item.title}</h4>
                      <p className="text-slate-medium font-alan-sans leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/5] md:aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-cream">
              <Image
                src="/artists/hnd-audience-3.jpeg"
                alt="Audience Energy"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-orange/10 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Discography Section */}
      <section id="discography" className="py-24 bg-slate-dark text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 gap-6 text-center md:text-left">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-orange uppercase tracking-widest mb-4">Song Catalogue</h2>
              <h3 className="text-4xl md:text-6xl font-signika font-bold">Featured Tracks</h3>
            </div>
            <div className="flex justify-center md:justify-end gap-4">
              <a href="https://open.spotify.com/artist/6L88xirodmbWYoZuvseUnc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954] text-white font-bold hover:scale-105 transition-transform">
                <FaSpotify /> Spotify
              </a>
              <a href="https://www.youtube.com/watch?v=IcknSFj2rys" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF0000] text-white font-bold hover:scale-105 transition-transform">
                <FaYoutube /> YouTube
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {discography.map((song, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-3xl border border-white/10 hover:bg-white/5 transition-all gap-4"
              >
                <div>
                  <h4 className="text-xl md:text-2xl font-signika font-bold group-hover:text-orange transition-colors">{song.title}</h4>
                  <p className="text-white/60 font-alan-sans text-sm uppercase tracking-widest mt-1">{song.type}</p>
                </div>
                <div className="flex items-center gap-4">
                  <a href={song.spotify} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1DB954] transition-all text-xl">
                    <FaSpotify />
                  </a>
                  {song.youtube && (
                    <a href={song.youtube} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#FF0000] transition-all text-xl">
                      <FaYoutube />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bio Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-20 items-center">
            <div className="w-full md:w-5/12">
              <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl">
                <Image
                  src="/artists/hnd-posing.jpeg"
                  alt="Harshad & Duhita Portrait"
                  fill
                  className="object-cover object-[center_20%] md:object-center"
                />
              </div>
            </div>
            <div className="w-full md:w-7/12">
              <h2 className="text-sm font-bold text-orange uppercase tracking-widest mb-4">About the Harshad & Duhita Collective</h2>
              <h3 className="text-4xl md:text-5xl font-signika font-bold text-slate-dark mb-8">Deep Rooted • Divine • Diverse</h3>
              <div className="space-y-6 text-slate-medium font-alan-sans text-lg leading-relaxed">
                <p>
                  The Harshad & Duhita Collective is a premier musical ensemble that redefines the experience of Indian music. The group’s identity is built on three pillars: a deep-rooted connection to classical heritage, a divine approach to spiritual and soulful melodies, and a diverse repertoire that spans genres. By blending the sophistication of Indian ragas with modern arrangements, the collective creates an immersive journey through Bhajans, Thumris, Ghazals, and Sufi traditions, alongside reimagined Bollywood classics. The ensemble features a rich sonic layer of Keyboards, Guitars, Harmonium, Flute, Tabla, and Drums, making every performance a unique cultural bridge.
                </p>

                <h4 className="text-2xl font-signika font-bold text-slate-dark mt-8 mb-4">Artistic Journey & Achievements</h4>
                <p>
                  Led by the powerhouse duo of Harshad and Duhita Golesar, the collective brings a rare combination of academic excellence and mainstream stardom to the stage. Both artists rose to national prominence as Semifinalists on <strong>India’s Got Talent (Sony TV)</strong> and have been featured on major platforms including Rising Star, Sangeet Samrat, and Sur Nava Dhyas Nava.
                </p>
                
                <p>Their credentials go beyond the screen:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Duhita Golesar:</strong> A Gold Medalist in Bachelor of Music from the University of Mumbai and an M.A. in Music, she is trained in the Jaipur Gharana. Her versatile playback career includes work for Zee Music and the film Navra Maza Navsacha 2.</li>
                  <li><strong>Harshad Golesar:</strong> A Sangeet Visharad trained in the Rampur Gharana, Harshad is a winner of the MiMa Award for his composition 'Gananayaka.' He has represented India at international youth festivals and is a recognized voice in the world of Ghazal and Folk.</li>
                </ul>
                
                <p className="font-bold">
                  Together, they lead a team of world-class musicians, delivering performances that are technically brilliant, emotionally resonant, and designed for a global audience.
                </p>
              </div>

              <div className="mt-12">
                <h4 className="text-xl font-signika font-bold text-slate-dark mb-6">Digital Presence</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="https://www.instagram.com/harshad_golesar/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-lighter hover:border-orange transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-lighter flex items-center justify-center text-xl group-hover:bg-orange group-hover:text-white transition-colors"><FaInstagram /></div>
                    <span className="font-alan-sans font-bold text-sm">Harshad Golesar</span>
                  </a>
                  <a href="https://www.instagram.com/duhita_harshad/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-lighter hover:border-orange transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-lighter flex items-center justify-center text-xl group-hover:bg-orange group-hover:text-white transition-colors"><FaInstagram /></div>
                    <span className="font-alan-sans font-bold text-sm">Duhita Harshad</span>
                  </a>
                  <a href="https://www.instagram.com/harshaduhita_collective/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-lighter hover:border-orange transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-lighter flex items-center justify-center text-xl group-hover:bg-orange group-hover:text-white transition-colors"><FaInstagram /></div>
                    <span className="font-alan-sans font-bold text-sm">Collective</span>
                  </a>
                  <a href="https://open.spotify.com/artist/6L88xirodmbWYoZuvseUnc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-lighter hover:border-[#1DB954] transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-lighter flex items-center justify-center text-xl group-hover:bg-[#1DB954] group-hover:text-white transition-colors"><FaSpotify /></div>
                    <span className="font-alan-sans font-bold text-sm">Spotify</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Booking CTA Section */}
      <section id="book-now" className="py-24 bg-orange">
        <div className="container mx-auto px-4">
          <div className="bg-slate-dark rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full opacity-20">
              <Image
                src="/artists/hnd-audience-2.jpeg"
                alt="Audience"
                fill
                className="object-cover object-bottom md:object-center"
              />
            </div>
            <div className="relative z-10">
              <FaCalendarCheck className="text-6xl text-orange mx-auto mb-10" />
              <h2 className="text-4xl md:text-7xl font-signika font-bold text-white mb-8 tracking-tighter">
                Available for Global Events
              </h2>
              <p className="text-xl md:text-2xl font-alan-sans text-white/70 max-w-3xl mx-auto mb-16 leading-relaxed">
                Experience the Golden Buzzer duo live. From destination weddings to stadium concerts, we bring the soul of classical fusion to your stage.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a
                  href="tel:8390109447"
                  className="w-full md:w-auto px-12 py-6 rounded-full bg-orange text-white font-bold text-2xl hover:scale-105 transition-transform shadow-xl shadow-orange/20"
                >
                  Call to Book
                </a>
                <button
                  onClick={() => window.location.href = '/query'}
                  className="w-full md:w-auto px-12 py-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-2xl hover:bg-white/20 transition-all"
                >
                  Inquire Online
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HarshadDuhitaPage;
