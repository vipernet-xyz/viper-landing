"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { TechShowcase } from "@/components/sections/TechShowcase";
import { FeaturesOverview } from "@/components/sections/FeaturesOverview";
import { WhyChooseViper } from "@/components/sections/WhyChooseViper";
import { RevenueSection } from "@/components/sections/RevenueSection";
import { UpdatesSection } from "@/components/sections/UpdatesSection";
import { CommunityBuzz } from "@/components/sections/CommunityBuzz";
import Footer from "@/components/sections/Footer";

export default function ViperNetworkPage() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <TechShowcase />
      <FeaturesOverview />
      <WhyChooseViper />
      <RevenueSection />
      <UpdatesSection />
      <CommunityBuzz />
      <Footer />
    </main>
  );
}
