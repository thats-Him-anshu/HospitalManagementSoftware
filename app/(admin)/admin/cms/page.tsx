"use client";

import { useState } from "react";
import HomepageTab from "@/components/cms/HomepageTab";
import AboutTab from "@/components/cms/AboutTab";
import TestimonialsTab from "@/components/cms/TestimonialsTab";
import BlogManagerTab from "@/components/cms/BlogManagerTab";
import GalleryTab from "@/components/cms/GalleryTab";
import SiteSettingsTab from "@/components/cms/SiteSettingsTab";

const tabs = [
  { id: "homepage", label: "Homepage" },
  { id: "about", label: "About Page" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blog", label: "Blog Manager" },
  { id: "gallery", label: "Gallery" },
  { id: "settings", label: "Site Settings" },
];

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState("homepage");

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">CMS Manager</h2>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 p-1 bg-surface rounded-xl border border-border">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text hover:bg-white/50"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "homepage" && <HomepageTab />}
      {activeTab === "about" && <AboutTab />}
      {activeTab === "testimonials" && <TestimonialsTab />}
      {activeTab === "blog" && <BlogManagerTab />}
      {activeTab === "gallery" && <GalleryTab />}
      {activeTab === "settings" && <SiteSettingsTab />}
    </div>
  );
}
