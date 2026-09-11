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
      className="w-full relative overflow-hidden bg-gray-50 pt-0 min-h-[520px] lg:min-h-[600px] flex flex-col"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={footerContainer}
    >
      {/* Background Blueprint Layer (Light Theme) */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-white">
        <img 
          src="/images/footer-blueprint.jpg" 
          alt="" 
          className="w-full h-full object-cover opacity-20 invert grayscale mix-blend-multiply" 
          onError={(e) => e.currentTarget.style.display = 'none'} 
        />
        {/* Overlays to make it subtle and clean */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
        <div className="absolute inset-0 bg-white/40"></div>
        {/* Soft blue glow top edge */}
        <div className="absolute top-0 left-0 w-full h-[100px] bg-gradient-to-b from-[#2563EB]/5 to-transparent"></div>
      </div>

      {/* Top Divider */}
      <div className="relative z-10 w-full flex items-center justify-center h-[1px] bg-gray-200">
        <div className="absolute flex gap-2">
          <div className="w-1 h-1 bg-[#1EA7FF]"></div>
          <div className="w-1 h-1 bg-[#1EA7FF]"></div>
          <div className="w-1 h-1 bg-[#1EA7FF]"></div>
        </div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-6 pt-20 pb-12 relative z-10 flex-1 flex flex-col justify-between">
        
        {/* Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-10">
          
          {/* Column 1: Brand Identity (Spans 4 columns) */}
          <motion.div variants={columnVariant} className="flex flex-col lg:col-span-4 lg:pr-8">
            <motion.div variants={logoVariant} className="mb-6 flex items-center gap-4">
              <img src="/images/logo-v2.png" alt="Dayal Constructions & Co. Logo" className="h-16 md:h-20 w-auto object-contain" />
              <div className="flex flex-col mt-1">
                <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[20px] md:text-[24px] font-[800] text-[#071A2F] leading-none tracking-tight">
                  Dayal Constructions & Co.
                </span>
                <span className="text-[16px] md:text-[18px] text-gray-700 leading-tight mt-1 text-center" style={{ fontFamily: "'Monotype Corsiva', 'Apple Chancery', cursive" }}>
                  Born To Build
                </span>
              </div>
            </motion.div>
            
            <motion.p variants={fadeVariant} className="font-['Plus_Jakarta_Sans',_sans-serif] text-[15px] font-semibold text-gray-700 mb-4 tracking-wide">
              Building Tomorrow. Inspiring Trust.
            </motion.p>
            
            <motion.p variants={fadeVariant} className="font-['Inter',_sans-serif] text-[14px] leading-relaxed text-gray-600 mb-8 max-w-[280px]">
              Dayal Constructions & Co. delivers premium residential, commercial and industrial engineering solutions with precision, transparency and uncompromising quality across West Bengal and India.
            </motion.p>
            
            {/* Social Icons */}
            <motion.div 
              className="flex gap-3"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {/* Facebook */}
              <motion.a href="https://www.facebook.com/dayalconstructionssiliguri/" target="_blank" rel="noopener noreferrer" variants={fadeVariant} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-all duration-300 hover:border-[#1EA7FF] hover:text-[#2563EB] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(30,167,255,0.3)] group bg-white">
                <svg className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </motion.a>
              {/* Instagram */}
              <motion.a href="https://www.instagram.com/dayal.constructions.official/" target="_blank" rel="noopener noreferrer" variants={fadeVariant} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 transition-all duration-300 hover:border-[#1EA7FF] hover:text-[#2563EB] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(30,167,255,0.3)] group bg-white">
                <svg className="w-4 h-4 fill-current opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Column 2: Quick Navigation */}
          <motion.div variants={columnVariant} className="lg:col-span-2">
            <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-[#071A2F] mb-6 uppercase tracking-[2px]">Company</h4>
            <motion.ul 
              className="space-y-4"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {['Home', 'About', 'Projects', 'Services', 'Process', 'Contact'].map((item) => (
                <motion.li key={item} variants={slideLeftVariant}>
                  <Link href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`} className="group relative font-['Inter',_sans-serif] text-[14px] text-gray-600 hover:text-[#071A2F] transition-colors inline-block">
                    {item}
                    <span className="absolute left-0 bottom-[-2px] w-0 h-[1px] bg-[#1EA7FF] transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 3: Engineering Services */}
          <motion.div variants={columnVariant} className="lg:col-span-3">
            <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-[#071A2F] mb-6 uppercase tracking-[2px]">Core Services</h4>
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
                  <Link href="#" className="group flex items-center font-['Inter',_sans-serif] text-[14px] text-gray-600 hover:text-[#071A2F] transition-colors">
                    <span className="w-0 overflow-hidden opacity-0 -ml-2 group-hover:w-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#2563EB] font-bold">→</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{service}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Column 4: Contact */}
          <motion.div variants={columnVariant} className="flex flex-col lg:col-span-3">
            <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[16px] font-bold text-[#071A2F] mb-6 uppercase tracking-[2px]">Contact</h4>
            
            <motion.ul className="space-y-4 mb-6" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-gray-500 text-[14px]">✆</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-gray-500 mb-1 uppercase tracking-wider">Phone</span>
                  <span className="font-['Inter',_sans-serif] text-[14px] text-[#071A2F]">708 3333 000<br/>70030 70035</span>
                </div>
              </motion.li>
              
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-gray-500 text-[14px]">✉</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-gray-500 mb-1 uppercase tracking-wider">Email</span>
                  <a href="mailto:info@dayalconstructions.com" className="font-['Inter',_sans-serif] text-[14px] text-[#071A2F] hover:text-[#2563EB] transition-colors break-all">info@dayalconstructions.com</a>
                  <a href="mailto:dayalconstruction.office@gmail.com" className="font-['Inter',_sans-serif] text-[14px] text-[#071A2F] hover:text-[#2563EB] transition-colors break-all">dayalconstruction.office@gmail.com</a>
                </div>
              </motion.li>
              
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-gray-500 text-[14px]">support_agent</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-gray-500 mb-1 uppercase tracking-wider">Support</span>
                  <a href="tel:9749327676" className="font-['Inter',_sans-serif] text-[14px] text-[#071A2F] hover:text-[#2563EB] transition-colors">+91 97493 27676</a>
                  <a href="mailto:support@dayalconstructions.com" className="font-['Inter',_sans-serif] text-[14px] text-[#071A2F] hover:text-[#2563EB] transition-colors break-all">support@dayalconstructions.com</a>
                </div>
              </motion.li>
              
              <motion.li variants={slideLeftVariant} className="flex gap-4">
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-gray-500 text-[14px]">⌖</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-['Inter',_sans-serif] text-[12px] text-gray-500 mb-1 uppercase tracking-wider">Address</span>
                  <span className="font-['Inter',_sans-serif] text-[14px] text-[#071A2F] leading-relaxed">Noukaghat Rd, opp. Uniliv Ikon, beside Makhan Prio Momo Ghor, Ward 31, More, Babupara, Siliguri, West Bengal 734005</span>
                </div>
              </motion.li>
              
            </motion.ul>

            <motion.button 
              variants={fadeVariant}
              className="group relative w-full lg:w-[240px] h-[52px] rounded-full border border-[#1EA7FF]/50 bg-transparent overflow-hidden transition-all duration-300 hover:border-[#1EA7FF]"
            >
              <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(30,167,255,0.2)] animate-[pulse_4s_ease-in-out_infinite]"></div>
              <div className="absolute inset-0 bg-[#1EA7FF] w-0 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
              <div className="relative z-10 flex items-center justify-center gap-2 w-full h-full text-[#071A2F] font-['Plus_Jakarta_Sans',_sans-serif] text-[14px] font-bold">
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
            <Link href="/privacy-policy" className="hover:text-[#071A2F] transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#071A2F] transition-colors">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </motion.footer>
  );
}

