import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

const categoryTableMap: Record<string, string> = {
  Barangay: "barangay",
  Beaches: "beaches",
  Cafe: "cafe",
  Heritage: "heritage",
  Resort: "resort",
  "Tourist Spot": "touristspot",
};

const MAX_IMAGES = 5;

export async function POST(params: NextRequest) {
  const form = (await params.formData()) as unknown as globalThis.FormData;
  const category = form.get("category") as string;
  const name = form.get("name") as string;
  const locations = form.get("locations") as string;
  const facebook_page = form.get("facebook_page") as string;
  const gmail = form.get("gmail") as string;
  const transportations = form.get("transportations") as string;
  const about = form.get("about") as string;
  const iframe_link = form.get("iframe_link") as string;

  // Fetch_toFile appends every selected File under the same "file" key
  const images = form.getAll("file") as File[];

  const table = categoryTableMap[category];

  if (!table) {
    return NextResponse.json({ success: false, error: "Category Not Exist" }, { status: 404 });
  }

  if (images.length === 0) {
    return NextResponse.json({ success: false, error: "At least one image is required" }, { status: 400 });
  }

  if (images.length > MAX_IMAGES) {
    return NextResponse.json({ success: false, error: `Maximum of ${MAX_IMAGES} images allowed` }, { status: 400 });
  }

  const baseDir = `${category}/${name}_${Date.now()}`;

  try {
    const imageUrls: string[] = [];
    const imageDirs: string[] = [];

    for (let index = 0; index < images.length; index++) {
      const image = images[index];
      const path = `${baseDir}_${index}`;

      const { data: uploadImg, error: uploadError } = await supabaseServer.storage
        .from("locations_image")
        .upload(path, image, {
          contentType: image.type,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Query Error: ", uploadError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
        .from("locations_image")
        .getPublicUrl(uploadImg.path);

      imageUrls.push(publicUrlData.publicUrl);
      imageDirs.push(path);
    }

    const { error } = await supabaseServer
      .from(table)
      .insert([
        {
          name,
          locations,
          facebook_page,
          gmail,
          transportations,
          about,
          image_src: imageUrls,
          iframe_link,
          image_dir: imageDirs,
        },
      ]);

    if (error) {
      console.error("Supabase Query Error: ", error);
      return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, message: `${name} Successfully Added to ${category}` },
      { status: 200 },
    );
  } catch (err) {
    console.error("Unexpected error: ", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 },
    );
  }
}