import { Martel, Mukta } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: comingSoon
      ? `${SITE_NAME} | Coming Soon`
      : `${SITE_NAME} | Private Rooms near Durbar Square`,
    template: `%s | ${SITE_NAME}`,
  },
  description: comingSoon
    ? "The new Holiday Home Bhaktapur website is coming soon."
    : SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  category: "travel",
  alternates: { canonical: "/" },
  robots: comingSoon
    ? { index: false, follow: false, nocache: true }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      },
  openGraph: {
    title: `${SITE_NAME} | Private Rooms near Durbar Square`,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Private Rooms near Durbar Square`,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
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
