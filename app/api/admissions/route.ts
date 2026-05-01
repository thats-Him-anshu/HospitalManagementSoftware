import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Admission from "@/models/Admission";
import Patient from "@/models/Patient";
import Room from "@/models/Room";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "active";
    const type = searchParams.get("type"); // IP or OP
    
    await dbConnect();

    const query: any = { status };
    if (type) query.admissionType = type;
    
    const admissions = await Admission.find(query)
      .populate("patient", "patientId firstName lastName phone gender age")
      .populate("room", "roomNumber type")
      .populate("admittingDoctor", "name speciality")
      .sort({ admissionDate: -1 });

    return NextResponse.json({ success: true, data: admissions });
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

    // If IP admission, check and allocate bed
    if (body.admissionType === "IP" && body.room && body.bed) {
      const roomDoc = await Room.findById(body.room);
      if (!roomDoc) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }

      const bedIndex = roomDoc.beds.findIndex((b: any) => b.bedNumber === body.bed);
      if (bedIndex === -1 || roomDoc.beds[bedIndex].isOccupied) {
        return NextResponse.json({ error: "Selected bed is not available" }, { status: 400 });
      }

      roomDoc.beds[bedIndex].isOccupied = true;
      await roomDoc.save();
    }

    const admission = await Admission.create({
      ...body,
      admissionDate: body.admissionDate || new Date(),
    });

    // Update patient status
    await Patient.findByIdAndUpdate(body.patient, { admissionType: body.admissionType });

    return NextResponse.json({ success: true, data: admission }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
