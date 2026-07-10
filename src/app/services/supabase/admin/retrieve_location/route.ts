import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

export async function POST(params: NextRequest) {
  
  const { category } = await params.json();

  if (category === "Barangay") {
    try {

      const { data, error } = await supabaseServer
      .from("barangay")
      .select("*");

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: data }, { status: 200 });

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

      const { data, error } = await supabaseServer
      .from("beaches")
      .select("*");

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: data }, { status: 200 });

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

      const { data, error } = await supabaseServer
      .from("cafe")
      .select("*");

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: data }, { status: 200 });

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

      const { data, error } = await supabaseServer
      .from("heritage")
      .select("*");

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: data }, { status: 200 });

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

      const { data, error } = await supabaseServer
      .from("resort")
      .select("*");

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: data }, { status: 200 });

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

      const { data, error } = await supabaseServer
      .from("touristspot")
      .select("*");

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: data }, { status: 200 });

    } catch(err) {
      console.error("Unexpected error: ", err);
      return NextResponse.json(
        { success: false, error: err instanceof Error ? err.message : "Something went wrong" },
        { status: 500 }
      );
    }
  }

  if (category === "all") {
     try {

      const { data: barangay, error: barangayErr } = await supabaseServer
      .from("barangay")
      .select("*");

      if (barangayErr) {
        console.error("Supabase Query Error: ", barangayErr);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: beaches, error: beachesErr } = await supabaseServer
      .from("beaches")
      .select("*");

      if (beachesErr) {
        console.error("Supabase Query Error: ", beachesErr);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: cafe, error: cafeErr } = await supabaseServer
      .from("cafe")
      .select("*");

      if (cafeErr) {
        console.error("Supabase Query Error: ", cafeErr);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: heritage, error: heritageErr } = await supabaseServer
      .from("heritage")
      .select("*");

      if (heritageErr) {
        console.error("Supabase Query Error: ", heritageErr);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: resort, error: resortErr } = await supabaseServer
      .from("resort")
      .select("*");

      if (resortErr) {
        console.error("Supabase Query Error: ", resortErr);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      const { data: touristspot, error: touristspotErr } = await supabaseServer
      .from("touristspot")
      .select("*");

      if (touristspotErr) {
        console.error("Supabase Query Error: ", touristspotErr);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json(
        {
          success: true,
          message: {
            barangay: barangay.length,
            beaches: beaches.length,
            cafe: cafe.length,
            heritage: heritage.length,
            resort: resort.length,
            touristspot: touristspot.length,
          }
        },
        { status: 200 }
      );

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
