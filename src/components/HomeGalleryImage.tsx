"use client";
import { useState } from "react";

export default function HomeGalleryImage({ img, idx }: { img: string; idx: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const src = `https://pub-00d1d73a43a643edb96c64ca062ab6df.r2.dev/website/images/project/${img}`;

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group relative rounded-3xl overflow-hidden aspect-[4/5] premium-shadow hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-accent cursor-pointer"
      >
        <img 
          alt={`Featured Project ${idx + 1}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          src={src}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex justify-end items-end w-full h-full">
            <div className="w-12 h-12 rounded-full bg-deep-navy/80 backdrop-blur flex items-center justify-center text-white bg-accent transition-colors">
               <span className="material-symbols-outlined">zoom_in</span>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setIsOpen(false)}
        >
          <img 
            src={src} 
            alt={`Featured Project ${idx + 1} Expanded`} 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()} 
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-3xl transition-colors"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
