"use client";

import { useEffect, useState } from "react";

const menuItems = [
  {
    label: "Home",
    href: "#home",
    links: [
      ["Welcome", "#home"],
      ["Featured Destinations", "#explore"],
      ["Latest Events", "#events"],
    ],
  },
  {
    label: "About Us",
    href: "#about",
    links: [
      ["History", "#history"],
      ["Culture & Lifestyle", "#culture"],
      ["Festivals", "#festival"],
      ["Gallery", "#gallery"],
    ],
  },
  {
    label: "Explore",
    href: "#explore",
    links: [
      ["Beaches", "#beaches"],
      ["Barangay", "#barangay"],
      ["Cafe", "#cafe"],
      ["Heritage", "#heritage"],
      ["Tourist Spots", "#tourist"],
    ],
  },
  {
    label: "Where To Stay",
    href: "#stay",
    links: [
      ["Hotels", "#hotels"],
      ["Resorts", "#resorts"],
      ["Location Map", "#stay"],
    ],
  },
  {
    label: "Events",
    href: "#events",
    links: [
      ["Upcoming Events", "#events"],
      ["Latest News", "#news"],
    ],
  },
  {
    label: "Contact Us",
    href: "#contact",
    links: [
      ["Contact Details", "#contact"],
      ["Travel Guide", "#footer"],
    ],
  },
];

const places = [
  {
    title: "BEACHES",
    desc: "Discover the beautiful beaches of Pontevedra with exact geolocation pins and scenic travel notes.",
    image: "from-[#235c71] via-[#d7c082] to-[#0d3324]",
  },
  {
    title: "RESORTS",
    desc: "Find relaxing resorts, nearby routes, and visitor-friendly vacation stops around Pontevedra.",
    image: "from-[#174334] via-[#79a96f] to-[#e7d8b0]",
  },
  {
    title: "CAFE",
    desc: "Connect with local cafes and food stops that make every tourism route easier to enjoy.",
    image: "from-[#4a2f1d] via-[#b27a3c] to-[#f1dcb8]",
  },
  {
    title: "HERITAGE",
    desc: "Explore churches, landmarks, stories, and cultural destinations with accurate place data.",
    image: "from-[#2f342e] via-[#8d9a86] to-[#d5c8a6]",
  },
];

const infoSections = [
  ["about", "ABOUT PONTEVEDRA", "Pontevedra is a beautiful municipality in Capiz known for its culture, history, and tourism destinations."],
  ["history", "History of Pontevedra", "Discover local stories, historical landmarks, and places that shaped the municipality."],
  ["culture", "Culture & Lifestyle", "Experience warm community life, local traditions, food, festivals, and heritage routes."],
  ["festival", "Festivals", "Celebrate Kasalag Festival and other events that bring Pontevedra culture to life."],
  ["beaches", "Beaches", "Plan routes to beach destinations with accurate pins, travel notes, and scenic stops."],
  ["barangay", "Barangay", "Explore barangay-level destinations and local points of interest."],
  ["cafe", "Cafe", "Find local cafes, rest points, and food stops near your travel path."],
  ["heritage", "Heritage", "Visit churches, old sites, civic spaces, and story-rich cultural landmarks."],
  ["tourist", "Tourist Attractions", "See the top tourist destinations and smart routes for better vacations."],
  ["hotels", "Hotels", "Review recommended hotels and nearby travel connections."],
  ["resorts", "Resorts", "Choose resort stays close to attractions, beaches, and route highlights."],
  ["news", "Latest News", "Read municipal tourism updates, announcements, and destination advisories."],
];

const newsItems = [
  ["Pontevedra Beach Clean-up Drive", "Volunteers unite for a cleaner beach.", "from-[#174334] to-[#83b38f]"],
  ["Kasalag Festival 2026", "Culture and traditions celebration.", "from-[#8a4b16] to-[#efc36f]"],
];

const events = [
  ["JUN 25", "Feast of St. John the Baptist"],
  ["JUL 10", "Coastal Clean-up Drive"],
  ["AUG 01", "Kasalag Festival 2026"],
];

const galleryItems = [
  "from-[#0e3d2b] to-[#80a56e]",
  "from-[#1f5d76] to-[#d5c46e]",
  "from-[#6b3d1e] to-[#edc483]",
  "from-[#273d31] to-[#b8c9ad]",
  "from-[#1f4f40] to-[#e2d1a5]",
  "from-[#334155] to-[#9bb7c0]",
];

