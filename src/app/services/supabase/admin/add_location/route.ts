import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

export async function POST(params: NextRequest) {
  
  const form = (await params.formData()) as unknown as globalThis.FormData;
  const category = form.get("category") as string;
  const name = form.get("name") as string;
  const locations = form.get("locations") as string;
  const facebook_page = form.get("facebook_page") as string;
  const gmail = form.get("gmail") as string;
  const transportations = form.get("transportations") as string;
  const about = form.get("about") as string;
  const image_src = form.get("file") as File;
  const iframe_link = form.get("iframe_link") as string;

  const upload_dir = `${category}/${name}_${Date.now()}`;

  if (category === "Barangay") {
    try {

      const { data: uploadImg, error: uploadError } = await supabaseServer.storage
      .from("locations_image")
      .upload(upload_dir, image_src, {
        contentType: image_src.type,
        upsert: false
      });

      if (uploadError) {
        console.error("Supabase Query Error: ", uploadError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
      .from("locations_image")
      .getPublicUrl(uploadImg.path);

      const { error } = await supabaseServer
      .from("barangay")
      .insert([{ name, locations, facebook_page, gmail, transportations, about, image_src: publicUrlData.publicUrl, iframe_link, image_dir: upload_dir }]);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `${name} Successfully Added to ${category}` }, { status: 200 });

    } catch(err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  if (category === "Beaches") {
    try {

      const { data: uploadImg, error: uploadError } = await supabaseServer.storage
      .from("locations_image")
      .upload(upload_dir, image_src, {
        contentType: image_src.type,
        upsert: false
      });

      if (uploadError) {
        console.error("Supabase Query Error: ", uploadError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
      .from("locations_image")
      .getPublicUrl(uploadImg.path);

      const { error } = await supabaseServer
      .from("beaches")
      .insert([{ name, locations, facebook_page, gmail, transportations, about, image_src: publicUrlData.publicUrl, iframe_link, image_dir: upload_dir }]);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `${name} Successfully Added to ${category}` }, { status: 200 });

    } catch(err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  if (category === "Cafe") {
    try {

      const { data: uploadImg, error: uploadError } = await supabaseServer.storage
      .from("locations_image")
      .upload(upload_dir, image_src, {
        contentType: image_src.type,
        upsert: false
      });

      if (uploadError) {
        console.error("Supabase Query Error: ", uploadError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
      .from("locations_image")
      .getPublicUrl(uploadImg.path);

      const { error } = await supabaseServer
      .from("cafe")
      .insert([{ name, locations, facebook_page, gmail, transportations, about, image_src: publicUrlData.publicUrl, iframe_link, image_dir: upload_dir }]);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `${name} Successfully Added to ${category}` }, { status: 200 });

    } catch(err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  if (category === "Heritage") {
    try {

      const { data: uploadImg, error: uploadError } = await supabaseServer.storage
      .from("locations_image")
      .upload(upload_dir, image_src, {
        contentType: image_src.type,
        upsert: false
      });

      if (uploadError) {
        console.error("Supabase Query Error: ", uploadError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
      .from("locations_image")
      .getPublicUrl(uploadImg.path);

      const { error } = await supabaseServer
      .from("heritage")
      .insert([{ name, locations, facebook_page, gmail, transportations, about, image_src: publicUrlData.publicUrl, iframe_link, image_dir: upload_dir }]);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `${name} Successfully Added to ${category}` }, { status: 200 });

    } catch(err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  if (category === "Resort") {
    try {

      const { data: uploadImg, error: uploadError } = await supabaseServer.storage
      .from("locations_image")
      .upload(upload_dir, image_src, {
        contentType: image_src.type,
        upsert: false
      });

      if (uploadError) {
        console.error("Supabase Query Error: ", uploadError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
      .from("locations_image")
      .getPublicUrl(uploadImg.path);

      const { error } = await supabaseServer
      .from("resort")
      .insert([{ name, locations, facebook_page, gmail, transportations, about, image_src: publicUrlData.publicUrl, iframe_link, image_dir: upload_dir }]);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `${name} Successfully Added to ${category}` }, { status: 200 });

    } catch(err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  if (category === "Tourist Spot") {
    try {

      const { data: uploadImg, error: uploadError } = await supabaseServer.storage
      .from("locations_image")
      .upload(upload_dir, image_src, {
        contentType: image_src.type,
        upsert: false
      });

      if (uploadError) {
        console.error("Supabase Query Error: ", uploadError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: publicUrlData } = supabaseServer.storage
      .from("locations_image")
      .getPublicUrl(uploadImg.path);

      const { error } = await supabaseServer
      .from("touristspot")
      .insert([{ name, locations, facebook_page, gmail, transportations, about, image_src: publicUrlData.publicUrl, iframe_link, image_dir: upload_dir }]);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: `${name} Successfully Added to ${category}` }, { status: 200 });

    } catch(err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: false, error: "Category Not Exsit" }, { status: 404 });
}
