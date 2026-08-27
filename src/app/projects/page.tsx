"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// Trust Badges Data
const trustBadges = [
  { icon: "verified_user", text: "Quality Assurance" },
  { icon: "groups", text: "Expert Team" },
  { icon: "schedule", text: "On-Time Delivery" },
  { icon: "receipt_long", text: "Transparent Process" },
];

// Project Placeholders Data (12 items)
const projects = [
  { id: 1, aspect: "aspect-[5/4]", title: "Modern Luxury Villa" },
  { id: 2, aspect: "aspect-[4/5]", title: "Commercial Complex" },
  { id: 3, aspect: "aspect-[5/4]", title: "Corporate Office" },
  { id: 4, aspect: "aspect-[16/10]", title: "Industrial Facility" },
  { id: 5, aspect: "aspect-[1/1]", title: "Minimalist Residence" },
  { id: 6, aspect: "aspect-[4/5]", title: "Urban Apartment" },
  { id: 7, aspect: "aspect-[5/4]", title: "Retail Showroom" },
  { id: 8, aspect: "aspect-[16/10]", title: "Factory Warehouse" },
  { id: 9, aspect: "aspect-[5/4]", title: "Luxury Penthouse" },
  { id: 10, aspect: "aspect-[4/5]", title: "Hospitality Project" },
  { id: 11, aspect: "aspect-[5/4]", title: "Boutique Hotel" },
  { id: 12, aspect: "aspect-[1/1]", title: "Custom Duplex" },
];

// Excellence Cards Data
const excellenceFeatures = [
  { icon: "architecture", title: "End-to-End Delivery", desc: "From foundation to finish." },
  { icon: "engineering", title: "Licensed Engineers", desc: "Experts managing your build." },
  { icon: "diamond", title: "Premium Materials", desc: "Highest quality guaranteed." },
  { icon: "receipt_long", title: "Transparent Costing", desc: "No hidden charges, ever." },
  { icon: "event_available", title: "On-Time Commitment", desc: "We deliver on schedule." },
  { icon: "handshake", title: "Client Satisfaction", desc: "Your vision, realized." },
];

