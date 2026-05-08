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
    
    const rooms = await Room.find().sort({ roomType: 1, type: 1, roomNumber: 1 }).lean();

    const formattedRooms = rooms.map((room: any) => {
      const capacity = room.capacity || room.totalBeds || 1;
      const type = room.type || room.roomType || "general";
      const beds = room.beds || [];
      
      // If beds array is empty but we have capacity, generate default beds
      let finalBeds = beds;
      if (finalBeds.length === 0) {
        finalBeds = Array.from({ length: capacity }).map((_, i) => ({
          bedNumber: `${room.roomNumber}-${String.fromCharCode(65 + i)}`,
          isOccupied: false
        }));
      }

      return {
        ...room,
        capacity,
        type,
        beds: finalBeds,
        pricePerDay: room.pricePerDay || 0
      };
    });

    return NextResponse.json({ success: true, data: formattedRooms });
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
