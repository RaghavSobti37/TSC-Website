'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { FishyButton } from '@/components/ui/fishy-button';

/**
 * Capsule Navigation Header - Fully Responsive
 * Frosted glass navigation pill positioned at top-center of viewport
 * Responsive across all device sizes (375px - 1920px+)
 */
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  if (!isMounted) {
    return null;
  }

  // Determine if we're on mobile/tablet/desktop
  const isMobileView = windowWidth < 768;
  const isTabletView = windowWidth >= 768 && windowWidth < 1024;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-4"
    >
      <motion.div
        className={`rounded-full backdrop-blur-xl border shadow-xl flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? 'bg-white/25 border-white/40'
            : 'bg-white/20 border-white/30'
        } ${
          isMobileView
            ? 'px-3 py-2.5 w-full max-w-sm sm:max-w-md'
            : isTabletView
            ? 'px-6 py-3 gap-4'
            : 'px-8 py-4 gap-8'
        }`}
        whileHover={!isMobileView ? { scale: 1.02 } : undefined}
      >
        {/* Logo */}
        <motion.button
          onClick={() => scrollToSection('hero')}
          whileHover={{ scale: 1.1 }}
          className={`font-signika font-bold text-cream hover:text-cream/80 transition whitespace-nowrap tracking-wider flex-shrink-0 ${
            isMobileView ? 'text-xs' : 'text-sm sm:text-base'
          }`}
        >
          TSC
        </motion.button>

        {/* Desktop Links - Hidden on mobile/tablet */}
        {!isMobileView && (
          <div className={`hidden lg:flex items-center ${isTabletView ? 'gap-3' : 'gap-6'}`}>
            <button
              onClick={() => scrollToSection('ecosystem')}
              className="text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition"
            >
              Ecosystem
            </button>
            <button
              onClick={() => scrollToSection('ip-gallery')}
              className="text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition"
            >
              IP & Stories
            </button>
            <button
              onClick={() => scrollToSection('academy')}
              className="text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition"
            >
              Academy
            </button>
            <button
              onClick={() => scrollToSection('collaborations')}
              className="text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition"
            >
              Partnerships
            </button>
          </div>
        )}

        {/* Divider - Desktop only */}
        {!isMobileView && <div className="hidden lg:block w-px h-6 bg-white/20" />}

        {/* CTAs with Fishy Buttons - Responsive sizing */}
        {!isMobileView && (
          <div className={`hidden sm:flex items-center ${isTabletView ? 'gap-2' : 'gap-3'}`}>
            <FishyButton
              onClick={() => scrollToSection('contact')}
              variant="pumpkin"
              width={isTabletView ? '80px' : '96px'}
              height={isTabletView ? '36px' : '40px'}
              className="join-btn"
            >
              Join
            </FishyButton>
            <FishyButton
              onClick={() => scrollToSection('collaborations')}
              variant="teal"
              width={isTabletView ? '96px' : '112px'}
              height={isTabletView ? '36px' : '40px'}
              className="partner-btn"
            >
              Partner
            </FishyButton>
            <style>{`
              .join-btn .button__text {
                letter-spacing: 2px;
                font-size: 18px !important;
              }
              .join-btn:hover .button__text {
                font-size: 19px !important;
              }
              .partner-btn .button__text {
                letter-spacing: 2px;
                font-size: 18px !important;
              }
              .partner-btn:hover .button__text {
                font-size: 19px !important;
              }
            `}</style>
          </div>
        )}

        {/* Mobile Hamburger Menu Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`${isMobileView ? 'flex' : 'hidden'} sm:hidden items-center justify-center text-cream hover:text-cream/80 transition flex-shrink-0 p-1.5`}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} strokeWidth={2} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={24} strokeWidth={2} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Mobile/Tablet Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 px-4 py-4 sm:px-6 sm:py-5 rounded-lg bg-white/20 backdrop-blur-xl border border-white/30 flex flex-col gap-3 sm:gap-4"
          >
            <button
              onClick={() => {
                scrollToSection('ecosystem');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition py-2 border-b border-white/10"
            >
              Ecosystem
            </button>
            <button
              onClick={() => {
                scrollToSection('ip-gallery');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition py-2 border-b border-white/10"
            >
              IP & Stories
            </button>
            <button
              onClick={() => {
                scrollToSection('academy');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition py-2 border-b border-white/10"
            >
              Academy
            </button>
            <button
              onClick={() => {
                scrollToSection('collaborations');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition py-2 border-b border-white/10"
            >
              Partnerships
            </button>
            <button
              onClick={() => {
                scrollToSection('contact');
                setIsMobileMenuOpen(false);
              }}
              className="text-left text-xs sm:text-sm font-alan-sans text-cream/90 hover:text-cream transition py-2 border-b border-white/10"
            >
              Contact
            </button>

            {/* Mobile CTA Buttons */}
            <div className="pt-2 space-y-2 flex flex-col gap-2">
              <FishyButton
                onClick={() => {
                  scrollToSection('contact');
                  setIsMobileMenuOpen(false);
                }}
                variant="pumpkin"
                width="100%"
                height="40px"
                className="join-btn"
              >
                Join
              </FishyButton>
              <FishyButton
                onClick={() => {
                  scrollToSection('collaborations');
                  setIsMobileMenuOpen(false);
                }}
                variant="pumpkin"
                width="100%"
                height="40px"
                className="partner-btn"
              >
                Partner
              </FishyButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

