"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";

const locationItems = [
  { label: "Barangay", href: "/admin/Barangay" },
  { label: "Beaches", href: "/admin/Beaches" },
  { label: "Resort", href: "/admin/Resort" },
  { label: "Tourist Spot", href: "/admin/Touristspot" },
  { label: "Cafe", href: "/admin/Cafe" },
  { label: "Heritage", href: "/admin/Heritage" },
];

const navigationItems = [
  { label: "Add Locations", href: "/admin/add_locations" },
  { label: "Analytics", href: "/admin" },
  { label: "Gallery", href: "/admin/gallery" },
  { label: "Events", href: "/admin/events" },
  { label: "Manage Users", href: "/admin/manage_user" },
  { label: "Settings", href: "/admin/settings" },
];

export default function SideBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLocationsOpen, setIsLocationsOpen] = useState(
    locationItems.some((item) => pathname === item.href),
  );

  const isLocationActive = locationItems.some((item) => pathname === item.href);

  const handleLogout = async() => {
    const confirmedLogout = window.confirm("Are you sure you want to log out?");

    if (confirmedLogout) {
      await Fetch_to(json_route.jwt.deauth);
      window.location.href = "/";
    }
  };

  const renderLocationsDropdown = (closeMobileMenu = false) => (
    <div className="grid gap-1">
      <button
        type="button"
        onClick={() => setIsLocationsOpen((currentValue) => !currentValue)}
        className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold transition cursor-pointer ${
          isLocationActive
            ? "bg-teal-700 text-white"
            : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
        }`}
        aria-expanded={isLocationsOpen}
      >
        <span>Locations</span>
        <span aria-hidden="true" className={`transition ${isLocationsOpen ? "rotate-180" : ""}`}>
          v
        </span>
      </button>

      {isLocationsOpen ? (
        <div className="grid gap-1 pl-3">
          {locationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (closeMobileMenu) {
                    setIsOpen(false);
                  }
                }}
                className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-teal-50 text-teal-800"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );

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
            {renderLocationsDropdown(true)}
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
            <button
              type="button"
              onClick={handleLogout}
              className="mt-2 cursor-pointer rounded-md border border-red-200 px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
            >
              Log out
            </button>
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
          {renderLocationsDropdown()}
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

        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto cursor-pointer rounded-md border border-red-200 px-3 py-2 text-left text-sm font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
        >
          Log out
        </button>
      </div>
      </aside>
    </>
  );
}
