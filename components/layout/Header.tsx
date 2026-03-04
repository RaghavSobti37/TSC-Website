'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/buttons/Button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Ecosystem', href: '/ecosystem' },
  { label: 'IP & Stories', href: '/ip' },
  { label: 'Academy', href: '/academy' },
  { label: 'Artists', href: '/artists' },
  { label: 'Collaborations', href: '/collaborations' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
];

interface HeaderProps {
  className?: string;
}

/**
 * Header Component
 * Sticky navigation with logo, nav, and CTAs
 * Changes background color on scroll (cream fade-in)
 */
export const Header: React.FC<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-cream shadow-sm' : 'bg-transparent',
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="max-w-container mx-auto px-4 md:px-8 py-4 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex-shrink-0 font-bold text-2xl md:text-3xl text-teal-dark hover:text-teal-primary transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            TSC
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm font-medium text-charcoal hover:text-teal-primary transition-colors rounded-lg hover:bg-cream"
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button variant="outline" size="sm">
              Join as Artist
            </Button>
            <Button variant="primary" size="sm">
              Partner with TSC
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-cream transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <motion.span
                className="h-0.5 w-full bg-charcoal rounded"
                animate={
                  isMobileMenuOpen
                    ? { rotate: 45, y: 10 }
                    : { rotate: 0, y: 0 }
                }
              />
              <motion.span
                className="h-0.5 w-full bg-charcoal rounded"
                animate={
                  isMobileMenuOpen
                    ? { opacity: 0 }
                    : { opacity: 1 }
                }
              />
              <motion.span
                className="h-0.5 w-full bg-charcoal rounded"
                animate={
                  isMobileMenuOpen
                    ? { rotate: -45, y: -10 }
                    : { rotate: 0, y: 0 }
                }
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-cream-dark lg:hidden"
            >
              <div className="flex flex-col gap-2 mb-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-charcoal hover:text-teal-primary hover:bg-cream rounded-lg transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  Join as Artist
                </Button>
                <Button variant="primary" size="sm" className="w-full justify-center">
                  Partner with TSC
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
};

export default Header;
