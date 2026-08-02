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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      setLoading(false);
      return;
    }

    const response = await Fetch_to(json_route.auth.signin, { email: email, password: password });

    if (response.success) {
      await Fetch_to(json_route.jwt.auth, { email: email });
      router.push("/admin");
    } else {
      setMessage(response.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(11,109,54,0.2),_transparent_45%),linear-gradient(135deg,_#f5fcf6_0%,_#e6f5e9_100%)] px-5 py-16 text-[#173624] lg:px-8">
      <div className="mx-auto flex max-w-md flex-col gap-8 rounded-[28px] border border-[#dceee2] bg-white/90 p-6 shadow-2xl shadow-[#0b6d36]/10 backdrop-blur lg:p-10">
        <form className="rounded-[24px] border border-[#e5ece7] bg-[#f8fcf9] p-6 shadow-sm" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0b6d36]">Admin Access</p>
              <h2 className="mt-2 text-3xl font-black text-[#123126]">Admin Sign In</h2>
            </div>
            <Link className="text-sm font-semibold text-[#0b6d36] hover:underline" href="/">
              Back home
            </Link>
          </div>

          <p className="mt-3 text-sm leading-6 text-[#4a6656]">
            Sign in with your administrator account to manage locations, events, and location requests.
          </p>

          <label className="mt-7 block text-sm font-semibold text-[#244b3a]" htmlFor="email">
            Email Address
          </label>
          <input
            className="mt-2 h-12 w-full border border-[#d8e3dc] bg-white px-4 text-base outline-none focus:border-[#0b6d36]"
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
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
            className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0b6d36] px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]"
            type="submit"
            style={{ opacity: loading ? "0.5" : "1" }}
            disabled={loading}
          >
            {loading ? "Signing...." : "Sign In"}
          </button>

          {message ? <p className="mt-4 text-sm font-semibold text-[#0b6d36]">{message}</p> : null}
        </form>
      </div>
    </div>
  );
}