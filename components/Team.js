import Image from 'next/image'
import { FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

const teamMembers = [
  {
    id: 1,
    name: 'Rohith Sobti',
    role: 'Co-founder and CEO',
    image: '/assets/Rohit.jpg',
    description: 'Rohith is the visionary leader driving the creative and strategic direction of The Shakti Collective.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/rohitsobti/',
      instagram: 'https://www.instagram.com/rohitsobti1?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    },
  },
  {
    id: 2,
    name: 'Sandesh Shandaliya',
    role: 'Co-founder and Mentor',
    image: '/assets/sandesh.jpg',
    description: 'With decades of experience, Sandesh guides our team, fostering growth and artistic excellence.',
    socials: {
      instagram: 'https://www.instagram.com/sandeshshandilya?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    },
  },
  {
    id: 3,
    name: 'Deepank Soni',
    role: 'G.O.A.T',
    image: '/assets/deepank.jpg',
    description: 'Deepank is our master of motion, bringing static designs to life with unparalleled skill and creativity.',
    socials: {
      linkedin: 'https://www.linkedin.com/in/deepank-soni-bab014243/',
      instagram: 'https://www.instagram.com/deepank_soni_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    },
  },
]

export default function Team() {
  return (
    <section id="team" className="py-20 px-6 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="heading-font text-4xl font-bold text-gray-800 mb-12">Our Core Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-center max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.id} className="group">
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white cursor-pointer">
                <Image src={member.image} alt={`Portrait of ${member.name}`} layout="fill" objectFit="cover" />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 text-white opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
                  <p className="text-sm text-center">{member.description}</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
              <div className="flex justify-center gap-4 mt-3">
                {member.socials.linkedin && (
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><FaLinkedin size={20} /></a>
                )}
                {member.socials.instagram && (
                  <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><FaInstagram size={20} /></a>
                )}
                {member.socials.twitter && (
                  <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors"><FaTwitter size={20} /></a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}