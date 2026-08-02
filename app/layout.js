import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const comingSoon = process.env.SITE_MODE === "coming-soon";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: comingSoon
    ? "Holiday Home Bhaktapur | Coming Soon"
    : "Holiday Home Bhaktapur | Rooms near Durbar Square",
  description: comingSoon
    ? "The new Holiday Home Bhaktapur website is coming soon."
    : "Clean, air-conditioned private rooms, including rooms with private kitchens, within walking distance of Bhaktapur Durbar Square and Nyatapola Temple.",
  robots: comingSoon ? { index: false, follow: false } : undefined,
  openGraph: {
    title: "Holiday Home Bhaktapur",
    description: "A peaceful, comfortable stay in the heart of Bhaktapur.",
    type: "website",
    images: ["/images/standard-room.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        {children}
      </body>
    </html>
  );
}
