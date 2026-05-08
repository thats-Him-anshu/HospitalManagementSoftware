"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { BedDouble } from "lucide-react";

export default function ReceptionRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function f() {
      try {
        const res = await fetch("/api/rooms");
        const data = await res.json();
        if (data.success) setRooms(data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    f();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-text">Rooms & Bed Availability</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          const beds = room.beds || [];
          const occupied = beds.filter((b: any) => b.isOccupied).length;
          const available = beds.length - occupied;

          return (
            <Card key={room._id} className={`${available === 0 ? "border-danger/50" : "border-success/50"} border-2`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">Room {room.roomNumber}</CardTitle>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${room.type === "private" ? "bg-purple-100 text-purple-700" : room.type === "general" ? "bg-blue-100 text-blue-700" : "bg-teal-100 text-teal-700"}`}>{room.type || room.roomType}</span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted mb-3">Floor {room.floor} • ₹{room.pricePerDay}/day</p>
                <div className="flex flex-wrap gap-2">
                  {beds.map((bed: any, i: number) => (
                    <div key={i} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${bed.isOccupied ? "bg-danger/10 text-danger border border-danger/20" : "bg-success/10 text-success border border-success/20"}`}>
                      <BedDouble className="h-3.5 w-3.5" />
                      {bed.bedNumber}
                    </div>
                  ))}
                  {beds.length === 0 && <p className="text-xs text-text-muted">No beds configured</p>}
                </div>
                <div className="mt-3 flex gap-4 text-xs">
                  <span className="text-success font-medium">{available} Available</span>
                  <span className="text-danger font-medium">{occupied} Occupied</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
