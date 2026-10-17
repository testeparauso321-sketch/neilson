import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, mono } from "./theme";
import { Drift } from "./rig";

// Scaffold comum dos 5 cards de MCP (lista): trilho de progresso 1→5, badge de
// índice coral, nome em mono e a "unlock line". Cada cena injeta seu mini-demo
// em children. Mantém a família visual coesa e reforça o "salva pra depois".

// Trilho de progresso: 5 pílulas, as <=active acesas, a atual pulsa.
export const ProgressRail: React.FC<{ active: number }> = ({ active }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 0,
        width: 1080,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i + 1 <= active;
        const isCur = i + 1 === active;
        const pulse = isCur ? 1 + 0.06 * Math.sin(frame / 7) : 1;
        return (
          <div
            key={i}
            style={{
              width: isCur ? 58 : 34,
              height: 14,
              borderRadius: 999,
              background: on ? COLORS.coral : COLORS.card,
              border: `1px solid ${on ? COLORS.coralLight : COLORS.stroke}`,
              boxShadow: isCur ? "0 0 22px rgba(217,119,87,0.8)" : "none",
              transform: `scale(${pulse})`,
            }}
          />
        );
      })}
      <div
        style={{
          marginLeft: 16,
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: 3,
          color: COLORS.muted,
        }}
      >
        {active}/5
      </div>
    </div>
  );
};

export const McpScaffold: React.FC<{
  index: number;
  name: string;
  tagline: React.ReactNode;
  children: React.ReactNode;
}> = ({ index, name, tagline, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge = spring({
    frame: frame - 4,
    fps,
    config: { damping: 14, stiffness: 190 },
  });
  const nameO = interpolate(frame, [10, 22], [0, 1], CLAMP);
  const nameX = interpolate(frame, [10, 24], [-34, 0], CLAMP);
  const tagO = interpolate(frame, [22, 34], [0, 1], CLAMP);
  const tagX = interpolate(frame, [22, 36], [-22, 0], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Grade de pontos ambiente com paralaxe lenta (nunca estático). */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,236,224,0.05) 2px, transparent 2px)",
          backgroundSize: "76px 76px",
          backgroundPosition: `${-frame * 0.2}px ${-frame * 0.12}px`,
        }}
      />
      <Drift>
        <ProgressRail active={index} />

        {/* Header: badge de índice + nome. */}
        <div
          style={{
            position: "absolute",
            top: 176,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <div
            style={{
              width: 128,
              height: 128,
              borderRadius: 30,
              background: COLORS.coral,
              border: `1px solid ${COLORS.coralLight}`,
              boxShadow: "0 0 46px rgba(217,119,87,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transform: `scale(${0.55 + 0.45 * badge}) rotate(${(1 - badge) * -14}deg)`,
            }}
          >
            <span
              style={{
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 66,
                color: COLORS.bg,
                letterSpacing: -2,
              }}
            >
              {String(index).padStart(2, "0")}
            </span>
          </div>
          <div style={{ opacity: nameO, transform: `translateX(${nameX}px)` }}>
            <div
              style={{
                fontFamily: inter,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: 8,
                color: COLORS.coralLight,
                marginBottom: 4,
              }}
            >
              MCP
            </div>
            <div
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 68,
                color: COLORS.text,
                lineHeight: 1,
              }}
            >
              {name}
            </div>
          </div>
        </div>

        {/* Unlock line. */}
        <div
          style={{
            position: "absolute",
            top: 356,
            left: 82,
            right: 82,
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 42,
            lineHeight: 1.18,
            color: COLORS.text,
            opacity: tagO,
            transform: `translateX(${tagX}px)`,
          }}
        >
          {tagline}
        </div>

        {/* Área do mini-demo. */}
        <div style={{ position: "absolute", top: 476, left: 0, width: 1080 }}>
          {children}
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
