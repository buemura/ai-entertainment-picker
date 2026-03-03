import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "RecommendAI - Descubra o que assistir, ouvir ou fazer hoje com ajuda da IA!";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const tagColors = ["#FACC15", "#F472B6", "#38BDF8", "#4ADE80"];
  const tags = ["Filmes", "Séries", "Músicas", "Entretenimento"];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFF8E1",
        backgroundImage:
          "radial-gradient(circle at 20px 20px, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        position: "relative",
        padding: 40,
      }}
    >
      {/* Decorative shapes */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          width: 80,
          height: 80,
          backgroundColor: "#FB923C",
          border: "3px solid #000",
          borderRadius: 16,
          transform: "rotate(12deg)",
          boxShadow: "4px 4px 0px 0px #000",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 50,
          right: 60,
          width: 60,
          height: 60,
          backgroundColor: "#38BDF8",
          border: "3px solid #000",
          borderRadius: "50%",
          boxShadow: "4px 4px 0px 0px #000",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 50,
          left: 80,
          width: 50,
          height: 50,
          backgroundColor: "#C084FC",
          border: "3px solid #000",
          borderRadius: "50%",
          boxShadow: "4px 4px 0px 0px #000",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 50,
          width: 70,
          height: 70,
          backgroundColor: "#4ADE80",
          border: "3px solid #000",
          borderRadius: 14,
          transform: "rotate(-8deg)",
          boxShadow: "4px 4px 0px 0px #000",
          display: "flex",
        }}
      />

      {/* Main card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          border: "4px solid #000",
          borderRadius: 24,
          boxShadow: "8px 8px 0px 0px #000",
          padding: "48px 64px",
          maxWidth: 900,
        }}
      >
        {/* Icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 18,
            backgroundColor: "#FACC15",
            border: "3px solid #000",
            boxShadow: "4px 4px 0px 0px #000",
            marginBottom: 20,
            fontSize: 40,
          }}
        >
          ✦
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#000",
            display: "flex",
            letterSpacing: -2,
          }}
        >
          RecommendAI
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 26,
            color: "#333",
            marginTop: 12,
            textAlign: "center",
            maxWidth: 650,
            display: "flex",
            fontWeight: 500,
          }}
        >
          Descubra o que assistir, ouvir ou fazer hoje com ajuda da IA!
        </div>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 32,
          }}
        >
          {tags.map((tag, i) => (
            <div
              key={tag}
              style={{
                padding: "10px 24px",
                borderRadius: 12,
                border: "3px solid #000",
                backgroundColor: tagColors[i],
                color: "#000",
                fontSize: 20,
                fontWeight: 700,
                display: "flex",
                boxShadow: "3px 3px 0px 0px #000",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>,
    { ...size },
  );
}
