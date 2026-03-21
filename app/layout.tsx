import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { PageTransition } from "@/components/dashboard/page-transition";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Invoxa",
  description: "Professional invoices & payment pages for freelancers",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased">
        <Toaster position="top-right" richColors />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
