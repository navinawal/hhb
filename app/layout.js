import { Cormorant_Garamond, Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const nepali = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-nepali",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Holiday Home Bhaktapur | Rooms near Durbar Square",
  description:
    "Clean, air-conditioned private rooms and kitchen rooms within walking distance of Bhaktapur Durbar Square and Nyatapola Temple.",
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
      <body className={`${display.variable} ${body.variable} ${nepali.variable}`}>
        {children}
      </body>
    </html>
  );
}
