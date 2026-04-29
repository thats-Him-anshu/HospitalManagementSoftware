"use client";

import { useSession } from "next-auth/react";
import { Bell, UserCircle } from "lucide-react";

export default function TopNav() {
  const { data: session } = useSession();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-white px-8 shadow-sm">
      <div>
        <h1 className="text-xl font-display font-semibold text-text">
          Admin Super Panel
        </h1>
        <p className="text-sm text-text-muted">
          Welcome back, {session?.user?.name || "Admin"}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-text-muted hover:text-primary transition-colors">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text">{session?.user?.name}</p>
            <p className="text-xs text-text-muted capitalize">{(session?.user as any)?.role}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-surface border border-border flex items-center justify-center overflow-hidden text-primary">
            <UserCircle className="h-8 w-8" />
          </div>
        </div>
      </div>
    </header>
  );
}
