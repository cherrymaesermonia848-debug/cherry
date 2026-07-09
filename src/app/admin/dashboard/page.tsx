"use client";

import Link from "next/link";

const overviewCards = [
  { title: "Total Places", value: "24", detail: "Published destinations and visitor stops" },
  { title: "Pending Requests", value: "7", detail: "New places and questions waiting for review" },
  { title: "Upcoming Events", value: "3", detail: "Festival, clean-up, and tourism activities" },
];

const submissions = [
  { name: "New Beach Proposal", type: "Place Submission", status: "Pending Review" },
  { name: "Tourism Inquiry", type: "Visitor Request", status: "Responded" },
  { name: "Barangay Gallery Addition", type: "Content Update", status: "Approved" },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f4fbf6] px-5 py-16 text-[#123126] lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-[#dceee2] bg-white p-6 shadow-xl shadow-[#0b6d36]/10 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#0b6d36]">Admin Dashboard</p>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">Manage the Pontevedra tourism portal.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-[#5f6f67]">
              Review all places, approve submissions, handle visitor requests, and update the content for the tourism website.
            </p>
          </div>
          <Link className="inline-flex h-12 items-center justify-center rounded-full bg-[#0b6d36] px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]" href="/">
            View Public Site
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {overviewCards.map((card) => (
            <div className="rounded-[20px] border border-[#e5ece7] bg-[#f8fcf9] p-6" key={card.title}>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0b6d36]">{card.title}</p>
              <p className="mt-4 text-4xl font-black text-[#123126]">{card.value}</p>
              <p className="mt-3 text-sm leading-7 text-[#617067]">{card.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[24px] border border-[#e5ece7] bg-[#f8fcf9] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#123126]">Pending Tasks</h2>
              <span className="rounded-full bg-[#0b6d36] px-3 py-1 text-sm font-black text-white">Active</span>
            </div>
            <div className="mt-6 space-y-4">
              {submissions.map((item) => (
                <div className="flex items-center justify-between rounded-[16px] border border-[#e3e9e4] bg-white px-4 py-4" key={item.name}>
                  <div>
                    <p className="font-black text-[#123126]">{item.name}</p>
                    <p className="mt-1 text-sm text-[#617067]">{item.type}</p>
                  </div>
                  <span className="rounded-full bg-[#edf7f0] px-3 py-1 text-sm font-black text-[#0b6d36]">{item.status}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-[#e5ece7] bg-[#f8fcf9] p-6">
            <h2 className="text-2xl font-black text-[#123126]">Admin Controls</h2>
            <div className="mt-6 space-y-3 text-sm text-[#617067]">
              <p>• Add and edit destinations and attractions</p>
              <p>• Approve or reject user submissions</p>
              <p>• Respond to visitor requests and questions</p>
              <p>• Update events, news, and travel details</p>
            </div>
            <Link className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#0b6d36] px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]" href="/admin/login">
              Return to Login
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
