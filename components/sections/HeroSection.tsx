import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import HeroCircles from "../components/HeroCircles";

export function HeroSection() {
  return (
    <section
      className="h-screen flex flex-col items-center justify-center bg-black text-center relative"
      style={{
        backgroundImage: "url('/assets/hero-section/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex-1 flex items-center justify-center z-20">
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
      <div className="w-full mx-auto mb-8 max-w-lg flex justify-center z-10 absolute top-1/4">
        {/* First chip - always visible with floating animation */}
        <motion.div
          className="absolute"
          animate={{
            y: [0, -12, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <Image
            src="/assets/hero-section/chip.svg"
            alt="Hero Animation"
            width={600}
            height={400}
          />
        </motion.div>

        {/* Second chip - fades in and out smoothly over the first */}
        <motion.div
          className="absolute"
          animate={{
            opacity: [0, 0.5, 0.5, 0],
            y: [0, -12, 0],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <Image
            src="/assets/hero-section/chip-glow.svg"
            alt="Hero Animation"
            width={600}
            height={400}
          />
        </motion.div>
      </div>
    </section>
  );
}
