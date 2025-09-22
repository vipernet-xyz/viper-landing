'use client'

import Image from "next/image"

export function TechShowcase() {
  const partners = [
    { src: "/images/partner-1.png", alt: "Partner 1" },
    { src: "/images/partner-2.png", alt: "Partner 2" },
    { src: "/images/partner-3.png", alt: "Partner 3" },
    { src: "/images/partner-4.png", alt: "Partner 4" },
    { src: "/images/partner-5.png", alt: "Partner 5" },
    { src: "/images/partner-6.png", alt: "Partner 6" },
    { src: "/images/partner-7.png", alt: "Partner 7" },
    { src: "/images/partner-9.png", alt: "Partner 9" },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Partner Logos */}
        <div className="border border-white/50 rounded-lg p-8 mb-16 bg-white/5 backdrop-blur-sm">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div key={index} className="w-14 h-14 relative opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110">
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  fill
                  className="object-contain filter brightness-0 invert"
                />
              </div>
            ))}
          </div>
        </div>

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
      </div>
    </section>
  )
}