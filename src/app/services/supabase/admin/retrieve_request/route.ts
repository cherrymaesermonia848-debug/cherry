import { NextResponse } from "next/server";
import supabase from "@/lib/supabase-server";

export async function POST() {
  try {
    const { data, error } = await supabase
      .from("locations_resquest")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      return NextResponse.json(
        { error: "Failed to load requests" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}