import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const photo = await readFile(join(process.cwd(), "public", site.image), "base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at 20% 20%, #3b1d8f 0%, #0a0d37 45%, #000000 100%)",
          color: "white",
          padding: "70px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <div style={{ display: "flex", fontSize: 26, color: "#7df9ff", letterSpacing: 2 }}>
            CHRISBELGA.DEV
          </div>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 700, marginTop: 20, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 38, color: "#c4b5fd", marginTop: 24, whiteSpace: "nowrap" }}>
            Web Developer &amp; HubSpot Admin
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#9ca3af", marginTop: 28 }}>
            React · Next.js · Node.js · HubSpot
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#9ca3af", marginTop: 8 }}>
            Bicol, Philippines
          </div>
          <div style={{ display: "flex", alignItems: "center", fontSize: 24, color: "#4ade80", marginTop: 40 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#4ade80", marginRight: 12 }} />
            Available for projects
          </div>
        </div>
        <img
          src={`data:image/png;base64,${photo}`}
          width={420}
          height={457}
          style={{ alignSelf: "flex-end", marginBottom: -70 }}
        />
      </div>
    ),
    size,
  );
}
