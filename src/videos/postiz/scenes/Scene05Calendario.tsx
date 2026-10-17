import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, NETWORK } from "../theme";
import { Stage } from "../stage";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 05 — Calendário multi-rede (300f / 10s, split-safe, loopável).
// Hub "1 CALENDÁRIO" distribui posts para Insta/TikTok/YouTube/LinkedIn em
// ciclo; n8n conecta por linha tracejada animada. Distribuição loopa.

export const CALENDARIO_DURATION = 300;

const NODES = [
  { net: "instagram", label: "Instagram", cx: 165 },
  { net: "tiktok", label: "TikTok", cx: 415 },
  { net: "youtube", label: "YouTube", cx: 665 },
  { net: "linkedin", label: "LinkedIn", cx: 915 },
] as const;

const HUB = { x: 540, y: 388 };
const NODE_TOP = 500;
const PERIOD = 66;

export const Scene05Calendario: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hub = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 170 } });
  const hubPulse = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <Stage eyebrow="UM SÓ LUGAR">
      {/* Camada SVG: linhas + posts viajando. */}
      <svg
        width={1080}
        height={1000}
        viewBox="0 0 1080 1000"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {NODES.map((n, i) => {
          const nx = n.cx;
          const ny = NODE_TOP;
          const phase = (frame + i * 16) % PERIOD;
          const t = phase / PERIOD;
          const dx = interpolate(t, [0, 1], [HUB.x, nx]);
          const dy = interpolate(t, [0, 1], [HUB.y, ny]);
          const appear = interpolate(frame, [16 + i * 4, 34 + i * 4], [0, 1], CLAMP);
          return (
            <g key={n.net} opacity={appear}>
              <line
                x1={HUB.x}
                y1={HUB.y}
                x2={nx}
                y2={ny}
                stroke={COLORS.strokeActive}
                strokeWidth={2}
                strokeDasharray="3 12"
              />
              <circle
                cx={dx}
                cy={dy}
                r={9}
                fill={COLORS.coral}
                opacity={interpolate(t, [0, 0.1, 0.9, 1], [0, 1, 1, 0], CLAMP)}
              />
              <circle
                cx={dx}
                cy={dy}
                r={18}
                fill="none"
                stroke={COLORS.coral}
                strokeWidth={1.5}
                opacity={interpolate(t, [0, 0.1, 0.9, 1], [0, 0.4, 0.4, 0], CLAMP)}
              />
            </g>
          );
        })}
        {/* Linha tracejada animada até o n8n. */}
        <line
          x1={HUB.x}
          y1={NODE_TOP + 190}
          x2={HUB.x}
          y2={742}
          stroke={NETWORK.n8n}
          strokeWidth={2.5}
          strokeDasharray="8 10"
          strokeDashoffset={-frame * 1.4}
          opacity={interpolate(frame, [60, 80], [0, 0.9], CLAMP)}
        />
      </svg>

      {/* Hub central "1 CALENDÁRIO". */}
      <div
        style={{
          position: "absolute",
          top: HUB.y - 108,
          left: 340,
          width: 400,
          height: 150,
          borderRadius: 26,
          background: COLORS.cardActive,
          border: `1px solid ${COLORS.strokeActive}`,
          boxShadow: `0 0 ${40 + 34 * hubPulse}px rgba(217,119,87,${(0.35 + 0.25 * hubPulse).toFixed(
            2,
          )})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: interpolate(hub, [0, 0.3], [0, 1], CLAMP),
          transform: `translateY(${(1 - hub) * -30}px) scale(${0.9 + 0.1 * hub})`,
        }}
      >
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 66, color: COLORS.coral, lineHeight: 1 }}>
          1
        </div>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 4,
            color: COLORS.text,
            marginTop: 4,
          }}
        >
          CALENDÁRIO
        </div>
      </div>

      {/* Nós das redes. */}
      {NODES.map((n, i) => {
        const appear = spring({
          frame: frame - (18 + i * 5),
          fps,
          config: { damping: 15, stiffness: 190 },
        });
        const phase = (frame + i * 16) % PERIOD;
        const receiving = phase > PERIOD - 12;
        const pop = receiving ? 1 + 0.06 * Math.sin(frame / 3) : 1;
        const accent = NETWORK[n.net];
        return (
          <div
            key={n.net}
            style={{
              position: "absolute",
              top: NODE_TOP,
              left: n.cx - 82,
              width: 164,
              height: 184,
              borderRadius: 26,
              background: COLORS.card,
              border: `1px solid ${receiving ? accent : COLORS.stroke}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              boxShadow: `0 0 ${receiving ? 40 : 20}px ${accent}${receiving ? "88" : "33"}`,
              opacity: frame < 18 + i * 5 ? 0 : interpolate(appear, [0, 0.4], [0, 1], CLAMP),
              transform: `translateY(${(1 - appear) * 40}px) scale(${(0.7 + 0.3 * appear) * pop})`,
            }}
          >
            <div style={{ position: "relative" }}>
              <BrandLogo name={n.net} size={70} color={COLORS.text} />
              {receiving ? (
                <span
                  style={{
                    position: "absolute",
                    right: -18,
                    top: -14,
                    fontSize: 30,
                    color: COLORS.green,
                    fontWeight: 800,
                  }}
                >
                  ✓
                </span>
              ) : null}
            </div>
            <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 24, color: COLORS.muted }}>
              {n.label}
            </div>
          </div>
        );
      })}

      {/* n8n — pluga direto. */}
      <div
        style={{
          position: "absolute",
          top: 748,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [70, 90], [0, 1], CLAMP),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "16px 28px",
            borderRadius: 999,
            background: COLORS.card,
            border: `1px solid ${NETWORK.n8n}66`,
          }}
        >
          <BrandLogo name="n8n" size={44} color={NETWORK.n8n} />
          <span style={{ fontFamily: inter, fontWeight: 700, fontSize: 34, color: COLORS.text }}>
            e o n8n{" "}
            <span style={{ color: COLORS.coralLight }}>pluga direto</span>
          </span>
        </div>
      </div>
    </Stage>
  );
};
