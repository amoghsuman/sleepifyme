import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

async function loadPlayfairS() {
  const cssUrl =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&text=S";
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);

  if (match) {
    const response = await fetch(match[1]);
    if (response.ok) return response.arrayBuffer();
  }

  throw new Error("Failed to load Playfair Display font");
}

export default async function Icon() {
  const playfair = await loadPlayfairS();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A1128",
        }}
      >
        <span
          style={{
            fontFamily: "Playfair Display",
            fontWeight: 700,
            fontSize: 22,
            color: "#C9A24B",
            lineHeight: 1,
          }}
        >
          S
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Playfair Display", data: playfair, style: "normal", weight: 700 },
      ],
    }
  );
}
