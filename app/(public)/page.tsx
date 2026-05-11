"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Activity,
  Leaf,
  Sun,
  Sparkles,
  Zap,
  Star,
  ArrowRight,
  Phone,
  Calendar,
  Shield,
  Users,
  Award,
  Clock,
} from "lucide-react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";
import SectionHeading from "@/components/public/SectionHeading";

const treatments = [
  {
    icon: Activity,
    title: "Physiotherapy",
    description:
      "Expert-guided physical therapy to restore movement, reduce pain, and improve quality of life.",
  },
  {
    icon: Sparkles,
    title: "Acupuncture",
    description:
      "Ancient healing technique using fine needles to balance energy flow and relieve chronic conditions.",
  },
  {
    icon: Sun,
    title: "Yoga Therapy",
    description:
      "Therapeutic yoga sessions tailored to your condition for mental and physical harmony.",
  },
  {
    icon: Zap,
    title: "Pain Management",
    description:
      "Comprehensive pain relief programs combining modern medicine with holistic approaches.",
  },
  {
    icon: Leaf,
    title: "Naturopathy",
    description:
      "Natural healing methods using herbal medicine, nutrition, and lifestyle counseling.",
  },
  {
    icon: Heart,
    title: "Rehabilitation",
    description:
      "Post-surgery and injury rehabilitation programs for complete recovery and strength.",
  },
];

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    text: "The care I received at Nidarsanam was exceptional. The physiotherapy team helped me recover from my injury faster than I ever expected.",
    rating: 5,
  },
  {
    name: "James Rodriguez",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    text: "After years of chronic back pain, their integrated pain management program finally gave me relief. Truly life-changing experience.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    role: "Patient",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    text: "The naturopathy and yoga therapy combination worked wonders for my stress and anxiety. A holistic approach that actually works.",
    rating: 5,
  },
];

const stats = [
  { icon: Users, value: "20+", label: "Expert Doctors" },
  { icon: Heart, value: "95%", label: "Success Rate" },
  { icon: Shield, value: "5,000+", label: "Patients Treated" },
  { icon: Award, value: "10+", label: "Years Experience" },
];

const features = [
  {
    icon: Shield,
    title: "Patient Safety First",
    description: "Rigorous safety protocols and sterilization standards.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency Care",
    description: "Round-the-clock emergency services with rapid response.",
  },
  {
    icon: Users,
    title: "Expert Medical Team",
    description: "Board-certified specialists with decades of experience.",
  },
  {
    icon: Award,
    title: "Award Winning Care",
    description: "Recognized for excellence in patient satisfaction.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden gradient-green">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-medical-400 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-6"
              >
                <Sparkles className="w-4 h-4" />
                <span>Premium Healthcare Services</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6">
                Compassionate Care,{" "}
                <span className="text-medical-300">Exceptional</span> Results
              </h1>

              <p className="text-lg md:text-xl text-earth-100 mb-8 max-w-xl leading-relaxed">
                Experience holistic healing with our team of dedicated medical
                professionals. Your health and wellness journey starts here.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/appointments"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-medical-800 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  Learn More
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 30 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ perspective: 1000 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                <Image
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=700&fit=crop"
                  alt="Doctor"
                  width={600}
                  height={700}
                  className="object-cover"
                  priority
                />
              </div>
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-8 -right-8 w-32 h-32 bg-medical-400/30 rounded-full blur-2xl"
              />
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-earth-400/20 rounded-full blur-2xl"
              />
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-transform"
              >
                <stat.icon className="w-8 h-8 text-medical-300 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-earth-200">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-20 md:py-32 gradient-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal3D>
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=500&fit=crop"
                    alt="Medical Team"
                    width={600}
                    height={500}
                    className="object-cover w-full"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-medical-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-medical-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-medical-900">15+</div>
                      <div className="text-sm text-gray-600">Years of Excellence</div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal3D>

            <div>
              <SectionHeading
                subtitle="About Us"
                title="Healing with Heart & Science"
                align="left"
              />
              <ScrollReveal3D delay={0.1}>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Nidarsanam Health Care is a team of experienced medical professionals
                  dedicated to providing comprehensive healthcare that addresses
                  the root cause, not just the symptoms.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Our integrative approach combines modern medical science with
                  time-tested holistic therapies, ensuring personalized treatment
                  plans for every patient who walks through our doors.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {features.slice(0, 2).map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-lg bg-medical-50 flex items-center justify-center shrink-0">
                        <feature.icon className="w-5 h-5 text-medical-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-medical-900 mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-medical-700 font-semibold hover:text-medical-900 transition-colors"
                >
                  Discover Our Story
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </ScrollReveal3D>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Our Services"
            title="Comprehensive Treatments"
            description="We offer a wide range of medical services designed to treat the whole person, not just the symptoms."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {treatments.map((treatment, index) => (
              <ScrollReveal3D key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ perspective: 1000 }}
                  className="group relative bg-earth-50 rounded-2xl p-8 border border-earth-100 hover:border-medical-200 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-medical-500 to-medical-700 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <treatment.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-medical-900 mb-3">
                    {treatment.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {treatment.description}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-medical-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-32 gradient-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-medical-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Why Choose Us"
            title="The Nidarsanam Difference"
            light
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal3D key={index} delay={index * 0.1}>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-medical-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-earth-200 text-sm">{feature.description}</p>
                </div>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-32 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Testimonials"
            title="What Our Patients Say"
            description="Real stories from real patients who have experienced the Nidarsanam difference."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal3D key={index} delay={index * 0.15}>
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-earth-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-medical-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal3D>
            <div className="relative rounded-3xl overflow-hidden gradient-green p-8 md:p-16 text-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-medical-300 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Ready to Start Your Healing Journey?
                </h2>
                <p className="text-lg text-earth-100 mb-8">
                  Book an appointment today and take the first step towards a
                  healthier, happier you.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/appointments"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-medical-800 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </Link>
                  <a
                    href="tel:+1234567890"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    Emergency Call
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal3D>
        </div>
      </section>
    </>
  );
}
