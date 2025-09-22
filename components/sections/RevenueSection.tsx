'use client'

import { Button } from "@/components/ui/button"
import { Database, Boxes, Server, HardDrive } from "lucide-react"

export function RevenueSection() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 gradient-purple-radial opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-5xl font-bold text-white font-inter">
              Turn Reliability Into Revenue
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-space-grotesk">
                  Chain Node Pooling:
                </h3>
                <p className="text-white/70 font-space-grotesk">
                  Run nodes across multiple chains with shared resources for efficiency.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-space-grotesk">
                  Geo - Specific Rewards:
                </h3>
                <p className="text-white/70 font-space-grotesk">
                  Earn more by serving demand in your region
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-space-grotesk">
                  Performance - Based Reputation:
                </h3>
                <p className="text-white/70 font-space-grotesk">
                  Better performance (speed + reliability) = Bigger rewards.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-4 font-space-grotesk">
                  Maximise Your Earning With Viper
                </h3>
                <p className="text-white/70 font-space-grotesk mb-6">
                  Viper is built to keep node ops sustainable and profitable long-term.
                </p>
                <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-space-grotesk">
                  Run a Node
                </Button>
              </div>
            </div>

            <div className="text-white/20 text-2xl font-space-grotesk">
              +
            </div>
          </div>

          {/* Isometric Illustration */}
          <div className="relative flex justify-center">
            <div className="relative w-96 h-96">
              {/* Complex 3D Infrastructure */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Main central tower */}
                <div className="relative">
                  <div className="w-20 h-32 bg-gradient-to-t from-purple-600/40 to-purple-400/40 border border-white/30 rounded-lg transform rotate-12 flex flex-col items-center justify-center">
                    <Server className="h-8 w-8 text-white/70 mb-2" />
                    <div className="w-12 h-1 bg-white/40 mb-1" />
                    <div className="w-8 h-1 bg-white/30" />
                  </div>
                  
                  {/* Surrounding smaller blocks */}
                  <div className="absolute -top-8 -left-8 w-12 h-12 bg-gradient-to-br from-purple-500/30 to-purple-700/30 border border-white/20 rounded-lg transform -rotate-6 flex items-center justify-center">
                    <Database className="h-4 w-4 text-white/60" />
                  </div>
                  <div className="absolute -top-8 -right-8 w-12 h-12 bg-gradient-to-br from-purple-500/30 to-purple-700/30 border border-white/20 rounded-lg transform rotate-6 flex items-center justify-center">
                    <HardDrive className="h-4 w-4 text-white/60" />
                  </div>
                  <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-br from-purple-500/30 to-purple-700/30 border border-white/20 rounded-lg transform rotate-12 flex items-center justify-center">
                    <Boxes className="h-4 w-4 text-white/60" />
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-br from-purple-500/30 to-purple-700/30 border border-white/20 rounded-lg transform -rotate-12 flex items-center justify-center">
                    <Database className="h-4 w-4 text-white/60" />
                  </div>
                  
                  {/* Connection lines */}
                  <div className="absolute top-1/2 -left-16 w-8 h-0.5 bg-white/30 transform -translate-y-1/2" />
                  <div className="absolute top-1/2 -right-16 w-8 h-0.5 bg-white/30 transform -translate-y-1/2" />
                  <div className="absolute -top-16 left-1/2 w-0.5 h-8 bg-white/30 transform -translate-x-1/2" />
                  <div className="absolute -bottom-16 left-1/2 w-0.5 h-8 bg-white/30 transform -translate-x-1/2" />
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-4 left-4 floating-animation">
                <div className="w-8 h-8 bg-purple-500/20 border border-white/20 rounded transform rotate-45" />
              </div>
              <div className="absolute bottom-4 right-4 floating-animation" style={{ animationDelay: '2s' }}>
                <div className="w-6 h-6 bg-purple-400/20 border border-white/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}