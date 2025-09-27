import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section
      className="h-screen flex flex-col items-center justify-center bg-black text-center"
      style={{
        backgroundImage: "url('/assets/homepage-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex-1 flex items-center justify-center">
        <div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 font-inter">
            Viper Network
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-8 font-space-grotesk">
            The Trustless Gateway to Web3.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-[#9c7ff1]/40 hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-base"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className=" hover:bg-[#D1D1D1]/20 hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-base"
            >
              Run a Node
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full max-w-md mx-auto mb-8">
        <LottiePlayer src="/assets/lottie/home.lottie" loop autoplay />
      </div>
    </section>
  );
}
