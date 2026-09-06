"use client";

import { motion } from "framer-motion";

const STAGES = [
  {
    num: "01",
    title: "Project Consultation",
    desc: "We begin by understanding your vision, functional requirements, budget, and project goals to create the right foundation for success.",
    img: "/images/process/Consultation.jpg"
  },
  {
    num: "02",
    title: "Site Analysis",
    desc: "Detailed topographic surveys, soil testing, and environmental assessments to ensure complete structural feasibility.",
    img: "/images/process/Site Analysis.jpg"
  },
  {
    num: "03",
    title: "BIM Design & Planning",
    desc: "Creating precise 3D structural models and coordinating MEP frameworks to resolve clashes before construction begins.",
    img: "/images/process/BIM Design.jpg"
  },
  {
    num: "04",
    title: "Technical Estimation",
    desc: "Generating an exhaustive Bill of Quantities (BOQ), material schedules, and an uncompromising project timeline.",
    img: "/images/process/Estimation.jpg"
  },
  {
    num: "05",
    title: "Precision Construction",
    desc: "Deploying skilled teams to execute structural engineering with premium materials, guided by rigorous quality controls.",
    img: "/images/process/Construction.jpg"
  },
  {
    num: "06",
    title: "Quality Handover",
    desc: "Final inspections, comprehensive warranty documentation, and the timely handover of your engineered asset.",
    img: "/images/process/Handover.jpg"
  }
];

export default function ProcessTimeline() {
  return (
    <section className="w-full py-20 lg:py-28 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-24 flex flex-col items-center">
          <span className="font-bold text-[12px] tracking-[0.2em] text-[#94A3B8] uppercase mb-4">
            Our Process
          </span>
          <h2 className="text-[36px] lg:text-[48px] font-[800] text-[#062B55] leading-[1.2] mb-4">
            Execution <span className="text-[#18AFFF]">Methodology</span>
          </h2>
          <p className="text-[#64748B] text-[16px] lg:text-[18px] max-w-[700px] leading-[1.7]">
            A structured approach from ground assessment to successful handover, ensuring quality, transparency and on-time delivery.
          </p>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-2">
          {STAGES.map((stage, index) => (
            <div key={stage.num} className="flex flex-col lg:flex-row items-center lg:items-start w-full lg:w-auto flex-1">
              
              {/* Step Content */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex flex-col items-center text-center max-w-[280px] lg:max-w-[200px] mx-auto"
              >
                {/* Image Circle with Number Badge */}
                <div className="relative mb-8">
                  <div className="w-[140px] h-[140px] lg:w-[130px] lg:h-[130px] rounded-full overflow-hidden border-[6px] border-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] bg-white">
                    <img 
                      src={stage.img} 
                      alt={stage.title}
                      className="w-full h-full object-cover rounded-full" 
                    />
                  </div>
                  {/* Number Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <div className="bg-white p-1 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)]">
                      <div className="bg-[#18AFFF] text-white font-bold text-[14px] w-[32px] h-[32px] flex items-center justify-center rounded-full">
                        {stage.num}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="font-bold text-[18px] text-[#062B55] mb-3 leading-[1.3]">
                  {stage.title}
                </h3>
                <p className="text-[14px] text-[#64748B] leading-[1.6]">
                  {stage.desc}
                </p>
              </motion.div>

              {/* Arrow separator (Desktop only) */}
              {index < STAGES.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index * 0.1) + 0.3 }}
                  className="hidden lg:flex items-center justify-center h-[130px] px-2 text-[#CBD5E1]"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 lg:mt-24 text-center"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-[40px] bg-[#E2E8F0]"></div>
            <span className="text-[12px] font-bold tracking-[0.2em] text-[#94A3B8] uppercase">
              From Vision To Reality
            </span>
            <div className="h-[1px] w-[40px] bg-[#E2E8F0]"></div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
