'use client'

import { Network, CircuitBoard, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FeaturesOverview() {
  return (
    <section>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Network Diagram */}
          <div className="relative">
            <div className="flex items-center justify-center">
              {/* Complex network background */}
              <div className="relative">
                <CircuitBoard className="h-80 w-80 text-white/10 absolute" />
                <Network className="h-60 w-60 text-white/20 absolute top-10 left-10" />
                <GitBranch className="h-40 w-40 text-white/15 absolute top-20 left-20" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 gradient-purple rounded-full flex items-center justify-center border-2 border-white/20">
                <Network className="h-16 w-16 text-white" />
              </div>
            </div>
            {/* Connection lines */}
            <div className="absolute top-1/2 left-1/4 w-16 h-0.5 bg-white/30 transform -translate-y-1/2" />
            <div className="absolute top-1/2 right-1/4 w-16 h-0.5 bg-white/30 transform -translate-y-1/2" />
            <div className="absolute top-1/4 left-1/2 w-0.5 h-16 bg-white/30 transform -translate-x-1/2" />
          </div>

          {/* Features */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 font-lato">Connect</h3>
              <p className="text-white/80 font-lato">
                Point your app to Viper's RPC endpoint.
              </p>
              <div className="w-32 h-1 bg-white/20 mt-4" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4 font-lato">Query</h3>
              <p className="text-white/80 font-lato">
                We route your requests to the best-performing nodes.
              </p>
              <div className="w-32 h-1 bg-white/20 mt-4" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-4 font-lato">Scale</h3>
              <p className="text-white/80 font-lato">
                Get guaranteed uptime & fast response at 3x cheaper.
              </p>
              <div className="w-32 h-1 bg-white/20 mt-4" />
            </div>

            <Button variant="link" className="text-white underline font-space-grotesk p-0">
              View Docs To Know More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
