"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Marquee } from "../ui/marquee";

const partners = [
  { src: "assets/partners/partner-1.svg", alt: "Partner 1" },
  { src: "assets/partners/partner-2.svg", alt: "Partner 2" },
  { src: "assets/partners/partner-3.svg", alt: "Partner 3" },
  { src: "assets/partners/partner-4.svg", alt: "Partner 4" },
  { src: "assets/partners/partner-5.svg", alt: "Partner 5" },
  { src: "assets/partners/partner-6.svg", alt: "Partner 6" },
  { src: "assets/partners/partner-7.svg", alt: "Partner 7" },
  { src: "assets/partners/partner-8.svg", alt: "Partner 8" },
];

export default function Partners() {
  const renderContent = () => {
    const duplicatedPartners = [...partners, ...partners];

    return duplicatedPartners.map((partner, index) => (
      <div
        key={index}
        className="flex items-center justify-center lg:px-4 py-4 lg:py-8 border border-white w-24 lg:w-36"
      >
        <Image
          src={partner.src}
          alt={partner.alt}
          height={60}
          width={60}
          className="w-12 h-12 lg:w-14 lg:h-14"
          draggable={false}
        />
      </div>
    ));
  };

  return (
    <div className="backdrop-blur-sm">
      <Marquee>{renderContent()}</Marquee>
    </div>
  );
}
