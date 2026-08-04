import { SITE_URL } from "@/lib/seo";

export default function robots() {
  const comingSoon = process.env.SITE_MODE === "coming-soon";

  return {
    rules: comingSoon
      ? { userAgent: "*", disallow: "/" }
      : {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
