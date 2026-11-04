import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CrossCheck!",
  description:
    "CrossCheck! is an Ace Attorney-inspired AI debate breakdown and learning platform. Transform polarizing discussions into entertaining courtroom dramas with live fact-checking, verifiable sources, and beginner concept explainers.",
  icons: {
    icon: [
      { url: '/crosscheck favicon.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    shortcut: '/crosscheck favicon.png',
    apple: '/crosscheck favicon.png',
  },
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
