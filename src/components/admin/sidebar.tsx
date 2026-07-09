"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Barangay", href: "/admin/Barangay" },
  { label: "Beaches", href: "/admin/Beaches" },
  { label: "Resort", href: "/admin/Resort" },
  { label: "Tourist Spot", href: "/admin/Touristspot" },
  { label: "Cafe", href: "/admin/Cafe" },
  { label: "Heritage", href: "/admin/Heritage" },
  { label: "Settings", href: "/admin/settings" },
];

export default function SideBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-zinc-200 bg-white lg:hidden">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Pontevedra</p>
            <h2 className="text-lg font-semibold text-zinc-950">Admin Panel</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((currentValue) => !currentValue)}
            className="inline-flex size-11 items-center justify-center rounded-md border border-zinc-300 text-zinc-800 transition hover:bg-zinc-100"
            aria-label="Toggle admin navigation"
            aria-expanded={isOpen}
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
              <span className="block h-0.5 w-5 rounded bg-current" />
            </span>
          </button>
        </div>

        {isOpen ? (
          <nav className="grid gap-1 border-t border-zinc-200 px-4 py-3">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-teal-700 text-white"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>

      <aside className="hidden border-r border-zinc-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:block lg:w-72">
        <div className="flex h-full flex-col gap-6 px-4 py-5">
        <div className="rounded-lg bg-zinc-950 px-4 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-200">Pontevedra</p>
          <h2 className="mt-1 text-xl font-semibold">Admin Panel</h2>
        </div>

        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-teal-700 text-white"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      </aside>
    </>
  );
}
