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
  const { locations_type, selected_location_id, description, date } = await req.json();

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

    const { data, error } = await supabaseServer
      .from("event")
      .insert([{
        locations_type,
        located_in: locationRow.name,
        description,
        [fkColumn]: selected_location_id,
        date
      }])
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