"use client";

import { Button } from "@/components/ui/button";
import { Blocks } from "lucide-react";

export function FooterCTA() {
  return (
    <section className="py-20 px-4 relative h-[57rem]">
      {/* SVG Background */}
      <div className="absolute inset-0 overflow-hidden -top-[38rem]">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url(/assets/footerBG.svg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Main CTA */}
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
              className="bg-white text-black hover:bg-[#9c7ff162] hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-xs lg:text-base"
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

        {/* Footer Links */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-space-grotesk">
              + Resources:
            </h3>
            <div className="space-y-2">
              <p className="text-white font-space-grotesk">Blogs</p>
              <p className="text-white font-space-grotesk">Doc</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 font-space-grotesk">
              + Community:
            </h3>
            <div className="space-y-2">
              <p className="text-white font-space-grotesk">X [Twitter]</p>
              <p className="text-white font-space-grotesk">Github</p>
              <p className="text-white font-space-grotesk">Discord</p>
              <p className="text-white font-space-grotesk">Medium</p>
              <p className="text-white font-space-grotesk">Mail</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Blocks className="h-12 w-12 text-white" />
          </div>

          <p className="text-white/70 font-space-grotesk text-sm">
            © 2025 Viper Network Inc. All Rights Reserved
          </p>
        </div>

        {/* Large Viper Network Text */}
        <div className="text-center mt-16">
          <h1 className="text-8xl md:text-9xl font-bold text-white/10 font-space-grotesk leading-none">
            Viper Network
          </h1>
        </div>
      </div>
    </section>
  );
}
