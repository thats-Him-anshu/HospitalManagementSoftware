import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Health & Wellness Blog" },
  { href: "/contact", label: "Contact Us" },
  { href: "/appointments", label: "Book Appointment" },
];

const treatments = [
  "Naturopathy & Hydrotherapy",
  "Acupuncture & Moxibustion",
  "Therapeutical Yoga",
  "Diet Chart & Traditional Nutrition",
  "Physiotherapy & Rehabilitation",
  "Pain & Lifestyle Disease Management",
];

export default function Footer() {
  return (
    <footer className="bg-medical-900 text-white pt-16 pb-8 border-t border-medical-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 p-1 flex items-center justify-center shrink-0">
                <Image
                  src="/assets/logo.PNG"
                  alt="Nidarsanam Health Care Logo"
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="text-xl font-bold font-display text-white tracking-tight">
                Nidarsanam <span className="text-medical-300">Health Care</span>
              </span>
            </div>
            <p className="text-medical-100/80 text-sm leading-relaxed">
              The Real Path to Health. Empowering individuals to achieve natural wellness, disease reversal, and vitality through authentic Naturopathy & Yogic Sciences.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/919952338765"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full bg-medical-800 flex items-center justify-center text-medical-200 hover:bg-medical-600 hover:text-white transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="tel:9952338765"
                aria-label="Call Us"
                className="w-9 h-9 rounded-full bg-medical-800 flex items-center justify-center text-medical-200 hover:bg-medical-600 hover:text-white transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:nidarsanamhealthcare@gmail.com"
                aria-label="Email Us"
                className="w-9 h-9 rounded-full bg-medical-800 flex items-center justify-center text-medical-200 hover:bg-medical-600 hover:text-white transition-all shadow-sm"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-medical-100/75 hover:text-white transition-colors text-sm flex items-center gap-1.5 group"
                  >
                    <ArrowRight className="w-3 h-3 text-medical-400 group-hover:translate-x-1 transition-transform" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Treatments Offered */}
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-5">Our Treatments</h4>
            <ul className="space-y-2.5">
              {treatments.map((treatment) => (
                <li key={treatment} className="text-medical-100/75 text-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-medical-400"></span>
                  <span>{treatment}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h4 className="text-base font-semibold text-white uppercase tracking-wider mb-5">Contact Info</h4>
            <ul className="space-y-3.5 text-sm text-medical-100/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-medical-400 shrink-0 mt-0.5" />
                <span>Nidarsanam Health Care, 3/50D, Renuga Devi Kovil Street, Manthoppu, Dharmapuri, 636701</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-medical-400 shrink-0" />
                <a href="tel:9952338765" className="hover:text-white transition-colors">9952338765</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-medical-400 shrink-0" />
                <a href="mailto:nidarsanamhealthcare@gmail.com" className="hover:text-white transition-colors break-all sm:break-normal">nidarsanamhealthcare@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-medical-400 shrink-0" />
                <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-medical-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-medical-100/60 text-center md:text-left">
          <p>© {new Date().getFullYear()} Nidarsanam Health Care. All rights reserved.</p>
          <p>Naturopathy & Yogic Sciences • Dharmapuri, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
}
