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
  const { category } = await req.json();

  // Single category
  if (category !== "all") {
    const table = categoryTableMap[category];

    if (!table) {
      return NextResponse.json({ success: false, error: "Category Not Exist" }, { status: 404 });
    }

    try {
      const { data, error } = await supabaseServer.from(table).select("*");

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: data }, { status: 200 });

    } catch (err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  // All categories: counts only, fetched in parallel
  try {
    const entries = Object.entries(categoryTableMap);

    const results = await Promise.all(
      entries.map(([, table]) =>
        supabaseServer.from(table).select("*", { count: "exact", head: true })
      )
    );

    const counts: Record<string, number> = {};

    for (let i = 0; i < entries.length; i++) {
      const [, table] = entries[i];
      const { count, error } = results[i];

      if (error) {
        console.error(`Supabase Query Error (${table}): `, error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      counts[table] = count ?? 0;
    }

    return NextResponse.json({ success: true, message: counts }, { status: 200 });

  } catch (err) {
    console.error("Unexpected error: ", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}