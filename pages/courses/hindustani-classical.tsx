import React from 'react';
import Head from 'next/head';
import CourseLayout from '@/components/layout/CourseLayout';

export default function HindustaniClassical() {
  const data = {
    title: "The Roots of - Hindustani Classical",
    mentor: "Pandit Prasad Khaparde",
    mentorRole: "Legendary Classical Vocalist",
    mentorImage: "/assets/academy/prasadji.jpg",
    heroImage: "/assets/academy/prasadji.jpg",
    credentials: ["Legendary Classical Vocalist", "30+ Years Experience", "Rampur Sahaswan Gharana Master"],
    overview: [
      "Immerse yourself in the timeless art of Hindustani classical singing with this comprehensive program designed for aspiring vocalists of all levels.",
      "Learn directly from Pandit Prasad Khaparde, a legendary vocalist trained in the prestigious Rampur Sahaswan gharana under Ustad Rashid Khan."
    ],
    highlights: [
      { icon: "⏱️", title: "Comprehensive Program", desc: "Structured program for deep skill development" },
      { icon: "📹", title: "120+ Mins Recorded", desc: "Extensive modules covering raagas and technique" },
      { icon: "👥", title: "12+ Live Sessions", desc: "Group sessions for personalized guidance" },
      { icon: "🏆", title: "Certification", desc: "Official certification recognized in classical music" },
      { icon: "🎤", title: "Raag Training", desc: "Master fundamental and advanced raags" },
      { icon: "✨", title: "Community Access", desc: "Lifetime access to classical music community" }
    ],
    learnings: [
      { title: "Foundations", desc: "Master concepts like swaras, raags, thaats, and taals." },
      { title: "Raag Exploration", desc: "Understand and interpret multiple raags and their characters." },
      { title: "Vocal Technique", desc: "Develop proper breathing and vocal discipline." },
      { title: "Gharana Tradition", desc: "Explore the rich heritage and history of musical traditions." }
    ],
    curriculum: [
      {
        title: "Chapter 0 — Introduction",
        desc: "Meet your mentor, understand the origin and structure.",
        icon: "📚",
        segments: [
          { number: "00", name: "Mentor Introduction" },
          { number: "0A", name: "Blessings Of A Guru" },
          { number: "0B", name: "Introduction" },
          { number: "0C", name: "The Origin" }
        ]
      },
      {
        title: "Chapter 1 — What is Music?",
        desc: "Definition and fundamental concepts in the classical context.",
        icon: "🎵",
        segments: [
          { number: "1A", name: "Definition" }
        ]
      },
      {
        title: "Chapter 2 — Hindustani classical and semi classical music",
        desc: "Distinctions and similarities between various forms.",
        icon: "🎼",
        segments: [
          { number: "2A", name: "Definition" }
        ]
      },
      {
        title: "Chapter 3 — History of Classical Music",
        desc: "Tracing the evolution through gharanas and traditions.",
        icon: "🏛️",
        segments: [
          { number: "3A", name: "Introduction" },
          { number: "3B", name: "Gharana, Tradition" }
        ]
      },
      {
        title: "Chapter 4 — Swaar, Thaat, And Saptak",
        desc: "Mastering the fundamental building blocks.",
        icon: "🎹",
        segments: [
          { number: "4A", name: "Introduction" },
          { number: "4B", name: "Presentation & Notes Of Thaat" },
          { number: "4C", name: "Practicing Thaat" }
        ]
      },
      {
        title: "Chapter 5 — Introduction To Ragas",
        desc: "Deep dive into Yaman, Bhimpalasi, Madhuvanti, and Bhairav.",
        icon: "🎤",
        segments: [
          { number: "5A", name: "Puriya Dhanashree & Yaman" },
          { number: "5B", name: "Bhimpalasi" },
          { number: "5C", name: "Yaman & Yaman Kalyan" },
          { number: "5D", name: "Madhuvanti" },
          { number: "5E", name: "Bhairav" }
        ]
      },
      {
        title: "Chapter 6 — Listening Is Learning",
        desc: "Developing the ear by exploring music of legendary vocalists.",
        icon: "🎧",
        segments: [
          { number: "6A", name: "The music of legends" }
        ]
      },
      {
        title: "Chapter 7 — Select Your Perfect 'Sa'",
        desc: "Finding your tonic note and establishing foundation.",
        icon: "🎙️",
        segments: [
          { number: "7A", name: "The Process" },
          { number: "7B", name: "Practice Of Notes" },
          { number: "7C", name: "Important Books" }
        ]
      },
      {
        title: "Chapter 8 — Kanth Saadhna",
        desc: "Traditional vocal culture techniques for resonance.",
        icon: "✨",
        segments: [
          { number: "8A", name: "Throat, Chest & Navel" },
          { number: "8B", name: "Breathing Capacity" },
          { number: "8C", name: "Sustaining The Notes" }
        ]
      },
      {
        title: "Chapter 9 — Tanpura",
        desc: "Importance of the tanpura and the art of tuning.",
        icon: "🎻",
        segments: [
          { number: "9A", name: "Importance Of Tanpura" },
          { number: "9B", name: "Tuning" }
        ]
      },
      {
        title: "Chapter 10 — Basic Phrases Of Ragas",
        desc: "Mastering the core melodic structures.",
        icon: "🎼",
        segments: [
          { number: "10A", name: "Basic Phrase Practice Of Ragas" }
        ]
      },
      {
        title: "Chapter 11 — Basic Taal introduction",
        desc: "Introduction to rhythmic patterns and role of Taal.",
        icon: "🥁",
        segments: [
          { number: "11A", name: "Different Rhythm Patterns" }
        ]
      },
      {
        title: "Chapter 12 — Bandish",
        desc: "Learning the Bandish and its practice.",
        icon: "🖋️",
        segments: [
          { number: "12A", name: "Practice" }
        ]
      }
    ],
    enrollLink: "https://tscacademy.exlyapp.com/checkout/245f8992-f7bd-41c2-aa48-864a1ac2b9cd",
    masterclassLink: "/masterclass/prasad-khaparde",
    comparisonTable: {
      headers: ["Feature", "Foundation", "Accelerator"],
      rows: [
        ["Recorded content", "Yes", "Yes"],
        ["Live sessions", "No", "12 / year"],
        ["Community", "Yes", "Yes"],
        ["Demo Day", "No", "Yes"],
        ["WhatsApp access", "No", "Yes"],
        ["Assignment feedback", "No", "Yes"],
        ["Making 1 song", "No", "Yes"],
        ["Access", "6 Months", "1 Year"],
        ["Actual Price", "₹14,999", "₹39,999"],
        ["Offer Price", "₹3,999", "₹19,999"]
      ],
      tierLinks: [
        "https://tscacademy.exlyapp.com/checkout/c9a2ca8d-dfaa-4db8-ac7b-a558433df4b8?dynamic_link=fb61323e-d4ca-4d92-a0a0-da337ad229d1",
        "https://tscacademy.exlyapp.com/checkout/245f8992-f7bd-41c2-aa48-864a1ac2b9cd"
      ]
    }
  };

  return (
    <>
      <Head>
        <title>The Roots of Hindustani Classical Music | TSC Academy</title>
        <meta name="description" content="Master Hindustani classical singing with Pandit Prasad Khaparde." />
      </Head>
      <CourseLayout {...data} />
    </>
  );
}
