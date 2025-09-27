"use client";

import { Button } from "@/components/ui/button";
import UpdateCard from "../components/UpdateCard";

export function UpdatesSection() {
  const updates = [
    {
      image: "/images/blog-1.png",
      date: "Jun 12, 2024",
      title: "Viper Network Unlocks Decentralised Access to Sui",
    },
    {
      image: "/images/blog-2.png",
      date: "May 30, 2024",
      title: "Viper Network Partners with Kakarot zkEVM",
    },
  ];

  return (
    <section
      className="py-20 px-4 min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/assets/community-grid.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-bold text-white font-inter">
            Discover Updates
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {updates.map((update, index) => (
            <UpdateCard update={update} key={index} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            variant="outline"
            className=" hover:bg-[#D1D1D1]/20 hover:text-white hover:border border-white border-[1px] font-space-grotesk font-medium text-base"
          >
            Browse More
          </Button>
        </div>
      </div>
    </section>
  );
}
