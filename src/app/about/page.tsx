'use client';

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Us | Dayal Constructions & Co.",
  description: "Learn about Dayal Constructions & Co. — over two decades of trusted construction in Siliguri. Meet our team, our story, and our mission to deliver engineering excellence across West Bengal.",
  alternates: { canonical: "https://dayalconstructions.in/about" },
  openGraph: { url: "https://dayalconstructions.in/about", title: "About Us | Dayal Constructions & Co." },
};


import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <main ref={containerRef} className="bg-white min-h-screen relative overflow-hidden font-['Manrope',_sans-serif] text-[#062B55]">
      {/* Background Subtle Blueprint Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-5 bg-[url('/images/footer-blueprint.jpg')] bg-repeat bg-[length:400px_400px] grayscale invert"></div>
      
      <HeroSection />
      
      <div className="relative z-10 space-y-[120px] pb-[120px] bg-white">
        <AboutIntro />
        <MissionVision />
        <FounderSection />
        <WhyChooseUs />
        <OurTeam />
        <PartneredBrands />
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

  const scaleVideo = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const words = "Born to Build. Driven by Trust.".split(" ");

  return (
    <section ref={ref} className="relative w-full h-[100vh] min-h-[800px] flex items-center overflow-hidden">
      {/* Background Video (pinned naturally by the structure, scaled) */}
      <motion.div 
        className="absolute inset-0 z-0 origin-center"
        style={{ scale: scaleVideo }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <img 
          src="/images/about-hero.jpg"
          alt="Dayal Construction Hero"
          className="w-full h-full object-cover"
        />
        {/* Dark navy overlay (60%) */}
        <div className="absolute inset-0 bg-[#062B55]/60"></div>
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-24"
        style={{ y: yContent, opacity: opacityContent }}
      >
        <div className="max-w-[800px]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 font-semibold text-[13px] tracking-[4px] text-[#18AFFF] uppercase"
          >
            ABOUT DAYAL CONSTRUCTION
          </motion.div>
          
          <h1 className="font-['Manrope',_sans-serif] text-[56px] md:text-[80px] lg:text-[100px] font-[800] leading-[1.05] text-white mb-8 flex flex-wrap gap-x-4">
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.4 + (i * 0.1), ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-[18px] md:text-[22px] font-[500] text-white/90 leading-[1.6] mb-12 max-w-[650px]"
          >
            Dayal Construction & Co. delivers premium residential, commercial and industrial engineering with precision, transparency and uncompromising quality.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Link href="/projects" className="inline-flex items-center justify-center px-8 py-[18px] bg-[#18AFFF] text-white font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1">
              Our Projects
            </Link>
            <Link href="/contact" className="inline-flex items-center justify-center px-8 py-[18px] bg-white text-[#062B55] font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1">
              Contact Us
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

// ==============================
// 2. ABOUT INTRODUCTION
// ==============================
function AboutIntro() {
  return (
    <section className="pt-[120px] relative px-6 md:px-12">
      <div className="absolute inset-0 bg-[url('/images/footer-blueprint.jpg')] opacity-5 bg-repeat bg-center grayscale invert pointer-events-none mix-blend-multiply"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto text-center flex flex-col items-center relative z-10"
      >
        <div className="w-[40px] h-[2px] bg-[#18AFFF] mb-6"></div>
        <h2 className="text-[40px] md:text-[56px] font-[800] text-[#062B55] mb-8">About Us</h2>
        <p className="text-[18px] md:text-[24px] font-[500] leading-[1.6] text-[#062B55]/80 max-w-[760px]">
          Dayal Construction & Co. envisions a future where our multidimensional expertise as a builder, interior & exterior design specialist, and developer converges to redefine the landscape of living spaces.
        </p>
      </motion.div>
    </section>
  );
}

// ==============================
// 3. MISSION & VISION
// ==============================
function MissionVision() {
  return (
    <section className="px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mission */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-[28px] p-10 md:p-14 shadow-[0_12px_40px_rgba(6,43,85,0.06)] transition-transform duration-500 hover:-translate-y-2 border border-[#062B55]/5"
        >
          <div className="w-[72px] h-[72px] rounded-full border-2 border-[#18AFFF] flex items-center justify-center mb-8 bg-[#18AFFF]/5">
            <span className="material-symbols-outlined text-[32px] text-[#18AFFF]">target</span>
          </div>
          <h3 className="text-[32px] font-[800] text-[#062B55] mb-6">Mission</h3>
          <p className="text-[18px] font-[500] leading-[1.7] text-[#062B55]/70">
            Our mission is to create exceptional spaces that enrich lives and communities. We strive to achieve this by delivering innovative and sustainable construction solutions that surpass expectations. We value integrity, professionalism, and collaboration, placing our clients at the center of everything we do.
          </p>
        </motion.div>

        {/* Vision */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="bg-white rounded-[28px] p-10 md:p-14 shadow-[0_12px_40px_rgba(6,43,85,0.06)] transition-transform duration-500 hover:-translate-y-2 border border-[#062B55]/5"
        >
          <div className="w-[72px] h-[72px] rounded-full border-2 border-[#18AFFF] flex items-center justify-center mb-8 bg-[#18AFFF]/5">
            <span className="material-symbols-outlined text-[32px] text-[#18AFFF]">visibility</span>
          </div>
          <h3 className="text-[32px] font-[800] text-[#062B55] mb-6">Vision</h3>
          <p className="text-[18px] font-[500] leading-[1.7] text-[#062B55]/70">
            Our vision is to continuously inspire and elevate lifestyles through innovative construction, creating enduring spaces that reflect our passion for excellence in every facet of the built environment.
          </p>
        </motion.div>

      </div>
    </section>
  );
}

// ==============================
// 4. MEET THE FOUNDER
// ==============================
function FounderSection() {
  const textContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const textItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="px-6 md:px-12 relative">
      {/* Background blueprint faint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[url('/images/footer-blueprint.jpg')] opacity-[0.03] bg-repeat grayscale invert mix-blend-multiply pointer-events-none"></div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full aspect-[4/5] max-h-[700px] relative rounded-[32px] overflow-hidden shadow-[0_24px_60px_rgba(6,43,85,0.12)]"
        >
          <img 
            src="/images/founder.jpg" // Fallback to provided image
            alt="Atanu Roy - Founder"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Right: Content */}
        <motion.div 
          variants={textContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col"
        >
          <motion.span variants={textItem} className="font-semibold text-[13px] tracking-[4px] text-[#18AFFF] uppercase mb-4">
            MEET THE VISION
          </motion.span>
          <motion.h2 variants={textItem} className="text-[48px] md:text-[64px] font-[800] text-[#062B55] leading-[1.1] mb-2">
            Atanu Roy
          </motion.h2>
          <motion.h4 variants={textItem} className="text-[20px] font-[700] text-[#062B55]/60 mb-8">
            Managing Director & Founder
          </motion.h4>
          
          <motion.p variants={textItem} className="text-[18px] font-[500] leading-[1.7] text-[#062B55]/80 mb-10">
            Founded in 2008, Dayal Constructions & Co. has grown with a simple belief - to deliver excellence with honesty, transparency and a commitment to quality.
          </motion.p>

          <motion.div variants={textItem} className="pl-6 border-l-[3px] border-[#18AFFF] py-2 relative">
            <div className="absolute top-0 left-4 text-[#18AFFF]/10 text-[80px] font-serif leading-none -mt-4">"</div>
            <p className="text-[24px] md:text-[28px] font-[700] italic text-[#062B55] leading-[1.4] relative z-10">
              We don't just construct buildings; we build lasting trust.
            </p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

// ==============================
// 5. WHY CHOOSE US
// ==============================
function WhyChooseUs() {
  const features = [
    { icon: 'emoji_events', title: 'Proven Track Record' },
    { icon: 'domain', title: 'Comprehensive Expertise' },
    { icon: 'eco', title: 'Sustainability Focus' },
    { icon: 'handshake', title: 'Client-Centric Approach' },
    { icon: 'lightbulb', title: 'Innovation & Modern Design' },
    { icon: 'health_and_safety', title: 'Safety Priority' }
  ];

  const gridVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="px-6 md:px-12 bg-[#F9FAFC] py-[120px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[40px] md:text-[56px] font-[800] text-[#062B55]">Why Choose Us?</h2>
        </div>
        
        <motion.div 
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((item, i) => (
            <motion.div 
              key={i}
              variants={cardVariants}
              className="group bg-white border border-[#062B55]/5 rounded-[28px] p-8 shadow-[0_8px_24px_rgba(6,43,85,0.03)] hover:shadow-[0_20px_48px_rgba(24,175,255,0.1)] hover:border-[#18AFFF]/30 transition-all duration-300"
            >
              <div className="w-[60px] h-[60px] rounded-[16px] bg-[#18AFFF]/10 flex items-center justify-center mb-6 text-[#18AFFF] transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110">
                <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
              </div>
              <h4 className="text-[22px] font-[700] text-[#062B55] mb-3">{item.title}</h4>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ==============================
// 6. OUR TEAM
// ==============================
function OurTeam() {
  const teamItems = [
    { icon: 'engineering', title: 'Technical Precision', desc: 'Detailed planning and accurate execution using best practices and modern methods.' },
    { icon: 'verified', title: 'Quality Assurance', desc: 'Strict quality checks at every stage to ensure durability, strength and safety.' },
    { icon: 'groups', title: 'Site Supervision', desc: 'Continuous on-site supervision for smooth progress and zero compromises.' },
    { icon: 'schedule', title: 'Timely Execution', desc: 'Efficient coordination and proactive planning to deliver projects on time, every time.' }
  ];

  return (
    <section className="px-6 md:px-12 py-[60px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[40px] md:text-[56px] font-[800] text-[#062B55] mb-4">Our Team</h2>
          <p className="text-[18px] text-[#062B55]/70 max-w-[600px] mx-auto font-[500]">
            Built on Expertise. Driven by Commitment. Behind every successful project is a dedicated team that plans, supervises and delivers with precision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="bg-white border border-[#062B55]/10 rounded-[28px] p-8 text-center flex flex-col items-center hover:shadow-[0_12px_40px_rgba(6,43,85,0.08)] transition-shadow duration-300"
            >
              <div className="w-[64px] h-[64px] rounded-full border border-[#18AFFF] text-[#18AFFF] flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">{item.icon}</span>
              </div>
              <h4 className="text-[20px] font-[700] text-[#062B55] mb-3">{item.title}</h4>
              <p className="text-[15px] font-[500] text-[#062B55]/70 leading-[1.6]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==============================
// 7. PARTNERED BRANDS
// ==============================
function PartneredBrands() {
  const rows = [
    { dir: 'animate-marquee-right', images: [1,2,3,4,5,6,7,8,9,10,11,12] },
    { dir: 'animate-marquee-left', images: [13,14,15,16,17,18,19,20,21,22,23,24] },
    { dir: 'animate-marquee-right', images: [25,26,27,28,29,30,31,32,33,1,2,3] }
  ];

  return (
    <section className="py-[100px] overflow-hidden bg-white">
      <div className="text-center mb-16 px-6">
        <h2 className="text-[32px] md:text-[48px] font-[800] text-[#062B55] mb-4">Partnered Brands</h2>
        <p className="text-[18px] text-[#062B55]/70 max-w-[600px] mx-auto font-[500]">
          We collaborate with trusted and leading brands to deliver quality, reliability, and excellence.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex whitespace-nowrap overflow-hidden group">
            <div className={`flex gap-6 px-3 will-change-transform ${row.dir} group-hover:[animation-play-state:paused]`}>
              {[...row.images, ...row.images].map((imgNum, i) => (
                <div 
                  key={i} 
                  className="w-[200px] h-[100px] bg-white border border-[#062B55]/10 rounded-[18px] flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(6,43,85,0.06)]"
                >
                  <img 
                    src={`/images/brands/brand-${imgNum}.jpeg`} 
                    alt={`Partner brand ${imgNum}`} 
                    className="max-w-[140px] max-h-[60px] object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
        }
      `}} />
    </section>
  );
}

// ==============================
// 8. CTA SECTION
// ==============================
function CTASection() {
  const sentence = "Let’s Build Something Extraordinary.";
  
  return (
    <section className="px-6 md:px-12 py-[120px] relative bg-white">
      {/* Background blueprint city skyline */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-[url('/images/contact-bg.jpg')] opacity-10 bg-cover bg-bottom mix-blend-multiply pointer-events-none filter grayscale"></div>
      
      <div className="max-w-[1000px] mx-auto text-center relative z-10">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-[40px] md:text-[64px] font-[800] text-[#062B55] mb-6 flex flex-wrap justify-center gap-x-[12px]"
        >
          {sentence.split(" ").map((word, i) => (
            <div key={i} className="flex overflow-hidden">
              {word.split("").map((char, j) => (
                <motion.span
                  key={j}
                  variants={{
                    hidden: { y: "100%", opacity: 0 },
                    visible: { y: "0%", opacity: 1 }
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (i * 5 + j) * 0.03 }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </div>
          ))}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-[20px] md:text-[24px] text-[#062B55]/70 max-w-[700px] mx-auto mb-12 font-[500] leading-[1.6]"
        >
          Your vision deserves engineering precision, premium craftsmanship, and a team that delivers beyond expectations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 2.0 }} // Reveals and glows after 2s
        >
          <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-[#18AFFF] text-white font-bold text-[18px] rounded-[20px] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_40px_rgba(24,175,255,0.4)] relative overflow-hidden group">
            <span className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
            <span className="relative z-10">Start Your Project</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

