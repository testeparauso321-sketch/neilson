import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { McpScaffold } from "../mcp";

// Cena 02 — Perplexity (240f / 8s, split-safe, motion-graphics + terminal).
// "treinamento até 2024" riscado → "● AO VIVO"; feed tickando preço/concorrente/
// notícia "de hoje" com chip AGORA. Loop no pulso do dot AO VIVO.

export const PERPLEXITY_DURATION = 240;

const ROWS: { icon: string; label: string; hot: string }[] = [
  { icon: "$", label: "preço", hot: "de hoje" },
  { icon: "vs", label: "concorrente", hot: "de hoje" },
  { icon: "◆", label: "notícia", hot: "de hoje" },
];

const LiveRow: React.FC<{ row: (typeof ROWS)[number]; at: number }> = ({ row, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 20, stiffness: 180 } });
  const shimmer = 0.5 + 0.5 * Math.sin((frame - at) / 8);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 22,
        height: 78,
        padding: "0 22px",
        borderRadius: 16,
        background: COLORS.cardActive,
        border: `1px solid ${COLORS.stroke}`,
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `translateX(${(1 - s) * -50}px)`,
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 14,
          background: COLORS.card,
          border: `1px solid ${COLORS.strokeActive}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 26,
          color: COLORS.coral,
          flexShrink: 0,
        }}
      >
        {row.icon}
      </div>
      <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 38, color: COLORS.text }}>
        {row.label}{" "}
        <span style={{ color: COLORS.coralLight }}>{row.hot}</span>
      </div>
      <div
        style={{
          marginLeft: "auto",
          padding: "8px 16px",
          borderRadius: 999,
          background: `rgba(74,222,128,${(0.14 + 0.12 * shimmer).toFixed(2)})`,
          border: "1px solid rgba(74,222,128,0.5)",
          fontFamily: mono,
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: 2,
          color: COLORS.green,
        }}
      >
        AGORA
      </div>
    </div>
  );
};

export const Scene02Perplexity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = spring({ frame: frame - 8, fps, config: { damping: 24, stiffness: 140 } });
  const strike = interpolate(frame, [26, 44], [0, 1], CLAMP);
  const oldFade = interpolate(frame, [44, 58], [1, 0.28], CLAMP);
  const liveIn = interpolate(frame, [50, 62], [0, 1], CLAMP);
  const dot = 0.45 + 0.55 * Math.sin(frame / 6);
  const ringRot = frame * 0.5;

  return (
    <McpScaffold
      index={1}
      name="Perplexity"
      tagline="Internet em tempo real pro Claude."
    >
      <div style={{ position: "relative", left: 100, width: 880 }}>
        {/* Anel orbital ambiente. */}
        <svg
          width={520}
          height={520}
          viewBox="0 0 520 520"
          style={{ position: "absolute", right: -70, top: -40, opacity: 0.5 }}
        >
          <circle
            cx={260}
            cy={260}
            r={210}
            fill="none"
            stroke={COLORS.strokeActive}
            strokeWidth={2}
            strokeDasharray="4 26"
            transform={`rotate(${ringRot} 260 260)`}
          />
        </svg>

        <div
          style={{
            position: "relative",
            width: 880,
            borderRadius: 26,
            background: COLORS.bgLift,
            border: `1px solid ${COLORS.stroke}`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
            padding: 36,
            opacity: interpolate(card, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - card) * 70}px) scale(${0.95 + 0.05 * card})`,
          }}
        >
          {/* Header: cutoff riscado → AO VIVO. */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 26 }}>
            <div style={{ position: "relative", opacity: oldFade }}>
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 30,
                  color: COLORS.muted,
                  whiteSpace: "nowrap",
                }}
              >
                treinamento até 2024
              </span>
              <div
                style={{
                  position: "absolute",
                  left: -6,
                  right: -6,
                  top: "52%",
                  height: 6,
                  borderRadius: 4,
                  background: COLORS.coral,
                  boxShadow: "0 0 18px rgba(217,119,87,0.7)",
                  transform: `scaleX(${strike})`,
                  transformOrigin: "left center",
                }}
              />
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 22px",
                borderRadius: 999,
                background: "rgba(74,222,128,0.12)",
                border: "1px solid rgba(74,222,128,0.55)",
                opacity: liveIn,
                transform: `scale(${0.8 + 0.2 * liveIn})`,
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: COLORS.green,
                  boxShadow: `0 0 ${8 + 14 * dot}px rgba(74,222,128,${(0.5 + 0.5 * dot).toFixed(
                    2,
                  )})`,
                }}
              />
              <span
                style={{
                  fontFamily: inter,
                  fontWeight: 800,
                  fontSize: 28,
                  letterSpacing: 3,
                  color: COLORS.green,
                }}
              >
                AO VIVO
              </span>
            </div>
          </div>

          {/* Feed. */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <LiveRow row={ROWS[0]} at={64} />
            <LiveRow row={ROWS[1]} at={88} />
            <LiveRow row={ROWS[2]} at={112} />
          </div>
        </div>
      </div>
    </McpScaffold>
  );
};
