import { ImageResponse } from "next/og";
import { BRAND } from "./lib/brand";

export const alt = BRAND.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0a0d12 0%, #111a2e 100%)",
          color: "#e8ecf1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 40, fontWeight: 700 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#5b82ff" }} />
          {BRAND.name}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 40, lineHeight: 1.1 }}>{BRAND.tagline}</div>
        <div style={{ fontSize: 30, color: "#8b95a5", marginTop: 28 }}>BTC · ETH · SOL — live pricing, up to 100× leverage</div>
      </div>
    ),
    size
  );
}
