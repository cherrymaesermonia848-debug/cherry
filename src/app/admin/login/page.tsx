"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setMessage("Enter your admin credentials.");
      return;
    }

    setMessage("Admin access granted. Redirecting to dashboard.");
    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,_#081510_0%,_#0e2c1d_45%,_#1c4f35_100%)] px-5 py-16 text-white lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur lg:p-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#d2f2db]">Administrator</p>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">Admin Login</h1>
            <p className="mt-5 text-lg leading-8 text-[#dcefe0]">
              Manage destinations, approve submissions, respond to visitor requests, and keep the tourism portal up to date.
            </p>
          </div>
          <Link className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-7 text-sm font-black uppercase tracking-wide text-white hover:bg-white/10" href="/">
            Back to site
          </Link>
        </div>

        <form className="mt-8 rounded-[24px] bg-white p-6 text-[#123126] shadow-xl" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold" htmlFor="adminEmail">
            Admin Email
          </label>
          <input
            className="mt-2 h-12 w-full border border-[#d8e3dc] bg-[#f8fcf9] px-4 text-base outline-none focus:border-[#0b6d36]"
            id="adminEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@pontevedra.gov.ph"
          />

          <label className="mt-5 block text-sm font-semibold" htmlFor="adminPassword">
            Password
          </label>
          <input
            className="mt-2 h-12 w-full border border-[#d8e3dc] bg-[#f8fcf9] px-4 text-base outline-none focus:border-[#0b6d36]"
            id="adminPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter admin password"
          />

          <button
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0b6d36] px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]"
            type="submit"
          >
            Sign In as Admin
          </button>

          {message ? <p className="mt-4 text-sm font-semibold text-[#0b6d36]">{message}</p> : null}
        </form>
      </div>
    </main>
  );
}
