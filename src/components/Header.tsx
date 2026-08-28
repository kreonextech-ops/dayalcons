"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (current > previous && current > 100) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <header 
      className={`fixed left-0 right-0 z-50 w-full px-6 md:px-12 py-5 flex justify-between items-center transition-all duration-500 ease-in-out
        bg-[#062B55]/30 backdrop-blur-[24px] border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.15)]
        ${isVisible ? 'top-0 translate-y-0 opacity-100' : 'top-0 -translate-y-full opacity-0'}`}
      id="main-header"
    >
      <Link href="/" className="flex items-center gap-3">
        <img src="/images/logo-v2.png" alt="Dayal Constructions & Co. Logo" className="h-10 md:h-12 w-auto object-contain" />
        <div className="flex flex-col mt-1">
          <span className="font-['Plus_Jakarta_Sans',_sans-serif] text-[17px] md:text-[20px] font-[800] text-white leading-none tracking-tight">
            Dayal Constructions & Co.
          </span>
          <span className="text-[14px] md:text-[16px] text-white/90 leading-tight mt-0.5 text-center" style={{ fontFamily: "'Monotype Corsiva', 'Apple Chancery', cursive" }}>
            Born To Build
          </span>
        </div>
      </Link>
      <nav className="hidden md:flex gap-8 items-center text-sm font-bold text-white/90 uppercase tracking-widest">
        <Link className="hover:text-accent transition-colors drop-shadow-md" href="/">Home</Link>
        <Link className="hover:text-accent transition-colors drop-shadow-md" href="/services">Services</Link>
        <Link className="hover:text-accent transition-colors drop-shadow-md" href="/process">Our Process</Link>
        <Link className="hover:text-accent transition-colors drop-shadow-md" href="/projects">Projects</Link>
        <Link className="hover:text-accent transition-colors drop-shadow-md" href="/about">About</Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link className="hidden md:inline-flex items-center justify-center bg-accent text-white font-medium rounded-full px-6 py-2.5 transition-all duration-250 hover:bg-white hover:text-primary hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(22,181,255,0.3)] text-sm uppercase tracking-wider" href="/contact">
          Contact Us
        </Link>
        <button className="md:hidden text-white hover:text-accent transition-colors p-2">
          <span className="material-symbols-outlined text-3xl drop-shadow-md">menu</span>
        </button>
      </div>
    </header>
  );
}
