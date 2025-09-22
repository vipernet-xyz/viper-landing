'use client'

import { Card, CardContent } from "@/components/ui/card"
import DollarIcon from "@/components/icons/DollarIcon"
import GlobeIcon from "@/components/icons/GlobeIcon"
import SpeedIcon from "@/components/icons/SpeedIcon"
import SecurityIcon from "@/components/icons/SecurityIcon"
import { Clock, Shield } from "lucide-react"

export function WhyChooseViper() {
  const features = [
    {
      icon: <DollarIcon width={36} height={36} color="white" />,
      title: "Predictable & Cheaper Costs",
      description: "3x cheaper than centralised alternatives. Relay prices pegged to USD, no token volatility surprises."
    },
    {
      icon: <GlobeIcon width={35} height={36} color="white" />,
      title: "Global Reliability",
      description: "Nodes rotated every session & replaced if underperforming."
    },
    {
      icon: <Clock className="h-9 w-9" />,
      title: "Low Latency",
      description: "Geo-distributed network + real-time performance monitoring."
    },
    {
      icon: <SecurityIcon width={39} height={39} color="white" />,
      title: "Security by Design",
      description: "No single point of failure, fully decentralized"
    },
    {
      icon: <Shield className="h-9 w-9" />,
      title: "Reliable & Fault-Tolerant Network",
      description: "99.99% uptime, performance-driven node selection & penalties for underperformance."
    },
    {
      icon: <SpeedIcon width={41} height={42} color="white" />,
      title: "Optimized For Speed, Accuracy & Efficiency",
      description: "Watchdog monitoring & global report cards for QoS"
    }
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-white text-center mb-16 font-inter">
          Why choose Viper?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-transparent border-white/20 hover:border-white/40 transition-colors">
              <CardContent className="p-8">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-lato">
                  {feature.title}
                </h3>
                <p className="text-white/80 font-lato leading-relaxed">
                  {feature.description}
                </p>
                <div className="text-white/20 text-2xl mt-6 font-space-grotesk">
                  +
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}