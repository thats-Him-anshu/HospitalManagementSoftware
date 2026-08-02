"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  Eye,
  Target,
  Award,
  Users,
  Clock,
  Shield,
  Stethoscope,
} from "lucide-react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";
import SectionHeading from "@/components/public/SectionHeading";
import GlowCard from "@/components/public/GlowCard";

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We treat every patient with empathy, dignity, and personal care.",
  },
  {
    icon: Target,
    title: "Root-Cause Healing",
    description: "Eliminating the root origin of diseases rather than suppressing symptoms.",
  },
  {
    icon: Eye,
    title: "Integrity",
    description: "Transparent, honest, and ethical in all our clinical recommendations.",
  },
  {
    icon: Shield,
    title: "Natural Wisdom",
    description: "Embracing authentic Naturopathy, Acupuncture, and Indian food nutrition.",
  },
];

const highlights = [
  { icon: Users, value: "10+", label: "Medical Staff & Therapists" },
  { icon: Award, value: "15+", label: "Debate & Clinical Awards" },
  { icon: Clock, value: "5+", label: "Years of Service" },
  { icon: Stethoscope, value: "500+", label: "Patients Treated" },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="pt-32 pb-16 gradient-hero text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display tracking-tight"
          >
            About Nidarsanam Health Care
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg text-medical-100/90 max-w-2xl mx-auto"
          >
            The Path to Real Health — Reversing lifestyle diseases naturally through BNYS Naturopathy & Yogic Sciences.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <ScrollReveal3D direction="right">
              <div className="relative rounded-3xl overflow-hidden shadow-card border border-medical-100">
                <Image
                  src="/assets/clinic.jpg"
                  alt="Nidarsanam Health Care, Dharmapuri"
                  width={600}
                  height={500}
                  className="object-cover w-full h-[400px] sm:h-[480px]"
                />
              </div>
            </ScrollReveal3D>

            <div>
              <SectionHeading
                subtitle="Our Story"
                title="A Legacy of Natural Healing"
                align="left"
              />
              <ScrollReveal3D delay={0.1}>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  Nidarsanam Health Care was established in Dharmapuri with a single goal: to empower individuals to overcome chronic illnesses naturally. We believe that the human body possesses an innate ability to heal when supported with natural therapies, proper nutrition, and mental peace.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
                  Over the years, our clinic has successfully treated over 500 patients suffering from diabetes, hypertension, neck & joint pain, obesity, and digestive disorders through personalized Naturopathy, Acupuncture, and therapeutical yoga.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <GlowCard className="p-5">
                    <Target className="w-7 h-7 text-medical-700 mb-2" />
                    <h4 className="font-bold text-medical-900 text-base mb-1">Our Mission</h4>
                    <p className="text-xs text-gray-600 leading-normal">
                      To provide accessible, high-quality Naturopathy & Yogic Science care that addresses the root cause of diseases.
                    </p>
                  </GlowCard>

                  <GlowCard className="p-5">
                    <Eye className="w-7 h-7 text-medical-700 mb-2" />
                    <h4 className="font-bold text-medical-900 text-base mb-1">Our Vision</h4>
                    <p className="text-xs text-gray-600 leading-normal">
                      To be India's leading Naturopathy center, enabling medication-free living through natural lifestyle medicine.
                    </p>
                  </GlowCard>
                </div>
              </ScrollReveal3D>
            </div>
          </div>

          {/* Values */}
          <SectionHeading
            subtitle="Our Values"
            title="What We Stand For"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ScrollReveal3D key={index} delay={index * 0.08}>
                <GlowCard className="h-full p-7 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-medical-700 text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <value.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-medical-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{value.description}</p>
                </GlowCard>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="py-20 md:py-28 bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <SectionHeading
                subtitle="Chief Doctor & Founder"
                title="Dr. Nidarsin"
                description="BNYS (Bachelor of Naturopathy & Yogic Sciences)"
                align="left"
              />
              <ScrollReveal3D delay={0.1}>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  Dr. Nidarsin is a passionate BNYS Naturopathy Doctor trained under highly experienced specialists. Nationally award-winning and widely recognized for delivering 15+ impactful debate sessions on natural lifestyle medicine.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 text-sm sm:text-base">
                  With a strong belief in natural healing, Dr. Nidarsin helps patients reverse lifestyle disorders and manage health effectively through personalized diet, yoga, and acupuncture — achieving lasting results without side effects.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {["Naturopathy Doctor", "Acupuncture & Moxibustion", "Diet & Nutrition", "Lifestyle Disorder Management"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-3.5 py-1.5 rounded-full bg-medical-100/90 text-medical-900 text-xs font-semibold shadow-xs"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </ScrollReveal3D>
            </div>

            <ScrollReveal3D className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl overflow-hidden shadow-card border-2 border-medical-100">
                  <Image
                    src="/assets/doctor-nidarsin.jpg"
                    alt="Dr. Nidarsin"
                    width={500}
                    height={600}
                    className="object-cover w-full h-[450px]"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl p-4 border border-medical-100 hidden sm:block">
                  <div className="text-2xl font-bold text-medical-800">5+ Years</div>
                  <div className="text-xs text-gray-500 font-medium">Clinical Experience</div>
                </div>
              </div>
            </ScrollReveal3D>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <ScrollReveal3D key={index} delay={index * 0.08}>
                <GlowCard className="p-6 sm:p-8 text-center">
                  <item.icon className="w-8 h-8 text-medical-700 mx-auto mb-3" />
                  <div className="text-2xl sm:text-3xl font-bold text-medical-900 mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{item.label}</div>
                </GlowCard>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
