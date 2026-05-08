"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/Card";
import { Plus, Pencil, Trash2, Upload, Save, Eye, EyeOff, Tag, X } from "lucide-react";
import TipTapEditor from "@/components/cms/TipTapEditor";
import { format } from "date-fns";

export default function BlogManagerTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null); // null = list view, object = edit view
  const [saving, setSaving] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const [postsRes, catsRes] = await Promise.all([
      fetch("/api/blog-posts?limit=100"), fetch("/api/blog-categories"),
    ]);
    const postsData = await postsRes.json();
    const catsData = await catsRes.json();
    if (postsData.success) setPosts(postsData.data);
    if (catsData.success) setCategories(catsData.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
    const data = await res.json();
    return data.secure_url;
  };

  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const newPost = () => setEditing({
    title: "", slug: "", excerpt: "", content: "", featuredImage: "", category: "", tags: [], status: "draft", seoTitle: "", seoDescription: "", _isNew: true,
  });

  const savePost = async () => {
    setSaving(true);
    const { _isNew, _id, __v, createdAt, updatedAt, author, readTime, ...body } = editing;
    try {
      if (_isNew) {
        await fetch("/api/blog-posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      } else {
        await fetch(`/api/blog-posts/${_id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      }
      setEditing(null);
      fetchData();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/blog-posts/${id}`, { method: "DELETE" });
    fetchData();
  };

  const addCategory = async () => {
    if (!newCatName.trim()) return;
    await fetch("/api/blog-categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newCatName.trim() }) });
    setNewCatName("");
    const res = await fetch("/api/blog-categories");
    const data = await res.json();
    if (data.success) setCategories(data.data);
  };

  const [tagInput, setTagInput] = useState("");
  const addTag = () => {
    if (tagInput.trim() && editing) {
      setEditing({ ...editing, tags: [...(editing.tags || []), tagInput.trim()] });
      setTagInput("");
    }
  };

  // ─── EDITOR VIEW ───
  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-display font-semibold">{editing._isNew ? "New Blog Post" : "Edit Post"}</h3>
          <Button variant="ghost" onClick={() => setEditing(null)}>← Back to List</Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-5">
            <Input label="Title *" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value, slug: editing._isNew ? slugify(e.target.value) : editing.slug })} />
            <Input label="Slug" value={editing.slug} onChange={e => setEditing({ ...editing, slug: e.target.value })} />

            <div><label className="block text-sm font-medium mb-1">Excerpt</label><textarea rows={2} value={editing.excerpt} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} className="w-full rounded-md border border-border px-3 py-2 text-sm" /></div>

            <div>
              <label className="block text-sm font-medium mb-1">Content (Rich Text) *</label>
              <TipTapEditor content={editing.content} onChange={(html) => setEditing({ ...editing, content: html })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <div className="flex gap-2">
                  <select value={editing.category?._id || editing.category || ""} onChange={e => setEditing({ ...editing, category: e.target.value })} className="flex-1 h-10 rounded-md border border-border px-3 text-sm">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                  <div className="flex gap-1">
                    <input placeholder="New cat" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="h-10 w-28 rounded-md border border-border px-2 text-sm" />
                    <Button size="sm" variant="outline" onClick={addCategory}><Plus className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <div className="flex gap-3 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={editing.status === "draft"} onChange={() => setEditing({ ...editing, status: "draft" })} className="text-primary" /><span className="text-sm">Draft</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="radio" checked={editing.status === "published"} onChange={() => setEditing({ ...editing, status: "published" })} className="text-primary" /><span className="text-sm">Published</span></label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Featured Image</label>
              <div className="flex gap-2">
                <input type="text" value={editing.featuredImage} onChange={e => setEditing({ ...editing, featuredImage: e.target.value })} className="flex-1 h-10 rounded-md border border-border px-3 text-sm" placeholder="Image URL" />
                <label className="cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={async e => { if (e.target.files?.[0]) setEditing({ ...editing, featuredImage: await uploadImage(e.target.files[0]) }); }} /><span className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-surface border border-border text-sm"><Upload className="h-4 w-4" />Upload</span></label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(editing.tags || []).map((tag: string, i: number) => (
                  <span key={i} className="flex items-center gap-1 bg-surface px-2.5 py-1 rounded-full text-xs"><Tag className="h-3 w-3" />{tag}<button onClick={() => setEditing({ ...editing, tags: editing.tags.filter((_: any, j: number) => j !== i) })}><X className="h-3 w-3" /></button></span>
                ))}
              </div>
              <div className="flex gap-2"><input placeholder="Add tag" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} className="h-10 rounded-md border border-border px-3 text-sm" /><Button size="sm" variant="outline" onClick={addTag}><Plus className="h-3 w-3" /></Button></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="SEO Title" value={editing.seoTitle} onChange={e => setEditing({ ...editing, seoTitle: e.target.value })} />
              <Input label="SEO Description" value={editing.seoDescription} onChange={e => setEditing({ ...editing, seoDescription: e.target.value })} />
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={savePost} isLoading={saving}><Save className="mr-2 h-4 w-4" />{editing._isNew ? "Publish Post" : "Update Post"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── LIST VIEW ───
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold">Blog Posts ({posts.length})</h3>
        <Button onClick={newPost}><Plus className="mr-2 h-4 w-4" />New Post</Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-text-muted">Title</th>
                <th className="px-6 py-4 font-medium text-text-muted">Category</th>
                <th className="px-6 py-4 font-medium text-text-muted">Status</th>
                <th className="px-6 py-4 font-medium text-text-muted">Date</th>
                <th className="px-6 py-4 font-medium text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">Loading...</td></tr> :
              posts.length === 0 ? <tr><td colSpan={5} className="text-center py-12 text-text-muted">No blog posts yet.</td></tr> :
              posts.map(p => (
                <tr key={p._id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4"><div className="font-medium">{p.title}</div><div className="text-xs text-text-muted">/{p.slug}</div></td>
                  <td className="px-6 py-4 text-text-muted">{p.category?.name || "-"}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span></td>
                  <td className="px-6 py-4 text-text-muted">{format(new Date(p.createdAt), "dd MMM yyyy")}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(p)} className="p-1.5 text-text-muted hover:text-primary transition-colors"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deletePost(p._id)} className="p-1.5 text-text-muted hover:text-danger transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
