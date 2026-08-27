'use client';

import { useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, wrap } from 'framer-motion';

const ALL_BRANDS = Array.from({ length: 33 }, (_, i) => `/images/brands/brand-${i + 1}.jpeg`);

// Split into 3 rows
const ROW1 = ALL_BRANDS.slice(0, 11);
const ROW2 = ALL_BRANDS.slice(11, 22);
const ROW3 = ALL_BRANDS.slice(22, 33);

const ITEM_WIDTH = 280; // approximate width per logo including gap
const GAP = 64;
const CONTENT_WIDTH = (ITEM_WIDTH + GAP) * 11;

const MarqueeRow = ({ images, direction, speedMultiplier }: { images: string[], direction: 1 | -1, speedMultiplier: number }) => {
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useAnimationFrame((t, delta) => {
    if (isDragging) {
      x.set(wrap(-CONTENT_WIDTH, 0, x.get()));
      return;
    }
    if (isHovered) return;
    
    // Base speed ~ 0.5 pixels per frame
    const moveBy = direction * speedMultiplier * (delta / 16); 
    x.set(wrap(-CONTENT_WIDTH, 0, x.get() + moveBy));
  });

  return (
    <div className="relative w-full h-[100px] md:h-[140px] flex items-center overflow-hidden mb-6 md:mb-10 last:mb-0">
      <motion.div
        className="flex items-center gap-[64px] absolute left-0 cursor-grab active:cursor-grabbing"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -CONTENT_WIDTH, right: CONTENT_WIDTH }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Render 3 copies to ensure seamless infinite looping */}
        {[0, 1, 2].map((copy) => (
          <div key={copy} className="flex items-center gap-[64px]">
            {images.map((src, idx) => (
              <div 
                key={`${copy}-${idx}`} 
                className="w-[240px] md:w-[280px] h-[80px] md:h-[110px] flex items-center justify-center relative group flex-shrink-0"
              >
                <img 
                  src={src} 
                  alt="Partner Brand" 
                  draggable={false}
                  className="max-h-full max-w-full object-contain pointer-events-none select-none transition-all duration-300 group-hover:scale-[1.08] group-hover:brightness-110 mix-blend-multiply" 
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function PartneredBrands() {
  return (
    <section className="w-full bg-white relative overflow-hidden py-[110px] md:py-[130px]">
      
      {/* 2% Blueprint Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="brandsGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="none" stroke="#071A2F" strokeWidth="1"/>
              <rect width="25" height="25" fill="none" stroke="#071A2F" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#brandsGrid)" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-[80px]">
          <span className="font-['Inter',_sans-serif] text-[12px] font-bold tracking-[0.24em] text-[#1196F2] uppercase mb-4">
            TRUSTED MATERIAL PARTNERS
          </span>
          <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[40px] md:text-[56px] font-bold leading-[1.1] text-[#071A2F] mb-6">
            Partnered Brands
          </h2>
          <p className="font-['Inter',_sans-serif] text-[16px] md:text-[18px] text-[#5B6472] leading-[1.6] max-w-[700px]">
            We collaborate with India's most trusted manufacturers and premium material brands to ensure every Dayal Construction project is built with uncompromising quality, durability, and long-term reliability.
          </p>
        </div>

        {/* Triple Marquee */}
        <div className="w-full mb-[80px]">
          <MarqueeRow images={ROW1} direction={-1} speedMultiplier={0.6} />
          <MarqueeRow images={ROW2} direction={1} speedMultiplier={0.5} />
          <MarqueeRow images={ROW3} direction={-1} speedMultiplier={0.6} />
        </div>

        {/* Bottom Trust Line */}
        <div className="flex flex-col items-center text-center max-w-[800px] mx-auto">
          <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[20px] md:text-[24px] font-bold text-[#071A2F] mb-4">
            32+ Premium Brand Partnerships
          </h3>
          <p className="font-['Inter',_sans-serif] text-[15px] text-[#5B6472] leading-[1.6]">
            From ACC Cement and Tata Steel to Häfele, Jaquar, Asian Paints, Schneider Electric, and Mapei—we build with brands trusted across India's construction industry.
          </p>
        </div>

      </div>
    </section>
  );
}
