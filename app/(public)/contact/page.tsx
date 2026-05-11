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
  CheckCircle,
  Loader2,
} from "lucide-react";
import ScrollReveal3D from "@/components/public/ScrollReveal3D";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Wellness Avenue", "Green District, CA 90210"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+1 (234) 567-890", "+1 (234) 567-891"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["care@nidarsanam.com", "appointments@nidarsanam.com"],
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["Mon - Fri: 8:00 AM - 8:00 PM", "Sat: 9:00 AM - 5:00 PM"],
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
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    router.push("/thank-you");
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
      <section className="pt-32 pb-16 gradient-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-earth-100 max-w-2xl mx-auto"
          >
            We'd love to hear from you. Book an appointment or send us a message.
          </motion.p>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollReveal3D>
              <div className="bg-earth-50 rounded-3xl p-8 md:p-10 border border-earth-100">
                <h2 className="text-2xl font-bold text-medical-900 mb-6">
                  Send us a Message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={\`w-full pl-12 pr-4 py-3 rounded-xl border \${
                          errors.name ? "border-red-300" : "border-gray-200"
                        } focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all bg-white\`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className={\`w-full pl-12 pr-4 py-3 rounded-xl border \${
                            errors.email ? "border-red-300" : "border-gray-200"
                          } focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all bg-white\`}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+1 (234) 567-890"
                          className={\`w-full pl-12 pr-4 py-3 rounded-xl border \${
                            errors.phone ? "border-red-300" : "border-gray-200"
                          } focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all bg-white\`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="How can we help you?"
                        className={\`w-full pl-12 pr-4 py-3 rounded-xl border \${
                          errors.message ? "border-red-300" : "border-gray-200"
                        } focus:border-medical-500 focus:ring-2 focus:ring-medical-200 outline-none transition-all bg-white resize-none\`}
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl gradient-green text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </ScrollReveal3D>

            {/* Contact Info */}
            <div className="space-y-8">
              <ScrollReveal3D delay={0.1}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => (
                    <div
                      key={index}
                      className="p-6 rounded-2xl bg-white border border-earth-100 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-xl bg-medical-50 flex items-center justify-center mb-4">
                        <info.icon className="w-6 h-6 text-medical-600" />
                      </div>
                      <h3 className="font-semibold text-medical-900 mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, i) => (
                        <p key={i} className="text-sm text-gray-600">
                          {detail}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </ScrollReveal3D>

              <ScrollReveal3D delay={0.2}>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-earth-100 h-80 bg-earth-100 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-medical-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Map Placeholder</p>
                    <p className="text-sm text-gray-400 mt-1">
                      123 Wellness Avenue, Green District
                    </p>
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
