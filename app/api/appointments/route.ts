import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const scope = searchParams.get("scope");
    
    await dbConnect();

    const query: any = {};
    if (start && end) {
      query.appointmentDate = { 
        $gte: new Date(start as string), 
        $lte: new Date(end as string) 
      };
    }

    // Filter by logged-in doctor when scope=mine
    if (scope === "mine") {
      query.doctor = (session.user as any).id;
    }
    
    const appointments = await Appointment.find(query)
      .populate("patient", "patientId firstName lastName phone gender age")
      .populate("doctor", "name speciality")
      .sort({ appointmentDate: 1 });

    return NextResponse.json({ success: true, data: appointments });
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

    const appointment = await Appointment.create({
      ...body,
      createdBy: (session.user as any).id,
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
