'use client'

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"

export function CommunityBuzz() {
  const testimonials = [
    {
      name: "Lena Fischer",
      handle: "@fischer11",
      avatar: "https://i.pravatar.cc/150?img=1",
      content:
        "Have you checked out Viper Network ahead of launch? If you're a builder this should definitely be a part of your toolkit. Check them out! 👇",
    },
    {
      name: "John Kerman",
      handle: "@kerman_60",
      avatar: "https://i.pravatar.cc/150?img=2",
      content:
        "Put my nodes up on Viper last night. I'm 66 years old and found it so simple to get them running, a two year old could do it. Great job development team.",
    },
    {
      name: "Rizwan",
      handle: "@rizz00",
      avatar: "https://i.pravatar.cc/150?img=3",
      content:
        "Setting up with Viper felt like they actually thought about the operator experience.",
    },
    {
      name: "Sarah Chen",
      handle: "@sarahbuilds",
      avatar: "https://i.pravatar.cc/150?img=4",
      content:
        "Finally, a node infrastructure that doesn't require a PhD to set up. Viper's documentation is actually readable!",
    },
    {
      name: "Diego Marquez",
      handle: "@dmarqz",
      avatar: "https://i.pravatar.cc/150?img=5",
      content:
        "Honestly, the smoothest onboarding I’ve had in years. Viper just *works*.",
    },
    {
      name: "Lena Fischer",
      handle: "@fischer11",
      avatar: "https://i.pravatar.cc/150?img=1",
      content:
        "Have you checked out Viper Network ahead of launch? If you're a builder this should definitely be a part of your toolkit. Check them out! 👇",
    },
    {
      name: "John Kerman",
      handle: "@kerman_60",
      avatar: "https://i.pravatar.cc/150?img=2",
      content:
        "Put my nodes up on Viper last night. I'm 66 years old and found it so simple to get them running, a two year old could do it. Great job development team.",
    },
  ]

  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      slidesToScroll: 1,
    },
    // CHANGE #2: Increased speed by reducing the delay from 4000ms to 2500ms.
    [Autoplay({ delay: 2500, stopOnInteraction: false })]
  )

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    onSelect(emblaApi)
  }, [emblaApi, onSelect])

  return (
    <section className="py-20 px-4 mb-[26rem]">
      <div className="container mx-auto">
        <h2 className="text-5xl font-bold text-white text-center mb-16 font-inter">
          Community Buzz
        </h2>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => {
                const isActive = index === selectedIndex
                return (
                  <div
                    key={index}
                    className="min-w-0 flex-[0_0_80%] md:flex-[0_0_33.33%] lg:flex-[0_0_20%] pl-4"
                  >
                    <Card
                      className={`h-full transition-all duration-500 ${
                        isActive
                          ? "bg-black/60 border-white/80 shadow-xl"
                          : "bg-black/30 border-white/30 opacity-60"
                      } backdrop-blur-sm border rounded-xl`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-6">
                          <div
                            className="w-12 h-12 rounded-full bg-accent border-2 border-white/20"
                            style={{
                              backgroundImage: `url(${testimonial.avatar})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div>
                            <p className="text-white font-lato font-medium">
                              {testimonial.name}
                            </p>
                            <p className="text-white/60 font-lato text-sm">
                              {testimonial.handle}
                            </p>
                          </div>
                        </div>
                        <p className="text-white/90 font-space-grotesk text-base leading-relaxed">
                          {testimonial.content}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 20%, black 80%, transparent)",
            }}
          />
        </div>
      </div>
    </section>
  )
}
