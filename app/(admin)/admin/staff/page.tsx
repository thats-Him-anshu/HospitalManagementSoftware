"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Shield, User, Stethoscope } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";
import Image from "next/image";
import StaffModal from "@/components/admin/StaffModal";
import { format } from "date-fns";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setStaff(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchStaff();
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleEdit = (user: any) => {
    setEditingStaff(user);
    setIsModalOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch(role) {
      case "admin": return <Shield className="h-4 w-4 text-purple-500" />;
      case "doctor": return <Stethoscope className="h-4 w-4 text-blue-500" />;
      case "therapist": return <User className="h-4 w-4 text-green-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-text">Doctors & Staff</h2>
          <p className="text-sm text-text-muted mt-1">Manage hospital employees and access</p>
        </div>
        <Button onClick={() => { setEditingStaff(null); setIsModalOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Staff Member</th>
                <th className="px-6 py-4 font-medium text-text-muted">Contact Info</th>
                <th className="px-6 py-4 font-medium text-text-muted">Role</th>
                <th className="px-6 py-4 font-medium text-text-muted">Joining Date</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">Loading staff members...</td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-text-muted">No staff found.</td>
                </tr>
              ) : (
                staff.map((user) => (
                  <tr key={user._id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden bg-surface border border-border">
                          {user.profileImage ? (
                            <Image src={user.profileImage} alt={user.name} fill className="object-cover" />
                          ) : (
                            <User className="h-5 w-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-muted" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-text">{user.name}</div>
                          {user.role === 'doctor' && user.speciality && (
                            <div className="text-xs text-text-muted">{user.speciality}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-text">{user.email}</div>
                      <div className="text-xs text-text-muted mt-0.5">{user.phone || "No phone"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 capitalize">
                        {getRoleIcon(user.role)}
                        <span className="font-medium text-text">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {user.joiningDate ? format(new Date(user.joiningDate), "dd MMM yyyy") : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                        ${user.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}
                      `}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-1.5 text-text-muted hover:text-primary transition-colors rounded-md hover:bg-surface"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)}
                          className="p-1.5 text-text-muted hover:text-danger transition-colors rounded-md hover:bg-danger/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={fetchStaff}
        initialData={editingStaff}
      />
    </div>
  );
}
