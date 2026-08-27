'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const footerContainer = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.12 },
  },
};

const columnVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const logoVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const slideLeftVariant = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Footer() {
  return (
    <motion.footer 
      className="w-full relative overflow-hidden bg-[#031A36] pt-0 min-h-[520px] lg:min-h-[600px] flex flex-col"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={footerContainer}
    >
      {/* Background Blueprint Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="/images/footer-blueprint.png" 
          alt="" 
          className="w-full h-full object-cover opacity-100" 
          onError={(e) => e.currentTarget.style.display = 'none'} 
        />
        {/* Overlay: Deep navy #031A36 at 82% */}
        <div className="absolute inset-0 bg-[#031A36]/82 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[#031A36]/82"></div>
        {/* Soft cyan glow top edge */}
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#1EA7FF]/10 to-transparent"></div>
      </div>

      {/* Top Divider */}
      <div className="relative z-10 w-full flex items-center justify-center h-[1px] bg-[#1EA7FF]/30">
        <div className="absolute flex gap-2">
          <div className="w-1 h-1 bg-[#1EA7FF]"></div>
          <div className="w-1 h-1 bg-[#1EA7FF]"></div>
          <div className="w-1 h-1 bg-[#1EA7FF]"></div>
        </div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-6 pt-20 pb-12 relative z-10 flex-1 flex flex-col justify-between">
        
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand Identity (Spans 4 columns) */}
          <motion.div variants={columnVariant} className="flex flex-col lg:col-span-4 lg:pr-8">
            <motion.div variants={logoVariant} className="mb-4">
              <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-2xl font-bold text-white tracking-tight">
                DAYAL <span className="text-[#1EA7FF]">CONSTRUCTIONS & CO.</span>
              </h2>
            </motion.div>
            
            <motion.p variants={fadeVariant} className="font-['Plus_Jakarta_Sans',_sans-serif] text-[15px] font-semibold text-white/90 mb-4 tracking-wide">
              Building Tomorrow. Inspiring Trust.
            </motion.p>
            
            <motion.p variants={fadeVariant} className="font-['Inter',_sans-serif] text-[14px] leading-relaxed text-[#C8D6E5]/70 mb-8 max-w-[280px]">
              Dayal Constructions & Co. delivers premium residential, commercial and industrial engineering solutions with precision, transparency and uncompromising quality across West Bengal and India.
            </motion.p>
            
            {/* Social Icons */}
            <motion.div 
              className="flex gap-3"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {/* Facebook */}
              <motion.a href="#" variants={fadeVariant} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 transition-all duration-300 hover:border-[#1EA7FF] hover:text-[#1EA7FF] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(30,167,255,0.3)] group bg-[#021524]/50">
                <svg className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </motion.a>
              {/* Instagram */}
              <motion.a href="#" variants={fadeVariant} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 transition-all duration-300 hover:border-[#1EA7FF] hover:text-[#1EA7FF] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(30,167,255,0.3)] group bg-[#021524]/50">
                <svg className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </motion.a>
              {/* LinkedIn */}
              <motion.a href="#" variants={fadeVariant} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 transition-all duration-300 hover:border-[#1EA7FF] hover:text-[#1EA7FF] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(30,167,255,0.3)] group bg-[#021524]/50">
                <svg className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </motion.a>
              {/* YouTube */}
              <motion.a href="#" variants={fadeVariant} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 transition-all duration-300 hover:border-[#1EA7FF] hover:text-[#1EA7FF] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(30,167,255,0.3)] group bg-[#021524]/50">
                <svg className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Column 2: Quick Navigation */}
          <motion.div variants={columnVariant} className="lg:col-span-2">
            <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-white mb-6 uppercase tracking-[2px]">Company</h4>
            <motion.ul 
              className="space-y-4"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {['Home', 'About', 'Projects', 'Services', 'Process', 'Contact'].map((item) => (
                <motion.li key={item} variants={slideLeftVariant}>
                  <Link href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="group relative font-['Inter',_sans-serif] text-[14px] text-[#C8D6E5]/80 hover:text-white transition-colors inline-block">
                    {item}
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#1EA7FF] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 3: Engineering Services */}
          <motion.div variants={columnVariant} className="lg:col-span-3">
            <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-white mb-6 uppercase tracking-[2px]">Core Services</h4>
            <motion.ul 
              className="space-y-4"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {[
                'Land Registration & Mutation',
                'Building Plan Approval',
                '2D–3D Floor Planning',
                'Structural Design',
                'Residential Construction',
                'Commercial Construction'
              ].map((service) => (
                <motion.li key={service} variants={slideLeftVariant}>
                  <Link href="#" className="group flex items-center font-['Inter',_sans-serif] text-[14px] text-[#C8D6E5]/80 hover:text-white transition-colors">
                    <span className="w-0 overflow-hidden opacity-0 -ml-2 group-hover:w-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#1EA7FF] font-bold">→</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{service}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div variants={columnVariant} className="flex flex-col lg:col-span-3">
            <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-white mb-6 uppercase tracking-[2px]">Contact</h4>
            
            <motion.ul className="space-y-5 mb-8" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white/60 text-[14px]">✆</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-[#C8D6E5]/60 mb-1 uppercase tracking-wider">Phone</span>
                  <span className="font-['Inter',_sans-serif] text-[14px] text-white">708 3333 000<br/>70030 70035</span>
                </div>
              </motion.li>
              
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white/60 text-[14px]">✉</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-[#C8D6E5]/60 mb-1 uppercase tracking-wider">Email</span>
                  <a href="mailto:dayalconstruction.office@gmail.com" className="font-['Inter',_sans-serif] text-[14px] text-white hover:text-[#1EA7FF] transition-colors break-all">dayalconstruction.office@gmail.com</a>
                </div>
              </motion.li>
              
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white/60 text-[14px]">⌖</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-[#C8D6E5]/60 mb-1 uppercase tracking-wider">Address</span>
                  <span className="font-['Inter',_sans-serif] text-[14px] text-white leading-relaxed">Noukaghat Rd, opp. Uniliv Ikon, beside Makhan Prio Momo Ghor, Ward 31, More, Babupara, Siliguri, West Bengal 734005</span>
                </div>
              </motion.li>
              
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white/60 text-[14px]">⌚</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-[#C8D6E5]/60 mb-1 uppercase tracking-wider">Working Hours</span>
                  <span className="font-['Inter',_sans-serif] text-[14px] text-white">Mon – Sat · 9:00 AM – 7:00 PM</span>
                </div>
              </motion.li>
            </motion.ul>

            <motion.button 
              variants={fadeVariant}
              className="group relative w-full lg:w-[240px] h-[52px] rounded-full border border-[#1EA7FF]/50 bg-transparent overflow-hidden transition-all duration-300 hover:border-[#1EA7FF]"
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(30,167,255,0.2)] animate-[pulse_4s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 bg-[#1EA7FF] w-0 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
              <div className="relative z-10 flex items-center justify-center gap-2 w-full h-full text-white font-['Plus_Jakarta_Sans',_sans-serif] text-[14px] font-bold">
                Request a Consultation
                <span className="transition-transform duration-300 group-hover:translate-x-[6px]">→</span>
              </div>
            </motion.button>
          </motion.div>
          
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-[#1EA7FF]/20 flex flex-col md:flex-row justify-between items-center gap-4 text-[#C8D6E5] text-[13px] font-['Inter',_sans-serif]">
          <p>© 2026 Dayal Constructions & Co. All Rights Reserved.</p>

          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}

