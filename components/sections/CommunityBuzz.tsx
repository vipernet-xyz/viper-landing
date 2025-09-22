'use client'

import { Card, CardContent } from "@/components/ui/card"

export function CommunityBuzz() {
  const testimonials = [
    {
      name: "Lena Fischer",
      handle: "@fischer11",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "Have you checked out Viper Network ahead of launch? If you're a builder this should definitely be a part of your toolkit. Check them out! 👇"
    },
    {
      name: "John Kerman",
      handle: "@kerman_60",
      avatar: "https://i.pravatar.cc/150?img=2",
      content: "Put my nodes up on Viper last night. I'm 66 years old and found it so simple to get them running, a two year old could do it. Great job development team.",
      featured: true
    },
    {
      name: "Rizwan",
      handle: "@rizz00",
      avatar: "https://i.pravatar.cc/150?img=3",
      content: "Setting up with Viper felt like they actually thought about the operator experience."
    },
    {
      name: "Sarah Chen",
      handle: "@sarahbuilds",
      avatar: "https://i.pravatar.cc/150?img=4",
      content: "Finally, a node infrastructure that doesn't require a PhD to set up. Viper's documentation is actually readable!"
    }
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-white text-center mb-16 font-inter">
          Community Buzz
        </h2>

        <div className="flex gap-10 overflow-x-auto pb-4 scrollbar-hide">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className={`min-w-80 bg-black/40 backdrop-blur-sm border-white/60 hover:border-white/80 transition-all duration-300 ${
                testimonial.featured ? 'border-2 bg-black/60' : 'border'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-full bg-accent border-2 border-white/20"
                    style={{
                      backgroundImage: `url(${testimonial.avatar})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <div>
                    <p className="text-white font-lato text-sm font-medium">
                      {testimonial.name}
                    </p>
                    <p className="text-white/60 font-lato text-sm">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>
                <p className="text-white font-space-grotesk text-sm leading-relaxed">
                  {testimonial.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}