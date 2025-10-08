import Image from "next/image";
import { motion } from "motion/react";

export default function CrazyAnimation() {
  return (
    <div className="relative w-full mx-auto">
      <div className="relative w-full" style={{ aspectRatio: "400/600" }}>
        <motion.div className="absolute inset-0 z-20">
          <Image
            src="/assets/revenue/server_base.svg"
            alt="Reliability Network"
            fill
            className="object-contain"
            quality={100}
            unoptimized
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 z-20"
          animate={{
            opacity: [0, 0, 0, 1, 1, 0, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.1, 0.15, 0.2, 0.65, 0.7, 0.8],
            repeat: Infinity,
            repeatDelay: 0.3,
          }}
        >
          <Image
            src="/assets/revenue/server_base_glow.svg"
            alt="Reliability Network"
            fill
            className="object-contain"
            quality={100}
            unoptimized
          />
        </motion.div>

        {/* Left server box - piston animation */}
        <motion.div
          className="absolute top-[45%] left-[15%] w-[12%] z-30"
          animate={{
            y: [0, -8, -8, 0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.15, 0.65, 0.8, 0.88, 0.96],
            repeat: Infinity,
            repeatDelay: 0.3,
          }}
        >
          <Image
            src="/assets/revenue/server_box_left.svg"
            alt="Reliability Network"
            width={90}
            height={60}
            quality={100}
            className="w-full h-auto"
            unoptimized
          />
        </motion.div>

        {/* Right server box - piston animation with delay */}
        <motion.div
          className="absolute top-[44%] right-[9%] w-[12%] z-30"
          animate={{
            y: [0, -8, -8, 0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.15, 0.65, 0.8, 0.88, 0.96],
            repeat: Infinity,
            repeatDelay: 0.3,
            delay: 0.05,
          }}
        >
          <Image
            src="/assets/revenue/server_box_left.svg"
            alt="Reliability Network"
            width={90}
            height={60}
            quality={100}
            className="w-full h-auto"
            unoptimized
          />
        </motion.div>

        {/* Bottom server box - piston animation with different delay */}
        <motion.div
          className="absolute bottom-[20%] right-[41.5%] w-[12%] z-30"
          animate={{
            y: [0, -8, -8, 0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.15, 0.65, 0.8, 0.88, 0.96],
            repeat: Infinity,
            repeatDelay: 0.3,
            delay: 0.1,
          }}
        >
          <Image
            src="/assets/revenue/server_box_left.svg"
            alt="Reliability Network"
            width={90}
            height={60}
            quality={100}
            className="w-full h-auto"
            unoptimized
          />
        </motion.div>

        {/* Bottom server box - piston animation with different delay */}
        <motion.div
          className="absolute bottom-[48%] right-[40.5%] w-[12%] z-10"
          animate={{
            y: [0, -8, -8, 0, 1, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.15, 0.65, 0.8, 0.88, 0.96],
            repeat: Infinity,
            repeatDelay: 0.3,
            delay: 0.1,
          }}
        >
          <Image
            src="/assets/revenue/server_box_left.svg"
            alt="Reliability Network"
            width={90}
            height={60}
            quality={100}
            className="w-full h-auto"
            unoptimized
          />
        </motion.div>
      </div>
    </div>
  );
}
