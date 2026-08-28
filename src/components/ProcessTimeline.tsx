"use client";

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';

const STAGES = [
  {
    num: "01",
    tab: "Consultation",
    title: "Project Consultation",
    desc: "We begin by understanding your vision, functional requirements, budget, and project goals to create the right foundation for success.",
    output: "Requirement Brief",
    participants: "Client, Project Manager, Design Lead",
    img: "/images/process/Consultation.jpg"
  },
  {
    num: "02",
    tab: "Site Analysis",
    title: "Site Analysis",
    desc: "Detailed topographic surveys, soil testing, and environmental assessments to ensure complete structural feasibility.",
    output: "Feasibility Report",
    participants: "Surveyors, Geotech, Architects",
    img: "/images/process/Site Analysis.jpg"
  },
  {
    num: "03",
    tab: "BIM Design",
    title: "BIM Design & Planning",
    desc: "Creating precise 3D structural models and coordinating MEP frameworks to resolve clashes before construction begins.",
    output: "3D Structural Model",
    participants: "Architects, Structural Engineers",
    img: "/images/process/BIM Design.jpg"
  },
  {
    num: "04",
    tab: "Estimation",
    title: "Technical Estimation",
    desc: "Generating an exhaustive Bill of Quantities (BOQ), material schedules, and an uncompromising project timeline.",
    output: "Detailed BOQ",
    participants: "Estimators, Procurement Team",
    img: "/images/process/Estimation.jpg"
  },
  {
    num: "05",
    tab: "Construction",
    title: "Precision Construction",
    desc: "Deploying skilled teams to execute structural engineering with premium materials, guided by rigorous quality controls.",
    output: "Quality Audit",
    participants: "Site Engineers, Contractors",
    img: "/images/process/Construction.jpg"
  },
  {
    num: "06",
    tab: "Handover",
    title: "Quality Handover",
    desc: "Final inspections, comprehensive warranty documentation, and the timely handover of your engineered asset.",
    output: "Completion Certificate",
    participants: "Project Manager, Client",
    img: "/images/process/Handover.jpg"
  }
];

// --- SHARED ANIMATION COMPONENTS ---

const StageImage = ({ stage, index, progress, isMobile = false }: { stage: any, index: number, progress: any, isMobile?: boolean }) => {
  const center = index * 0.2;
  const start = center - 0.2;
  const clipRight = useTransform(progress, [start, center], [100, 0]);
  const clipPath = useTransform(clipRight, val => `inset(0% ${index === 0 ? 0 : val}% 0% 0%)`);

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full bg-[#F8FAFC] overflow-hidden"
      style={{ clipPath, zIndex: index, borderRadius: isMobile ? '24px' : '24px' }}
    >
      <div className="absolute inset-0 border-[2px] border-[#E6EEF5] z-20 pointer-events-none mix-blend-multiply" style={{ borderRadius: isMobile ? '24px' : '24px' }}></div>
      <img src={stage.img} alt={stage.title} className="w-full h-full object-cover" style={{ borderRadius: isMobile ? '24px' : '24px' }} />
      <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] z-10 pointer-events-none" style={{ borderRadius: isMobile ? '24px' : '24px' }}></div>
    </motion.div>
  );
};

const StageNumberWatermark = ({ stage, index, progress, isMobile = false }: { stage: any, index: number, progress: any, isMobile?: boolean }) => {
  const center = index * 0.2;
  const start = center - 0.1;
  const end = center + 0.1;
  const opacity = useTransform(progress, [start, center, end], [0, isMobile ? 0.05 : 0.07, 0]);
  const actualOpacity = index === 0 ? useTransform(progress, [0, 0.1], [isMobile ? 0.05 : 0.07, 0]) : index === 5 ? useTransform(progress, [0.9, 1], [0, isMobile ? 0.05 : 0.07]) : opacity;

  return (
    <motion.div 
      className={`absolute font-['Plus_Jakarta_Sans',_sans-serif] font-extrabold leading-none text-[#2A3441] pointer-events-none select-none tracking-tighter ${isMobile ? '-top-[10px] right-[-20px] text-[160px] z-0' : '-top-[20px] -right-[40px] text-[200px] md:text-[260px]'}`}
      style={{ opacity: actualOpacity }}
    >
      {stage.num}
    </motion.div>
  );
};

