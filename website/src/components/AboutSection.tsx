"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Hardware-accelerated parallax (no React re-renders)
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
  };

  const lineVariants = {
    hidden: { y: 32, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.9, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  const bodyVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { delay: 0.25, duration: 0.9, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  const imageVariants = {
    hidden: { scale: 1.08, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 1, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  return (
    <section 
      ref={containerRef}
      className="w-full py-[90px] bg-[#F8FAFC] relative overflow-hidden flex justify-center items-center" 
      id="about"
    >
      {/* Premium Architectural Separator */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#071A2F]/15 to-transparent z-20"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
        <div className="w-32 h-[2px] bg-[#1196F2] shadow-[0_2px_12px_rgba(17,150,242,0.6)]"></div>
      </div>

      {/* Background Motion (Extremely subtle parallax) */}
      <motion.div 
        className="absolute inset-[0] z-0 pointer-events-none bg-cover bg-center"
        style={{ 
          y: parallaxY,
          backgroundImage: "url('/about-bg.png')"
        }}
      >
        {/* High-contrast reading zone overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(248,250,252,0.96) 0%, rgba(248,250,252,0.93) 42%, rgba(248,250,252,0.78) 62%, rgba(248,250,252,0.55) 100%)'
          }}
        ></div>
      </motion.div>

      <div className="max-w-[1440px] w-full mx-auto px-6 md:px-[80px] grid grid-cols-1 lg:grid-cols-[46%_54%] gap-[64px] items-center relative z-10">
        
        {/* Left Side Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col items-start"
        >
          {/* Small label */}
          <motion.span 
            variants={lineVariants} 
            className="text-[#5B6472] font-['Inter',_sans-serif] text-[14px] font-semibold uppercase tracking-widest mb-6 block"
          >
            WHO WE ARE
          </motion.span>
          
          {/* Main heading */}
          <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[48px] md:text-[64px] font-bold text-[#071A2F] leading-[1.15] tracking-[-0.02em] mb-8">
            <div className="overflow-hidden pb-4 -mb-4">
              <motion.span variants={lineVariants} className="block">Building Beyond.</motion.span>
            </div>
            <div className="overflow-hidden pb-4 -mb-4">
              <motion.span variants={lineVariants} className="block text-[#1196F2]">Engineering Trust.</motion.span>
            </div>
          </h2>

          {/* Body copy */}
          <motion.p 
            variants={bodyVariants} 
            className="font-['Inter',_sans-serif] text-[20px] font-normal text-[#5B6472] leading-[1.6] mb-12 max-w-[540px]"
          >
            Dayal Constructions & Co. is more than a contractor—we are engineering partners committed to creating enduring residential, commercial, and industrial spaces. For over two decades, we've combined structural precision, premium craftsmanship, and transparent execution to deliver projects that stand the test of time.
          </motion.p>

          {/* CTA */}
          <motion.div variants={bodyVariants}>
            <Link href="/about" className="group inline-flex items-center gap-4 text-[17px] font-['Inter',_sans-serif] font-semibold text-[#071A2F] relative pb-2 cursor-pointer">
              <span className="relative z-10">Discover Our Story</span>
              
              <div className="w-[42px] h-[42px] rounded-full border border-[#071A2F]/20 flex items-center justify-center group-hover:border-[#1196F2] transition-colors duration-500 ease-out">
                <span className="material-symbols-outlined text-[20px] group-hover:text-[#1196F2] transition-transform duration-500 ease-out group-hover:translate-x-[6px] group-hover:rotate-[12deg]">
                  arrow_forward
                </span>
              </div>

              {/* Growing underline */}
              <div className="absolute bottom-0 left-0 h-[2px] bg-[#1196F2] w-0 group-hover:w-full transition-all duration-500 ease-out"></div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <div className="relative w-full aspect-[4/3] flex items-center justify-center">
          {/* Thin geometric arcs behind the image */}
          <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] border border-[#1196F2]/30 rounded-full pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] border border-[#071A2F]/10 rounded-full pointer-events-none"></div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={imageVariants}
            className="relative w-full h-full rounded-[28px] shadow-[0_24px_80px_rgba(7,26,47,0.12)] bg-white p-2"
          >
            <div className="w-full h-full relative rounded-[24px] overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHQmGxlqExnE3JVqiAuUj1I3ygpIirjeqNtuAYyu9UcRVg9cWpm8Knt8oxfokA4etY12WhjYM_8JBBxbKF51uqoGx8lnVXjj6-AbPaI8D0Fxhe1t7ybFsBNpN7HVFNTkSiPXRxBuPnMqjWBZEk8sG5GyYHXevx3YT7XkKgUQbZLNpBZFpe_LX9YUuf5RlT12U1UE9Ofh9PTHcjDyJE9idVhhm0COZwftUZBaFZYTWuKpyIGI-kxqg" 
                alt="Engineers reviewing architectural drawings at an active construction site"
                className="w-full h-full object-cover"
              />
              {/* Soft overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A2F]/10 to-transparent"></div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
