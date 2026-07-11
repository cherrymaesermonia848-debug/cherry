import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll("file") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided" },
        { status: 400 }
      );
    }

    const bucketName = "gallery";
    const rows: { image_link: string; src_path: string }[] = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const src_path = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

      const { error: uploadError } = await supabaseServer.storage
        .from(bucketName)
        .upload(src_path, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabaseServer.storage
        .from(bucketName)
        .getPublicUrl(src_path);

      rows.push({ image_link: publicUrlData.publicUrl, src_path });
    }

    const { error } = await supabaseServer
      .from("gallery")
      .insert(rows)
      .select();

    if (error) {
      console.error("Supabase Query Error: ", error);
      return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Upload Successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}