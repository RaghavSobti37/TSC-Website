import React, { useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import WixHdcHeader from './WixHdcHeader';
import { WixReveal } from './WixReveal';

const IMG = '/images/wix/harshadduhita';

const MILESTONES = [
  {
    year: '2024',
    title: "India's Got Talent",
    desc: "Season 11 Semi-finalists on Sony TV's global reality franchise, bringing Indian classical music to mainstream audiences.",
  },
  {
    year: '2026',
    title: 'Padma Shri Mahendra Kapoor Award',
    desc: 'Awarded for outstanding contributions to contemporary Indian music.',
  },
  {
    year: '2024',
    title: 'Single : Gananayaka',
    desc: 'MiMa award-winning devotional anthem that became a viral Ganpati release across digital platforms.',
  },
];

const TAGS = [
  'SUFI MUSIC',
  'SEMI CLASSICAL',
  'MARATHI MUSICALS',
  'GHAZALS',
  'ORIGINAL COMPOSITIONS',
  'Contemporary Fusion Sets',
  'BHAJANS',
  'INDIAN FOLK MUSIC',
  'Devotional ConcertS',
  'BOLLYWOOD CLASSICS',
];

const TRACKS = [
  {
    title: 'Gananayaka',
    type: 'Devotional / Original Composition',
    image: `${IMG}/gananayaka.jpg`,
    href: 'https://www.youtube.com/watch?v=IcknSFj2rys',
  },
  {
    title: 'Murchana',
    type: 'Original Composition',
    image: `${IMG}/murchana.jpg`,
    href: 'https://www.youtube.com/@theHarshaduhitacollective',
  },
  {
    title: 'IGT Highlights',
    type: "India's Got Talent Season 11",
    image: `${IMG}/igt.png`,
    href: 'https://www.youtube.com/watch?v=_PRy2jW7t0c',
  },
];

const SOCIAL = [
  { label: 'Harshad Golesar', href: 'https://www.instagram.com/harshad_golesar/', icon: 'IG' },
  { label: 'Harshaduhita Collective', href: 'https://www.instagram.com/harshaduhita_collective/', icon: 'IG' },
  { label: 'Duhita Golesar Spotify', href: 'https://open.spotify.com/artist/6L88xirodmbWYoZuvseUnc', icon: 'SP' },
];

function HeroWave() {
  return (
    <div className="wix-hdc-wave" aria-hidden>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fill="#FFECD1"
          d="M0,48 C120,62 240,20 360,36 C480,52 600,68 720,56 C840,44 960,24 1080,40 C1200,56 1320,72 1440,52 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  );
}

function HeroBlock({ mobile }: { mobile?: boolean }) {
  return (
    <section className={`wix-hdc-hero wix-hdc-hero--${mobile ? 'mobile' : 'desktop'}`}>
      <div className="wix-hdc-hero-bg">
        <img
          src={mobile ? `${IMG}/hero-mobile.jpg` : `${IMG}/hero-desktop.jpg`}
          alt="Harshad & Duhita"
        />
        <div className="wix-hdc-hero-pattern" />
        <div className="wix-hdc-hero-overlay" />
      </div>

      <div className="wix-hdc-hero-content">
        <WixReveal>
          <div className="wix-hdc-award">Winner - PADMA SHRI MAHENDRA KAPOOR AWARD 2026</div>
        </WixReveal>
        <WixReveal delay={1}>
          <h1>Harshaduhita Collective</h1>
        </WixReveal>
        <WixReveal delay={2}>
          <p className="wix-hdc-hero-tagline">
            A live music duo blending deep-rooted Indian classical music with divine emotion and diverse
            musical expression.
          </p>
        </WixReveal>
      </div>

      <div className="wix-hdc-hero-cta">
        <WixReveal delay={3}>
          <a href="mailto:artist@theshakticollective.in" className="wix-hdc-btn-primary">
            Book for Events
          </a>
        </WixReveal>
        <WixReveal delay={3}>
          <a href="#discography" className="wix-hdc-btn-outline">
            Explore Music
          </a>
        </WixReveal>
      </div>

      <HeroWave />
    </section>
  );
}

export default function HarshadDuhitaWixPage() {
  useEffect(() => {
    document.documentElement.classList.add('wix-hdc-active');
    document.body.classList.add('wix-hdc-active');
    return () => {
      document.documentElement.classList.remove('wix-hdc-active');
      document.body.classList.remove('wix-hdc-active');
    };
  }, []);

  return (
    <div className="wix-hdc-root">
      <Head>
        <title>Harshad Duhita | TSC</title>
        <link rel="stylesheet" href="/wix-clone/harshadduhita.css" />
        <meta
          name="description"
          content="Harshaduhita Collective — a live music duo blending deep-rooted Indian classical music with divine emotion and diverse musical expression."
        />
        <meta property="og:title" content="Harshaduhita Collective | TSC" />
        <meta property="og:image" content={`${IMG}/hero-desktop.jpg`} />
      </Head>

      <WixHdcHeader />

      <main>
        <HeroBlock />
        <HeroBlock mobile />

        {/* Who Are We */}
        <section className="wix-hdc-section wix-hdc-who">
          <div className="wix-hdc-container">
            <WixReveal>
              <h2 className="wix-hdc-eyebrow">Who Are We?</h2>
              <h3 className="wix-hdc-subhead">Deep Rooted • Divine • Diverse</h3>
            </WixReveal>
            <WixReveal delay={1}>
              <p className="wix-hdc-body wix-hdc-who-intro">
                Rooted in the traditions of the Rampur and Jaipur Gharanas, Harshad and Duhita bring together
                bhajans, sufi, folk, ghazals, and contemporary live arrangements into one emotionally powerful
                performance experience.
              </p>
            </WixReveal>

            <div className="wix-hdc-who-grid">
              <WixReveal className="wix-hdc-gallery" delay={2}>
                <div className="img-tall">
                  <img src={`${IMG}/gallery-8.jpg`} alt="Harshad & Duhita performance" />
                </div>
                <div className="img-tall img-offset">
                  <img src={`${IMG}/gallery-13.jpg`} alt="Harshad & Duhita on stage" />
                </div>
              </WixReveal>

              <WixReveal className="wix-hdc-who-bios" delay={1}>
                <div>
                  <h4>Duhita Golesar</h4>
                  <p className="wix-hdc-body">
                    Raised in a family steeped in classical recordings, she is a University of Mumbai Gold Medalist,
                    trained in the Jaipur Gharana, and a successful playback singer for films like Navra Maza
                    Navsacha 2.
                  </p>
                </div>
                <div>
                  <h4>Harshad Golesar</h4>
                  <p className="wix-hdc-body">
                    Hailing from a 12th-generation temple lineage, he is a Sangeet Visharad trained in the Rampur
                    Gharana and a MiMa award-winning composer.
                  </p>
                </div>
                <p className="wix-hdc-who-together">
                  Together, they create a sound that feels deeply rooted yet contemporary.
                </p>
                <img src={`${IMG}/gharana-logo.png`} alt="Jaipur Gharana Rampur Gharana" className="wix-hdc-gharana" />
              </WixReveal>
            </div>
          </div>
        </section>

        {/* Achievements */}
        <section className="wix-hdc-section wix-hdc-achieve">
          <div className="wix-hdc-container">
            <div className="wix-hdc-achieve-grid">
              <WixReveal>
                <h2>Achievements &amp; Milestones</h2>
                {MILESTONES.map((m) => (
                  <div key={m.title} className="wix-hdc-milestone">
                    <div>
                      <p className="wix-hdc-milestone-year">{m.year}</p>
                      <h4>{m.title}</h4>
                      <p className="wix-hdc-body">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </WixReveal>
              <WixReveal delay={2}>
                <div className="wix-hdc-milestone-photo">
                  <img src={`${IMG}/milestones.jpg`} alt="Harshad & Duhita with audience" />
                </div>
              </WixReveal>
            </div>
          </div>
        </section>

        {/* Live Spectacle */}
        <section className="wix-hdc-section wix-hdc-spectacle">
          <div className="wix-hdc-container">
            <WixReveal>
              <p className="wix-hdc-spectacle-label">THE LIVE SPECTACLE</p>
              <h2>Emotionally Immersive Performances</h2>
              <p className="wix-hdc-spectacle-desc">
                From intimate baithaks to large-format cultural stages, Harshaduhita Collective creates emotionally
                immersive live performances rooted in Indian musical traditions.
              </p>
            </WixReveal>
            <WixReveal delay={1}>
              <div className="wix-hdc-tags">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className={`wix-hdc-tag ${tag === 'Contemporary Fusion Sets' ? 'wix-hdc-tag--mixed' : ''}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="wix-hdc-decor">
                <img src={`${IMG}/decor-22.png`} alt="" width={100} height={50} />
              </div>
            </WixReveal>
          </div>
        </section>

        {/* Discography */}
        <section id="discography" className="wix-hdc-section wix-hdc-disco">
          <div className="wix-hdc-container">
            <WixReveal>
              <h2>Discography</h2>
              <p className="wix-hdc-disco-sub">Featured tracks</p>
            </WixReveal>
            <div className="wix-hdc-disco-grid">
              {TRACKS.map((track, i) => (
                <WixReveal key={track.title} delay={(i % 3) as 0 | 1 | 2}>
                  <a href={track.href} target="_blank" rel="noopener noreferrer" className="wix-hdc-disco-card">
                    <img src={track.image} alt={track.title} />
                    <div className="wix-hdc-disco-card-body">
                      <h3>{track.title}</h3>
                      <p>{track.type}</p>
                    </div>
                  </a>
                </WixReveal>
              ))}
            </div>
            <div className="wix-hdc-decor" style={{ marginTop: 48 }}>
              <img src={`${IMG}/decor-22-alt.png`} alt="" width={100} height={50} />
            </div>
          </div>
        </section>

        {/* Connect */}
        <section className="wix-hdc-section wix-hdc-connect">
          <div className="wix-hdc-container">
            <div className="wix-hdc-connect-grid">
              <WixReveal>
                <div className="wix-hdc-connect-photo">
                  <img src={`${IMG}/connect-bg.jpg`} alt="Harshad & Duhita" />
                </div>
              </WixReveal>
              <WixReveal delay={1}>
                <p className="wix-hdc-connect-label">CONNECT</p>
                <h2>Digital Presence</h2>
                <div className="wix-hdc-social">
                  {SOCIAL.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                      <span className="wix-hdc-social-icon">{s.icon}</span>
                      {s.label}
                    </a>
                  ))}
                </div>
              </WixReveal>
            </div>
          </div>
        </section>

        {/* Perfect For */}
        <section className="wix-hdc-perfect">
          <div className="wix-hdc-perfect-bg">
            <img src={`${IMG}/connect-bg.jpg`} alt="" />
            <div className="wix-hdc-perfect-overlay" />
          </div>
          <WixReveal className="wix-hdc-perfect-content">
            <h2>Perfect For</h2>
            <p>Corporate &amp; Leadership Events</p>
            <a
              href="mailto:artist@theshakticollective.in"
              className="wix-hdc-btn-primary"
              style={{ marginTop: 32, display: 'inline-flex' }}
            >
              Book for Events
            </a>
          </WixReveal>
        </section>
      </main>

      <footer className="wix-hdc-footer">
        <ul className="wix-hdc-footer-nav">
          {[
            { label: 'About', href: '/about' },
            { label: 'Work', href: '/ip' },
            { label: 'Artists', href: '/artists' },
            { label: 'Resources', href: '/resources' },
            { label: 'TSC Academy', href: '/tscacademy' },
            { label: 'Stories', href: '/stories' },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <p>© {new Date().getFullYear()} The Shakti Collective</p>
      </footer>
    </div>
  );
}
