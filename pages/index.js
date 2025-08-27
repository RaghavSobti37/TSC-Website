import Head from 'next/head'
import Hero from '../components/Hero'
import About from '../components/About'
import Projects from '../components/Projects'
import Team from '../components/Team'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>The Shakti Collective</title>
        <meta name="description" content="The Shakti Collective — creative studio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Hero />
        <About />
        <Projects />
        <Team />
        <Footer />
      </main>
    </>
  )
}
