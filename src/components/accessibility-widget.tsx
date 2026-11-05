"use client";

import { useEffect, useRef, useState } from "react";

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [textScale, setTextScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${textScale}%`;
    root.classList.toggle("a11y-high-contrast", highContrast);
    root.classList.toggle("a11y-highlight-links", highlightLinks);
    root.classList.toggle("a11y-readable-font", readableFont);
  }, [textScale, highContrast, highlightLinks, readableFont]);

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

  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus();
  }, [isOpen]);

  const resetSettings = () => {
    setTextScale(100);
    setHighContrast(false);
    setHighlightLinks(false);
    setReadableFont(false);
  };

  const togglePanel = () => {
    setIsOpen((open) => {
      if (open) window.setTimeout(() => triggerRef.current?.focus(), 0);
      return !open;
    });
  };

  return (
    <div className="fixed bottom-3 left-3 z-[60] sm:bottom-4 sm:left-4">
      {isOpen && (
        <section
          id="accessibility-panel"
          aria-labelledby="accessibility-panel-title"
          className="mb-3 w-[min(21rem,calc(100vw-1.5rem))] rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="accessibility-panel-title" className="text-lg font-bold">Accessibility</h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={togglePanel}
              aria-label="Close accessibility settings"
              className="grid size-9 place-items-center rounded-md text-xl text-slate-700 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              ×
            </button>
          </div>

          <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
            <span className="text-sm font-medium">Text size <span className="text-slate-500">{textScale}%</span></span>
            <span className="flex gap-2">
              <button type="button" aria-label="Decrease text size" onClick={() => setTextScale((size) => Math.max(80, size - 10))} className="size-9 rounded-md border border-slate-300 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">−</button>
              <button type="button" aria-label="Increase text size" onClick={() => setTextScale((size) => Math.min(140, size + 10))} className="size-9 rounded-md border border-slate-300 text-lg font-bold hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">+</button>
            </span>
          </div>

          <div className="space-y-1">
            {[
              ["High contrast", highContrast, () => setHighContrast((value) => !value)],
              ["Highlight links", highlightLinks, () => setHighlightLinks((value) => !value)],
              ["Readable font", readableFont, () => setReadableFont((value) => !value)],
            ].map(([label, checked, onClick]) => (
              <button
                key={String(label)}
                type="button"
                role="switch"
                aria-checked={Boolean(checked)}
                onClick={onClick as () => void}
                className="flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-left text-sm font-medium hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700"
              >
                {String(label)}
                <span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-blue-700" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
                </span>
              </button>
            ))}
          </div>

          <button type="button" onClick={resetSettings} className="mt-3 min-h-11 w-full rounded-lg border border-blue-700 px-3 text-sm font-bold text-blue-800 hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-700">
            Reset accessibility settings
          </button>
          <p className="mt-3 text-center text-xs text-slate-500">Keyboard shortcut: Ctrl + F2</p>
        </section>
      )}

      <div className="relative flex w-[76px] justify-center pt-2">
        <span aria-hidden="true" className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-t-sm border border-white bg-[#0875c9] px-1.5 py-0.5 text-xs font-black leading-4 text-white shadow">CTRL+F2</span>
        <button
          ref={triggerRef}
          type="button"
          aria-label={isOpen ? "Close accessibility settings" : "Open accessibility settings"}
          aria-expanded={isOpen}
          aria-controls={isOpen ? "accessibility-panel" : undefined}
          onClick={togglePanel}
          className="grid h-[70px] w-[76px] place-items-center rounded-b-[20px] rounded-t-sm border-2 border-white bg-[#0875c9] text-white shadow-lg transition hover:bg-[#0564ad] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        >
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-11 w-11 fill-current">
            <circle cx="24" cy="8" r="5" />
            <path d="M8 15.5c0-1.2 1.2-2.1 2.4-1.8L24 17l13.6-3.3c1.2-.3 2.4.6 2.4 1.8s-.8 2.1-2 2.4L27 20.7v5.1l8.2 5.4c.9.6 1.2 1.8.6 2.8-.6.9-1.8 1.2-2.8.6L26 30v6.3l3.5 8.3c.5 1.1 0 2.3-1.1 2.8-1.1.5-2.3 0-2.8-1.1L24 41.2l-1.6 5.1c-.4 1.1-1.6 1.7-2.7 1.3s-1.7-1.6-1.3-2.7l3.4-8.6V30l-6.7 4.8c-1 .7-2.2.5-2.9-.4-.7-1-.5-2.2.4-2.9l8-5.7v-5.1l-11-2.8c-1-.3-1.6-1.3-1.6-2.4Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
