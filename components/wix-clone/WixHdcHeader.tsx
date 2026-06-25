import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/ip' },
  { label: 'Artists', href: '/artists' },
  { label: 'Resources', href: '/resources' },
  { label: 'TSC Academy', href: '/tscacademy' },
  { label: 'Stories', href: '/stories' },
] as const;

export default function WixHdcHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`wix-hdc-header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="wix-hdc-header-inner">
          <Link href="/">
            <img src="/assets/only-logo.svg" alt="TSC" className="wix-hdc-logo" />
          </Link>
          <nav aria-label="Site">
            <ul className="wix-hdc-nav">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="wix-hdc-nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="wix-hdc-menu-btn"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <nav className={`wix-hdc-mobile-nav ${menuOpen ? 'open' : ''}`} aria-label="Mobile">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
