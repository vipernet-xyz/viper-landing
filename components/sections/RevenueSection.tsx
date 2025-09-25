'use client'
import { Button } from "@/components/ui/button"
import { Database, Boxes, Server, HardDrive } from "lucide-react"

export function RevenueSection() {
  const features = [
    {
      title: "Chain Node Pooling:",
      description: "Run nodes across multiple chains with shared resources for efficiency."
    },
    {
      title: "Geo - Specific Rewards:",
      description: "Earn more by serving demand in your region"
    },
    {
      title: "Performance - Based Reputation:",
      description: "Better performance (speed + reliability) = Bigger rewards."
    }
  ]

  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 gradient-purple-radial opacity-30" />
      <div className="max-w-7xl mx-auto relative z-10 border border-white/20">
        <h2 className="text-5xl font-bold text-white font-inter px-8 py-8 border-b border-white/20">
          Turn Reliability Into Revenue
        </h2>
        <div className="grid grid-cols-2">

          <div className="flex flex-col border-r border-r-white/20 col-span-1">
            {features.map((feature, index) => (
              <div key={index} className="border-b border-b-white/20 py-16 px-12">
                <h3 className="text-xl font-bold text-white mb-4 font-space-grotesk">
                  {feature.title}
                </h3>
                <p className="text-white/70 font-space-grotesk text-xl">
                  {feature.description}
                </p>
              </div>
            ))}
            <div className="pt-16 pb-12 px-12">
              <h3 className="text-xl font-bold text-white mb-4 font-space-grotesk">
                Maximise Your Earning With Viper
              </h3>
              <p className="text-white/70 font-space-grotesk mb-12 text-xl">
                Viper is built to keep node ops sustainable and profitable long-term.
              </p>
              <Button className="bg-transparent border border-white/30 text-white hover:bg-white/10 font-space-grotesk">
                Run a Node
              </Button>
            </div>

          </div>
          <div className="col-span-1 relative flex items-center justify-center p-8">
            {/* Three circles background */}
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{
                backgroundImage: "url('/assets/threecircles.svg')",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'cover',
              }}
            />

            {/* Main reliability illustration */}
            <div className="relative z-20 flex flex-col items-center">
              <img
                src="/assets/reliability.svg"
                alt="Reliability Network"
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
