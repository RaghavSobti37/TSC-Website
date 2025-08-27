import React from "react";

const projects = [
  {
    title: "AI Music Generator",
    description: "A tool for generating music using AI models.",
    status: "current",
  },
  {
    title: "Virtual Concert Platform",
    description: "A platform for hosting virtual concerts with interactive features.",
    status: "future",
  },
  {
    title: "Artist Collaboration Portal",
    description: "A portal for artists to collaborate and share resources.",
    status: "current",
  },
  {
    title: "NFT Marketplace",
    description: "A marketplace for music-related NFTs.",
    status: "future",
  },
];

const tagColors = {
  current: "bg-primary-teal text-white",
  future: "bg-secondary-orange text-white",
};

export default function Projects() {
  return (
    <section id="projects" className="section-dark py-20 px-4 md:px-0 font-sans">
      <div className="section-header mb-12">
        <h2 className="heading-font text-section-title text-primary-teal section-title">
          Our <span className="text-secondary-orange">Projects</span>
        </h2>
        <p className="text-lead text-gray-400 text-wrapper font-light element-spacing-lg">
          Explore what we're building now and what's coming soon.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, idx) => (
          <div key={idx} className="card flex flex-col items-start justify-center shadow-lg border-2 border-primary-teal rounded-2xl p-6 bg-white/10 hover:bg-primary-teal/20 hover:scale-105 transition-transform duration-300 min-h-[260px] max-w-[340px] mx-auto">
            <span className={`mb-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${tagColors[project.status]}`}>{project.status === "current" ? "Current Project" : "Future Project"}</span>
            <h3 className="text-xl mb-1 text-primary-teal font-bold">{project.title}</h3>
            <p className="text-sm text-gray-200 font-normal">{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
