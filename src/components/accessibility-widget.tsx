"use client";

import { useEffect, useRef, useState } from "react";

type Settings = {
  textScale: number;
  highContrast: boolean;
  highlightLinks: boolean;
  readableFont: boolean;
  reduceMotion: boolean;
  lineSpacing: boolean;
  textSpacing: boolean;
  largeCursor: boolean;
};

const defaults: Settings = {
  textScale: 100,
  highContrast: false,
  highlightLinks: false,
  readableFont: false,
  reduceMotion: false,
  lineSpacing: false,
  textSpacing: false,
  largeCursor: false,
};
const storageKey = "pontevedra-accessibility-settings";

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaults);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setSettings({ ...defaults, ...JSON.parse(saved) });
    } catch { /* Ignore invalid or unavailable stored settings. */ }
    setSettingsLoaded(true);
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    const root = document.documentElement;
    root.style.fontSize = `${settings.textScale}%`;
    root.classList.toggle("a11y-high-contrast", settings.highContrast);
    root.classList.toggle("a11y-highlight-links", settings.highlightLinks);
    root.classList.toggle("a11y-readable-font", settings.readableFont);
    root.classList.toggle("a11y-reduce-motion", settings.reduceMotion);
    root.classList.toggle("a11y-line-spacing", settings.lineSpacing);
    root.classList.toggle("a11y-text-spacing", settings.textSpacing);
    root.classList.toggle("a11y-large-cursor", settings.largeCursor);
    try { localStorage.setItem(storageKey, JSON.stringify(settings)); } catch { /* Storage may be unavailable. */ }
  }, [settings, settingsLoaded]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "F2") {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  useEffect(() => { if (isOpen) closeButtonRef.current?.focus(); }, [isOpen]);

  const update = (key: keyof Settings, value: boolean | number) =>
    setSettings((current) => ({ ...current, [key]: value }));
  const resetSettings = () => setSettings(defaults);
  const togglePanel = () => setIsOpen((open) => {
    if (open) window.setTimeout(() => triggerRef.current?.focus(), 0);
    return !open;
  });

  const switches: [string, keyof Settings][] = [
    ["High contrast", "highContrast"],
    ["Highlight links", "highlightLinks"],
    ["Readable font", "readableFont"],
    ["Reduce motion", "reduceMotion"],
    ["Large cursor", "largeCursor"],
  ];

  return (
    <div className="accessibility-widget relative z-[60] shrink-0">
      {isOpen && (
        <section id="accessibility-panel" aria-labelledby="accessibility-panel-title" className="absolute bottom-full right-0 mb-3 max-h-[min(78vh,44rem)] w-[min(21rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="accessibility-panel-title" className="text-lg font-bold">Accessibility</h2>
            <button ref={closeButtonRef} type="button" onClick={togglePanel} aria-label="Close accessibility settings" className="grid size-9 place-items-center rounded-md text-xl text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">×</button>
          </div>
          <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-sm font-medium">Text size <span className="text-slate-500">{settings.textScale}%</span></span>
            <span className="flex gap-2">
              <button type="button" aria-label="Decrease text size" onClick={() => update("textScale", Math.max(80, settings.textScale - 10))} className="size-9 rounded-md border border-slate-300 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">−</button>
              <button type="button" aria-label="Increase text size" onClick={() => update("textScale", Math.min(140, settings.textScale + 10))} className="size-9 rounded-md border border-slate-300 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">+</button>
            </span>
          </div>
          <div className="space-y-1">
            {switches.map(([label, key]) => <Switch key={key} label={label} checked={Boolean(settings[key])} onClick={() => update(key, !settings[key])} />)}
          </div>
          <details className="mt-2 rounded-lg" open={moreOpen} onToggle={(event) => setMoreOpen(event.currentTarget.open)}>
            <summary className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">More settings</summary>
            <div className="mt-1 space-y-1">
              <Switch label="Increase line spacing" checked={settings.lineSpacing} onClick={() => update("lineSpacing", !settings.lineSpacing)} />
              <Switch label="Increase text spacing" checked={settings.textSpacing} onClick={() => update("textSpacing", !settings.textSpacing)} />
              <div className="rounded-lg px-3 py-2 text-sm leading-relaxed">
                <h3 className="font-semibold">Keyboard navigation</h3>
                <p className="mt-1">Tab: next item · Shift + Tab: previous item · Enter: activate · Space: toggle or activate · Escape: close a panel or dialog.</p>
              </div>
            </div>
          </details>
          <button type="button" onClick={resetSettings} className="mt-3 min-h-11 w-full rounded-lg border border-blue-700 px-3 text-sm font-bold text-blue-800 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">Reset accessibility settings</button>
          <p className="mt-3 text-center text-xs text-slate-500">Keyboard shortcut: Ctrl + F2</p>
        </section>
      )}
      <div className="relative flex w-[76px] justify-center pt-2">
        <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-t-sm border border-white bg-[#0875c9] px-1.5 py-0.5 text-xs font-black leading-4 text-white shadow">CTRL+F2</span>
        <button ref={triggerRef} type="button" aria-label={isOpen ? "Close accessibility settings" : "Open accessibility settings"} aria-expanded={isOpen} aria-controls="accessibility-panel" onClick={togglePanel} className="grid h-[70px] w-[76px] place-items-center rounded-b-[20px] rounded-t-sm border-2 border-white bg-[#0875c9] text-white shadow-lg transition hover:bg-[#0564ad] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-800">
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-11 w-11 fill-current"><circle cx="24" cy="8" r="5" /><path d="M8 15.5c0-1.2 1.2-2.1 2.4-1.8L24 17l13.6-3.3c1.2-.3 2.4.6 2.4 1.8s-.8 2.1-2 2.4L27 20.7v5.1l8.2 5.4c.9.6 1.2 1.8.6 2.8-.6.9-1.8 1.2-2.8.6L26 30v6.3l3.5 8.3c.5 1.1 0 2.3-1.1 2.8-1.1.5-2.3 0-2.8-1.1L24 41.2l-1.6 5.1c-.4 1.1-1.6 1.7-2.7 1.3s-1.7-1.6-1.3-2.7l3.4-8.6V30l-6.7 4.8c-1 .7-2.2.5-2.9-.4-.7-1-.5-2.2.4-2.9l8-5.7v-5.1l-11-2.8c-1-.3-1.6-1.3-1.6-2.4Z" /></svg>
        </button>
      </div>
    </div>
  );
}

function Switch({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return <button type="button" role="switch" aria-label={label} aria-checked={checked} onClick={onClick} className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">
    {label}<span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-blue-700" : "bg-slate-300"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"} `} /></span>
  </button>;
}
