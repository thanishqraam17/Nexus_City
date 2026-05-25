import type { Metadata } from "next";
import { Syne, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "NEXUS CITY — Smart City Operating System",
  description:
    "Futuristic AI-powered command center for tomorrow's metropolis. Real-time telemetry and cinematic urban control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-full bg-void antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
