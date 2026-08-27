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

export default function Home() {
  return (
    <main className="bg-background-light">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. STATS SECTION */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-24 bg-white relative z-20 -mt-16 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100" 
          style={{ backgroundImage: "url('/blueprint-bg.png')" }}
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
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <StaggerItem>
              <Link href="/projects">
                <div className="group relative rounded-3xl overflow-hidden aspect-[4/3] premium-shadow hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-accent">
                  <img alt="The Zenith Tower" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrAB_RaSFonYNdDq8hRJ0t2Pu7ToZzPLAEsiDkjk7f4EqmkKz7yOEejMFWylvnfz2DezBh5SyDnNrUByDTd9T6RtG7JTzaG6A3YxjEQuYUcVZ0CbE3if2kyU6jB0Qn23ailOdRRoIuP-Oms_E8ALl5bv8dE9qaJLreSxVyYm6h2X8IYAg2HzLf5eUeQWqJyiY94LvwDUTDRGAy0kv9xt9zISy4NACE0e4r8qqa8bNGsf_4dZrLf6E"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/20 to-transparent flex flex-col justify-end p-8">
                    <span className="text-accent font-bold uppercase tracking-wider text-xs mb-3">Commercial</span>
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="font-heading text-2xl text-white mb-2">The Zenith Tower</h3>
                        <p className="text-white/70 text-sm flex gap-4">
                          <span>📍 Mumbai</span>
                          <span>📐 450,000 SqFt</span>
                          <span>🗓 2024</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent transition-colors">
                        <span className="material-symbols-outlined">arrow_outward</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link href="/projects">
                <div className="group relative rounded-3xl overflow-hidden aspect-[4/3] premium-shadow hover:-translate-y-2 transition-all duration-500 border border-transparent hover:border-accent">
                  <img alt="Apex Logistics Hub" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb73_CUAitya7afPV01i5fF457rJAEBtCzhVMrE0j8EAFunGxv0iwls4brfD9ByZ48Q48X0-1JnbN3J_tN6-SdbpsVBSaSDfqoMr2UEeNRqaDco6lOxWqmEuP0cm7e9xVbzU_0J6KAMM5_McC1QF-SxmYOpOULl9MoVNUEYcoq-cADUuE1FghK0ZjXGl4v1whz7jGhNJsae_xKB8Lm2PZFPVvtHoOjJ2FV-A4wai-BC0ivNVSB1go"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-navy/90 via-deep-navy/20 to-transparent flex flex-col justify-end p-8">
                    <span className="text-accent font-bold uppercase tracking-wider text-xs mb-3">Industrial</span>
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="font-heading text-2xl text-white mb-2">Apex Logistics Hub</h3>
                        <p className="text-white/70 text-sm flex gap-4">
                          <span>📍 Pune</span>
                          <span>📐 800,000 SqFt</span>
                          <span>🗓 2025</span>
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent transition-colors">
                        <span className="material-symbols-outlined">arrow_outward</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </StaggerItem>
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
