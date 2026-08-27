"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type ServiceType = "2D Floor Plan" | "3D Floor Plan" | "Interior Design" | "3D Front Elevation";
type LocationType = "Plains" | "Hills";
type PackageType = "Structure Only" | "Standard Finish" | "Premium Finish" | "Luxurious Finish";

const SERVICE_RATES: Record<ServiceType, number> = {
  "2D Floor Plan": 5, // per sq.ft
  "3D Floor Plan": 10, // per sq.ft
  "Interior Design": 5000, // per room
  "3D Front Elevation": 15000, // Flat rate
};

const CONSTRUCTION_RATES: Record<LocationType, Record<PackageType, number>> = {
  Plains: {
    "Structure Only": 1200,
    "Standard Finish": 1600,
    "Premium Finish": 2000,
    "Luxurious Finish": 2400,
  },
  Hills: {
    "Structure Only": 1400,
    "Standard Finish": 1800,
    "Premium Finish": 2200,
    "Luxurious Finish": 2600,
  },
};

export default function InstantQuoteMaker() {
  // --- Services State ---
  const [serviceType, setServiceType] = useState<ServiceType>("2D Floor Plan");
  const [serviceSize, setServiceSize] = useState<number>(1250);
  const [servicePhone, setServicePhone] = useState<string>("");
  const [serviceEstimate, setServiceEstimate] = useState<number | null>(null);

  // --- Construction State ---
  const [constLocation, setConstLocation] = useState<LocationType>("Plains");
  const [constPackage, setConstPackage] = useState<PackageType>("Standard Finish");
  const [constArea, setConstArea] = useState<number>(1250);
  const [constPhone, setConstPhone] = useState<string>("");
  const [constEstimate, setConstEstimate] = useState<number | null>(null);

  // --- Phone Validation ---
  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  // --- Calculations ---
  useEffect(() => {
    if (isValidPhone(servicePhone)) {
      if (serviceType === "3D Front Elevation") {
        setServiceEstimate(SERVICE_RATES[serviceType]);
      } else {
        setServiceEstimate(SERVICE_RATES[serviceType] * serviceSize);
      }
    } else {
      setServiceEstimate(null);
    }
  }, [serviceType, serviceSize, servicePhone]);

  useEffect(() => {
    if (isValidPhone(constPhone)) {
      setConstEstimate(CONSTRUCTION_RATES[constLocation][constPackage] * constArea);
    } else {
      setConstEstimate(null);
    }
  }, [constLocation, constPackage, constArea, constPhone]);

  // --- Formatting ---
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getServiceUnit = (type: ServiceType) => {
    if (type === "Interior Design") return "Rooms";
    if (type === "3D Front Elevation") return "Qty";
    return "sq.ft.";
  };

  // Reset sizes when changing type to avoid 1250 rooms
  useEffect(() => {
    if (serviceType === "Interior Design") {
      setServiceSize(1); // Default to 1 room
    } else {
      setServiceSize(1250); // Default to 1250 sq.ft
    }
  }, [serviceType]);

  // --- WhatsApp URLs ---
  const handleWhatsApp = (text: string) => {
    const phone = "917083333000"; 
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const getServiceWhatsAppText = () => {
    const sizeText = serviceType === "3D Front Elevation" ? "Flat Rate" : `${serviceSize} ${getServiceUnit(serviceType)}`;
    return `Hello Dayal Constructions & Co.! I used your Instant Quote Maker for a Service.\n\n*Service:* ${serviceType}\n*Size/Qty:* ${sizeText}\n*Estimated Cost:* ${formatCurrency(serviceEstimate || 0)}\n*My Phone:* ${servicePhone}\n\nI would like to discuss this further.`;
  };

  const getConstWhatsAppText = () => {
    return `Hello Dayal Constructions & Co.! I used your Instant Quote Maker for a Construction Project.\n\n*Location:* ${constLocation}\n*Package:* ${constPackage}\n*Area:* ${constArea} sq.ft.\n*Estimated Cost:* ${formatCurrency(constEstimate || 0)}\n*My Phone:* ${constPhone}\n\nI would like to discuss this further.`;
  };

  return (
    <section className="w-full bg-[#F7FBFF] py-[60px] md:py-[80px] relative overflow-hidden font-['Manrope',_sans-serif]">
      {/* Blueprint overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05] bg-[url('/images/footer-blueprint.png')] bg-repeat mix-blend-multiply"></div>
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 relative">
          <div className="max-w-[700px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-semibold text-[11px] tracking-[3px] text-[#18AFFF] uppercase mb-2"
            >
              INSTANT QUOTE MAKER
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[32px] md:text-[40px] font-[800] text-[#062B55] leading-[1.1] mb-2"
            >
              Get Your Instant Quote
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[15px] font-[500] text-[#062B55]/70 max-w-[500px]"
            >
              Select your service or construction package and receive an instant estimated quotation.
            </motion.p>
          </div>
          
          {/* Top right luxury house blended render */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute right-0 top-[-40px] md:top-[-60px] w-[200px] md:w-[350px] h-[200px] md:h-[250px] pointer-events-none opacity-[0.12] mix-blend-multiply"
          >
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop" alt="Luxury House" className="w-full h-full object-cover mask-image-fade" />
          </motion.div>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-xl border border-[#062B55]/10 rounded-[24px] shadow-[0_20px_40px_rgba(6,43,85,0.06)] relative flex flex-col lg:flex-row overflow-hidden"
        >
          
          {/* Left Column - Services */}
          <div className="w-full lg:w-1/2 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-blue-500">architecture</span>
              </div>
              <div>
                <h3 className="text-[20px] font-[800] text-[#062B55]">Services Quote</h3>
                <p className="text-[13px] font-[500] text-[#062B55]/60">For design & planning services</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Input 1: Service Type */}
              <div className="col-span-1">
                <label className="block text-[11px] font-[700] text-[#062B55] mb-1.5 uppercase tracking-wide">1. Service</label>
                <div className="relative">
                  <select 
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as ServiceType)}
                    className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-3 py-2.5 text-[13px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                  >
                    <option value="2D Floor Plan">2D Floor</option>
                    <option value="3D Floor Plan">3D Floor</option>
                    <option value="Interior Design">Interior</option>
                    <option value="3D Front Elevation">Elevation</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Input 2: Size */}
              <div className={`col-span-1 ${serviceType === "3D Front Elevation" ? "opacity-40 pointer-events-none transition-opacity" : "transition-opacity"}`}>
                <label className="block text-[11px] font-[700] text-[#062B55] mb-1.5 uppercase tracking-wide">
                  2. {serviceType === "Interior Design" ? "Rooms" : "Area"} <span className="text-[#062B55]/50 capitalize normal-case text-[9px] ml-1">({getServiceUnit(serviceType)})</span>
                </label>
                
                {serviceType === "Interior Design" ? (
                  <div className="relative">
                    <select 
                      value={serviceSize}
                      onChange={(e) => setServiceSize(Number(e.target.value))}
                      className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-3 py-2.5 text-[13px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none h-[40px]"
                    >
                      <option value="1">1 Room</option>
                      <option value="2">2 Rooms</option>
                      <option value="3">3 Rooms</option>
                      <option value="4">4 Rooms</option>
                      <option value="5">5 Rooms</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                  </div>
                ) : (
                  <div className="flex items-center bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] overflow-hidden h-[40px]">
                    <button onClick={() => setServiceSize(Math.max(1, serviceSize - 100))} className="px-3 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-lg leading-none flex items-center justify-center w-10">−</button>
                    <input 
                      type="number" 
                      value={serviceSize}
                      onChange={(e) => setServiceSize(Number(e.target.value))}
                      className="flex-grow w-full bg-transparent text-center text-[13px] font-[700] text-[#062B55] focus:outline-none h-full"
                    />
                    <button onClick={() => setServiceSize(serviceSize + 100)} className="px-3 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-lg leading-none flex items-center justify-center w-10">+</button>
                  </div>
                )}
              </div>

              {/* Input 3: Phone */}
              <div className="col-span-2">
                <label className="block text-[11px] font-[700] text-[#062B55] mb-1.5 uppercase tracking-wide">
                  3. Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#062B55]/40">call</span>
                  <input 
                    type="tel"
                    maxLength={10}
                    placeholder="Enter 10-digit mobile number"
                    value={servicePhone}
                    onChange={(e) => setServicePhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] pl-9 pr-3 py-2.5 text-[13px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Result Area */}
            <div className="mt-5 pt-5 border-t border-[#062B55]/10 min-h-[130px]">
              <AnimatePresence mode="wait">
                {serviceEstimate !== null ? (
                  <motion.div 
                    key="unlocked"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-green-500/5 border border-green-500/20 rounded-[12px] p-4 text-center"
                  >
                    <p className="text-[10px] font-[700] text-green-600 uppercase tracking-widest mb-1">Estimated Cost</p>
                    <h4 className="text-[24px] font-[800] text-[#062B55] mb-1">{formatCurrency(serviceEstimate)}</h4>
                    <p className="text-[11px] font-[500] text-[#062B55]/60 mb-3">
                      {serviceType === "3D Front Elevation" 
                        ? `${serviceType} • Flat Rate`
                        : `${serviceType} • ${serviceSize} ${getServiceUnit(serviceType)}`
                      }
                    </p>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-[#18AFFF] text-white text-[12px] font-bold rounded-[6px] hover:-translate-y-0.5 transition-transform">Get Detailed Quote</button>
                      <button onClick={() => handleWhatsApp(getServiceWhatsAppText())} className="flex-1 py-2 bg-transparent border border-[#25D366] text-[#25D366] text-[12px] font-bold rounded-[6px] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        WhatsApp
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full flex flex-col items-center justify-center text-center p-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#062B55]/5 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[18px] text-[#062B55]/40">lock</span>
                    </div>
                    <p className="text-[12px] font-[600] text-[#062B55]/50 max-w-[200px]">Enter your phone number to unlock your estimate.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-full lg:w-[1px] h-[1px] lg:h-auto bg-[#062B55]/10 relative flex-shrink-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-[#062B55]/10 rounded-full flex items-center justify-center z-10 shadow-sm font-bold text-[#062B55]/40 text-[9px]">
              OR
            </div>
          </div>

          {/* Right Column - Construction */}
          <div className="w-full lg:w-1/2 p-5 md:p-6 bg-gradient-to-br from-transparent to-[#18AFFF]/[0.02]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-teal-500">engineering</span>
              </div>
              <div>
                <h3 className="text-[18px] font-[800] text-[#062B55]">Construction Quote</h3>
                <p className="text-[12px] font-[500] text-[#062B55]/60">For building packages</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Input 1: Location */}
              <div className="col-span-1">
                <label className="block text-[11px] font-[700] text-[#062B55] mb-1.5 uppercase tracking-wide">1. Location</label>
                <div className="flex bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] p-1 relative overflow-hidden h-[40px]">
                  <div 
                    className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[6px] shadow-sm transition-transform duration-300 ease-in-out" 
                    style={{ transform: constLocation === "Plains" ? "translateX(0)" : "translateX(100%)" }}
                  ></div>
                  <button onClick={() => setConstLocation("Plains")} className={`flex-1 h-full text-[12px] font-[700] z-10 transition-colors ${constLocation === "Plains" ? "text-[#062B55]" : "text-[#062B55]/50"}`}>Plains</button>
                  <button onClick={() => setConstLocation("Hills")} className={`flex-1 h-full text-[12px] font-[700] z-10 transition-colors ${constLocation === "Hills" ? "text-[#062B55]" : "text-[#062B55]/50"}`}>Hills</button>
                </div>
              </div>

              {/* Input 2: Package */}
              <div className="col-span-1">
                <label className="block text-[11px] font-[700] text-[#062B55] mb-1.5 uppercase tracking-wide">2. Package</label>
                <div className="relative">
                  <select 
                    value={constPackage}
                    onChange={(e) => setConstPackage(e.target.value as PackageType)}
                    className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-3 py-2.5 text-[13px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                  >
                    <option value="Structure Only">Structure</option>
                    <option value="Standard Finish">Standard</option>
                    <option value="Premium Finish">Premium</option>
                    <option value="Luxurious Finish">Luxurious</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[16px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Input 3: Area */}
              <div className="col-span-1">
                <label className="block text-[11px] font-[700] text-[#062B55] mb-1.5 uppercase tracking-wide">
                  3. Area <span className="text-[#062B55]/50 capitalize normal-case text-[9px] ml-1">(sq.ft.)</span>
                </label>
                <div className="flex items-center bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] overflow-hidden h-[40px]">
                  <button onClick={() => setConstArea(Math.max(100, constArea - 100))} className="px-3 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-lg leading-none flex items-center justify-center w-10">−</button>
                  <input 
                    type="number" 
                    value={constArea}
                    onChange={(e) => setConstArea(Number(e.target.value))}
                    className="flex-grow w-full bg-transparent text-center text-[13px] font-[700] text-[#062B55] focus:outline-none h-full"
                  />
                  <button onClick={() => setConstArea(constArea + 100)} className="px-3 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-lg leading-none flex items-center justify-center w-10">+</button>
                </div>
              </div>

              {/* Input 4: Phone */}
              <div className="col-span-1">
                <label className="block text-[11px] font-[700] text-[#062B55] mb-1.5 uppercase tracking-wide">
                  4. Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-[#062B55]/40">call</span>
                  <input 
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={constPhone}
                    onChange={(e) => setConstPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] pl-9 pr-3 py-2.5 text-[13px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Result Area */}
            <div className="mt-5 pt-5 border-t border-[#062B55]/10 min-h-[130px]">
              <AnimatePresence mode="wait">
                {constEstimate !== null ? (
                  <motion.div 
                    key="unlocked"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="bg-teal-500/5 border border-teal-500/20 rounded-[12px] p-4 text-center"
                  >
                    <p className="text-[10px] font-[700] text-teal-600 uppercase tracking-widest mb-1">Estimated Cost</p>
                    <h4 className="text-[24px] font-[800] text-[#062B55] mb-1">{formatCurrency(constEstimate)}</h4>
                    <p className="text-[11px] font-[500] text-[#062B55]/60 mb-3">{constLocation} • {constPackage} • {constArea} sq.ft.</p>
                    
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-[#18AFFF] text-white text-[12px] font-bold rounded-[6px] hover:-translate-y-0.5 transition-transform">Get Detailed Quote</button>
                      <button onClick={() => handleWhatsApp(getConstWhatsAppText())} className="flex-1 py-2 bg-[#25D366]/10 text-[#25D366] text-[12px] font-bold rounded-[6px] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">chat</span>
                        WhatsApp
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="locked"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="h-full flex flex-col items-center justify-center text-center p-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#062B55]/5 flex items-center justify-center mb-2">
                      <span className="material-symbols-outlined text-[18px] text-[#062B55]/40">lock</span>
                    </div>
                    <p className="text-[12px] font-[600] text-[#062B55]/50 max-w-[200px]">Enter your phone number to unlock your estimate.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
        </motion.div>

        {/* Bottom Disclaimer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-2 text-[12px] font-[600] text-[#062B55]/60 bg-[#062B55]/5 py-2.5 px-6 rounded-full w-max mx-auto shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-[#18AFFF]">security</span>
          This is an approximate estimate. Final quotation will be provided after site visit, discussion, and design confirmation.
        </motion.div>

      </div>
      
      {/* CSS for mask image if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .mask-image-fade {
          mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
          -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 70%);
        }
      `}} />
    </section>
  );
}
