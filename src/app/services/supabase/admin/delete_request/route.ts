import { NextResponse } from "next/server";
import supabase from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    if (!Number.isInteger(id)) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("locations_resquest")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json(
        { error: "Failed to delete request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}