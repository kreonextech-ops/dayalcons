'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  const line2Words = "CONSTRUCTIONS & CO.".split(" ");

  // Stage 1: DAYAL (0.0s)
  const dayalVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut", delay: 0 } 
    }
  };

  // Stage 2: CONSTRUCTIONS & CO. Container (0.15s stagger)
  const line2Container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.15
      }
    }
  };

  const wordVariant = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: "easeOut" } 
    }
  };

  // Stage 3: BORN TO BUILD. (0.55s)
  const bornToBuildVariant = {
    hidden: { opacity: 0, scale: 0.96, filter: "blur(8px)" },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { 
        delay: 0.55, 
        duration: 0.7, 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        mass: 1
      } 
    }
  };

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
    <section className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden bg-[#071A2F]">
      
      {/* Background Container - Completely Static */}
      <div className="absolute inset-0 z-0">
        {/* Placeholder for video / static image */}
        <img 
          className="w-full h-full object-cover" 
          alt="Premium construction site at dusk" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAakgUE3pncG7Wgy3ATaQRlrxqIknW_alLoNcPREHzYRVd6vqtg-BB3tlhQp84dkEpto2OknCGll11WJQCiUARpmncQVtBAOygyYROpuExs3a6IfNzpIEtTZXXr53G1yHq3nrQMOq8N0GrfvvzVPeRSroayI0wL-J8pToyN1ZjtNWDdLhgaABiVVWhEcm5d2FlaTB_qEcAuyhJbMUCqfw2IH32ji7K0QErSH4hcsH6BNKtjWgbooVs"
        />
        <div className="absolute inset-0 blueprint-grid opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(30,167,255,0.2) 0%, rgba(30,167,255,0) 70%)' }}></div>
        {/* Static Dark Navy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#021524] via-[#021524]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-[#062B55]/30 mix-blend-multiply"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 h-full flex flex-col justify-center text-left pt-[10vh]">
        
        <div className="w-full flex flex-col mb-16 cursor-default">
          
          {/* DAYAL */}
          <div className="overflow-hidden">
            <motion.div
              variants={dayalVariant}
              initial="hidden"
              animate="visible"
              className="font-['Manrope',_sans-serif] text-[48px] md:text-[64px] lg:text-[80px] font-[800] leading-[1.0] text-white whitespace-nowrap"
            >
              DAYAL
            </motion.div>
          </div>

          {/* CONSTRUCTIONS & CO. */}
          <motion.div
            variants={line2Container}
            initial="hidden"
            animate="visible"
            className="flex flex-nowrap gap-[0.3em] font-['Manrope',_sans-serif] text-[48px] md:text-[64px] lg:text-[80px] font-[800] leading-[1.0] text-white overflow-hidden mt-2 whitespace-nowrap"
          >
            {line2Words.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariant}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* BORN TO BUILD. */}
          <div className="overflow-hidden mt-2">
            <motion.div
              variants={bornToBuildVariant}
              initial="hidden"
              animate="visible"
              className="font-['Manrope',_sans-serif] text-[48px] md:text-[64px] lg:text-[80px] font-[800] leading-[1.0] text-[#18AFFF] origin-left whitespace-nowrap"
            >
              BORN TO BUILD.
            </motion.div>
          </div>

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
