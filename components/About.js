export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-white">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Video Column */}
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
          <video
            className="w-full h-full object-cover"
            src="/assets/hero.mp4" // Assumes hero.mp4 is in the /public folder
            autoPlay
            loop
            muted
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Text Column */}
        <div>
          <h2 className="heading-font text-4xl font-bold mb-4 text-gray-800">About The Collective</h2>
          <p className="text-lg text-gray-600 mb-4">
            Imagine a place where music and stories come alive! The Shakti Collective envisions a stage where groundbreaking music and cultural narratives converge, fostering fire artists who resonate with a diverse audience.
          </p>
          <p className="text-lg text-gray-600">
            By modernizing deep cultural stories, crafting entertaining & conscious music, a dedicated fan community, and an academy, all working in sync to discover, nurture, and connect artists with a global audience, and pushing the culture forward. Join the wave!
          </p>
        </div>
      </div>
    </section>
  )
}
