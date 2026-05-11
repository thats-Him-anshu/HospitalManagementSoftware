import Link from "next/link";
import { Heart, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Health Blog" },
  { href: "/contact", label: "Contact" },
];

const services = [
  "Physiotherapy",
  "Acupuncture",
  "Pain Management",
  "Rehabilitation",
  "Naturopathy",
  "Yoga Therapy",
];

export default function Footer() {
  return (
    <footer className="bg-medical-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-medical-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display">
                Nidarsanam<span className="text-medical-400">Care</span>
              </span>
            </div>
            <p className="text-earth-200 text-sm leading-relaxed mb-6">
              Providing compassionate, premium healthcare with a holistic approach
              to wellness and recovery since 2005.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-medical-800 flex items-center justify-center hover:bg-medical-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-earth-200 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-earth-200 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-earth-200">
                <MapPin className="w-5 h-5 text-medical-400 shrink-0 mt-0.5" />
                <span>123 Wellness Avenue, Green District, CA 90210</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-earth-200">
                <Phone className="w-5 h-5 text-medical-400 shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-earth-200">
                <Mail className="w-5 h-5 text-medical-400 shrink-0" />
                <span>care@nidarsanam.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-earth-200">
                <Clock className="w-5 h-5 text-medical-400 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-medical-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-earth-300 text-sm">
            © {new Date().getFullYear()} Nidarsanam Health Care. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-earth-300">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
