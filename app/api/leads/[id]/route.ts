import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    const updateData = { ...body };
    if (body.newNote) {
      const lead = await Lead.findById(params.id);
      if (lead) {
        updateData.notes = [...lead.notes, body.newNote];
      }
      delete updateData.newNote;
    }

    const lead = await Lead.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: lead });
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

    const lead = await Lead.findByIdAndDelete(params.id);

    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
