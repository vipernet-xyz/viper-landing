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
              <Image src={nodesMesh} height={200} width={200} alt="" />
            </div>
            <div className="w-full px-4 py-16overflow-hidden flex items-center justify-center">
              <StraightPulseLine />
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <Image src={viperNode} height={260} width={260} alt="" />
              </div>
            </div>
            <div className="flex-none flex justify-start z-10 w-[200px]">
              <FeaturesBullets />
            </div>
          
          </div>

          {/* Mobile Layout: Images on top, bullets below */}
          <div className="lg:hidden">
            {/*<div className="grid grid-cols-2 gap-4 mb-12 items-center justify-center">
              <div className="flex justify-center">
                <Image src={nodesMesh} height={350} width={350} alt="" />
              </div>
              <div className="flex justify-center">
                <Image src={viperNode} height={200} width={200} alt="" />
              </div>
            </div>*/}
            <div className="flex justify-center">
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
