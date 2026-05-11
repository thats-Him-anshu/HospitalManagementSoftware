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

const values = [
  {
    icon: Heart,
    title: "Compassion",
    description: "We treat every patient with empathy, dignity, and respect.",
  },
  {
    icon: Target,
    title: "Excellence",
    description: "Committed to the highest standards of medical care.",
  },
  {
    icon: Eye,
    title: "Integrity",
    description: "Transparent, honest, and ethical in all our practices.",
  },
  {
    icon: Shield,
    title: "Innovation",
    description: "Embracing modern techniques while honoring traditional wisdom.",
  },
];

const highlights = [
  { icon: Users, value: "50+", label: "Medical Staff" },
  { icon: Award, value: "25+", label: "Awards Won" },
  { icon: Clock, value: "15+", label: "Years of Service" },
  { icon: Stethoscope, value: "10k+", label: "Procedures Done" },
];

export default function AboutPage() {
  return (
    <>
      {/* Page Header */}
      <section className="pt-32 pb-16 gradient-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            About Nidarsanam
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-earth-100 max-w-2xl mx-auto"
          >
            A legacy of healing, innovation, and compassionate care.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <ScrollReveal3D>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&h=500&fit=crop"
                  alt="Hospital Building"
                  width={600}
                  height={500}
                  className="object-cover w-full"
                />
              </div>
            </ScrollReveal3D>

            <div>
              <SectionHeading
                subtitle="Our Story"
                title="A Decade of Dedication"
                align="left"
              />
              <ScrollReveal3D delay={0.1}>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Founded in 2009, Nidarsanam Health Care began with a simple mission: to
                  bridge the gap between conventional medicine and holistic
                  healing. What started as a small clinic has grown into a
                  premier healthcare institution.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Our integrated approach combines cutting-edge medical
                  technology with time-honored natural therapies, ensuring every
                  patient receives personalized, comprehensive care.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-medical-50 border border-medical-100">
                    <Target className="w-8 h-8 text-medical-600 mb-3" />
                    <h4 className="font-bold text-medical-900 mb-2">Mission</h4>
                    <p className="text-sm text-gray-600">
                      To provide accessible, high-quality healthcare that treats
                      the whole person.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-earth-50 border border-earth-100">
                    <Eye className="w-8 h-8 text-earth-600 mb-3" />
                    <h4 className="font-bold text-medical-900 mb-2">Vision</h4>
                    <p className="text-sm text-gray-600">
                      To be the leading integrative healthcare provider,
                      transforming lives through holistic wellness.
                    </p>
                  </div>
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
              <ScrollReveal3D key={index} delay={index * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-earth-50 border border-earth-100 hover:border-medical-200 hover:shadow-xl transition-all hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-medical-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Profile */}
      <section className="py-20 md:py-32 gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <SectionHeading
                subtitle="Leadership"
                title="Dr. Jonathan Reeves"
                description="Founder & Chief Medical Officer"
                align="left"
              />
              <ScrollReveal3D delay={0.1}>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  With over 20 years of experience in integrative medicine, Dr.
                  Reeves founded Nidarsanam to create a space where patients
                  could access both cutting-edge treatments and holistic
                  therapies under one roof.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Board-certified in Internal Medicine and fellowship-trained in
                  Integrative Medicine, Dr. Reeves has pioneered treatment
                  protocols that combine the best of Eastern and Western
                  medical traditions.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Internal Medicine", "Integrative Health", "Pain Management", "Holistic Care"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-full bg-medical-100 text-medical-800 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </ScrollReveal3D>
            </div>

            <ScrollReveal3D className="order-1 lg:order-2">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&h=600&fit=crop"
                    alt="Dr. Jonathan Reeves"
                    width={500}
                    height={600}
                    className="object-cover w-full"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
                  <div className="text-3xl font-bold text-medical-700">20+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
              </div>
            </ScrollReveal3D>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((item, index) => (
              <ScrollReveal3D key={index} delay={index * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-medical-50 to-earth-50 border border-medical-100 hover:shadow-xl transition-all">
                  <item.icon className="w-10 h-10 text-medical-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-medical-900 mb-1">
                    {item.value}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
