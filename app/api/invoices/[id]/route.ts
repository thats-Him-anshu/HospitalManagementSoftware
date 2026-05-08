import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const invoice = await Invoice.findById(params.id)
      .populate("patient", "firstName lastName phone patientId email address city state")
      .populate("issuedBy", "name");

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    // Recalculate balance and status if payment is updated
    const updateData = { ...body };
    if (body.amountPaid !== undefined) {
      const existing = await Invoice.findById(params.id);
      if (existing) {
        const total = existing.totalAmount;
        updateData.balance = total - body.amountPaid;
        updateData.paymentStatus = body.amountPaid >= total ? "paid" : body.amountPaid > 0 ? "partial" : "pending";
      }
    }

    const invoice = await Invoice.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const invoice = await Invoice.findByIdAndDelete(params.id);

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
