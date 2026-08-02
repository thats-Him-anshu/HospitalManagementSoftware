"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  MessageSquare,
  Loader2,
  CheckCircle,
} from "lucide-react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["3/50D, Renuga Devi Kovil Street", "Manthoppu, Dharmapuri, 636701"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["9952338765", "9952338765"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["nidarsanamhealthcare@gmail.com", "nidarsanamhealthcare@gmail.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Sat: 10:00 AM - 8:00 PM", "Sunday: By Appointment"],
  },
];

export default function ContactPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          source: "website",
          interest: "General Consultation",
          notes: [formData.message],
        }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      router.push("/thank-you");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <>
      <section className="pt-32 pb-16 gradient-hero text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg text-medical-100/90 max-w-2xl mx-auto"
          >
            We'd love to hear from you. Reach out to schedule a consultation or visit our healthcare clinic in Dharmapuri.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-7">
              <ScrollReveal3D>
                <div className="bg-surface rounded-3xl p-8 sm:p-10 border border-medical-100 shadow-soft">
                  <h2 className="text-2xl font-bold text-medical-900 mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mb-6">
                    Fill in your contact details below and our team will get back to you promptly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-700" />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                            errors.name ? "border-red-400" : "border-gray-200"
                          } focus:border-medical-600 focus:ring-2 focus:ring-medical-200 outline-none transition-all text-sm bg-white`}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-700" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter 10-digit phone number"
                            className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                              errors.phone ? "border-red-400" : "border-gray-200"
                            } focus:border-medical-600 focus:ring-2 focus:ring-medical-200 outline-none transition-all text-sm bg-white`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-medical-700" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-medical-600 focus:ring-2 focus:ring-medical-200 outline-none transition-all text-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                        How can we help you? *
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-medical-700" />
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          placeholder="Tell us about your health concerns or appointment query..."
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                            errors.message ? "border-red-400" : "border-gray-200"
                          } focus:border-medical-600 focus:ring-2 focus:ring-medical-200 outline-none transition-all text-sm bg-white resize-none`}
                        />
                      </div>
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-500">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-medical-700 hover:bg-medical-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </ScrollReveal3D>
            </div>

            {/* Contact Details & Map */}
            <div className="lg:col-span-5 space-y-8">
              <ScrollReveal3D delay={0.1}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="p-5 rounded-2xl bg-white border border-medical-100 shadow-soft"
                    >
                      <div className="w-10 h-10 rounded-xl bg-medical-50 flex items-center justify-center mb-3 text-medical-700">
                        <info.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-medical-900 text-sm mb-1.5">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-xs text-gray-600 leading-normal">
                          {detail}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollReveal3D>

              {/* Map Embed */}
              <ScrollReveal3D delay={0.2}>
                <div className="rounded-2xl overflow-hidden shadow-card border border-medical-100 bg-surface">
                  <div className="p-4 bg-medical-900 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-medical-300" />
                      <span className="text-xs font-bold uppercase tracking-wider">Clinic Location</span>
                    </div>
                    <span className="text-[11px] text-medical-200">Dharmapuri, Tamil Nadu</span>
                  </div>
                  <iframe
                    title="Nidarsanam Health Care Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62447.88219460295!2d78.1345!3d12.1311!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bac164a66a6a9b5%3A0x6b44a2b2545d989f!2sDharmapuri%2C%20Tamil%20Nadu%20636701!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="240"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-60"
                  />
                  <div className="p-3 bg-white border-t border-medical-100 text-center">
                    <a
                      href="https://maps.google.com/?q=Dharmapuri,Tamil+Nadu,636701"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-medical-700 hover:text-medical-900 transition-colors inline-flex items-center gap-1"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </ScrollReveal3D>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
