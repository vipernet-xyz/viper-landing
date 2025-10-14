"use client";
import { motion } from "motion/react";

export default function PulseLine({ flip = false }) {
  const animationX = flip ? [-200, 600] : [600, -200];
  return (
    <div className="pointer-events-none">
      <motion.svg
        width="50vh md:50vw"
        height="auto"
        viewBox="0 0 509 143"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: flip ? "scaleX(-1)" : "none",
          background: "transparent",
          overflow: "visible",
        }}
      >
        {/* --- VISIBLE LINE PATHS --- */}
        <path
          d="M508.5 2L420 1.54381M214 142L314.5 1L420 1.54381M214 142H0M214 142H321L420 1.54381"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0 21H133L196.5 80.5"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* --- MASK FOR LINE PATHS --- */}
        <mask
          id="mask0_1471_5281"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="509"
          height="143"
        >
          <path
            d="M508.5 2L420 1.54381M214 142L314.5 1L420 1.54381M214 142H0M214 142H321L420 1.54381"
            stroke="white"
          />
          <path d="M0 21H133L196.5 80.5" stroke="white" />
        </mask>
        {/* --- GLOWING PULSE --- */}
        <g mask="url(#mask0_1471_5281)">
          {/* Transparent base to kill any default fill */}
          <rect width="100%" height="100%" fill="transparent" />
          {/* Animated glowing rectangle */}
          <motion.g
            filter="url(#filter0_f_1471_5281)"
            animate={{ x: animationX }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <rect x="-72" y="-160" width="38" height="340" fill="#C4B5FD" />
          </motion.g>
        </g>
        {/* --- FILTER & GRADIENT DEFINITIONS --- */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.04" />
            <stop offset="50%" stopColor="#AC92FA" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#C4B5FD" stopOpacity="0.04" />
          </linearGradient>
          <filter
            id="filter0_f_1471_5281"
            x="-50"
            y="-50"
            width="600"
            height="300"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur stdDeviation="20" />
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
}
