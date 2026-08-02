import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import PharmacySale from "@/models/PharmacySale";
import Product from "@/models/Product";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const soldBy = searchParams.get("soldBy");

    await dbConnect();

    const query: Record<string, unknown> = {};
    if (start && end) {
      query.createdAt = { $gte: new Date(start), $lte: new Date(end) };
    }
    if (soldBy) query.soldBy = soldBy;

    const sales = await PharmacySale.find(query)
      .populate("patient", "patientId firstName lastName phone")
      .populate("soldBy", "name")
      .populate("items.product", "name unit")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: sales });
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

    // Reduce stock for each sold product
    for (const item of body.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${item.product}` }, { status: 400 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ success: false, error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const sale = await PharmacySale.create({
      ...body,
      soldBy: (session.user as Record<string, string>).id,
    });

    return NextResponse.json({ success: true, data: sale }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
