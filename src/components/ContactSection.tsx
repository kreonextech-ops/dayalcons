'use client';

import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const GBP_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3564.6932550036963!2d88.4109791!3d26.6902912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e443068c78db77%3A0x9740700f682e1132!2sDayal%20Constructions%20%26%20Co.!5e0!3m2!1sen!2sin!4v1724594100000!5m2!1sen!2sin";

export default function ContactSection() {

  return (
    <section className="w-full relative bg-[#F8FAFC] py-[80px] lg:py-[100px] overflow-hidden">
      
      {/* BACKGROUND LAYER */}
      <div id="CONTACT_BACKGROUND_LAYER" className="absolute inset-0 z-0 pointer-events-none">
        {/* Background image */}
        <img
          src="/images/contact-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Heavy white overlay so content stays legible */}
        <div className="absolute inset-0 bg-white/88"></div>
        {/* Soft top vignette */}
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-white/60 to-transparent"></div>
        {/* Soft bottom vignette */}
        <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-white/50 to-transparent"></div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* 3-COLUMN MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-8 xl:gap-12 justify-between items-start">
          
          {/* LEFT COLUMN: Text & Info */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="w-full lg:w-[28%] flex flex-col pt-4"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
              <div className="w-[20px] h-[2px] bg-[#1EA7FF]"></div>
              <span className="font-['Inter',_sans-serif] text-[12px] font-bold tracking-[2px] text-[#071A2F] uppercase">
                GET IN TOUCH
              </span>
            </motion.div>
            
            {/* Heading */}
            <motion.h2 variants={fadeUp} className="font-['Plus_Jakarta_Sans',_sans-serif] text-[56px] font-[800] leading-none tracking-tight text-[#071A2F] mb-4">
              Contact <span className="text-[#1EA7FF]">Us</span>
            </motion.h2>
            
            {/* Thin divider under heading */}
            <motion.div variants={fadeUp} className="w-[40px] h-[1px] bg-[#071A2F]/20 mb-6"></motion.div>
            
            {/* Description */}
            <motion.p variants={fadeUp} className="font-['Inter',_sans-serif] text-[15px] text-[#5B6472] leading-[1.6] mb-10 pr-4">
              Have a project in mind or need expert guidance? We'd love to hear from you. Let's build something extraordinary together.
            </motion.p>
            
            {/* Contact Rows */}
            <motion.div variants={staggerContainer} className="flex flex-col mb-10 w-full">
              {/* Phone */}
              <motion.div variants={fadeUp} className="flex items-start gap-4 py-4">
                <div className="w-[44px] h-[44px] rounded-[10px] bg-[#EBF4FA] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#071A2F] text-[20px]">call</span>
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[14px] font-bold text-[#071A2F] mb-0.5">Phone</span>
                  <span className="font-['Inter',_sans-serif] text-[14px] text-[#5B6472]">708 3333 000, 70030 70035</span>
                </div>
              </motion.div>
              
              <hr className="border-t border-[#E2E8F0]" />
              
              {/* Email */}
              <motion.div variants={fadeUp} className="flex items-start gap-4 py-4">
                <div className="w-[44px] h-[44px] rounded-[10px] bg-[#EBF4FA] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#071A2F] text-[20px]">mail</span>
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[14px] font-bold text-[#071A2F] mb-0.5">Email</span>
                  <a href="mailto:dayalconstruction.office@gmail.com" className="font-['Inter',_sans-serif] text-[14px] text-[#5B6472] hover:text-[#1EA7FF]">dayalconstruction.office@gmail.com</a>
                </div>
              </motion.div>
              
              <hr className="border-t border-[#E2E8F0]" />
              
              {/* Office Address */}
              <motion.div variants={fadeUp} className="flex items-start gap-4 py-4">
                <div className="w-[44px] h-[44px] rounded-[10px] bg-[#EBF4FA] flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#071A2F] text-[20px]">location_on</span>
                </div>
                <div className="flex flex-col pt-1">
                  <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[14px] font-bold text-[#071A2F] mb-0.5">Office Address</span>
                  <span className="font-['Inter',_sans-serif] text-[14px] text-[#5B6472] leading-[1.5]">
                    Dayal Constructions & Co.<br/>
                    Noukaghat Rd, opp. Uniliv Ikon, beside Makhan Prio Momo Ghor, Ward 31, More, Babupara, Siliguri, West Bengal 734005
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Social Icons */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              {['facebook', 'work', 'camera_alt', 'play_arrow'].map((icon, i) => (
                <a key={i} href="#" className="w-[36px] h-[36px] rounded-full bg-[#EBF4FA] flex items-center justify-center text-[#071A2F] hover:bg-[#1EA7FF] hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[16px]">{icon}</span>
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* CENTER COLUMN: Floating Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-[32%] bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-6 lg:p-8"
          >
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter',_sans-serif] text-[12px] font-semibold text-[#5B6472]">Your Name*</label>
                <input type="text" placeholder="Enter your name" className="w-full px-4 py-2.5 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] focus:outline-none focus:border-[#1EA7FF]" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter',_sans-serif] text-[12px] font-semibold text-[#5B6472]">Email Address*</label>
                <input type="email" placeholder="Enter your email" className="w-full px-4 py-2.5 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] focus:outline-none focus:border-[#1EA7FF]" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter',_sans-serif] text-[12px] font-semibold text-[#5B6472]">Phone Number</label>
                <input type="tel" placeholder="Enter your phone number" className="w-full px-4 py-2.5 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] focus:outline-none focus:border-[#1EA7FF]" />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-['Inter',_sans-serif] text-[12px] font-semibold text-[#5B6472]">Project Type</label>
                <select className="w-full px-4 py-2.5 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] text-[#8B95A5] focus:outline-none focus:border-[#1EA7FF] appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM1QjY0NzIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[length:20px_20px] bg-[position:right_12px_center] bg-no-repeat">
                  <option value="">Select project type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
              </div>
              
              <div className="flex flex-col gap-1.5 mb-2">
                <label className="font-['Inter',_sans-serif] text-[12px] font-semibold text-[#5B6472]">Your Message*</label>
                <textarea placeholder="Tell us about your project..." className="w-full px-4 py-2.5 rounded-[8px] bg-white border border-[#E2E8F0] text-[14px] focus:outline-none focus:border-[#1EA7FF] h-[100px] resize-none" />
              </div>

              <button type="button" className="w-full h-[48px] rounded-full bg-[#0062CC] text-white font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-[#0052AB] transition-colors">
                Send Message
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          </motion.div>

          {/* RIGHT COLUMN: Map & Office Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full lg:w-[40%] flex flex-col relative"
          >
            {/* Map Container */}
            <div className="w-full h-[520px] rounded-[24px] overflow-hidden relative shadow-sm border border-[#E2E8F0]">
              <iframe
                src={GBP_MAP_URL}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Dayal Constructions & Co. Location"
              ></iframe>
            </div>

            {/* Overlapping Dark Navy Card */}
            <div className="absolute -bottom-8 left-4 right-4 bg-[#0A192F] rounded-[20px] p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-20">
              <div className="flex items-center gap-4">
                <div className="w-[48px] h-[48px] rounded-full bg-[#0062CC] flex items-center justify-center flex-shrink-0">
                   <span className="material-symbols-outlined text-white">domain</span>
                </div>
                <div>
                  <p className="font-['Inter',_sans-serif] text-[12px] text-[#1EA7FF] font-semibold mb-0.5">Our Office</p>
                  <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-white mb-0.5">Dayal Constructions & Co.</h4>
                  <p className="font-['Inter',_sans-serif] text-[13px] text-white/70">Siliguri, West Bengal, India</p>
                </div>
              </div>
              <a 
                href="https://share.google/G5nGvNkWoWioUtOJA"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-[8px] border border-white/30 text-white font-['Inter',_sans-serif] text-[13px] hover:bg-white hover:text-[#0A192F] transition-all"
              >
                Get Directions
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>
          </motion.div>

        </div>

        {/* BOTTOM TRUST STRIP */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="w-full flex flex-wrap justify-between gap-8 pt-[80px]"
        >
          {[
            { icon: 'verified_user', title: 'Trusted Expertise', sub: '10+ Years of Experience' },
            { icon: 'architecture', title: 'Quality Assurance', sub: 'Premium Materials & Standards' },
            { icon: 'supervisor_account', title: 'Client Focused', sub: 'Personalized Solutions' },
            { icon: 'handshake', title: 'On-Time Delivery', sub: 'Commitment You Can Count On' }
          ].map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="flex items-center gap-4 group">
              <span className="material-symbols-outlined text-[#0062CC] text-[32px] font-light group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <div>
                <h5 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[15px] font-bold text-[#071A2F]">{item.title}</h5>
                <p className="font-['Inter',_sans-serif] text-[13px] text-[#5B6472]">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
