"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Save, Plus, Trash2, Star, Upload } from "lucide-react";

export default function TestimonialsTab() {
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
    await fetch("/api/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ testimonials: settings.testimonials }) });
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

  const list = settings?.testimonials || [];
  const updateList = (newList: any[]) => setSettings({ ...settings, testimonials: newList });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold">Testimonials ({list.length})</h3>
        <Button size="sm" onClick={() => updateList([...list, { name: "", location: "", text: "", rating: 5, photo: "" }])}><Plus className="mr-1 h-3 w-3" />Add Testimonial</Button>
      </div>

      {list.map((t: any, i: number) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input placeholder="Name" value={t.name} onChange={e => { const n = [...list]; n[i].name = e.target.value; updateList(n); }} className="h-10 rounded-md border border-border px-3 text-sm" />
              <input placeholder="Location" value={t.location} onChange={e => { const n = [...list]; n[i].location = e.target.value; updateList(n); }} className="h-10 rounded-md border border-border px-3 text-sm" />
              <select value={t.rating} onChange={e => { const n = [...list]; n[i].rating = Number(e.target.value); updateList(n); }} className="h-10 rounded-md border border-border px-3 text-sm">
                {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>)}
              </select>
              <div className="flex gap-2">
                <input placeholder="Photo URL" value={t.photo} onChange={e => { const n = [...list]; n[i].photo = e.target.value; updateList(n); }} className="flex-1 h-10 rounded-md border border-border px-3 text-sm" />
                <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files?.[0]) { const n = [...list]; n[i].photo = await uploadImage(e.target.files[0]); updateList(n); } }} /><span className="inline-flex items-center px-2 py-2 rounded-md bg-surface border border-border text-sm"><Upload className="h-4 w-4" /></span></label>
              </div>
            </div>
            <div className="flex gap-3">
              <textarea rows={2} placeholder="Testimonial text" value={t.text} onChange={e => { const n = [...list]; n[i].text = e.target.value; updateList(n); }} className="flex-1 rounded-md border border-border px-3 py-2 text-sm" />
              <button onClick={() => { const n = [...list]; n.splice(i, 1); updateList(n); }} className="text-danger self-start mt-2"><Trash2 className="h-4 w-4" /></button>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button onClick={save} isLoading={saving}><Save className="mr-2 h-4 w-4" />Save All Testimonials</Button>
    </div>
  );
}
