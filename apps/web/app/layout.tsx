import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "exness - Trade with confidence",
  description: "A clean and modern trading experience for active markets.",
  openGraph: {
    title: "exness - Trade with confidence",
    description: "A clean and modern trading experience for active markets.",
    images: [
      {
        url: "/images/OG.png",
        width: 1200,
        height: 630,
        alt: "exness - Trade with confidence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "exness - Trade with confidence",
    description: "A clean and modern trading experience for active markets.",
    images: ["/images/OG.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${instrumentSerif.variable} ${ibmPlexMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
