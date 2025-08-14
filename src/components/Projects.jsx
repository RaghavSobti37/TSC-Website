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
    <section id="projects" className="section-dark py-20 px-4 md:px-0">
      <div className="section-header mb-12">
        <h2 className="heading-font text-section-title text-white section-title">
          Our <span className="text-gradient">Projects</span>
        </h2>
        <p className="text-lead text-gray-300 text-wrapper font-light element-spacing-lg">
          Explore what we're building now and what's coming soon.
        </p>
      </div>
  <div className="grid-auto gap-8">
        {projects.map((project, idx) => (
          <div key={idx} className="card flex flex-col items-start shadow-lg border border-primary-teal" style={{background: 'linear-gradient(135deg, #5fb3a3 0%, #ff5722 100%)'}}>
            <span className={`mb-3 px-4 py-1 rounded-full text-sm font-semibold tracking-wide ${tagColors[project.status]}`}>{project.status === "current" ? "Current Project" : "Future Project"}</span>
            <h3 className="text-card-title mb-2 text-white" style={{textShadow: '0 0 8px #23232a, 0 0 2px #fff'}}>{project.title}</h3>
            <p className="text-white text-body" style={{textShadow: '0 0 2px #23232a'}}>{project.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
