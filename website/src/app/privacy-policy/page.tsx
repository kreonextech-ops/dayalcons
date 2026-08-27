"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

export default function PrivacyPolicy() {
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
            Privacy Policy
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
              1. Introduction
            </h2>
            <p>
              At <strong>Dayal Constructions & Co.</strong>, your privacy is our priority. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or interact with our services, including our Instant Quote Calculator.
            </p>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-2">We may collect the following information when you use our website:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Phone Numbers:</strong> Collected via the Instant Quote Calculator or contact forms.</li>
              <li><strong>Personal Details:</strong> Names and email addresses if submitted through our general contact form.</li>
              <li><strong>Usage Data:</strong> Basic analytics such as your IP address, browser type, and interaction with our website to help us improve user experience.</li>
            </ul>
          </section>

          <section className="bg-[#F0F7FF] p-6 rounded-[16px] border border-[#17B8FF]/20">
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#17B8FF]">security</span>
              3. The Instant Quote Calculator & Your Phone Number
            </h2>
            <p className="font-semibold text-[#082C5C] mb-2">
              Strict No Third-Party Data Sharing Policy
            </p>
            <p>
              When you use our Instant Quote Calculator, we ask for your phone number to unlock your construction estimate. By providing your number, you consent to Dayal Constructions & Co. contacting you (via phone call or WhatsApp) strictly to discuss your project requirements, clarify the estimate, or arrange a site visit.
            </p>
            <p className="mt-3 font-bold text-[#00A9A5]">
              We will NEVER sell, rent, lease, or share your phone number or any personal data with third-party agencies, marketers, or unauthorized external entities. Your data remains completely confidential and is used solely by our internal engineering and sales team.
            </p>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              4. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide accurate construction estimates and consultation services.</li>
              <li>To respond to your inquiries and support requests.</li>
              <li>To improve our website functionality and service offerings.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              5. Data Security
            </h2>
            <p>
              We implement robust technical and organizational security measures to protect your personal data against unauthorized access, loss, or alteration. While we strive to use commercially acceptable means to protect your data, remember that no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[22px] font-bold text-[#082C5C] mb-3">
              6. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us at:
            </p>
            <p className="mt-2 text-[#082C5C] font-semibold">
              Email: dayalconstruction.office@gmail.com<br />
              Phone: +91 708 3333 000 / 70030 70035
            </p>
          </section>
        </motion.div>
      </div>
    </main>
  );
}
