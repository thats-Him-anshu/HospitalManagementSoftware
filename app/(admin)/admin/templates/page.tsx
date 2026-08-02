"use client";

import { useState, useEffect, useCallback } from "react";
import { BookOpen, Plus, X, Save, Trash2, Edit2, Apple, Dumbbell } from "lucide-react";

const DIET_CATEGORIES = ["weight-loss", "diabetes", "general", "detox", "custom"];
const YOGA_LEVELS = ["beginner", "intermediate", "advanced"];

interface DietTemplate {
  _id: string; name: string; description?: string; category: string;
  meals: Array<{ mealTime: string; items: string[]; notes?: string }>;
  createdBy?: { name: string }; isActive: boolean;
}
interface YogaTemplate {
  _id: string; name: string; description?: string; duration: number; level: string;
  poses: Array<{ name: string; duration?: number; repetitions?: number; notes?: string }>;
  createdBy?: { name: string }; isActive: boolean;
}

export default function TemplatesPage() {
  const [tab, setTab] = useState<"diet" | "yoga">("diet");
  const [diets, setDiets] = useState<DietTemplate[]>([]);
  const [yogas, setYogas] = useState<YogaTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDietModal, setShowDietModal] = useState(false);
  const [showYogaModal, setShowYogaModal] = useState(false);
  const [editingDiet, setEditingDiet] = useState<DietTemplate | null>(null);
  const [editingYoga, setEditingYoga] = useState<YogaTemplate | null>(null);
  const [dietForm, setDietForm] = useState({ name: "", description: "", category: "general", meals: [{ mealTime: "Breakfast", items: [""], notes: "" }] });
  const [yogaForm, setYogaForm] = useState({ name: "", description: "", duration: 30, level: "beginner", poses: [{ name: "", duration: 0, repetitions: 0, notes: "" }] });

  const fetchData = useCallback(async () => {
    try {
      const [dRes, yRes] = await Promise.all([fetch("/api/diet-templates"), fetch("/api/yoga-templates")]);
      const [dJson, yJson] = await Promise.all([dRes.json(), yRes.json()]);
      if (dJson.success) setDiets(dJson.data);
      if (yJson.success) setYogas(yJson.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveDiet = async () => {
    const url = editingDiet ? `/api/diet-templates/${editingDiet._id}` : "/api/diet-templates";
    const method = editingDiet ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(dietForm) });
    setShowDietModal(false); fetchData();
  };

  const saveYoga = async () => {
    const url = editingYoga ? `/api/yoga-templates/${editingYoga._id}` : "/api/yoga-templates";
    const method = editingYoga ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(yogaForm) });
    setShowYogaModal(false); fetchData();
  };

  const deleteDiet = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/diet-templates/${id}`, { method: "DELETE" }); fetchData(); };
  const deleteYoga = async (id: string) => { if (!confirm("Delete?")) return; await fetch(`/api/yoga-templates/${id}`, { method: "DELETE" }); fetchData(); };

  const addMeal = () => setDietForm({ ...dietForm, meals: [...dietForm.meals, { mealTime: "", items: [""], notes: "" }] });
  const addPose = () => setYogaForm({ ...yogaForm, poses: [...yogaForm.poses, { name: "", duration: 0, repetitions: 0, notes: "" }] });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-text">Diet & Yoga Templates</h1>
        <button onClick={() => { tab === "diet" ? (setEditingDiet(null), setDietForm({ name: "", description: "", category: "general", meals: [{ mealTime: "Breakfast", items: [""], notes: "" }] }), setShowDietModal(true)) : (setEditingYoga(null), setYogaForm({ name: "", description: "", duration: 30, level: "beginner", poses: [{ name: "", duration: 0, repetitions: 0, notes: "" }] }), setShowYogaModal(true)); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Add {tab === "diet" ? "Diet" : "Yoga"} Template
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-surface rounded-lg w-fit">
        <button onClick={() => setTab("diet")} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "diet" ? "bg-white text-text shadow-sm" : "text-text-muted hover:text-text"}`}>
          <Apple className="w-4 h-4" /> Diet Plans ({diets.length})
        </button>
        <button onClick={() => setTab("yoga")} className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === "yoga" ? "bg-white text-text shadow-sm" : "text-text-muted hover:text-text"}`}>
          <Dumbbell className="w-4 h-4" /> Yoga Programs ({yogas.length})
        </button>
      </div>

      {loading ? <div className="text-center py-20 text-text-muted">Loading...</div> : tab === "diet" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {diets.length === 0 && <div className="col-span-full text-center py-20 text-text-muted">No diet templates yet.</div>}
          {diets.map((d) => (
            <div key={d._id} className="bg-white rounded-xl border border-border p-5 shadow-soft hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-text">{d.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">{d.category}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingDiet(d); setDietForm({ name: d.name, description: d.description || "", category: d.category, meals: d.meals.length ? d.meals : [{ mealTime: "Breakfast", items: [""], notes: "" }] }); setShowDietModal(true); }} className="p-1.5 hover:bg-surface rounded"><Edit2 className="w-3.5 h-3.5 text-text-muted" /></button>
                  <button onClick={() => deleteDiet(d._id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                </div>
              </div>
              {d.description && <p className="text-xs text-text-muted mb-3">{d.description}</p>}
              <div className="text-xs text-text-muted">{d.meals.length} meals defined</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {yogas.length === 0 && <div className="col-span-full text-center py-20 text-text-muted">No yoga templates yet.</div>}
          {yogas.map((y) => (
            <div key={y._id} className="bg-white rounded-xl border border-border p-5 shadow-soft hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-text">{y.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">{y.level}</span>
                    <span className="text-xs text-text-muted">{y.duration} min</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditingYoga(y); setYogaForm({ name: y.name, description: y.description || "", duration: y.duration, level: y.level, poses: y.poses.length ? y.poses : [{ name: "", duration: 0, repetitions: 0, notes: "" }] }); setShowYogaModal(true); }} className="p-1.5 hover:bg-surface rounded"><Edit2 className="w-3.5 h-3.5 text-text-muted" /></button>
                  <button onClick={() => deleteYoga(y._id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                </div>
              </div>
              {y.description && <p className="text-xs text-text-muted mb-3">{y.description}</p>}
              <div className="text-xs text-text-muted">{y.poses.length} poses defined</div>
            </div>
          ))}
        </div>
      )}

      {/* Diet Template Modal */}
      {showDietModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">{editingDiet ? "Edit" : "Add"} Diet Template</h2>
              <button onClick={() => setShowDietModal(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-medium text-text-muted block mb-1">Name</label><input value={dietForm.name} onChange={e => setDietForm({ ...dietForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Category</label><select value={dietForm.category} onChange={e => setDietForm({ ...dietForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{DIET_CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Description</label><input value={dietForm.description} onChange={e => setDietForm({ ...dietForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-text-muted">Meals</label><button onClick={addMeal} className="text-xs text-primary font-medium">+ Add Meal</button></div>
                {dietForm.meals.map((meal, i) => (
                  <div key={i} className="p-3 bg-surface rounded-lg mb-2 space-y-2">
                    <input value={meal.mealTime} onChange={e => { const m = [...dietForm.meals]; m[i].mealTime = e.target.value; setDietForm({ ...dietForm, meals: m }); }} placeholder="Meal time (e.g. Breakfast)" className="w-full px-3 py-2 rounded border border-border text-sm" />
                    <input value={meal.items.join(", ")} onChange={e => { const m = [...dietForm.meals]; m[i].items = e.target.value.split(",").map(s => s.trim()); setDietForm({ ...dietForm, meals: m }); }} placeholder="Items (comma separated)" className="w-full px-3 py-2 rounded border border-border text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowDietModal(false)} className="px-4 py-2 text-sm text-text-muted">Cancel</button>
              <button onClick={saveDiet} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Yoga Template Modal */}
      {showYogaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-semibold text-text">{editingYoga ? "Edit" : "Add"} Yoga Template</h2>
              <button onClick={() => setShowYogaModal(false)}><X className="w-5 h-5 text-text-muted" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="text-sm font-medium text-text-muted block mb-1">Name</label><input value={yogaForm.name} onChange={e => setYogaForm({ ...yogaForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium text-text-muted block mb-1">Level</label><select value={yogaForm.level} onChange={e => setYogaForm({ ...yogaForm, level: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm">{YOGA_LEVELS.map(l => <option key={l}>{l}</option>)}</select></div>
                <div><label className="text-sm font-medium text-text-muted block mb-1">Duration (min)</label><input type="number" value={yogaForm.duration} onChange={e => setYogaForm({ ...yogaForm, duration: +e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              </div>
              <div><label className="text-sm font-medium text-text-muted block mb-1">Description</label><input value={yogaForm.description} onChange={e => setYogaForm({ ...yogaForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm" /></div>
              <div>
                <div className="flex items-center justify-between mb-2"><label className="text-sm font-medium text-text-muted">Poses</label><button onClick={addPose} className="text-xs text-primary font-medium">+ Add Pose</button></div>
                {yogaForm.poses.map((pose, i) => (
                  <div key={i} className="p-3 bg-surface rounded-lg mb-2 grid grid-cols-3 gap-2">
                    <input value={pose.name} onChange={e => { const p = [...yogaForm.poses]; p[i].name = e.target.value; setYogaForm({ ...yogaForm, poses: p }); }} placeholder="Pose name" className="col-span-3 px-3 py-2 rounded border border-border text-sm" />
                    <input type="number" value={pose.duration} onChange={e => { const p = [...yogaForm.poses]; p[i].duration = +e.target.value; setYogaForm({ ...yogaForm, poses: p }); }} placeholder="Sec" className="px-3 py-2 rounded border border-border text-sm" />
                    <input type="number" value={pose.repetitions} onChange={e => { const p = [...yogaForm.poses]; p[i].repetitions = +e.target.value; setYogaForm({ ...yogaForm, poses: p }); }} placeholder="Reps" className="px-3 py-2 rounded border border-border text-sm" />
                    <input value={pose.notes} onChange={e => { const p = [...yogaForm.poses]; p[i].notes = e.target.value; setYogaForm({ ...yogaForm, poses: p }); }} placeholder="Notes" className="px-3 py-2 rounded border border-border text-sm" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button onClick={() => setShowYogaModal(false)} className="px-4 py-2 text-sm text-text-muted">Cancel</button>
              <button onClick={saveYoga} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
