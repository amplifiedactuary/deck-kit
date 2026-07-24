import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Deck Kit — example deck",
  description: "Build presentation decks as a website with your coding agent. Slides as code.",
  // iOS has no working Fullscreen API on iPhone, so the only chromeless full-screen
  // presentation path is "Add to Home Screen" as a standalone web app. These metas make
  // that launch edge-to-edge with no Safari toolbars.
  appleWebApp: { capable: true, title: "Deck Kit", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Let the canvas extend under the notch/home-indicator; the slide is letterboxed on the
  // bg colour, so there is no content to lose at the edges.
  viewportFit: "cover",
  themeColor: "#07090d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
