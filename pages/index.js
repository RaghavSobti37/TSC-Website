import Head from 'next/head'
import Hero from '../components/Hero'
import About from '../components/About'
import WhyWeExist from '../components/WhyWeExist'
import CoreValues from '../components/CoreValues'
import Projects from '../components/Projects'
import HowWeWork from '../components/HowWeWork'
import Team from '../components/Team'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>The Shakti Collective</title>
        <meta name="description" content="Amplifying the voices that reshape culture. Music, Stories, Community." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Hero />
        <About />
        <WhyWeExist />
        <CoreValues />
        <Projects />
        <HowWeWork />
        <Team />
        <Footer />
      </main>
    </>
  )
}
