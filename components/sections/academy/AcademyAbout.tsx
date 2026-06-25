import { motion } from 'framer-motion';
import { Sparkles, Map, Crown, Search, Heart, Handshake, Stars } from 'lucide-react';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

const visionCards = [
  {
    icon: <Sparkles className="w-10 h-10 text-mustard" />,
    title: 'First of its Kind',
    desc: "India's premier music academy where industry legends mentor the next generation of artists",
    highlight: true,
  },
  {
    icon: <Map className="w-10 h-10 text-wine" />,
    title: 'Partner in Your Journey',
    desc: "We're not here for a quick course. We're here for your entire artistic evolution, from discovery to mastery",
  },
  {
    icon: <Crown className="w-10 h-10 text-wine" />,
    title: 'Only Leading Artists as Mentors',
    desc: 'Learn from leading industry professionals & artists who have already proven their craft on a global level.',
  },
  {
    icon: <Search className="w-10 h-10 text-wine" />,
    title: 'Strictly for Artists who want to be a Professional',
    desc: 'Our platform is not for hobbyists or casual explorers. We put everything we have into those who are serious about their craft and ready to transform',
  },
  {
    icon: <Heart className="w-10 h-10 text-wine" />,
    title: 'Scholarships for EWS Available',
    desc: "Talent shouldn't be limited by access. We ensure deserving artists from economically weaker sections can pursue their dreams",
  },
  {
    icon: <Handshake className="w-10 h-10 text-wine" />,
    title: 'Unconditional Support',
    desc: 'We make sure that you get any support that you need in your journey, no matter what.',
  },
  {
    icon: <Stars className="w-10 h-10 text-mustard" />,
    title: "We're here to serve the artist community",
    desc: "Artists today need more than skill - they need mentorship, depth of understanding, and the confidence to express their authentic voice. This is a safe & non-judgemental space for unfolding the artist you are meant to be.",
    fullWidth: true,
  },
];

export default function AcademyAbout() {
  return (
    <Section id="about" background="cream" padding="xl">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-xs font-bold tracking-widest text-mustard uppercase mb-6 font-alan-sans">
              ARE YOU READY?
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-wine font-signika leading-tight tracking-tight">
              Every artist has a story <br className="hidden md:block" /> waiting to unfold.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-xl text-slate-medium font-alan-sans leading-relaxed">
              We&apos;re a one of a kind group of leading industry professionals & artists who
              are insanely driven to help artists unfold into an artist that they&apos;re truly meant to be.
            </p>
            <p className="text-xl text-slate-medium font-alan-sans leading-relaxed">
              We provide 360 degree support to our artists and make sure that they get any
              support that they need in their journey. A space where artists can learn, collaborate, and create
              world-class work.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`
                relative p-8 rounded-3xl border-2 transition-all duration-400 group overflow-hidden
                ${card.highlight 
                  ? 'bg-gradient-to-br from-cream-light to-white border-mustard/30 shadow-mustard/10 shadow-xl' 
                  : 'bg-white border-slate-lightest hover:border-wine/30 shadow-sm hover:shadow-xl'}
                ${card.fullWidth ? 'md:col-span-2 lg:col-span-3 bg-gradient-to-r from-wine/5 to-mustard/5' : ''}
              `}
            >
              {/* Hover line accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wine to-mustard transform origin-left transition-transform duration-500 ${card.highlight ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              
              <div className="mb-6">{card.icon}</div>
              <h3 className="text-xl font-bold text-wine mb-4 font-signika">{card.title}</h3>
              <p className="text-slate-medium font-alan-sans leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
