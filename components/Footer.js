import Image from "next/legacy/image"
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'
import DarkModeToggle from './DarkModeToggle'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-primary text-cream overflow-hidden">
      <div className="pattern-container absolute inset-0">
        <div className="absolute inset-0">
          <Image 
            src="/assets/Patterns/LogoArtboard 17@300x-8.png" 
            alt="Background Pattern" 
            layout="fill" 
            objectFit="cover" 
            className="opacity-30"
          />
        </div>
      </div>
      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Newsletter Section */}
          <div className="lg:col-span-5">
            <h3 className="text-2xl font-bold mb-2 heading-font">Join Our Collective</h3>
            <p className="mb-6 text-cream/80">Get the latest on our projects and creative insights delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row">
              <input type="email" placeholder="Your Email Address" className="w-full px-4 py-3 text-deep-teal rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-pumpkin dark:bg-chestnut dark:text-cream dark:placeholder-cream/60" required />
              <button type="submit" className="mt-2 sm:mt-0 px-6 py-3 bg-cream text-pumpkin font-bold rounded-md sm:rounded-r-md sm:rounded-l-none hover:bg-cream/80 transition-colors dark:bg-pumpkin dark:text-cream dark:hover:bg-pumpkin/80">
                Subscribe
              </button>
            </form>
          </div>

          {/* Spacer */}
          <div className="lg:col-span-2"></div>

          {/* Logo and Socials */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end">
            {/* Make sure you have a white version of your logo at this path */}
            <div className="w-48 h-16 relative">
              <Image src="/assets/LogoArtboard 1.png" alt="The Shakti Collective Logo" layout="fill" objectFit="contain" />
            </div>
            <div className="flex gap-6 mt-6">
              <a href="https://www.instagram.com/the_shakti_collective?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Instagram">
                <FaInstagram size={28} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                <FaLinkedin size={28} />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" aria-label="Twitter">
                <FaTwitter size={28} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-cream/20 pt-8 flex justify-between items-center text-sm text-cream/80">
          <p>&copy; {new Date().getFullYear()} The Shakti Collective. All Rights Reserved.</p>
          <DarkModeToggle />
        </div>
      </div>
    </footer>
  );
}