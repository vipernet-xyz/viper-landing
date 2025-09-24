'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from "next/image";
import { Marquee } from '../ui/marquee';

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
        className="flex items-center justify-center px-4 py-8 border border-white"
        style={{ width: `145px` }}
      >
        <Image
          src={partner.src}
          alt={partner.alt}
          height={60}
          width={60}
          draggable={false}
        />
      </div>
    ));
  };

  return (
    <div className="backdrop-blur-sm">
     <Marquee pauseOnHover>
          {renderContent()}
    </Marquee>
    </div>
  );
}
