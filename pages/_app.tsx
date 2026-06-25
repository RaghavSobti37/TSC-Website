import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '@/components/layout/Header';
import AcademyHeader from '@/components/layout/AcademyHeader';
import { Footer } from '@/components/layout/Footer';
import '@/src/index.css';
import { CONTACT_EMAILS } from '@/lib/contacts';
import { SITE_BASE_URL } from '@/lib/siteUrls';

import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isReviewPage = router.pathname === '/classicalreview' || router.pathname === '/masterclass-review01' || router.pathname === '/masterclass-review02';
  const isWixStandalone =
    router.pathname === '/harshadduhita' || router.pathname === '/harshad-duhita';

  const isAcademyPage = router.pathname.startsWith('/tscacademy') || 
                        router.pathname.startsWith('/masterclass/') || 
                        router.pathname.startsWith('/courses/');

  const isArtistPath = router.pathname === '/artist-path' || router.pathname === '/query';
  const isSuccess = router.query.success === 'true';
  const hideNavbar = isReviewPage || isWixStandalone;
  const hideFooter = (isArtistPath && !isSuccess) || isReviewPage || isWixStandalone;
  const ogImage = `${SITE_BASE_URL}/assets/banner.jpg`;
  const logoUrl = `${SITE_BASE_URL}/assets/logo.png`;

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/assets/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/favicon.png" />
        <title>The Shakti Collective</title>
        <meta name="description" content="A global ecosystem for emerging artists and brands to co-create cultural IP." />
        <meta property="og:title" content="The Shakti Collective" />
        <meta property="og:description" content="A global ecosystem for emerging artists and brands to co-create cultural IP." />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={SITE_BASE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Shakti Collective" />
        <meta name="twitter:description" content="A global ecosystem for emerging artists and brands to co-create cultural IP." />
        <meta name="twitter:image" content={ogImage} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${SITE_BASE_URL}/#organization`,
              "name": "The Shakti Collective",
              "url": SITE_BASE_URL,
              "logo": logoUrl,
              "description": "A global ecosystem for emerging artists and brands to co-create cultural IP.",
              "sameAs": [
                "https://www.linkedin.com/company/theshakticollective",
                "https://www.instagram.com/theshakticollective"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": CONTACT_EMAILS.general
              }
            })
          }}
        />
      </Head>

      <div className={`min-h-screen flex flex-col ${isReviewPage ? 'bg-[#050505]' : isWixStandalone ? '' : 'bg-cream'}`}>
        {!hideNavbar && (
          isAcademyPage ? <AcademyHeader /> : <Header />
        )}

        <main className="flex-1">
          <Component {...pageProps} />
        </main>

        {!hideFooter && <Footer />}
      </div>
    </>
  );
}
