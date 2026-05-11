"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Globe,
  Link as LinkIcon,
  MessageCircle,
  Heart,
} from "lucide-react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";

const blogPosts = [
  {
    slug: "benefits-acupuncture-chronic-pain",
    title: "The Science Behind Acupuncture for Chronic Pain Relief",
    content: `
      <p>Acupuncture, a cornerstone of Traditional Chinese Medicine, has been practiced for thousands of years. Today, modern science is catching up to what practitioners have long known: acupuncture is a powerful tool for managing chronic pain.</p>
      
      <h3>How Does Acupuncture Work?</h3>
      <p>Research suggests that acupuncture stimulates the nervous system, triggering the release of endorphins and other neurochemicals. These natural painkillers help reduce inflammation and promote healing throughout the body.</p>
      
      <h3>Conditions Treated</h3>
      <p>Studies have shown acupuncture to be effective for lower back pain, osteoarthritis, migraines, and fibromyalgia. At Nidarsanam, we've seen remarkable results in patients who had previously found little relief from conventional treatments.</p>
      
      <h3>The Nidarsanam Approach</h3>
      <p>Our licensed acupuncturists combine traditional techniques with modern understanding of anatomy and physiology. Each treatment is tailored to the individual, ensuring optimal results.</p>
      
      <p>Whether you're dealing with persistent back pain, joint issues, or neuropathic pain, acupuncture may offer the relief you've been seeking.</p>
    `,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop",
    date: "May 5, 2026",
    category: "Acupuncture",
    readTime: "5 min read",
    author: "Dr. Sarah Lin",
    authorRole: "Lead Acupuncturist",
    authorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop",
  },
  {
    slug: "holistic-approach-mental-health",
    title: "A Holistic Approach to Mental Health and Wellness",
    content: `<p>Mental health is not just about the mind—it's about the entire body. At Nidarsanam, we believe in treating mental health through an integrative lens.</p>`,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=600&fit=crop",
    date: "April 28, 2026",
    category: "Wellness",
    readTime: "7 min read",
    author: "Dr. Michael Chen",
    authorRole: "Integrative Medicine",
    authorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
  },
  {
    slug: "yoga-therapy-recovery",
    title: "Yoga Therapy: A Path to Physical Recovery",
    content: `<p>Yoga therapy goes beyond typical yoga classes. It's a personalized approach to healing that addresses specific physical conditions and injuries.</p>`,
    image: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&h=600&fit=crop",
    date: "April 20, 2026",
    category: "Yoga Therapy",
    readTime: "6 min read",
    author: "Emma Williams",
    authorRole: "Yoga Therapist",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
];

const relatedPosts = [
  {
    slug: "naturopathy-immune-system",
    title: "Boosting Your Immune System Naturally",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
    date: "April 15, 2026",
  },
  {
    slug: "understanding-physiotherapy",
    title: "Understanding Physiotherapy: Beyond Exercise",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop",
    date: "April 8, 2026",
  },
  {
    slug: "pain-management-techniques",
    title: "Modern Pain Management Techniques",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&h=250&fit=crop",
    date: "March 30, 2026",
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts.find((p) => p.slug === slug) || blogPosts[0];

  return (
    <>
      <section className="pt-32 pb-16 gradient-green">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-earth-200 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-medical-300 text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-earth-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-white">{post.author}</div>
                  <div className="text-sm">{post.authorRole}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal3D>
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </ScrollReveal3D>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ScrollReveal3D>
                <div
                  className="prose prose-lg max-w-none prose-headings:text-medical-900 prose-headings:font-display prose-p:text-gray-600 prose-a:text-medical-600 prose-strong:text-medical-800"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </ScrollReveal3D>

              <ScrollReveal3D delay={0.2}>
                <div className="mt-12 pt-8 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                        <span className="text-sm">Like</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-medical-600 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">Comment</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 mr-2">Share:</span>
                      {[Globe, LinkIcon, MessageCircle].map((Icon, i) => (
                        <button
                          key={i}
                          className="w-9 h-9 rounded-full bg-earth-50 flex items-center justify-center hover:bg-medical-100 transition-colors"
                        >
                          <Icon className="w-4 h-4 text-gray-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal3D>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <ScrollReveal3D delay={0.1}>
                <div className="p-6 rounded-2xl bg-medical-50 border border-medical-100">
                  <h3 className="font-bold text-medical-900 mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-medical-900">{post.author}</div>
                      <div className="text-sm text-gray-600">{post.authorRole}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Expert in integrative medicine with over 15 years of clinical experience.
                  </p>
                </div>
              </ScrollReveal3D>

              <ScrollReveal3D delay={0.2}>
                <div>
                  <h3 className="font-bold text-medical-900 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog/${related.slug}`}
                        className="flex gap-4 group"
                      >
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-medical-900 group-hover:text-medical-600 transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <span className="text-xs text-gray-500 mt-1 block">
                            {related.date}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </ScrollReveal3D>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
