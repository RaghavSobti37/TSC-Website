export const freeTools = [
  { name: 'Waveform Free', category: 'Digital Audio Workstation', use: 'Cross-platform production with unlimited tracks and VST/AU hosting.', link: 'https://www.tracktion.com/products/waveform-free' },
  { name: 'Cakewalk Sonar', category: 'Digital Audio Workstation', use: 'Windows production workspace with ProChannel console modeling.', link: 'https://www.cakewalk.com/' },
  { name: 'BandLab', category: 'Digital Audio Workstation', use: 'Cloud-native browser workspace for remote multi-user tracking.', link: 'https://bandlab.com' },
  { name: 'Audacity', category: 'Audio Editor & Workstation', use: 'Open-source multi-track editor for recording and vocal repairs.', link: 'https://audacityteam.org' },
  { name: 'Soundtrap', category: 'Digital Audio Workstation', use: 'Spotify-backed online workspace for composition and tracking.', link: 'https://soundtrap.com' },
  { name: 'Vital', category: 'Virtual Instrument (Synth)', use: 'Spectral-warping wavetable synthesizer with deep modulation.', link: 'https://vital.audio' },
  { name: 'Surge XT', category: 'Virtual Instrument (Synth)', use: 'Open-source hybrid synthesizer with wavetable and FM engines.', link: 'https://surge-synthesizer.github.io' },
  { name: 'Valhalla Supermassive', category: 'Audio Effect (Reverb/Delay)', use: 'Mass spatial echo processor for cavernous reverbs.', link: 'https://valhalladsp.com/shop/reverb/valhalla-supermassive/' },
  { name: 'Youlean Loudness Meter', category: 'Audio Utility (Metering)', use: 'Loudness monitoring with true peak and integrated LUFS.', link: 'https://youlean.co/download-youlean-loudness-meter/' },
  { name: 'RouteNote', category: 'Music Distribution', use: 'Independent digital distribution to major stores.', link: 'https://routenote.com' },
  { name: 'linksr.io', category: 'Smart Links & Marketing', use: 'Fan landing nodes with pre-save automation and storefronts.', link: 'https://linksr.io' },
  { name: 'Feature.fm', category: 'Smart Links & Marketing', use: 'Pre-save tracking, landing hubs, and ad retargeting.', link: 'https://feature.fm' },
  { name: 'SonoBus', category: 'Remote Collaboration', use: 'Peer-to-peer real-time audio broadcasting across networks.', link: 'https://sonobus.net' },
  { name: 'StemSplit', category: 'Audio Isolation', use: 'AI processor separating mixed tracks into vocal and backing layers.', link: 'https://stemsplit.io' },
] as const;

export const caseStudies = [
  {
    slug: 'kalki',
    title: 'Kalki',
    tagline: 'Cultural branding and storytelling initiative exploring ancient narratives in modern formats.',
  },
  {
    slug: 'mahaavatar-narsimha',
    title: 'Mahaavatar Narsimha',
    tagline: 'Modern animated feature strategy and global monetization.',
  },
  {
    slug: 'hanuman-ansh',
    title: 'Hanuman Ansh',
    tagline: 'Original IP development centered on heroic cultural archetypes.',
  },
  {
    slug: 'jai-jagannath',
    title: 'Jai Jagannath',
    tagline: 'Cultural resonance project celebrating regional heritage.',
  },
] as const;

export const academyContent = {
  headline: 'Learn from the Maestros.',
  subheadline:
    'Structured mentorship designed to help artists move from uncertainty to artistic clarity.',
  courses: [
    {
      slug: 'composition-comprehensive',
      title: 'The heART of Composition',
      mentor: 'Sandesh Shandilya',
      href: '/masterclass/sandesh-shandilya',
    },
    {
      slug: 'hindustani-classical',
      title: 'Roots of Hindustani Classical',
      mentor: 'Prasad Khaparde',
      href: '/courses/hindustani-classical',
    },
    {
      slug: 'music-production',
      title: 'A–Z of Music Production',
      mentor: 'Luca Petracca',
      href: '/courses/music-production',
    },
  ],
  testimonials: [
    {
      name: 'Shradha Mishra',
      quote:
        'Sandesh Sir has been my guiding angel… the reason I walk this musical journey with confidence.',
    },
    {
      name: 'Deepank Soni',
      quote: 'Pure gold… reveals the true philosophy and inner world of creation.',
    },
    {
      name: 'Vasav Vashisht',
      quote: 'Helps a musician bring out emotions perfectly in their compositions.',
    },
  ],
} as const;
