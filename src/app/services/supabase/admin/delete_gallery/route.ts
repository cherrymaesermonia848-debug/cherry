import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

const bucketName = "gallery";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  try {
    const { data: row, error: fetchError } = await supabaseServer
      .from("gallery")
      .select("src_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Supabase Fetch Error: ", fetchError);
      return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    if (row?.src_path) {
      const { error: storageError } = await supabaseServer
        .storage
        .from(bucketName)
        .remove([row.src_path]);

      if (storageError) {
        console.error("Supabase Storage Delete Error: ", storageError);
      }
    }

    const { error: deleteError } = await supabaseServer
      .from("gallery")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Supabase Query Error: ", deleteError);
      return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Deleted Successfully" }, { status: 200 });

  } catch (err) {
    console.error("Unexpected error: ", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}