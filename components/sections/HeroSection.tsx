"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion } from "motion/react";
import PulseAnimation from "../components/PulseAnimation";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      className="relative flex flex-col items-center overflow-hidden bg-black text-center"
      style={{
        backgroundImage: "url('/assets/hero-section/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="relative w-full md:min-h-screen pt-18">
        <div className="relative flex w-full justify-center overflow-hidden overflow-clip">
        <div className="relative flex items-end justify-center overflow-hidden md:pb-32 w-screen min-w-[440px] md:min-w-[1280px] aspect-[440/420] md:aspect-[1280/550] bg-cover bg-center bg-[url('/assets/hero-section/top-section-mobile.png')] md:bg-[url('/assets/hero-section/top-section.png')]">
            <div className="relative z-20 max-w-3xl text-center">
              <h1 className="mb-6 font-inter text-4xl md:text-5xl font-bold text-white md:text-7xl">
                Viper Network
              </h1>
              <p className="mb-8 font-space-grotesk text-xl text-white/80 text-xl md:text-2xl">
                The Trustless Gateway to Web3.
              </p>
              <div className="flex justify-center gap-4">
                <Link href={'https://tally.so/r/wdrzdd'} target="_blank">
        <Button
          size="lg"
          className="bg-white text-black hover:bg-[#9c7ff162] hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-base w-36 cursor-pointer w-32"
        >
          Join Waitlist
        </Button>
        </Link>


        <Link href={'https://discord.com/invite/eBDYH4Zxek'}  target="_blank">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-32 border border-white hover:border hover:bg-[#D1D1D1]/20 hover:text-white font-space-grotesk font-medium text-base cursor-pointer"
                >
                  Join Us
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* CHIP + LINES */}
        <div className="relative z-10 lg:top-[-64px] flex w-full justify-center overflow-visible px-4">
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
                duration: 3.3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <Image
                src="/assets/hero-section/viper-chip.png"
                alt="Hero Animation"
                width={375}
                height={250}
                className="mx-auto scale-[0.75] md:scale-100"
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
                duration: 3.3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            >
              <Image
                src="/assets/hero-section/viper-chip-glow.png"
                alt="Hero Glow"
                width={375}
                className="mx-auto scale-[0.75] md:scale-100"
                height={250}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

