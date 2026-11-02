import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Courtroom Breakdown — Ace Attorney AI Debate Learning Platform",
  description:
    "An Ace Attorney-inspired AI debate breakdown and learning platform. Transform polarizing discussions into entertaining courtroom dramas with live fact-checking, verifiable sources, and beginner concept explainers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#070b14] text-slate-100">
        {children}
      </body>
    </html>
  );
}
