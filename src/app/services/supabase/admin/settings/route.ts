import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib";
import bcrypt from "bcrypt";

async function hashPassword(plainPassword: string): Promise<string> {
  const saltRounds = 10; // higher = slower but more secure; 10-12 is typical
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

export async function POST(params: NextRequest) {
  
  const { email, password, c_password } = await params.json();

  if (password !== c_password) return NextResponse.json({ success: false, error: "Password Not Match" }, { status: 402 });

  if (!email) return NextResponse.json({ success: false, error: "Email Not Exits" }, { status: 404 });

  const { error } = await supabaseServer
  .from("auth")
  .update([{ email: email, passwd: await hashPassword(password) }])
  .eq("email", email);

  if (error) {
    console.error("Supabase Query Error: ", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: "Update Successfully" }, { status: 200 });

}