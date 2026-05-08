import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-white/80">
      {/* Leaf pattern overlay */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c14 0 25 11 25 25S44 55 30 55 5 44 5 30 16 5 30 5z' fill='none' stroke='white' stroke-width='.5'/%3E%3C/svg%3E")` }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-display font-bold text-white">NIDARSANAM</h2>
              <p className="text-xs tracking-[0.2em] uppercase text-accent mt-1">Health Care</p>
              <p className="text-sm text-white/60 mt-4 leading-relaxed">Natural Healing. Real Results. Experience holistic naturopathy treatments that restore balance to body, mind, and spirit.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { name: "Home", href: "/" },
                  { name: "About Us", href: "/about" },
                  { name: "Blog", href: "/blog" },
                  { name: "Make an Appointment", href: "/appointments" },
                ].map((l) => (
                  <li key={l.name}><Link href={l.href} className="text-sm text-white/60 hover:text-accent transition-colors">{l.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Treatments */}
            <div>
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">Treatments</h3>
              <ul className="space-y-2.5">
                {["Naturopathy", "Panchakarma", "Yoga Therapy", "Acupuncture", "Diet Therapy"].map((t) => (
                  <li key={t}><span className="text-sm text-white/60">{t}</span></li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3"><Phone className="h-4 w-4 text-accent mt-0.5 shrink-0" /><div><a href="tel:9952338765" className="text-sm hover:text-accent transition-colors">9952338765</a></div></li>
                <li className="flex items-start gap-3"><Mail className="h-4 w-4 text-accent mt-0.5 shrink-0" /><a href="mailto:nidarsanamhealthcare@gmail.com" className="text-sm hover:text-accent transition-colors break-all">nidarsanamhealthcare@gmail.com</a></li>
                <li className="flex items-start gap-3"><MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" /><span className="text-sm text-white/60">NIDARSANAM HEALTH CARE</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">© {new Date().getFullYear()} NIDARSANAM HEALTH CARE. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://wa.me/919952338765" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-green-400 transition-colors text-xs">WhatsApp</a>
              <span className="text-white/20">•</span>
              <a href="#" className="text-white/40 hover:text-blue-400 transition-colors text-xs">Instagram</a>
              <span className="text-white/20">•</span>
              <a href="#" className="text-white/40 hover:text-blue-500 transition-colors text-xs">Facebook</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
