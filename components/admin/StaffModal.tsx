"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

interface StaffData {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  phone: string;
  speciality: string;
  qualification: string;
  joiningDate: string;
  profileImage: string;
  isActive: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  initialData?: StaffData | null;
}

export default function StaffModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState<StaffData>({
    name: "",
    email: "",
    password: "",
    role: "doctor",
    phone: "",
    speciality: "",
    qualification: "",
    joiningDate: new Date().toISOString().split('T')[0],
    profileImage: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        password: "", // Never pre-fill password
        joiningDate: initialData.joiningDate ? new Date(initialData.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "doctor",
        phone: "",
        speciality: "",
        qualification: "",
        joiningDate: new Date().toISOString().split('T')[0],
        profileImage: "",
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const uploadedImage = await res.json();
      if (uploadedImage.secure_url) {
        setFormData(prev => ({ ...prev, profileImage: uploadedImage.secure_url }));
      } else {
        setError("Failed to upload image to Cloudinary.");
      }
    } catch (err) {
      setError("Error uploading image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = initialData?._id ? `/api/users/${initialData._id}` : "/api/users";
      const method = initialData?._id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        onSave();
        onClose();
      } else {
        setError(data.error || "Failed to save staff member");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl my-8 max-h-[90vh] overflow-y-auto">
        <h2 className="mb-4 text-xl font-display font-semibold text-text">
          {initialData ? "Edit Staff Member" : "Add New Staff"}
        </h2>
        
        {error && <div className="mb-4 text-sm text-danger bg-danger/10 p-3 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Image Upload Column */}
            <div className="flex flex-col items-center gap-3 w-full sm:w-1/3">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-surface overflow-hidden relative">
                {formData.profileImage ? (
                  <Image src={formData.profileImage} alt="Profile" fill className="object-cover" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-text-muted" />
                )}
              </div>
              <label className="cursor-pointer">
                <span className="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  {uploading ? "Uploading..." : "Upload Photo"}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>

            {/* Form Fields Column */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <div className="w-full">
                  <label className="block text-sm font-medium text-text mb-1">Role *</label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="doctor">Doctor</option>
                    <option value="receptionist">Receptionist</option>
                    <option value="therapist">Therapist</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  label={initialData ? "Password (leave blank to keep)" : "Password *"}
                  type="password"
                  required={!initialData}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  label="Joining Date"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                />
              </div>

              {formData.role === "doctor" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Speciality"
                    value={formData.speciality}
                    onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
                  />
                  <Input
                    label="Qualification"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-text">
                  Account is Active
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} disabled={uploading}>
              Save Staff Member
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
