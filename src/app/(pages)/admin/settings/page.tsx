"use client";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";
import { FormEvent, useState, useEffect } from "react";
import { SideBar } from "@/components/admin";
import { useRouter } from "next/navigation";

export default function Setting_page() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@admin.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
  }, []);

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      setMessage("Password and confirmation do not match.");
      return;
    }

    const response = await Fetch_to(json_route.admin.settings, { email: email, password: password, c_password: confirmPassword });

    if (response.success) {
      setMessage(response.data.message);
    } else {
      setMessage(response.message);
    }
    setLoading(false);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Settings</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Update the admin username and password used for this dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4">
            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              User Name
              <input
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="Enter user name"
                disabled
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              New Password
              <input
                required
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="Enter new password"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              Confirm Password
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                placeholder="Confirm new password"
              />
            </label>
          </div>

          {message ? (
            <div className={`mt-4 rounded-md px-4 py-3 text-sm font-semibold ${
              message.includes("Update Successfully")
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-700"
            }`}
            >
              {message}
            </div>
          ) : null}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            >
              {loading ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
