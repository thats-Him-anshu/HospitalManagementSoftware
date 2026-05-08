import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    await dbConnect();
    
    const query: any = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select("-password").sort({ name: 1 });
    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // Set default password if not provided
    const password = body.password || "Hospital@123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...body,
      password: hashedPassword,
    });

    // Remove password from response
    const userObj = user.toObject();
    delete userObj.password;

    return NextResponse.json({ success: true, data: userObj }, { status: 201 });
  } catch (error: any) {
    // Check for duplicate email error
    if (error.code === 11000) {
      return NextResponse.json({ success: false, error: "Email already exists" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
