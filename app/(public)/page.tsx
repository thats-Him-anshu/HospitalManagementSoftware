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
  CheckCircle2,
} from "lucide-react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";
import SectionHeading from "@/components/public/SectionHeading";
import GlowCard from "@/components/public/GlowCard";

const treatments = [
  {
    icon: Leaf,
    title: "Naturopathy",
    description:
      "Natural healing methods using hydrotherapy, mud therapy, herbal medicine, and lifestyle counseling to activate the body's self-healing capacity.",
  },
  {
    icon: Sparkles,
    title: "Acupuncture",
    description:
      "Ancient healing technique using fine sterile needles to balance body energy (Qi), relieve chronic pain, and restore metabolic balance.",
  },
  {
    icon: Sun,
    title: "Yoga Therapy",
    description:
      "Therapeutical yoga sessions tailored to specific medical conditions for physical strength, mental clarity, and organ rejuvenation.",
  },
  {
    icon: Heart,
    title: "Diet & Nutrition",
    description:
      "Personalized healing diets based on Indian traditional foods, herbal juices, and detox principles to reverse chronic lifestyle diseases.",
  },
  {
    icon: Activity,
    title: "Physiotherapy",
    description:
      "Therapeutic exercises, manual therapy, and posture correction to restore mobility, strengthen joints, and accelerate injury recovery.",
  },
  {
    icon: Zap,
    title: "Pain Management",
    description:
      "Comprehensive non-invasive pain relief combining acupuncture, moxibustion, heat therapy, and therapeutic yoga.",
  },
];

const testimonials = [
  {
    name: "K. Subramanian",
    role: "Patient (Dharmapuri)",
    initials: "KS",
    text: "After struggling with diabetes and high BP for years, Dr. Nidarsin's naturopathy and diet plan completely transformed my health. My sugar levels are normal now without heavy medication!",
    rating: 5,
  },
  {
    name: "S. Meenakshi",
    role: "Patient (Salem)",
    initials: "SM",
    text: "The acupuncture and therapeutic yoga sessions gave me permanent relief from severe neck and back pain. The staff and care at Nidarsanam are truly exceptional.",
    rating: 5,
  },
  {
    name: "R. Venkatesh",
    role: "Patient (Krishnagiri)",
    initials: "RV",
    text: "Nidarsanam Health Care offers authentic natural healing. The plantain leaf bath and detox diet helped me lose weight and feel energized again!",
    rating: 5,
  },
];

const stats = [
  { icon: Users, value: "10+", label: "Expert Doctors & Therapists" },
  { icon: Heart, value: "99%", label: "Success Rate" },
  { icon: Shield, value: "500+", label: "Patients Treated" },
  { icon: Award, value: "5+", label: "Years Experience" },
];

