import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TioSam BI - Business Intelligence Dashboard",
  description: "Plataforma de Business Intelligence moderna con análisis impulsado por IA para gestión de datos empresariales.",
  keywords: ["BI", "Business Intelligence", "Analytics", "Dashboard", "Data Analysis", "AI"],
  authors: [{ name: "TioSam BI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnimatedBackground />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
