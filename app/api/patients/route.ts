import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

async function generatePatientId() {
  const currentYear = new Date().getFullYear().toString();
  const prefix = `NAT-${currentYear}-`;

  const lastPatient = await Patient.findOne({ patientId: new RegExp(`^${prefix}`) })
    .sort({ patientId: -1 })
    .exec();

  if (!lastPatient) {
    return `${prefix}0001`;
  }

  const lastIdNum = parseInt(lastPatient.patientId.replace(prefix, ""), 10);
  const nextIdNum = lastIdNum + 1;
  return `${prefix}${nextIdNum.toString().padStart(4, "0")}`;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const scope = searchParams.get("scope");
    
    await dbConnect();

    const query: any = search ? {
      $or: [
        { patientId: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    } : {};

    // Filter by assigned doctor or therapist when scope=mine
    if (scope === "mine") {
      const userId = (session.user as any).id;
      const role = (session.user as any).role;
      if (role === "doctor") {
        query.assignedDoctor = userId;
      } else if (role === "therapist") {
        query.assignedTherapist = userId;
      }
    }
    
    const patients = await Patient.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: patients });
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

    const patientId = await generatePatientId();

    const patient = await Patient.create({
      ...body,
      patientId,
      registeredBy: (session.user as any).id,
    });

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
