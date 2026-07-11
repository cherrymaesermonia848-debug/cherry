"use client";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";
import { FormEvent, useEffect, useState, useRef } from "react";
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
  transportations: Transportation[] | string | null;
  about: string;
  image_src: string;
  iframe_link: string;
};

type ResourceManagerProps = {
  title: string;
  singularName: string;
};

type RetrieveResponseData = {
  message?: ResourceRecord[];
};

type ResourceForm = {
  name: string;
  locations: string;
  facebook_page: string;
  gmail: string;
  transportations: Transportation[];
  about: string;
  image_src: string;
  iframe_link: string;
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

const parseTransportations = (
  transportations: ResourceRecord["transportations"],
): Transportation[] => {
  if (Array.isArray(transportations)) {
    return transportations;
  }

  if (typeof transportations !== "string" || transportations.trim().length === 0) {
    return [];
  }

  try {
    const parsedTransportations = JSON.parse(transportations) as unknown;

    if (!Array.isArray(parsedTransportations)) {
      return [];
    }

    return parsedTransportations.filter((transportation): transportation is Transportation => {
      if (typeof transportation !== "object" || transportation === null) {
        return false;
      }

      return "type" in transportation && "description" in transportation;
    });
  } catch {
    return [
      {
        type: "Transportation",
        description: transportations,
      },
    ];
  }
};

export default function ResourceManager({
  title,
  singularName,
}: ResourceManagerProps) {
  const [records, setRecords] = useState<ResourceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<ResourceRecord | null>(null);
  const [editingRecord, setEditingRecord] = useState<ResourceRecord | null>(null);
  const [form, setForm] = useState<ResourceForm>(emptyResourceForm);
  const [pendingDelete, setPendingDelete] = useState<ResourceRecord | null>(null);
  const [lastDeletedRecord, setLastDeletedRecord] = useState<ResourceRecord | null>(null);
  const deleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const openEditForm = (record: ResourceRecord) => {
    setForm({
      name: record.name,
      locations: record.locations,
      facebook_page: record.facebook_page,
      gmail: record.gmail,
      transportations: parseTransportations(record.transportations).length > 0
        ? parseTransportations(record.transportations)
        : [{ type: "", description: "" }],
      about: record.about,
      image_src: record.image_src,
      iframe_link: record.iframe_link,
    });
    setEditingRecord(record);
  };

  

  const closeEditForm = () => {
    setEditingRecord(null);
    setForm(emptyResourceForm);
  };

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingRecord === null) return;

    setIsSaving(true);

    try {
      const response = await Fetch_to(json_route.admin.update_location, {
        id: editingRecord.id,
        category: title,
        ...form,
        transportations: JSON.stringify(form.transportations),
      });

      if (!response.success) {
        console.error("Update failed: ", response.message);
        return;
      }

      setRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.id === editingRecord.id ? { ...record, ...form } : record
        )
      );

      setSelectedRecord((currentRecord) =>
        currentRecord?.id === editingRecord.id ? { ...currentRecord, ...form } : currentRecord
      );

      closeEditForm();
    } finally {
      setIsSaving(false);
      setRefresh(!refresh);
    }
  };

  const confirmDeleteRecord = () => {
    if (pendingDelete === null) {
      return;
    }

    const recordToDelete = pendingDelete;

    setRecords((currentRecords) => currentRecords.filter((record) => record.id !== recordToDelete.id));
    setLastDeletedRecord(recordToDelete);
    setPendingDelete(null);

    // give the user a window to undo before it's actually deleted from the DB
    deleteTimeoutRef.current = setTimeout(() => {
      DeleteCompletely(recordToDelete);
    }, 5000);
  };

  const undoDelete = () => {
    if (lastDeletedRecord === null) {
      return;
    }

    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
    }

    setRecords((currentRecords) => {
      const restoredRecords = [...currentRecords, lastDeletedRecord];
      return restoredRecords.sort((firstRecord, secondRecord) => firstRecord.id - secondRecord.id);
    });
    setLastDeletedRecord(null);
  };

  const DeleteCompletely = async (record: ResourceRecord) => {
    const response = await Fetch_to(json_route.admin.delete_location, {
      id: record.id,
      category: title,
    });

    if (!response.success) {
      console.error("Delete failed: ", response.message);
      // put it back in the UI since the backend delete failed
      setRecords((currentRecords) => {
        const restoredRecords = [...currentRecords, record];
        return restoredRecords.sort((a, b) => a.id - b.id);
      });
    }

    setLastDeletedRecord((current) => (current?.id === record.id ? null : current));
  };

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);


  useEffect(() => {
    async function Retrieve() {
      setIsLoading(true);
      const response = await Fetch_to(json_route.admin.retrieve_location, { category: title });
      
      if (response.success) {
        const data = response.data as RetrieveResponseData | null;
        const fetchedRecords = Array.isArray(data?.message) ? data.message : [];
        setRecords([...fetchedRecords].sort((a, b) => b.id - a.id));
      }

      setIsLoading(false);
    }
    Retrieve();
  }, [title, refresh]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
            <h1 className="mt-1 text-3xl font-semibold text-zinc-950">{title}</h1>
          </div>
        </div>

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

        {editingRecord ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 py-6">
            <form
              onSubmit={handleSubmit}
              className="grid max-h-[90vh] w-full max-w-5xl gap-4 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-4 shadow-xl sm:grid-cols-2 lg:grid-cols-3"
            >
              <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-3 sm:col-span-2 lg:col-span-3">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">Edit {singularName}</h2>
                  <p className="text-sm text-zinc-500">Update the selected record.</p>
                </div>
                <button
                  type="button"
                  onClick={closeEditForm}
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

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700 sm:col-span-2">
                Image Source
                <input
                  value={form.image_src}
                  onChange={(event) => updateField("image_src", event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Image path or filename"
                />
              </label>

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
                  onClick={closeEditForm}
                  className="h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {selectedRecord ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 py-6">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-xl">
              <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-teal-700">{singularName} Details</p>
                  <h2 className="mt-1 text-2xl font-semibold text-zinc-950">{selectedRecord.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">ID #{selectedRecord.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Close
                </button>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[1fr_0.8fr]">
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">About</h3>
                    <p className="mt-2 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">
                      {selectedRecord.about || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Transportations</h3>
                    <div className="mt-2 grid gap-3">
                      {parseTransportations(selectedRecord.transportations).length > 0 ? (
                        parseTransportations(selectedRecord.transportations).map((transportation, index) => (
                          <div key={`${transportation.type}-${index}`} className="rounded-md border border-zinc-200 bg-zinc-50 p-3">
                            <span className="inline-flex rounded bg-teal-100 px-2 py-0.5 text-xs font-semibold text-teal-800">
                              {transportation.type}
                            </span>
                            <p className="mt-2 text-sm leading-6 text-zinc-700">{transportation.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500">N/A</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Location</h3>
                    <p className="mt-1 text-sm font-semibold text-zinc-950">{selectedRecord.locations || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Gmail</h3>
                    <p className="mt-1 break-words text-sm text-zinc-700">{selectedRecord.gmail || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Facebook Page</h3>
                    <p className="mt-1 break-words text-sm text-zinc-700">{selectedRecord.facebook_page || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Image</h3>
                    <p className="mt-1 break-words text-sm text-zinc-700">{selectedRecord.image_src || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Map</h3>
                    <p className="mt-1 break-words text-sm text-zinc-700">{selectedRecord.iframe_link || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
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
                {isLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      {Array.from({ length: 9 }).map((__, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-4">
                          <div className="h-4 rounded bg-zinc-200" />
                          {cellIndex === 0 || cellIndex === 4 || cellIndex === 5 ? (
                            <div className="mt-2 h-3 w-2/3 rounded bg-zinc-100" />
                          ) : null}
                        </td>
                      ))}
                    </tr>
                  ))
                  : records.map((record) => (
                  <tr
                    key={record.id}
                    onClick={() => setSelectedRecord(record)}
                    className="cursor-pointer align-top transition odd:bg-white even:bg-zinc-50/60 hover:bg-teal-50/60"
                  >
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
                        {parseTransportations(record.transportations).map((transportation, index) => (
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
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditForm(record);
                          }}
                          className="h-9 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-white"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async(event) => {
                            event.stopPropagation();
                            setPendingDelete(record);
                          }}
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

          {!isLoading && records.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm font-medium text-zinc-500">No records loaded yet.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}
