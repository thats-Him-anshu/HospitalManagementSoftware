"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Make an Appointment", href: "/appointments" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg border-b border-border/50" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary/30 group-hover:border-primary transition-colors">
              <Image src="/assets/logo.png" alt="NIDARSANAM HEALTH CARE" fill className="object-cover" priority />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg font-display font-bold leading-tight transition-colors ${scrolled ? "text-primary" : "text-white"}`}>NIDARSANAM</h1>
              <p className={`text-[10px] tracking-[0.2em] uppercase transition-colors ${scrolled ? "text-text-muted" : "text-white/70"}`}>Health Care</p>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative pb-0.5 ${
                  pathname === link.href
                    ? scrolled ? "text-primary" : "text-white"
                    : scrolled ? "text-text-muted hover:text-primary" : "text-white/80 hover:text-white"
                } ${pathname === link.href ? "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-accent after:rounded-full" : ""}`}
              >
                {link.name}
              </Link>
            ))}
            <a href="tel:9952338765" className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all ${scrolled ? "bg-primary text-white hover:bg-primary/90" : "bg-white/20 backdrop-blur text-white hover:bg-white/30"}`}>
              <Phone className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">9952338765</span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className={`h-6 w-6 ${scrolled ? "text-text" : "text-white"}`} /> : <Menu className={`h-6 w-6 ${scrolled ? "text-text" : "text-white"}`} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl rounded-2xl mt-2 p-4 shadow-xl border border-border/50 animate-fadeInDown">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={`block py-3 px-4 text-sm font-medium rounded-lg transition-colors ${pathname === link.href ? "bg-primary/10 text-primary" : "text-text hover:bg-surface"}`}>
                {link.name}
              </Link>
            ))}
            <a href="tel:9952338765" className="block mt-2 py-3 px-4 text-center bg-primary text-white rounded-lg text-sm font-medium">
              <Phone className="h-4 w-4 inline mr-2" />Call: 9952338765
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
