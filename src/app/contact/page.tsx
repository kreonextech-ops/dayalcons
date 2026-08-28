"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";

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

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success">("idle");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const headingWords = "Let’s Build Something Extraordinary.".split(" ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitting");
    setTimeout(() => {
      setFormStatus("success");
      setTimeout(() => setFormStatus("idle"), 3000);
    }, 1500);
  };

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
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Architectural Blueprint Desk" 
            className="w-full h-full object-cover"
          />
          {/* Dark navy overlay (60%) */}
          <div className="absolute inset-0 bg-[#062B55]/70 mix-blend-multiply"></div>
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
              CONTACT US
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
                  {word === "Extraordinary." ? (
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
              Whether you're planning a new home, commercial building, renovation or turnkey project, our team is ready to help you from concept to completion.
            </motion.p>

            {/* Quick Contact Pills */}
            <motion.div 
              initial="hidden" animate="visible" variants={staggerContainer}
              className="flex flex-wrap gap-3 mb-12"
            >
              <motion.div variants={fadeUp} className="flex flex-col p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] shadow-sm min-w-[140px]">
                <span className="material-symbols-outlined text-[#18AFFF] text-[20px] mb-2 font-light">call</span>
                <span className="text-[14px] font-bold text-white">Call Us</span>
                <span className="text-[12px] text-white/80 mt-1">+91 70030 70035</span>
              </motion.div>
              
              <motion.div variants={fadeUp} className="flex flex-col p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] shadow-sm min-w-[140px]">
                <span className="material-symbols-outlined text-[#18AFFF] text-[20px] mb-2 font-light">mail</span>
                <span className="text-[14px] font-bold text-white">Email Us</span>
                <span className="text-[12px] text-white/80 mt-1">dayalconstruction.office@gmail.com</span>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] shadow-sm min-w-[140px]">
                <span className="material-symbols-outlined text-[#18AFFF] text-[20px] mb-2 font-light">location_on</span>
                <span className="text-[14px] font-bold text-white">Siliguri,</span>
                <span className="text-[12px] text-white/80 mt-1">West Bengal</span>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-[16px] shadow-sm min-w-[140px]">
                <span className="material-symbols-outlined text-[#18AFFF] text-[20px] mb-2 font-light">schedule</span>
                <span className="text-[14px] font-bold text-white">Mon – Sat</span>
                <span className="text-[12px] text-white/80 mt-1">9:00 AM – 7:00 PM</span>
              </motion.div>
            </motion.div>

            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <a href="tel:7003070035" className="flex items-center justify-center gap-2 px-8 py-[18px] bg-[#18AFFF] text-white font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1 shadow-[0_10px_30px_rgba(24,175,255,0.25)]">
                <span className="material-symbols-outlined text-[18px]">call</span>
                CALL NOW
              </a>
              <a href="https://wa.me/917003070035" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-8 py-[18px] bg-white text-[#062B55] font-bold text-[16px] rounded-[16px] transition-transform duration-300 hover:-translate-y-1">
                <svg className="w-5 h-5 fill-[#25D366]" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .1 5.395.097 11.95c-.002 2.095.544 4.141 1.579 5.945L0 24l6.257-1.642a11.867 11.867 0 0 0 5.789 1.499h.005c6.552 0 11.947-5.396 11.95-11.95a11.82 11.82 0 0 0-3.537-8.453"/></svg>
                WHATSAPP US
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ======================================= */}
      {/* SECTION 2: GET IN TOUCH */}
      {/* ======================================= */}
      <section className="w-full py-[100px] lg:py-[120px] bg-white relative z-10 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="text-center mb-16">
            <motion.span variants={fadeUp} className="inline-block font-bold text-[12px] tracking-[0.2em] text-[#18AFFF] uppercase mb-4">
              START YOUR PROJECT
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-[36px] lg:text-[48px] font-[800] text-[#062B55] mb-6">
              Speak With Our Experts
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#475569] text-[16px] lg:text-[18px] leading-[1.7] max-w-[600px] mx-auto">
              Fill in your details and our engineering team will contact you within 24 hours.
            </motion.p>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left 40% - Contact Information */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer} className="w-full lg:w-[40%] flex flex-col gap-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                {/* Contact Cards */}
                <motion.div variants={fadeUp} className="p-6 rounded-[24px] bg-[#F8FBFE] border border-[#062B55]/5 transition-transform hover:-translate-y-1 shadow-[0_20px_60px_rgba(6,43,85,0.03)]">
                  <div className="w-12 h-12 rounded-full bg-[#18AFFF]/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[#18AFFF] font-light">phone_in_talk</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#062B55] mb-1">Phone</h3>
                  <p className="text-[15px] text-[#475569]">+91 70030 70035</p>
                </motion.div>

                <motion.div variants={fadeUp} className="p-6 rounded-[24px] bg-[#F8FBFE] border border-[#062B55]/5 transition-transform hover:-translate-y-1 shadow-[0_20px_60px_rgba(6,43,85,0.03)]">
                  <div className="w-12 h-12 rounded-full bg-[#18AFFF]/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[#18AFFF] font-light">mail</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#062B55] mb-1">Email</h3>
                  <a href="mailto:dayalconstruction.office@gmail.com" className="text-[14px] text-[#475569] hover:text-[#18AFFF] break-all">dayalconstruction.office@gmail.com</a>
                </motion.div>

                <motion.div variants={fadeUp} className="p-6 rounded-[24px] bg-[#F8FBFE] border border-[#062B55]/5 transition-transform hover:-translate-y-1 shadow-[0_20px_60px_rgba(6,43,85,0.03)]">
                  <div className="w-12 h-12 rounded-full bg-[#18AFFF]/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[#18AFFF] font-light">location_on</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#062B55] mb-1">Office</h3>
                  <p className="text-[14px] text-[#475569]">Noukaghat Rd, Siliguri, WB 734005</p>
                </motion.div>

                <motion.div variants={fadeUp} className="p-6 rounded-[24px] bg-[#F8FBFE] border border-[#062B55]/5 transition-transform hover:-translate-y-1 shadow-[0_20px_60px_rgba(6,43,85,0.03)]">
                  <div className="w-12 h-12 rounded-full bg-[#18AFFF]/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-[#18AFFF] font-light">schedule</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-[#062B55] mb-1">Working Hours</h3>
                  <p className="text-[14px] text-[#475569]">Monday – Saturday<br/>9:00 AM – 6:00 PM</p>
                </motion.div>
              </div>

              {/* Why Contact Us */}
              <motion.div variants={fadeUp} className="p-8 rounded-[24px] bg-[#062B55] text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 mix-blend-screen pointer-events-none">
                  <img src="/images/footer-blueprint.jpg" alt="Blueprint" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-[20px] font-bold mb-6 relative z-10">Why Contact Us?</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4 relative z-10">
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#18AFFF] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#18AFFF] text-[18px] font-light">forum</span>
                    </div>
                    <span className="text-[13px] font-medium text-white/90 leading-[1.3]">Free Consultation</span>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#18AFFF] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#18AFFF] text-[18px] font-light">receipt_long</span>
                    </div>
                    <span className="text-[13px] font-medium text-white/90 leading-[1.3]">Transparent Quotation</span>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#18AFFF] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#18AFFF] text-[18px] font-light">engineering</span>
                    </div>
                    <span className="text-[13px] font-medium text-white/90 leading-[1.3]">Site Visit Available</span>
                  </div>
                  <div className="flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-full border border-[#18AFFF] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#18AFFF] text-[18px] font-light">timeline</span>
                    </div>
                    <span className="text-[13px] font-medium text-white/90 leading-[1.3]">End-to-End Project Guidance</span>
                  </div>
                </div>
              </motion.div>

            </motion.div>

            {/* Right 60% - Premium Form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-100px" }}
              className="w-full lg:w-[60%]"
            >
              <div className="bg-[#F8FBFE]/80 backdrop-blur-xl border border-[#062B55]/10 p-8 lg:p-12 rounded-[32px] shadow-[0_20px_60px_rgba(6,43,85,0.05)] relative">
                {formStatus === "success" ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-[#18AFFF]/10 rounded-full flex items-center justify-center mb-6 text-[#18AFFF]">
                      <span className="material-symbols-outlined text-[40px]">check_circle</span>
                    </div>
                    <h3 className="text-[28px] font-[800] text-[#062B55] mb-4">Request Received</h3>
                    <p className="text-[#475569] text-[16px]">Thank you for reaching out. One of our engineers will contact you shortly.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="text-[13px] font-bold text-[#062B55] mb-2 block">Full Name</label>
                        <input type="text" required className="w-full bg-white border border-[#E2E8F0] rounded-[16px] px-5 py-4 outline-none transition-all focus:border-[#18AFFF] focus:ring-4 focus:ring-[#18AFFF]/10 hover:border-[#CBD5E1]" placeholder="John Doe" />
                      </div>
                      <div className="relative group">
                        <label className="text-[13px] font-bold text-[#062B55] mb-2 block">Phone Number *</label>
                        <input type="tel" required className="w-full bg-white border border-[#E2E8F0] rounded-[16px] px-5 py-4 outline-none transition-all focus:border-[#18AFFF] focus:ring-4 focus:ring-[#18AFFF]/10 hover:border-[#CBD5E1]" placeholder="+91 00000 00000" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="text-[13px] font-bold text-[#062B55] mb-2 block">Email Address</label>
                        <input type="email" className="w-full bg-white border border-[#E2E8F0] rounded-[16px] px-5 py-4 outline-none transition-all focus:border-[#18AFFF] focus:ring-4 focus:ring-[#18AFFF]/10 hover:border-[#CBD5E1]" placeholder="john@example.com" />
                      </div>
                      <div className="relative group">
                        <label className="text-[13px] font-bold text-[#062B55] mb-2 block">Project Type</label>
                        <div className="relative">
                          <select className="w-full bg-white border border-[#E2E8F0] rounded-[16px] px-5 py-4 appearance-none outline-none transition-all focus:border-[#18AFFF] focus:ring-4 focus:ring-[#18AFFF]/10 hover:border-[#CBD5E1] text-[#475569]">
                            <option value="">Select project type</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Industrial">Industrial</option>
                            <option value="Renovation">Renovation</option>
                            <option value="Turnkey">Turnkey</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">expand_more</span>
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="text-[13px] font-bold text-[#062B55] mb-2 block">Location</label>
                      <input type="text" className="w-full bg-white border border-[#E2E8F0] rounded-[16px] px-5 py-4 outline-none transition-all focus:border-[#18AFFF] focus:ring-4 focus:ring-[#18AFFF]/10 hover:border-[#CBD5E1]" placeholder="City, State" />
                    </div>

                    <div className="relative group">
                      <label className="text-[13px] font-bold text-[#062B55] mb-2 block">Message</label>
                      <textarea rows={4} className="w-full bg-white border border-[#E2E8F0] rounded-[16px] px-5 py-4 outline-none transition-all focus:border-[#18AFFF] focus:ring-4 focus:ring-[#18AFFF]/10 hover:border-[#CBD5E1] resize-none" placeholder="Tell us about your project requirements..."></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={formStatus === "submitting"}
                      className="w-full py-[20px] bg-gradient-to-r from-[#0F5EFF] to-[#18AFFF] text-white font-[800] tracking-wide text-[16px] rounded-[16px] transition-all hover:shadow-[0_15px_30px_rgba(24,175,255,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                      {formStatus === "submitting" ? (
                        <span className="material-symbols-outlined animate-spin">progress_activity</span>
                      ) : (
                        <>
                          REQUEST FREE CONSULTATION
                          <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 mt-6 text-[#64748B] text-[13px] font-medium">
                      <span className="material-symbols-outlined text-[16px]">verified_user</span>
                      We usually respond within <strong className="text-[#062B55]">24 working hours</strong>.
                    </div>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* SECTION 3: VISIT OUR OFFICE */}
      {/* ======================================= */}
      <section className="w-full py-[100px] bg-[#F8FBFE]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          
          <div className="mb-10 text-center lg:text-left">
            <span className="inline-block font-bold text-[12px] tracking-[0.2em] text-[#18AFFF] uppercase mb-2">
              VISIT OUR OFFICE
            </span>
            <h2 className="text-[36px] font-[800] text-[#062B55]">
              Find Us Easily
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Map */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} viewport={{ once: true }} className="w-full lg:w-[65%] h-[400px] lg:h-[500px] rounded-[28px] overflow-hidden border border-[#062B55]/10 shadow-[0_20px_60px_rgba(6,43,85,0.05)] relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.6932550036963!2d88.4109791!3d26.6902912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e443068c78db77%3A0x9740700f682e1132!2sDayal%20Constructions%20%26%20Co.!5e0!3m2!1sen!2sin!4v1724594100000!5m2!1sen!2sin" 
                className="w-full h-full border-0" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            {/* Right: Premium Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="w-full lg:w-[35%] bg-white rounded-[28px] p-8 lg:p-12 border border-[#E2E8F0] shadow-[0_20px_60px_rgba(6,43,85,0.05)] flex flex-col">
              <h3 className="text-[24px] font-[800] text-[#062B55] mb-2">Dayal Construction & Co.</h3>
              <p className="text-[#475569] text-[15px] mb-8 leading-relaxed">Noukaghat Rd, opp. Uniliv Ikon, beside Makhan Prio Momo Ghor, Ward 31, More, Babupara, Siliguri, West Bengal 734005</p>

              <div className="space-y-6 flex-grow">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#18AFFF] font-light">call</span>
                  <div>
                    <span className="block text-[13px] text-[#94A3B8] font-bold uppercase tracking-wider mb-1">Contact</span>
                    <a href="tel:7003070035" className="text-[15px] font-bold text-[#062B55] hover:text-[#18AFFF] transition-colors">+91 70030 70035</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#18AFFF] font-light">mail</span>
                  <div>
                    <span className="block text-[13px] text-[#94A3B8] font-bold uppercase tracking-wider mb-1">Email</span>
                    <a href="mailto:dayalconstruction.office@gmail.com" className="text-[15px] font-bold text-[#062B55] hover:text-[#18AFFF] transition-colors">dayalconstruction.office@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-[#18AFFF] font-light">schedule</span>
                  <div>
                    <span className="block text-[13px] text-[#94A3B8] font-bold uppercase tracking-wider mb-1">Working Hours</span>
                    <span className="text-[15px] font-bold text-[#062B55] block">Mon – Sat</span>
                    <span className="text-[14px] text-[#475569]">9:00 AM – 6:00 PM</span>
                  </div>
                </div>
              </div>

              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="mt-8 w-full py-[16px] bg-transparent border-2 border-[#062B55]/10 text-[#062B55] font-[800] text-[14px] rounded-[16px] transition-all duration-300 hover:border-[#18AFFF] hover:bg-[#18AFFF] hover:text-white flex items-center justify-center gap-2">
                GET DIRECTIONS
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ======================================= */}
      {/* SECTION 4: TRUST CTA BANNER */}
      {/* ======================================= */}
      <section className="w-full py-[100px] lg:py-[120px] bg-white relative z-10 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#062B55] to-[#0A3B73] shadow-[0_20px_60px_rgba(6,43,85,0.15)] flex flex-col lg:flex-row items-center p-10 lg:p-20">
          
          {/* Animated Blueprint Illustration */}
          <div className="absolute top-0 left-0 w-full lg:w-[60%] h-full opacity-20 pointer-events-none mix-blend-screen">
            <motion.img 
              animate={{ x: [0, -20, 0], y: [0, 10, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              src="/images/footer-blueprint.jpg" 
              alt="Blueprint" 
              className="w-[150%] h-[150%] object-cover origin-center"
              onError={(e) => e.currentTarget.style.display='none'}
            />
          </div>
          
          {/* Cyan Glow */}
          <div className="absolute top-1/2 left-[20%] w-[400px] h-[400px] bg-[#18AFFF] rounded-full blur-[120px] opacity-20 pointer-events-none transform -translate-y-1/2"></div>

          <div className="w-full lg:w-2/3 relative z-10 text-center lg:text-left mb-10 lg:mb-0 pr-0 lg:pr-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="text-[32px] md:text-[40px] lg:text-[48px] font-[800] text-white mb-6 leading-[1.2]"
            >
              Your Dream Project Starts With One Conversation.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[16px] lg:text-[18px] text-white/80 max-w-[600px] leading-[1.6]"
            >
              From planning and approvals to construction and interiors, we’re ready to bring your vision to life.
            </motion.p>
          </div>
          
          <div className="w-full lg:w-1/3 relative z-10 flex justify-center lg:justify-end">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
              <Link href="/contact" className="group relative inline-flex items-center justify-center px-8 lg:px-10 py-[20px] bg-white text-[#062B55] font-[800] tracking-wide text-[14px] rounded-full overflow-hidden transition-all hover:scale-105">
                {/* Pulse Glow Effect */}
                <span className="absolute inset-0 rounded-full border-[3px] border-[#18AFFF] opacity-0 animate-[pulse-glow_6s_ease-out_infinite]"></span>
                <span className="relative z-10 flex items-center gap-2">
                  BOOK A FREE CONSULTATION
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


