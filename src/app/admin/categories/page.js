"use client";

import { useCallback, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { PageLoader } from "@/components/ui/page-loader";
import { ErrorNote } from "@/components/ui/error-note";
import { AdminTable, AdminTableRow } from "@/components/admin/admin-table";
import {
  AdminPageHeader,
  adminInput,
  adminPrimaryButton,
} from "@/components/admin/admin-page-header";
import { useAdminResource } from "@/hooks/use-admin-resource";
import { useImageUpload } from "@/hooks/use-image-upload";

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
  const {
    items: categories,
    listLoading,
    saving,
    error,
    setError,
    save,
    remove,
  } = useAdminResource({
    endpoint: "/api/admin/categories",
    collectionKey: "categories",
    saveErrorMessage: "Failed to save category",
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const setField = useCallback(
    (field, value) => setForm((f) => ({ ...f, [field]: value })),
    [],
  );
  const { uploadingField, upload } = useImageUpload({
    folder: "categories",
    onUploaded: setField,
    onError: setError,
  });

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

  const handleSave = async () => {
    const ok = await save({ ...form, minOrder: Number(form.minOrder) }, editingId);
    if (ok) setFormOpen(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category? This fails if it still has products.")) return;
    const result = await remove(id);
    if (!result.ok) alert(result.error || "Failed to delete category");
  };

  if (listLoading) {
    return <PageLoader label="Loading categories…" />;
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        subtitle={`${categories.length} categories`}
        align="center"
        action={
          <button type="button" onClick={openCreate} className={adminPrimaryButton}>
            <Plus className="size-4" />
            Add Category
          </button>
        }
      />

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
              onChange={(e) => setField("id", e.target.value)}
              className={`${adminInput} disabled:opacity-60`}
            />
            <input
              placeholder="Slug (e.g. napier-plants)"
              value={form.slug}
              onChange={(e) => setField("slug", e.target.value)}
              className={adminInput}
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
            <input
              type="number"
              placeholder="Min order"
              value={form.minOrder}
              onChange={(e) => setField("minOrder", e.target.value)}
              className={adminInput}
            />
            <input
              placeholder="Min order unit"
              value={form.minOrderUnit}
              onChange={(e) => setField("minOrderUnit", e.target.value)}
              className={adminInput}
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              className={`${adminInput} py-2 md:col-span-2`}
            />
            <textarea
              placeholder="Tamil description"
              value={form.tamilDescription}
              onChange={(e) => setField("tamilDescription", e.target.value)}
              className={`${adminInput} py-2 md:col-span-2`}
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
                  onChange={(e) => upload(e, "image")}
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
                  onChange={(e) => upload(e, "heroImage")}
                  disabled={Boolean(uploadingField)}
                />
                {uploadingField === "heroImage" && (
                  <span className="text-xs text-farm-sage">Uploading…</span>
                )}
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
            {saving ? "Saving…" : "Save Category"}
          </button>
        </div>
      )}

      <AdminTable
        columns={["Name", "Slug", "Min Order", ""]}
        isEmpty={categories.length === 0}
        empty="No categories yet."
      >
        {categories.map((c, i) => (
          <AdminTableRow key={c.id} index={i}>
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
          </AdminTableRow>
        ))}
      </AdminTable>
    </div>
  );
}
