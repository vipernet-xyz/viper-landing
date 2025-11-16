"use client";
import { motion } from "motion/react";

export default function PulseAnimation({ flip = false }) {
  const animationX = flip ? [-200, 600] : [600, -200];
  const pulseColors = {
    primary: "#AC92FA",
    secondary: "#BCAFEB",
  } as const;
  const strokeProps = {
    stroke: "url(#lineGradient)",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  return (
    <div className="pointer-events-none">
      <motion.svg
        width="800px"
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
          {...strokeProps}
        />
        <path
          d="M0 21H133L196.5 80.5"
          {...strokeProps}
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
            <rect
              x="-86"
              y="-165"
              width="28"
              height="240"
              fill={pulseColors.primary}
            />
            <rect
              x="-26"
              y="-135"
              width="16"
              height="190"
              fill={pulseColors.secondary}
            />
          </motion.g>
        </g>
        {/* --- FILTER & GRADIENT DEFINITIONS --- */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.03" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
          </linearGradient>
          <filter
            id="filter0_f_1471_5281"
            x="-140"
            y="-220"
            width="520"
            height="600"
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
            <feGaussianBlur in="shape" stdDeviation="34.9" result="blur" />
            <feComponentTransfer in="blur">
              <feFuncR type="linear" slope="1.4" />
              <feFuncG type="linear" slope="1.4" />
              <feFuncB type="linear" slope="1.4" />
              <feFuncA type="linear" slope="1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
}
