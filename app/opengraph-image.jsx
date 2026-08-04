import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const alt = "Holiday Home Bhaktapur — private rooms near Durbar Square";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", color: "#fff8ea", background: "#2b1c10", overflow: "hidden" }}>
        {/* ImageResponse renders its own image output; next/image is not supported here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${SITE_URL}/images/standard-room.jpg`} alt="" width="1200" height="630" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(90deg, rgba(31,18,10,.94) 0%, rgba(43,28,16,.78) 49%, rgba(43,28,16,.16) 100%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", width: 720, padding: "70px 76px", borderLeft: "9px solid #e6a726" }}>
          <div style={{ display: "flex", color: "#e6a726", fontSize: 24, letterSpacing: 6, textTransform: "uppercase" }}>
            Peaceful · Personal · Authentically Bhaktapur
          </div>
          <div style={{ display: "flex", marginTop: 34, fontFamily: "serif", fontSize: 76, lineHeight: 1.08, fontWeight: 700 }}>
            {SITE_NAME}
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 30, lineHeight: 1.35 }}>
            Private rooms near Durbar Square &amp; Nyatapola Temple
          </div>
        </div>
      </div>
    ),
    size,
  );
}
