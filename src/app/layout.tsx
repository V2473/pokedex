import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex | Explore the World of Pokémon",
  description: "A comprehensive Pokédex application that allows you to explore, search, and learn about all Pokémon. View detailed information including stats, abilities, evolution chains, and more.",
  keywords: ["Pokémon", "Pokédex", "PokéAPI", "Nintendo", "Game Freak", "Creatures"],
  authors: [{ name: "Pokédex Team" }],
  openGraph: {
    title: "Pokédex | Explore the World of Pokémon",
    description: "A comprehensive Pokédex application that allows you to explore, search, and learn about all Pokémon.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pokédex | Explore the World of Pokémon",
    description: "A comprehensive Pokédex application that allows you to explore, search, and learn about all Pokémon.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
