"use client";
import { Button } from "@/components/ui/button";
import CrazyAnimation from "../components/CrazyAnimation";
import Image from "next/image";
import Link from "next/link";

export function RevenueSection() {
  const features = [
    {
      title: "Chain Node Pooling:",
      description:
        "Run nodes across multiple chains with shared resources for efficiency.",
    },
    {
      title: "Geo - Specific Rewards:",
      description: "Earn more by serving demand in your region",
    },
    {
      title: "Performance - Based Reputation:",
      description: "Better performance (speed + reliability) = Bigger rewards.",
    },
  ];

  return (
    <section className="lg:py-20 px-4 relative overflow-x-clip">
      {/* Full space gradient background */}
      <div className="absolute inset-0 pointer-events-none md:left-1/3">
        <div
          className="w-full h-full blur-3xl opacity-30"
          style={{
            background: `radial-gradient(circle, #7E5CFF 0%, transparent 70%)`,
          }}
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10 border border-white/20">
        <h2 className="text-3xl md:text-5xl font-bold text-white font-inter px-4 md:px-8 py-6 md:py-8 border-b border-white/20">
          Turn Reliability Into Revenue
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col md:border-r md:border-r-white/20 col-span-1 relative">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border-b border-b-white/20 py-8 md:py-16 px-6 md:px-12 relative z-10"
              >
                <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 font-space-grotesk">
                  {feature.title}
                </h3>
                <p className="text-white/70 font-space-grotesk text-lg md:text-xl">
                  {feature.description}
                </p>
              </div>
            ))}
            <div className="pt-8 md:pt-16 pb-8 md:pb-12 px-6 md:px-12 relative z-10">
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 font-space-grotesk">
                Maximise Your Earning With Viper
              </h3>
              <p className="text-white/70 font-space-grotesk mb-8 md:mb-12 text-lg md:text-xl">
                Viper is built to keep node ops sustainable and profitable
                long-term.
              </p>
        <Link href={'https://discord.com/invite/eBDYH4Zxek'}  target="_blank">

              <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-space-grotesk w-full md:w-auto cursor-pointer">
                Join Us
              </Button>
              </Link>
            </div>
          </div>

          {/* Right column - hidden on mobile */}
          <div className="hidden md:flex col-span-1 relative items-center justify-center p-8 overflow-clip">
            <div className="absolute inset-0 -z-10 right-1/4 overflow-visible">
            <Image
                src="/assets/revenue/circles-bg.svg"
                alt="Reliability Network"
                fill
                className="z-5 w-full h-auto object-cover object-center overflow-visible"
              /> 
              </div>
            {/* Main reliability illustration */}
            <div className="z-20 flex flex-col items-center justify-center w-full h-full">
              <CrazyAnimation />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