const features = [
  {
    icon: Shield,
    title: "Root-Cause Healing",
    description: "Treating underlying causes of lifestyle disorders without side effects.",
  },
  {
    icon: Clock,
    title: "Personalized Consultation",
    description: "In-depth health assessment by qualified BNYS Naturopathy specialists.",
  },
  {
    icon: Users,
    title: "Expert Medical Care",
    description: "Award-winning Naturopaths and trained therapists committed to your health.",
  },
  {
    icon: Award,
    title: "Traditional Indian Diets",
    description: "Customized nutrition charts leveraging natural Indian whole foods & herbs.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section - Agency Fluid Motion & Depth */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden gradient-hero pt-28 pb-20">
        {/* Animated Light Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.25, 0.15],
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-20 w-[32rem] h-[32rem] bg-medical-400 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, -40, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 right-0 w-[36rem] h-[36rem] bg-medical-600 rounded-full blur-[120px]"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-medical-100 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-medical-300 animate-ping" />
                <span>India's Leading Naturopathy Centre</span>
              </motion.div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.14] mb-6 font-display tracking-tight">
                The Real Path to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-300 via-medical-200 to-white font-extrabold">
                  Health
                </span>
              </h1>

              <p className="text-base sm:text-lg text-medical-100/90 mb-8 max-w-2xl leading-relaxed">
                Experience natural healing and disease reversal at Nidarsanam Health Care. Under the expert guidance of Dr. Nidarsin (BNYS), we combine Naturopathy, Acupuncture, Therapeutical Yoga, and Traditional Indian Food Diets to help you live a vibrant, medication-free life.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/appointments"
                    className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-full bg-white text-medical-950 font-bold text-sm shadow-xl hover:bg-medical-50 transition-all"
                  >
                    <Calendar className="w-4 h-4 text-medical-700" />
                    Book Consultation
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <a
                    href="tel:9952338765"
                    className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    <Phone className="w-4 h-4 text-medical-300" />
                    Call: 9952338765
                  </a>
                </motion.div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-medical-100/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-300" />
                  <span>100% Side-Effect Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-300" />
                  <span>BNYS Qualified Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-medical-300" />
                  <span>Holistic Disease Reversal</span>
                </div>
              </div>
            </motion.div>

            {/* Right Doctor Portrait Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <motion.div
                whileHover={{ y: -8, rotateY: 2 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ perspective: 1000 }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/15 bg-medical-950">
                  <Image
                    src="/assets/doctor-nidarsin.jpg"
                    alt="Dr. Nidarsin at Nidarsanam Health Care"
                    width={500}
                    height={600}
                    className="object-cover w-full h-[320px] sm:h-[420px] md:h-[480px] lg:h-[540px]"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-medical-950 via-medical-950/20 to-transparent flex flex-col justify-end p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-medical-300">Chief Naturopath</span>
                    <h3 className="text-2xl font-bold text-white">Dr. Nidarsin</h3>
                    <p className="text-xs text-medical-100/90 mt-1">BNYS (Bachelor of Naturopathy & Yogic Sciences)</p>
                    <p className="text-xs text-medical-200/80 italic mt-2">"The Path to Real Health"</p>
                  </div>
                </div>

                {/* Floating Experience Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-medical-100 hidden sm:flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-medical-700 flex items-center justify-center text-white">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-medical-900">15+ Debate Awards</div>
                    <div className="text-[11px] text-gray-600">Nationally Recognized Speaker</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-center transition-all"
              >
                <stat.icon className="w-7 h-7 text-medical-300 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-medical-100/85">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Teaser Section */}
      <section className="py-20 md:py-28 bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal3D direction="right">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-card border border-medical-100/80">
                  <Image
                    src="/assets/clinic.jpg"
                    alt="Nidarsanam Health Care"
                    width={600}
                    height={480}
                    className="object-cover w-full h-[260px] sm:h-[340px] md:h-[400px] lg:h-[450px]"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-5 border border-medical-100 hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-medical-100 flex items-center justify-center">
                      <Award className="w-6 h-6 text-medical-700" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-medical-900">5+</div>
                      <div className="text-xs text-gray-600 font-medium">Years of Excellence</div>
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
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
                  Nidarsanam Health Care is a specialized Naturopathy & Yogic Sciences clinic in Dharmapuri dedicated to restoring health naturally without harmful chemicals or unnecessary surgeries.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8 text-sm sm:text-base">
                  Our integrative approach combines traditional Indian nutritional wisdom, hydrotherapy, acupuncture, and therapeutic yoga to reverse lifestyle disorders such as diabetes, hypertension, arthritis, and obesity at their root cause.
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {features.slice(0, 2).map((feature, i) => (
                    <GlowCard key={i} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-medical-50 flex items-center justify-center shrink-0">
                          <feature.icon className="w-5 h-5 text-medical-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-medical-900 text-sm mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-normal">{feature.description}</p>
                        </div>
                      </div>
                    </GlowCard>
                  ))}
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-medical-700 font-bold hover:text-medical-900 transition-colors text-sm group"
                >
                  Discover Our Story
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </ScrollReveal3D>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Our Specializations"
            title="Comprehensive Natural Treatments"
            description="Discover natural healing therapies designed to reverse lifestyle disorders, manage pain, and restore vital energy without medications."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {treatments.map((treatment, index) => (
              <ScrollReveal3D key={index} delay={index * 0.07}>
                <GlowCard className="h-full p-7 flex flex-col justify-between group">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-medical-700 text-white flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <treatment.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-medical-900 mb-2.5">
                      {treatment.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {treatment.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-medical-100/60 flex items-center gap-2 text-medical-700 font-semibold text-xs group-hover:text-medical-900">
                    <span>Explore Treatment</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlowCard>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-28 gradient-green relative overflow-hidden text-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <SectionHeading
            subtitle="Why Choose Us"
            title="The Nidarsanam Difference"
            light
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal3D key={index} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-medical-200">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-medical-100/80 text-xs leading-relaxed">{feature.description}</p>
                </motion.div>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Patient Experiences"
            title="What Our Patients Say"
            description="Real recovery stories from individuals who renewed their health with Nidarsanam."
          />

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal3D key={index} delay={index * 0.1}>
                <GlowCard className="h-full p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-medical-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-medical-900 text-sm">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </GlowCard>
              </ScrollReveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal3D>
            <div className="relative rounded-3xl overflow-hidden gradient-hero p-6 sm:p-10 md:p-14 text-center text-white shadow-2xl">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 font-display">
                  Ready to Start Your Healing Journey?
                </h2>
                <p className="text-base sm:text-lg text-medical-100/90 mb-8 leading-relaxed">
                  Book an appointment today and take the first step towards a healthier, medication-free life.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-3 sm:gap-4">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <Link
                      href="/appointments"
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-medical-950 font-bold text-sm shadow-lg hover:bg-medical-50 transition-all"
                    >
                      <Calendar className="w-4 h-4 text-medical-700" />
                      Book Appointment
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <a
                      href="tel:9952338765"
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all"
                    >
                      <Phone className="w-4 h-4 text-medical-300" />
                      Call: 9952338765
                    </a>
                  </motion.div>
                </div>
              </div>
            </div>
          </ScrollReveal3D>
        </div>
      </section>
    </>
  );
}
