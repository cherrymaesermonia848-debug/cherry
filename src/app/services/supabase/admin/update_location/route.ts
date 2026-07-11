import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

const categoryTableMap: Record<string, string> = {
  "Barangay": "barangay",
  "Beaches": "beaches",
  "Cafe": "cafe",
  "Heritage": "heritage",
  "Resort": "resort",
  "Tourist Spot": "touristspot",
};

export async function POST(req: NextRequest) {
  const { id, category, ...fields } = await req.json();

  const table = categoryTableMap[category];

  if (!table) {
    return NextResponse.json({ success: false, error: "Category Not Exist" }, { status: 404 });
  }

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer
      .from(table)
      .update(fields)
      .eq("id", id)
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