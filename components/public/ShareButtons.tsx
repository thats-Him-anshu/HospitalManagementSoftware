"use client";

import { MessageCircle, Share2, Link2, Check } from "lucide-react";
import { useState } from "react";

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : "";

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3">
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-medium">
        <MessageCircle className="h-4 w-4" />WhatsApp
      </a>
      <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors text-sm font-medium">
        <Share2 className="h-4 w-4" />Facebook
      </a>
      <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface text-text-muted hover:bg-border/50 transition-colors text-sm font-medium">
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
