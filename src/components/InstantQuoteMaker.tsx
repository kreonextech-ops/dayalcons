"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";


// --- Types ---
type QuoteCategory = "Construction" | "Service";
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
  // --- Common State ---
  const [quoteCategory, setQuoteCategory] = useState<QuoteCategory>("Construction");
  const [phone, setPhone] = useState<string>("");
  const [isQuoteGenerated, setIsQuoteGenerated] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");

  // --- Services State ---
  const [serviceType, setServiceType] = useState<ServiceType>("2D Floor Plan");
  const [serviceSize, setServiceSize] = useState<number>(1250);

  // --- Construction State ---
  const [constLocation, setConstLocation] = useState<LocationType>("Plains");
  const [constPackage, setConstPackage] = useState<PackageType>("Standard Finish");
  const [constArea, setConstArea] = useState<number>(1250);

  // --- Calculations ---
  const isValidPhone = (p: string) => /^[0-9]{10}$/.test(p);

  const getEstimate = () => {
    if (quoteCategory === "Service") {
      if (serviceType === "3D Front Elevation") {
        return SERVICE_RATES[serviceType];
      }
      return SERVICE_RATES[serviceType] * serviceSize;
    } else {
      return CONSTRUCTION_RATES[constLocation][constPackage] * constArea;
    }
  };

  // Reset generated state if user changes any input
  useEffect(() => {
    setIsQuoteGenerated(false);
    setPhoneError("");
  }, [quoteCategory, serviceType, serviceSize, constLocation, constPackage, constArea, phone]);

  // Reset sizes when changing service type
  useEffect(() => {
    if (serviceType === "Interior Design") {
      setServiceSize(1);
    } else {
      setServiceSize(1250);
    }
  }, [serviceType]);

  const handleShowQuote = async () => {
    if (!phone) {
      setPhoneError("Please enter your mobile number.");
      return;
    }
    if (!isValidPhone(phone)) {
      setPhoneError("Please enter a valid 10-digit number.");
      return;
    }
    setPhoneError("");
    setIsQuoteGenerated(true);

    try {
      const serviceTypeVal = quoteCategory === 'Construction' 
        ? `Construction - ${constPackage}` 
        : serviceType;
      const plotSizeVal = quoteCategory === 'Construction' ? constArea : serviceSize;
      const budgetVal = getEstimate();
      
      await supabase.from('leads').insert([{
        name: `Quote Lead - ${phone}`,
        phone: phone,
        service_type: serviceTypeVal,
        plot_size: plotSizeVal,
        budget: budgetVal,
        source: 'Website Quote',
        status: 'New',
        lead_temperature: 'Warm',
        notes: `Auto-generated from Instant Quote Maker. Category: ${quoteCategory}`
      }]);
    } catch (e) {
      // silent fail - don't interrupt user experience
    }
  };

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

  // --- WhatsApp URLs ---
  const handleWhatsApp = () => {
    const waPhone = "917083333000"; 
    let text = "";
    if (quoteCategory === "Service") {
      const sizeText = serviceType === "3D Front Elevation" ? "Flat Rate" : `${serviceSize} ${getServiceUnit(serviceType)}`;
      text = `Hello Dayal Constructions & Co.! I used your Instant Quote Maker.\n\n*Quote Type:* Service\n*Service:* ${serviceType}\n*Size/Qty:* ${sizeText}\n*Estimated Cost:* ${formatCurrency(getEstimate())}\n*My Phone:* ${phone}\n\nI would like to discuss this further.`;
    } else {
      text = `Hello Dayal Constructions & Co.! I used your Instant Quote Maker.\n\n*Quote Type:* Construction\n*Location:* ${constLocation}\n*Package:* ${constPackage}\n*Area:* ${constArea} sq.ft.\n*Estimated Cost:* ${formatCurrency(getEstimate())}\n*My Phone:* ${phone}\n\nI would like to discuss this further.`;
    }
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="w-full bg-[#062B55] py-[60px] md:py-[80px] relative overflow-hidden font-['Manrope',_sans-serif]">
      {/* Blueprint overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.25] bg-[url('/images/footer-blueprint.jpg')] bg-repeat mix-blend-screen"></div>
      
      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
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
            className="text-[32px] md:text-[40px] font-[800] text-white leading-[1.1] mb-3"
          >
            Get Your Instant Quote
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[15px] font-[500] text-white/80 max-w-[500px] mx-auto"
          >
            Select your service or construction package, provide your number, and receive an instant estimated quotation.
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.2)] p-6 md:p-10 relative overflow-hidden"
        >
          {/* Quote Category Toggle */}
          <div className="flex bg-[#F7FBFF] border border-[#062B55]/10 rounded-[12px] p-1.5 relative overflow-hidden h-[50px] mb-8 max-w-[400px] mx-auto">
            <div 
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-[8px] shadow-sm transition-transform duration-300 ease-in-out" 
              style={{ transform: quoteCategory === "Construction" ? "translateX(0)" : "translateX(100%)" }}
            ></div>
            <button 
              onClick={() => setQuoteCategory("Construction")} 
              className={`flex-1 h-full text-[14px] font-[700] z-10 transition-colors flex items-center justify-center gap-2 ${quoteCategory === "Construction" ? "text-[#062B55]" : "text-[#062B55]/50"}`}
            >
              <span className="material-symbols-outlined text-[18px]">engineering</span>
              Construction
            </button>
            <button 
              onClick={() => setQuoteCategory("Service")} 
              className={`flex-1 h-full text-[14px] font-[700] z-10 transition-colors flex items-center justify-center gap-2 ${quoteCategory === "Service" ? "text-[#062B55]" : "text-[#062B55]/50"}`}
            >
              <span className="material-symbols-outlined text-[18px]">architecture</span>
              Services
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dynamic Fields based on Category */}
            {quoteCategory === "Construction" ? (
              <>
                <div className="col-span-1">
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">Location</label>
                  <div className="flex bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] p-1 relative overflow-hidden h-[45px]">
                    <div 
                      className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-[6px] shadow-sm transition-transform duration-300 ease-in-out" 
                      style={{ transform: constLocation === "Plains" ? "translateX(0)" : "translateX(100%)" }}
                    ></div>
                    <button onClick={() => setConstLocation("Plains")} className={`flex-1 h-full text-[13px] font-[700] z-10 transition-colors ${constLocation === "Plains" ? "text-[#062B55]" : "text-[#062B55]/50"}`}>Plains</button>
                    <button onClick={() => setConstLocation("Hills")} className={`flex-1 h-full text-[13px] font-[700] z-10 transition-colors ${constLocation === "Hills" ? "text-[#062B55]" : "text-[#062B55]/50"}`}>Hills</button>
                  </div>
                </div>

                <div className="col-span-1">
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">Package</label>
                  <div className="relative">
                    <select 
                      value={constPackage}
                      onChange={(e) => setConstPackage(e.target.value as PackageType)}
                      className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                    >
                      <option value="Structure Only">Structure Only</option>
                      <option value="Standard Finish">Standard Finish</option>
                      <option value="Premium Finish">Premium Finish</option>
                      <option value="Luxurious Finish">Luxurious Finish</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">
                    Built-up Area <span className="text-[#062B55]/50 capitalize normal-case text-[10px] ml-1">(sq.ft.)</span>
                  </label>
                  <div className="flex items-center bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] overflow-hidden h-[45px]">
                    <button onClick={() => setConstArea(Math.max(100, constArea - 100))} className="px-4 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-xl leading-none flex items-center justify-center w-12">−</button>
                    <input 
                      type="number" 
                      value={constArea}
                      onChange={(e) => setConstArea(Number(e.target.value))}
                      className="flex-grow w-full bg-transparent text-center text-[14px] font-[700] text-[#062B55] focus:outline-none h-full"
                    />
                    <button onClick={() => setConstArea(constArea + 100)} className="px-4 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-xl leading-none flex items-center justify-center w-12">+</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-1">
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">Service Type</label>
                  <div className="relative">
                    <select 
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value as ServiceType)}
                      className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none"
                    >
                      <option value="2D Floor Plan">2D Floor Plan</option>
                      <option value="3D Floor Plan">3D Floor Plan</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="3D Front Elevation">3D Front Elevation</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className={`col-span-1 ${serviceType === "3D Front Elevation" ? "opacity-40 pointer-events-none transition-opacity" : "transition-opacity"}`}>
                  <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">
                    {serviceType === "Interior Design" ? "Rooms" : "Area"} <span className="text-[#062B55]/50 capitalize normal-case text-[10px] ml-1">({getServiceUnit(serviceType)})</span>
                  </label>
                  
                  {serviceType === "Interior Design" ? (
                    <div className="relative">
                      <select 
                        value={serviceSize}
                        onChange={(e) => setServiceSize(Number(e.target.value))}
                        className="w-full bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] px-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none focus:border-[#18AFFF] transition-colors appearance-none h-[45px]"
                      >
                        <option value="1">1 Room</option>
                        <option value="2">2 Rooms</option>
                        <option value="3">3 Rooms</option>
                        <option value="4">4 Rooms</option>
                        <option value="5">5 Rooms</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40 pointer-events-none">expand_more</span>
                    </div>
                  ) : (
                    <div className="flex items-center bg-[#F7FBFF] border border-[#062B55]/10 rounded-[10px] overflow-hidden h-[45px]">
                      <button onClick={() => setServiceSize(Math.max(1, serviceSize - 100))} className="px-4 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-xl leading-none flex items-center justify-center w-12">−</button>
                      <input 
                        type="number" 
                        value={serviceSize}
                        onChange={(e) => setServiceSize(Number(e.target.value))}
                        className="flex-grow w-full bg-transparent text-center text-[14px] font-[700] text-[#062B55] focus:outline-none h-full"
                      />
                      <button onClick={() => setServiceSize(serviceSize + 100)} className="px-4 h-full text-[#062B55]/60 hover:bg-[#062B55]/5 transition-colors font-bold text-xl leading-none flex items-center justify-center w-12">+</button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Common Phone Input */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <label className="block text-[11px] font-[700] text-[#062B55] mb-2 uppercase tracking-wide">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-[#062B55]/40">call</span>
                <input 
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/[^0-9]/g, ''));
                    setPhoneError("");
                  }}
                  className={`w-full bg-[#F7FBFF] border rounded-[10px] pl-11 pr-4 py-3 text-[14px] font-[600] text-[#062B55] focus:outline-none transition-colors h-[45px] ${phoneError ? 'border-red-400 focus:border-red-500' : 'border-[#062B55]/10 focus:border-[#18AFFF]'}`}
                />
              </div>
              {phoneError && <p className="text-red-500 text-[11px] font-semibold mt-1.5">{phoneError}</p>}
            </div>

            {/* Action Button */}
            <div className="col-span-1 md:col-span-2 mt-2">
              <button 
                onClick={handleShowQuote}
                className="w-full bg-[#18AFFF] text-white font-bold text-[15px] py-4 rounded-[12px] shadow-[0_8px_20px_rgba(24,175,255,0.3)] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(24,175,255,0.4)] transition-all duration-300"
              >
                Show My Estimate
              </button>
            </div>
          </div>

          {/* Result Area */}
          <AnimatePresence>
            {isQuoteGenerated && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#062B55]/5 border border-[#062B55]/10 rounded-[16px] p-6 text-center relative">
                  <p className="text-[11px] font-[800] text-[#18AFFF] uppercase tracking-widest mb-2">Estimated Cost</p>
                  <h4 className="text-[36px] font-[800] text-[#062B55] mb-2 leading-none flex items-start justify-center">
                    {formatCurrency(getEstimate())}
                    <sup className="text-[20px] text-[#18AFFF] ml-1 mt-1">*</sup>
                  </h4>
                  
                  <p className="text-[13px] font-[600] text-[#062B55]/70 mb-5">
                    {quoteCategory === "Construction" 
                      ? `${constLocation} • ${constPackage} • ${constArea} sq.ft.`
                      : serviceType === "3D Front Elevation" 
                        ? `${serviceType} • Flat Rate`
                        : `${serviceType} • ${serviceSize} ${getServiceUnit(serviceType)}`
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
                    <button onClick={() => handleWhatsApp()} className="flex-1 py-3 bg-[#25D366] text-white text-[14px] font-bold rounded-[8px] hover:-translate-y-0.5 transition-transform flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(37,211,102,0.3)]">
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Connect on WhatsApp
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bottom Disclaimer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2 text-[13px] font-[500] text-white/80 text-left sm:text-center max-w-[600px] mx-auto"
        >
          <span className="text-[18px] text-[#18AFFF] font-bold leading-none mt-1 sm:mt-0">*</span>
          <p>
            <span className="font-bold text-white">Note:</span> This is an estimated cost. The final quotation will be provided following a comprehensive site visit, consultation, and design confirmation.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
