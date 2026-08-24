import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family
  )}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);

  if (match) {
    const response = await fetch(match[1]);
    if (response.ok) return response.arrayBuffer();
  }

  throw new Error(`Failed to load font: ${family}`);
}

export default async function OpengraphImage() {
  const title = "Sleepifyme";
  const tagline = "Everything Your Sleep Needs, In One Place";

  const [playfair, dmSans] = await Promise.all([
    loadGoogleFont("Playfair Display", 600, title),
    loadGoogleFont("DM Sans", 400, tagline),
  ]);

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
          background:
            "linear-gradient(180deg, #0A1128 0%, #070C1F 55%, #05070F 100%)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#C9A24B",
            marginBottom: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Playfair Display",
              fontWeight: 600,
              fontSize: 34,
              color: "#0A1128",
              lineHeight: 1,
            }}
          >
            S
          </span>
        </div>
        <div
          style={{
            fontFamily: "Playfair Display",
            fontSize: 88,
            fontWeight: 600,
            color: "#F4EFE1",
            display: "flex",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "DM Sans",
            fontSize: 26,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#D9BC7C",
            marginTop: 24,
            display: "flex",
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair, style: "normal", weight: 600 },
        { name: "DM Sans", data: dmSans, style: "normal", weight: 400 },
      ],
    }
  );
}
