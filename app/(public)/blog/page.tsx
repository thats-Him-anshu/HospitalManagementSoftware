"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { useState } from "react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";

const blogPosts = [
  {
    slug: "reversing-diabetes-naturopathy-diet",
    title: "Reversing Diabetes Through Naturopathy & Traditional Indian Foods",
    excerpt:
      "Learn how natural fiber-rich millets, herbal juices, and targeted naturopathy detox treatments help restore insulin sensitivity and stabilize blood sugar naturally.",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop",
    date: "August 1, 2026",
    category: "Diet & Nutrition",
    readTime: "5 min read",
  },
  {
    slug: "acupuncture-science-chronic-pain-relief",
    title: "The Healing Science Behind Acupuncture for Chronic Pain",
    excerpt:
      "Acupuncture stimulates energy meridians and triggers endorphin release to cure chronic back, joint, and nerve pain without dependence on painkillers.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    date: "July 25, 2026",
    category: "Acupuncture",
    readTime: "6 min read",
  },
  {
    slug: "therapeutical-yoga-thyroid-hormonal-balance",
    title: "Therapeutical Yoga: Specific Asanas for Thyroid & Hormonal Balance",
    excerpt:
      "Discover how targeted yogic postures and pranayama techniques stimulate endocrine glands and restore hormonal harmony naturally.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&h=400&fit=crop",
    date: "July 18, 2026",
    category: "Yoga Therapy",
    readTime: "7 min read",
  },
  {
    slug: "hydrotherapy-detoxification-body-healing",
    title: "Hydrotherapy & Detoxification: How Water Heals the Human Body",
    excerpt:
      "From hip baths to steam therapy, water-based naturopathic treatments cleanse metabolic toxins, boost circulation, and relieve stress.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    date: "July 10, 2026",
    category: "Naturopathy",
    readTime: "4 min read",
  },
  {
    slug: "understanding-naturopathy-root-cause-healing",
    title: "Understanding Naturopathy: Treating the Root Cause of Disease",
    excerpt:
      "Naturopathy views the body as a self-healing organism. Explore how five-element natural medicine cures chronic lifestyle disorders permanently.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    date: "June 28, 2026",
    category: "Naturopathy",
    readTime: "5 min read",
  },
  {
    slug: "daily-habits-weight-loss-vitality",
    title: "Simple Daily Habits for Sustainable Weight Loss and Vitality",
    excerpt:
      "Actionable natural lifestyle practices, meal timing principles, and hydration routines to lose weight and regain energy effortlessly.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop",
    date: "June 15, 2026",
    category: "Wellness",
    readTime: "5 min read",
  },
];

const categories = ["All", "Naturopathy", "Acupuncture", "Yoga Therapy", "Diet & Nutrition", "Wellness"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display"
          >
            Health & Wellness Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-medical-100/90 max-w-2xl mx-auto"
          >
            Expert insights on Naturopathy, Acupuncture, Traditional Diets, and Holistic Healing.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <ScrollReveal3D>
            <div className="mb-12 space-y-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-medical-600 focus:ring-2 focus:ring-medical-200 outline-none transition-all text-sm"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                      activeCategory === cat
                        ? "bg-medical-700 text-white shadow-md"
                        : "bg-surface text-gray-700 hover:bg-medical-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </ScrollReveal3D>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <ScrollReveal3D key={post.slug} delay={index * 0.08}>
                <article className="group bg-white rounded-2xl overflow-hidden border border-medical-100 hover:border-medical-300 hover:shadow-card transition-all duration-300 flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-medical-800 text-[11px] font-bold shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-medical-600" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-medical-600" />
                          {post.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-medical-900 mb-2.5 group-hover:text-medical-700 transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-medical-700 font-bold text-xs hover:text-medical-900 transition-colors pt-3 border-t border-gray-100"
                    >
                      Read Full Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal3D>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm">No articles found matching your query.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
