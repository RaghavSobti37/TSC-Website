import { MAILTO } from '@/lib/contacts';
import {
  ARTIST_PATH_FORM_PATH,
  ARTIST_PATH_LANDING_URL,
} from '@/lib/siteUrls';
import { cms } from '@/lib/cms';

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const ROUTES = {
  home: '/',
  about: '/about',
  work: '/ip',
  artists: '/artists',
  resources: '/resources',
  academy: '/tscacademy',
  stories: '/stories',
  collab: '/collab',
  bookArtist: '/query',
  bookCall: '/book-a-call',
  artistPathForm: ARTIST_PATH_FORM_PATH,
  artistPathLanding: '/artist-path',
  artistPathLandingExternal: ARTIST_PATH_LANDING_URL,
} as const;

export const MAIN_NAV: NavLink[] = [
  { label: 'About', href: ROUTES.about },
  { label: 'Work', href: ROUTES.work },
  { label: 'Artists', href: ROUTES.artists },
  { label: 'TSC Academy', href: ROUTES.academy },
  { label: 'Resources', href: ROUTES.resources },
  { label: 'Stories', href: ROUTES.stories },
];

export const I_WANT_TO_NAV: NavLink[] = [
  { label: 'Learn Music', href: ROUTES.academy },
  { label: 'Build Stories', href: ROUTES.stories },
  { label: 'Collab with TSC', href: ROUTES.collab },
  { label: 'Book an Artist', href: ROUTES.bookArtist },
];

export const FOOTER_QUICK_LINKS: NavLink[] = [
  { label: 'About', href: ROUTES.about },
  { label: 'Work', href: ROUTES.work },
  { label: 'Artists', href: ROUTES.artists },
  { label: 'TSC Academy', href: ROUTES.academy },
  { label: 'Resources', href: ROUTES.resources },
  { label: 'Stories', href: ROUTES.stories },
];

export const FOOTER_I_WANT_TO: NavLink[] = I_WANT_TO_NAV;

export const FOOTER_ARTISTS: NavLink[] = [
  { label: 'Artist Path', href: ROUTES.artistPathLanding },
  { label: 'Apply to Artist Path', href: ROUTES.artistPathForm },
  { label: 'Masterclasses', href: '/masterclass/sandesh-shandilya' },
  { label: 'Mentorship', href: ROUTES.academy },
];

export const FOOTER_CONNECT: NavLink[] = [
  { label: 'Book a Call', href: ROUTES.bookCall },
  { label: 'Partner With Us', href: MAILTO.general },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/the_shakti_collective',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/rohitsobti/',
    external: true,
  },
];

export const LOGO = {
  src: '/assets/tsclogo.png',
  textSrc: '/assets/tsclogo-text.png',
  alt: 'The Shakti Collective',
} as const;

export interface FeaturedArtist {
  slug: string;
  name: string;
  roles: string;
  image: string;
  href: string;
}

const STATIC_FEATURED: FeaturedArtist[] = [
  {
    slug: 'yugm',
    name: 'YUGM',
    roles: 'Artist & Performer',
    image: '/artists/yugm/img-9384.jpg',
    href: '/yugm',
  },
  {
    slug: 'harshadduhita',
    name: 'Harshad & Duhita',
    roles: 'Vocal Duo',
    image: '/artists/harshadduhita/heroHND.jpeg',
    href: '/harshadduhita',
  },
];

export function getFeaturedArtists(): FeaturedArtist[] {
  const cmsArtists = cms.getArtists().map((artist) => ({
    slug: artist.slug,
    name: artist.name,
    roles: artist.roles.join(' · '),
    image: artist.image,
    href: `/artists/${artist.slug}`,
  }));

  return [...STATIC_FEATURED, ...cmsArtists];
}

export const ROUNDWAY_STAGES = [
  {
    num: '01',
    label: 'PREPARE',
    title: 'Build Your Foundation',
    desc: 'Industry-led mentorship and deep-dive technical training.',
  },
  {
    num: '02',
    label: 'CREATE',
    title: 'Find Your Voice',
    desc: 'Collaborative spaces and cross-discipline creation.',
  },
  {
    num: '03',
    label: 'PRODUCE',
    title: 'Make It Real',
    desc: 'Infrastructure, funding, and global production standards.',
  },
  {
    num: '04',
    label: 'MONETIZE',
    title: 'Turn Craft into Commerce',
    desc: 'Strategic brand partnerships and IP licensing.',
  },
  {
    num: '05',
    label: 'REPLICATE',
    title: 'Go Global',
    desc: 'Scaling impact and replicating success across territories.',
  },
] as const;
