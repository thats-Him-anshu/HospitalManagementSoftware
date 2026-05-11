"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Search } from "lucide-react";
import { useState } from "react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";

const blogPosts = [
  {
    slug: "benefits-acupuncture-chronic-pain",
    title: "The Science Behind Acupuncture for Chronic Pain Relief",
    excerpt:
      "Discover how ancient needle therapy is backed by modern science to provide lasting relief from chronic pain conditions.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
    date: "May 5, 2026",
    category: "Acupuncture",
    readTime: "5 min read",
  },
  {
    slug: "holistic-approach-mental-health",
    title: "A Holistic Approach to Mental Health and Wellness",
    excerpt:
      "Exploring the connection between physical health, nutrition, and mental wellbeing in our modern world.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    date: "April 28, 2026",
    category: "Wellness",
    readTime: "7 min read",
  },
  {
    slug: "yoga-therapy-recovery",
    title: "Yoga Therapy: A Path to Physical Recovery",
    excerpt:
      "How therapeutic yoga is helping patients recover from injuries and surgeries faster than traditional methods alone.",
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop",
    date: "April 20, 2026",
    category: "Yoga Therapy",
    readTime: "6 min read",
  },
  {
    slug: "naturopathy-immune-system",
    title: "Boosting Your Immune System Naturally",
    excerpt:
      "Natural remedies and lifestyle changes that can strengthen your body's defense mechanism effectively.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    date: "April 15, 2026",
    category: "Naturopathy",
    readTime: "4 min read",
  },
  {
    slug: "understanding-physiotherapy",
    title: "Understanding Physiotherapy: Beyond Exercise",
    excerpt:
      "Physiotherapy is more than just exercises. Learn about the comprehensive techniques used by professionals.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    date: "April 8, 2026",
    category: "Physiotherapy",
    readTime: "8 min read",
  },
  {
    slug: "pain-management-techniques",
    title: "Modern Pain Management Techniques",
    excerpt:
      "An overview of the latest non-invasive pain management techniques available at Nidarsanam.",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=600&h=400&fit=crop",
    date: "March 30, 2026",
    category: "Pain Management",
    readTime: "5 min read",
  },
];

const categories = ["All", "Acupuncture", "Wellness", "Yoga Therapy", "Naturopathy", "Physiotherapy", "Pain Management"];

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
      <section className="pt-32 pb-16 gradient-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Health & Wellness Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-earth-100 max-w-2xl mx-auto"
          >
            Insights, tips, and stories from our medical experts.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <ScrollReveal3D>
            <div className="mb-12 space-y-6">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat
                        ? "gradient-green text-white shadow-lg"
                        : "bg-earth-50 text-gray-700 hover:bg-medical-50"
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
              <ScrollReveal3D key={post.slug} delay={index * 0.1}>
                <article className="group bg-white rounded-2xl overflow-hidden border border-earth-100 hover:border-medical-200 hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-medical-700 text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-medical-900 mb-3 group-hover:text-medical-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-medical-600 font-semibold text-sm hover:text-medical-800 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              </ScrollReveal3D>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
