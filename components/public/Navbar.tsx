"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Calendar } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/blog", label: "Health Blog" },
  { href: "/contact", label: "Contact Us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-medical-100/80 py-3"
          : "bg-gradient-to-b from-black/50 via-black/20 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/10 p-1 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/assets/logo.PNG"
                alt="Nidarsanam Health Care Logo"
                width={40}
                height={40}
                className="object-contain w-full h-full"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`text-base sm:text-lg font-bold font-display leading-tight tracking-tight ${
                  scrolled ? "text-medical-900" : "text-white"
                }`}
              >
                Nidarsanam <span className="text-medical-600 font-semibold">Health Care</span>
              </span>
              <span
                className={`text-[10px] uppercase tracking-wider font-medium hidden sm:block ${
                  scrolled ? "text-medical-700" : "text-white/80"
                }`}
              >
                Naturopathy & Yogic Sciences
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-medical-600 relative py-1 ${
                  scrolled ? "text-gray-700" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-5">
            <a
              href="tel:9952338765"
              className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
                scrolled ? "text-medical-700 hover:text-medical-900" : "text-white/95 hover:text-white"
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-medical-500/20 flex items-center justify-center">
                <Phone className="w-4 h-4 text-medical-600" />
              </div>
              <span>9952338765</span>
            </a>

            <Link
              href="/appointments"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-medical-700 hover:bg-medical-800 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? "text-medical-900 hover:bg-medical-50" : "text-white hover:bg-white/10"
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-medical-100 shadow-2xl overflow-hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <div className="px-5 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-base font-medium text-gray-800 hover:text-medical-700 transition-colors py-1.5"
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <a
                  href="tel:9952338765"
                  className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-medical-50 text-medical-800 font-semibold text-sm"
                >
                  <Phone className="w-4 h-4 text-medical-600" />
                  Call: 9952338765
                </a>
                <Link
                  href="/appointments"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-medical-700 text-white font-semibold text-sm shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
