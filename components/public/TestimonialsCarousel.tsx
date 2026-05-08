"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  photo: string;
}

export default function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  if (!testimonials || testimonials.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <div className="relative max-w-2xl mx-auto mt-12">
      <div className="bg-surface/50 rounded-2xl p-8 sm:p-12 border border-border/50 text-center">
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-5 w-5 ${i < (t.rating || 5) ? "fill-accent text-accent" : "text-border"}`} />
          ))}
        </div>
        <p className="text-lg text-text leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          {t.photo && (
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-accent">
              <Image src={t.photo} alt={t.name} fill className="object-cover" />
            </div>
          )}
          <div className="text-left">
            <p className="font-display font-bold text-text">{t.name}</p>
            {t.location && <p className="text-xs text-text-muted">{t.location}</p>}
          </div>
        </div>
      </div>

      {testimonials.length > 1 && (
        <>
          <button onClick={prev} className="absolute top-1/2 -translate-y-1/2 -left-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-border/50"><ChevronLeft className="h-5 w-5 text-text" /></button>
          <button onClick={next} className="absolute top-1/2 -translate-y-1/2 -right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow border border-border/50"><ChevronRight className="h-5 w-5 text-text" /></button>
        </>
      )}

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-primary w-6" : "bg-border hover:bg-text-muted"}`} />
        ))}
      </div>
    </div>
  );
}
