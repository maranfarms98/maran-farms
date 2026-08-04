"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const EMPTY_FORM = {
  id: "",
  slug: "",
  name: "",
  tamilName: "",
  description: "",
  tamilDescription: "",
  image: "",
  heroImage: "",
  minOrder: 1,
  minOrderUnit: "",
  gradient: "",
  accent: "#15321f",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      id: c.id,
      slug: c.slug,
      name: c.name,
      tamilName: c.tamil_name || "",
      description: c.description || "",
      tamilDescription: c.tamil_description || "",
      image: c.image || "",
      heroImage: c.hero_image || "",
      minOrder: c.min_order || 1,
      minOrderUnit: c.min_order_unit || "",
      gradient: c.gradient || "",
      accent: c.accent || "#15321f",
    });
    setError("");
    setFormOpen(true);
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "categories");
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Upload failed");
      setForm((f) => ({ ...f, [field]: data.url }));
    } finally {
      setUploadingField(null);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, minOrder: Number(form.minOrder) };
      const res = editingId
        ? await fetch(`/api/admin/categories/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to save category");
      setFormOpen(false);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? This fails if it still has products.")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Failed to delete category");
      return;
    }
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-farm-green-dark">Categories</h1>
          <p className="mt-1 text-sm text-farm-sage">{categories.length} categories</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-farm-green px-5 text-sm font-semibold text-farm-green-light"
        >
          <Plus className="size-4" />
          Add Category
        </button>
      </div>

      {formOpen && (
        <div className="mt-6 rounded-3xl border border-farm-green-dark/10 bg-farm-cream p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-farm-green-dark">
              {editingId ? "Edit Category" : "New Category"}
            </p>
            <button type="button" onClick={() => setFormOpen(false)} className="text-farm-sage">
              <X className="size-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              placeholder="ID (e.g. napier)"
              value={form.id}
              disabled={Boolean(editingId)}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm disabled:opacity-60"
            />
            <input
              placeholder="Slug (e.g. napier-plants)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <input
              placeholder="Tamil name"
              value={form.tamilName}
              onChange={(e) => setForm({ ...form, tamilName: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <input
              type="number"
              placeholder="Min order"
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <input
              placeholder="Min order unit"
              value={form.minOrderUnit}
              onChange={(e) => setForm({ ...form, minOrderUnit: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="h-11 rounded-xl border border-farm-green-dark/15 bg-white px-3 py-2 text-sm md:col-span-2"
            />
            <textarea
              placeholder="Tamil description"
              value={form.tamilDescription}
              onChange={(e) => setForm({ ...form, tamilDescription: e.target.value })}
              className="h-11 rounded-xl border border-farm-green-dark/15 bg-white px-3 py-2 text-sm md:col-span-2"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-farm-green-dark">
                Category Image
              </label>
              <div className="flex items-center gap-3">
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image} alt="" className="size-16 rounded-xl object-cover" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => handleUpload(e, "image")}
                  disabled={Boolean(uploadingField)}
                />
                {uploadingField === "image" && (
                  <span className="text-xs text-farm-sage">Uploading…</span>
                )}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-farm-green-dark">
                Hero Image
              </label>
              <div className="flex items-center gap-3">
                {form.heroImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.heroImage} alt="" className="size-16 rounded-xl object-cover" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => handleUpload(e, "heroImage")}
                  disabled={Boolean(uploadingField)}
                />
                {uploadingField === "heroImage" && (
                  <span className="text-xs text-farm-sage">Uploading…</span>
                )}
              </div>
            </div>
          </div>
          {error && (
            <p className="mt-3 rounded-xl bg-farm-accent/10 px-3 py-2 text-sm text-farm-accent-dark">
              {error}
            </p>
          )}
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="focus-ring mt-4 flex h-11 items-center gap-2 rounded-full bg-farm-green px-6 text-sm font-semibold text-farm-green-light disabled:opacity-60"
          >
            {saving && <Spinner className="size-4" />}
            {saving ? "Saving…" : "Save Category"}
          </button>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-farm-green-dark/10 bg-farm-cream">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-farm-green-dark/8 text-left text-xs font-semibold uppercase tracking-wider text-farm-sage">
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Slug</th>
              <th className="px-5 py-4">Min Order</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr
                key={c.id}
                className={`border-b border-farm-green-dark/6 last:border-0 ${i % 2 ? "bg-farm-warm/40" : ""}`}
              >
                <td className="px-5 py-4 font-medium text-farm-green-dark">{c.name}</td>
                <td className="px-5 py-4 text-farm-sage">{c.slug}</td>
                <td className="px-5 py-4 text-farm-sage">
                  {c.min_order} {c.min_order_unit}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(c)} className="text-farm-green hover:text-farm-accent">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(c.id)} className="text-farm-accent hover:text-farm-accent-dark">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-farm-sage">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
