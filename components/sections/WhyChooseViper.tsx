"use client";
import { Card, CardContent } from "@/components/ui/card";
import DollarIcon from "@/components/icons/DollarIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import SpeedIcon from "@/components/icons/SpeedIcon";
import SecurityIcon from "@/components/icons/SecurityIcon";
import { Clock, Shield } from "lucide-react";

export function WhyChooseViper() {
  const features = [
    {
      icon: <DollarIcon width={36} height={36} color="white" />,
      title: "Predictable & Cheaper Costs",
      description:
        "3x cheaper than centralised alternatives. Relay prices pegged to USD, no token volatility surprises.",
    },
    {
      icon: <GlobeIcon width={35} height={36} color="white" />,
      title: "Global Reliability",
      description: "Nodes rotated every session & replaced if underperforming.",
    },
    {
      icon: <Clock className="h-9 w-9" />,
      title: "Low Latency",
      description:
        "Geo-distributed network + real-time performance monitoring.",
    },
    {
      icon: <SecurityIcon width={39} height={39} color="white" />,
      title: "Security by Design",
      description: "No single point of failure, fully decentralized",
    },
    {
      icon: <Shield className="h-9 w-9" />,
      title: "Reliable & Fault-Tolerant Network",
      description:
        "99.99% uptime, performance-driven node selection & penalties for underperformance.",
    },
    {
      icon: <SpeedIcon width={41} height={42} color="white" />,
      title: "Optimized For Speed, Accuracy & Efficiency",
      description: "Watchdog monitoring & global report cards for QoS",
    },
  ];

  const getCardClasses = (index) => {
    let classes = `bg-transparent border-white/20 border-x-0 border-b-0 lg:border-y-0  lg:border-r-0 lg:border-l transition-colors rounded-none h-full pt-16 pb-4 pr-12 ${index === 0 ? "border-t-0" : ""}`;
    return classes;
  };

  const renderGridItem = (index) => {
    const feature = features[index];

    return (
      <div key={index} className="col-span-2 h-full">
        <Card className={getCardClasses(index)}>
          <CardContent className="p-8">
            <div className="mb-6">{feature.icon}</div>
            <h3 className="text-xl font-bold text-white mb-4 font-lato">
              {feature.title}
            </h3>
            <p className="text-white/80 font-lato leading-relaxed">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background circles */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/circles.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "left",
          backgroundSize: "contain",
          width: "400px",
          height: "800px",
          top: "67%",
          left: "9rem",
        }}
      />
      {/* Right side circles */}
      <div
        className="absolute right-0 top-1/2 -translate-y-[30%] translate-x-[60%] pointer-events-none"
        style={{
          backgroundImage: "url('/assets/circles.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right",
          backgroundSize: "contain",
          width: "400px",
          height: "800px",
          top: "15%",
          right: "11rem",
          transform: "scaleX(-1)",
        }}
      />
      <div>
        <h2 className="text-5xl font-bold text-white text-center mb-16 font-inter">
          Why choose Viper?
        </h2>

        {/* Top Row */}
        <div className="grid md:grid-cols-6 lg:border-b-white/20 lg:border-b">
          <div className=" h-full"></div>
          {renderGridItem(0)}
          {renderGridItem(1)}
          <div className=" h-full border-l-white/20 border-l"></div>
        </div>

        {/* Middle Row */}
        <div className="grid md:grid-cols-6 lg:border-b-white/20 lg:border-b">
          <div className=" h-full"></div>
          {renderGridItem(2)}
          {renderGridItem(3)}
          <div className="h-full border-l-white/20 border-l"></div>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-6">
          <div className=""></div>
          {renderGridItem(4)}
          {renderGridItem(5)}
          <div className="border-l-white/20 border-l"></div>
        </div>
      </div>
    </section>
  );
}
