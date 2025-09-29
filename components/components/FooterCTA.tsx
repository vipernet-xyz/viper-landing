import { Button } from "../ui/button";

export default function FooterCTA() {
  return (
    <div className="text-center mb-20">
      <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 font-inter">
        Your Network
      </h2>
      <h2 className="text-5xl lg:text-7xl font-bold text-white/90 mb-12 font-inter">
        Needs You.
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 justify-center px-8">
        <Button
          size="lg"
          className="bg-white text-black hover:bg-[#9c7ff162] hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-xs lg:text-base"
        >
          Get Started
        </Button>
        <Button
          size="lg"
          variant="outline"
          className=" hover:bg-[#D1D1D1]/20 hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-base"
        >
          Join Community
        </Button>
      </div>
    </div>
  );
}
