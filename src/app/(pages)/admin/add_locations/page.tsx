"use client";

import { FormEvent, useState, useEffect } from "react";
import { SideBar } from "@/components/admin";
import { Fetch_toFile, Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";
import { useRouter } from "next/navigation";

type Transportation = {
  type: string;
  description: string;
};

type ApiResponseData = {
  message?: string;
};

const locationTypes = [
  "Barangay",
  "Beaches",
  "Cafe",
  "Heritage",
  "Resort",
  "Tourist Spot",
];

const emptyForm = {
  category: locationTypes[0],
  name: "",
  address: "",
  facebook_page: "",
  gmail: "",
  transportations: [{ type: "", description: "" }] as Transportation[],
  about: "",
  image_src: "",
  iframe_link: "",
};

export default function AddLocationsPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const [disabled_button, setDisabled_button] = useState(false);

  useEffect(() => {
    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
  }, []);

  const updateField = (field: keyof typeof emptyForm, value: string) => {
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
    setSelectedImage(file);
    updateField("image_src", file?.name ?? "");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setDisabled_button(true);

    if (selectedImage === null) {
      setMessage("Please attach an image before adding a location.");
      return;
    }

    const response = await Fetch_toFile(json_route.admin.add_location, selectedImage, {
      category: form.category,
      name: form.name,
      locations: form.address,
      facebook_page: form.facebook_page,
      gmail: form.gmail,
      transportations: JSON.stringify(form.transportations),
      about: form.about,
      iframe_link: form.iframe_link,
    });

    if (response.success) {
      const data = response.data as ApiResponseData | null;
      setMessage(data?.message ?? "Location submitted.");
      setDisabled_button(false);
    } else {
      setMessage(response.message);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Add Locations</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Add a new barangay, beach, cafe, heritage site, resort, or tourist spot record.
          </p>
        </div>

        {message ? (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
            {message}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3"
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Location Type
            <select
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            >
              {locationTypes.map((locationType) => (
                <option key={locationType} value={locationType}>
                  {locationType}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Name
            <input
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Location name"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Address
            <input
              required
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
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

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Google Map Embeded Link
            <textarea
              value={form.iframe_link}
              onChange={(event) => updateField("iframe_link", event.target.value)}
              className="min-h-24 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Google Maps embeded link"
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
              placeholder="Information about this location."
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

          <div className="flex items-end justify-end sm:col-span-2 lg:col-span-1">
            <button
              type="submit"
              disabled={disabled_button}
              style={{ opacity: disabled_button ? "0.5" : "1" }}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 sm:w-auto"
            >
              <span aria-hidden="true" className="text-lg leading-none">+</span>
              Add Location
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
