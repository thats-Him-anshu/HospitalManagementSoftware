import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import PharmacySale from "@/models/PharmacySale";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const sale = await PharmacySale.findById(params.id)
      .populate("patient", "patientId firstName lastName phone")
      .populate("soldBy", "name")
      .populate("items.product", "name unit sellingPrice");

    if (!sale) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: sale });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
