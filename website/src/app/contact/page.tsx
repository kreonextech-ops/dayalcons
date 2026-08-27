import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';

export default function Contact() {
  return (
    <main className="pt-24 pb-32">
      {/* 1. Header */}
      <section className="px-margin-mobile md:px-margin-desktop bg-surface-container-low py-20 mb-16 rounded-b-[3rem]">
        <div className="max-w-container-max mx-auto text-center space-y-6">
          <FadeIn>
            <h1 className="font-display-lg text-primary">Contact Us</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto">
              Let's build something extraordinary together. If you know someone planning to build, expand, renovate, or invest in property — think of us.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Contact Details & Form */}
      <section className="px-margin-mobile md:px-margin-desktop py-16">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row gap-16">
          
          {/* Left: Contact Info */}
          <div className="w-full md:w-1/2 space-y-12">
            <FadeIn>
              <h2 className="font-headline-lg text-primary mb-8">Get In Touch</h2>
            </FadeIn>
            
            <StaggerContainer className="space-y-8">
              {/* Phones */}
              <StaggerItem>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-4xl text-secondary">call</span>
                  <div>
                    <h3 className="font-headline-md text-primary mb-2">Call Us</h3>
                    <p className="font-body-md text-on-surface-variant flex flex-col gap-1">
                      <a href="tel:7083333000" className="hover:text-primary transition-colors">708 3333 000</a>
                      <a href="tel:7003070035" className="hover:text-primary transition-colors">70030 70035</a>
                      <a href="tel:9749327676" className="hover:text-primary transition-colors">974 932 7676</a>
                    </p>
                  </div>
                </div>
              </StaggerItem>

              {/* Email */}
              <StaggerItem>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-4xl text-secondary">mail</span>
                  <div>
                    <h3 className="font-headline-md text-primary mb-2">Email Us</h3>
                    <p className="font-body-md text-on-surface-variant">
                      <a href="mailto:dayalconstruction.office@gmail.com" className="hover:text-primary transition-colors">
                        dayalconstruction.office@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </StaggerItem>

              {/* Office */}
              <StaggerItem>
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-4xl text-secondary">location_on</span>
                  <div>
                    <h3 className="font-headline-md text-primary mb-2">Our Office</h3>
                    <p className="font-body-md text-on-surface-variant leading-relaxed max-w-sm">
                      Noukaghat Rd, opposite Uniliv Ikon, beside Makhan Prio Momo Ghor, 
                      Ward 31, More, Babupara, Siliguri, West Bengal 734005
                    </p>
                  </div>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          {/* Right: Form Placeholder */}
          <div className="w-full md:w-1/2">
            <FadeIn direction="left">
              <div className="bg-surface p-8 md:p-12 rounded-3xl border border-outline-variant/30 shadow-xl shadow-primary/5">
                <h3 className="font-headline-md text-primary mb-8">Send a Message</h3>
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface-variant">Full Name</label>
                    <input type="text" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface-variant">Phone Number</label>
                    <input type="tel" className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="+91 00000 00000" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-md text-on-surface-variant">Message</label>
                    <textarea rows={4} className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors" placeholder="Tell us about your project..."></textarea>
                  </div>
                  <button className="w-full bg-primary text-on-primary font-label-caps px-8 py-4 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors uppercase tracking-widest">
                    Submit Enquiry
                  </button>
                </form>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* 3. Map Placeholder */}
      <section className="w-full h-[400px] mt-16 bg-surface-variant/30 relative">
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-on-surface-variant/70 font-label-caps tracking-widest">
             [GOOGLE MAPS PLACEHOLDER]
           </span>
        </div>
        {/* iframe map code goes here */}
      </section>
    </main>
  );
}