export default function ProjectsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const headingWords = "Built with Trust. Delivered with Pride.".split(" ");

  return (
    <main className="w-full bg-white text-[#475569] overflow-hidden font-['Manrope',_sans-serif]">
      
      {/* ======================================= */}
      {/* SECTION 1: HERO (100vh Cinematic) */}
      {/* ======================================= */}
      <section ref={heroRef} className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden">
        {/* Background Video/Image (pinned naturally by the structure, scaled) */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ scale: imgScale }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Luxury Modern Villa" 
            className="w-full h-full object-cover"
          />
          {/* Dark navy overlay (60%) */}
          <div className="absolute inset-0 bg-[#062B55]/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#062B55]/90 to-transparent"></div>
        </motion.div>

        {/* Content */}
        <motion.div 
          className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pt-24"
          style={{ y: yContent, opacity: opacityContent }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-[900px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6 font-semibold text-[13px] tracking-[4px] text-[#18AFFF] uppercase"
            >
              OUR PROJECTS
            </motion.div>
            
            <h1 className="text-[48px] md:text-[64px] lg:text-[80px] font-[800] leading-[1.05] text-white mb-8 flex flex-wrap gap-x-4">
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {word === "Trust." || word === "Pride." ? (
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#18AFFF]">
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
              className="text-[18px] md:text-[22px] font-[500] text-white/90 leading-[1.6] mb-12 max-w-[650px]"
            >
              Explore our portfolio of residential, commercial and industrial projects that reflect engineering precision, premium craftsmanship and timeless design.
            </motion.p>

            {/* Trust Badges */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="flex flex-wrap gap-3 mb-12"
            >
              {trustBadges.map((badge, i) => (
                <motion.div 
                  key={i} variants={fadeUp}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-sm"
                >
                  <span className="material-symbols-outlined text-[#18AFFF] text-[18px]">{badge.icon}</span>
                  <span className="text-[13px] font-bold text-white">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="#gallery" className="inline-flex items-center justify-center px-8 py-[18px] bg-[#18AFFF] text-white font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(24,175,255,0.25)]">
                View Gallery
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center px-8 py-[18px] bg-white text-[#062B55] font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1">
                Start Your Project
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>


      {/* ======================================= */}
      {/* SECTION 2: PROJECT GALLERY */}
      {/* ======================================= */}
      <section id="gallery" className="w-full py-[100px] lg:py-[120px] bg-white relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16 max-w-[800px] mx-auto">
            <motion.span variants={fadeUp} className="inline-block font-bold text-[12px] tracking-[0.2em] text-[#18AFFF] uppercase mb-4">
              OUR PROJECT GALLERY
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-[36px] lg:text-[48px] font-[800] text-[#062B55] mb-6 leading-[1.2]">
              Craftsmanship in Every Project
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#475569] text-[16px] lg:text-[18px] leading-[1.7]">
              A curated collection of completed projects showcasing our commitment to quality, design and engineering excellence.
            </motion.p>
          </motion.div>

          {/* Masonry Gallery */}
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
            className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {projects.map((project) => (
              <motion.div 
                key={project.id} 
                variants={fadeUp}
                className={`group relative w-full ${project.aspect} bg-[#F1F5F9] rounded-[22px] overflow-hidden border border-[#062B55]/10 cursor-pointer break-inside-avoid`}
              >
                {/* Placeholder Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-[1.03]">
                  {/* Subtle Blueprint Texture for Placeholder */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#062B55 1px, transparent 1px), linear-gradient(90deg, #062B55 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  
                  <span className="material-symbols-outlined text-[#062B55]/20 text-[32px] mb-2 relative z-10">
                    image
                  </span>
                  <span className="text-[#062B55]/30 font-bold tracking-widest text-[11px] uppercase relative z-10">
                    Project Image
                  </span>
                </div>

                {/* Hover Interaction (Prepared for real images) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#062B55]/90 via-[#062B55]/20 to-transparent opacity-0 transition-opacity duration-350 ease-out group-hover:opacity-100 flex flex-col justify-end p-6 lg:p-8">
                  <h3 className="text-white font-bold text-[20px] lg:text-[24px] translate-y-4 opacity-0 transition-all duration-350 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    {project.title}
                  </h3>
                  <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center translate-y-4 opacity-0 transition-all duration-350 delay-75 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="material-symbols-outlined text-white text-[20px] -rotate-45">arrow_forward</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ======================================= */}
      {/* SECTION 3: COMPANY EXCELLENCE */}
      {/* ======================================= */}
      <section className="w-full bg-[#062B55] py-[100px] lg:py-[120px] relative overflow-hidden">
        {/* Deep blueprint texture + cyan glow */}
        <div className="absolute inset-0 opacity-[0.1] mix-blend-screen pointer-events-none">
          <img src="/images/footer-blueprint.png" alt="Blueprint" className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display='none'} />
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#18AFFF] rounded-full blur-[150px] opacity-20 pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Content */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full lg:w-[40%] flex flex-col justify-center">
            <motion.span variants={fadeUp} className="inline-block font-bold text-[12px] tracking-[0.2em] text-[#18AFFF] uppercase mb-4">
              WHY DAYAL
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-[36px] lg:text-[48px] font-[800] text-white leading-[1.2] mb-6">
              Engineering Excellence. Proven Results.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#94A3B8] text-[16px] lg:text-[18px] leading-[1.7]">
              Every completed project is built with transparency, premium materials and meticulous supervision from foundation to final handover.
            </motion.p>
          </motion.div>

          {/* Right Grid */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6">
            {excellenceFeatures.map((feature, i) => (
              <motion.div 
                key={i} variants={fadeUp} 
                className="group p-6 lg:p-8 rounded-[24px] bg-white/[0.03] backdrop-blur-md border border-white/10 transition-all duration-300 hover:border-[#18AFFF]/60 hover:bg-white/[0.06] hover:shadow-[0_20px_60px_rgba(24,175,255,0.05)] hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-[#18AFFF]/10 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                  <span className="material-symbols-outlined text-[#18AFFF]">{feature.icon}</span>
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-[14px] text-[#94A3B8] leading-[1.6]">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>

      {/* ======================================= */}
      {/* SECTION 4: SIGNATURE CTA */}
      {/* ======================================= */}
      <section className="w-full py-[100px] lg:py-[120px] bg-white relative z-10 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#062B55] to-[#0A3B73] shadow-[0_20px_60px_rgba(6,43,85,0.15)]">
          
          {/* Animated Blueprint Illustration */}
          <div className="absolute top-0 left-0 w-full lg:w-[50%] h-full opacity-20 pointer-events-none mix-blend-screen">
            <motion.img 
              animate={{ x: [0, -20, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              src="/images/footer-blueprint.png" 
              alt="Blueprint" 
              className="w-full h-full object-cover origin-left"
              onError={(e) => e.currentTarget.style.display='none'}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 lg:py-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-[36px] lg:text-[48px] font-[800] text-white mb-6"
            >
              Have a Project in Mind?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[16px] lg:text-[18px] text-white/80 max-w-[500px] mb-10 leading-[1.6]"
            >
              Let’s build something exceptional together with precision, quality and complete transparency.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/contact" className="group relative inline-flex items-center justify-center px-10 py-5 bg-white text-[#062B55] font-[800] tracking-wide text-[14px] rounded-full overflow-hidden transition-all hover:scale-105">
                {/* Pulse Glow Effect (using pure CSS for the every-6s ping) */}
                <span className="absolute inset-0 rounded-full border-[3px] border-[#18AFFF] opacity-0 animate-[pulse-glow_6s_ease-out_infinite]"></span>
                <span className="relative z-10 flex items-center gap-2">
                  LET’S TALK
                  <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                </span>
              </Link>
            </motion.div>
          </div>
          
        </div>
        
        {/* Custom Keyframes for the button glow */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse-glow {
            0% { transform: scale(1); opacity: 0.8; }
            20% { transform: scale(1.3); opacity: 0; }
            100% { transform: scale(1.3); opacity: 0; }
          }
        `}} />
      </section>

    </main>
  );
}
