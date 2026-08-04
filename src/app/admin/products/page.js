"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Spinner } from "@/components/ui/spinner";

const BADGES = ["", "bestseller", "new", "limited", "bulk"];

const EMPTY_FORM = {
  id: "",
  name: "",
  tamilName: "",
  categoryId: "",
  price: "",
  unit: "",
  tamilUnit: "",
  minOrder: 1,
  minOrderUnit: "",
  image: "",
  badge: "",
  description: "",
  featured: false,
  trackInventory: true,
  stockQty: 0,
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data.products || []);
  }, []);

  const loadCategories = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setFormOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      tamilName: p.tamil_name || "",
      categoryId: p.category_id,
      price: p.price,
      unit: p.unit || "",
      tamilUnit: p.tamil_unit || "",
      minOrder: p.min_order || 1,
      minOrderUnit: p.min_order_unit || "",
      image: p.image || "",
      badge: p.badge || "",
      description: p.description || "",
      featured: p.featured,
      trackInventory: p.track_inventory,
      stockQty: p.stock_qty,
    });
    setError("");
    setFormOpen(true);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "products");
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Upload failed");
      setForm((f) => ({ ...f, image: data.url }));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), minOrder: Number(form.minOrder), stockQty: Number(form.stockQty) };
      const res = editingId
        ? await fetch(`/api/admin/products/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to save product");
      setFormOpen(false);
      loadProducts();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-farm-green-dark">Products</h1>
          <p className="mt-1 text-sm text-farm-sage">{products.length} products</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-full bg-farm-green px-5 text-sm font-semibold text-farm-green-light"
        >
          <Plus className="size-4" />
          Add Product
        </button>
      </div>

      {formOpen && (
        <div className="mt-6 rounded-3xl border border-farm-green-dark/10 bg-farm-cream p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-farm-green-dark">
              {editingId ? "Edit Product" : "New Product"}
            </p>
            <button type="button" onClick={() => setFormOpen(false)} className="text-farm-sage">
              <X className="size-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              placeholder="ID (slug, e.g. red-napier)"
              value={form.id}
              disabled={Boolean(editingId)}
              onChange={(e) => setForm({ ...form, id: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm disabled:opacity-60"
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
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <input
              placeholder="Unit (e.g. per stick)"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <input
              placeholder="Tamil unit"
              value={form.tamilUnit}
              onChange={(e) => setForm({ ...form, tamilUnit: e.target.value })}
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
              placeholder="Min order unit (e.g. sticks)"
              value={form.minOrderUnit}
              onChange={(e) => setForm({ ...form, minOrderUnit: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            />
            <select
              value={form.badge}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
            >
              {BADGES.map((b) => (
                <option key={b} value={b}>{b || "No badge"}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-farm-green-dark">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-farm-green-dark">
              <input
                type="checkbox"
                checked={form.trackInventory}
                onChange={(e) => setForm({ ...form, trackInventory: e.target.checked })}
              />
              Track inventory
            </label>
            {form.trackInventory && (
              <input
                type="number"
                placeholder="Stock quantity"
                value={form.stockQty}
                onChange={(e) => setForm({ ...form, stockQty: e.target.value })}
                className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 text-sm"
              />
            )}
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="h-11 w-full min-w-0 rounded-xl border border-farm-green-dark/15 bg-white px-3 py-2 text-sm md:col-span-2"
            />
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-farm-green-dark">
                Product Image
              </label>
              <div className="flex items-center gap-3">
                {form.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image} alt="" className="size-16 rounded-xl object-cover" />
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleUpload}
                  disabled={uploading}
                />
                {uploading && <span className="text-xs text-farm-sage">Uploading…</span>}
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
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      )}

      <div className="mt-6 overflow-x-auto rounded-3xl border border-farm-green-dark/10 bg-farm-cream">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-farm-green-dark/8 text-left text-xs font-semibold uppercase tracking-wider text-farm-sage">
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4 text-right">Price</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Featured</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr
                key={p.id}
                className={`border-b border-farm-green-dark/6 last:border-0 ${i % 2 ? "bg-farm-warm/40" : ""}`}
              >
                <td className="px-5 py-4 font-medium text-farm-green-dark">{p.name}</td>
                <td className="px-5 py-4 text-farm-sage">{p.category?.name || "—"}</td>
                <td className="px-5 py-4 text-right tabular-nums text-farm-green-dark">
                  {formatPrice(p.price)}
                </td>
                <td className="px-5 py-4 text-farm-sage">
                  {p.track_inventory ? p.stock_qty : "Unlimited"}
                </td>
                <td className="px-5 py-4">{p.featured ? "Yes" : "—"}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEdit(p)} className="text-farm-green hover:text-farm-accent">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(p.id)} className="text-farm-accent hover:text-farm-accent-dark">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-farm-sage">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
