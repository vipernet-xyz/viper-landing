"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import PulseLine from "../components/PulseAnimation";

export function HeroSection() {
  return (
    <section
      className="flex flex-col items-center justify-center bg-black text-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/assets/hero-section/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* TEXT + BUTTONS */}
      <div className="z-20 min-h-screen flex justify-center items-center">
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
              className="hover:bg-[#D1D1D1]/20 hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-base"
            >
              Run a Node
            </Button>
          </div>
        </div>
      </div>

      {/* CHIP + LINES */}
      <div className="z-10 relative py-8 w-full md:h-44">
        <div className="absolute bottom-4 left-1/2">
          <PulseLine />
        </div>

        <div className="absolute bottom-4 right-1/2 scale-x-[-1]">
          <PulseLine />
        </div>

        <motion.div
          className="absolute bottom-8 right-1/2 translate-x-1/2 w-3/4 md:w-1/2"
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
            src="/assets/hero-section/viper-chip.png"
            alt="Hero Animation"
            width={375}
            height={250}
            className="mx-auto"
          />
        </motion.div>

        {/* Chip glow overlay */}
        <motion.div
          className="absolute bottom-8 right-1/2 translate-x-1/2 w-3/4 md:w-1/2"
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
            src="/assets/hero-section/viper-chip-glow.png"
            alt="Hero Glow"
            width={375}
            className="mx-auto"
            height={250}
          />
        </motion.div>
      </div>
    </section>
  );
}
