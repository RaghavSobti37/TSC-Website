export default function About() {
  return (
    <section id="about" className="py-20 px-6 bg-cream">
      <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Video Column - responsive 16:9 on mobile, fixed height on large */}
        <div className="w-full rounded-lg overflow-hidden shadow-lg">
          <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/assets/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Text Column - improved layout */}
        <div>
          <p className="text-pumpkin font-black text-xs uppercase tracking-widest mb-2">Who we are</p>
          <h2 className="heading-font text-4xl font-bold mb-4 text-wine">About The Collective</h2>
          <p className="text-lg text-wine/80 mb-6">
            The Shakti Collective is where modern music, cultural storytelling and community converge. We nurture artists, craft meaningful music, and build experiences that connect deeply with audiences.
          </p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h4 className="text-pumpkin font-bold mb-2">Our Mission</h4>
              <p className="text-wine/80 text-sm">Amplify underrepresented voices through creative projects, performance and education.</p>
            </div>
            <div>
              <h4 className="text-pumpkin font-bold mb-2">What We Do</h4>
              <p className="text-wine/80 text-sm">Produce music, host showcases, run an academy and build community-driven campaigns.</p>
            </div>
          </div>

          <div className="mt-6">
            <a href="https://www.instagram.com/the_shakti_collective?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-3 bg-pumpkin text-cream rounded-md font-bold text-sm hover:bg-pumpkin/90 transition-colors">Join Our Community</a>
          </div>
        </div>
      </div>
    </section>
  )
}
