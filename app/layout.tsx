import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DriveLegal | BIMSTEC Traffic Laws",
  description: "AI-powered platform for traffic laws, violations, and fines across BIMSTEC countries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 flex flex-col">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
