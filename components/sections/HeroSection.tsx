"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import PulseAnimation from "../components/PulseAnimation";

export function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center overflow-hidden bg-black text-center pb-24"
      style={{
        backgroundImage: "url('/assets/hero-section/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative w-full min-h-screen pt-18">
        <div className="relative flex w-full justify-center overflow-hidden overflow-clip">
          <div
            className="relative flex items-end justify-center overflow-hidden pb-32 w-screen min-w-[1280px]"
            style={{
              aspectRatio: "1280/550",
              backgroundImage: "url('/assets/hero-section/top-section.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative z-20 max-w-3xl text-center">
              <h1 className="mb-6 font-inter text-5xl font-bold text-white md:text-7xl">
                Viper Network
              </h1>
              <p className="mb-8 font-space-grotesk text-xl text-white/80 md:text-2xl">
                The Trustless Gateway to Web3.
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="border border-white bg-white text-black hover:border hover:bg-[#9c7ff1]/40 hover:text-white font-space-grotesk font-medium text-base cursor-pointer"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border border-white hover:border hover:bg-[#D1D1D1]/20 hover:text-white font-space-grotesk font-medium text-base cursor-pointer"
                >
                  Run a Node
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* CHIP + LINES */}
        <div className="relative z-10 top-[-64px] flex w-full justify-center overflow-visible px-4">
          <div className="relative h-[360px] w-[960px] min-w-[960px]">
            <div className="absolute bottom-0 left-[calc(50%+2.5rem)]">
              <PulseAnimation flip />
            </div>

            <div className="absolute bottom-0 right-[calc(50%+2.5rem)] scale-x-[-1]">
              <PulseAnimation flip />
            </div>

            <motion.div
              className="absolute bottom-[72px] right-1/2 translate-x-1/2"
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
              className="absolute bottom-[72px] right-1/2 translate-x-1/2"
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
        </div>
      </div>
    </section>
  );
}

