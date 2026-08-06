"use client";

import { useCallback, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { Spinner } from "@/components/ui/spinner";
import { PageLoader } from "@/components/ui/page-loader";
import { ErrorNote } from "@/components/ui/error-note";
import { AdminTable, AdminTableRow } from "@/components/admin/admin-table";
import {
  AdminPageHeader,
  adminInput,
  adminPrimaryButton,
} from "@/components/admin/admin-page-header";
import { useAdminList, useAdminResource } from "@/hooks/use-admin-resource";
import { useImageUpload } from "@/hooks/use-image-upload";

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
  const {
    items: products,
    listLoading,
    saving,
    error,
    setError,
    save,
    remove,
  } = useAdminResource({
    endpoint: "/api/admin/products",
    collectionKey: "products",
    saveErrorMessage: "Failed to save product",
  });
  const { items: categories, listLoading: categoriesLoading } = useAdminList(
    "/api/admin/categories",
    "categories",
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const setField = useCallback(
    (field, value) => setForm((f) => ({ ...f, [field]: value })),
    [],
  );
  const { uploading, upload } = useImageUpload({
    folder: "products",
    onUploaded: setField,
    onError: setError,
  });

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

  const handleSave = async () => {
    const ok = await save(
      {
        ...form,
        price: Number(form.price),
        minOrder: Number(form.minOrder),
        stockQty: Number(form.stockQty),
      },
      editingId,
    );
    if (ok) setFormOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await remove(id);
  };

  if (listLoading || categoriesLoading) {
    return <PageLoader label="Loading products…" />;
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        subtitle={`${products.length} products`}
        align="center"
        action={
          <button type="button" onClick={openCreate} className={adminPrimaryButton}>
            <Plus className="size-4" />
            Add Product
          </button>
        }
      />

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
              onChange={(e) => setField("id", e.target.value)}
              className={`${adminInput} disabled:opacity-60`}
            />
            <input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={adminInput}
            />
            <input
              placeholder="Tamil name"
              value={form.tamilName}
              onChange={(e) => setField("tamilName", e.target.value)}
              className={adminInput}
            />
            <select
              value={form.categoryId}
              onChange={(e) => setField("categoryId", e.target.value)}
              className={adminInput}
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
              onChange={(e) => setField("price", e.target.value)}
              className={adminInput}
            />
            <input
              placeholder="Unit (e.g. per stick)"
              value={form.unit}
              onChange={(e) => setField("unit", e.target.value)}
              className={adminInput}
            />
            <input
              placeholder="Tamil unit"
              value={form.tamilUnit}
              onChange={(e) => setField("tamilUnit", e.target.value)}
              className={adminInput}
            />
            <input
              type="number"
              placeholder="Min order"
              value={form.minOrder}
              onChange={(e) => setField("minOrder", e.target.value)}
              className={adminInput}
            />
            <input
              placeholder="Min order unit (e.g. sticks)"
              value={form.minOrderUnit}
              onChange={(e) => setField("minOrderUnit", e.target.value)}
              className={adminInput}
            />
            <select
              value={form.badge}
              onChange={(e) => setField("badge", e.target.value)}
              className={adminInput}
            >
              {BADGES.map((b) => (
                <option key={b} value={b}>{b || "No badge"}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-farm-green-dark">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setField("featured", e.target.checked)}
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-farm-green-dark">
              <input
                type="checkbox"
                checked={form.trackInventory}
                onChange={(e) => setField("trackInventory", e.target.checked)}
              />
              Track inventory
            </label>
            {form.trackInventory && (
              <input
                type="number"
                placeholder="Stock quantity"
                value={form.stockQty}
                onChange={(e) => setField("stockQty", e.target.value)}
                className={adminInput}
              />
            )}
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={`${adminInput} py-2 md:col-span-2`}
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
                  onChange={(e) => upload(e, "image")}
                  disabled={uploading}
                />
                {uploading && <span className="text-xs text-farm-sage">Uploading…</span>}
              </div>
            </div>
          </div>
          <ErrorNote className="mt-3">{error}</ErrorNote>
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

      <AdminTable
        columns={[
          "Product",
          "Category",
          { label: "Price", align: "right" },
          "Stock",
          "Featured",
          "",
        ]}
        isEmpty={products.length === 0}
        empty="No products yet."
      >
        {products.map((p, i) => (
          <AdminTableRow key={p.id} index={i}>
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
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
}
