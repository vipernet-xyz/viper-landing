'use client'

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { Testimonial } from "@/components/ui/testimonial"

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
      "Honestly, the smoothest onboarding I've had in years. Viper just *works*.",
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

export function CommunityBuzz() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "center",
      loop: true,
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 2500, stopOnInteraction: false })]
  )

  const onSelect = useCallback((emblaApi) => {
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", onSelect)
    onSelect(emblaApi)
  }, [emblaApi, onSelect])

  return (
    <section className="py-20">
      <div className="mx-auto">
        <h2 className="text-5xl font-bold text-white text-center mb-16 font-inter">
          Community Buzz
        </h2>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="min-w-0 flex-[0_0_50%] lg:flex-[0_0_25%] mx-8"
                >
                  <Testimonial
                    {...testimonial}
                    isActive={index === selectedIndex}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
