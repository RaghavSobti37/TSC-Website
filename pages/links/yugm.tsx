import React from 'react';
import Head from 'next/head';
import ArtistLinks from '@/components/artist/ArtistLinks';
import { FaCalendarAlt, FaEnvelope, FaGlobe, FaMusic } from 'react-icons/fa';

const YugmLinks = () => {
  const artistData = {
    name: 'Yugm',
    bio: 'Jaipur-based folk-fusion band bridging traditional roots with modern storytelling.',
    avatarUrl: '/assets/yugm/yugm12.jpg',
    links: [
      {
        label: 'Book a Query Call',
        url: '/query?artist=YUGM',
        icon: FaCalendarAlt,
        primary: true,
        highlight: true,
      },
      {
        label: 'Email Yugm Official',
        url: 'mailto:yugmofficial@gmail.com',
        icon: FaEnvelope,
      },
      {
        label: 'Explore Yugm Profile',
        url: '/yugm',
        icon: FaGlobe,
      },
      {
        label: 'Music & Live Experience',
        url: '/yugm',
        icon: FaMusic,
      },
    ],
    socials: {
      website: '/yugm',
      email: 'yugmofficial@gmail.com',
    },
  };

  return (
    <>
      <Head>
        <title>Yugm | Link Hub | The Shakti Collective</title>
        <meta
          name="description"
          content="Connect with Yugm. Book calls, email the band, and explore their stage-ready folk fusion profile." 
        />
        <meta property="og:title" content="Yugm | Link Hub" />
        <meta property="og:description" content="Connect with Yugm. Music, booking, and artist profile in one place." />
        <meta property="og:image" content={artistData.avatarUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <ArtistLinks {...artistData} />
    </>
  );
};

export default YugmLinks;
