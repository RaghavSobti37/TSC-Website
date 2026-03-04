import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '@/src/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#083D3A" />
        <title>The Soul Company</title>
        <meta name="description" content="A global ecosystem for emerging artists and brands to co-create cultural IP." />
        <meta property="og:title" content="The Soul Company" />
        <meta property="og:description" content="A global ecosystem for emerging artists and brands to co-create cultural IP." />
        <meta property="og:image" content="https://www.thesoulcompany.com/assets/banner.jpg" />
        <meta property="og:url" content="https://www.thesoulcompany.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Soul Company" />
        <meta name="twitter:description" content="A global ecosystem for emerging artists and brands to co-create cultural IP." />
        <meta name="twitter:image" content="https://www.thesoulcompany.com/assets/banner.jpg" />
      </Head>

      <div className="min-h-screen flex flex-col bg-cream">
        <Header />

        <main className="flex-1 pt-24 md:pt-32">
          <Component {...pageProps} />
        </main>

        <Footer />
      </div>
    </>
  );
}
