"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Save, Plus, Trash2, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";

export default function GalleryTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function f() {
      const res = await fetch("/api/site-settings");
      const data = await res.json();
      if (data.success) setSettings(data.data);
      setLoading(false);
    }
    f();
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gallery: settings.gallery }) });
    setSaving(false);
  };

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url;
  };

  if (loading) return <p className="text-text-muted py-12 text-center">Loading...</p>;

  const gallery = settings?.gallery || [];
  const updateGallery = (g: any[]) => setSettings({ ...settings, gallery: g });

  const handleUpload = async (files: FileList) => {
    const newItems = [...gallery];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      newItems.push({ imageUrl: url, caption: "" });
    }
    updateGallery(newItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold">Gallery ({gallery.length} images)</h3>
        <label className="cursor-pointer">
          <input type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && handleUpload(e.target.files)} />
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"><Upload className="h-4 w-4" />Upload Images</span>
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item: any, i: number) => (
          <Card key={i} className="overflow-hidden group">
            <div className="relative h-40">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.caption || ""} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full bg-surface"><ImageIcon className="h-8 w-8 text-text-muted/30" /></div>
              )}
              <button onClick={() => { const n = [...gallery]; n.splice(i, 1); updateGallery(n); }} className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-danger opacity-0 group-hover:opacity-100 transition-opacity shadow"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
            <CardContent className="p-3">
              <input placeholder="Caption" value={item.caption} onChange={e => { const n = [...gallery]; n[i].caption = e.target.value; updateGallery(n); }} className="w-full h-8 rounded border border-border px-2 text-xs" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button onClick={save} isLoading={saving}><Save className="mr-2 h-4 w-4" />Save Gallery</Button>
    </div>
  );
}
