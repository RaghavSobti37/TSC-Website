import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';
import UnfoldReveal from '@/components/animations/UnfoldReveal';
import { Button } from '@/components/buttons/Button';
import { cms } from '@/lib/cms';

interface ArticleDetailPageProps {
  article: ReturnType<typeof cms.getArticleBySlug>;
  relatedArticles: ReturnType<typeof cms.getArticles>;
}

export default function ArticleDetailPage({ article, relatedArticles }: ArticleDetailPageProps) {
  if (!article) {
    return (
      <>
        <Head>
          <title>Article Not Found - TSC</title>
        </Head>
        <Section background="cream" padding="xl" className="min-h-[60vh] flex items-center justify-center">
          <Container className="text-center">
            <h1 className="text-5xl font-bold text-charcoal mb-6">Article Not Found</h1>
            <p className="text-xl text-slate-medium mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/insights">
              <Button variant="primary" size="lg">
                Back to Insights
              </Button>
            </Link>
          </Container>
        </Section>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} - TSC Insights</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:author" content={article.author} />
      </Head>

      {/* Hero with Featured Image */}
      <Section background="charcoal" padding="xl" className="min-h-[60vh] flex items-center justify-center">
        <Container>
          <UnfoldReveal variant="fadeUp">
            <div className="aspect-video rounded-lg overflow-hidden mb-8 bg-cream">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="max-w-3xl">
              <div className="inline-block px-4 py-2 bg-teal-dark text-cream rounded-full text-sm font-semibold mb-6">
                {article.category}
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">{article.title}</h1>
              <div className="flex items-center text-cream text-sm gap-4">
                <span className="font-semibold">{article.author}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>
            </div>
          </UnfoldReveal>
        </Container>
      </Section>

      {/* Article Content */}
      <Section background="white" padding="xl">
        <Container>
          <div className="max-w-3xl mx-auto">
            <UnfoldReveal variant="fadeUp">
              <div className="prose prose-lg max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    className="text-lg text-slate-medium leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
            </UnfoldReveal>
          </div>
        </Container>
      </Section>

      {/* Author Info */}
      <Section background="cream-dark" padding="xl">
        <Container>
          <div className="max-w-3xl mx-auto">
            <UnfoldReveal variant="scaleUp">
              <motion.div
                className="bg-white rounded-lg p-8 text-center"
                whileHover={{ y: -4 }}
              >
                <div className="w-20 h-20 bg-teal-dark rounded-full mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-charcoal mb-2">{article.author}</h3>
                <p className="text-slate-medium">Part of TSC's editorial team, bringing insights on culture, talent, and creative empowerment.</p>
              </motion.div>
            </UnfoldReveal>
          </div>
        </Container>
      </Section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Section background="white" padding="xl">
          <Container>
            <UnfoldReveal variant="fadeUp" className="mb-12">
              <h2 className="text-4xl font-bold text-charcoal">Related Articles</h2>
            </UnfoldReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.slice(0, 2).map((relatedArticle, index) => (
                <UnfoldReveal key={relatedArticle.id} variant="slideInLeft" delay={index * 0.1}>
                  <Link href={`/insights/${relatedArticle.slug}`}>
                    <motion.article
                      className="group bg-cream rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                      whileHover={{ y: -4 }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-slate-light">
                        <img
                          src={relatedArticle.image}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-teal-dark text-cream text-xs font-semibold rounded-full">
                            {relatedArticle.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-charcoal mb-3 line-clamp-2 group-hover:text-teal-primary transition-colors">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-slate-medium text-sm mb-4 line-clamp-2 flex-grow">
                          {relatedArticle.excerpt}
                        </p>
                        <div className="text-xs text-slate-light">
                          {relatedArticle.author} • {relatedArticle.date}
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                </UnfoldReveal>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section background="teal" padding="xl">
        <Container className="text-center">
          <UnfoldReveal variant="fadeUp" className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Explore More Insights</h2>
            <p className="text-xl text-cream mb-8 max-w-2xl mx-auto">
              Read more articles on culture, talent, and creative empowerment.
            </p>
            <Link href="/insights">
              <Button variant="primary" size="lg" className="bg-cream text-teal-dark hover:bg-cream-dark">
                Read All Articles
              </Button>
            </Link>
          </UnfoldReveal>
        </Container>
      </Section>
    </>
  );
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const article = cms.getArticleBySlug(params.slug);

  if (!article) {
    return {
      notFound: true,
    };
  }

  const relatedArticles = cms
    .getArticlesByCategory(article.category)
    .filter(a => a.id !== article.id);

  return {
    props: {
      article,
      relatedArticles,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths() {
  const articles = cms.getArticles();

  return {
    paths: articles.map((article) => ({
      params: {
        slug: article.slug,
      },
    })),
    fallback: 'blocking',
  };
}
