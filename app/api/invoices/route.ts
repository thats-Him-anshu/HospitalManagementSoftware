import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

// Helper to generate invoice number (e.g., INV-202605-001)
const generateInvoiceNumber = async () => {
  const date = new Date();
  const prefix = `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  
  const lastInvoice = await Invoice.findOne({ invoiceNumber: new RegExp(`^${prefix}`) })
    .sort({ invoiceNumber: -1 });

  let sequence = 1;
  if (lastInvoice) {
    const lastSeq = parseInt(lastInvoice.invoiceNumber.split('-')[2], 10);
    sequence = lastSeq + 1;
  }

  return `${prefix}-${sequence.toString().padStart(3, '0')}`;
};

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const invoices = await Invoice.find()
      .populate("patient", "firstName lastName phone patientId")
      .populate("issuedBy", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await Invoice.create({
      ...body,
      invoiceNumber,
      issuedBy: (session.user as any).id,
      balance: body.totalAmount - (body.amountPaid || 0),
      paymentStatus: (body.amountPaid || 0) >= body.totalAmount ? "paid" : (body.amountPaid || 0) > 0 ? "partial" : "pending"
    });

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
