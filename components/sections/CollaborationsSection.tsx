import React from 'react';
import { motion } from 'framer-motion';
import Section from '@/components/layout/Section';
import Container from '@/components/layout/Container';

interface PartnershipModel {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Collaborations Section
 * Brand partnership showcase and process
 */
export default function CollaborationsSection() {
  const models: PartnershipModel[] = [
    {
      id: 'model-1',
      title: 'Brand IP Creation',
      description: 'Co-create original cultural properties that align with your brand values',
      icon: '◇',
    },
    {
      id: 'model-2',
      title: 'Content Production',
      description: 'Leverage our talent pool for authentic brand storytelling',
      icon: '▪',
    },
    {
      id: 'model-3',
      title: 'Artist Partnerships',
      description: 'Direct collaboration with emerging artists from our ecosystem',
      icon: '◆',
    },
  ];

  const processSteps: ProcessStep[] = [
    {
      id: 'step-1',
      title: 'Brief',
      description: 'Share your vision and objectives',
      icon: '◐',
    },
    {
      id: 'step-2',
      title: 'Create',
      description: 'Our team crafts authentic cultural IP',
      icon: '◇',
    },
    {
      id: 'step-3',
      title: 'Launch',
      description: 'Release to audience across platforms',
      icon: '◉',
    },
    {
      id: 'step-4',
      title: 'Scale',
      description: 'Amplify impact and measure success',
      icon: '⬆',
    },
  ];

  return (
    <Section
      id="collaborations"
      background="transparent"
      padding="xl"
      className="relative py-24 bg-gradient-to-br from-pumpkin to-red-oxide"
    >
      <Container className="max-w-6xl">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-cream mb-6 font-signika">
            Brand Partnerships
          </h2>
          <p className="text-lg text-cream/90 font-alan-sans max-w-2xl mx-auto">
            Creating authentic cultural IP that resonates with audiences worldwide
          </p>
        </motion.div>

        {/* Partnership models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-cream mb-8 font-signika text-center">
            Partnership Models
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-cream/10 rounded-2xl p-8 border border-cream/20 backdrop-blur hover:bg-cream/20 transition-all"
              >
                <div className="text-5xl mb-4">{model.icon}</div>
                <h4 className="text-xl font-bold text-cream mb-3 font-signika">
                  {model.title}
                </h4>
                <p className="text-cream/80 font-alan-sans">
                  {model.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-cream mb-12 font-signika text-center">
            Our Process
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step number circle */}
                <div className="absolute -top-8 left-0 w-12 h-12 bg-cream text-red-oxide rounded-full flex items-center justify-center font-bold font-signika text-lg">
                  {index + 1}
                </div>

                {/* Step card */}
                <div className="bg-cream/10 rounded-xl p-6 border border-cream/20 backdrop-blur pt-12">
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h4 className="text-lg font-bold text-cream mb-2 font-signika">
                    {step.title}
                  </h4>
                  <p className="text-cream/80 font-alan-sans text-sm">
                    {step.description}
                  </p>
                </div>

                {/* Connector line to next step */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-6 h-0.5 bg-cream/30" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-cream/10 rounded-2xl p-8 border border-cream/20 backdrop-blur"
        >
          <h3 className="text-3xl font-bold text-cream mb-4 font-signika">
            Ready to Collaborate?
          </h3>
          <p className="text-cream/80 font-alan-sans mb-8 max-w-2xl mx-auto">
            Let's create cultural IP that resonates with your audience and makes an impact
          </p>
          <a href="#contact" className="inline-block px-8 py-3 bg-cream text-red-oxide rounded-full font-semibold hover:bg-cream/90 transition-all font-signika">
            Start a Conversation →
          </a>
        </motion.div>
      </Container>
    </Section>
  );
}
