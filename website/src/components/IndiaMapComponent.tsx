"use client";
import { useEffect, useState } from "react";

export default function IndiaMapComponent({ className }: { className?: string }) {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    fetch("/images/india-map.svg")
      .then((res) => res.text())
      .then((text) => {
        // Strip the hardcoded fill and stroke from the SVG element itself so CSS can take over
        let cleaned = text.replace(/fill="[^"]*"/g, "");
        cleaned = cleaned.replace(/stroke="[^"]*"/g, "");
        setSvgContent(cleaned);
      });
  }, []);

  if (!svgContent) {
    return <div className={`animate-pulse bg-white/5 rounded-3xl ${className}`}></div>;
  }

  return (
    <div className={`relative ${className}`}>
      <style>{`
        .india-map-container svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 20px rgba(24,200,255,0.1));
        }
        .india-map-container path {
          fill: rgba(255, 255, 255, 0.03);
          stroke: rgba(255, 255, 255, 0.1);
          stroke-width: 1px;
          transition: all 0.4s ease;
        }
        
        /* Highlight Eastern & North-Eastern Region */
        .india-map-container path#INWB,
        .india-map-container path#INBR,
        .india-map-container path#INJH,
        .india-map-container path#INSK,
        .india-map-container path#INAS,
        .india-map-container path#INML,
        .india-map-container path#INOR {
          fill: rgba(24, 200, 255, 0.3);
          stroke: rgba(24, 200, 255, 0.8);
          stroke-width: 2px;
          animation: pulseHighlight 3s infinite alternate;
        }

        .india-map-container path:hover {
          fill: rgba(15, 94, 255, 0.8) !important;
          stroke: #ffffff !important;
          stroke-width: 2px !important;
          cursor: crosshair;
        }

        @keyframes pulseHighlight {
          0% { 
            fill: rgba(24, 200, 255, 0.2); 
            filter: drop-shadow(0 0 4px rgba(24,200,255,0.2)); 
          }
          100% { 
            fill: rgba(24, 200, 255, 0.5); 
            filter: drop-shadow(0 0 15px rgba(24,200,255,0.6)); 
          }
        }
      `}</style>
      <div 
        className="india-map-container w-full h-full"
        dangerouslySetInnerHTML={{ __html: svgContent }} 
      />
      
      {/* Floating Location Markers */}
      <div className="absolute top-[45%] left-[70%] w-3 h-3 rounded-full bg-white shadow-[0_0_15px_#fff] animate-ping"></div>
      <div className="absolute top-[48%] left-[65%] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff] animate-ping" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-[40%] left-[75%] w-2 h-2 rounded-full bg-white shadow-[0_0_15px_#fff] animate-ping" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}
