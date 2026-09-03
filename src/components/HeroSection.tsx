'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';

export default function HeroSection() {
  const [textColor, setTextColor] = useState('text-white');

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
    <section className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden bg-black">
      
      {/* Background Container - Video Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/herovideo.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 blueprint-grid opacity-5"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col justify-center text-left pt-[10vh]">
        
        <div className="w-full flex flex-col mb-16 cursor-default min-h-[160px] md:min-h-[220px] justify-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <TypeAnimation
              sequence={[
                () => setTextColor('text-white'),
                'DAYAL CONSTRUCTIONS & CO.',
                2000,
                '',
                () => setTextColor('text-cyan-400'),
                'BORN TO BUILD.',
                2500,
                '',
              ]}
              wrapper="h1"
              cursor={true}
              repeat={Infinity}
              className={`font-['Manrope',_sans-serif] text-[40px] md:text-[60px] lg:text-[76px] font-[800] leading-[1.2] transition-colors duration-200 ${textColor}`}
            />
          </motion.div>

        </div>
        
        {/* CTA Buttons */}
        <motion.div 
          variants={ctaContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row gap-5 items-start md:items-center w-full md:w-[60%] lg:w-[48%]"
        >
          {/* Primary CTA */}
          <motion.div variants={buttonVariant} className="w-full md:w-auto">
            <Link href="/contact" className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-[18px] bg-[#18AFFF] text-white font-['Manrope',_sans-serif] font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(24,175,255,0.4)] cursor-pointer">
              <span>Start Your Project</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>
          </motion.div>

          {/* Secondary CTA */}
          <motion.div variants={buttonVariant} className="w-full md:w-auto">
            <Link href="/projects" className="w-full md:w-auto inline-flex items-center justify-center px-8 py-[18px] bg-transparent border-2 border-white/40 text-white font-['Manrope',_sans-serif] font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:bg-white hover:border-white hover:text-[#062B55] cursor-pointer">
              View Our Portfolio
            </Link>
          </motion.div>
        </motion.div>
        
      </div>
    </section>
  );
}
