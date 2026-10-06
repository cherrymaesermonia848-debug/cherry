import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

const categoryColumnMap: Record<string, string> = {
  "Barangay": "barangay_id",
  "Beaches": "beaches_id",
  "Cafe": "cafe_id",
  "Heritage": "heritage_id",
  "Resort": "resort_id",
  "Tourist Spot": "touristspot_id",
};

const categoryTableMap: Record<string, string> = {
  "Barangay": "barangay",
  "Beaches": "beaches",
  "Cafe": "cafe",
  "Heritage": "heritage",
  "Resort": "resort",
  "Tourist Spot": "touristspot",
};

export async function POST(req: NextRequest) {
  let locations_type: string;
  let selected_location_id: number;
  let description: string;
  let date: string;
  let image: File | null = null;

  if (req.headers.get("content-type")?.includes("multipart/form-data")) {
    const form = await req.formData();
    locations_type = String(form.get("locations_type") ?? "");
    selected_location_id = Number(form.get("selected_location_id"));
    description = String(form.get("description") ?? "");
    date = String(form.get("date") ?? "");
    const uploaded = form.get("file");
    image = uploaded instanceof File && uploaded.size > 0 ? uploaded : null;
  } else {
    ({ locations_type, selected_location_id, description, date } = await req.json());
  }

  const table = categoryTableMap[locations_type];
  const fkColumn = categoryColumnMap[locations_type];

  if (!table || !fkColumn) {
    return NextResponse.json({ success: false, error: "Category Not Exist" }, { status: 404 });
  }

  if (!selected_location_id) {
    return NextResponse.json({ success: false, error: "Missing selected_location_id" }, { status: 400 });
  }

  if (!description) {
    return NextResponse.json({ success: false, error: "Missing description" }, { status: 400 });
  }

  if (!date) {
    return NextResponse.json({ success: false, error: "Missing date" }, { status: 400 });
  }

  try {
    const { data: locationRow, error: locationError } = await supabaseServer
      .from(table)
      .select("id, name")
      .eq("id", selected_location_id)
      .single();

    if (locationError || !locationRow) {
      console.error("Supabase Location Lookup Error: ", locationError);
      return NextResponse.json({ success: false, error: "Selected location not found" }, { status: 404 });
    }

    let imageUrl = "";
    if (image) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json({ success: false, error: "Please upload an image file" }, { status: 400 });
      }
      const imagePath = `events/${Date.now()}_${image.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { data: uploadedImage, error: uploadError } = await supabaseServer.storage
        .from("locations_image")
        .upload(imagePath, image, { contentType: image.type, upsert: false });
      if (uploadError) {
        console.error("Event image upload error: ", uploadError);
        return NextResponse.json({ success: false, error: "Event image upload failed" }, { status: 500 });
      }
      imageUrl = supabaseServer.storage.from("locations_image").getPublicUrl(uploadedImage.path).data.publicUrl;
    }

    const eventRecord: Record<string, string | number> = {
      locations_type,
      located_in: locationRow.name,
      description,
      [fkColumn]: selected_location_id,
      date,
    };
    if (imageUrl) eventRecord.image_src = imageUrl;

    const { data, error } = await supabaseServer
      .from("event")
      .insert([eventRecord])
      .select();

    if (error) {
      console.error("Supabase Query Error: ", error);
      return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: data?.[0] ?? null }, { status: 200 });

  } catch (err) {
    console.error("Unexpected error: ", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
