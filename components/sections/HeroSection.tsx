'use client'

import { Button } from "@/components/ui/button"
import { Diamond, Atom, Link2, Blocks } from "lucide-react"
import GradientPolygonIcon from "@/components/icons/GradientPolygonIcon"
import Navbar from "../components/Navbar"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Background gradient with polygon */}
      <div className="absolute inset-0 gradient-purple-radial" />
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <GradientPolygonIcon width={600} height={600} />
      </div>

      <Navbar />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Floating Icons */}
          <div className="absolute -top-20 -left-20 floating-animation">
            <Diamond className="h-16 w-16 text-white/30" />
          </div>
          <div className="absolute -top-10 -right-20 floating-animation" style={{ animationDelay: '2s' }}>
            <Atom className="h-20 w-20 text-white/20" />
          </div>
          <div className="absolute -bottom-10 -left-10 floating-animation" style={{ animationDelay: '4s' }}>
            <Link2 className="h-12 w-12 text-white/25" />
          </div>
          <div className="absolute top-10 right-10 floating-animation" style={{ animationDelay: '1s' }}>
            <Blocks className="h-14 w-14 text-white/25" />
          </div>
          <div className="absolute bottom-20 right-20 floating-animation" style={{ animationDelay: '3s' }}>
            <Diamond className="h-10 w-10 text-white/30" />
          </div>

          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 font-inter">
            Viper Network
          </h1>

          <p className="text-xl md:text-2xl text-white/80 mb-4 font-space-grotesk">
            The Trustless Gateway to Web3.
          </p>

          <p className="text-lg text-white/70 mb-12 font-space-grotesk">
            Powering the Multichain Future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 font-space-grotesk font-medium">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-space-grotesk">
              Run a Node
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Isometric Element */}
      <div className="relative z-10 flex justify-center pb-20">
        <div className="relative">
          <div className="w-80 h-80 gradient-purple rounded-3xl transform rotate-12 opacity-20" />
          <div className="absolute inset-0 w-80 h-80 border-2 border-white/20 rounded-3xl transform -rotate-6" />
          <div className="absolute inset-4 bg-black/50 rounded-2xl flex items-center justify-center">
            <Blocks className="h-20 w-20 text-white/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
