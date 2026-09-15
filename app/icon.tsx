import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
          background: "linear-gradient(135deg, #0a0d37 0%, #000000 100%)",
          border: "3px solid #7c3aed",
          color: "#7df9ff",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: -1,
        }}
      >
        CB
      </div>
    ),
    size,
  );
}
