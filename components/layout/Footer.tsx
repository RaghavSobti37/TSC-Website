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
        { label: 'Ecosystem', href: '/#ecosystem' },
        { label: 'IP & Stories', href: '/#ip-gallery' },
        { label: 'Academy', href: '/#academy' },
        { label: 'Meet the Team', href: '/#team' },
        { label: 'Artist Community', href: '/#artists' },
      ],
    },
    {
      title: 'About',
      links: [
        { label: 'Partnerships', href: '/#collaborations' },
        { label: 'Contact Us', href: '/#contact' },
        { label: 'Instagram', href: 'https://www.instagram.com/the_shakti_collective?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
        { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rohitsobti/' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
      ],
    },
  ];

  return (
    <footer className={cn('bg-charcoal text-cream', className)}>
      {/* Brand gradient top-border — connects from Contact section above */}
      <div className="h-px bg-gradient-to-r from-teal-primary via-pumpkin to-teal-primary opacity-60" />
      <div className="h-0.5 bg-gradient-to-r from-transparent via-pumpkin/30 to-transparent mb-0" />

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
              <motion.a
                href="https://www.instagram.com/the_shakti_collective?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-light hover:text-cream transition-colors text-sm font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0 }}
              >
                Instagram
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/rohitsobti/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-light hover:text-cream transition-colors text-sm font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                LinkedIn
              </motion.a>
              <motion.a
                href="https://www.instagram.com/sandeshshandilya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-light hover:text-cream transition-colors text-sm font-medium"
                whileHover={{ y: -2 }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Sandesh IG
              </motion.a>
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
