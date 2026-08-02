"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Shield } from "lucide-react";

export default function TelecallerProfile() {
  const { data: session } = useSession();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-text">My Profile</h1>
      <div className="bg-white rounded-xl border border-border p-6 shadow-soft max-w-md">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl mb-4">{session?.user?.name?.charAt(0) || "T"}</div>
        <div className="space-y-3">
          <div className="flex items-center gap-3"><User className="w-4 h-4 text-text-muted" /><div><p className="text-xs text-text-muted">Name</p><p className="font-medium text-text">{session?.user?.name || "—"}</p></div></div>
          <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-text-muted" /><div><p className="text-xs text-text-muted">Email</p><p className="font-medium text-text">{session?.user?.email || "—"}</p></div></div>
          <div className="flex items-center gap-3"><Shield className="w-4 h-4 text-text-muted" /><div><p className="text-xs text-text-muted">Role</p><p className="font-medium text-text capitalize">{(session?.user as Record<string, string>)?.role || "telecaller"}</p></div></div>
        </div>
        <p className="text-xs text-text-muted mt-6 pt-4 border-t border-border">Detailed profile settings coming in Phase 9.</p>
      </div>
    </div>
  );
}
