import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrossCheck! ⚖️ — Playable AI Debate Courtroom & Fact-Checking Explainer",
  description:
    "CrossCheck! is an Ace Attorney-inspired AI debate breakdown and learning platform. Transform polarizing discussions into entertaining courtroom dramas with live fact-checking, verifiable sources, and beginner concept explainers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
