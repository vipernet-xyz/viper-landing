'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function UpdatesSection() {
  const updates = [
    {
      image: "/images/blog-1.png",
      date: "Jun 12, 2024",
      title: "Viper Network Unlocks Decentralised Access to Sui",
    },
    {
      image: "/images/blog-2.png",
      date: "May 30, 2024",
      title: "Viper Network Partners with Kakarot zkEVM",
    }
  ]

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 gradient-purple-radial opacity-20" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="text-white/20 text-2xl font-space-grotesk mb-4">+</div>
          <h2 className="text-5xl font-bold text-white font-inter">
            Discover Updates
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {updates.map((update, index) => (
            <Card key={index} className="bg-black border-white/70 border-[0.6px] overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={update.image}
                  alt={update.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <p className="text-white/50 text-sm font-space-grotesk mb-3">
                  {update.date}
                </p>
                <h3 className="text-white text-lg font-space-grotesk mb-6 leading-tight">
                  {update.title}
                </h3>
                <div className="border-t border-white/20 pt-4">
                  <Button variant="link" className="text-white font-space-grotesk p-0 h-auto text-sm">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-space-grotesk">
            Browse More
          </Button>
        </div>
      </div>
    </section>
  )
}