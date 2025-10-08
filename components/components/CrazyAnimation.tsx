import Image from "next/image";

export default function CrazyAnimation() {
  return (
    <div className="relative w-full mx-auto opacity-80">
      <div className="relative w-full" style={{ aspectRatio: "400/600" }}>
        {/* Base server image - static */}
        <div className="absolute inset-0 z-20">
          <Image
            src="/assets/revenue/server_base.svg"
            alt="Reliability Network"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 z-20 server-glow">
          <Image
            src="/assets/revenue/server_base_glow.svg"
            alt="Server Glow"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Forward Pillars */}
        <div className="absolute top-[41%] left-[13%] w-[80%] z-30 server-piston">
          <Image
            src="/assets/revenue/pillers.svg"
            alt="Left Server Box"
            width={90}
            height={60}
            className="w-full h-auto"
            priority
            unoptimized
          />
        </div>

        {/* Middle center server box */}
        <div 
          className="absolute bottom-[48%] right-[40.5%] w-[12%] z-10 server-piston"
          style={{ animationDelay: '0.1s' }}
        >
          <Image
            src="/assets/revenue/server_box_left.svg"
            alt="Middle Center Server Box"
            width={90}
            height={60}
            className="w-full h-auto"
            unoptimized
          />
        </div>


        {/* Left cubes server box */}  
        <div 
          className="absolute bottom-[48%] left-[25.5%] w-[12%] z-10 cube-bottom"
        >
          <Image
            src="/assets/revenue/cube.svg"
            alt="Middle Center Server Box"
            width={90}
            height={60}
            className="w-full h-auto"
          />
        </div>

        <div 
          className="absolute bottom-[55%] left-[25.5%] w-[12%] z-10 cube-top"
        >
          <Image
            src="/assets/revenue/cube.svg"
            alt="Middle Center Server Box"
            width={90}
            height={60}
            className="w-full h-auto"
          />
        </div>
        <div 
          className="absolute bottom-[45%] left-[25.5%] w-[12%] z-5"
          style={{ animationDelay: '0.1s' }}
        >
          <Image
            src="/assets/revenue/cube_base.svg"
            alt="Middle Center Server Box"
            width={90}
            height={60}
            className="w-full h-auto"
          />
        </div>
      </div>
      

      <style jsx>{`
        @keyframes glowPulse {
          0%, 20% { opacity: 0; }
          30% { opacity: 1; }
          70% { opacity: 1; }
          80% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes pistonMove {
          0%, 20% { transform: translateY(0) translateZ(0); }
          30% { transform: translateY(-8px) translateZ(0); }
          70% { transform: translateY(-8px) translateZ(0); }
          80% { transform: translateY(0) translateZ(0); }
          88% { transform: translateY(1px) translateZ(0); }
          96%, 100% { transform: translateY(0) translateZ(0); }
        }

        @keyframes cubeBottomMove {
          0% { transform: translateY(0) translateZ(0); }
          15% { transform: translateY(-8px) translateZ(0); }
          70% { transform: translateY(-8px) translateZ(0); }
          80% { transform: translateY(0) translateZ(0); }
          88% { transform: translateY(1px) translateZ(0); }
          96%, 100% { transform: translateY(0) translateZ(0); }
        }

        @keyframes cubeTopMove {
          0% { transform: translateY(0) translateZ(0); }
          15% { transform: translateY(-14px) translateZ(0); }
          70% { transform: translateY(-14px) translateZ(0); }
          80% { transform: translateY(0) translateZ(0); }
          88% { transform: translateY(1px) translateZ(0); }
          96%, 100% { transform: translateY(0) translateZ(0); }
        }

        .server-glow {
          animation: glowPulse 2.3s ease-in-out infinite;
          will-change: opacity;
        }

        .server-piston {
          animation: pistonMove 2.3s ease-in-out infinite;
          will-change: transform;
        }

        .cube-bottom {
          animation: cubeBottomMove 2.3s ease-in-out infinite;
          will-change: transform;
        }

        .cube-top {
          animation: cubeTopMove 2.3s ease-in-out infinite;
          will-change: transform;
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .server-glow,
          .server-piston,
          .cube-bottom,
          .cube-top {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}