export default function Home() {
  const [placeIndex, setPlaceIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const place = places[placeIndex];

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const changePlace = (index: number) => setPlaceIndex(index);
  const prevPlace = () => setPlaceIndex((current) => (current === 0 ? places.length - 1 : current - 1));
  const nextPlace = () => setPlaceIndex((current) => (current === places.length - 1 ? 0 : current + 1));

  return (
    <main className="min-h-screen bg-white text-[#2f2f2f]">
      <header className="relative z-30">
        <div className="bg-[#0b6d36] px-5 text-white lg:px-20">
          <div className="mx-auto flex min-h-12 max-w-7xl flex-wrap items-center justify-between gap-3 text-sm font-semibold">
            <p>Republic of the Philippines</p>
            <div className="flex flex-wrap items-center gap-5">
              <a href="#news" className="hover:underline">Travel Updates</a>
              <a href="#events" className="hover:underline">Events</a>
              <a href="#gallery" className="hover:underline">Gallery</a>
              <span className="font-black">f</span>
              <span className="font-black">IG</span>
              <span className="font-black">YT</span>
              <p className="hidden md:block">
                {now ? now.toLocaleDateString() : "Loading date"} |{" "}
                {now ? now.toLocaleTimeString() : "Loading time"}
              </p>
            </div>
          </div>
        </div>

        <nav className="bg-white px-5 shadow-md lg:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 py-5 lg:min-h-32 lg:flex-row lg:items-center lg:justify-between">
            <a className="flex items-center gap-5" href="#home" aria-label="Municipality of Pontevedra">
              <span className="grid size-20 shrink-0 place-items-center rounded-full border-4 border-[#b83434] bg-white shadow">
                <span className="grid size-14 place-items-center rounded-full border-2 border-[#0b6d36] text-xs font-black text-[#0b6d36]">
                  SH
                </span>
              </span>
              <span>
                <span className="block text-3xl font-black text-[#0b6d36]">PONTEVEDRA</span>
                <span className="block text-lg text-[#666666]">City of Gentle People</span>
              </span>
            </a>

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
              <ul className="flex flex-wrap items-center gap-x-7 gap-y-3 text-lg text-[#3a3a3a]">
                {menuItems.map((item) => (
                  <li className="group relative" key={item.label}>
                    <a className="flex items-center gap-2 py-3 hover:text-[#0b6d36]" href={item.href}>
                      {item.label}
                      <span className="text-xs">v</span>
                    </a>
                    <ul className="invisible absolute left-0 top-full w-56 border-t-4 border-[#0b6d36] bg-white py-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100">
                      {item.links.map(([label, href]) => (
                        <li key={label}>
                          <a className="block px-4 py-3 text-sm hover:bg-[#f2f6f3] hover:text-[#0b6d36]" href={href}>
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <form className="flex h-12 w-full border border-[#d9d9d9] xl:w-72" action="#">
                <label className="sr-only" htmlFor="search">
                  Search
                </label>
                <input id="search" className="min-w-0 flex-1 px-4 outline-none" type="text" placeholder="Search" />
                <button className="w-14 bg-[#0b6d36] font-bold text-white hover:bg-[#07552a]" type="submit">
                  Go
                </button>
              </form>
            </div>
          </div>
        </nav>
      </header>

      <section id="home" className="relative isolate min-h-[690px] overflow-hidden">
        <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#1b3328] via-[#879296] to-[#b6bec0]" />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(0,0,0,.74)_0%,rgba(0,0,0,.5)_40%,rgba(0,0,0,.16)_100%)]" />
        <div className="absolute -left-20 top-0 -z-10 h-full w-1/2 bg-[radial-gradient(ellipse_at_30%_20%,rgba(6,20,9,.98)_0_9%,transparent_10%),radial-gradient(ellipse_at_45%_42%,rgba(7,27,11,.96)_0_7%,transparent_8%),radial-gradient(ellipse_at_22%_72%,rgba(8,18,10,.95)_0_13%,transparent_14%)]" />
        <div className="absolute bottom-0 left-0 right-0 -z-10 h-44 bg-[linear-gradient(7deg,rgba(12,20,15,.92)_0_24%,transparent_25%)]" />

        <div className="mx-auto flex min-h-[690px] max-w-7xl items-center px-5 py-24 lg:px-20">
          <div className="max-w-4xl text-white">
            <h3 className="text-5xl font-black sm:text-6xl">Discover</h3>
            <h1 className="mt-7 text-6xl font-black leading-[.9] tracking-wide sm:text-8xl lg:text-[104px]">
              PONTEVEDRA
            </h1>
            <h2 className="mt-7 text-2xl font-black sm:text-3xl">The Heart of Pontevedra</h2>
            <p className="mt-6 max-w-3xl text-xl font-semibold leading-9">
              Explore the beauty of Pontevedra, from pristine beaches to natural
              wonders and rich cultural heritage.
            </p>
            <a className="mt-10 inline-flex rounded-full bg-[#0b8c47] px-11 py-5 text-xl font-bold hover:bg-[#08733a]" href="#explore">
              Explore Now
            </a>
          </div>
        </div>
      </section>

      {infoSections.map(([id, title, text]) => (
        <section id={id} className="border-b border-[#e8e8e8] px-5 py-16 text-center lg:px-20" key={id}>
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-black uppercase text-[#0b6d36]">{title}</h2>
            <p className="mt-4 text-lg leading-8 text-[#666666]">{text}</p>
          </div>
        </section>
      ))}

      <section id="explore" className="relative isolate min-h-[660px] overflow-hidden px-5 py-20 text-white lg:px-20">
        <div className={`absolute inset-0 -z-30 bg-gradient-to-br ${place.image}`} />
        <div className="absolute inset-0 -z-20 bg-black/55" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div className="pt-16">
            <h1 className="text-6xl font-black sm:text-7xl">{place.title}</h1>
            <p className="mt-6 max-w-xl text-xl leading-9">{place.desc}</p>
            <button className="mt-8 rounded-full bg-[#0b8c47] px-9 py-4 text-lg font-bold hover:bg-[#08733a]" type="button">
              See More
            </button>
          </div>

          <div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {places.map((item, index) => (
                <button
                  className={`overflow-hidden rounded-[4px] bg-white text-left text-[#222222] shadow-xl transition hover:-translate-y-1 ${
                    index === placeIndex ? "ring-4 ring-[#0b8c47]" : ""
                  }`}
                  key={item.title}
                  type="button"
                  onClick={() => changePlace(index)}
                >
                  <span className={`block h-40 bg-gradient-to-br ${item.image}`} />
                  <span className="block p-4 text-xl font-black">{item.title}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <button className="size-12 bg-white text-2xl font-black text-[#0b6d36]" type="button" onClick={prevPlace}>
                &lt;
              </button>
              <button className="size-12 bg-white text-2xl font-black text-[#0b6d36]" type="button" onClick={nextPlace}>
                &gt;
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="stay" className="bg-[#f7f7f7] px-5 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-center text-4xl font-black text-[#0b6d36]">Location Map</h2>
          <iframe
            title="Pontevedra Capiz location map"
            src="https://www.google.com/maps?q=Pontevedra,Capiz,Philippines&output=embed"
            width="100%"
            height="450"
            className="border-0 shadow-lg"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </section>

      <section id="events" className="grid gap-10 px-5 py-20 lg:grid-cols-2 lg:px-20">
        <div>
          <h2 className="mb-8 text-3xl font-black text-[#0b6d36]">LATEST NEWS</h2>
          <div className="space-y-5">
            {newsItems.map(([title, text, image]) => (
              <article className="flex gap-5 bg-[#f7f7f7] p-4 shadow-sm" key={title}>
                <span className={`h-24 w-32 shrink-0 bg-gradient-to-br ${image}`} />
                <div>
                  <h4 className="text-xl font-black">{title}</h4>
                  <p className="mt-2 text-[#666666]">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-8 text-3xl font-black text-[#0b6d36]">UPCOMING EVENTS</h2>
          <div className="space-y-5">
            {events.map(([date, text]) => (
              <article className="flex items-center gap-5 border-l-8 border-[#0b6d36] bg-[#f7f7f7] p-5" key={date}>
                <h3 className="w-24 text-2xl font-black text-[#0b6d36]">{date}</h3>
                <p className="text-lg font-semibold">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-[#f7f7f7] px-5 py-20 lg:px-20">
        <h2 className="mb-10 text-center text-4xl font-black text-[#0b6d36]">EXPERIENCE PONTEVEDRA</h2>
        <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item, index) => (
            <div className={`h-64 bg-gradient-to-br ${item} shadow-sm`} key={item}>
              <span className="sr-only">Gallery image {index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="px-5 py-20 text-center lg:px-20">
        <h2 className="text-4xl font-black text-[#0b6d36]">CONTACT US</h2>
        <p className="mt-6 text-lg">Municipality of Pontevedra, Capiz</p>
        <p className="mt-2 text-lg">Email: info@pontevedra.gov.ph</p>
        <p className="mt-2 text-lg">Phone: +63 912 345 6789</p>
      </section>

      <footer id="footer" className="bg-[#083f24] text-white">
        <div className="bg-[#0b6d36] px-5 py-14 text-center lg:px-20">
          <h2 className="text-4xl font-black">PLAN YOUR TRIP TO PONTEVEDRA</h2>
          <p className="mt-3 text-lg">Find everything you need.</p>
          <button className="mt-7 rounded-full bg-white px-9 py-4 text-lg font-black text-[#0b6d36]" type="button">
            Travel Guide
          </button>
        </div>
        <div className="px-5 py-6 text-center text-sm text-[#d7eadf] lg:px-20">
          <p>Copyright 2026 Municipality of Pontevedra. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}
