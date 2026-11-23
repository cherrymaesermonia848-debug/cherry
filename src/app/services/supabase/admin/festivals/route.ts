import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabaseServer } from "@/lib";

const bucketName = "locations_image";
const maxImageSize = 5 * 1024 * 1024;
const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

type FestivalInput = {
  name?: unknown;
  short_description?: unknown;
  details?: unknown;
  status?: unknown;
  featured?: unknown;
};

function isAdminRequest(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const secret = process.env.JWT_SECRET;
  if (!token || !secret) return false;
  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function readFields(input: FestivalInput) {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const shortDescription = typeof input.short_description === "string" ? input.short_description.trim() : "";
  const details = typeof input.details === "string" ? input.details.trim() : "";
  const status = input.status === "published" ? "published" : input.status === "draft" ? "draft" : "";
  const featured = input.featured === true || input.featured === "true";

  if (!name || !shortDescription || !details || !status) {
    return { error: "Festival name, short description, details, and status are required." };
  }
  if (featured && status !== "published") {
    return { error: "Only published festivals can be featured." };
  }

  return {
    fields: {
      name,
      short_description: shortDescription,
      details,
      status,
      featured,
    },
  };
}

async function uploadFestivalImage(file: File) {
  if (!allowedImageTypes.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, WebP, or GIF image.");
  }
  if (file.size > maxImageSize) {
    throw new Error("Festival images must be 5 MB or smaller.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `festivals/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { data, error } = await supabaseServer.storage
    .from(bucketName)
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(`Festival image upload failed: ${error.message}`);

  const imageUrl = supabaseServer.storage.from(bucketName).getPublicUrl(data.path).data.publicUrl;
  return { path: data.path, imageUrl };
}

async function removeImage(path: string | null | undefined) {
  if (!path) return;
  const { error } = await supabaseServer.storage.from(bucketName).remove([path]);
  if (error) console.error("Festival image cleanup failed:", error.message);
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isMultipart = request.headers.get("content-type")?.includes("multipart/form-data") ?? false;
    const form = isMultipart ? await request.formData() : null;
    const payload = (form ? Object.fromEntries(form.entries()) : await request.json()) as FestivalInput & {
      action?: string;
      id?: string | number;
      file?: FormDataEntryValue;
    };
    const action = payload.action;

    if (action === "list") {
      const { data, error } = await supabaseServer
        .from("festival")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ success: true, message: data });
    }

    if (action === "delete") {
      const id = Number(payload.id);
      if (!Number.isInteger(id) || id < 1) {
        return NextResponse.json({ success: false, error: "A valid festival ID is required." }, { status: 400 });
      }
      const { data: existing, error: lookupError } = await supabaseServer
        .from("festival")
        .select("image_path")
        .eq("id", id)
        .single();
      if (lookupError) throw lookupError;
      const { error } = await supabaseServer.from("festival").delete().eq("id", id);
      if (error) throw error;
      await removeImage(existing.image_path);
      return NextResponse.json({ success: true, message: "Festival deleted." });
    }

    if (action !== "create" && action !== "update") {
      return NextResponse.json({ success: false, error: "Unsupported festival action." }, { status: 400 });
    }

    const parsed = readFields(payload);
    if (parsed.error || !parsed.fields) {
      return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    }

    const file = form?.get("file");
    const imageFile = file instanceof File && file.size > 0 ? file : null;
    let uploaded: { path: string; imageUrl: string } | null = null;

    if (imageFile && !allowedImageTypes.has(imageFile.type)) {
      return NextResponse.json({ success: false, error: "Choose a JPEG, PNG, WebP, or GIF image." }, { status: 400 });
    }
    if (imageFile && imageFile.size > maxImageSize) {
      return NextResponse.json({ success: false, error: "Festival images must be 5 MB or smaller." }, { status: 400 });
    }
    if (imageFile) uploaded = await uploadFestivalImage(imageFile);

    if (action === "create") {
      const { data, error } = await supabaseServer
        .from("festival")
        .insert({
          ...parsed.fields,
          image_url: uploaded?.imageUrl ?? null,
          image_path: uploaded?.path ?? null,
        })
        .select("*")
        .single();
      if (error) {
        await removeImage(uploaded?.path);
        throw error;
      }
      return NextResponse.json({ success: true, message: data });
    }

    const id = Number(payload.id);
    if (!Number.isInteger(id) || id < 1) {
      await removeImage(uploaded?.path);
      return NextResponse.json({ success: false, error: "A valid festival ID is required." }, { status: 400 });
    }

    const { data: existing, error: lookupError } = await supabaseServer
      .from("festival")
      .select("image_path")
      .eq("id", id)
      .single();
    if (lookupError) {
      await removeImage(uploaded?.path);
      throw lookupError;
    }

    const { data, error } = await supabaseServer
      .from("festival")
      .update({
        ...parsed.fields,
        ...(uploaded ? { image_url: uploaded.imageUrl, image_path: uploaded.path } : {}),
      })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      await removeImage(uploaded?.path);
      throw error;
    }
    if (uploaded && existing.image_path) await removeImage(existing.image_path);

    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Festival request failed.";
    console.error("Festival management request failed:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
