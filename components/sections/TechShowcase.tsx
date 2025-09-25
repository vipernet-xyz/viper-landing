'use client'
import FeaturesBullets from "../components/FeaturesBullets"
import FeaturesHeader from "../components/FeaturesHeader"
import Partners from "../components/Partners"
import Image from "next/image"
const nodesMesh = '/assets/nodes-mesh.svg'
const viperNode = '/assets/viper-node.svg'

export function TechShowcase() {

  return (
    <section id='features'>
        <Partners />
        <FeaturesHeader />
        <div className="flex flex-col gap-4 max-w-7xl mx-auto lg:flex-row lg:items-center py-16 px-6">
          <div className="lg:w-1/3 flex justify-between">

        <Image src={nodesMesh} height={320} width={320} alt={""}/>
        <Image src={viperNode} height={320} width={320} alt={""}/>
          </div>
          <div className="h-[320px] lg:w-2/3"></div>
            <FeaturesBullets />
        </div>
        <p className="text-center underline text-lg">View Docs To Know More</p>
    </section>
  )
}
