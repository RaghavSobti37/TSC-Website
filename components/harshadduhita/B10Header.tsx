import { useEffect, useState } from 'react';
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

export default function B10Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={`b10-header ${scrolled ? 'b10-header--solid' : ''}`}>
        <div className="b10-header__inner">
          <Link href="/" className="b10-header__logo-wrap">
            <img src="/assets/only-logo.svg" alt="TSC" className="b10-header__logo" />
          </Link>
          <nav className="b10-header__nav" aria-label="Main">
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            className="b10-header__menu"
            aria-label={open ? 'Close menu' : 'Menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>
      <button
        type="button"
        className={`b10-mobile-backdrop ${open ? 'b10-mobile-backdrop--open' : ''}`}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />
      <div className={`b10-mobile-drawer ${open ? 'b10-mobile-drawer--open' : ''}`}>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </Link>
        ))}
      </div>
    </>
  );
}
