import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    // Using populate later for currentOccupants if we want to show who is in the room
    const rooms = await Room.find().sort({ type: 1, roomNumber: 1 });

    return NextResponse.json({ success: true, data: rooms });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // Default beds array setup if not provided correctly
    if (!body.beds || body.beds.length === 0) {
      body.beds = Array.from({ length: body.capacity }).map((_, i) => ({
        bedNumber: `${body.roomNumber}-${String.fromCharCode(65 + i)}`,
        isOccupied: false
      }));
    }

    const room = await Room.create(body);

    return NextResponse.json({ success: true, data: room }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
