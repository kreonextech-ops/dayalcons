"use client";

import { motion } from 'framer-motion';

export default function TrustSection() {
  const eyebrowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.165, 0.84, 0.44, 1] } }
  };

  const lineVariants = {
    hidden: { y: 32, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.165, 0.84, 0.44, 1] } }
  };

  const line2Variants = {
    hidden: { y: 32, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.7, delay: 0.12, ease: [0.165, 0.84, 0.44, 1] } }
  };

  const descVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.25, ease: [0.165, 0.84, 0.44, 1] } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    visible: (i: number) => ({
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        delay: 0.4 + (i * 0.12), 
        duration: 0.8, 
        ease: [0.165, 0.84, 0.44, 1] 
      }
    })
  };

  const cards = [
    { image: '/Transparent Pricing.png', icon: 'receipt_long', title: 'Transparent Pricing', text: 'Clear quotations with no hidden costs from planning to delivery.' },
    { image: '/BIM Precision.png', icon: 'architecture', title: 'BIM Precision', text: 'Millimeter-accurate planning and engineering for flawless execution.' },
    { image: '/Turnkey Execution.png', icon: 'check_circle', title: 'Turnkey Execution', text: 'One expert team managing design, approvals, construction, and handover.' },
    { image: '/Premium Materials.png', icon: 'verified_user', title: 'Premium Materials', text: 'Trusted brands, rigorous quality control, and long-term durability.' },
  ];

  return (
    <section className="w-full py-[140px] bg-[#F8FAFC] relative overflow-hidden flex justify-center">
      
      {/* Luxury Blueprint Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(255,255,255,1) 0%, rgba(248,250,252,0) 70%)' }}>
        
        {/* 3% Cyan CAD Grid */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="trustGridBg" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1196F2" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#trustGridBg)" />
          </svg>
        </div>
        
        {/* Faint blueprint fading from top-right */}
        <div className="absolute -top-[15%] -right-[5%] w-[700px] h-[700px] opacity-[0.02] mix-blend-multiply">
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="160" stroke="#071A2F" strokeWidth="0.5"/>
            <circle cx="200" cy="200" r="120" stroke="#071A2F" strokeWidth="0.5" strokeDasharray="4 4"/>
            <circle cx="200" cy="200" r="80" stroke="#1196F2" strokeWidth="1" strokeDasharray="2 2"/>
            <line x1="0" y1="200" x2="400" y2="200" stroke="#071A2F" strokeWidth="0.5"/>
            <line x1="200" y1="0" x2="200" y2="400" stroke="#071A2F" strokeWidth="0.5"/>
            <line x1="40" y1="40" x2="360" y2="360" stroke="#071A2F" strokeWidth="0.5"/>
            <line x1="360" y1="40" x2="40" y2="360" stroke="#071A2F" strokeWidth="0.5"/>
            <rect x="100" y="100" width="200" height="200" stroke="#071A2F" strokeWidth="0.5" transform="rotate(45 200 200)"/>
          </svg>
        </div>

        {/* Perspective engineering floor grid at bottom */}
        <div className="absolute bottom-[-100px] left-0 w-full h-[400px] opacity-[0.03]" style={{ perspective: '1200px' }}>
          <div className="w-full h-[800px] border border-[#071A2F]" style={{ backgroundImage: 'linear-gradient(#071A2F 1px, transparent 1px), linear-gradient(90deg, #071A2F 1px, transparent 1px)', backgroundSize: '60px 60px', transform: 'rotateX(80deg) translateY(-200px)' }}></div>
        </div>

        {/* 4x4 Cyan dotted matrix bottom-left */}
        <div className="absolute bottom-[10%] left-[8%] opacity-40">
          <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotMatrixTrust" width="15" height="15" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#1196F2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotMatrixTrust)" />
          </svg>
        </div>
        
        {/* Dimension lines */}
        <div className="absolute top-[30%] left-[5%] w-[1px] h-[180px] bg-[#071A2F]/10">
          <div className="absolute top-0 left-[-4px] w-2 h-[1px] bg-[#071A2F]/40"></div>
          <div className="absolute bottom-0 left-[-4px] w-2 h-[1px] bg-[#071A2F]/40"></div>
          <div className="absolute top-1/2 left-[-16px] text-[10px] text-[#071A2F]/40 font-mono -rotate-90">ELEV-01</div>
        </div>
      </div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 w-full max-w-[1320px] px-6 md:px-[80px] mx-auto flex flex-col items-start"
      >
        {/* HEADER BLOCK */}
        <div className="flex flex-col items-start w-full">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-[32px] h-[2px] bg-[#1196F2]"></div>
            <motion.span variants={eyebrowVariants} className="font-['Inter',_sans-serif] text-[13px] font-semibold tracking-[0.18em] text-[#1196F2] uppercase">
              WHY CHOOSE DAYAL
            </motion.span>
          </div>

          <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[40px] md:text-[56px] font-bold leading-[0.95] mb-8">
            <div className="overflow-hidden pb-4 -mb-4"><motion.div variants={lineVariants} className="text-[#071A2F]">Built on Trust.</motion.div></div>
            <div className="overflow-hidden pb-4 -mb-4"><motion.div variants={line2Variants} className="text-[#1196F2]">Engineered for Excellence.</motion.div></div>
          </h2>

          <motion.p variants={descVariants} className="font-['Inter',_sans-serif] text-[18px] text-[#5B6472] max-w-[480px] leading-[1.6]">
            Every project is executed with structural precision, transparent communication, and uncompromising quality—from planning and approvals to final handover.
          </motion.p>
          
        </div>

        {/* 2x2 TRUST CARDS GRID */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mt-[48px]">
          {cards.map((card, i) => (
            <motion.div 
              key={i}
              custom={i}
              variants={cardVariants}
              className="group relative rounded-[22px] overflow-hidden border border-[rgba(17,150,242,0.12)] cursor-pointer transition-all duration-500 hover:-translate-y-[10px] hover:border-[#1196F2]/30 hover:shadow-[0_24px_60px_rgba(11,31,58,0.12)] aspect-[4/3] md:aspect-[4/3]"
            >
              {/* Full Card Image Background */}
              <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#F8FAFC]">
                <img 
                  src={card.image} 
                  alt={card.title} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:scale-105" 
                />
                {/* Light overlay to calm the image slightly */}
                <div className="absolute inset-0 bg-[#071A2F]/5 group-hover:bg-[#071A2F]/15 transition-colors duration-700 ease-out z-0"></div>
              </div>

              {/* Smooth Gradient Layer for Text (Replaces expensive masked blur) */}
              <div 
                className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/90 to-transparent transition-all duration-500 ease-out z-0"
              ></div>

              {/* Top Floating Icon */}
              <div className="absolute top-6 right-6 w-[48px] h-[48px] rounded-[14px] bg-white/70 backdrop-blur-md border border-white shadow-[0_8px_20px_rgba(17,150,242,0.15)] flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:rotate-[8deg] z-20">
                <span className="material-symbols-outlined text-[24px] text-[#1196F2]">{card.icon}</span>
              </div>

              {/* Text Content Block */}
              <div className="absolute bottom-0 left-0 p-[28px] md:p-[32px] w-full flex flex-col justify-end z-10 pointer-events-none">
                <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[20px] md:text-[22px] font-bold text-[#071A2F] mb-2 transition-transform duration-500 group-hover:-translate-y-1">{card.title}</h3>
                <p className="font-['Inter',_sans-serif] text-[14px] md:text-[15px] text-[#5B6472] leading-[1.6] pb-[10px] transition-transform duration-500 group-hover:-translate-y-1">{card.text}</p>
                
                {/* Cyan animated underline */}
                <div className="absolute bottom-[28px] left-[28px] w-0 h-[2px] bg-[#1196F2] transition-all duration-500 ease-[cubic-bezier(0.165,0.84,0.44,1)] group-hover:w-[36px]"></div>
              </div>
            </motion.div>
          ))}
        </div>

      </motion.div>
    </section>
  );
}
