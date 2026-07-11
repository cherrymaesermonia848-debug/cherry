import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  try {
    const { error } = await supabaseServer
      .from("news")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase Query Error: ", error);
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