import '../src/animations.css'
import '../src/index.css'
import { AnimatePresence } from 'framer-motion'
import Head from 'next/head'
import { ThemeProvider } from '../components/Theme'
import Header from '../components/Header'
import { GoogleAnalytics } from '@next/third-parties/google'

function MyApp({ Component, pageProps, router }) {
  return (
    <ThemeProvider>
      <Head>
        <link rel="icon" href="/assets/favicon.png" />
      </Head>
      <GoogleAnalytics gaId="G-2F58657NRP" />
      <Header />
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default MyApp