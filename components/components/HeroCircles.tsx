import Image from "next/image";

export default function HeroCircles() {
  return (
    <div className="absolute w-screen">
      <Image
        src="/assets/hero-section/arcs.svg"
        width={1280}
        height={830}
        className="w-full"
      />
    </div>
  );
}
