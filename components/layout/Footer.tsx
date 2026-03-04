import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/buttons/Button';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

/**
 * Footer Component
 * Global footer with navigation, newsletter signup, and legal links
 */
export const Footer: React.FC<FooterProps> = ({ className }) => {
  const footerSections = [
    {
      title: 'Explore',
      links: [
        { label: 'Ecosystem', href: '/ecosystem' },
        { label: 'IP & Stories', href: '/ip' },
        { label: 'Academy', href: '/academy' },
        { label: 'Artists', href: '/artists' },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'About TSC', href: '/about' },
        { label: 'Collaborations', href: '/collaborations' },
        { label: 'Insights', href: '/insights' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  return (
    <footer className={cn('bg-charcoal text-cream', className)}>
      {/* Newsletter Section */}
      <div className="border-b border-slate-medium">
        <div className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-prose"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay updated</h2>
            <p className="text-base md:text-lg text-slate-light mb-8">
              Subscribe to our newsletter for updates on new IPs, courses, and collaborations.
            </p>

            <form className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-slate-medium text-cream placeholder-slate-light focus:outline-none focus:ring-2 focus:ring-teal-light transition-all"
                required
              />
              <Button variant="primary" size="md" className="md:whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">TSC</h3>
            <p className="text-sm text-slate-light leading-relaxed mb-6">
              A talent-centric global culture-creation engine putting artists in control.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {['Instagram', 'Twitter', 'LinkedIn'].map((social, index) => (
                <motion.a
                  key={social}
                  href="#"
                  className="text-slate-light hover:text-cream transition-colors text-sm font-medium"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {social}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (sectionIndex + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-sm uppercase tracking-widest font-bold text-cream mb-6">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      className="text-slate-light hover:text-cream transition-colors text-sm"
                      whileHover={{ x: 4 }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-slate-medium flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-light"
        >
          <p>© {new Date().getFullYear()} TSC. All rights reserved.</p>
          <p>Designed for creative minds</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
