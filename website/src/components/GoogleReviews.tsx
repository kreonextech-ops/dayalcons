'use client';

import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useRef } from 'react';

// Custom wrap function to replace @motionone/utils dependency
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

// Google reviews data
const reviews = [
  {
    name: 'Kushal Paul',
    time: '3 weeks ago',
    text: 'I had a very good experience with Dayal Construction & Co. Their work quality is excellent, and the team is professional, punctual, and cooperative. They paid attention to every detail and completed the work on time. The finishing and overall execution exceeded my expectations.',
    avatarColor: 'bg-orange-500'
  },
  {
    name: 'Dragon YT',
    time: '1 month ago',
    text: 'Love their service. Thanks to God for finding them. Don\'t judge this company with fake negative reviews. I personally worked with them—very nice experience. The architect team was excellent and guided me throughout the project.',
    avatarColor: 'bg-red-500'
  },
  {
    name: 'Sahina Parvin',
    time: '10 months ago',
    text: 'I contacted Dayal Construction & Co. regarding my house construction. Their architects impressed me from the beginning. The project was completed with excellent quality within the promised timeline, and I\'m happy to work with them again for another project.',
    avatarColor: 'bg-pink-500'
  },
  {
    name: 'Anshu Gupta',
    time: '1 year ago',
    text: 'I planned to construct a bungalow on loose soil, but many contractors refused. Dayal Construction successfully designed and built it beautifully. I\'m extremely satisfied and have recommended them to my family.',
    avatarColor: 'bg-purple-500'
  },
  {
    name: 'Gour Das',
    time: '1 year ago',
    text: 'Best service, best quality, nice design, affordable pricing, and an experienced civil engineer and architect team. I\'m very happy with their service.',
    avatarColor: 'bg-blue-500'
  },
  {
    name: 'Amal Roy',
    time: '6 months ago',
    text: 'Best price with valuable quality. Highly satisfied with the workmanship and professionalism.',
    avatarColor: 'bg-teal-500'
  },
  {
    name: 'Angel Muskan',
    time: '1 year ago',
    text: 'Nice service, excellent employee behaviour, and one of the best architect and civil engineering teams I\'ve worked with.',
    avatarColor: 'bg-fuchsia-500'
  },
  {
    name: 'Anish Siddha',
    time: '1 year ago',
    text: 'Love their service. Nice team, experienced architect, quality construction, and I hope to work with them again on another project.',
    avatarColor: 'bg-indigo-500'
  },
  {
    name: 'Rabin Roy',
    time: '8 months ago',
    text: 'Thanks to Dayal Construction & Co. for the best quality construction, excellent team effort, outstanding planning, timely completion, and friendly behaviour.',
    avatarColor: 'bg-yellow-500'
  },
  {
    name: 'Prakash Agarwal',
    time: '1 year ago',
    text: 'I loved this company\'s service. Best quality, efficient architects, excellent building planning, and a highly skilled civil engineering team.',
    avatarColor: 'bg-emerald-500'
  },
  {
    name: 'Utpal Barman',
    time: '6 months ago',
    text: 'Excellent construction experience with a professional and reliable team. Their commitment to quality and timely delivery truly stands out.',
    avatarColor: 'bg-cyan-500'
  }
];

// Use static reverse arrays to prevent hydration mismatch
const row1 = [...reviews];
const row2 = [...reviews].reverse();

