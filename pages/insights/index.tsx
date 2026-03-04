import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';

export default function InsightsPage() {
  const articles = [
    {
      id: 'unfold-motion',
      title: 'The UNFOLD Philosophy: Motion as Meaning',
      category: 'Unfold',
      excerpt: "How subtle animation and interaction design communicate TSC's brand values.",
      date: 'March 2024',
      author: 'Design Team',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    },
    {
      id: 'emerging-talent',
      title: 'The Business Case for Investing in Emerging Talent',
      category: 'Artists',
      excerpt: 'Why forward-thinking brands are building direct relationships with emerging artists.',
      date: 'February 2024',
      author: 'Content Team',
      image: 'https://images.unsplash.com/photo-1514607687887-7419c7b47e5d?w=600&h=400&fit=crop',
    },
    {
      id: 'global-culture',
      title: 'Cultural Production in a Hyperlocal World',
      category: 'Culture',
      excerpt: 'Exploring how global platforms enable deeply local creative expression.',
      date: 'January 2024',
      author: 'Editorial',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop',
    },
    {
      id: 'ecosystem-impact',
      title: 'The TSC Ecosystem: One Year In',
      category: 'Ecosystem',
      excerpt: 'Key metrics and learnings from our first year building a talent-centric platform.',
      date: 'December 2023',
      author: 'Research Team',
      image: 'https://images.unsplash.com/photo-1516239482537-e3c3f11cb3a2?w=600&h=400&fit=crop',
    },
  ];

  const categories = ['All', 'Unfold', 'Artists', 'Culture', 'Ecosystem'];

  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredArticles =
    selectedCategory === 'All' ? articles : articles.filter((a) => a.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Insights - TSC</title>
        <meta name="description" content="Thoughts on culture, talent, and creative empowerment" />
      </Head>

      {/* Hero */}
      <Section background="cream" padding="xl" className="min-h-[50vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp" className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6">Insights</h1>
            <p className="text-xl md:text-2xl text-slate-medium">
              Thoughts on culture, talent, and the future of creative empowerment.
            </p>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* Filter */}
      <Section background="white" padding="lg">
        <Container>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-teal-dark text-cream'
                    : 'bg-cream text-charcoal hover:bg-cream-dark'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </Container>
      </Section>

      {/* Articles Grid */}
      <Section background="cream-dark" padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map((article, index) => (
              <UnfoldReveal key={article.id} variant="scaleUp" delay={index * 0.1}>
                <motion.article
                  className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
                  whileHover={{ y: -4 }}
                >
                  {/* Featured Image */}
                  <div className="relative aspect-video overflow-hidden bg-cream">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-teal-dark text-cream text-xs font-semibold rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-charcoal mb-3 line-clamp-2 group-hover:text-teal-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-slate-medium text-base mb-6 line-clamp-2 flex-grow">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-light mb-4">
                      <div>
                        <span className="font-semibold">{article.author}</span> • {article.date}
                      </div>
                    </div>

                    <motion.a
                      href={`/insights/${article.id}`}
                      className="inline-flex items-center gap-2 text-teal-primary font-semibold hover:gap-3 transition-all"
                      whileHover={{ x: 4 }}
                    >
                      Read Article →
                    </motion.a>
                  </div>
                </motion.article>
              </UnfoldReveal>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-slate-medium">No articles in this category yet.</p>
            </div>
          )}
        </Container>
      </Section>

      {/* Newsletter CTA */}
      <Section background="teal" padding="xl">
        <Container className="max-w-2xl text-center">
          <UnfoldReveal variant="fadeUp" className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay updated</h2>
            <p className="text-lg text-cream mb-8">
              Get the latest insights on culture, talent, and creative empowerment sent to your inbox.
            </p>

            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-cream text-charcoal placeholder-slate-light focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-cream text-teal-dark font-semibold rounded-lg hover:bg-cream-dark transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}
