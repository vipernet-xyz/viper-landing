import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  name: string;
  handle: string;
  avatar: string;
  content: string;
  isActive?: boolean;
}

export function Testimonial({
  name,
  handle,
  avatar,
  content,
  isActive = false,
}: TestimonialProps) {
  return (
    <div className="relative h-full group">
      <Card
        className={`h-full transition-all rounded-none bg-transparent duration-500 ${
          isActive ? "shadow-xl" : "border-white/30 opacity-60"
        } backdrop-blur-sm ${!isActive ? "border" : ""}`}
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

      {/* Corner highlights when active - positioned with spacing from card */}
      {isActive && (
        <>
          {/* Top-left corner */}
          <div className="absolute -top-1.5 -left-1.5 group-hover:-top-2.5 group-hover:-left-2.5 w-5 h-5 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-white/80"></div>
            <div className="absolute top-0 left-0 w-0.5 h-full bg-white/80"></div>
          </div>

          {/* Top-right corner */}
          <div className="absolute -top-1.5 -right-1.5 group-hover:-top-2.5 group-hover:-right-2.5 w-5 h-5 transition-all duration-300">
            <div className="absolute top-0 right-0 w-full h-0.5 bg-white/80"></div>
            <div className="absolute top-0 right-0 w-0.5 h-full bg-white/80"></div>
          </div>

          {/* Bottom-left corner */}
          <div className="absolute -bottom-1.5 -left-1.5 group-hover:-bottom-2.5 group-hover:-left-2.5 w-5 h-5 transition-all duration-300">
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/80"></div>
            <div className="absolute bottom-0 left-0 w-0.5 h-full bg-white/80"></div>
          </div>

          {/* Bottom-right corner */}
          <div className="absolute -bottom-1.5 -right-1.5 group-hover:-bottom-2.5 group-hover:-right-2.5 w-5 h-5 transition-all duration-300">
            <div className="absolute bottom-0 right-0 w-full h-0.5 bg-white/80"></div>
            <div className="absolute bottom-0 right-0 w-0.5 h-full bg-white/80"></div>
          </div>
        </>
      )}
    </div>
  );
}
