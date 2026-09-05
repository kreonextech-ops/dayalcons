'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function ProcessPage() {
  return (
    <main className="bg-white min-h-screen relative overflow-x-hidden font-['Manrope',_sans-serif] text-[#062B55]">
      {/* Background Subtle Blueprint Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] bg-[url(/images/footer-blueprint.jpg)] bg-repeat bg-[length:400px_400px] grayscale invert mix-blend-multiply"></div>
      
      <HeroSection />
      
      <div className="relative z-10 space-y-[100px] md:space-y-[120px] pb-[120px] bg-transparent">
        <TimelineSection />
        <ProcessHighlights />
        <CTASection />
      </div>
    </main>
  );
}

// ==============================
// 1. HERO SECTION
// ==============================
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const yContent = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const words = "How We Work".split(" ");

  return (
    <section ref={ref} className="relative w-full h-[70vh] min-h-[600px] rounded-b-[48px] overflow-hidden flex items-center shadow-[0_30px_60px_rgba(6,43,85,0.15)] mb-[80px]">
      {/* Background Image with 18s zoom */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        initial={{ scale: 1 }}
        animate={{ scale: 1.08 }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <img 
          src="/images/process-hero-bg.jpg"
          alt="Dayal Construction Process" 
          className="w-full h-full object-cover"
        />
        {/* Dark navy gradient overlay from left (70%) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#062B55] via-[#062B55]/80 to-[#062B55]/10"></div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-24"
        style={{ y: yContent, opacity: opacityContent }}
      >
        <div className="max-w-[700px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 flex items-center gap-4"
          >
            <div className="w-12 h-[2px] bg-[#18AFFF]"></div>
            <span className="font-semibold text-[13px] tracking-[4px] text-[#18AFFF] uppercase">
              OUR PROCESS
            </span>
          </motion.div>
          
          <h1 className="text-[56px] md:text-[80px] font-[800] leading-[1.05] text-white mb-6 flex flex-wrap gap-x-4 overflow-hidden">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: "0%" }}
                transition={{ duration: 0.8, delay: 0.3 + (i * 0.15), ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-[18px] md:text-[22px] font-[500] text-[#C8D6E5] leading-[1.6] mb-10 max-w-[600px]"
          >
            A simple, transparent and hassle-free process that transforms your vision into reality—from first enquiry to final handover.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-[18px] bg-[#18AFFF] text-white font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(24,175,255,0.3)]">
              Start Your Project
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-[18px] bg-transparent border border-white/30 text-white font-bold text-[16px] rounded-[16px] transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 backdrop-blur-sm">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ==============================
// 2. TIMELINE SECTION
// ==============================
function TimelineSection() {
  const steps = [
    {
      num: "01",
      title: "Enquiry",
      icon: "chat",
      desc: "Share your land, residential or commercial project requirements with our team. We understand your vision before recommending the best solution.",
      img: "/images/process/Consultation.jpg"
    },
    {
      num: "02",
      title: "Site Visit",
      icon: "location_on",
      desc: "Our engineers visit your site to assess dimensions, surroundings, accessibility and technical feasibility before planning begins.",
      img: "/images/process/Site Analysis.jpg"
    },
    {
      num: "03",
      title: "Estimate",
      icon: "calculate",
      desc: "Receive a transparent quotation, scope of work, material specifications and project timeline with no hidden surprises.",
      img: "/images/process/Estimation.jpg"
    },
    {
      num: "04",
      title: "Design & Approval",
      icon: "architecture",
      desc: "We create 2D layouts, 3D floor plans, elevations and structural drawings while refining every detail until approval.",
      img: "/images/process/BIM Design.jpg"
    },
    {
      num: "05",
      title: "Construction",
      icon: "engineering",
      desc: "Skilled professionals execute the project using premium materials, regular supervision and strict quality standards.",
      img: "/images/process/Construction.jpg"
    },
    {
      num: "06",
      title: "Handover",
      icon: "vpn_key",
      desc: "After final inspection and quality checks, we deliver your completed project with complete documentation and long-term support.",
      img: "/images/process/Handover.jpg"
    }
  ];

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  return (
    <section className="px-6 md:px-12" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto">
        
        {/* Title Area */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-[40px] md:text-[56px] font-[800] text-[#062B55] mb-4"
          >
            Your Journey With Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2 }}
            className="text-[18px] md:text-[20px] font-[500] text-[#062B55]/70 max-w-[600px] mx-auto"
          >
            Every successful project follows a structured workflow designed for clarity, quality and timely execution.
          </motion.p>
        </div>

        {/* Timeline Layout */}
        <div className="relative pl-6 md:pl-0">
          {/* Vertical Line */}
          <div className="absolute left-[34px] md:left-[80px] top-0 bottom-0 w-[2px] bg-[#062B55]/10 rounded-full">
            <motion.div 
              className="absolute top-0 left-0 w-full bg-[#18AFFF] origin-top rounded-full"
              style={{ scaleY: scrollYProgress, height: '100%' }}
            ></motion.div>
          </div>

          <div className="flex flex-col gap-12 md:gap-16 relative z-10">
            {steps.map((step, idx) => (
              <TimelineStep key={step.num} step={step} index={idx} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function TimelineStep({ step, index }: { step: any, index: number }) {
  const stepRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ["start 70%", "end 70%"]
  });
  
  // Create a color interpolation for the circle based on scroll
  const circleBg = useTransform(scrollYProgress, [0, 1], ["#FFFFFF", "#18AFFF"]);
  const circleBorder = useTransform(scrollYProgress, [0, 1], ["rgba(6,43,85,0.1)", "rgba(24,175,255,1)"]);
  const circleText = useTransform(scrollYProgress, [0, 1], ["#062B55", "#FFFFFF"]);

  return (
    <div ref={stepRef} className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 w-full">
      {/* Node / Number */}
      <div className="flex-shrink-0 flex items-center justify-center relative w-[52px] h-[52px] md:w-[64px] md:h-[64px] md:ml-[48px]">
        <motion.div 
          className="absolute inset-0 rounded-full border-[2px] shadow-sm flex items-center justify-center font-[800] text-[18px] md:text-[22px]"
          style={{ backgroundColor: circleBg, borderColor: circleBorder, color: circleText }}
        >
          {step.num}
        </motion.div>
      </div>

      {/* Card */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: index % 2 === 0 ? 0 : 0.1 }}
        className="flex-grow bg-white rounded-[28px] border border-[#062B55]/5 shadow-[0_12px_40px_rgba(6,43,85,0.04)] hover:shadow-[0_20px_60px_rgba(24,175,255,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col md:flex-row overflow-hidden min-h-[170px]"
      >
        {/* Text Content */}
        <div className="p-8 md:p-10 flex-grow flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <span className="material-symbols-outlined text-[32px] text-[#18AFFF]">{step.icon}</span>
            <h3 className="text-[28px] md:text-[32px] font-[800] text-[#062B55]">{step.title}</h3>
          </div>
          <p className="text-[16px] md:text-[18px] font-[500] leading-[1.6] text-[#062B55]/70 max-w-[500px]">
            {step.desc}
          </p>
        </div>

        {/* Image */}
        <div className="w-full md:w-[40%] h-[200px] md:h-auto relative overflow-hidden shrink-0">
          <motion.div 
            initial={{ x: "100%" }}
            whileInView={{ x: "0%" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="absolute inset-0 bg-[#062B55]"
          ></motion.div>
          <img 
            src={step.img} 
            alt={step.title}
            className="w-full h-full object-cover rounded-none md:rounded-l-[18px] brightness-[0.95]"
          />
        </div>
      </motion.div>
    </div>
  );
}

// ==============================
// 3. PROCESS HIGHLIGHTS
// ==============================
function ProcessHighlights() {
  const highlights = [
    { icon: 'verified', title: 'Transparent Process', desc: 'Clear communication at every stage.' },
    { icon: 'schedule', title: 'On-Time Delivery', desc: 'Efficient planning and milestone tracking.' },
    { icon: 'workspace_premium', title: 'Quality Assured', desc: 'Premium materials and rigorous inspections.' },
    { icon: 'sentiment_very_satisfied', title: 'Client Satisfaction', desc: 'Personalized service with lasting relationships.' }
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="px-6 md:px-12">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-[1400px] mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-[0_20px_60px_rgba(6,43,85,0.06)] border border-[#062B55]/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#062B55]/10"
      >
        {highlights.map((item, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            className="group flex flex-col items-center text-center px-4 pt-8 sm:pt-0 transition-transform duration-300 hover:-translate-y-2 relative"
          >
            <div className="w-[72px] h-[72px] rounded-full border-[2px] border-[#18AFFF] flex items-center justify-center mb-6 bg-white transition-transform duration-500 group-hover:rotate-[8deg] group-hover:shadow-[0_8px_24px_rgba(24,175,255,0.2)]">
              <span className="material-symbols-outlined text-[32px] text-[#18AFFF] font-light">{item.icon}</span>
            </div>
            <h4 className="text-[20px] font-[800] text-[#062B55] mb-2">{item.title}</h4>
            <p className="text-[15px] font-[500] text-[#062B55]/70 leading-[1.5] max-w-[220px]">
              {item.desc}
            </p>
            {/* Underline expand on hover */}
            <div className="h-[2px] bg-[#18AFFF] w-0 group-hover:w-[40px] transition-all duration-300 mt-4 rounded-full"></div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

// ==============================
// 4. CTA SECTION
// ==============================
function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const floatY = useTransform(scrollYProgress, [0, 1], ["20px", "-20px"]);

  return (
    <section className="px-6 md:px-12" ref={containerRef}>
      <div className="max-w-[1400px] mx-auto rounded-[48px] bg-[#062B55] overflow-hidden relative shadow-[0_30px_60px_rgba(6,43,85,0.2)] min-h-[400px] flex items-center">
        
        {/* Background Blueprint Shifting */}
        <motion.div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ y: bgY }}
        >
          <img src="/images/footer-blueprint.jpg" alt="" className="w-full h-[150%] object-cover" />
        </motion.div>

        {/* Content Wrapper */}
        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-between p-12 md:p-20 gap-12">
          
          {/* Left Text */}
          <div className="max-w-[600px] text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[40px] md:text-[52px] font-[800] text-white leading-[1.1] mb-6"
            >
              Ready to Build Your Dream?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-[18px] md:text-[20px] font-[500] text-[#C8D6E5] leading-[1.6] mb-10"
            >
              Let’s transform your ideas into exceptional architecture with engineering precision and complete transparency.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-[#18AFFF] text-white font-bold text-[18px] rounded-[20px] transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
                <span className="absolute inset-0 rounded-[20px] shadow-[0_0_20px_rgba(24,175,255,0.6)] animate-[pulse_5s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="relative z-10 flex items-center gap-2">
                  Start Your Project
                  <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                </span>
              </Link>
            </motion.div>
          </div>

          {/* Right Isometric Image */}
          <motion.div 
            style={{ y: floatY }}
            className="w-full md:w-[500px] h-[300px] md:h-[400px] relative shrink-0 rounded-[24px] overflow-hidden hidden md:block shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
              alt="Architecture isometric rendering"
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient to blend */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#062B55] to-transparent opacity-40"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}


