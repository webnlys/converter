import { ImageResponse } from "next/og";
import { getSiteUrl } from "@/lib/site";

export const alt =
  "Bangla In Words Converter — Bangladesh Taka figures to words in English and Bengali";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function Image() {
  const base = getSiteUrl();

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #065f46 45%, #059669 100%)",
          padding: 64,
          fontFamily:
            'ui-sans-serif, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: -0.02,
            maxWidth: 980,
          }}
        >
          Bangla In Words Converter
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 600,
            color: "#a7f3d0",
            marginTop: 20,
            maxWidth: 900,
          }}
        >
          Bangladesh Taka • Figures ↔ Words • Bengali & English
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 22,
            fontWeight: 500,
            color: "#cbd5e1",
          }}
        >
          Free • Lac–crore–paisa • Bidirectional
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: 48,
            fontSize: 18,
            color: "#94a3b8",
          }}
        >
          {base.replace(/^https:\/\//, "")}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
