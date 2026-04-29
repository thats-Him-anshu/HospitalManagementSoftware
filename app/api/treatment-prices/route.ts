import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import TreatmentPrice from "@/models/TreatmentPrice";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    
    await dbConnect();

    const query = search ? { treatmentName: { $regex: search, $options: "i" } } : {};
    
    const treatments = await TreatmentPrice.find(query).sort({ category: 1, treatmentName: 1 });

    return NextResponse.json({ success: true, data: treatments });
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

    const treatment = await TreatmentPrice.create({
      ...body,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json({ success: true, data: treatment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
