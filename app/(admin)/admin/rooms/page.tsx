"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, BedDouble } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";

import RoomModal from "@/components/admin/RoomModal";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/rooms");
      const data = await res.json();
      if (data.success) {
        setRooms(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchRooms();
      } else {
        alert(data.error || "Failed to delete room");
      }
    } catch (error) {
      console.error("Failed to delete room", error);
    }
  };

  const handleEdit = (room: any) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Room & Bed Management</h2>
          <p className="text-sm text-text-muted mt-1">Manage IP wards and bed availability</p>
        </div>
        <Button onClick={() => { setEditingRoom(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : rooms.length === 0 ? (
        <Card>
          <div className="p-12 text-center text-text-muted">
            <BedDouble className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No rooms configured yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {rooms.map((room) => {
            const beds = room.beds || [];
            const availableBeds = beds.filter((b: any) => !b.isOccupied).length;
            
            return (
              <Card key={room._id} className="overflow-hidden flex flex-col">
                <div className={`h-2 w-full ${availableBeds > 0 ? "bg-success" : "bg-danger"}`}></div>
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {room.roomNumber}
                    </CardTitle>
                    <p className="text-sm font-medium text-text-muted mt-1 capitalize">{room.type.replace("-", " ")}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEdit(room)}
                      className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(room._id)}
                      className="p-1.5 text-text-muted hover:text-danger transition-colors rounded-md hover:bg-danger/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-semibold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                      {formatCurrency(room.pricePerDay)} / day
                    </span>
                    <span className="text-sm font-medium text-text-muted">
                      Capacity: {room.capacity}
                    </span>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Beds Configuration</p>
                    <div className="grid grid-cols-2 gap-2">
                      {beds.map((bed: any, idx: number) => (
                        <div 
                          key={idx} 
                          className={`flex items-center justify-between p-2 rounded-md border text-xs font-medium ${
                            bed.isOccupied 
                              ? "bg-danger/5 border-danger/20 text-danger" 
                              : "bg-success/5 border-success/20 text-success"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <BedDouble className="h-3.5 w-3.5" />
                            {bed.bedNumber}
                          </span>
                          <span>{bed.isOccupied ? "Occupied" : "Available"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchRooms}
        initialData={editingRoom}
      />
    </div>
  );
}
