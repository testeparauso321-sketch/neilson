import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter, mono } from "../theme";
import { Stage } from "../stage";
import { typed } from "../terminal";

// Cena 06 — Payoff (210f / 7s, split-safe, motion-graphics + terminal).
// "DE GRAÇA · SEM LIMITE" gigante; selos OPEN SOURCE / SELF-HOSTED / SEM LIMITE;
// mini-terminal `npx postiz` com pulso verde "rodando de verdade".

export const PAYOFF_DURATION = 210;

const BADGES = ["OPEN SOURCE", "SELF-HOSTED", "∞ SEM LIMITE"];

const Badge: React.FC<{ at: number; label: string }> = ({ at, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 16, stiffness: 190 } });
  return (
    <div
      style={{
        padding: "16px 26px",
        borderRadius: 999,
        background: COLORS.card,
        border: `1px solid ${COLORS.strokeActive}`,
        fontFamily: inter,
        fontWeight: 800,
        fontSize: 30,
        letterSpacing: 2,
        color: COLORS.coralLight,
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 40}px) scale(${0.8 + 0.2 * s})`,
      }}
    >
      {label}
    </div>
  );
};

export const Scene06Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const free = spring({ frame: frame - 14, fps, config: { damping: 13, stiffness: 150, mass: 1.2 } });
  const limit = spring({ frame: frame - 40, fps, config: { damping: 16, stiffness: 170 } });
  const glow = 0.5 + 0.5 * Math.sin(frame / 9);
  const term = spring({ frame: frame - 84, fps, config: { damping: 22, stiffness: 150 } });
  const dot = 0.45 + 0.55 * Math.sin(frame / 6);

  return (
    <Stage eyebrow="O MELHOR">
      <div
        style={{
          position: "absolute",
          top: 236,
          left: 0,
          width: 1080,
          textAlign: "center",
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 3,
          color: COLORS.muted,
          opacity: interpolate(frame, [4, 18], [0, 1], CLAMP),
        }}
      >
        A VERSÃO QUE RODA NO SEU PC
      </div>

      {/* DE GRAÇA. */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          width: 1080,
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontFamily: fraunces,
            fontWeight: 700,
            fontSize: 190,
            lineHeight: 1,
            color: COLORS.coral,
            letterSpacing: -4,
            opacity: frame < 14 ? 0 : interpolate(free, [0, 0.3], [0, 1], CLAMP),
            transform: `scale(${0.6 + 0.4 * free}) rotate(${Math.sin(frame / 30) * 1.2}deg)`,
            textShadow: `0 0 ${60 + 60 * glow}px rgba(217,119,87,${(0.45 + 0.35 * glow).toFixed(2)})`,
          }}
        >
          DE GRAÇA
        </span>
      </div>

      {/* E SEM LIMITE. */}
      <div
        style={{
          position: "absolute",
          top: 500,
          left: 0,
          width: 1080,
          textAlign: "center",
          opacity: frame < 40 ? 0 : interpolate(limit, [0, 0.4], [0, 1], CLAMP),
          transform: `translateY(${(1 - limit) * 30}px)`,
        }}
      >
        <span
          style={{
            fontFamily: fraunces,
            fontWeight: 700,
            fontSize: 88,
            color: COLORS.text,
            letterSpacing: -1,
          }}
        >
          e sem limite
        </span>
      </div>

      {/* Selos. */}
      <div
        style={{
          position: "absolute",
          top: 636,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 18,
        }}
      >
        {BADGES.map((b, i) => (
          <Badge key={b} at={54 + i * 10} label={b} />
        ))}
      </div>

      {/* Mini-terminal "rodando de verdade". */}
      <div
        style={{
          position: "absolute",
          top: 736,
          left: 190,
          width: 700,
          borderRadius: 18,
          background: COLORS.term,
          border: `1px solid ${COLORS.stroke}`,
          boxShadow: "0 22px 50px rgba(0,0,0,0.5)",
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: interpolate(term, [0, 0.4], [0, 1], CLAMP),
          transform: `translateY(${(1 - term) * 40}px)`,
        }}
      >
        <span
          style={{
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: COLORS.green,
            boxShadow: `0 0 ${8 + 14 * dot}px rgba(74,222,128,${(0.5 + 0.5 * dot).toFixed(2)})`,
            flexShrink: 0,
          }}
        />
        <span style={{ fontFamily: mono, fontSize: 34, color: COLORS.text }}>
          <span style={{ color: COLORS.coralLight }}>❯ </span>
          {typed("npx postiz", frame, 92, 1.2)}
          <span style={{ color: COLORS.muted }}>
            {frame > 108 ? "  · rodando" : ""}
          </span>
        </span>
      </div>
    </Stage>
  );
};
