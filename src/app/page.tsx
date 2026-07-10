"use client";

import { useEffect, useState } from "react";

type Destination = {
  name: string;
  location: string;
  description: string;
  image: string;
};

type SelectedDestination = Destination & {
  category: string;
};

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
    href: "#beaches",
    desc: "Discover the beautiful beaches of Pontevedra with exact geolocation pins and scenic travel notes.",
    image: "from-[#235c71] via-[#d7c082] to-[#0d3324]",
  },
  {
    title: "RESORTS",
    href: "#resorts",
    desc: "Find relaxing resorts, nearby routes, and visitor-friendly vacation stops around Pontevedra.",
    image: "from-[#174334] via-[#79a96f] to-[#e7d8b0]",
  },
  {
    title: "BARANGAY",
    href: "#barangay",
    desc: "Browse Pontevedra barangays and discover local community destinations by area.",
    image: "from-[#1e4c38] via-[#8fb36d] to-[#d8c371]",
  },
  {
    title: "CAFE",
    href: "#cafe",
    desc: "Connect with local cafes and food stops that make every tourism route easier to enjoy.",
    image: "from-[#4a2f1d] via-[#b27a3c] to-[#f1dcb8]",
  },
  {
    title: "HERITAGE",
    href: "#heritage",
    desc: "Explore churches, landmarks, stories, and cultural destinations with accurate place data.",
    image: "from-[#2f342e] via-[#8d9a86] to-[#d5c8a6]",
  },
  {
    title: "TOURIST ATTRACTIONS",
    href: "#tourist",
    desc: "See notable places, community stops, and local attractions for better trip planning.",
    image: "from-[#1f5d76] via-[#92b7b9] to-[#e2c478]",
  },
];

