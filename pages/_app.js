import '../src/index.css'
import { AnimatePresence } from 'framer-motion'
import Head from 'next/head'
import { ThemeProvider } from '../components/Theme'

function MyApp({ Component, pageProps, router }) {
  return (
    <ThemeProvider>
      <Head>
        <link rel="icon" href="/assets/only logo.png" />
      </Head>
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </ThemeProvider>
  )
}

export default MyApp
