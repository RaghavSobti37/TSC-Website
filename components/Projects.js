'use client'

import Image from 'next/image'
import { useState } from 'react'

const projects = [
  {
    id: 1,
    title: 'Mahavatar Narsimha',
    category: 'Business Strategy / Core Marketing / Non-Theatrical Business Monetization',
    image: '/assets/Movie_images_117.jpg',
    colSpan: 'lg:col-span-3',
    height: 'h-[500px]', // Taller for the main project
    description:
      'The journey of Mahavatar Narsimha has been nothing short of a divine orchestration. From building the campaign from the ground up—aligning music rights, shaping ideas, and jamming with the team of Kleem Productions—to witnessing everything unfold seamlessly, it was clear that this was never just our doing. With each step, we realized that Narsimha Dev Himself was leading the way, and we were merely the chosen ones entrusted with carrying out His vision.This project is a testament to what happens when purpose, spirit, and devotion come together. The incredible values, dedication, and unshakable spirit of the HOMBALE team have been the driving force behind presenting this film with authenticity and heart. What began as an idea has blossomed into an offering—a creation born out of faith, teamwork, and blessings, now ready to reach the world.In doing so, Mahavatar Narsimha not only changed the landscape of animated movies in India but also wreaked havoc at the box office, going on to become the highest-earning animated film of all time in the country.',
  },
  {
    id: 2,
    title: 'Main bhi Artist',
    category: 'Community',
    image: '/assets/mba banner.png',
    colSpan: 'lg:col-span-2',
    height: 'h-80',
    description:
      'Main Bhi Artist is a dedicated community built to uplift genuine artists in India and globally. We\'re a home for quiet music dreamers, offering a supportive space to grow, connect, and collaborate with each other.',
  },
  {
    id: 3,
    title: 'Coming Soon',
    category: 'Music Academy',
    image: '/assets/Academy coming soon!.png',
    colSpan: 'lg:col-span-1',
    height: 'h-80',
    description:
      'Unfold yourself , from within to the world. ',
  },
]

const TRUNCATE_LENGTH = 100

export default function Projects() {
  const [expandedProjectId, setExpandedProjectId] = useState(null)

  const handleToggleDescription = (projectId) => {
    setExpandedProjectId((currentId) => (currentId === projectId ? null : projectId))
  }

  return (
    <section id="projects" className="py-20 px-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-font text-4xl font-bold text-gray-800">Featured Projects</h2>
          <p className="text-lead text-gray-600 mt-2">A selection of our favorite work.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const isExpanded = expandedProjectId === project.id
            const showToggleButton = project.description.length > TRUNCATE_LENGTH

            return (
              <div key={project.id} className={`bg-white rounded-lg shadow-md overflow-hidden group ${project.colSpan}`}>
                <div className={`relative w-full ${project.height}`}>
                  <Image src={project.image} alt={`Thumbnail for ${project.title}`} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="p-6 flex flex-col">
                  <p className="text-sm font-semibold text-indigo-600">{project.category}</p>
                  <h3 className="text-xl font-bold mt-1 text-gray-900">{project.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm flex-grow">
                    {showToggleButton && !isExpanded ? `${project.description.substring(0, TRUNCATE_LENGTH)}...` : project.description}
                  </p>
                  {showToggleButton && (
                    <button onClick={() => handleToggleDescription(project.id)} className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold mt-4 self-start">
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}