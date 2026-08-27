"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function TermsAndConditions() {
  return (
    <main className="w-full bg-[#F7FAFC] pt-[140px] pb-[100px] font-['Inter',_sans-serif] relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#082C5C 1px, transparent 1px), linear-gradient(90deg, #082C5C 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      <div className="max-w-[800px] mx-auto px-6 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="w-[40px] h-[3px] bg-[#17B8FF] mb-6"></div>
          <h1 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[40px] lg:text-[48px] font-bold text-[#082C5C] mb-4">
            Terms & Conditions
          </h1>
          <p className="text-[#5B6472] mb-12">
            Last Updated: August 2026
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="bg-white rounded-[24px] p-8 lg:p-12 shadow-sm border border-[#E2E8F0] space-y-8 text-[#5B6472] leading-[1.7]"
        >
          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              1. General Agreement
            </h2>
            <p>
              By accessing and using the website of <strong>Dayal Constructions & Co.</strong>, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              2. Instant Quote Estimates & Pricing
            </h2>
            <p>
              The <strong>Instant Quote Calculator</strong> provided on this website generates <em>preliminary estimates</em> based on mathematical logic and the data you input. 
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>These automated quotes <strong>do not constitute a final binding contract, offer, or exact pricing</strong>.</li>
              <li>Actual costs may vary depending on site conditions, material fluctuations, structural complexities, and customized requirements.</li>
              <li>A final, legally binding Bill of Quantities (BOQ) and contract will only be generated after a formal site visit and in-person consultation with our engineering team.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              3. Communication Consent
            </h2>
            <p>
              As outlined in our Privacy Policy, by voluntarily submitting your phone number via our Quote Calculator or contact forms, you explicitly authorize Dayal Constructions & Co. and its representatives to contact you via phone call, SMS, or WhatsApp regarding your construction requirements, regardless of your registration on any Do Not Call (DNC) or National Do Not Call (NDNC) registry.
            </p>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              4. Intellectual Property
            </h2>
            <p>
              All content included on this site, such as text, graphics, logos, 3D elevations, architectural designs, blueprints, and software, is the property of Dayal Constructions & Co. or its content suppliers and protected by international copyright laws. Unauthorized reproduction, distribution, or copying of our architectural designs is strictly prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              5. Governing Law
            </h2>
            <p>
              These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of West Bengal, India.
            </p>
          </section>
          
          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              6. Modifications
            </h2>
            <p>
              Dayal Constructions & Co. reserves the right to revise these Terms & Conditions at any time without notice. By using this website, you are agreeing to be bound by the then-current version of these Terms & Conditions.
            </p>
          </section>
        </motion.div>
      </div>
    </main>
  );
}
