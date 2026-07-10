"use client";
import { Fetch_to } from "@/utilities";
import json_route from "@/config/json_route.json";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SideBar } from "@/components/admin";

type UserRecord = {
  id: number;
  name: string;
  email: string;
  status: "Active" | "Banned";
};

type LocationRequestRecord = {
  id: number;
  requesterName: string;
  requesterEmail: string;
  locationName: string;
  locationType: string;
  status: "Pending" | "Accepted" | "Denied";
};

export default function ManageUserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [locationRequests, setLocationRequests] = useState<LocationRequestRecord[]>([]);
  const [pendingDelete, setPendingDelete] = useState<UserRecord | null>(null);

  useEffect(() => {
    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
  }, []);

  const toggleBan = (user: UserRecord) => {
    setUsers((currentUsers) =>
      currentUsers.map((currentUser) => {
        if (currentUser.id !== user.id) {
          return currentUser;
        }

        return {
          ...currentUser,
          status: currentUser.status === "Banned" ? "Active" : "Banned",
        };
      }),
    );
  };

  const confirmDeleteUser = () => {
    if (pendingDelete === null) {
      return;
    }

    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== pendingDelete.id));
    setPendingDelete(null);
  };

  const updateRequestStatus = (
    request: LocationRequestRecord,
    status: LocationRequestRecord["status"],
  ) => {
    setLocationRequests((currentRequests) =>
      currentRequests.map((currentRequest) => {
        if (currentRequest.id !== request.id) {
          return currentRequest;
        }

        return {
          ...currentRequest,
          status,
        };
      }),
    );
  };

  const deleteLocationRequest = (request: LocationRequestRecord) => {
    setLocationRequests((currentRequests) =>
      currentRequests.filter((currentRequest) => currentRequest.id !== request.id),
    );
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Manage Users</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Review user accounts and handle user-submitted location requests.
          </p>
        </div>

        {pendingDelete ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 px-4 py-6">
            <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-zinc-950">Delete user?</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Are you sure you want to delete <span className="font-semibold text-zinc-950">{pendingDelete.name}</span>?
              </p>

              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setPendingDelete(null)}
                  className="h-11 rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteUser}
                  className="h-11 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-1 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">User Records</h2>
                <p className="text-sm text-zinc-500">{users.length} total user{users.length === 1 ? "" : "s"}</p>
              </div>
            </div>

            <div className="scrollbar-hidden overflow-x-auto">
              <table className="w-full min-w-[780px] border-collapse text-left text-sm">
                <thead className="bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-white">
                  <tr>
                    <th className="w-64 px-4 py-3">Name</th>
                    <th className="w-80 px-4 py-3">Email</th>
                    <th className="w-36 px-4 py-3">Status</th>
                    <th className="w-56 px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {users.map((user) => (
                    <tr key={user.id} className="align-top transition odd:bg-white even:bg-zinc-50/60 hover:bg-teal-50/60">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-zinc-950">{user.name}</div>
                        <div className="mt-1 text-xs font-medium text-zinc-400">ID #{user.id}</div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`mailto:${user.email}`}
                          className="inline-flex max-w-72 items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 underline-offset-2 hover:underline"
                        >
                          <span className="truncate">{user.email}</span>
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                            user.status === "Banned"
                              ? "bg-red-100 text-red-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => toggleBan(user)}
                            className="h-9 rounded-md border border-zinc-300 px-3 text-xs font-semibold text-zinc-700 transition hover:bg-white"
                          >
                            {user.status === "Banned" ? "Unban" : "Ban"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(user)}
                            className="h-9 rounded-md bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700"
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

            {users.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-zinc-500">No users loaded yet.</p>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-1 border-b border-zinc-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-950">Location Requests</h2>
                <p className="text-sm text-zinc-500">
                  {locationRequests.length} total request{locationRequests.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>

            <div className="scrollbar-hidden overflow-x-auto">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                <thead className="bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-white">
                  <tr>
                    <th className="w-52 px-4 py-3">Requested By</th>
                    <th className="w-64 px-4 py-3">Email</th>
                    <th className="w-56 px-4 py-3">Location</th>
                    <th className="w-36 px-4 py-3">Type</th>
                    <th className="w-32 px-4 py-3">Status</th>
                    <th className="w-64 px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {locationRequests.map((request) => (
                    <tr key={request.id} className="align-top transition odd:bg-white even:bg-zinc-50/60 hover:bg-teal-50/60">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-zinc-950">{request.requesterName}</div>
                        <div className="mt-1 text-xs font-medium text-zinc-400">Request #{request.id}</div>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href={`mailto:${request.requesterEmail}`}
                          className="inline-flex max-w-56 items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 underline-offset-2 hover:underline"
                        >
                          <span className="truncate">{request.requesterEmail}</span>
                        </a>
                      </td>
                      <td className="px-4 py-4 font-semibold text-zinc-950">{request.locationName}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-md bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800">
                          {request.locationType}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${
                            request.status === "Accepted"
                              ? "bg-emerald-100 text-emerald-700"
                              : request.status === "Denied"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => updateRequestStatus(request, "Accepted")}
                            className="h-9 rounded-md bg-teal-700 px-3 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={request.status === "Accepted"}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            onClick={() => updateRequestStatus(request, "Denied")}
                            className="h-9 rounded-md bg-red-600 px-3 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={request.status === "Denied"}
                          >
                            Deny
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteLocationRequest(request)}
                            className="h-9 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 transition hover:bg-red-600 hover:text-white"
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

            {locationRequests.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-zinc-500">No location requests yet.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
