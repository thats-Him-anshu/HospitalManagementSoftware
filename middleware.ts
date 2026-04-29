import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
    if (path.startsWith("/doctor") && token?.role !== "doctor") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
    if (path.startsWith("/reception") && token?.role !== "receptionist") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
    if (path.startsWith("/therapist") && token?.role !== "therapist") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/reception/:path*", "/therapist/:path*"],
};
