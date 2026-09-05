import type { Metadata } from "next";
import Image from 'next/image';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';
import AboutSection from '@/components/AboutSection';
import InstantQuoteMaker from '@/components/InstantQuoteMaker';
import SpecializedSectorsHeader from '@/components/SpecializedSectorsHeader';
import SpecializedSectorsCards from '@/components/SpecializedSectorsCards';
import TrustSection from '@/components/TrustSection';
import ProcessTimeline from '@/components/ProcessTimeline';
import ServicesMarquee from '@/components/ServicesMarquee';
import PartneredBrands from '@/components/PartneredBrands';
import GoogleReviews from '@/components/GoogleReviews';
import ContactSection from '@/components/ContactSection';
import HeroSection from '@/components/HeroSection';

export const metadata: Metadata = {
  title: "Dayal Constructions & Co. | Best Construction Company in Siliguri",
  description:
    "Dayal Constructions & Co. — Siliguri's trusted construction experts. Residential, commercial & industrial projects delivered with engineering precision, premium materials and 100% transparency.",
  alternates: { canonical: "https://dayalconstructions.in" },
};

export default function Home() {
  return (
    <main className="bg-background-light">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. STATS SECTION */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-24 bg-white relative z-20 -mt-16 md:mt-0 rounded-t-[3rem] md:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100" 
          style={{ backgroundImage: "url('/blueprint-bg.jpg')" }}
        ></div>
        
        <div className="max-w-container-max mx-auto relative z-10">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 divide-x divide-gray-200 text-center">
            <StaggerItem>
              <div className="flex flex-col items-center">
                <span className="text-[84px] leading-[92px] font-bold tracking-[-0.04em] text-[#000101]" style={{ fontFamily: 'Montserrat, sans-serif' }}>25+</span>
                <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.1em] text-[#44474a] mt-4" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>Years of Excellence</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center">
                <span className="text-[84px] leading-[92px] font-bold tracking-[-0.04em] text-[#000101]" style={{ fontFamily: 'Montserrat, sans-serif' }}>500+</span>
                <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.1em] text-[#44474a] mt-4" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>Projects Completed</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center">
                <span className="text-[84px] leading-[92px] font-bold tracking-[-0.04em] text-[#000101]" style={{ fontFamily: 'Montserrat, sans-serif' }}>1M+</span>
                <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.1em] text-[#44474a] mt-4" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>SqFt Built</span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="flex flex-col items-center">
                <span className="text-[84px] leading-[92px] font-bold tracking-[-0.04em] text-[#000101]" style={{ fontFamily: 'Montserrat, sans-serif' }}>100%</span>
                <span className="text-[12px] leading-[16px] font-bold uppercase tracking-[0.1em] text-[#44474a] mt-4" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>Safety Record</span>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. INSTANT QUOTE MAKER */}
      <InstantQuoteMaker />

      {/* 4. ABOUT SECTION */}
      <AboutSection />

      {/* 4. SPECIALIZED SECTORS */}
      <section className="group w-full px-margin-mobile md:px-margin-desktop py-[40px] bg-background-light relative" id="services">
        {/* Topographic contour line pattern mock */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at center, #082C4E 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        <div className="max-w-container-max mx-auto">
          <SpecializedSectorsHeader />
          <SpecializedSectorsCards />
        </div>
      </section>

      {/* 5. FEATURED PROJECTS */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-[120px] bg-white relative" id="projects">
        <div className="max-w-container-max mx-auto">
          <div className="flex justify-between items-end mb-16">
            <FadeIn>
              <h2 className="font-heading text-heading-lg text-primary">Featured Work</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link className="hidden md:inline-flex items-center gap-2 text-primary font-semibold border-b-2 border-accent pb-1 hover:text-accent transition-colors" href="/projects">
                View All Projects
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </FadeIn>
          </div>
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {["1000579291.jpg.jpg", "1000609146.jpg.jpg", "1000630512.jpg.jpg", "1000714135.jpg.jpg", "1000714139.jpg.jpg"].map((img, idx) => (
              <StaggerItem key={idx}>
                <Link href="/projects">
                  <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] premium-shadow hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-accent">
                    <img alt={`Featured Project ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={`/images/project/${img}`}/>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex justify-end items-end w-full h-full">
                        <div className="w-12 h-12 rounded-full bg-deep-navy/80 backdrop-blur flex items-center justify-center text-white bg-accent transition-colors">
                          <span className="material-symbols-outlined">arrow_outward</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 6. TRUST SECTION (DAYAL ADVANTAGE) */}
      <TrustSection />

      {/* 7. PROCESS TIMELINE */}
      <ProcessTimeline />

      {/* 8. INFINITE SERVICES MARQUEE */}
      <ServicesMarquee />

      {/* 9. PARTNERED BRANDS */}
      <PartneredBrands />

      <GoogleReviews />

      {/* 11. CONTACT SECTION */}
      <ContactSection />
    </main>
  );
}
