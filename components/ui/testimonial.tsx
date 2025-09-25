import { Card, CardContent } from "@/components/ui/card"

interface TestimonialProps {
  name: string
  handle: string
  avatar: string
  content: string
  isActive?: boolean
}

export function Testimonial({ name, handle, avatar, content, isActive = false }: TestimonialProps) {
  return (
    <Card
      className={`h-full transition-all rounded-none bg-transparent duration-500 ${
        isActive
          ? "border-white/80 shadow-xl"
          : "border-white/30 opacity-60"
      } backdrop-blur-sm border`}
    >
      <CardContent className="p-6 h-80">
        <div className="flex items-center space-x-3 mb-6">
          <div
            className="w-12 h-12 rounded-full border-2 border-white/20"
            style={{
              backgroundImage: `url(${avatar})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div>
            <p className="text-white font-lato font-medium">{name}</p>
            <p className="text-white/60 font-lato text-sm">{handle}</p>
          </div>
        </div>
        <p className="text-white/90 font-space-grotesk text-base leading-relaxed">
          {content}
        </p>
      </CardContent>
    </Card>
  )
}
