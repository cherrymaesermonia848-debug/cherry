"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { SideBar } from "@/components/admin";
import { Fetch_to, Fetch_toFile } from "@/utilities";
import json_route from "@/config/json_route.json";
import { useRouter } from "next/navigation";

type GalleryImage = {
  id: string;
  name: string;
  size: number;
  previewUrl: string;
  file: File;
};

type UploadedImage = {
  id: number;
  created_at: string;
  image_link: string;
  src_path: string;
};

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export default function GalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isLoadingUploaded, setIsLoadingUploaded] = useState(true);
  const [message, setMessage] = useState("");
  const imagesRef = useRef<GalleryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    };
  }, []);

  const retrieveUploadedImages = async () => {
    setIsLoadingUploaded(true);
    try {
      const response = await Fetch_to(json_route.admin.retrieve_gallery);
      if (response.success) {
        setUploadedImages(response.data.message);
      }
    } finally {
      setIsLoadingUploaded(false);
    }
  };

  useEffect(() => {
    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
    retrieveUploadedImages();
  }, []);

  const attachImages = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const nextImages = imageFiles.map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      file,
    }));

    setImages((currentImages) => [...currentImages, ...nextImages]);
    setMessage("");
    event.target.value = "";
  };

  const removeImage = (id: string) => {
    setImages((currentImages) => {
      const imageToRemove = currentImages.find((image) => image.id === id);

      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return currentImages.filter((image) => image.id !== id);
    });
  };

  const clearImages = () => {
    images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setImages([]);
    setMessage("");
  };

  const uploadBulk = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (images.length === 0) return;

    setIsUploading(true);
    setMessage("");

    try {
      const files = images.map((image) => image.file);

      const response = await Fetch_toFile(json_route.admin.gallery, files);

      if (!response.success) {
        setMessage(`Upload failed: ${response.message ?? "Unknown error"}`);
        return;
      }

      setMessage(`${images.length} image${images.length === 1 ? "" : "s"} uploaded successfully.`);
      clearImages();
      await retrieveUploadedImages();
    } catch (err) {
      console.error(err);
      setMessage("Upload failed: network error.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedImage = async (id: number) => {
  setDeletingId(id);
  try {
    const response = await Fetch_to(json_route.admin.delete_gallery, { id });

    if (!response.success) {
      setMessage(`Delete failed: ${response.message ?? "Unknown error"}`);
      return;
    }

    setUploadedImages((current) => current.filter((image) => image.id !== id));
  } catch (err) {
    console.error(err);
    setMessage("Delete failed: network error.");
  } finally {
    setDeletingId(null);
  }
};

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Gallery</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Attach multiple gallery images and preview them before connecting your upload service.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center transition hover:border-teal-600 hover:bg-teal-50">
            <span className="rounded-md bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800">
              Attach Images
            </span>
            <span className="max-w-xl text-sm leading-6 text-zinc-600">
              Select multiple image files from your device. This only creates local previews for now.
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={attachImages}
              className="sr-only"
            />
          </label>
        </div>

        {message ? (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <form onSubmit={uploadBulk} className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">Attached Images</h2>
                <p className="text-sm text-zinc-500">
                  {images.length} file{images.length === 1 ? "" : "s"} selected
                </p>
              </div>

              {images.length > 0 ? (
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="h-10 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                  >
                    {isUploading ? "Uploading" : "Upload Bulk"}
                  </button>
                  <button
                    type="button"
                    onClick={clearImages}
                    className="h-10 rounded-md border border-red-200 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
                  >
                    Clear All
                  </button>
                </div>
              ) : null}
            </div>

            {images.length > 0 ? (
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                {images.map((image) => (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                  >
                    <img
                      src={image.previewUrl}
                      alt={image.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="grid gap-3 p-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-zinc-950">{image.name}</h3>
                        <p className="mt-1 text-xs font-medium text-zinc-500">{formatFileSize(image.size)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-zinc-500">No images attached yet.</p>
              </div>
            )}
          </form>

          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-4 py-4">
              <h2 className="text-base font-semibold text-zinc-950">Uploaded Images</h2>
              <p className="text-sm text-zinc-500">
                {uploadedImages.length} image{uploadedImages.length === 1 ? "" : "s"} in gallery
              </p>
            </div>

            {isLoadingUploaded ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-zinc-500">Loading...</p>
              </div>
            ) : uploadedImages.length > 0 ? (
              <div className="grid gap-4 p-4 sm:grid-cols-2">
                {uploadedImages.map((image) => (
                  <article
                    key={image.id}
                    className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm"
                  >
                    <img
                      src={image.image_link}
                      alt={image.src_path}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="grid gap-3 p-3">
                      <p className="truncate text-xs font-medium text-zinc-500">
                        {new Date(image.created_at).toLocaleString()}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeUploadedImage(image.id)}
                        disabled={deletingId === image.id}
                        className="cursor-pointer h-9 rounded-md border border-red-200 px-3 text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === image.id ? "Removing..." : "Remove"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-zinc-500">No images uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}