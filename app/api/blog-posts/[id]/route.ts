import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    // Support lookup by ID or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(params.id);
    const post = isObjectId
      ? await BlogPost.findById(params.id).populate("category", "name slug").populate("author", "name")
      : await BlogPost.findOne({ slug: params.id }).populate("category", "name slug").populate("author", "name");

    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    await dbConnect();

    // Recalculate read time
    if (body.content) {
      const wordCount = body.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
      body.readTime = Math.max(1, Math.ceil(wordCount / 200));
    }

    const post = await BlogPost.findByIdAndUpdate(params.id, body, { new: true });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    await BlogPost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
