"use client";
import FeaturesBullets from "../components/FeaturesBullets";
import FeaturesHeader from "../components/FeaturesHeader";
import Partners from "../components/Partners";
import StraightPulseLine from "../components/StraightPulseLine";
import Image from "next/image";
import Link from "next/link";

const nodesMesh = "/assets/tech/nodes-mesh.svg";
const viperNode = "/assets/tech/viper-circle.png";

export function TechShowcase() {
  return (
    <section id="features" className="relative">
      {/* Full space gradient background */}
      <div className="absolute inset-0 pointer-events-none top-64">
        <div
          className="w-full h-[125%] blur-3xl opacity-30"
          style={{
            background: `radial-gradient(circle, #7E5CFF 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Partners />
        <FeaturesHeader />
        <div className="relative max-w-7xl mx-auto pb-16 px-6">
          {/* Desktop Layout: absolutely center the mask, let sides auto size */}
          <div className="hidden lg:flex relative items-center justify-between mx-auto min-h-[360px] px-6">
            <div className="flex-none flex justify-end z-10">
              <Image src={nodesMesh} height={180} width={180} alt="" />
            </div>
            <div className="w-full px-4 py-16 overflow-hidden flex items-center justify-center">
              <StraightPulseLine />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <Image src={viperNode} height={200} width={200} alt="" />
              </div>
            </div>
            <div className="flex-none flex justify-start z-10 w-[225px]">
              <FeaturesBullets />
            </div>
          
          </div>

          {/* Mobile Layout: stacked visuals with vertical pulse */}
          <div className="lg:hidden flex flex-col items-center gap-4">
            <div className="flex flex-col items-center">
              <Image src={nodesMesh} height={140} width={140} alt="" />
            </div>
            <div className="relative w-full max-w-xs h-72 overflow-hidden flex items-center justify-center">
              <StraightPulseLine
                orientation="vertical"
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2"
              />
              <div className="relative z-10 flex justify-center">
                <Image src={viperNode} height={165} width={165} alt="" />
              </div>
            </div>
            <div className="flex justify-center w-full">
              <FeaturesBullets />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Link
            href={"https://docs.vipernet.xyz/"}
            className="text-center underline text-lg cursor-pointer mx-auto"
            target="_blank"
          >
            View Docs To Know More
          </Link>
        </div>
      </div>
    </section>
  );
}
