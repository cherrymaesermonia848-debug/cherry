import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

export async function POST() {
  try {
    const { data, error } = await supabaseServer
      .from("festival")
      .select("id, name, image_url, short_description, details, status, featured, created_at, updated_at")
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ success: true, message: data });
  } catch (error) {
    console.error("Public festival retrieval failed:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "Could not load published festivals." }, { status: 500 });
  }
}
