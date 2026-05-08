"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Save, Upload } from "lucide-react";

export default function SiteSettingsTab() {
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
    await fetch("/api/site-settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site: settings.site, socialLinks: settings.socialLinks, contact: settings.contact }),
    });
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

  const site = settings?.site || {};
  const social = settings?.socialLinks || {};
  const contact = settings?.contact || {};

  const updateSite = (key: string, val: string) => setSettings({ ...settings, site: { ...site, [key]: val } });
  const updateSocial = (key: string, val: string) => setSettings({ ...settings, socialLinks: { ...social, [key]: val } });
  const updateContact = (key: string, val: string) => setSettings({ ...settings, contact: { ...contact, [key]: val } });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Hospital Name" value={site.hospitalName || ""} onChange={e => updateSite("hospitalName", e.target.value)} />
          <Input label="Tagline" value={site.tagline || ""} onChange={e => updateSite("tagline", e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-text mb-1">Logo</label>
            <div className="flex gap-2"><input type="text" value={site.logo || ""} onChange={e => updateSite("logo", e.target.value)} className="flex-1 h-10 rounded-md border border-border px-3 text-sm" /><label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files?.[0]) updateSite("logo", await uploadImage(e.target.files[0])); }} /><span className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-surface border border-border text-sm"><Upload className="h-4 w-4" />Upload</span></label></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Favicon</label>
            <div className="flex gap-2"><input type="text" value={site.favicon || ""} onChange={e => updateSite("favicon", e.target.value)} className="flex-1 h-10 rounded-md border border-border px-3 text-sm" /><label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files?.[0]) updateSite("favicon", await uploadImage(e.target.files[0])); }} /><span className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-surface border border-border text-sm"><Upload className="h-4 w-4" />Upload</span></label></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Footer Text</label><textarea rows={2} value={site.footerText || ""} onChange={e => updateSite("footerText", e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>SEO</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Default Meta Title" value={site.seoTitle || ""} onChange={e => updateSite("seoTitle", e.target.value)} />
          <div><label className="block text-sm font-medium mb-1">Default Meta Description</label><textarea rows={2} value={site.seoDescription || ""} onChange={e => updateSite("seoDescription", e.target.value)} className="w-full rounded-md border border-border px-3 py-2 text-sm" /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Address" value={contact.address || ""} onChange={e => updateContact("address", e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={contact.phone || ""} onChange={e => updateContact("phone", e.target.value)} />
            <Input label="Email" value={contact.email || ""} onChange={e => updateContact("email", e.target.value)} />
          </div>
          <Input label="Business Hours" value={contact.businessHours || ""} onChange={e => updateContact("businessHours", e.target.value)} />
          <Input label="Google Maps Embed URL" value={contact.mapEmbedUrl || ""} onChange={e => updateContact("mapEmbedUrl", e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social Links</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="WhatsApp URL" value={social.whatsapp || ""} onChange={e => updateSocial("whatsapp", e.target.value)} />
          <Input label="Instagram URL" value={social.instagram || ""} onChange={e => updateSocial("instagram", e.target.value)} />
          <Input label="Facebook URL" value={social.facebook || ""} onChange={e => updateSocial("facebook", e.target.value)} />
          <Input label="YouTube URL" value={social.youtube || ""} onChange={e => updateSocial("youtube", e.target.value)} />
        </CardContent>
      </Card>

      <Button onClick={save} isLoading={saving}><Save className="mr-2 h-4 w-4" />Save Site Settings</Button>
    </div>
  );
}
