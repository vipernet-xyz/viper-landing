"use client";
import FeaturesBullets from "../components/FeaturesBullets";
import FeaturesHeader from "../components/FeaturesHeader";
import Partners from "../components/Partners";
import Image from "next/image";

const nodesMesh = "/assets/nodes-mesh.svg";
const viperNode = "/assets/viper-node.svg";

export function TechShowcase() {
  return (
    <section id="features">
      <Partners />
      <FeaturesHeader />
      <div className="max-w-7xl mx-auto pb-16 px-6">
        {/* Desktop Layout: 3 columns */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8 items-center justify-center">
          <div className="flex justify-center">
            <Image src={nodesMesh} height={250} width={250} alt="" />
          </div>

          <div className="flex justify-center">
            <Image src={viperNode} height={250} width={250} alt="" />
          </div>

          <div className="flex justify-center">
            <FeaturesBullets />
          </div>
        </div>

        {/* Mobile Layout: Images on top, bullets below */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-4 mb-12 items-center justify-center">
            <div className="flex justify-center">
              <Image src={nodesMesh} height={200} width={200} alt="" />
            </div>

            <div className="flex justify-center">
              <Image src={viperNode} height={200} width={200} alt="" />
            </div>
          </div>

          <div className="flex justify-center">
            <FeaturesBullets />
          </div>
        </div>
      </div>

      <p className="text-center underline text-lg cursor-pointer">
        View Docs To Know More
      </p>
    </section>
  );
}
