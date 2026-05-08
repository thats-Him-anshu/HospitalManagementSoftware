"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Save, Plus, Trash2, Upload } from "lucide-react";

export default function HomepageTab() {
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

  const save = async (section: string, value: any) => {
    setSaving(true);
    await fetch("/api/site-settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [section]: value }) });
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

  const hero = settings?.hero || {};
  const aboutSnap = settings?.aboutSnapshot || {};
  const wcu = settings?.whyChooseUs || [];
  const ctaBanner = settings?.ctaBanner || {};
  const contact = settings?.contact || {};

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card>
        <CardHeader><CardTitle>Hero Banner</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Headline" value={hero.headline || ""} onChange={e => setSettings({ ...settings, hero: { ...hero, headline: e.target.value } })} />
          <Input label="Subheadline" value={hero.subheadline || ""} onChange={e => setSettings({ ...settings, hero: { ...hero, subheadline: e.target.value } })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="CTA Button Text" value={hero.ctaText || ""} onChange={e => setSettings({ ...settings, hero: { ...hero, ctaText: e.target.value } })} />
            <Input label="CTA Button Link" value={hero.ctaLink || ""} onChange={e => setSettings({ ...settings, hero: { ...hero, ctaLink: e.target.value } })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-1">Background Image</label>
            <div className="flex gap-2 items-center">
              <input type="text" value={hero.backgroundImage || ""} onChange={e => setSettings({ ...settings, hero: { ...hero, backgroundImage: e.target.value } })} className="flex-1 h-10 rounded-md border border-border px-3 text-sm" placeholder="Image URL" />
              <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files?.[0]) { const url = await uploadImage(e.target.files[0]); setSettings({ ...settings, hero: { ...hero, backgroundImage: url } }); } }} /><span className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-surface border border-border text-sm hover:bg-border/50 transition-colors"><Upload className="h-4 w-4" />Upload</span></label>
            </div>
          </div>
          <Button onClick={() => save("hero", settings.hero)} isLoading={saving} size="sm"><Save className="mr-2 h-4 w-4" />Save Hero</Button>
        </CardContent>
      </Card>

      {/* About Snapshot */}
      <Card>
        <CardHeader><CardTitle>About Snapshot & Stats</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">Paragraph</label><textarea rows={3} value={aboutSnap.paragraph || ""} onChange={e => setSettings({ ...settings, aboutSnapshot: { ...aboutSnap, paragraph: e.target.value } })} className="w-full rounded-md border border-border px-3 py-2 text-sm" /></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input label="Years of Experience" type="number" value={aboutSnap.yearsOfExperience || 0} onChange={e => setSettings({ ...settings, aboutSnapshot: { ...aboutSnap, yearsOfExperience: Number(e.target.value) } })} />
            <Input label="Patients Treated" type="number" value={aboutSnap.patientsTreated || 0} onChange={e => setSettings({ ...settings, aboutSnapshot: { ...aboutSnap, patientsTreated: Number(e.target.value) } })} />
            <Input label="Treatments" type="number" value={aboutSnap.treatments || 0} onChange={e => setSettings({ ...settings, aboutSnapshot: { ...aboutSnap, treatments: Number(e.target.value) } })} />
            <Input label="Doctors" type="number" value={aboutSnap.doctors || 0} onChange={e => setSettings({ ...settings, aboutSnapshot: { ...aboutSnap, doctors: Number(e.target.value) } })} />
          </div>
          <Button onClick={() => save("aboutSnapshot", settings.aboutSnapshot)} isLoading={saving} size="sm"><Save className="mr-2 h-4 w-4" />Save About</Button>
        </CardContent>
      </Card>

      {/* Why Choose Us */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Why Choose Us</CardTitle><Button size="sm" variant="outline" onClick={() => setSettings({ ...settings, whyChooseUs: [...wcu, { icon: "Leaf", title: "", description: "" }] })}><Plus className="mr-1 h-3 w-3" />Add Item</Button></CardHeader>
        <CardContent className="space-y-4">
          {wcu.map((item: any, i: number) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-surface/50 rounded-lg">
              <div className="flex-1 grid grid-cols-3 gap-3">
                <select value={item.icon} onChange={e => { const n = [...wcu]; n[i].icon = e.target.value; setSettings({ ...settings, whyChooseUs: n }); }} className="h-10 rounded-md border border-border px-2 text-sm">
                  {["Leaf","Heart","Shield","Star","Clock","Sparkles","Users","Award","Stethoscope"].map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input placeholder="Title" value={item.title} onChange={e => { const n = [...wcu]; n[i].title = e.target.value; setSettings({ ...settings, whyChooseUs: n }); }} className="h-10 rounded-md border border-border px-3 text-sm" />
                <input placeholder="Description" value={item.description} onChange={e => { const n = [...wcu]; n[i].description = e.target.value; setSettings({ ...settings, whyChooseUs: n }); }} className="h-10 rounded-md border border-border px-3 text-sm" />
              </div>
              <button onClick={() => { const n = [...wcu]; n.splice(i, 1); setSettings({ ...settings, whyChooseUs: n }); }} className="text-danger mt-2"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          <Button onClick={() => save("whyChooseUs", settings.whyChooseUs)} isLoading={saving} size="sm"><Save className="mr-2 h-4 w-4" />Save</Button>
        </CardContent>
      </Card>

      {/* CTA Banner */}
      <Card>
        <CardHeader><CardTitle>CTA Banner</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Headline" value={ctaBanner.headline || ""} onChange={e => setSettings({ ...settings, ctaBanner: { ...ctaBanner, headline: e.target.value } })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Button Text" value={ctaBanner.buttonText || ""} onChange={e => setSettings({ ...settings, ctaBanner: { ...ctaBanner, buttonText: e.target.value } })} />
            <Input label="Button Link" value={ctaBanner.buttonLink || ""} onChange={e => setSettings({ ...settings, ctaBanner: { ...ctaBanner, buttonLink: e.target.value } })} />
          </div>
          <Button onClick={() => save("ctaBanner", settings.ctaBanner)} isLoading={saving} size="sm"><Save className="mr-2 h-4 w-4" />Save CTA</Button>
        </CardContent>
      </Card>

      {/* Contact Snippet */}
      <Card>
        <CardHeader><CardTitle>Contact Snippet</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Address" value={contact.address || ""} onChange={e => setSettings({ ...settings, contact: { ...contact, address: e.target.value } })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={contact.phone || ""} onChange={e => setSettings({ ...settings, contact: { ...contact, phone: e.target.value } })} />
            <Input label="Email" value={contact.email || ""} onChange={e => setSettings({ ...settings, contact: { ...contact, email: e.target.value } })} />
          </div>
          <Input label="Business Hours" value={contact.businessHours || ""} onChange={e => setSettings({ ...settings, contact: { ...contact, businessHours: e.target.value } })} />
          <Input label="Google Maps Embed URL" value={contact.mapEmbedUrl || ""} onChange={e => setSettings({ ...settings, contact: { ...contact, mapEmbedUrl: e.target.value } })} />
          <Button onClick={() => save("contact", settings.contact)} isLoading={saving} size="sm"><Save className="mr-2 h-4 w-4" />Save Contact</Button>
        </CardContent>
      </Card>
    </div>
  );
}
