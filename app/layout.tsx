import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Work_Sans } from "next/font/google";
import "./globals.css";
import { getCatalog } from "@/lib/api";
import { BookingProvider } from "@/components/BookingProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookingBar } from "@/components/BookingBar";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-work-sans",
  display: "swap"
});

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-libre-baskerville",
  display: "swap"
});

export const metadata: Metadata = {
  title: { default: "ILSEBEAUTY", template: "%s · ILSEBEAUTY" },
  description: "A calm, private studio for lash extensions, lifts and brows. By appointment only."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = await getCatalog();

  return (
    <html lang="en" className={`${workSans.variable} ${libreBaskerville.variable}`}>
      <body>
        {catalog ? (
          <BookingProvider catalog={catalog}>
            <Header />
            <main id="main">{children}</main>
            <BookingBar />
            <Footer />
          </BookingProvider>
        ) : (
          <main className="wrap sec">
            <h1 className="h2">we&apos;ll be right back</h1>
            <p className="lede" style={{ marginTop: "var(--s2)" }}>
              The booking service is temporarily unavailable. Please try again in a few minutes.
            </p>
          </main>
        )}
      </body>
    </html>
  );
}