// --- DESKTOP COMPONENTS ---

const DesktopStageContent = ({ stage, index, progress }: { stage: any, index: number, progress: any }) => {
  const center = index * 0.2;
  const start = center - 0.1;
  const end = center + 0.1;

  const opacity = useTransform(progress, [start, center, end], [0, 1, 0]);
  const y = useTransform(progress, [start, center, end], [20, 0, -20]);

  const actualOpacity = index === 0 ? useTransform(progress, [0, 0.1], [1, 0]) : index === 5 ? useTransform(progress, [0.9, 1], [0, 1]) : opacity;
  const actualY = index === 0 ? useTransform(progress, [0, 0.1], [0, -20]) : index === 5 ? useTransform(progress, [0.9, 1], [20, 0]) : y;

  return (
    <motion.div 
      className="flex flex-col items-start"
      style={{ gridArea: 'content', opacity: actualOpacity, y: actualY, pointerEvents: index === 0 ? 'auto' : 'none' }}
    >
      <span className="font-['Inter',_sans-serif] text-[11px] lg:text-[12px] font-bold tracking-[0.18em] text-[#7A8794] uppercase mb-2">CURRENT STAGE</span>
      <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[24px] lg:text-[32px] font-bold text-[#071A2F] leading-[1.1] mb-2 lg:mb-3">{stage.title}</h3>
      <p className="font-['Inter',_sans-serif] text-[14px] lg:text-[16px] text-[#5B6472] leading-[1.5] max-w-[540px] mb-4 lg:mb-6">{stage.desc}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full max-w-[600px]">
        <div className="flex-1 bg-white rounded-[12px] border border-[#1196F2]/15 shadow-[0_4px_20px_rgba(17,150,242,0.06)] p-3 lg:p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px] lg:text-[28px] text-[#1196F2]">description</span>
          <div className="flex flex-col">
            <span className="font-['Inter',_sans-serif] text-[9px] lg:text-[10px] text-[#7A8794] uppercase tracking-wider font-semibold mb-1">STAGE OUTPUT</span>
            <span className="font-['Inter',_sans-serif] text-[12px] lg:text-[13px] text-[#071A2F] font-semibold leading-tight">{stage.output}</span>
          </div>
        </div>
        <div className="flex-[1.2] bg-white rounded-[12px] border border-[#1196F2]/15 shadow-[0_4px_20px_rgba(17,150,242,0.06)] p-3 lg:p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px] lg:text-[28px] text-[#1196F2]">group</span>
          <div className="flex flex-col">
            <span className="font-['Inter',_sans-serif] text-[9px] lg:text-[10px] text-[#7A8794] uppercase tracking-wider font-semibold mb-1">KEY PARTICIPANTS</span>
            <span className="font-['Inter',_sans-serif] text-[12px] lg:text-[13px] text-[#071A2F] font-semibold leading-tight">{stage.participants}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const DesktopBottomNav = ({ progress, onTabClick }: { progress: any, onTabClick: (index: number) => void }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[100px] hidden md:flex border-t border-[#E6EEF5] z-50 bg-[#F8FAFC]">
      {STAGES.map((stage, i) => {
        const threshold = i * 0.2;
        const isActive = useTransform(progress, (p: number) => i === 5 ? p >= 0.9 : p >= threshold - 0.05 && p < threshold + 0.15);
        const bg = useTransform(isActive, active => active ? '#071A2F' : '#FFFFFF');
        const color = useTransform(isActive, active => active ? '#FFFFFF' : '#7A8794');
        const numColor = useTransform(isActive, active => active ? '#18A0FB' : '#2A3441');
        const borderTop = useTransform(isActive, active => active ? '3px solid #18A0FB' : '1px solid transparent');

        return (
          <motion.div 
            key={i} onClick={() => onTabClick(i)}
            className="flex-1 flex flex-col justify-center px-8 border-r border-[#E6EEF5] last:border-r-0 cursor-pointer transition-transform duration-300 relative group"
            style={{ backgroundColor: bg, borderTop }} whileHover={{ y: -4 }}
          >
            <motion.span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[24px] font-bold mb-1 group-hover:text-[#18A0FB] transition-colors" style={{ color: numColor }}>{stage.num}</motion.span>
            <motion.span className="font-['Inter',_sans-serif] text-[11px] font-bold tracking-widest uppercase" style={{ color }}>{stage.tab}</motion.span>
          </motion.div>
        );
      })}
    </div>
  );
};

// --- MOBILE COMPONENTS ---

const MobileStageContent = ({ stage, index, progress }: { stage: any, index: number, progress: any }) => {
  const center = index * 0.2;
  const start = center - 0.1;
  const end = center + 0.1;

  const opacity = useTransform(progress, [start, center, end], [0, 1, 0]);
  const y = useTransform(progress, [start, center, end], [16, 0, -16]);

  const actualOpacity = index === 0 ? useTransform(progress, [0, 0.1], [1, 0]) : index === 5 ? useTransform(progress, [0.9, 1], [0, 1]) : opacity;
  const actualY = index === 0 ? useTransform(progress, [0, 0.1], [0, -16]) : index === 5 ? useTransform(progress, [0.9, 1], [16, 0]) : y;

  return (
    <motion.div 
      className="flex flex-col w-full h-full pt-4 pb-4"
      style={{ gridArea: 'content', opacity: actualOpacity, y: actualY, pointerEvents: index === 0 ? 'auto' : 'none' }}
    >
      <StageNumberWatermark stage={stage} index={index} progress={progress} isMobile={true} />
      
      <div className="relative z-10 w-full flex flex-col">
        <span className="font-['Inter',_sans-serif] text-[10px] font-bold tracking-[0.18em] text-[#7A8794] uppercase mb-2">CURRENT STAGE</span>
        <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[24px] font-bold text-[#071A2F] leading-[1.1] mb-2">{stage.title}</h3>
        <p className="font-['Inter',_sans-serif] text-[14px] text-[#5B6472] leading-[1.5] mb-4">{stage.desc}</p>
        
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-[10px] border border-[#1196F2]/15 shadow-[0_4px_16px_rgba(17,150,242,0.06)] p-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#1196F2]">description</span>
            <div className="flex flex-col">
              <span className="font-['Inter',_sans-serif] text-[9px] text-[#7A8794] uppercase tracking-wider font-semibold mb-1">STAGE OUTPUT</span>
              <span className="font-['Inter',_sans-serif] text-[12px] text-[#071A2F] font-semibold leading-tight">{stage.output}</span>
            </div>
          </div>
          <div className="bg-white rounded-[10px] border border-[#1196F2]/15 shadow-[0_4px_16px_rgba(17,150,242,0.06)] p-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#1196F2]">group</span>
            <div className="flex flex-col">
              <span className="font-['Inter',_sans-serif] text-[9px] text-[#7A8794] uppercase tracking-wider font-semibold mb-1">KEY PARTICIPANTS</span>
              <span className="font-['Inter',_sans-serif] text-[12px] text-[#071A2F] font-semibold leading-tight">{stage.participants}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MobileBottomNav = ({ activeStage, onTabClick }: { activeStage: number, onTabClick: (index: number) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.children[activeStage] as HTMLElement;
      if (activeElement) {
        const containerCenter = scrollRef.current.offsetWidth / 2;
        const tabCenter = activeElement.offsetLeft + activeElement.offsetWidth / 2;
        scrollRef.current.scrollTo({ left: tabCenter - containerCenter, behavior: 'smooth' });
      }
    }
  }, [activeStage]);

  return (
    <div ref={scrollRef} className="absolute bottom-0 left-0 w-full h-[76px] flex md:hidden overflow-x-auto hide-scrollbar snap-x snap-mandatory border-t border-[#E6EEF5] bg-[#F8FAFC] z-50">
      {STAGES.map((stage, i) => {
        const isActive = activeStage === i;
        return (
          <div 
            key={i} onClick={() => onTabClick(i)}
            className={`snap-center flex-shrink-0 min-w-[140px] flex flex-col justify-center px-6 border-r border-[#E6EEF5] cursor-pointer transition-colors duration-300 border-t-[3px] ${isActive ? 'bg-[#071A2F] border-t-[#18A0FB]' : 'bg-[#F8FAFC] border-t-transparent'}`}
          >
            <span className={`font-['Plus_Jakarta_Sans',_sans-serif] text-[20px] font-bold mb-1 ${isActive ? 'text-[#18A0FB]' : 'text-[#2A3441]'}`}>{stage.num}</span>
            <span className={`font-['Inter',_sans-serif] text-[10px] font-bold tracking-widest uppercase ${isActive ? 'text-white' : 'text-[#7A8794]'}`}>{stage.tab}</span>
          </div>
        );
      })}
    </div>
  );
};


// --- MAIN COMPONENT ---

export default function ProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const mobileProgress = useSpring(0, { stiffness: 80, damping: 24, restDelta: 0.001 });
  const bgX = useTransform(smoothProgress, [0, 1], ['0px', '-100px']);

  // Sync mobile progress to active stage smoothly
  useEffect(() => {
    mobileProgress.set(activeStage * 0.2);
  }, [activeStage, mobileProgress]);

  // Sync scroll to state for Desktop only
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      const stage = Math.min(5, Math.max(0, Math.round(latest * 5)));
      if (stage !== activeStage) setActiveStage(stage);
    }
  });

  const scrollToStage = (index: number) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      if (!containerRef.current) return;
      const containerTop = containerRef.current.offsetTop;
      const targetY = containerTop + (index * window.innerHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    } else {
      setActiveStage(index);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    if (offset.x < -50 || velocity.x < -500) {
      setActiveStage(Math.min(5, activeStage + 1));
    } else if (offset.x > 50 || velocity.x > 500) {
      setActiveStage(Math.max(0, activeStage - 1));
    }
  };

  return (
    <section ref={containerRef} className="w-full bg-[#F8FAFC] relative max-md:!h-auto md:h-[600vh]">
      
      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (>= md) - Sticky Scroll Scrubbing                            */}
      {/* ========================================================================= */}
      <div className="hidden md:flex sticky top-0 left-0 w-full h-[100dvh] overflow-hidden flex-col">
        
        {/* Subtle Panning Blueprint Background */}
        <motion.div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] min-w-[120vw]" style={{ x: bgX }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="luxGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="none" stroke="#2A3441" strokeWidth="1"/>
                <rect width="25" height="25" fill="none" stroke="#2A3441" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#luxGrid)" />
            <g stroke="#2A3441" strokeWidth="1" fill="none">
              <path d="M 100 200 L 900 200" strokeDasharray="4 4" />
              <path d="M 100 180 L 100 220 M 900 180 L 900 220" />
              <text x="500" y="190" fill="#2A3441" fontSize="14" fontFamily="monospace" textAnchor="middle" stroke="none">18400 mm</text>
              <circle cx="80%" cy="30%" r="200" strokeDasharray="10 10" />
              <circle cx="80%" cy="30%" r="250" strokeWidth="0.5" />
              <rect x="60%" y="40%" width="300" height="200" />
              <line x1="60%" y1="40%" x2="calc(60% + 300px)" y2="calc(40% + 200px)" />
              <line x1="60%" y1="calc(40% + 200px)" x2="calc(60% + 300px)" y2="40%" />
            </g>
          </svg>
        </motion.div>

        <div className="flex flex-col w-full h-full relative z-10 pt-20 pb-[80px] lg:pb-[100px] max-w-[1440px] mx-auto px-[40px] lg:px-[80px]">
          
          <div className="absolute top-8 left-[40px] lg:left-[80px] flex items-center gap-4 z-50">
            <div className="w-[32px] h-[2px] bg-[#1196F2]"></div>
            <span className="font-['Inter',_sans-serif] text-[12px] font-semibold tracking-[0.24em] text-[#1196F2] uppercase">
              DAYAL CONSTRUCTIONS & CO.
            </span>
          </div>

          <div className="flex flex-row w-full h-full items-center gap-[60px] lg:gap-[100px]">
            {/* Left Image */}
            <div className="w-[42%] aspect-[4/4.5] max-h-[60vh] min-h-[360px] relative flex-shrink-0 shadow-[0_30px_80px_rgba(8,23,40,0.08)] rounded-[24px] z-20 overflow-hidden">
              {STAGES.map((s, i) => (
                <StageImage key={i} stage={s} index={i} progress={smoothProgress} />
              ))}
            </div>

            {/* Right Content */}
            <div className="w-[58%] relative flex flex-col justify-center">
              
              <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-visible z-0">
                {STAGES.map((s, i) => (
                  <StageNumberWatermark key={i} stage={s} index={i} progress={smoothProgress} />
                ))}
              </div>

              <div className="relative z-20 mb-4 lg:mb-6">
                <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[36px] lg:text-[48px] font-bold leading-[0.95] tracking-tight flex flex-col">
                  <motion.span className="text-[#071A2F]" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: "-100px" }}>Execution</motion.span>
                  <span className="relative overflow-hidden inline-block w-fit pb-4 -mb-4">
                    <motion.span className="text-[#1196F2] block" initial={{ clipPath: 'inset(0 100% 0 0)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true, margin: "-100px" }}>Methodology</motion.span>
                  </span>
                </h2>
              </div>

              <div className="grid w-full relative z-20" style={{ gridTemplateAreas: '"content"' }}>
                {STAGES.map((s, i) => (
                  <DesktopStageContent key={i} stage={s} index={i} progress={smoothProgress} />
                ))}
              </div>

            </div>
          </div>
        </div>
        <DesktopBottomNav progress={smoothProgress} onTabClick={scrollToStage} />
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (< md) - Normal Document Flow & Swipe Gestures              */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:hidden w-full relative z-10 pt-[48px] pb-[40px] bg-[#F8FAFC]">
        
        <div className="px-6 flex flex-col gap-2 mb-6 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-[24px] h-[2px] bg-[#1196F2]"></div>
            <span className="font-['Inter',_sans-serif] text-[10px] font-semibold tracking-[0.24em] text-[#1196F2] uppercase">DAYAL CONSTRUCTIONS & CO.</span>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[32px] font-bold leading-[1] tracking-tight flex flex-col pb-2">
            <span className="text-[#071A2F]">Execution</span>
            <span className="text-[#1196F2]">Methodology</span>
          </h2>
        </div>

        {/* Swipeable Content Area */}
        <motion.div 
          className="flex flex-col h-auto px-6 gap-6 relative pb-8"
          drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={handleDragEnd}
        >
          {/* Image Wrapper */}
          <div className="w-full aspect-[4/3] min-h-[220px] relative flex-shrink-0 shadow-[0_20px_50px_rgba(8,23,40,0.08)] rounded-[20px] overflow-hidden pointer-events-none">
            {STAGES.map((s, i) => <StageImage key={i} stage={s} index={i} progress={mobileProgress} isMobile={true} />)}
          </div>

          {/* Grid-Area Stacking for height:auto absolute crossfading */}
          <div className="grid w-full relative" style={{ gridTemplateAreas: '"content"' }}>
            {STAGES.map((s, i) => <MobileStageContent key={i} stage={s} index={i} progress={mobileProgress} />)}
          </div>
        </motion.div>

        {/* Bottom Sticky Nav for Mobile */}
        <div className="sticky bottom-0 left-0 w-full z-50 shadow-[0_-10px_30px_rgba(248,250,252,0.9)]">
          <MobileBottomNav activeStage={activeStage} onTabClick={scrollToStage} />
        </div>

      </div>

    </section>
  );
}
