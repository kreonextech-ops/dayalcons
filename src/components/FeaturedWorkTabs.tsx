'use client';
import { useState } from 'react';
import { StaggerContainer, StaggerItem } from './FadeIn';
import HomeGalleryImage from './HomeGalleryImage';

import { projectsData as projects } from '@/lib/projectsData';

const categories = ["All", "Residential", "Commercial", "Interior"];

export default function FeaturedWorkTabs() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProjects = activeTab === "All" 
    ? projects.slice(0, 10)
    : projects.filter(p => p.category === activeTab).slice(0, 10);

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === cat 
                ? 'bg-[#18AFFF] text-white shadow-[0_4px_14px_rgba(24,175,255,0.39)]' 
                : 'bg-gray-100 text-[#5B6472] hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <StaggerContainer key={activeTab} className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {filteredProjects.map((p, idx) => (
            <StaggerItem key={idx}>
              <HomeGalleryImage img={p.img} idx={idx} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      ) : (
        <div className="w-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium">New {activeTab} projects coming soon.</p>
        </div>
      )}
    </div>
  );
}
