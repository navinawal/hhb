import { Martel, Mukta } from "next/font/google";
import "./globals.css";

const display = Martel({
  subsets: ["latin", "devanagari"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const body = Mukta({
  subsets: ["latin", "devanagari"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
