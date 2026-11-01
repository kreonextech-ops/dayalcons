"use client";

import { motion } from "framer-motion";

export default function FloatingActions() {
  const phoneNumber = "917003070035";
  const message = encodeURIComponent("Hello Dayal Constructions & Co., I would like to know more about your services.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
  const callUrl = `tel:+917003070035`;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] flex flex-col items-center gap-3">
      {/* 1. Phone Call Floating Button */}
      <motion.a
        href={callUrl}
        aria-label="Call Dayal Constructions & Co."
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#18AFFF] text-white rounded-full shadow-[0_8px_25px_rgba(24,175,255,0.45)] hover:shadow-[0_12px_35px_rgba(24,175,255,0.6)] transition-all group"
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#18AFFF] opacity-0 animate-ping"></div>

        {/* Call Phone SVG Icon */}
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-2.2 2.2a15.053 15.053 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1.01A11.36 11.36 0 018.57 3.92c0-.55-.45-1-1-1H4.02c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 17.02 17.02.55 0 1-.45 1-1v-3.56c0-.55-.45-1-1.03-1z" />
        </svg>

        {/* Tooltip */}
        <span className="hidden sm:block absolute right-[68px] bg-white text-[#071A2F] px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-[#E2E8F0]">
          Call Now
        </span>
      </motion.a>

      {/* 2. WhatsApp Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Dayal Constructions on WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_15px_40px_rgba(37,211,102,0.6)] transition-all group"
      >
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-0 animate-ping"></div>

        {/* WhatsApp SVG Icon */}
        <svg
          className="w-6 h-6 sm:w-7 sm:h-7 relative z-10"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>

        {/* Tooltip */}
        <span className="hidden sm:block absolute right-[68px] bg-white text-[#082C5C] px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-lg opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border border-[#E2E8F0]">
          WhatsApp
        </span>
      </motion.a>
    </div>
  );
}
