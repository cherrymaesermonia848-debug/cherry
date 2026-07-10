"use client";

import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import json_route from "@/config/json_route.json";
import { SideBar } from "@/components/admin";
import { Fetch_to } from "@/utilities";

type LatestNewsRecord = {
  id: number;
  locationType: string;
  description: string;
};

type UpcomingEventRecord = {
  id: number;
  locationType: string;
  date: string;
  description: string;
};

const locationTypes = [
  "Barangay",
  "Beaches",
  "Cafe",
  "Heritage",
  "Resort",
  "Tourist Spot",
];

export default function EventsPage() {
  const router = useRouter();
  const [latestNews, setLatestNews] = useState<LatestNewsRecord[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventRecord[]>([]);
  const [newsLocationType, setNewsLocationType] = useState(locationTypes[0]);
  const [newsDescription, setNewsDescription] = useState("");
  const [eventLocationType, setEventLocationType] = useState(locationTypes[0]);
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    async function Verify() {
      const response = await Fetch_to(json_route.jwt.verify);
      if (!response.success) return router.push("/auth/sign-in");
    }
    Verify();
  }, []);

  const addLatestNews = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLatestNews((currentNews) => [
      ...currentNews,
      {
        id: Date.now(),
        locationType: newsLocationType,
        description: newsDescription,
      },
    ]);
    setNewsDescription("");
  };

  const addUpcomingEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setUpcomingEvents((currentEvents) => [
      ...currentEvents,
      {
        id: Date.now(),
        locationType: eventLocationType,
        date: eventDate,
        description: eventDescription,
      },
    ]);
    setEventDate("");
    setEventDescription("");
  };

  const removeLatestNews = (id: number) => {
    setLatestNews((currentNews) => currentNews.filter((news) => news.id !== id));
  };

  const removeUpcomingEvent = (id: number) => {
    setUpcomingEvents((currentEvents) => currentEvents.filter((event) => event.id !== id));
  };

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 lg:pl-72">
      <SideBar />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-200 pb-5">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-zinc-950">Events</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">
            Create UI drafts for latest news and upcoming events before connecting backend services.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <form onSubmit={addLatestNews} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="border-b border-zinc-200 pb-4">
              <h2 className="text-lg font-semibold text-zinc-950">Post Latest News</h2>
              <p className="mt-1 text-sm text-zinc-500">Select where the news belongs and add a description.</p>
            </div>

            <div className="mt-4 grid gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Location Type
                <select
                  value={newsLocationType}
                  onChange={(event) => setNewsLocationType(event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  {locationTypes.map((locationType) => (
                    <option key={locationType} value={locationType}>
                      {locationType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Description
                <textarea
                  required
                  value={newsDescription}
                  onChange={(event) => setNewsDescription(event.target.value)}
                  className="min-h-32 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Write the latest news description."
                />
              </label>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                  Post Latest News
                </button>
              </div>
            </div>
          </form>

          <form onSubmit={addUpcomingEvent} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="border-b border-zinc-200 pb-4">
              <h2 className="text-lg font-semibold text-zinc-950">Post Upcoming Event</h2>
              <p className="mt-1 text-sm text-zinc-500">Select a location type, event date, and description.</p>
            </div>

            <div className="mt-4 grid gap-4">
              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Location Type
                <select
                  value={eventLocationType}
                  onChange={(event) => setEventLocationType(event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  {locationTypes.map((locationType) => (
                    <option key={locationType} value={locationType}>
                      {locationType}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Date
                <input
                  required
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
                Description
                <textarea
                  required
                  value={eventDescription}
                  onChange={(event) => setEventDescription(event.target.value)}
                  className="min-h-32 rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  placeholder="Write the upcoming event description."
                />
              </label>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="h-11 rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
                >
                  Post Upcoming Event
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-4 py-4">
              <h2 className="text-base font-semibold text-zinc-950">Latest News Records</h2>
              <p className="text-sm text-zinc-500">{latestNews.length} total record{latestNews.length === 1 ? "" : "s"}</p>
            </div>

            <div className="scrollbar-hidden overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-white">
                  <tr>
                    <th className="w-44 px-4 py-3">Location Type</th>
                    <th className="w-96 px-4 py-3">Description</th>
                    <th className="w-32 px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {latestNews.map((news) => (
                    <tr key={news.id} className="align-top transition odd:bg-white even:bg-zinc-50/60 hover:bg-teal-50/60">
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-md bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800">
                          {news.locationType}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-zinc-700">
                        <p className="line-clamp-4 leading-6">{news.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeLatestNews(news.id)}
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

            {latestNews.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-zinc-500">No latest news posted yet.</p>
              </div>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-4 py-4">
              <h2 className="text-base font-semibold text-zinc-950">Upcoming Event Records</h2>
              <p className="text-sm text-zinc-500">{upcomingEvents.length} total record{upcomingEvents.length === 1 ? "" : "s"}</p>
            </div>

            <div className="scrollbar-hidden overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead className="bg-zinc-950 text-xs font-semibold uppercase tracking-wide text-white">
                  <tr>
                    <th className="w-40 px-4 py-3">Location Type</th>
                    <th className="w-36 px-4 py-3">Date</th>
                    <th className="w-96 px-4 py-3">Description</th>
                    <th className="w-32 px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {upcomingEvents.map((event) => (
                    <tr key={event.id} className="align-top transition odd:bg-white even:bg-zinc-50/60 hover:bg-teal-50/60">
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-md bg-teal-100 px-2.5 py-1 text-xs font-semibold text-teal-800">
                          {event.locationType}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-zinc-950">{event.date}</td>
                      <td className="px-4 py-4 text-zinc-700">
                        <p className="line-clamp-4 leading-6">{event.description}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeUpcomingEvent(event.id)}
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

            {upcomingEvents.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-sm font-medium text-zinc-500">No upcoming events posted yet.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
