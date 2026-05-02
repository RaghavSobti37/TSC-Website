import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

import ResourcesInstagram from '@/components/sections/ResourcesInstagram';
import ResourcesBlogs from '@/components/sections/ResourcesBlogs';
import ResourcesTools from '@/components/sections/ResourcesTools';

export default function ResourcesPage() {
  return (
    <>
      <Head>
        <title>Resources - The Soul Company</title>
        <meta
          name="description"
          content="Explore our curated resources, Instagram highlights, insightful blog posts, and a directory of free tools and assets for music production and business."
        />
      </Head>

      <main className="bg-cream min-h-screen">
        {/* Page Header */}
        <section className="bg-teal-dark pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
          {/* Subtle Background pattern/gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-light/20 via-teal-dark to-teal-dark"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-cream font-signika mb-6"
            >
              Creator Resources
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg sm:text-xl text-cream-dark/80 max-w-2xl mx-auto font-alan-sans"
            >
              Your hub for inspiration, knowledge, and free tools to elevate your craft.
            </motion.p>
          </div>
        </section>

        {/* Instagram Embeds Section */}
        <ResourcesInstagram />

        {/* Medium Blog Section */}
        <ResourcesBlogs />

        {/* Categorized Free Tools Section */}
        <ResourcesTools />
      </main>
    </>
  );
}
