'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';

export default function HeroSection() {
  const [textColor, setTextColor] = useState('#FFFFFF');

  // Stage 4: CTA Buttons (0.95s)
  const ctaContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.95
      }
    }
  };

  const buttonVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.45, 
        type: "spring", 
        stiffness: 140,
        damping: 15
      } 
    }
  };

  return (
    <section className="relative w-full h-[100dvh] md:h-[calc(100vh-88px)] md:mt-[88px] flex flex-col overflow-hidden bg-black">
      
      {/* Background Container - Video Background */}
      <div className="absolute inset-0 z-0 bg-[#071A2F]">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster="/images/backdrop.jpg"
          className="w-full h-full object-cover object-center opacity-80"
        >
          <source src="https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/dmain.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 blueprint-grid opacity-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 flex-1 pt-[80px] md:pt-0 flex flex-col justify-center md:justify-end md:pb-[60px] text-left">
        
        {/* Adjusted mb-16 to mb-6 and justify-end to bring it closer to buttons */}
        <div className="w-full flex flex-col mb-6 cursor-default min-h-[160px] md:min-h-[220px] justify-end pb-2">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Wrapper handles the color dynamically to prevent Tailwind purging issues */}
            <h1 
              className="font-['Manrope',_sans-serif] text-[40px] md:text-[60px] lg:text-[76px] font-[800] leading-[1.2] transition-colors duration-300 whitespace-pre-line"
              style={{ color: textColor }}
            >
              <TypeAnimation
                sequence={[
                  () => setTextColor('#FFFFFF'),
                  'DAYAL\nCONSTRUCTIONS & CO.',
                  2000,
                  '',
                  () => setTextColor('#00FFFF'),
                  'BORN TO BUILD.',
                  2500,
                  '',
                ]}
                wrapper="div"
                cursor={false}
                repeat={Infinity}
                style={{ whiteSpace: 'pre-line', display: 'block' }}
              />
            </h1>
          </motion.div>

        </div>
        
        {/* CTA Buttons & Social Proof */}
        <motion.div 
          variants={ctaContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-4 w-full md:w-[75%] lg:w-[65%]"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Primary High-Intent CTA */}
            <motion.div variants={buttonVariant} className="w-full sm:w-auto">
              <Link href="/contact" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-[18px] bg-[#18AFFF] text-white font-['Manrope',_sans-serif] font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(24,175,255,0.45)] cursor-pointer">
                <span>Book Free Site Visit</span>
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </Link>
            </motion.div>

            {/* Instant Estimate CTA */}
            <motion.div variants={buttonVariant} className="w-full sm:w-auto">
              <a href="#quote-calculator" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-[18px] bg-white text-[#071A2F] font-['Manrope',_sans-serif] font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:bg-[#F0F7FF] hover:shadow-[0_8px_24px_rgba(255,255,255,0.25)] cursor-pointer">
                <span>Calculate Cost in 60s</span>
                <span className="material-symbols-outlined text-[19px] text-[#18AFFF]">calculate</span>
              </a>
            </motion.div>

            {/* Portfolio Link */}
            <motion.div variants={buttonVariant} className="w-full sm:w-auto">
              <Link href="/projects" className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-[18px] bg-white/10 backdrop-blur-md border border-white/20 text-white font-['Manrope',_sans-serif] font-medium text-[15px] rounded-[16px] transition-all duration-300 hover:bg-white hover:text-[#062B55] hover:border-white cursor-pointer">
                View Portfolio
              </Link>
            </motion.div>
          </div>

          {/* Micro-Trust Proof Under CTAs */}
          <motion.div 
            variants={buttonVariant}
            className="flex flex-wrap items-center gap-y-2 gap-x-5 text-[12px] md:text-[13px] text-white/80 font-medium pt-1"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#18AFFF]">✓</span> 350+ Projects Delivered
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#18AFFF]">✓</span> Free Initial Plot Feasibility Check
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-[#18AFFF]">✓</span> Guaranteed 30-Min Callback
            </span>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
