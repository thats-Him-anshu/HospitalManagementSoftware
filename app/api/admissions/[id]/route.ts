import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Admission from "@/models/Admission";
import Room from "@/models/Room";
import Patient from "@/models/Patient";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    const existingAdmission = await Admission.findById(params.id);
    if (!existingAdmission) {
      return NextResponse.json({ error: "Admission not found" }, { status: 404 });
    }

    // Handle Discharge Logic
    if (body.status === "discharged" && existingAdmission.status !== "discharged") {
      body.dischargeDate = body.dischargeDate || new Date();
      
      // Free up the bed
      if (existingAdmission.admissionType === "IP" && existingAdmission.room && existingAdmission.bed) {
        const roomDoc = await Room.findById(existingAdmission.room);
        if (roomDoc) {
          const bedIndex = roomDoc.beds.findIndex((b: any) => b.bedNumber === existingAdmission.bed);
          if (bedIndex !== -1) {
            roomDoc.beds[bedIndex].isOccupied = false;
            await roomDoc.save();
          }
        }
      }

      // Update patient status
      await Patient.findByIdAndUpdate(existingAdmission.patient, { admissionType: null });
    }

    const admission = await Admission.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: admission });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
