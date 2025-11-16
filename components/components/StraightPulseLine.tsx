"use client";

import { motion } from "motion/react";
import { CSSProperties, useMemo, useId } from "react";

type StraightPulseLineProps = {
  className?: string;
  style?: CSSProperties;
  orientation?: "horizontal" | "vertical";
};

export default function StraightPulseLine({
  className,
  style,
  orientation = "horizontal",
}: StraightPulseLineProps) {
  const maskId = useId();
  const filterId = useMemo(() => `${maskId}-filter`, [maskId]);
  const isVertical = orientation === "vertical";
  const animationRange: [number, number] = [-160, 720];
  const animate = isVertical
    ? { y: animationRange }
    : { x: animationRange };
  const wrapperClassName = ["pointer-events-none", className]
    .filter(Boolean)
    .join(" ");
  const viewBox = isVertical ? "0 0 1 604" : "0 0 604 1";
  const svgWidth = isVertical ? 4 : "100%";
  const svgHeight = isVertical ? "100%" : 4;
  const maskDimensions = isVertical
    ? { width: 1, height: 604 }
    : { width: 604, height: 1 };
  const primaryHighlight = isVertical
    ? { x: -120, y: -90, width: 240, height: 40 }
    : { x: -90, y: -120, width: 40, height: 240 };
  const secondaryHighlight = isVertical
    ? { x: -90, y: -26, width: 180, height: 22 }
    : { x: -26, y: -90, width: 22, height: 180 };
  const filterBounds = isVertical
    ? { x: -200, y: -200, width: 400, height: 800 }
    : { x: -200, y: -200, width: 800, height: 400 };

  return (
    <div className={wrapperClassName} style={style} aria-hidden="true">
      <motion.svg
        viewBox={viewBox}
        width={svgWidth}
        height={svgHeight}
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
          width={maskDimensions.width}
          height={maskDimensions.height}
        >
          <rect
            width={maskDimensions.width}
            height={maskDimensions.height}
            rx="0.5"
            fill="white"
          />
        </mask>
        <rect
          width={maskDimensions.width}
          height={maskDimensions.height}
          rx="0.5"
          fill="#8B5CF6"
          fillOpacity="0.08"
        />
        <g mask={`url(#${maskId})`}>
          <motion.g
            filter={`url(#${filterId})`}
            animate={animate}
            transition={{
              duration: 2.4,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <rect {...primaryHighlight} fill="#AC92FA" />
            <rect {...secondaryHighlight} fill="#BCAFEB" />
          </motion.g>
        </g>
        <defs>
          <filter
            id={filterId}
            x={filterBounds.x}
            y={filterBounds.y}
            width={filterBounds.width}
            height={filterBounds.height}
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
