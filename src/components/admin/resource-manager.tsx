"use client";

import { FormEvent, useMemo, useState } from "react";
import SideBar from "./sidebar";

type Transportation = {
  type: string;
  description: string;
};

type ResourceRecord = {
  id: number;
  name: string;
  locations: string;
  facebook_page: string;
  gmail: string;
  transportations: Transportation[];
  about: string;
  image_src: string;
  iframe_link: string;
};

type ResourceForm = Omit<ResourceRecord, "id">;

type ResourceManagerProps = {
  title: string;
  singularName: string;
  sampleRecord: ResourceRecord;
};

const emptyResourceForm: ResourceForm = {
  name: "",
  locations: "",
  facebook_page: "",
  gmail: "",
  transportations: [{ type: "", description: "" }],
  about: "",
  image_src: "",
  iframe_link: "",
};

export default function ResourceManager({
  title,
  singularName,
  sampleRecord,
}: ResourceManagerProps) {
  const [records, setRecords] = useState<ResourceRecord[]>([sampleRecord]);
  const [form, setForm] = useState<ResourceForm>(emptyResourceForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ResourceRecord | null>(null);
  const [lastDeletedRecord, setLastDeletedRecord] = useState<ResourceRecord | null>(null);

  const nextId = useMemo(() => {
    return records.length > 0 ? Math.max(...records.map((record) => record.id)) + 1 : 1;
  }, [records]);

  const updateField = (field: keyof ResourceForm, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const updateTransportation = (
    index: number,
    field: keyof Transportation,
    value: string,
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      transportations: currentForm.transportations.map((transportation, currentIndex) => {
        if (currentIndex !== index) {
          return transportation;
        }

        return {
          ...transportation,
          [field]: value,
        };
      }),
    }));
  };

  const addTransportation = () => {
    setForm((currentForm) => ({
      ...currentForm,
      transportations: [
        ...currentForm.transportations,
        {
          type: "",
          description: "",
        },
      ],
    }));
  };

  const removeTransportation = (index: number) => {
    setForm((currentForm) => ({
      ...currentForm,
      transportations:
        currentForm.transportations.length > 1
          ? currentForm.transportations.filter((_, currentIndex) => currentIndex !== index)
          : currentForm.transportations,
    }));
  };

  const handleImageUpload = (file: File | null) => {
    updateField("image_src", file?.name ?? "");
  };

  const openAddForm = () => {
    setForm(emptyResourceForm);
    setEditingId(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setForm(emptyResourceForm);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const editRecord = (record: ResourceRecord) => {
    setForm({
      name: record.name,
      locations: record.locations,
      facebook_page: record.facebook_page,
      gmail: record.gmail,
      transportations: record.transportations,
      about: record.about,
      image_src: record.image_src,
      iframe_link: record.iframe_link,
    });
    setEditingId(record.id);
    setIsFormOpen(true);
  };

  const confirmDeleteRecord = () => {
    if (pendingDelete === null) {
      return;
    }

    setRecords((currentRecords) => currentRecords.filter((record) => record.id !== pendingDelete.id));
    setLastDeletedRecord(pendingDelete);
    setPendingDelete(null);
  };

  const undoDelete = () => {
    if (lastDeletedRecord === null) {
      return;
    }

    setRecords((currentRecords) => {
      const restoredRecords = [...currentRecords, lastDeletedRecord];
      return restoredRecords.sort((firstRecord, secondRecord) => firstRecord.id - secondRecord.id);
    });
    setLastDeletedRecord(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId !== null) {
      setRecords((currentRecords) =>
        currentRecords.map((record) => {
          if (record.id !== editingId) {
            return record;
          }

          return {
            id: editingId,
            ...form,
          };
        }),
      );
      closeForm();
      return;
    }

    setRecords((currentRecords) => [
      ...currentRecords,
      {
        id: nextId,
        ...form,
      },
    ]);
    closeForm();
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
            <h1 className="mt-1 text-3xl font-semibold text-zinc-950">{title}</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isFormOpen) {
                closeForm();
                return;
              }

              openAddForm();
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
          >
            <span aria-hidden="true" className="text-lg leading-none">+</span>
            {isFormOpen ? "Close form" : `Add ${singularName}`}
          </button>
        </div>

        {isFormOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 py-6">
            <form
              onSubmit={handleSubmit}
              className="grid max-h-[90vh] w-full max-w-5xl gap-4 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-3"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-3 sm:col-span-2 lg:col-span-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">
                    {editingId === null ? `Add ${singularName}` : `Edit ${singularName}`}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {editingId === null ? `Insert a new ${singularName.toLowerCase()} record.` : "Update the selected record."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Close
                </button>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Name
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder={`${singularName} name`}
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Locations
                <input
                  required
                  value={form.locations}
                  onChange={(event) => updateField("locations", event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Barangay or full address"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Facebook Page
                <input
                  value={form.facebook_page}
                  onChange={(event) => updateField("facebook_page", event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="https://facebook.com/page"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Gmail
                <input
                  type="email"
                  value={form.gmail}
                  onChange={(event) => updateField("gmail", event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="name@gmail.com"
                />
              </label>

              <div className="flex flex-col gap-3 text-sm font-medium text-zinc-700 sm:col-span-2 lg:col-span-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span>Transportations</span>
                  <button
                    type="button"
                    onClick={addTransportation}
                    className="h-10 rounded-md border border-teal-700 px-4 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
                  >
                    Add transportation
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {form.transportations.map((transportation, index) => (
                    <div
                      key={index}
                      className="grid gap-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 sm:grid-cols-[180px_1fr_auto]"
                    >
                      <label className="flex flex-col gap-2">
                        Type
                        <input
                          required
                          value={transportation.type}
                          onChange={(event) => updateTransportation(index, "type", event.target.value)}
                          className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                          placeholder="Motor, bus, van"
                        />
                      </label>

                      <label className="flex flex-col gap-2">
                        Description
                        <textarea
                          required
                          value={transportation.description}
                          onChange={(event) => updateTransportation(index, "description", event.target.value)}
                          className="min-h-20 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                          placeholder="Example: You can ride a motor from the town proper."
                        />
                      </label>

                      <button
                        type="button"
                        onClick={() => removeTransportation(index)}
                        disabled={form.transportations.length === 1}
                        className="h-11 self-end rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 lg:col-span-3">
                About
                <textarea
                  required
                  value={form.about}
                  onChange={(event) => updateField("about", event.target.value)}
                  className="min-h-28 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder={`Information about the ${singularName.toLowerCase()}.`}
                />
              </label>

              <div className="flex flex-col gap-2 text-sm font-medium text-zinc-700 sm:col-span-2">
                Image Upload
                <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-4 text-center transition hover:border-teal-600 hover:bg-teal-50">
                  <span className="rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
                    Upload Image
                  </span>
                  <span className="max-w-full break-words text-xs font-normal text-zinc-600">
                    {form.image_src || "Choose an image from your device"}
                  </span>
                  <input
                    required={form.image_src.length === 0}
                    type="file"
                    accept="image/*"
                    onChange={(event) => handleImageUpload(event.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Iframe Link
                <textarea
                  value={form.iframe_link}
                  onChange={(event) => updateField("iframe_link", event.target.value)}
                  className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Google Maps iframe link"
                />
              </label>

              <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end lg:col-span-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                  {editingId === null ? "Insert" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {pendingDelete ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 py-6">
            <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-zinc-950">Delete record?</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Are you sure you want to delete <span className="font-semibold text-zinc-950">{pendingDelete.name}</span>?
                You can undo this after deleting.
              </p>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteRecord}
                  className="h-11 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {lastDeletedRecord ? (
          <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Deleted <span className="font-semibold">{lastDeletedRecord.name}</span>.
            </span>
            <button
              type="button"
              onClick={undoDelete}
              className="h-9 rounded-md bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Undo
            </button>
          </div>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">{singularName} Records</h2>
              <p className="text-sm text-zinc-500">{records.length} total record{records.length === 1 ? "" : "s"}</p>
            </div>
          </div>

          <div className="scrollbar-hidden overflow-x-auto">
            <table className="w-full min-w-[1370px] border-collapse text-left text-sm">
              <thead className="bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-white">
                <tr>
                  <th className="w-44 px-4 py-3">Name</th>
                  <th className="w-52 px-4 py-3">Locations</th>
                  <th className="w-56 px-4 py-3">Facebook</th>
                  <th className="w-52 px-4 py-3">Gmail</th>
                  <th className="w-80 px-4 py-3">Transportations</th>
                  <th className="w-80 px-4 py-3">About</th>
                  <th className="w-56 px-4 py-3">Image</th>
                  <th className="w-56 px-4 py-3">Map</th>
                  <th className="w-40 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {records.map((record) => (
                  <tr key={record.id} className="align-top transition odd:bg-white even:bg-zinc-50/60 hover:bg-teal-50/60">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-zinc-950">{record.name}</div>
                      <div className="mt-1 text-xs font-medium text-zinc-400">ID #{record.id}</div>
                    </td>
                    <td className="px-4 py-4 text-zinc-700">
                      <span className="line-clamp-3">{record.locations}</span>
                    </td>
                    <td className="px-4 py-4">
                      {record.facebook_page ? (
                        <a
                          href={record.facebook_page}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-52 items-center rounded-md bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 underline-offset-2 hover:underline"
                        >
                          <span className="truncate">{record.facebook_page}</span>
                        </a>
                      ) : (
                        <span className="text-zinc-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {record.gmail ? (
                        <a
                          href={`mailto:${record.gmail}`}
                          className="inline-flex max-w-48 items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 underline-offset-2 hover:underline"
                        >
                          <span className="truncate">{record.gmail}</span>
                        </a>
                      ) : (
                        <span className="text-zinc-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-zinc-700">
                      <div className="flex flex-col gap-2">
                        {record.transportations.map((transportation, index) => (
                          <div key={`${transportation.type}-${index}`} className="rounded-md border border-zinc-200 bg-white p-2">
                            <span className="mb-1 inline-flex rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                              {transportation.type}
                            </span>
                            <p className="line-clamp-3 text-xs leading-5 text-zinc-600">{transportation.description}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-700">
                      <p className="line-clamp-4 leading-6">{record.about}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex max-w-52 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        <span className="truncate">{record.image_src}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {record.iframe_link ? (
                        <span className="inline-flex max-w-52 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <span className="truncate">{record.iframe_link}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => editRecord(record)}
                          className="h-9 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(record)}
                          className="h-9 rounded-md bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
