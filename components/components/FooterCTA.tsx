import { Button } from "../ui/button";

export default function FooterCTA() {
  return (
    <div className="text-center mb-20">
      <h2 className="text-6xl md:text-7xl font-bold text-white mb-8 font-inter">
        Your Network
      </h2>
      <h2 className="text-6xl md:text-7xl font-bold text-white/90 mb-12 font-inter">
        Needs You.
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          className="bg-white text-black hover:bg-white/90 font-space-grotesk font-medium"
        >
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10 font-space-grotesk"
        >
          Join Community
        </Button>
      </div>
    </div>
  );
}
