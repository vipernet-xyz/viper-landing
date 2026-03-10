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
      <div className="relative w-full pt-20 md:min-h-screen md:pt-24">
        <div className="relative flex w-full justify-center overflow-hidden overflow-clip">
        <div className="relative flex items-end justify-center overflow-hidden md:pb-32 w-screen min-w-[440px] md:min-w-[1280px] aspect-[440/420] md:aspect-[1280/550] bg-cover bg-center bg-[url('/assets/hero-section/top-section-mobile.png')] md:bg-[url('/assets/hero-section/top-section.png')]">
            <div className="relative z-20 max-w-3xl px-4 text-center">
              <h1 className="mb-6 font-inter text-4xl md:text-5xl font-bold text-white md:text-7xl">
                Viper Network
              </h1>
              <p className="mb-3 font-space-grotesk text-xl text-white/80 md:text-2xl">
                The Trustless Gateway to Web3.
              </p>
              <p className="mb-8 font-space-grotesk text-sm uppercase tracking-[0.24em] text-white/45">
                Login in seconds. Relay across chains immediately.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="w-36 cursor-pointer border border-white bg-white font-space-grotesk text-base font-medium text-black hover:bg-white/80"
                >
                  <Link href="/login">Launch App</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-36 border border-white bg-transparent font-space-grotesk text-base font-medium text-white hover:bg-[#D1D1D1]/20 hover:text-white"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
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
                width={544}
                height={723}
                className="mx-auto h-auto w-[281px] md:w-[375px]"
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
                width={544}
                height={723}
                className="mx-auto h-auto w-[281px] md:w-[375px]"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
