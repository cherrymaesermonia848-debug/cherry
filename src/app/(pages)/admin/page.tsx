"use client";
import Link from "next/link";
import { SideBar } from "@/components/admin";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Stat = { label: string; value: string; href: string; color: string; key: string };

const stats: Stat[] = [
  { key: "barangay", label: "Barangay", value: "0", href: "/admin/Barangay", color: "#0f766e" },
  { key: "beaches", label: "Beaches", value: "0", href: "/admin/Beaches", color: "#0284c7" },
  { key: "resort", label: "Resorts", value: "0", href: "/admin/Resort", color: "#16a34a" },
  { key: "touristspot", label: "Tourist Spots", value: "0", href: "/admin/Touristspot", color: "#d97706" },
  { key: "cafe", label: "Cafes", value: "0", href: "/admin/Cafe", color: "#7c3aed" },
  { key: "heritage", label: "Heritage Sites", value: "0", href: "/admin/Heritage", color: "#dc2626" },
];

const quickActions = [
  { label: "Manage Barangay", href: "/admin/Barangay" },
  { label: "Manage Beaches", href: "/admin/Beaches" },
  { label: "Manage Resorts", href: "/admin/Resort" },
  { label: "Manage Users", href: "/admin/manage_user" },
  { label: "Open Settings", href: "/admin/settings" },
];

const userBehavior = [
  { label: "Mon", visits: 24, requests: 4 },
  { label: "Tue", visits: 38, requests: 7 },
  { label: "Wed", visits: 29, requests: 5 },
  { label: "Thu", visits: 46, requests: 9 },
  { label: "Fri", visits: 58, requests: 12 },
  { label: "Sat", visits: 41, requests: 8 },
  { label: "Sun", visits: 34, requests: 6 },
];


const behaviorMetrics = [
  {
    label: "Visits",
    key: "visits",
    colorClass: "bg-teal-700",
    textClass: "text-teal-700",
    description: "Daily visitor sessions across the tourism pages.",
  },
  {
    label: "Location Requests",
    key: "requests",
    colorClass: "bg-amber-500",
    textClass: "text-amber-600",
    description: "User-submitted requests to add new locations.",
  },
] as const;

type RetrieveResponseData = {
  message?: Record<string, number>;
};

export default function Dashboard_page() {
  const router = useRouter();
  const [location_data, setLocations_data] = useState<Stat[]>(stats);

  useEffect(() => {
    async function Retrieve() {
      const response = await Fetch_to(json_route.admin.retrieve_location, { category: "all" });

      if (response.success) {
        const data = response.data as RetrieveResponseData | null;
        const counts = data?.message ?? {};

        console.log(counts);

        setLocations_data(
          stats.map((stat) => ({
            ...stat,
            value: String(counts[stat.key] ?? 0),
          }))
        );
      }
    }
    Retrieve();

    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
  }, []);

  const totalRecords = location_data.reduce((total, stat) => total + Number(stat.value), 0);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Analytics</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Manage local destination records, contact details, transport information, images, and map links from one admin area.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {location_data.map((stat) => (
            <Link
              key={stat.href}
              href={stat.href}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/40"
            >
              <p className="text-sm font-semibold text-zinc-500">{stat.label}</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <span className="text-4xl font-semibold text-zinc-950">{stat.value}</span>
                <span className="rounded-md bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800">View records</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Records Distribution</h2>
                <p className="mt-1 text-sm text-zinc-500">Overview of records per category.</p>
              </div>

              <div className="mx-auto flex size-56 shrink-0 items-center justify-center rounded-full bg-[conic-gradient(#0f766e_0deg_60deg,#0284c7_60deg_120deg,#16a34a_120deg_180deg,#d97706_180deg_240deg,#7c3aed_240deg_300deg,#dc2626_300deg_360deg)]">
                <div className="flex size-28 flex-col items-center justify-center rounded-full bg-white shadow-sm">
                  <span className="text-3xl font-semibold text-zinc-950">{totalRecords}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Total</span>
                </div>
              </div>

              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                {location_data.map((stat) => (
                  <Link
                    key={stat.href}
                    href={stat.href}
                    className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm transition hover:bg-white"
                  >
                    <span className="flex min-w-0 items-center gap-2 font-semibold text-zinc-700">
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      <span className="truncate">{stat.label}</span>
                    </span>
                    <span className="font-semibold text-zinc-950">{stat.value}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-950">Quick Actions</h2>
            <div className="mt-4 flex flex-col gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="rounded-md border border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">User Behavior</h2>
            <p className="mt-1 text-sm text-zinc-500">Separated weekly analytics for visitor activity.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {behaviorMetrics.map((metric) => {
              const total = userBehavior.reduce((sum, behavior) => sum + behavior[metric.key], 0);
              const maxValue = Math.max(...userBehavior.map((behavior) => behavior[metric.key]));

              return (
                <article key={metric.key} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="border-b border-zinc-200 pb-4">
                    <p className="text-sm font-semibold text-zinc-500">{metric.label}</p>
                    <div className="mt-2 flex items-end justify-between gap-4">
                      <span className={`text-4xl font-semibold ${metric.textClass}`}>{total}</span>
                      <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                        This week
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-500">{metric.description}</p>
                  </div>

                  <div className="mt-5 flex h-48 items-end gap-3 rounded-lg bg-zinc-50 px-3 py-4">
                    {userBehavior.map((behavior) => {
                      const value = behavior[metric.key];
                      const height = `${Math.max(8, (value / maxValue) * 150)}px`;

                      return (
                        <div key={behavior.label} className="flex flex-1 flex-col items-center gap-2">
                          <span
                            className={`w-full max-w-8 rounded-t ${metric.colorClass}`}
                            style={{ height }}
                            title={`${value} ${metric.label.toLowerCase()}`}
                          />
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                            {behavior.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
