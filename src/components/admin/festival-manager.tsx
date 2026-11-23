"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import json_route from "@/config/json_route.json";
import { Fetch_to, Fetch_toFile } from "@/utilities";
import SideBar from "./sidebar";

type Festival = {
  id: number;
  name: string;
  image_url: string | null;
  image_path: string | null;
  short_description: string;
  details: string;
  status: "published" | "draft";
  featured: boolean;
  created_at: string;
  updated_at: string;
};

type FestivalForm = Pick<Festival, "name" | "short_description" | "details" | "status" | "featured">;

const emptyForm: FestivalForm = {
  name: "",
  short_description: "",
  details: "",
  status: "draft",
  featured: false,
};

const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const formatDate = (value: string) => value
  ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
  : "—";

export default function FestivalManager() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Festival | null>(null);
  const [viewing, setViewing] = useState<Festival | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Festival | null>(null);
  const [form, setForm] = useState<FestivalForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [objectUrl, setObjectUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadFestivals = useCallback(async () => {
    setIsLoading(true);
    const response = await Fetch_to(json_route.admin.festivals, { action: "list" });
    if (response.success && Array.isArray(response.data?.message)) {
      setFestivals(response.data.message);
      setError("");
    } else {
      setError(response.message ?? "Could not load festivals.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadFestivals();
  }, [loadFestivals]);

  useEffect(() => {
    if (!imageFile) {
      setObjectUrl("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const openCreate = () => {
    setError("");
    setMessage("");
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setMode("create");
  };

  const openEdit = (festival: Festival) => {
    setError("");
    setMessage("");
    setEditing(festival);
    setForm({
      name: festival.name,
      short_description: festival.short_description,
      details: festival.details,
      status: festival.status,
      featured: festival.featured,
    });
    setImageFile(null);
    setImagePreview(festival.image_url ?? "");
    setMode("edit");
  };

  const closeForm = () => {
    setMode(null);
    setEditing(null);
    setImageFile(null);
    setImagePreview("");
    setForm(emptyForm);
  };

  const chooseImage = (file?: File) => {
    if (!file) return;
    if (!allowedImageTypes.has(file.type)) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    if (file.size > maxImageSize) {
      setError("Festival images must be 5 MB or smaller.");
      return;
    }
    setError("");
    setImageFile(file);
  };

  const saveFestival = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mode) return;
    setIsSaving(true);
    setError("");
    setMessage("");
    const fields: Record<string, string | number> = {
      action: mode,
      ...(editing ? { id: editing.id } : {}),
      name: form.name,
      short_description: form.short_description,
      details: form.details,
      status: form.status,
      featured: String(form.featured),
    };
    try {
      const response = imageFile
        ? await Fetch_toFile(json_route.admin.festivals, imageFile, fields)
        : await Fetch_to(json_route.admin.festivals, fields);
      if (!response.success) {
        setError(response.message ?? "Could not save festival.");
        return;
      }
      const saved = response.data?.message as Festival;
      setFestivals((current) => {
        const withoutSupersededFeature = saved.featured
          ? current.map((festival) => ({ ...festival, featured: false }))
          : current;
        return mode === "create"
          ? [saved, ...withoutSupersededFeature]
          : withoutSupersededFeature.map((festival) => festival.id === saved.id ? saved : festival);
      });
      setMessage(mode === "create" ? "Festival added." : "Festival updated.");
      closeForm();
    } catch {
      setError("Could not save festival. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteFestival = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setError("");
    const response = await Fetch_to(json_route.admin.festivals, {
      action: "delete",
      id: pendingDelete.id,
    });
    if (response.success) {
      setFestivals((current) => current.filter((festival) => festival.id !== pendingDelete.id));
      setPendingDelete(null);
      setMessage("Festival deleted.");
    } else {
      setError(response.message ?? "Could not delete festival.");
    }
    setIsDeleting(false);
  };

  const filteredFestivals = festivals.filter((festival) => {
    const value = query.trim().toLowerCase();
    return !value || festival.name.toLowerCase().includes(value) || festival.short_description.toLowerCase().includes(value);
  });

  const activePreview = objectUrl || imagePreview;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
            <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Festival Management</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">Manage festival details, images, publication status, and the featured festival shown on the public website.</p>
          </div>
          <button type="button" onClick={openCreate} className="h-11 shrink-0 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800">Add Festival</button>
        </div>

        {message ? <div role="status" className="rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-800">{message}</div> : null}
        {error ? <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</div> : null}

        <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Festivals</h2>
              <p className="mt-1 text-sm text-zinc-500">{festivals.length} record{festivals.length === 1 ? "" : "s"}</p>
            </div>
            <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search festivals" placeholder="Search festivals" className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:max-w-xs" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Festival</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Featured</th>
                  <th className="px-4 py-3 font-semibold">Created</th>
                  <th className="px-4 py-3 font-semibold">Updated</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredFestivals.map((festival) => (
                  <tr key={festival.id} className="align-middle hover:bg-zinc-50/70">
                    <td className="px-4 py-3">
                      <div className="flex min-w-64 items-center gap-3">
                        {festival.image_url ? <img src={festival.image_url} alt="" className="size-14 shrink-0 rounded-md object-cover" /> : <div className="grid size-14 shrink-0 place-items-center rounded-md bg-zinc-100 text-xs text-zinc-400">No image</div>}
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900">{festival.name}</p>
                          <p className="mt-1 max-w-sm truncate text-xs text-zinc-500">{festival.short_description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${festival.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{festival.status === "published" ? "Published" : "Draft"}</span></td>
                    <td className="px-4 py-3">{festival.featured ? <span className="font-semibold text-amber-700">★ Featured</span> : <span className="text-zinc-400">—</span>}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-600">{formatDate(festival.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-600">{formatDate(festival.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setViewing(festival)} className="h-9 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">View</button>
                        <button type="button" onClick={() => openEdit(festival)} className="h-9 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">Edit</button>
                        <button type="button" onClick={() => { setError(""); setPendingDelete(festival); }} className="h-9 rounded-md bg-red-600 px-3 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!isLoading && filteredFestivals.length === 0 ? <div className="px-4 py-12 text-center text-sm text-zinc-500">{festivals.length ? "No festivals match your search." : "No festivals added yet."}</div> : null}
          {isLoading ? <div className="px-4 py-12 text-center text-sm text-zinc-500">Loading festivals…</div> : null}
        </div>
      </section>

      {mode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 py-6">
          <form onSubmit={saveFestival} className="grid max-h-[92vh] w-full max-w-3xl gap-4 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4 shadow-xl sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-3">
              <div><h2 className="text-lg font-semibold">{mode === "create" ? "Add Festival" : "Edit Festival"}</h2><p className="text-sm text-zinc-500">Festival details are saved to the database.</p></div>
              <button type="button" onClick={closeForm} className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-100">Close</button>
            </div>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">Festival Name
              <input required maxLength={160} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-11 rounded-md border border-zinc-300 px-3 text-zinc-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">Festival Image
              {activePreview ? <img src={activePreview} alt="Festival preview" className="h-48 w-full rounded-md bg-zinc-100 object-cover" /> : <div className="grid h-36 place-items-center rounded-md bg-zinc-100 text-sm text-zinc-500">Image preview appears here</div>}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => chooseImage(event.target.files?.[0])} className="block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:font-semibold file:text-teal-800 hover:file:bg-teal-100" />
              <span className="text-xs font-normal text-zinc-500">JPEG, PNG, WebP, or GIF; maximum 5 MB. Choose an image to replace the current one.</span>
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">Short Description
              <textarea required maxLength={500} rows={3} value={form.short_description} onChange={(event) => setForm((current) => ({ ...current, short_description: event.target.value }))} className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
            </label>
            <label className="grid gap-2 text-sm font-medium text-zinc-700">Full Description / Festival Details
              <textarea required rows={6} value={form.details} onChange={(event) => setForm((current) => ({ ...current, details: event.target.value }))} className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-zinc-700">Status
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as FestivalForm["status"], featured: event.target.value === "published" ? current.featured : false }))} className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-zinc-950 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
                  <option value="draft">Draft</option><option value="published">Published</option>
                </select>
              </label>
              <label className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium ${form.status === "published" ? "border-zinc-300 text-zinc-700" : "border-zinc-200 bg-zinc-50 text-zinc-400"}`}>
                <input type="checkbox" checked={form.featured} disabled={form.status !== "published"} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} className="size-4 accent-teal-700" />
                Featured on public Festivals section
              </label>
            </div>
            {error ? <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p> : null}
            <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeForm} className="h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">Cancel</button>
              <button type="submit" disabled={isSaving} className="h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50">{isSaving ? "Saving…" : mode === "create" ? "Add Festival" : "Save Changes"}</button>
            </div>
          </form>
        </div>
      ) : null}

      {viewing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 py-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setViewing(null); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="festival-view-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl">
            {viewing.image_url ? <img src={viewing.image_url} alt={viewing.name} className="max-h-80 w-full bg-zinc-100 object-cover" /> : null}
            <div className="grid gap-4 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Festival Details</p><h2 id="festival-view-title" className="mt-1 text-2xl font-semibold">{viewing.name}</h2></div><button type="button" onClick={() => setViewing(null)} className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold">Close</button></div>
              <div className="flex flex-wrap gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${viewing.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"}`}>{viewing.status === "published" ? "Published" : "Draft"}</span>{viewing.featured ? <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Featured</span> : null}</div>
              <div><h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Short Description</h3><p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-800">{viewing.short_description}</p></div>
              <div><h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Festival Details</h3><p className="mt-1 whitespace-pre-line text-sm leading-6 text-zinc-800">{viewing.details}</p></div>
              <dl className="grid gap-3 border-t border-zinc-200 pt-4 text-xs text-zinc-600 sm:grid-cols-2"><div><dt className="font-semibold">Created</dt><dd className="mt-1">{formatDate(viewing.created_at)}</dd></div><div><dt className="font-semibold">Updated</dt><dd className="mt-1">{formatDate(viewing.updated_at)}</dd></div></dl>
            </div>
          </section>
        </div>
      ) : null}

      {pendingDelete ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/50 px-4 py-6" role="presentation">
          <section role="alertdialog" aria-modal="true" aria-labelledby="festival-delete-title" className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-xl">
            <h2 id="festival-delete-title" className="text-lg font-semibold">Delete festival?</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">This permanently deletes <span className="font-semibold text-zinc-950">{pendingDelete.name}</span> and its uploaded image.</p>
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setPendingDelete(null)} className="h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700">Cancel</button>
              <button type="button" onClick={deleteFestival} disabled={isDeleting} className="h-11 rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">{isDeleting ? "Deleting…" : "Confirm Delete"}</button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
