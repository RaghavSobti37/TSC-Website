/**
 * Wix blank-10 — converted React page (no Thunderbolt).
 */
import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import B10Header from './B10Header';
import { SmoothScroll } from '@/components/animations/SmoothScroll';
import { WixMotion, BlurReveal } from '@/components/wix/WixMotion';

const I = '/images/wix/harshadduhita';

const MILESTONES = [
  {
    year: '2024',
    title: "India's Got Talent",
    body: "Season 11 Semi-finalists on Sony TV's global reality franchise, bringing Indian classical music to mainstream audiences.",
  },
  {
    year: '2026',
    title: 'Padma Shri Mahendra Kapoor Award',
    body: 'Awarded for outstanding contributions to contemporary Indian music.',
  },
  {
    year: '2024',
    title: 'Single : Gananayaka',
    body: 'MiMa award-winning devotional anthem that became a viral Ganpati release across digital platforms.',
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
    sub: 'Devotional / Original Composition',
    img: `${I}/gananayaka.jpg`,
    href: 'https://open.spotify.com/track/1utLt90yMwsYKYGAFqWOB5',
  },
  {
    title: 'Murchana',
    sub: 'Original Composition',
    img: `${I}/murchana.jpg`,
    href: 'https://www.youtube.com/@theHarshaduhitacollective',
  },
  {
    title: 'IGT Highlights',
    sub: "India's Got Talent Season 11",
    img: `${I}/igt.png`,
    href: 'https://www.youtube.com/watch?v=_PRy2jW7t0c',
  },
];

const SOCIAL = [
  { label: 'Harshad Golesar', href: 'https://www.instagram.com/harshad_golesar/' },
  { label: 'Harshaduhita Collective', href: 'https://www.instagram.com/harshaduhita_collective/' },
  { label: 'Duhita Golesar', href: 'https://www.instagram.com/duhita_harshad/' },
  { label: 'Duhita Golesar Spotify', href: 'https://open.spotify.com/artist/6L88xirodmbWYoZuvseUnc' },
];

function HeroSection({ mobile }: { mobile?: boolean }) {
  const id = mobile ? 'comp-mqffd5wc' : 'comp-mq6h99jp';
  return (
    <section id={id} className={`b10-hero ${mobile ? 'b10-hero--mobile' : 'b10-hero--desktop'}`}>
      <div className="b10-hero__bg">
        <BlurReveal
          src={mobile ? `${I}/hero-mobile.jpg` : `${I}/hero-desktop.jpg`}
          alt=""
          imgClassName="b10-hero__bg-img"
        />
        <div className="b10-hero__pattern" />
        <div className="b10-hero__shade" />
      </div>

      <div className="b10-hero__content">
        <WixMotion preset="fade-up">
          <p className="b10-hero__award">Winner - PADMA SHRI MAHENDRA KAPOOR AWARD 2026</p>
        </WixMotion>
        <WixMotion preset="fade-up" delay={100}>
          <h1 className="b10-hero__title">Harshaduhita Collective</h1>
        </WixMotion>
        <WixMotion preset="fade-up" delay={200}>
          <p className="b10-hero__tagline">
            A live music duo blending deep-rooted Indian classical music with divine emotion and diverse musical
            expression.
          </p>
        </WixMotion>
      </div>

      <div className="b10-hero__cta">
        <WixMotion preset="fade-up" delay={300}>
          <a href="mailto:artist@theshakticollective.in" className="b10-btn b10-btn--fill">
            Book for Events
          </a>
        </WixMotion>
        <WixMotion preset="fade-up" delay={380}>
          <a href="#comp-mq7z6hk6" className="b10-btn b10-btn--ghost">
            Explore Music
          </a>
        </WixMotion>
      </div>

      <div className="b10-hero__wave" aria-hidden>
        <img src={`${I}/wave-divider.svg`} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>
    </section>
  );
}

