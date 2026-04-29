"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Fetch session to determine role and redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      
      if (session?.user?.role === "admin") router.push("/admin/dashboard");
      else if (session?.user?.role === "doctor") router.push("/doctor/dashboard");
      else if (session?.user?.role === "receptionist") router.push("/reception/dashboard");
      else if (session?.user?.role === "therapist") router.push("/therapist/dashboard");
      else router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md p-8 bg-surface rounded-xl shadow-lg border border-border">
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-48 h-16 mb-4">
            {/* The user will manually place the logo at /public/assets/logo.png */}
            <Image
              src="/assets/logo.png"
              alt="NIDARSANAM HEALTH CARE"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-text font-display">Staff Login</h1>
          <p className="text-text-muted text-sm text-center">
            NIDARSANAM HEALTH CARE
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 text-danger rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-70 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
