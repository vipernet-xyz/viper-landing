'use client'
import ChainBar from "../components/ChainBar"

export function TechShowcase() {

  return (
    <section className="">
        {/* Partner Logos */}
        <ChainBar />
        {/* Main Heading */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-inter">
            Built for Developers,<br />
            Built for Web3
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto font-space-grotesk">
            Powered by a global fleet of nodes—delivering security, reliability, and
            scalability for every blockchain app.
          </p>
        </div>
    </section>
  )
}
