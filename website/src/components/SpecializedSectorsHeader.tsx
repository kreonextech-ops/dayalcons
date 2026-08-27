"use client";

import { motion } from 'framer-motion';

export default function SpecializedSectorsHeader() {
  // Variants
  const eyebrowVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1, 
      transition: { duration: 0.45, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  const heading1Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  const heading2Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.7, delay: 0.12, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  const descVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, delay: 0.3, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex flex-col md:flex-row justify-between items-center gap-[64px] relative z-10 py-[80px]"
    >
      {/* Left: Heading block */}
      <div className="flex flex-col items-start w-full md:w-auto">
        <div className="flex items-center gap-4 mb-4">
          <motion.div 
            variants={lineVariants}
            style={{ originX: 0 }}
            className="h-[2px] bg-[#1196F2] w-[32px] group-hover:w-[48px] transition-all duration-300 ease-out"
          />
          <motion.span 
            variants={eyebrowVariants}
            className="font-['Inter',_sans-serif] text-[13px] font-semibold tracking-[0.18em] text-[#1196F2]"
          >
            OUR EXPERTISE
          </motion.span>
        </div>
        
        <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[38px] md:text-[56px] font-bold leading-[0.95]">
          <div className="overflow-hidden pb-4 -mb-4">
            <motion.div variants={heading1Variants} className="text-[#071A2F]">
              Engineering Every
            </motion.div>
          </div>
          <div className="overflow-hidden pb-4 -mb-4">
            <motion.div variants={heading2Variants} className="text-[#1196F2] group-hover:brightness-[1.08] transition-all duration-300 ease-out">
              Scale of Construction
            </motion.div>
          </div>
        </h2>
      </div>

      {/* Right: Description */}
      <motion.div 
        variants={descVariants}
        className="w-full md:w-auto"
      >
        <p className="font-['Inter',_sans-serif] text-[18px] font-normal text-[#5B6472] leading-[1.75] max-w-[460px]">
          From heavy industrial infrastructure to premium residential estates and landmark commercial developments, we deliver engineered solutions with precision, durability, and uncompromising quality.
        </p>
      </motion.div>
    </motion.div>
  );
}
