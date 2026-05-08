"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Save, Plus, Trash2, Upload } from "lucide-react";
import TipTapEditor from "@/components/cms/TipTapEditor";

export default function AboutTab() {
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
    await fetch("/api/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ aboutPage: settings.aboutPage }) });
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

  const about = settings?.aboutPage || {};
  const values = about.coreValues || [];
  const update = (key: string, val: any) => setSettings({ ...settings, aboutPage: { ...about, [key]: val } });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Hero</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Hero Title" value={about.heroTitle || ""} onChange={e => update("heroTitle", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-text mb-1">Hero Image</label>
            <div className="flex gap-2"><input type="text" value={about.heroImage || ""} onChange={e => update("heroImage", e.target.value)} className="flex-1 h-10 rounded-md border border-border px-3 text-sm" /><label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files?.[0]) update("heroImage", await uploadImage(e.target.files[0])); }} /><span className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-surface border border-border text-sm"><Upload className="h-4 w-4" />Upload</span></label></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>About Story (Rich Text)</CardTitle></CardHeader>
        <CardContent>
          <TipTapEditor content={about.story || ""} onChange={(html) => update("story", html)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Mission & Vision</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Mission</label><textarea rows={3} value={about.mission || ""} onChange={e => update("mission", e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" /></div>
          <div><label className="block text-sm font-medium mb-1">Vision</label><textarea rows={3} value={about.vision || ""} onChange={e => update("vision", e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Core Values</CardTitle><Button size="sm" variant="outline" onClick={() => update("coreValues", [...values, { title: "", description: "" }])}><Plus className="mr-1 h-3 w-3" />Add Value</Button></CardHeader>
        <CardContent className="space-y-3">
          {values.map((v: any, i: number) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-surface/50 rounded-lg">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <input placeholder="Title" value={v.title} onChange={e => { const n = [...values]; n[i].title = e.target.value; update("coreValues", n); }} className="h-10 rounded-md border border-border px-3 text-sm" />
                <input placeholder="Description" value={v.description} onChange={e => { const n = [...values]; n[i].description = e.target.value; update("coreValues", n); }} className="h-10 rounded-md border border-border px-3 text-sm" />
              </div>
              <button onClick={() => { const n = [...values]; n.splice(i, 1); update("coreValues", n); }} className="text-danger mt-2"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={save} isLoading={saving}><Save className="mr-2 h-4 w-4" />Save About Page</Button>
    </div>
  );
}
