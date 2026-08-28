import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Services | Dayal Constructions & Co.",
  description: "Explore Dayal Constructions & Co.'s full range of services: residential & commercial construction, BIM design, structural engineering, interior design, 3D elevation, soil testing, vastu consultation and turnkey projects in Siliguri, West Bengal.",
  alternates: { canonical: "https://dayalconstructions.in/services" },
  openGraph: { url: "https://dayalconstructions.in/services", title: "Our Services | Dayal Constructions & Co." },
};
"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useState, useRef } from "react";
import IndiaMapComponent from "@/components/IndiaMapComponent";

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const cubicBezier = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: cubicBezier } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 1, ease: cubicBezier } },
};

// ==========================================
// DATA
// ==========================================
const coreServices = [
  { icon: "assignment", title: "Land Registration \n& Mutation", desc: "Complete assistance in land documentation and legal formalities.", color: "#18C8FF" },
  { icon: "task", title: "Building Plan \nApproval", desc: "Hassle-free approval from local authorities and municipal bodies.", color: "#0F5EFF" },
  { icon: "architecture", title: "2D–3D Floor \nPlan Design", desc: "Accurate and realistic floor plans tailored to your requirements.", color: "#18C8FF" },
  { icon: "domain", title: "3D Elevation \nDesign", desc: "Stunning and modern elevations that bring your vision to life.", color: "#0F5EFF" },
  { icon: "science", title: "Soil Testing", desc: "Detailed soil analysis for safe and strong construction.", color: "#18C8FF" },
  { icon: "foundation", title: "Structural \nDesign", desc: "Safe, efficient and cost-effective structural designs by experts.", color: "#0F5EFF" },
  { icon: "explore", title: "Vastu \nConsultation", desc: "Vastu-compliant planning for harmony, positivity and prosperity.", color: "#18C8FF" },
  { icon: "home", title: "Residential \nConstruction", desc: "Vastu-compliant homes and villas built with quality and perfection.", color: "#0F5EFF" },
  { icon: "business", title: "Commercial \nConstruction", desc: "Office spaces, showrooms and commercial buildings that add value.", color: "#18C8FF" },
  { icon: "chair", title: "Interior \nDesign", desc: "Creative and functional interiors that reflect your style and personality.", color: "#0F5EFF" },
  { icon: "handyman", title: "Renovation & \nRemodeling", desc: "Upgrade and transform your space with modern design and quality work.", color: "#18C8FF" },
  { icon: "key", title: "Turnkey \nProjects", desc: "End-to-end solutions from concept to completion — hassle-free.", color: "#0F5EFF" },
];

const designServices = [
  "2D Floor Plan Design",
  "3D Floor Plan Design",
  "Elevation Design",
  "Interior Design",
  "Structural Design",
];

const constructionServices = [
  "Residential Construction",
  "Commercial Construction",
  "Industrial Construction",
  "Renovation & Remodeling",
  "Turnkey Projects",
];

const locations = [
  "Siliguri", "Darjeeling", "Kurseong", "Kalimpong", "Bagdogra", 
  "Naxalbari", "Sikkim (Entire State)", "Guwahati (Assam)", 
  "Katihar (Bihar)", "Entire Dooars", "North Bengal", "+ More Locations..."
];

const whyFeatures = [
  { icon: "precision_manufacturing", title: "End-to-End\nProject Delivery", desc: "From planning to handover, we handle everything." },
  { icon: "engineering", title: "Licensed & Experienced\nEngineers", desc: "Qualified professionals with years of hands-on expertise." },
  { icon: "diamond", title: "Premium Materials &\nWorkmanship", desc: "We use the best materials for long-lasting results." },
  { icon: "receipt_long", title: "Transparent\nCosting", desc: "Clear estimates and no hidden surprises." },
  { icon: "schedule", title: "On-Time\nCommitment", desc: "We respect time and deliver what we promise." },
  { icon: "support_agent", title: "10-Year\nSupport", desc: "Reliable support even after project completion." },
];

