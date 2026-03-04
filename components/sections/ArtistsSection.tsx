import React from 'react';
import KineticTeamHybrid from '@/components/ui/kinetic-team-hybrid';

interface TimelineMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

/**
 * Artists Section
 * Displays the TSC artist community using kinetic team component
 */
export default function ArtistsSection() {
  // Flatten all artists from different categories into a single list
  const teamMembers: TimelineMember[] = [
    {
      id: 'artist-1',
      name: 'Aarav Singh',
      role: 'Music Producer & Songwriter',
      bio: 'Urban music innovator blending tradition with technology',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-2',
      name: 'Priya Devi',
      role: 'Director & Cinematographer',
      bio: 'Visual storyteller capturing cultural narratives',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-3',
      name: 'Dev Sharma',
      role: 'Animator & Game Designer',
      bio: 'Interactive media artist exploring digital artistry',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-4',
      name: 'Maya Acoustic',
      role: 'Singer & Composer',
      bio: 'Classical roots, contemporary voice',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-5',
      name: 'Ravi Patel',
      role: 'Painter & Installation Artist',
      bio: 'Contemporary artist exploring cultural identity',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-6',
      name: 'Zara Khan',
      role: 'DJ & Music Producer',
      bio: 'Electronic music pioneer with global reach',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-7',
      name: 'Ananya Gupta',
      role: 'Documentary Photographer',
      bio: 'Showcasing stories through visual narratives',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-8',
      name: 'Vikram Das',
      role: 'Graphic Designer & UX Designer',
      bio: 'Visual designer with cultural sensibility',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-9',
      name: 'Sneha Reddy',
      role: 'Illustrator & Concept Artist',
      bio: 'Creating immersive visual worlds',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-10',
      name: 'Arjun Nair',
      role: '3D Artist & Motion Designer',
      bio: 'Creating motion graphics and 3D experiences',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-11',
      name: 'Dr. Rajesh Verma',
      role: 'Mentor & Music Theorist',
      bio: 'Guiding the next generation of artists',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
    },
    {
      id: 'artist-12',
      name: 'Kavya Singh',
      role: 'Producer & Cultural Strategist',
      bio: 'Building bridges between tradition and innovation',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=500&fit=crop',
    },
  ];

  return (
    <section id="artists" className="bg-cream">
      <KineticTeamHybrid
        title="Artist"
        subtitle="Community"
        members={teamMembers}
        darkMode={false}
      />
    </section>
  );
}
