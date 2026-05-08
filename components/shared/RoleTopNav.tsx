"use client";

import { useSession } from "next-auth/react";
import { Bell, UserCircle } from "lucide-react";

interface RoleTopNavProps {
  panelTitle: string;
}

export default function RoleTopNav({ panelTitle }: RoleTopNavProps) {
  const { data: session } = useSession();

  return (
    <header className="flex h-20 items-center justify-between border-b border-border bg-white px-8 shadow-sm">
      <div>
        <h1 className="text-xl font-display font-semibold text-text">
          {panelTitle}
        </h1>
        <p className="text-sm text-text-muted">
          Welcome back, {session?.user?.name || "User"}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-text-muted hover:text-primary transition-colors">
          <Bell className="h-6 w-6" />
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
