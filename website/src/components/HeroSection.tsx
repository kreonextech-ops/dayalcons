'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollY } = useScroll();
  
  // Parallax effects based on scroll position
  const yHeadline = useTransform(scrollY, [0, 800], [0, -240]); // 30% parallax (0.3 * 800)

  const yButtons = useTransform(scrollY, [0, 800], [0, -120]); // 15% parallax
  const opacityAll = useTransform(scrollY, [0, 600], [1, 0.15]);
  const scaleBg = useTransform(scrollY, [0, 800], [1.06, 1.00]);

  const line1 = 'DAYAL';
  const line2 = 'CONSTRUCTIONS & CO.';
  const line3 = 'BORN TO BUILD.';

  // Split strings into arrays of characters (including spaces)
  const l1Chars = line1.split('');
  const l2Chars = line2.split('');
  const l3Chars = line3.split('');

  // Animation variants for ultra-premium letter reveal
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02, 
        delayChildren: 0.2
      }
    }
  };

  const letterVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.85, ease: [0.25, 1, 0.5, 1] } 
    }
  };

  // Distinct, punchy spring reveal for the tagline
  const l3LetterVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.5, rotateX: -45 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotateX: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 } 
    }
  };

  return (
    <section ref={containerRef} className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden bg-[#071A2F]">
      
      {/* Background Container (Scale down on scroll) */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        style={{ scale: scaleBg }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }} // Video fades in
      >
        <img 
          className="w-full h-full object-cover" 
          alt="Premium construction site at dusk" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAakgUE3pncG7Wgy3ATaQRlrxqIknW_alLoNcPREHzYRVd6vqtg-BB3tlhQp84dkEpto2OknCGll11WJQCiUARpmncQVtBAOygyYROpuExs3a6IfNzpIEtTZXXr53G1yHq3nrQMOq8N0GrfvvzVPeRSroayI0wL-J8pToyN1ZjtNWDdLhgaABiVVWhEcm5d2FlaTB_qEcAuyhJbMUCqfw2IH32ji7K0QErSH4hcsH6BNKtjWgbooVs"
        />
        <div className="absolute inset-0 blueprint-grid opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-screen" style={{ background: 'radial-gradient(circle, rgba(30,167,255,0.2) 0%, rgba(30,167,255,0) 70%)' }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#021524] via-[#021524]/80 to-transparent"></div>
      </motion.div>

      {/* Content Container */}
      <motion.div 
        className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full pt-[10vh]"
        style={{ opacity: opacityAll }}
      >
        <div className="lg:col-span-12 xl:col-span-10 flex flex-col justify-center text-left">
          
          <motion.div 
            style={{ y: yHeadline }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-0 md:gap-1 mb-16 cursor-default"
          >
            {/* Line 1 */}
            <div className="flex flex-wrap overflow-hidden">
              {l1Chars.map((char, i) => (
                <motion.span
                  key={`l1-${i}`}
                  variants={letterVariants}
                  className="font-['Plus_Jakarta_Sans',_sans-serif] text-[48px] md:text-[64px] lg:text-[80px] font-[900] leading-[1.0] text-white tracking-tighter inline-block whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Line 2 */}
            <div className="flex flex-wrap overflow-hidden">
              {l2Chars.map((char, i) => (
                <motion.span
                  key={`l2-${i}`}
                  variants={letterVariants}
                  className="font-['Plus_Jakarta_Sans',_sans-serif] text-[48px] md:text-[64px] lg:text-[80px] font-[900] leading-[1.0] text-white/90 tracking-tighter inline-block whitespace-pre"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Line 3 */}
            <div className="flex flex-wrap overflow-hidden pt-2 pb-4 group cursor-default" style={{ perspective: 1000 }}>
              {l3Chars.map((char, i) => (
                <motion.span
                  key={`l3-${i}`}
                  variants={l3LetterVariants}
                  className="font-['Plus_Jakarta_Sans',_sans-serif] text-[48px] md:text-[64px] lg:text-[80px] font-[900] leading-[1.0] tracking-tighter inline-block whitespace-pre relative z-0 text-[#1EA7FF] transition-all duration-500 group-hover:text-white group-hover:drop-shadow-[0_0_20px_rgba(30,167,255,0.8)]"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            style={{ y: yButtons }}
            className="flex flex-col md:flex-row gap-5 items-start md:items-center w-full"
          >
            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-auto"
            >
              <Link href="/contact" className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-[18px] bg-[#1EA7FF] text-white font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(30,167,255,0.4)] group relative overflow-hidden cursor-pointer">
                <span className="relative z-10">Start Your Project</span>
                <span className="material-symbols-outlined text-[20px] relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-2">arrow_forward</span>
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-auto"
            >
              <Link href="/projects" className="w-full md:w-auto inline-flex items-center justify-center px-8 py-[18px] bg-white/5 backdrop-blur-[20px] border-[1.5px] border-white/80 text-white font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:bg-white/15 hover:border-[#1EA7FF] hover:text-[#1EA7FF] cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                View Our Portfolio
              </Link>
            </motion.div>
          </motion.div>
          
        </div>
      </motion.div>

      {/* Global CSS for Sheen animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sheen {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}} />
    </section>
  );
}
