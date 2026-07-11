"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";

export default function Sign_in() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    const response = await Fetch_to(json_route.auth.signin, { email: email, password: password });

    if (response.success) {
      await Fetch_to(json_route.jwt.auth, { email: email });
      if (email.endsWith("@admin.com")) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } else {
      setMessage(response.message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(11,109,54,0.2),_transparent_45%),linear-gradient(135deg,_#f5fcf6_0%,_#e6f5e9_100%)] px-5 py-16 text-[#173624] lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[28px] border border-[#dceee2] bg-white/90 p-6 shadow-2xl shadow-[#0b6d36]/10 backdrop-blur lg:flex-row lg:p-10">
        <div className="flex-1 rounded-[24px] bg-[#0b6d36] p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#dff5e6]">Visitor Access</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Sign in to connect with Pontevedra tourism.</h1>
          <p className="mt-5 text-lg leading-8 text-[#e1f3e7]">
            Log in to ask questions, request travel help, or submit a place that should be reviewed by the admin team.
          </p>
          <div className="mt-8 space-y-3 text-sm text-[#e1f3e7]">
            <p>• Request tourism information and route guidance</p>
            <p>• Submit your own place for review</p>
            <p>• Stay updated on events and visitor notices</p>
          </div>
        </div>

        <div className="flex-1 p-2 sm:p-4">
          <form className="rounded-[24px] border border-[#e5ece7] bg-[#f8fcf9] p-6 shadow-sm" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0b6d36]">Welcome back</p>
                <h2 className="mt-2 text-3xl font-black text-[#123126]">Sign In</h2>
              </div>
              <Link className="text-sm font-semibold text-[#0b6d36] hover:underline" href="/">
                Back home
              </Link>
            </div>

            <label className="mt-7 block text-sm font-semibold text-[#244b3a]" htmlFor="email">
              Email Address
            </label>
            <input
              className="mt-2 h-12 w-full border border-[#d8e3dc] bg-white px-4 text-base outline-none focus:border-[#0b6d36]"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />

            <label className="mt-5 block text-sm font-semibold text-[#244b3a]" htmlFor="password">
              Password
            </label>
            <input
              className="mt-2 h-12 w-full border border-[#d8e3dc] bg-white px-4 text-base outline-none focus:border-[#0b6d36]"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />

            <button
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0b6d36] px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]"
              type="submit"
              style={{ opacity: loading ? "0.5" : "1" }}
              disabled={loading}
            >
              {loading ? "Signing...." : "Sign In"}
            </button>

            {message ? <p className="mt-4 text-sm font-semibold text-[#0b6d36]">{message}</p> : null}

            <p className="mt-6 text-sm text-[#5f6f67]">
              Need an account? <Link className="font-semibold text-[#0b6d36] hover:underline" href="/auth/sign-up">Create one here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}