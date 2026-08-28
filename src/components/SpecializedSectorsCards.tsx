"use client";

import { motion } from 'framer-motion';

const cards = [
  {
    eyebrow: 'Industrial Projects',
    title: 'Heavy Infrastructure',
    desc: 'Heavy-duty infrastructure engineered for maximum efficiency, scalability, and structural durability.',
    img: '/industrial.jpg',
    yOffset: 'md:translate-y-12',
  },
  {
    eyebrow: 'Commercial Projects',
    title: 'Corporate Spaces',
    desc: 'Innovative office spaces and landmark retail centers built to empower the modern workforce.',
    img: '/commercial.jpg',
    yOffset: 'md:translate-y-4',
  },
  {
    eyebrow: 'Residential Projects',
    title: 'Bespoke & Standard Homes',
    desc: 'Masterfully crafted residences tailored to any scale, seamlessly blending structural integrity with elegant design.',
    img: '/residential.jpg',
    yOffset: 'md:-translate-y-4',
  }
];

export default function SpecializedSectorsCards() {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.4
      }
    }
  };

  const cardVariants = {
    hidden: { y: 80, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 1, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  const imgRevealVariants = {
    hidden: { scale: 1.15, filter: 'blur(4px)' },
    visible: { 
      scale: 1, 
      filter: 'blur(0px)', 
      transition: { duration: 1.4, ease: [0.165, 0.84, 0.44, 1] } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
    >
      {cards.map((card, index) => (
        <motion.div 
          key={index} 
          variants={cardVariants}
          className={`group relative rounded-[2rem] overflow-hidden aspect-[4/5] md:aspect-[3/4] cursor-pointer shadow-[0_20px_40px_rgba(7,26,47,0.08)] ${card.yOffset}`}
        >
          {/* Background Image Reveal */}
          <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#071A2F]">
            <motion.img 
              variants={imgRevealVariants}
              src={card.img} 
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-[1.03]"
            />
          </div>
          
          {/* Base dark overlay to calm the image slightly */}
          <div className="absolute inset-0 bg-[#071A2F]/10 group-hover:bg-[#071A2F]/20 transition-colors duration-700 ease-out z-0"></div>

          {/* Smooth Gradient Layer (Replaces expensive masked blur) */}
          <div 
            className="absolute bottom-0 left-0 w-full h-[50%] group-hover:h-[75%] bg-gradient-to-t from-[#071A2F] via-[#071A2F]/80 to-transparent transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] z-0"
          ></div>

          {/* Text Content Block (No background, sits above the blur layer) */}
          <div className="absolute bottom-0 left-0 p-8 md:p-10 w-full flex flex-col justify-end z-10 pointer-events-none">
            
            <div className="overflow-hidden mb-3">
              <span className="block font-['Inter',_sans-serif] text-[12px] font-bold tracking-[0.18em] text-[#1196F2] uppercase opacity-90">
                {card.eyebrow}
              </span>
            </div>
            
            <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[28px] md:text-[32px] font-bold text-white mb-0 leading-[1.1] transition-transform duration-500 ease-out group-hover:-translate-y-1">
              {card.title}
            </h3>
            
            {/* Smooth CSS Grid Height Reveal on Hover */}
            <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)]">
              <div className="overflow-hidden">
                <p className="font-['Inter',_sans-serif] text-[15px] text-[#F8FAFC]/90 leading-[1.6] mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 ease-out">
                  {card.desc}
                </p>
              </div>
            </div>

          </div>

          {/* Premium Hover Border Glow */}
          <div className="absolute inset-0 border border-white/0 group-hover:border-[#1196F2]/30 rounded-[2rem] transition-colors duration-700 pointer-events-none z-20"></div>
        </motion.div>
      ))}
    </motion.div>
  );
}
