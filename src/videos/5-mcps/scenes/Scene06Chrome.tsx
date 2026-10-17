import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { McpScaffold } from "../mcp";
import { SparkBurst } from "../SparkBurst";

// Cena 06 — Chrome (270f / 9s, split-safe, cinematic + motion-graphics).
// PAYOFF do hook: janela do Chrome, scan-line coral "lê" cada aba; spark do
// Claude vê; selo callback "★ O PROMETIDO". Loop no ciclo da scan-line.

export const CHROME_DURATION = 270;

const TABS = [
  { label: "Docs", color: "#4285F4" },
  { label: "Figma", color: "#A259FF" },
  { label: "Gmail", color: "#EA4335" },
  { label: "GitHub", color: "#F4ECE0" },
];

const CYCLE = 96;
const WIN_W = 880;
const SCAN_TRAVEL = WIN_W - 40;

export const Scene06Chrome: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanX = 20 + ((frame % CYCLE) / CYCLE) * SCAN_TRAVEL;
  const seal = spring({ frame: frame - 26, fps, config: { damping: 11, stiffness: 150 } });
  const capO = interpolate(frame, [130, 148], [0, 1], CLAMP);

  // Cada aba é "lida" em cascata e fica marcada.
  const readAt = (i: number) => 48 + i * 18;

  return (
    <McpScaffold
      index={5}
      name="Chrome"
      tagline={
        <>
          Lê o que está aberto nas suas <span style={{ color: COLORS.coralLight }}>abas</span>.
        </>
      }
    >
      <div style={{ position: "relative", left: 100, width: WIN_W }}>
        {/* SparkBurst do Claude — o "olhar" que vê tudo. */}
        <div style={{ position: "absolute", left: WIN_W / 2, top: 210, opacity: 0.5 }}>
          <SparkBurst size={620} idPrefix="chrome" impactAt={26} baseEnergy={0.75} />
        </div>

        {/* Selo callback do hook. */}
        <div
          style={{
            position: "absolute",
            right: -6,
            top: -50,
            zIndex: 5,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 22px",
            borderRadius: 999,
            background: COLORS.coral,
            border: `2px solid ${COLORS.coralLight}`,
            boxShadow: "0 0 40px rgba(217,119,87,0.6)",
            opacity: frame < 26 ? 0 : 1,
            transform: `rotate(${8 - 6 * seal}deg) scale(${0.6 + 0.4 * seal})`,
          }}
        >
          <span style={{ fontSize: 26, color: COLORS.bg }}>★</span>
          <span
            style={{
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 2,
              color: COLORS.bg,
            }}
          >
            O PROMETIDO
          </span>
        </div>

        {/* Janela do Chrome. */}
        <div
          style={{
            position: "relative",
            width: WIN_W,
            borderRadius: 22,
            background: COLORS.bgLift,
            border: `1px solid ${COLORS.stroke}`,
            boxShadow: "0 34px 80px rgba(0,0,0,0.55)",
            overflow: "hidden",
          }}
        >
          {/* Tab strip. */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "12px 14px 0",
              background: COLORS.termChrome,
            }}
          >
            {TABS.map((t, i) => {
              const read = frame >= readAt(i);
              const near = Math.abs(scanX - (30 + i * 214 + 100)) < 60;
              return (
                <div
                  key={t.label}
                  style={{
                    flex: 1,
                    height: 54,
                    borderRadius: "12px 12px 0 0",
                    background: i === 0 ? COLORS.bgLift : COLORS.card,
                    border: `1px solid ${read ? COLORS.strokeActive : COLORS.stroke}`,
                    borderBottom: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "0 16px",
                    boxShadow:
                      read && near ? "inset 0 0 22px rgba(217,119,87,0.45)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: t.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 24,
                      color: read ? COLORS.text : COLORS.muted,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {t.label}
                  </span>
                  {read ? (
                    <span style={{ marginLeft: "auto", color: COLORS.coral, fontSize: 22 }}>✓</span>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* URL bar. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 18px",
              background: COLORS.term,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 38,
                borderRadius: 999,
                background: COLORS.bgLift,
                border: `1px solid ${COLORS.stroke}`,
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                fontFamily: mono,
                fontSize: 22,
                color: COLORS.muted,
              }}
            >
              docs.google.com/tudo-que-voce-tem-aberto
            </div>
          </div>

          {/* Corpo com scan-line lendo. */}
          <div style={{ position: "relative", height: 168, padding: "22px 24px", overflow: "hidden" }}>
            {[0.82, 0.62, 0.7, 0.44].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 16,
                  width: `${w * 100}%`,
                  borderRadius: 8,
                  background: COLORS.card,
                  marginBottom: 18,
                }}
              />
            ))}
            {/* Scan-line coral. */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: scanX,
                width: 4,
                background: COLORS.coral,
                boxShadow: "0 0 26px 6px rgba(217,119,87,0.8)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: scanX - 120,
                width: 120,
                background: "linear-gradient(90deg,transparent,rgba(217,119,87,0.16))",
              }}
            />
          </div>
        </div>

        {/* Caption payoff. */}
        <div
          style={{
            marginTop: 26,
            textAlign: "center",
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 40,
            color: COLORS.text,
            opacity: capO,
          }}
        >
          vê o que <span style={{ color: COLORS.coral }}>VOCÊ vê</span> · trabalha junto
        </div>
      </div>
    </McpScaffold>
  );
};
