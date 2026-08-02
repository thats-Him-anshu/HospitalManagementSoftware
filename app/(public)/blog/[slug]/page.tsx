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
    slug: "reversing-diabetes-naturopathy-diet",
    title: "Reversing Diabetes Through Naturopathy & Traditional Indian Foods",
    content: `
      <p>Diabetes is primarily a lifestyle and metabolic disorder rather than an incurable lifelong sentence. In Naturopathy, we focus on restoring normal pancreatic function and insulin sensitivity by removing metabolic waste (toxins) from the body.</p>
      
      <h3>The Role of Traditional Indian Foods</h3>
      <p>Unpolished millets, raw vegetable juices, herbal decoctions, and traditional Indian whole foods play a crucial role in regulating blood glucose levels. Foods such as fenugreek seeds, bitter gourd, curry leaves, and amla possess potent anti-diabetic properties.</p>
      
      <h3>Hydrotherapy & Detoxification</h3>
      <p>Naturopathic treatments like cold abdominal packs, mud baths, and steam baths enhance peripheral circulation and stimulate pancreatic microcirculation, accelerating cellular glucose uptake.</p>
      
      <h3>Long-term Benefits</h3>
      <p>By combining dietary discipline with daily yogic practices, patients can gradually reduce dependence on external medications while achieving stable blood sugar levels naturally.</p>
    `,
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&h=600&fit=crop",
    date: "August 1, 2026",
    category: "Diet & Nutrition",
    readTime: "5 min read",
    author: "Dr. Nidarsin",
    authorRole: "BNYS Naturopathy Doctor",
    authorImage: "/assets/doctor-nidarsin.jpg",
  },
  {
    slug: "acupuncture-science-chronic-pain-relief",
    title: "The Healing Science Behind Acupuncture for Chronic Pain",
    content: `
      <p>Acupuncture is an ancient healing art that involves inserting ultra-fine sterile needles into specific anatomical points (meridians) across the human body.</p>
      
      <h3>How Acupuncture Relieves Pain</h3>
      <p>Stimulating acupuncture points activates the central nervous system, prompting the release of endorphins (the body's natural painkillers) and anti-inflammatory neurotransmitters. This reduces pain perception and relaxes tense muscular structures.</p>
      
      <h3>Conditions Effectively Treated</h3>
      <p>Acupuncture has proven exceptionally effective for cervical spondylosis, lumbar disk pain, knee osteoarthritis, sciatica, and chronic migraine headaches.</p>
    `,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop",
    date: "July 25, 2026",
    category: "Acupuncture",
    readTime: "6 min read",
    author: "Dr. Nidarsin",
    authorRole: "BNYS Naturopathy Doctor",
    authorImage: "/assets/doctor-nidarsin.jpg",
  },
  {
    slug: "therapeutical-yoga-thyroid-hormonal-balance",
    title: "Therapeutical Yoga: Specific Asanas for Thyroid & Hormonal Balance",
    content: `
      <p>Therapeutical yoga differs from generic yoga practice by tailoring specific postures (asanas), breathing exercises (pranayama), and relaxation routines to treat medical conditions.</p>
      
      <h3>Stimulating the Thyroid Gland</h3>
      <p>Postures such as Sarvangasana (Shoulder Stand), Matsyasana (Fish Pose), and Ujjayi Pranayama create targeted compression and flushing of the thyroid gland, regulating T3, T4, and TSH secretion.</p>
    `,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200&h=600&fit=crop",
    date: "July 18, 2026",
    category: "Yoga Therapy",
    readTime: "7 min read",
    author: "Dr. Nidarsin",
    authorRole: "BNYS Naturopathy Doctor",
    authorImage: "/assets/doctor-nidarsin.jpg",
  },
];

const relatedPosts = [
  {
    slug: "hydrotherapy-detoxification-body-healing",
    title: "Hydrotherapy & Detoxification: How Water Heals the Body",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=250&fit=crop",
    date: "July 10, 2026",
  },
  {
    slug: "understanding-naturopathy-root-cause-healing",
    title: "Understanding Naturopathy: Root-Cause Disease Healing",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=250&fit=crop",
    date: "June 28, 2026",
  },
];

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const post = blogPosts.find((p) => p.slug === slug) || blogPosts[0];

  return (
    <>
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-medical-200 hover:text-white transition-colors mb-6 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Health Blog
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-medical-200 text-xs font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 font-display leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-medical-100/90 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={post.authorImage}
                    alt={post.author}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold text-white">{post.author}</div>
                  <div className="text-xs text-medical-200">{post.authorRole}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-medical-300" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-medical-300" />
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
            <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-12 shadow-card border border-medical-100">
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
                  className="blog-content text-gray-700 text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </ScrollReveal3D>

              <ScrollReveal3D delay={0.2}>
                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">Nidarsanam Health Care — Patient Education</span>
                  <Link
                    href="/appointments"
                    className="px-5 py-2.5 rounded-full bg-medical-700 hover:bg-medical-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Book Consultation
                  </Link>
                </div>
              </ScrollReveal3D>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <ScrollReveal3D delay={0.1}>
                <div className="p-6 rounded-2xl bg-surface border border-medical-100">
                  <h3 className="font-bold text-medical-900 text-sm mb-4">About the Author</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-medical-200">
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-medical-900 text-sm">{post.author}</div>
                      <div className="text-xs text-gray-600">{post.authorRole}</div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Dedicated BNYS Naturopath specializing in lifestyle disease reversal, acupuncture, and natural traditional nutrition.
                  </p>
                </div>
              </ScrollReveal3D>

              <ScrollReveal3D delay={0.2}>
                <div>
                  <h3 className="font-bold text-medical-900 text-sm mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/blog`}
                        className="flex gap-3 group"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-medical-100">
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-medical-900 group-hover:text-medical-700 transition-colors line-clamp-2 leading-snug">
                            {related.title}
                          </h4>
                          <span className="text-[10px] text-gray-500 mt-1 block">
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
