"use client";

import { useState } from "react";
import { motion, useAnimationFrame, useMotionValue, wrap } from "framer-motion";
import Link from "next/link";

const SERVICES = [
  { num: "01", title: "Land Registration & Mutation & Conversion", slug: "land-registration", img: "/images/services/Land Registration & Mutation.png" },
  { num: "02", title: "Building Plan Approval", slug: "plan-approval", img: "/images/services/Building Plan Approval.png" },
  { num: "03", title: "2D–3D Floor Plan", slug: "floor-plan", img: "/images/services/2D–3D Floor Plan.png" },
  { num: "04", title: "3D Elevation Design", slug: "elevation-design", img: "/images/services/3D Elevation Design.png" },
  { num: "05", title: "Soil Testing", slug: "soil-testing", img: "/images/services/Soil Testing.png" },
  { num: "06", title: "Structural Design", slug: "structural-design", img: "/images/services/Structural Design.png" },
  { num: "07", title: "Vastu Consultation", slug: "vastu", img: "/images/services/Vastu Consultation.png" },
  { num: "08", title: "Residential Construction", slug: "residential", img: "/images/services/Residential Construction.png" },
  { num: "09", title: "Commercial Construction", slug: "commercial", img: "/images/services/Commercial Construction.png" },
  { num: "10", title: "Industrial Construction", slug: "industrial", img: "/images/services/Industrial Construction.png" },
  { num: "11", title: "Interior Design", slug: "interior-design", img: "/images/services/Interior Design.png" },
  { num: "12", title: "Renovation", slug: "renovation", img: "/images/services/renovation.png" },
  { num: "13", title: "Turnkey Projects", slug: "turnkey-projects", img: "/images/services/turnkey projects.png" }
];

const CARD_WIDTH = 300;
const GAP = 32; // gap-8 = 32px
const CONTENT_WIDTH = (CARD_WIDTH + GAP) * SERVICES.length;

export default function ServicesMarquee() {
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useAnimationFrame((t, delta) => {
    if (isDragging) {
      x.set(wrap(-CONTENT_WIDTH, 0, x.get()));
      return;
    }
    if (isHovered) return;
    
    const moveBy = -1.0 * (delta / 16); 
    x.set(wrap(-CONTENT_WIDTH, 0, x.get() + moveBy));
  });

  return (
    <section className="w-full pt-[120px] pb-[100px] relative overflow-hidden bg-[#F8FAFC]">
      
      {/* Photographic Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage: 'url("/images/services-bg.png")' }}
      >
        <div className="absolute inset-0 bg-[#F8FAFC]/90"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10 mb-16">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-[32px] h-[2px] bg-[#1196F2]"></div>
            <span className="font-['Inter',_sans-serif] text-[12px] font-semibold tracking-[0.24em] text-[#1196F2] uppercase">
              ENGINEERING SERVICES
            </span>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[40px] md:text-[56px] font-bold leading-[1.1] text-[#071A2F]">
            Everything You Need to Build.<br />
            <span className="text-[#1196F2]">Under One Roof.</span>
          </h2>
          <p className="font-['Inter',_sans-serif] text-[16px] md:text-[18px] text-[#5B6472] max-w-[640px] leading-[1.6]">
            From land approvals and BIM planning to industrial execution and luxury interiors, Dayal Construction delivers complete engineering solutions through one integrated team.
          </p>
        </div>
      </div>

      <div 
        className="w-full relative z-20 cursor-grab active:cursor-grabbing overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
      >
        <motion.div 
          className="flex gap-8 w-max pl-8 md:pl-margin-desktop"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -100000, right: 100000 }} // Effectively infinite dragging
          dragElastic={0}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          {/* Render 3 copies to guarantee smooth infinite wrapping even on ultra-wide screens */}
          {[...Array(3)].map((_, arrayIndex) => (
            <div key={arrayIndex} className="flex gap-8">
              {SERVICES.map((service, index) => (
                <Link 
                  key={`${arrayIndex}-${index}`} 
                  href={`/services/${service.slug}`}
                  draggable={false}
                  className="group relative w-[300px] h-[400px] rounded-[22px] overflow-hidden flex-shrink-0 bg-white shadow-[0_10px_30px_rgba(8,23,40,0.06)] hover:shadow-[0_20px_40px_rgba(17,150,242,0.15)] transition-all duration-500 hover:-translate-y-3 border border-transparent hover:border-[#1196F2]"
                >
                  <img 
                    src={service.img} 
                    alt={service.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none select-none" 
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/95 via-[#071A2F]/40 to-transparent pointer-events-none"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col pointer-events-none">
                    <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-[#1196F2] mb-1">
                      {service.num}
                    </span>
                    <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[20px] font-bold text-white leading-[1.3]">
                      {service.title}
                    </span>
                    <div className="flex items-center gap-2 mt-4 text-white/70 group-hover:text-white transition-colors">
                      <span className="font-['Inter',_sans-serif] text-[11px] font-bold tracking-widest uppercase">Explore Service</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}