function ReviewCard({ review }: { review: typeof reviews[0] }) {
  return (
    <div className="w-[88vw] md:w-[390px] h-[270px] md:h-[250px] rounded-[22px] bg-white border border-[#1EA7FF]/20 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 transition-all duration-300 hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(30,167,255,0.12)] hover:border-[#1EA7FF]/60 flex flex-col shrink-0 group">
      
      <div className="flex items-center gap-4 mb-4 shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${review.avatarColor}`}>
          {review.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-[#071A2F] text-[15px]">{review.name}</h4>
          <p className="font-['Inter',_sans-serif] text-[13px] text-[#5B6472]">{review.time}</p>
        </div>
      </div>
      
      <div className="flex gap-0.5 mb-3 shrink-0">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-[18px] h-[18px] text-[#FFB400]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <p className="font-['Inter',_sans-serif] text-[15px] leading-[1.65] text-[#071A2F]/80 whitespace-normal break-words line-clamp-4">
          {review.text}
        </p>
      </div>
      
      <div className="flex items-center gap-2 pt-4 border-t border-[#E2E8F0] mt-auto shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="font-['Inter',_sans-serif] text-[12px] font-semibold text-[#5B6472]">Verified Google Review</span>
      </div>
    </div>
  );
}

function MarqueeRow({ reviews, direction, speed = 25, delay = 0 }: { reviews: any[], direction: 'left' | 'right', speed?: number, delay?: number }) {
  const baseX = useMotionValue(0);
  const isHovered = useRef(false);
  
  const repeatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];
  
  useAnimationFrame((t, delta) => {
    if (isHovered.current) return;
    
    let moveBy = direction === 'left' ? -(speed * (delta / 1000)) : (speed * (delta / 1000));
    // Each card is 390px + 28px gap = 418px (desktop). Total length for 11 reviews is 4598px.
    const contentWidth = 4598; 
    
    baseX.set(wrap(-contentWidth, 0, baseX.get() + moveBy));
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className="relative flex overflow-visible w-[200vw] ml-[-50vw] mb-6 py-4 touch-pan-y"
      onMouseEnter={() => isHovered.current = true}
      onMouseLeave={() => isHovered.current = false}
      onTouchStart={() => isHovered.current = true}
      onTouchEnd={() => isHovered.current = false}
    >
      <motion.div 
        className="flex gap-[28px] whitespace-nowrap px-[50vw] will-change-transform"
        style={{ x: baseX }}
      >
        {repeatedReviews.map((review, i) => (
          <div key={i} className="h-full">
            <ReviewCard review={review} />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function GoogleReviews() {
  return (
    <section className="w-full bg-[#F8FAFC] py-[120px] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/images/footer-blueprint.png')] opacity-[0.02] bg-repeat bg-[length:400px_400px]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,_rgba(30,167,255,0.08)_0%,_transparent_70%)]"></div>
        {/* Soft skyline silhouette */}
        <div className="absolute bottom-0 left-0 w-full h-48 opacity-[0.08] bg-[url('/images/contact-bg.png')] bg-cover bg-bottom mix-blend-multiply filter grayscale blur-[1px]"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] opacity-[0.06] bg-[repeating-linear-gradient(45deg,_#071A2F_0px,_#071A2F_1px,_transparent_1px,_transparent_10px)] pointer-events-none rounded-full blur-[2px]"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-[12px] h-[2px] bg-[#1EA7FF]"></div>
            <span className="font-['Inter',_sans-serif] text-[13px] font-bold tracking-[3px] text-[#1EA7FF] uppercase">
              VERIFIED GOOGLE REVIEWS
            </span>
            <div className="w-[12px] h-[2px] bg-[#1EA7FF]"></div>
          </motion.div>

          <h2 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[52px] md:text-[64px] font-[800] tracking-tight text-[#071A2F] mb-6 flex gap-3 flex-wrap justify-center">
            {['Built', 'on', 'Trust.'].map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="font-['Inter',_sans-serif] text-[16px] md:text-[18px] text-[#5B6472] max-w-[600px] leading-relaxed mb-8"
          >
            Every project we deliver is measured by craftsmanship, transparency, and client satisfaction—not promises.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
            className="flex items-center gap-3 bg-white px-5 py-3 rounded-full border border-[#E2E8F0] shadow-sm"
          >
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-[20px] h-[20px] text-[#FFB400]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="font-['Plus_Jakarta_Sans',_sans-serif] font-bold text-[#071A2F] text-[16px]">4.9 Google Rating</span>
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] ml-1">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </motion.div>
        </div>

      </div>

      {/* Infinite Double Marquee */}
      <div className="w-full overflow-hidden flex flex-col relative z-10 mb-24 items-stretch h-auto gap-[28px]">
        <MarqueeRow reviews={row1} direction="left" speed={45} delay={0.2} />
        <MarqueeRow reviews={row2} direction="right" speed={35} delay={0.32} />
      </div>

      {/* Bottom Trust Strip */}
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { stat: '4.9★', text: 'Google Rating', icon: 'star_rate' },
            { stat: '10+ Years', text: 'Engineering Excellence', icon: 'military_tech' },
            { stat: 'Residential · Commercial · Industrial', text: 'Multi-sector Expertise', icon: 'domain' },
            { stat: 'Quality Without Compromise', text: 'Built to Last', icon: 'verified' }
          ].map((tile, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white p-6 rounded-[20px] border border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col hover:border-[#1EA7FF]/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-[12px] bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[#1EA7FF]">{tile.icon}</span>
              </div>
              <h4 className="font-['Plus_Jakarta_Sans',_sans-serif] text-[18px] font-bold text-[#071A2F] mb-1">
                {tile.stat}
              </h4>
              <div className="w-8 h-[2px] bg-[#1EA7FF]/30 my-2"></div>
              <p className="font-['Inter',_sans-serif] text-[13px] text-[#5B6472] uppercase tracking-wider font-semibold">
                {tile.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
    </section>
  );
}
