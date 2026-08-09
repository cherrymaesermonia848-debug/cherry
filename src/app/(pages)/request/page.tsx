"use client";

import { FormEvent, useState } from "react";

export default function Sign_up_page() {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [disabled_button, setDisabled_button] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisabled_button(true);

    // TODO: hook this up later
    setMessage("Request submitted. Thank you!");
    setDisabled_button(false);
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10 sm:px-6">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
            Public
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">
            Request Locations
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
            Know a spot that should be on our map? Send us the address and
            we&apos;ll take it from there.
          </p>
        </div>

        {message ? (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
            {message}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="name@gmail.com"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Address
            <input
              required
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              placeholder="Barangay or full address"
            />
          </label>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              disabled={disabled_button}
              style={{ opacity: disabled_button ? "0.5" : "1" }}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 sm:w-auto"
            >
              Submit Request
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}