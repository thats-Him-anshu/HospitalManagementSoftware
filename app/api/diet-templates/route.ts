import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import DietTemplate from "@/models/DietTemplate";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const activeOnly = searchParams.get("active");

    await dbConnect();

    const query: Record<string, unknown> = {};
    if (category) query.category = category;
    if (activeOnly === "true") query.isActive = true;

    const templates = await DietTemplate.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: templates });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    const template = await DietTemplate.create({
      ...body,
      createdBy: (session.user as Record<string, string>).id,
    });

    return NextResponse.json({ success: true, data: template }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
