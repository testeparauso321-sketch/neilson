import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { McpScaffold } from "../mcp";
import { Cursor, typed } from "../terminal";

// Cena 05 — Glyph (240f / 8s, split-safe, motion-graphics).
// Ele mesmo escreve o prompt → grid de modelos acende em onda e renderiza thumbs;
// contador "300+ modelos". Loop na onda dos tiles.

export const GLYPH_DURATION = 240;

const MODELS = [
  { name: "Flux", grad: "linear-gradient(135deg,#D97757,#EBA98B)" },
  { name: "SDXL", grad: "linear-gradient(135deg,#BE5F3C,#D97757)" },
  { name: "Ideogram", grad: "linear-gradient(135deg,#C58BF2,#EBA98B)" },
  { name: "Recraft", grad: "linear-gradient(135deg,#5EC8D8,#7C9CF4)" },
  { name: "Kling", grad: "linear-gradient(135deg,#7C9CF4,#C58BF2)" },
  { name: "Luma", grad: "linear-gradient(135deg,#EBA98B,#FBE7D8)" },
  { name: "Runway", grad: "linear-gradient(135deg,#D97757,#BE5F3C)" },
  { name: "Veo", grad: "linear-gradient(135deg,#5EC8D8,#4ade80)" },
];

const WAVE_START = 52;

const Tile: React.FC<{ model: (typeof MODELS)[number]; index: number }> = ({
  model,
  index,
}) => {
  const frame = useCurrentFrame();
  const at = WAVE_START + index * 9;
  const enter = interpolate(frame, [at, at + 12], [0, 1], CLAMP);
  const render = interpolate(frame, [at + 6, at + 24], [0, 1], CLAMP);
  const shimmer = interpolate(frame, [at + 4, at + 16], [-120, 220], CLAMP);
  return (
    <div
      style={{
        height: 150,
        borderRadius: 16,
        background: COLORS.card,
        border: `1px solid ${render > 0.6 ? COLORS.strokeActive : COLORS.stroke}`,
        overflow: "hidden",
        position: "relative",
        opacity: frame < at ? 0 : interpolate(enter, [0, 0.5], [0, 1], CLAMP),
        transform: `translateY(${(1 - enter) * 30}px) scale(${0.9 + 0.1 * enter})`,
      }}
    >
      {/* Thumbnail gerado. */}
      <div style={{ position: "absolute", inset: 0, background: model.grad, opacity: render * 0.9 }} />
      {/* Shimmer de geração. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: shimmer,
          width: 70,
          background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)",
          opacity: render < 1 ? 1 : 0,
        }}
      />
      {/* Nome do modelo. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: "10px 14px",
          background: "linear-gradient(180deg,transparent,rgba(14,11,9,0.85))",
          fontFamily: mono,
          fontWeight: 500,
          fontSize: 24,
          color: COLORS.text,
        }}
      >
        {model.name}
      </div>
    </div>
  );
};

export const Scene05Glyph: React.FC = () => {
  const frame = useCurrentFrame();
  const count = Math.round(interpolate(frame, [30, 120], [0, 300], CLAMP));

  return (
    <McpScaffold
      index={4}
      name="Glyph"
      tagline="Centenas de modelos de imagem e vídeo."
    >
      <div style={{ position: "relative", left: 100, width: 880 }}>
        {/* Prompt escrito pelo próprio Claude + contador. */}
        <div style={{ display: "flex", gap: 20, alignItems: "stretch" }}>
          <div
            style={{
              flex: 1,
              height: 64,
              borderRadius: 14,
              background: COLORS.term,
              border: `1px solid ${COLORS.stroke}`,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              fontFamily: mono,
              fontSize: 27,
              whiteSpace: "pre",
            }}
          >
            <span style={{ color: COLORS.coral }}>{"> "}</span>
            <span style={{ color: COLORS.text }}>{typed("cria um criativo pro post", frame, 8)}</span>
            {frame < 46 ? <Cursor /> : null}
          </div>
          <div
            style={{
              width: 250,
              borderRadius: 14,
              background: COLORS.cardActive,
              border: `1px solid ${COLORS.strokeActive}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 40,
                color: COLORS.coral,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {count}+
            </span>
            <span style={{ fontFamily: inter, fontWeight: 600, fontSize: 20, color: COLORS.muted }}>
              modelos
            </span>
          </div>
        </div>

        {/* Grid de modelos. */}
        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {MODELS.map((m, i) => (
            <Tile key={m.name} model={m} index={i} />
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            textAlign: "center",
            fontFamily: inter,
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: 28,
            color: COLORS.muted,
            opacity: interpolate(frame, [150, 166], [0, 1], CLAMP),
          }}
        >
          e ele mesmo escreve os prompts
        </div>
      </div>
    </McpScaffold>
  );
};
