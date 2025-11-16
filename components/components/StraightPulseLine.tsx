"use client";

import { motion } from "motion/react";
import { CSSProperties, useMemo, useId } from "react";

type StraightPulseLineProps = {
  className?: string;
  style?: CSSProperties;
};

export default function StraightPulseLine({
  className,
  style,
}: StraightPulseLineProps) {
  const maskId = useId();
  const filterId = useMemo(() => `${maskId}-filter`, [maskId]);
  const animationX = [-160, 720];
  const wrapperClassName = ["pointer-events-none", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClassName} style={style} aria-hidden="true">
      <motion.svg
        viewBox="0 0 604 1"
        width="100%"
        height="4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          overflow: "visible",
          background: "transparent",
        }}
      >
        <mask
          id={maskId}
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="604"
          height="1"
        >
          <rect width="604" height="1" rx="0.5" fill="white" />
        </mask>
        <rect
          width="604"
          height="1"
          rx="0.5"
          fill="#8B5CF6"
          fillOpacity="0.08"
        />
        <g mask={`url(#${maskId})`}>
          <motion.g
            filter={`url(#${filterId})`}
            animate={{ x: animationX }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <rect x="-90" y="-120" width="40" height="240" fill="#AC92FA" />
            <rect x="-26" y="-90" width="22" height="180" fill="#BCAFEB" />
          </motion.g>
        </g>
        <defs>
          <filter
            id={filterId}
            x="-140"
            y="-180"
            width="240"
            height="360"
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
            <feGaussianBlur stdDeviation="34.9" />
          </filter>
        </defs>
      </motion.svg>
    </div>
  );
}
