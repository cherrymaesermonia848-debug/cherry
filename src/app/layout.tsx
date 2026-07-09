import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pontevedra Tourism Portal",
  description:
    "A tourism website for Pontevedra that highlights destinations, events, travel details, visitor requests, and admin management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
