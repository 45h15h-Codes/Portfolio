import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { ThemeProvider } from "@/components/ThemeProvider";
import { KonamiListener } from "@/components/KonamiListener";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashish Vala | Full Stack Developer",
  description:
    "Portfolio of Ashish Vala, a Self-Learning Developer specializing in full stack solutions with Laravel, PHP, and Vue.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
        >
          <CustomCursor />
          <KonamiListener />
          <SmoothScroll>{children}</SmoothScroll>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