const infoSections = [
  ["about", "ABOUT PONTEVEDRA", "Pontevedra is a beautiful municipality in Capiz known for its culture, history, and tourism destinations."],
  ["history", "History of Pontevedra", "Discover local stories, historical landmarks, and places that shaped the municipality."],
  ["culture", "Culture & Lifestyle", "Experience warm community life, local traditions, food, festivals, and heritage routes."],
  ["festival", "Festivals", "Celebrate Kasalag Festival and other events that bring Pontevedra culture to life."],
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

const beachDestinations: Destination[] = [];
const barangayDestinations: Destination[] = [];
const resortDestinations: Destination[] = [];
const cafeDestinations: Destination[] = [];
const heritageDestinations: Destination[] = [];
const touristDestinations: Destination[] = [];

const mapOptions = [
  { label: "Pontevedra, Capiz", location: "Pontevedra, Capiz, Philippines" },
];

const footerLinks = [
  ["Home", "#home"],
  ["About Us", "#about"],
  ["Explore", "#explore"],
  ["Where To Stay", "#stay"],
  ["Events", "#events"],
  ["Contact Us", "#contact"],
];

const visitorLinks = [
  ["Beaches", "#beaches"],
  ["Barangay", "#barangay"],
  ["Resorts", "#resorts"],
  ["Cafe", "#cafe"],
  ["Heritage", "#heritage"],
  ["Tourist Spots", "#tourist"],
  ["Location Map", "#stay"],
];

export default function Home() {
  const [placeIndex, setPlaceIndex] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedDestination, setSelectedDestination] = useState<SelectedDestination | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderCompact, setIsHeaderCompact] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState(mapOptions[0].location);
  const place = places[placeIndex];
  const visiblePlaceCount = 3;
  const selectedMapOption = mapOptions.find((option) => option.location === selectedMapLocation) ?? mapOptions[0];
  const selectedMapSource = `https://www.google.com/maps?q=${encodeURIComponent(selectedMapLocation)}&output=embed`;

  useEffect(() => {
    setNow(new Date());
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderCompact(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showPlace = (index: number) => {
    setPlaceIndex(index);
    document.querySelector(places[index].href)?.scrollIntoView({ behavior: "smooth" });
  };
  const prevPlace = () => setPlaceIndex((current) => (current === 0 ? places.length - 1 : current - 1));
  const nextPlace = () => setPlaceIndex((current) => (current === places.length - 1 ? 0 : current + 1));
  const toggleSection = (id: string) => {
    setExpandedSections((current) => ({ ...current, [id]: !current[id] }));
  };
  const openDestinationDetails = (item: Destination, category: string) => {
    setSelectedDestination({ ...item, category });
  };
  const closeDestinationDetails = () => setSelectedDestination(null);
  const destinationSections = [
    {
      id: "beaches",
      eyebrow: "Explore Pontevedra",
      title: "All Beaches",
      text: "View beach and coastal destinations around Pontevedra, with barangay details and quick map access for trip planning.",
      items: beachDestinations,
    },
    {
      id: "barangay",
      eyebrow: "Local Communities",
      title: "All Barangays",
      text: "Browse Pontevedra barangays and open map searches for local community routes and nearby destinations.",
      items: barangayDestinations,
    },
    {
      id: "resorts",
      eyebrow: "Where To Stay",
      title: "All Resorts",
      text: "View resort and stay options for visitors planning overnight trips, family breaks, and coastal routes.",
      items: resortDestinations,
    },
    {
      id: "cafe",
      eyebrow: "Food Stops",
      title: "All Cafes",
      text: "Find cafe and food stop categories for breaks, snacks, and local refreshments during your trip.",
      items: cafeDestinations,
    },
    {
      id: "heritage",
      eyebrow: "Culture And History",
      title: "All Heritage Sites",
      text: "Explore faith, civic, and cultural heritage stops connected to Pontevedra stories and traditions.",
      items: heritageDestinations,
    },
    {
      id: "tourist",
      eyebrow: "Visitor Guide",
      title: "All Tourist Attractions",
      text: "See notable places, routes, and local attractions that visitors can include in a Pontevedra itinerary.",
      items: touristDestinations,
    },
  ];

  return (
    <main className="min-h-screen bg-white text-[#2f2f2f]">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="bg-[#0a7137] px-5 text-white lg:px-10 xl:px-20">
          <div className="mx-auto flex min-h-12 max-w-7xl flex-col justify-center gap-2 py-2 text-sm font-bold sm:flex-row sm:items-center sm:justify-between sm:py-0">
            <p className="whitespace-nowrap">Republic of the Philippines</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] sm:justify-end">
              <a href="#news" className="transition hover:text-[#d8f3df]">Travel Updates</a>
              <a href="#events" className="transition hover:text-[#d8f3df]">Events</a>
              <a href="#gallery" className="transition hover:text-[#d8f3df]">Gallery</a>
              <span className="font-black" aria-label="Facebook">f</span>
              <span className="font-black" aria-label="Instagram">IG</span>
              <span className="font-black" aria-label="YouTube">YT</span>
              <p className="hidden whitespace-nowrap lg:block">
                {now
                  ? `${now.toLocaleDateString()} | ${now.toLocaleTimeString()}`
                  : "Loading date | Loading time"}
              </p>
            </div>
          </div>
        </div>

        <nav className="px-5 transition-all duration-300 lg:px-10 xl:px-20" aria-label="Main navigation">
          <div className={`mx-auto grid max-w-7xl gap-5 transition-all duration-300 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-center xl:grid-cols-[330px_minmax(0,1fr)] ${
            isHeaderCompact ? "py-2" : "py-4 lg:py-6"
          }`}
          >
            <div className="flex items-center justify-between gap-4">
              <a className="flex min-w-0 items-center gap-3 sm:gap-4" href="#home" aria-label="Municipality of Pontevedra">
              <span className={`grid shrink-0 place-items-center rounded-full border-[3px] border-[#bb3338] bg-white shadow-sm transition-all duration-300 ${
                isHeaderCompact ? "size-12 sm:size-14" : "size-16 sm:size-20 lg:size-18 xl:size-20"
              }`}
              >
                <span className={`grid place-items-center rounded-full border-2 border-[#0b6d36] font-black text-[#0b6d36] transition-all duration-300 ${
                  isHeaderCompact ? "size-8 text-[9px] sm:size-9" : "size-11 text-[10px] sm:size-14 lg:size-12 xl:size-14"
                }`}
                >
                  SH
                </span>
              </span>
              <span className="min-w-0">
                <span className={`block truncate font-black leading-none tracking-wide text-[#087238] transition-all duration-300 ${
                  isHeaderCompact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl lg:text-2xl xl:text-3xl"
                }`}
                >
                  PONTEVEDRA
                </span>
                <span className={`mt-1 truncate leading-none text-[#5f5f5f] transition-all duration-300 ${
                  isHeaderCompact ? "hidden sm:block sm:text-xs" : "block text-sm sm:text-base xl:text-lg"
                }`}
                >
                  City of Gentle People
                </span>
              </span>
              </a>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-[#d8d8d8] text-[#0b6d36] transition hover:bg-[#f1f7f3] lg:hidden"
                aria-label="Toggle main navigation"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="flex flex-col gap-1.5">
                  <span className="block h-0.5 w-5 rounded bg-current" />
                  <span className="block h-0.5 w-5 rounded bg-current" />
                  <span className="block h-0.5 w-5 rounded bg-current" />
                </span>
              </button>
            </div>

            <div className={`${isMobileMenuOpen ? "grid" : "hidden"} min-w-0 gap-4 lg:grid xl:grid-cols-[minmax(0,1fr)_minmax(220px,300px)] xl:items-center`}>
              <ul className="flex min-w-0 flex-col gap-2 text-[16px] text-[#242424] lg:flex-row lg:flex-wrap lg:items-center lg:gap-x-2 lg:gap-y-2 lg:justify-start xl:flex-nowrap xl:text-[16px] 2xl:gap-x-4">
                {menuItems.map((item) => (
                  <li className="group relative" key={item.label}>
                    <a
                      className="flex h-10 items-center justify-between gap-2 rounded-sm px-3 font-medium transition hover:bg-[#f1f7f3] hover:text-[#0b6d36] lg:justify-start lg:px-2"
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <span className="text-[11px] leading-none text-[#0b6d36]">v</span>
                    </a>
                    <ul className="grid border-l-4 border-[#0b6d36] bg-[#f7fbf8] py-1 pl-2 lg:invisible lg:absolute lg:left-0 lg:top-full lg:z-40 lg:w-56 lg:border-l-0 lg:border-t-4 lg:bg-white lg:pl-0 lg:opacity-0 lg:shadow-xl lg:transition lg:group-hover:visible lg:group-hover:opacity-100">
                      {item.links.map(([label, href]) => (
                        <li key={label}>
                          <a
                            className="block px-4 py-2 text-sm hover:bg-[#f2f6f3] hover:text-[#0b6d36] lg:py-3"
                            href={href}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              <form className="flex h-12 w-full min-w-0 max-w-full border border-[#d8d8d8] bg-white xl:justify-self-end" action="#">
                <label className="sr-only" htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  className="min-w-0 flex-1 px-3 text-base text-[#222222] outline-none placeholder:text-[#8b8f94] sm:px-4"
                  type="text"
                  placeholder="Search"
                />
                <button className="w-14 shrink-0 bg-[#0b6d36] text-sm font-black text-white transition hover:bg-[#07552a] sm:w-16" type="submit">
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
            <div className="mt-10 flex flex-wrap gap-4">
              <a className="inline-flex rounded-full bg-[#0b8c47] px-11 py-5 text-xl font-bold hover:bg-[#08733a]" href="#explore">
                Explore Now
              </a>
              <a className="inline-flex rounded-full border border-white/70 px-9 py-5 text-lg font-bold text-white hover:bg-white/10" href="/auth/sign-in">
                Sign In
              </a>
              <a className="inline-flex rounded-full border border-white/70 px-9 py-5 text-lg font-bold text-white hover:bg-white/10" href="/auth/sign-up">
                Create Account
              </a>
            </div>
            <p className="mt-6 max-w-2xl text-base font-medium leading-7 text-[#f2f8f5]">
              Visitors can request tourism help, submit a place for review, and explore featured destinations in one place.
            </p>
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
            <a className="mt-8 inline-flex rounded-full bg-[#0b8c47] px-9 py-4 text-lg font-bold hover:bg-[#08733a]" href={place.href}>
              See More
            </a>
          </div>

          <div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {places.map((item, index) => (
                <button
                  className={`overflow-hidden rounded-[4px] bg-white text-left text-[#222222] shadow-xl transition hover:-translate-y-1 ${
                    index === placeIndex ? "ring-4 ring-[#0b8c47]" : ""
                  }`}
                  key={item.title}
                  type="button"
                  onClick={() => showPlace(index)}
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

      {destinationSections.map((section, sectionIndex) => {
        const isExpanded = expandedSections[section.id];
        const visibleItems = isExpanded ? section.items : section.items.slice(0, visiblePlaceCount);
        const hiddenCount = section.items.length - visiblePlaceCount;

        return (
          <section
            id={section.id}
            className={`${sectionIndex % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"} px-5 py-20 lg:px-20`}
            key={section.id}
          >
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0b6d36]">{section.eyebrow}</p>
                  <h2 className="mt-3 text-4xl font-black text-[#123126] sm:text-5xl">{section.title}</h2>
                  <p className="mt-4 max-w-2xl text-lg leading-8 text-[#666666]">{section.text}</p>
                </div>
                <a
                  className="inline-flex h-12 items-center justify-center bg-[#0b6d36] px-7 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]"
                  href="#stay"
                >
                  View Location Map
                </a>
              </div>

              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {visibleItems.map((item) => (
                  <article className="overflow-hidden border border-[#e2e8e4] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl" key={item.name}>
                    <div className={`h-52 bg-gradient-to-br ${item.image}`} />
                    <div className="p-6">
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0b6d36]">{item.location}</p>
                      <h3 className="mt-3 text-2xl font-black text-[#161616]">{item.name}</h3>
                      <p className="mt-3 min-h-20 text-base leading-7 text-[#666666]">{item.description}</p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <a
                          className="inline-flex h-11 items-center justify-center bg-[#0b6d36] px-5 text-sm font-black text-white transition hover:bg-[#07552a]"
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.location} Pontevedra Capiz`)}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open Map
                        </a>
                        <button
                          className="inline-flex h-11 items-center justify-center border border-[#0b6d36] px-5 text-sm font-black text-[#0b6d36] transition hover:bg-[#edf7f0]"
                          type="button"
                          onClick={() => openDestinationDetails(item, section.title.replace("All ", ""))}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {hiddenCount > 0 && (
                <div className="mt-10 flex justify-center">
                  <button
                    className="inline-flex h-12 min-w-40 items-center justify-center bg-[#0b6d36] px-8 text-sm font-black uppercase tracking-wide text-white transition hover:bg-[#07552a]"
                    type="button"
                    onClick={() => toggleSection(section.id)}
                  >
                    {isExpanded ? "Show Less" : `See More (${hiddenCount})`}
                  </button>
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section id="stay" className="bg-[#f7f7f7] px-5 py-20 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#0b6d36]">Map Access</p>
              <h2 className="mt-2 text-4xl font-black text-[#0b6d36]">Location Map</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#666666]">
                Choose a resource from the dropdown to view its location on the map.
              </p>
            </div>

            <label className="flex w-full flex-col gap-2 text-sm font-black uppercase tracking-wide text-[#123126] md:max-w-sm">
              Select Location
              <select
                value={selectedMapLocation}
                onChange={(event) => setSelectedMapLocation(event.target.value)}
                className="h-12 w-full border border-[#d8d8d8] bg-white px-4 text-sm font-bold normal-case tracking-normal text-[#222222] outline-none transition focus:border-[#0b6d36] focus:ring-2 focus:ring-[#d8f3df]"
              >
                {mapOptions.map((option) => (
                  <option value={option.location} key={`${option.label}-${option.location}`}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mb-4 border-l-8 border-[#0b6d36] bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0b6d36]">{selectedMapOption.label}</p>
            <p className="mt-1 text-base font-semibold text-[#555555]">{selectedMapOption.location}</p>
          </div>

          <iframe
            title={`${selectedMapOption.label} location map`}
            src={selectedMapSource}
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

      {selectedDestination && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 py-8" role="dialog" aria-modal="true" aria-labelledby="destination-title">
          <div className="max-h-full w-full max-w-4xl overflow-y-auto bg-white shadow-2xl">
            <div className={`h-56 bg-gradient-to-br ${selectedDestination.image}`} />
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#0b6d36]">
                    {selectedDestination.category}
                  </p>
                  <h2 id="destination-title" className="mt-3 text-3xl font-black text-[#161616] sm:text-4xl">
                    {selectedDestination.name}
                  </h2>
                  <p className="mt-2 text-lg font-semibold text-[#0b6d36]">{selectedDestination.location}</p>
                </div>
                <button
                  className="inline-flex h-11 items-center justify-center border border-[#d3d8d5] px-5 text-sm font-black text-[#333333] transition hover:bg-[#f2f6f3]"
                  type="button"
                  onClick={closeDestinationDetails}
                >
                  Close
                </button>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#123126]">About This Place</h3>
                  <p className="mt-3 text-lg leading-8 text-[#555555]">{selectedDestination.description}</p>
                  <p className="mt-5 text-base leading-7 text-[#666666]">
                    This listing helps visitors understand the place before going there. Use the map for route planning,
                    then check local conditions, opening availability, and visitor guidance before your trip.
                  </p>
                </div>

                <div className="border border-[#e2e8e4] bg-[#f7f7f7] p-5">
                  <h3 className="text-sm font-black uppercase tracking-[0.16em] text-[#123126]">Visitor Details</h3>
                  <dl className="mt-4 space-y-4 text-sm">
                    <div>
                      <dt className="font-black text-[#0b6d36]">Location</dt>
                      <dd className="mt-1 text-[#555555]">{selectedDestination.location}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-[#0b6d36]">Category</dt>
                      <dd className="mt-1 text-[#555555]">{selectedDestination.category}</dd>
                    </div>
                    <div>
                      <dt className="font-black text-[#0b6d36]">Best For</dt>
                      <dd className="mt-1 text-[#555555]">Trip planning, local exploration, photos, and route checking.</dd>
                    </div>
                  </dl>
                  <a
                    className="mt-6 inline-flex h-11 w-full items-center justify-center bg-[#0b6d36] px-5 text-sm font-black text-white transition hover:bg-[#07552a]"
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedDestination.name} ${selectedDestination.location} Pontevedra Capiz`)}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer id="footer" className="bg-[#07351f] text-white">
        <div className="border-b border-white/10 bg-[#0b6d36] px-5 py-12 lg:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#cfead8]">Official Tourism Portal</p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">Plan Your Trip To Pontevedra</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#e4f3e9]">
                Explore destinations, events, places to stay, and local travel information in one place.
              </p>
            </div>
            <a
              className="inline-flex h-13 items-center justify-center bg-white px-8 text-base font-black text-[#0b6d36] transition hover:bg-[#edf7f0]"
              href="#explore"
            >
              Start Exploring
            </a>
          </div>
        </div>

        <div className="px-5 py-12 lg:px-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_.9fr_1fr]">
            <div>
              <a className="flex items-center gap-4" href="#home" aria-label="Municipality of Pontevedra footer home">
                <span className="grid size-16 shrink-0 place-items-center rounded-full border-4 border-[#bb3338] bg-white">
                  <span className="grid size-10 place-items-center rounded-full border-2 border-[#0b6d36] text-[10px] font-black text-[#0b6d36]">
                    SH
                  </span>
                </span>
                <span>
                  <span className="block text-2xl font-black leading-none text-white">PONTEVEDRA</span>
                  <span className="mt-2 block text-sm text-[#cfead8]">City of Gentle People</span>
                </span>
              </a>
              <p className="mt-5 max-w-sm text-sm leading-7 text-[#cfead8]">
                Municipality of Pontevedra, Capiz, Republic of the Philippines.
              </p>
              <div className="mt-6 flex gap-3">
                {["f", "IG", "YT"].map((item) => (
                  <a
                    className="grid size-10 place-items-center border border-white/20 text-sm font-black transition hover:border-white hover:bg-white hover:text-[#0b6d36]"
                    href="#home"
                    key={item}
                    aria-label={`${item} social link`}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">Quick Links</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#cfead8]">
                {footerLinks.map(([label, href]) => (
                  <li key={label}>
                    <a className="transition hover:text-white" href={href}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">Visitor Guide</h3>
              <ul className="mt-5 space-y-3 text-sm text-[#cfead8]">
                {visitorLinks.map(([label, href]) => (
                  <li key={label}>
                    <a className="transition hover:text-white" href={href}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-white">Contact</h3>
              <div className="mt-5 space-y-4 text-sm leading-6 text-[#cfead8]">
                <p>Municipal Tourism Office</p>
                <p>Pontevedra, Capiz, Philippines</p>
                <p>
                  <a className="transition hover:text-white" href="mailto:info@pontevedra.gov.ph">
                    info@pontevedra.gov.ph
                  </a>
                </p>
                <p>
                  <a className="transition hover:text-white" href="tel:+639123456789">
                    +63 912 345 6789
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-5 text-sm text-[#cfead8] lg:px-20">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>Copyright 2026 Municipality of Pontevedra. All Rights Reserved.</p>
            <p>Republic of the Philippines</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
