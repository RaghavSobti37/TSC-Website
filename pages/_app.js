import '../src/animations.css'
import '../src/index.css'
import { AnimatePresence } from 'framer-motion'
import Head from 'next/head'
import { ThemeProvider } from '../components/Theme'
import Header from '../components/Header'

function MyApp({ Component, pageProps, router }) {
  return (
    <ThemeProvider>
      <Head>
        <link rel="icon" href="/assets/favicon.png" />
      </Head>
      <Header />
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default MyApp