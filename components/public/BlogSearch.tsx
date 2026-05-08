"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function BlogSearch() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("search") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const url = query ? `/blog?search=${encodeURIComponent(query)}` : "/blog";
    router.push(url);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
      <input
        type="text"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-10 pl-10 pr-4 rounded-full bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </form>
  );
}