// ==========================================
// COMPONENT
// ==========================================
export default function UltraPremiumServices() {
  const [hoveredDesignIndex, setHoveredDesignIndex] = useState<number | null>(null);

  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const scaleVideo = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const words = "Complete Construction Solutions Under One Roof.".split(" ");

  return (
    <main className="w-full bg-[#F8FBFE] text-[#475569] overflow-hidden font-['Inter',_sans-serif]">
      
      {/* ======================================= */}
      {/* SECTION 1: CINEMATIC HERO (100vh)       */}
      {/* ======================================= */}
      <section ref={ref} className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden">
        {/* Background Video/Image (pinned naturally by the structure, scaled) */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ scale: scaleVideo }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Luxury Contemporary Villa"
            className="w-full h-full object-cover"
          />
          {/* Dark navy overlay (60%) */}
          <div className="absolute inset-0 bg-[#082C5C]/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#082C5C]/90 to-transparent"></div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-24"
          style={{ y: yContent, opacity: opacityContent }}
        >
          <div className="max-w-[900px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 font-semibold text-[13px] tracking-[4px] text-[#18C8FF] uppercase"
            >
              OUR SERVICES
            </motion.div>
            
            <h1 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[48px] md:text-[64px] lg:text-[80px] font-[800] leading-[1.05] text-white mb-8 flex flex-wrap gap-x-4">
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word === "One" || word === "Roof." ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F5EFF] to-[#18C8FF]">
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </motion.span>
              ))}
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-[18px] md:text-[22px] font-['Inter',_sans-serif] font-[500] text-white/90 leading-[1.6] mb-12 max-w-[650px]"
            >
              From planning and approvals to construction and interiors, we deliver every service your project needs with one expert team.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="#services" className="inline-flex items-center justify-center px-8 py-[18px] bg-gradient-to-r from-[#0F5EFF] to-[#18C8FF] text-white font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(24,200,255,0.2)]">
                Explore Services
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-[18px] bg-white text-[#082C5C] font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1">
                Get Free Consultation
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ======================================= */}
      {/* SECTION 2: OUR CORE SERVICES */}
      {/* ======================================= */}
      <section id="services" className="w-full py-[120px] bg-white relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.span variants={fadeUp} className="inline-block font-['Inter',_sans-serif] text-[12px] font-bold tracking-[0.2em] text-[#0F5EFF] uppercase mb-4">
              WHAT WE OFFER
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-['Plus_Jakarta_Sans',_sans-serif] text-[40px] lg:text-[48px] font-bold text-[#082C5C]">
              Our Core Services
            </motion.h2>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {coreServices.map((service, i) => (
              <motion.div 
                key={i} variants={fadeUp}
                className="group relative bg-white border border-[#E2E8F0] rounded-[24px] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_24px_48px_rgba(8,44,92,0.06)] flex flex-col"
              >
                {/* Top Border Reveal */}
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#0F5EFF] to-[#18C8FF] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"></div>

                <div className="mb-6">
                  <span className="material-symbols-outlined text-[40px] font-light transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[6deg]" style={{ color: service.color }}>
                    {service.icon}
                  </span>
                </div>

                <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[20px] font-bold text-[#082C5C] mb-3 whitespace-pre-line leading-[1.3]">
                  {service.title}
                </h3>
                
                <p className="font-['Inter',_sans-serif] text-[14px] text-[#475569] leading-[1.6] flex-grow mb-8">
                  {service.desc}
                </p>

                <div className="mt-auto flex justify-end">
                  <span className="material-symbols-outlined text-[#18C8FF] opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    arrow_forward
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ======================================= */}
      {/* SECTION 3: WHY DAYAL (Dark Blueprint Band) */}
      {/* ======================================= */}
      <section className="w-full bg-[#082C5C] py-[100px] relative overflow-hidden">
        {/* Architectural Background */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-screen">
          <img src="/images/footer-blueprint.jpg" alt="" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
        </div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full lg:w-[35%]">
            <motion.span variants={fadeUp} className="inline-block font-['Inter',_sans-serif] text-[12px] font-bold tracking-[0.2em] text-[#18C8FF] uppercase mb-4">
              WHY CHOOSE US
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-['Plus_Jakarta_Sans',_sans-serif] text-[36px] lg:text-[44px] font-bold text-white leading-[1.2] mb-6">
              Built On Trust. <br/>Driven By Excellence.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#94A3B8] text-[16px] leading-[1.7]">
              We combine experience, technology, and transparency to deliver outstanding results on every project, ensuring your peace of mind from start to finish.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyFeatures.map((feature, i) => (
              <motion.div key={i} variants={fadeUp} className="group border border-white/10 rounded-[16px] p-6 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-[#18C8FF]/50">
                <span className="material-symbols-outlined text-[32px] text-[#18C8FF] font-light mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </span>
                <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-white whitespace-pre-line mb-2">
                  {feature.title}
                </h3>
                <p className="text-[13px] text-[#94A3B8] leading-[1.6]">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ======================================= */}
      {/* SECTION 4: SERVICE CATEGORIES */}
      {/* ======================================= */}
      <section className="w-full py-[120px] bg-[#F8FBFE]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          
          <div className="text-center mb-16">
            <span className="inline-block font-['Inter',_sans-serif] text-[12px] font-bold tracking-[0.2em] text-[#0F5EFF] uppercase">
              OUR SERVICE CATEGORIES
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Panel - Design & Planning */}
            <div className="w-full lg:w-1/2 bg-white rounded-[32px] p-8 lg:p-12 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-8 bg-[#0F5EFF] rounded-full"></div>
                  <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[24px] lg:text-[28px] font-bold text-[#082C5C]">
                    Design & Planning
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {designServices.map((item, i) => (
                    <div 
                      key={i} 
                      className="group flex items-center justify-between py-3 px-4 rounded-[12px] transition-colors hover:bg-[#F0F7FF] cursor-pointer"
                      onMouseEnter={() => setHoveredDesignIndex(i)}
                      onMouseLeave={() => setHoveredDesignIndex(null)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0F5EFF] text-[20px] font-light">
                          {i === 0 || i === 1 ? 'architecture' : i === 2 ? 'domain' : i === 3 ? 'chair' : 'foundation'}
                        </span>
                        <span className="font-['Inter',_sans-serif] text-[15px] font-semibold text-[#475569] group-hover:text-[#082C5C] transition-colors">
                          {item}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[#0F5EFF] text-[16px] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        arrow_forward_ios
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden md:block w-[40%] rounded-[20px] overflow-hidden bg-[#F0F7FF]">
                 <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Blueprint" className="w-full h-full object-cover opacity-80" />
              </div>
            </div>

            {/* Right Panel - Construction */}
            <div className="w-full lg:w-1/2 bg-white rounded-[32px] p-8 lg:p-12 border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-2 h-8 bg-[#10B981] rounded-full"></div>
                  <h3 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[24px] lg:text-[28px] font-bold text-[#082C5C]">
                    Construction
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {constructionServices.map((item, i) => (
                    <div 
                      key={i} 
                      className="group flex items-center justify-between py-3 px-4 rounded-[12px] transition-colors hover:bg-[#ECFDF5] cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#10B981] text-[20px] font-light">
                          {i === 0 ? 'home' : i === 1 ? 'business' : i === 2 ? 'factory' : i === 3 ? 'handyman' : 'key'}
                        </span>
                        <span className="font-['Inter',_sans-serif] text-[15px] font-semibold text-[#475569] group-hover:text-[#082C5C] transition-colors">
                          {item}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[#10B981] text-[16px] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                        arrow_forward_ios
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden md:block w-[40%] rounded-[20px] overflow-hidden">
                 <img src="https://images.unsplash.com/photo-1541888086925-0c13d42e82f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Construction Site" className="w-full h-full object-cover" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ======================================= */}
      {/* SECTION 5: AREAS WE WORK IN (Redesigned) */}
      {/* ======================================= */}
      <section className="w-full py-[120px] bg-[#041226] relative overflow-hidden">
        
        {/* Background Map Image & Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.15]">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="City Map" 
            className="w-full h-full object-cover grayscale mix-blend-screen"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#041226] via-[#041226]/80 to-transparent"></div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left - Locations */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full lg:w-3/5">
            <motion.span variants={fadeUp} className="inline-block font-['Inter',_sans-serif] text-[13px] font-bold tracking-[0.3em] text-[#18C8FF] uppercase mb-4">
              REGIONAL PRESENCE
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-['Plus_Jakarta_Sans',_sans-serif] text-[36px] lg:text-[48px] font-bold text-white leading-[1.2] mb-6">
              Proudly Serving <br/>North Bengal & Beyond.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/70 text-[16px] lg:text-[18px] leading-[1.7] mb-12 max-w-[500px]">
              We are present where you need us. Building trust, engineering excellence, and delivering premium projects across cities, communities, and entire states.
            </motion.p>
            
            <motion.div variants={staggerContainer} className="flex flex-wrap gap-4">
              {locations.map((loc, i) => (
                <motion.div 
                  key={i} 
                  variants={fadeUp} 
                  className={`px-6 py-3.5 rounded-full border border-white/10 backdrop-blur-md text-[14px] font-semibold text-white flex items-center gap-2 transition-all cursor-default ${loc === "+ More Locations..." ? "bg-[#18C8FF]/10 border-[#18C8FF]/30 hover:bg-[#18C8FF]/20" : "bg-white/5 hover:border-[#18C8FF]/70 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(24,200,255,0.2)]"}`}
                >
                  {loc !== "+ More Locations..." && <span className="material-symbols-outlined text-[18px] text-[#18C8FF]">location_on</span>}
                  {loc}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Interactive Map SVG */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} viewport={{ once: true }} className="w-full lg:w-2/5 flex justify-center items-center">
            <IndiaMapComponent className="w-full max-w-[500px]" />
          </motion.div>

        </div>
      </section>

      {/* ======================================= */}
      {/* FINAL CTA */}
      {/* ======================================= */}
      <section className="w-full px-6 lg:px-12 py-[80px] bg-white">
        <div className="max-w-[1440px] mx-auto bg-gradient-to-br from-[#082C5C] to-[#04152D] rounded-[32px] p-[40px] lg:p-[80px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
          
          <div className="absolute right-0 bottom-0 opacity-[0.05] w-[50%] pointer-events-none mix-blend-screen">
             <img src="/images/footer-blueprint.jpg" alt="" className="w-full h-auto object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
          </div>

          <div className="relative z-10 md:w-2/3 text-center md:text-left">
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[32px] lg:text-[48px] font-bold text-white leading-[1.1] mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-[16px] lg:text-[18px] text-white/80">
              Let’s transform your vision into beautifully engineered spaces.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link href="/contact" className="group bg-white text-[#082C5C] px-8 py-5 rounded-full font-['Plus_Jakarta_Sans',_sans-serif] text-[15px] font-bold flex items-center gap-3 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(24,200,255,0.3)]">
              GET A FREE QUOTATION
              <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}

