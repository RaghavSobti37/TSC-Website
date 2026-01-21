import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline = new Date('2026-02-05T23:59:59').getTime();
      const now = new Date().getTime();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-wine/10 backdrop-blur-2xl border-b border-pumpkin/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/">
          <Image
            src="/assets/LogoArtboard 4 copy 6.png"
            alt="The Shakti Collective Logo"
            width={120}
            height={80}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-12">
          <a href="#projects" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest">
            PROJECTS
          </a>
          <a href="#team" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest">
            TEAM
          </a>
          <a href="#about" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest">
            ABOUT
          </a>
          <a href="https://www.instagram.com/the_shakti_collective" target="_blank" rel="noopener noreferrer" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest">
            CONNECT
          </a>
        </nav>

        {/* CTA Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex flex-col items-center">
            <a
              href="https://iml.tscacademy.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 font-black rounded-lg text-xs uppercase tracking-wider animate-pulse"
              style={{
                animation: 'color-shift 0.6s infinite',
                background: 'linear-gradient(90deg, #FF6B35, #8B3A3A, #FF6B35)',
                backgroundSize: '200% 100%',
                color: '#FFF8F0',
              }}
            >
              IML LIVE
            </a>
            <span className="text-cream text-xs mt-1" style={{ fontSize: '0.65rem' }}>
              {timeLeft}
            </span>
          </div>
          <style>{`
            @keyframes color-shift {
              0%, 100% { background-position: 0% center; }
              50% { background-position: 100% center; }
            }
          `}</style>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-cream text-2xl"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-wine/95 backdrop-blur-xl border-t border-pumpkin/20">
          <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
            <a href="#projects" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              PROJECTS
            </a>
            <a href="#team" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              TEAM
            </a>
            <a href="#about" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest" onClick={() => setIsOpen(false)}>
              ABOUT
            </a>
            <a href="https://www.instagram.com/the_shakti_collective" target="_blank" rel="noopener noreferrer" className="text-cream hover:text-pumpkin transition-colors text-xs font-black uppercase tracking-widest">
              CONNECT
            </a>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-col items-center">
                <a
                  href="https://iml.tscacademy.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 font-black rounded-lg hover:opacity-80 transition-opacity text-xs text-center uppercase tracking-wider animate-pulse"
                  style={{
                    animation: 'color-shift 0.6s infinite',
                    background: 'linear-gradient(90deg, #FF6B35, #8B3A3A, #FF6B35)',
                    backgroundSize: '200% 100%',
                    color: '#FFF8F0',
                  }}
                >
                  IML LIVE
                </a>
                <span className="text-cream text-xs mt-1" style={{ fontSize: '0.65rem' }}>
                  {timeLeft}
                </span>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
