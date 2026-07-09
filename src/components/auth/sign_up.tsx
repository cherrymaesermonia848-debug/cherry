"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function Sign_up() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please complete all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage("Your account has been created. You can now sign in and submit your first place or request.");
    router.push("/auth/sign-in");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(11,109,54,0.1),_transparent_40%),linear-gradient(135deg,_#f3fbf4_0%,_#e9f6e7_100%)] px-5 py-16 text-[#173624] lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 rounded-[28px] border border-[#dceee2] bg-white/90 p-6 shadow-2xl shadow-[#0b6d36]/10 backdrop-blur lg:flex-row lg:p-10">
        <div className="flex-1 rounded-[24px] bg-[#123126] p-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#dff5e6]">Join the tourism network</p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">Create an account for Pontevedra.</h1>
          <p className="mt-5 text-lg leading-8 text-[#e2efe4]">
            Register so you can ask questions, request tourism information, and suggest a place that should be reviewed by the admin.
          </p>
          <div className="mt-8 space-y-3 text-sm text-[#e2efe4]">
            <p>• Share your own place or travel story</p>
            <p>• Receive updates from the tourism office</p>
            <p>• Help improve the destination guide</p>
          </div>
        </div>

        <div className="flex-1 p-2 sm:p-4">
          <form className="rounded-[24px] border border-[#e5ece7] bg-[#f8fcf9] p-6 shadow-sm" onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0b6d36]">Become a visitor</p>
                <h2 className="mt-2 text-3xl font-black text-[#123126]">Create Account</h2>
              </div>
              <Link className="text-sm font-semibold text-[#0b6d36] hover:underline" href="/">
                Back home
              </Link>
            </div>

            <label className="mt-7 block text-sm font-semibold text-[#244b3a]" htmlFor="name">
              Full Name
            </label>
            <input
              className="mt-2 h-12 w-full border border-[#d8e3dc] bg-white px-4 text-base outline-none focus:border-[#0b6d36]"
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Juan Dela Cruz"
            />

            <label className="mt-5 block text-sm font-semibold text-[#244b3a]" htmlFor="email">
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
              placeholder="Create a password"
            />

            <label className="mt-5 block text-sm font-semibold text-[#244b3a]" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="mt-2 h-12 w-full border border-[#d8e3dc] bg-white px-4 text-base outline-none focus:border-[#0b6d36]"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat password"
            />

            <button
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0b6d36] px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]"
              type="submit"
            >
              Create Account
            </button>

            {message ? <p className="mt-4 text-sm font-semibold text-[#0b6d36]">{message}</p> : null}

            <p className="mt-6 text-sm text-[#5f6f67]">
              Already have an account? <Link className="font-semibold text-[#0b6d36] hover:underline" href="/auth/sign-in">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}