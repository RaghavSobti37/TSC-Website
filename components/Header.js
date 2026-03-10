import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

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
              href="https://tscacademy.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 font-black rounded-lg text-xs uppercase tracking-wider bg-pumpkin text-cream"
            >
              TSC Academy
            </a>
          </div>
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
                  href="https://tscacademy.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-2 font-black rounded-lg hover:opacity-80 transition-opacity text-xs text-center uppercase tracking-wider bg-pumpkin text-cream"
                >
                  TSC Academy
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
