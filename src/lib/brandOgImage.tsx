import { ImageResponse } from "next/og";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/** Shared visual for opengraph-image.tsx and twitter-image.tsx. */
export function createBrandOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0f1a 0%, #111a2b 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, color: "#2dd4bf" }}>Leaax</div>
        <div style={{ display: "flex", fontSize: 40, marginTop: 28, color: "#94a3b8" }}>
          Find out where your [li:ks] are
        </div>
      </div>
    ),
    { ...OG_IMAGE_SIZE },
  );
}
