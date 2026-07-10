import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";
import bcrypt from "bcrypt";

async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function POST(params: NextRequest) {
  try {
    const { email, password } = await params.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("auth")
      .select("email, passwd")
      .eq("email", email)
      .single();

    if (error || !data) {
      // don't reveal whether the email exists — same message either way
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await verifyPassword(password, data.passwd);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Logged in" }, { status: 200 });

  } catch (err) {
    console.error("Unexpected error: ", err);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}