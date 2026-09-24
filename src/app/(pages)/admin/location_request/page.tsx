"use client";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SideBar } from "@/components/admin";

// Matches the actual `locations_resquest` table: id, requested_by (email),
// address, status, created_at. There is no separate name/location-type field.
type LocationRequestRecord = {
  id: number;
  requested_by: string;
  address: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
};

const STATUS_STYLES: Record<LocationRequestRecord["status"], string> = {
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-800",
};

export default function ManageUserPage() {
  const router = useRouter();
  const [locationRequests, setLocationRequests] = useState<LocationRequestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
  }, []);

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      const response = await Fetch_to(json_route.admin.retrieve_request);
      if (response.success) {
        setLocationRequests(response.data as LocationRequestRecord[]);
      }
      setLoading(false);
    }
    loadRequests();
  }, []);

  const updateRequestStatus = async (
    request: LocationRequestRecord,
    status: LocationRequestRecord["status"],
  ) => {
    setUpdatingId(request.id);
    const response = await Fetch_to(json_route.admin.update_request, {
      id: request.id,
      status,
    });
    if (!response.success) {
      console.error("Failed to update status:", response.message);
      setUpdatingId(null);
      return;
    }
    setLocationRequests((currentRequests) =>
      currentRequests.map((currentRequest) =>
        currentRequest.id === request.id ? { ...currentRequest, status } : currentRequest,
      ),
    );
    setUpdatingId(null);
  };

  const deleteLocationRequest = async (request: LocationRequestRecord) => {
    setUpdatingId(request.id);
    const response = await Fetch_to(json_route.admin.delete_request, {
      id: request.id,
    });
    if (!response.success) {
      console.error("Failed to delete request:", response.message);
      setUpdatingId(null);
      return;
    }
    setLocationRequests((currentRequests) =>
      currentRequests.filter((currentRequest) => currentRequest.id !== request.id),
    );
    setUpdatingId(null);
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Locations Request</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Review and act on user-submitted location requests.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-950">Locations Request</h2>
              <p className="text-sm text-zinc-500">
                {locationRequests.length} total request{locationRequests.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="scrollbar-hidden overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-white">
                <tr>
                  <th className="w-64 px-4 py-3">Requested By (Email)</th>
                  <th className="w-64 px-4 py-3">Address</th>
                  <th className="w-32 px-4 py-3">Status</th>
                  <th className="w-72 px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {locationRequests.map((request) => (
                  <tr key={request.id} className="align-top transition odd:bg-white even:bg-zinc-50/60 hover:bg-teal-50/60">
                    <td className="px-4 py-4">
                      <a
                        href={`mailto:${request.requested_by}`}
                        className="inline-flex max-w-56 items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 underline-offset-2 hover:underline"
                      >
                        <span className="truncate">{request.requested_by}</span>
                      </a>
                      <div className="mt-1 text-xs font-medium text-zinc-400">Request #{request.id}</div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-zinc-950">{request.address}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[request.status]}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => updateRequestStatus(request, "accepted")}
                          className="h-9 rounded-md bg-teal-700 px-3 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={request.status === "accepted" || updatingId === request.id}
                        >
                          Done
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRequestStatus(request, "declined")}
                          className="h-9 rounded-md bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={request.status === "declined" || updatingId === request.id}
                        >
                          Decline
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteLocationRequest(request)}
                          className="h-9 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={updatingId === request.id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && locationRequests.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm font-medium text-zinc-500">No location requests yet.</p>
            </div>
          ) : null}

          {loading ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm font-medium text-zinc-500">Loading requests…</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}