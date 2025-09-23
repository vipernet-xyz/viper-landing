'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from "next/image";

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
  const [isPaused, setIsPaused] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationId = useRef<number | undefined>(undefined);

  const transform = useRef(0);
  const contentWidth = useRef(0);

  const SPEED = 0.5; // Adjust scrolling speed
  const ITEM_WIDTH = 120; // Fixed width for each partner item

  // Calculate content width (width of one set of items)
  const updateContentWidth = useCallback(() => {
    if (contentRef.current) {
      contentWidth.current = partners.length * ITEM_WIDTH;
    }
  }, []);

  // Reset transform when we've scrolled one full set
  const wrapTransform = (value: number, width: number): number => {
    if (width <= 0) return value;
    // Reset to 0 when we've scrolled past one full set of items
    if (value <= -width) {
      return 0;
    }
    return value;
  };

  // Apply transform
  const applyTransform = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.style.transform = `translateX(${transform.current}px)`;
    }
  }, []);

  // Auto-scroll animation
  const animate = useCallback(() => {
    if (!isPaused) {
      transform.current -= SPEED;

      // Reset transform when we've scrolled one full set
      transform.current = wrapTransform(transform.current, contentWidth.current);

      applyTransform();
    }
    animationId.current = requestAnimationFrame(animate);
  }, [isPaused, applyTransform]);

  // Start animation
  useEffect(() => {
    updateContentWidth();
    animationId.current = requestAnimationFrame(animate);
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [animate, updateContentWidth]);

  // Render marquee content - duplicate items for seamless loop
  const renderContent = () => {
    const duplicatedPartners = [...partners, ...partners];

    return duplicatedPartners.map((partner, index) => (
      <div
        key={index}
        className="flex items-center justify-center px-4 py-8 border-r-[0.5px] border-r-white flex-shrink-0"
        style={{ width: `${ITEM_WIDTH}px` }}
      >
        <Image
          src={partner.src}
          alt={partner.alt}
          height={60}
          width={60}
          className="object-contain"
          draggable={false}
        />
      </div>
    ));
  };

  return (
    <div className="backdrop-blur-sm border-white border-y-[0.5px]">
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          ref={contentRef}
          className="flex w-max"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            width: `${partners.length * ITEM_WIDTH * 2}px` // Set explicit width for duplicated content
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
