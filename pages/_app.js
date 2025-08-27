import '../src/index.css'
import { AnimatePresence } from 'framer-motion'
import Head from 'next/head'

function MyApp({ Component, pageProps, router }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/assets/only logo.png" />
      </Head>
      <AnimatePresence mode="wait">
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </>
  )
}

export default MyApp
