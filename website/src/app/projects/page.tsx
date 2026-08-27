import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/FadeIn';

export default function Projects() {
  const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Turnkey', 'Renovation'];

  return (
    <main className="pt-24 pb-32">
      {/* 1. Header */}
      <section className="px-margin-mobile md:px-margin-desktop bg-surface-container-low py-20 mb-16 rounded-b-[3rem]">
        <div className="max-w-container-max mx-auto text-center space-y-6">
          <FadeIn>
            <h1 className="font-display-lg text-primary">Our Projects</h1>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="font-body-lg text-on-surface-variant max-w-3xl mx-auto">
              Explore our portfolio of over 500+ successfully completed projects across North Bengal.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* 2. Filter / Tabs Placeholder */}
      <section className="px-margin-mobile md:px-margin-desktop py-8">
        <div className="max-w-container-max mx-auto">
          <FadeIn>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  className={`px-6 py-2 rounded-full font-label-caps tracking-wide transition-colors ${
                    idx === 0 
                      ? 'bg-primary text-on-primary' 
                      : 'bg-surface border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* 3. Project Gallery */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* PLACEHOLDER: Generating 6 dummy projects */}
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StaggerItem key={i}>
                <div className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-surface-variant/30 border border-outline-variant/20 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                  {/* Image Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="text-on-surface-variant/50 font-label-caps text-sm tracking-widest">
                       [PROJECT IMAGE {i}]
                     </span>
                     {/* <img src="..." alt="..." className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> */}
                  </div>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0">
                    <span className="text-secondary font-label-caps mb-2 text-sm">
                      {i % 2 === 0 ? 'Residential' : 'Commercial'}
                    </span>
                    <h3 className="font-headline-md text-on-primary">Project Name {i}</h3>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="px-margin-mobile md:px-margin-desktop py-24 text-center bg-surface-bright mt-16">
        <FadeIn>
          <h2 className="font-headline-md text-primary mb-8">Want to see more of our work?</h2>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-secondary text-on-secondary font-label-caps px-8 py-4 rounded-lg hover:bg-secondary-container hover:text-on-secondary-container transition-colors uppercase tracking-widest text-lg">
            Let's Talk
          </Link>
        </FadeIn>
      </section>
    </main>
  );
}
