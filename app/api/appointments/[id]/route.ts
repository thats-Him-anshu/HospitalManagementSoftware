import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    const appointment = await Appointment.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: appointment });
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

    const appointment = await Appointment.findByIdAndDelete(params.id);

    if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
