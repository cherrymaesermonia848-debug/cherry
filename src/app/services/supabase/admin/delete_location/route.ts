import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";

export async function POST(params: NextRequest) {
  
  const { id, category } = await params.json();

  if (category === "Barangay") {
    try {

      const { error } = await supabaseServer
      .from("barangay")
      .delete()
      .eq("id", id);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Deleted Successfully" }, { status: 200 });

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

      const { error } = await supabaseServer
      .from("beaches")
      .delete()
      .eq("id", id);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Deleted Successfully" }, { status: 200 });

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

      const { error } = await supabaseServer
      .from("cafe")
      .delete()
      .eq("id", id);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Deleted Successfully" }, { status: 200 });

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

      const { error } = await supabaseServer
      .from("heritage")
      .delete()
      .eq("id", id);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Deleted Successfully" }, { status: 200 });

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

      const { error } = await supabaseServer
      .from("resort")
      .delete()
      .eq("id", id);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Deleted Successfully" }, { status: 200 });

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

      const { error } = await supabaseServer
      .from("touristspot")
      .delete()
      .eq("id", id);

      if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
      }

      return NextResponse.json({ success: true, message: "Deleted Successfully" }, { status: 200 });

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