export default function Blank10Page() {
  useEffect(() => {
    document.documentElement.classList.add('b10-active');
    document.body.classList.add('b10-active');
    return () => {
      document.documentElement.classList.remove('b10-active');
      document.body.classList.remove('b10-active');
    };
  }, []);

  return (
    <SmoothScroll>
      <div className="b10" data-wix-source="blank-10">
        <Head>
          <title>Harshad Duhita | TSC</title>
          <link rel="stylesheet" href="/wix-clone/blank-10.css" />
          <link rel="stylesheet" href="/fonts/wix/wix-blank10.css" />
          <meta
            name="description"
            content="Harshaduhita Collective — a live music duo blending deep-rooted Indian classical music with divine emotion and diverse musical expression."
          />
        </Head>

        <B10Header />

        <main className="b10-main">
          <HeroSection />
          <HeroSection mobile />

          <section id="comp-mq7lr7m2" className="b10-who">
            <div className="b10-wrap">
              <WixMotion preset="fade-up">
                <h2 className="b10-who__title">Who Are We?</h2>
                <p className="b10-who__subtitle">Deep Rooted • Divine • Diverse</p>
              </WixMotion>
              <WixMotion preset="fade-up" delay={120}>
                <p className="b10-who__intro">
                  Rooted in the traditions of the Rampur and Jaipur Gharanas, Harshad and Duhita bring together bhajans,
                  sufi, folk, ghazals, and contemporary live arrangements into one emotionally powerful performance
                  experience.
                </p>
              </WixMotion>
              <div className="b10-who__bios">
                <WixMotion preset="fade-up" delay={80}>
                  <div className="b10-who__bio">
                    <h3>Duhita Golesar</h3>
                    <p>
                      Raised in a family steeped in classical recordings, she is a University of Mumbai Gold Medalist,
                      trained in the Jaipur Gharana, and a successful playback singer for films like Navra Maza Navsacha 2.
                    </p>
                  </div>
                </WixMotion>
                <WixMotion preset="fade-up" delay={160}>
                  <div className="b10-who__bio">
                    <h3>Harshad Golesar</h3>
                    <p>
                      Hailing from a 12th-generation temple lineage, he is a Sangeet Visharad trained in the Rampur
                      Gharana and a MiMa award-winning composer.
                    </p>
                  </div>
                </WixMotion>
              </div>
              <WixMotion preset="fade-up" delay={240}>
                <p className="b10-who__together">
                  Together, they create a sound that feels deeply rooted yet contemporary.
                </p>
              </WixMotion>
            </div>
          </section>

          <section id="comp-mq6ig1tw" className="b10-achieve">
            <div className="b10-wrap b10-achieve__grid">
              <div className="b10-achieve__copy">
                <WixMotion preset="fade-up">
                  <h2 className="b10-achieve__title">Achievements &amp; Milestones</h2>
                </WixMotion>
                {MILESTONES.map((m, i) => (
                  <WixMotion key={m.title} preset="fade-up" delay={i * 90}>
                    <article className="b10-milestone">
                      <span className="b10-milestone__year">{m.year}</span>
                      <h3>{m.title}</h3>
                      <p>{m.body}</p>
                    </article>
                  </WixMotion>
                ))}
              </div>
              <div className="b10-achieve__visuals">
                <WixMotion preset="fade-up" delay={100}>
                  <div className="b10-collage">
                    <BlurReveal src={`${I}/gallery-8.jpg`} alt="" imgClassName="b10-collage__a" />
                    <BlurReveal src={`${I}/gallery-13.jpg`} alt="" imgClassName="b10-collage__b" />
                    <BlurReveal src={`${I}/milestones.jpg`} alt="" imgClassName="b10-collage__c" />
                  </div>
                </WixMotion>
                <WixMotion preset="fade-up" delay={200}>
                  <img className="b10-gharana" src={`${I}/gharana-logo.png`} alt="Jaipur Gharana Rampur Gharana" />
                </WixMotion>
              </div>
            </div>
          </section>

          <section id="comp-mq7r4iw7" className="b10-spectacle">
            <div className="b10-wrap">
              <WixMotion preset="fade-up">
                <p className="b10-spectacle__eyebrow">THE LIVE SPECTACLE</p>
                <h2 className="b10-spectacle__title">Emotionally Immersive Performances</h2>
                <p className="b10-spectacle__body">
                  From intimate baithaks to large-format cultural stages, Harshaduhita Collective creates emotionally
                  immersive live performances rooted in Indian musical traditions.
                </p>
              </WixMotion>
              <WixMotion preset="fade-up" delay={150}>
                <div className="b10-tags">
                  {TAGS.map((t) => (
                    <span key={t} className={`b10-tag ${t === 'Contemporary Fusion Sets' ? 'b10-tag--mixed' : ''}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </WixMotion>
            </div>
          </section>

          <section id="comp-mq7z6hk6" className="b10-disco">
            <div className="b10-wrap">
              <WixMotion preset="fade-up">
                <h2 className="b10-disco__title">Discography</h2>
                <p className="b10-disco__sub">Featured tracks</p>
              </WixMotion>
              <div className="b10-disco__grid">
                {TRACKS.map((t, i) => (
                  <WixMotion key={t.title} preset="fade-up" delay={i * 100}>
                    <a className="b10-track" href={t.href} target="_blank" rel="noopener noreferrer">
                      <BlurReveal src={t.img} alt={t.title} imgClassName="b10-track__img" />
                      <div className="b10-track__meta">
                        <h3>{t.title}</h3>
                        <p>{t.sub}</p>
                      </div>
                    </a>
                  </WixMotion>
                ))}
              </div>
              <div className="b10-disco__decor">
                <img src={`${I}/decor-22.png`} alt="" />
                <img src={`${I}/decor-22-alt.png`} alt="" />
              </div>
            </div>
          </section>

          <section id="comp-mq84m6ve" className="b10-connect">
            <div className="b10-wrap b10-connect__grid">
              <WixMotion preset="fade-up" className="b10-connect__art">
                <img src={`${I}/connect-overlay.png`} alt="" className="b10-connect__overlay" />
                <BlurReveal src={`${I}/connect-bg.jpg`} alt="Harshad & Duhita" imgClassName="b10-connect__photo" />
              </WixMotion>
              <div className="b10-connect__links">
                <WixMotion preset="fade-up">
                  <p className="b10-connect__label">CONNECT</p>
                  <h2 className="b10-connect__title">Digital Presence</h2>
                </WixMotion>
                <div className="b10-social-btns">
                  {SOCIAL.map((s, i) => (
                    <WixMotion key={s.label} preset="fade-up" delay={i * 70}>
                      <a className="b10-social-btn" href={s.href} target="_blank" rel="noopener noreferrer">
                        {s.label}
                      </a>
                    </WixMotion>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="comp-mqgaclmh" className="b10-perfect">
            <img className="b10-perfect__bg" src={`${I}/connect-bg.jpg`} alt="" />
            <div className="b10-perfect__overlay" />
            <WixMotion preset="fade-up" className="b10-perfect__inner">
              <h2>Perfect For</h2>
              <p>Corporate &amp; Leadership Events</p>
            </WixMotion>
          </section>
        </main>

        <footer className="b10-footer">
          <nav>
            {[
              ['About', '/about'],
              ['Work', '/ip'],
              ['Artists', '/artists'],
              ['Resources', '/resources'],
              ['TSC Academy', '/tscacademy'],
              ['Stories', '/stories'],
            ].map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
          </nav>
          <p>© {new Date().getFullYear()} The Shakti Collective</p>
        </footer>
      </div>
    </SmoothScroll>
  );
}
