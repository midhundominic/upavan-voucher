import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "./designer.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Voucher Designer | Upavan Resort, Wayanad",
  description:
    "A thoughtful gesture. A beautiful escape. Create a personalized complimentary stay voucher for Upavan Resort, Wayanad.",
  robots: { index: false, follow: false },
  icons: {
    icon: { url: "/assets/upavan-logo.png", type: "image/png" },
    apple: { url: "/assets/upavan-logo.png", type: "image/png" },
  },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#063D2B" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
