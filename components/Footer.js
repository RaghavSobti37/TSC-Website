import Image from 'next/image'
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Footer() {
  return (
    // This assumes you have a gradient defined in your CSS, e.g.,
    // .bg-gradient-primary { background-image: linear-gradient(to right, #4f46e5, #818cf8); }
    <footer className="bg-gradient-primary text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Newsletter Section */}
          <div className="lg:col-span-5">
            <h3 className="text-2xl font-bold mb-2 heading-font">Join Our Collective</h3>
            <p className="mb-6 text-indigo-200">Get the latest on our projects and creative insights delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row">
              <input type="email" placeholder="Your Email Address" className="w-full px-4 py-3 text-gray-800 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-indigo-300" required />
              <button type="submit" className="mt-2 sm:mt-0 px-6 py-3 bg-white text-indigo-600 font-bold rounded-md sm:rounded-r-md sm:rounded-l-none hover:bg-gray-200 transition-colors">
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
              <Image src="/assets/only logo.png" alt="The Shakti Collective Logo" layout="fill" objectFit="contain" />
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

        <div className="mt-16 border-t border-white/20 pt-8 text-center text-sm text-indigo-200">
          <p>&copy; {new Date().getFullYear()} The Shakti Collective. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}