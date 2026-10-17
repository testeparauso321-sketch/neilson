import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { PluginStage, Punch } from "../plugin";

// Cena 06 — Superpowers (330f / 11s, split-safe, motion-graphics).
// PROBLEMA: ele quer codar antes de pensar → o atalho "direto pro código" bate
// numa barreira coral (bloqueado) → o trilho correto acende em ordem:
// PLANO ✓ → TESTE (vermelho→verde) → CÓDIGO ✓ → faixa de fosso + punch.

export const SUPERPOWERS_DURATION = 330;

const BLOCK = 80; // frame em que o atalho bate na barreira
const NODE_AT = [130, 175, 220];

const Node: React.FC<{
  at: number;
  index: number;
  title: string;
  left: number;
  children: React.ReactNode;
}> = ({ at, index, title, left, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 17, stiffness: 180 } });
  const live = frame >= at;
  const glow = 0.5 + 0.5 * Math.sin((frame - at) / 11);
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left,
        width: 280,
        height: 200,
        borderRadius: 24,
        background: live ? COLORS.cardActive : COLORS.card,
        border: `1px solid ${live ? COLORS.strokeActive : COLORS.stroke}`,
        boxShadow: live
          ? `0 0 ${18 + 26 * glow}px rgba(217,119,87,0.35)`
          : "0 18px 40px rgba(0,0,0,0.4)",
        padding: "20px 22px",
        opacity: live ? 1 : 0.42,
        transform: `scale(${live ? 0.94 + 0.06 * s : 0.94})`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: live ? COLORS.coral : COLORS.bgLift,
            border: `1px solid ${live ? COLORS.coralLight : COLORS.stroke}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 20,
            color: live ? COLORS.bg : COLORS.muted,
          }}
        >
          {index}
        </span>
        <span
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 3,
            color: live ? COLORS.text : COLORS.muted,
          }}
        >
          {title}
        </span>
      </div>
      <div style={{ marginTop: 18 }}>{children}</div>
    </div>
  );
};

export const Scene06Superpowers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Atalho: a seta cresce, bate na barreira e recua.
  const dash = interpolate(frame, [12, BLOCK], [0, 1], CLAMP);
  const retract = interpolate(frame, [104, 122], [1, 0], CLAMP);
  const hit = interpolate(frame, [BLOCK, BLOCK + 3, BLOCK + 22], [0, 1, 0], CLAMP);
  const blocked = interpolate(frame, [BLOCK + 2, BLOCK + 12], [0, 1], CLAMP);
  const blockedOut = interpolate(frame, [128, 142], [1, 0], CLAMP);

  // Conteúdo dos nós.
  const ticks = [0, 1, 2].map((i) =>
    interpolate(frame, [NODE_AT[0] + 12 + i * 12, NODE_AT[0] + 22 + i * 12], [0, 1], CLAMP),
  );
  const testBar = interpolate(frame, [NODE_AT[1] + 10, NODE_AT[1] + 34], [0, 1], CLAMP);
  const testPass = frame >= NODE_AT[1] + 30;
  const codeOk = spring({
    frame: frame - (NODE_AT[2] + 14),
    fps,
    config: { damping: 13, stiffness: 170 },
  });

  const moat = spring({ frame: frame - 250, fps, config: { damping: 18, stiffness: 170 } });
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <PluginStage
      index={5}
      name="Superpowers"
      problem={
        <>
          Ele quer{" "}
          <span style={{ color: COLORS.text, fontWeight: 800 }}>codar antes de pensar</span>
          .
        </>
      }
    >
      {/* Atalho bloqueado. */}
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 100,
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "12px 22px",
          borderRadius: 14,
          background: COLORS.term,
          border: `1px solid ${COLORS.stroke}`,
          fontFamily: mono,
          fontSize: 25,
          color: COLORS.text,
          opacity: interpolate(frame, [0, 10], [0, 1], CLAMP) * retract,
        }}
      >
        <span style={{ color: COLORS.coralLight }}>❯</span> direto pro código
      </div>

      <svg
        width={1080}
        height={110}
        viewBox="0 0 1080 110"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <line
          x1={420}
          y1={34}
          x2={648}
          y2={34}
          stroke={COLORS.coralLight}
          strokeWidth={4}
          strokeDasharray="228"
          strokeDashoffset={228 * (1 - dash * retract)}
          opacity={0.85 * retract}
        />
        {/* Barreira. */}
        <rect
          x={656 - 5 * hit}
          y={4}
          width={12}
          height={62}
          rx={6}
          fill={COLORS.coral}
          opacity={0.55 + 0.45 * Math.max(hit, glow * 0.4)}
        />
      </svg>

      {/* Selo "bloqueado". */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 700,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 22px",
          borderRadius: 999,
          background: "rgba(217,119,87,0.16)",
          border: `1px solid ${COLORS.strokeActive}`,
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 2,
          color: COLORS.coralLight,
          opacity: blocked * blockedOut,
          transform: `translateX(${Math.sin(frame * 3.1) * 7 * hit}px) scale(${
            0.86 + 0.14 * blocked
          })`,
        }}
      >
        ✗ BLOQUEADO
      </div>

      {/* Trilho correto: PLANO → TESTE → CÓDIGO. */}
      <svg
        width={1080}
        height={320}
        viewBox="0 0 1080 320"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {[0, 1].map((i) => {
          const x1 = 380 + i * 300;
          const on = interpolate(
            frame,
            [NODE_AT[i] + 24, NODE_AT[i + 1]],
            [0, 1],
            CLAMP,
          );
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={220}
                x2={x1 + 20}
                y2={220}
                stroke={COLORS.coral}
                strokeWidth={6}
                strokeDasharray="5 6"
                strokeDashoffset={-frame * 1.2}
                opacity={0.3 + 0.7 * on}
              />
            </g>
          );
        })}
      </svg>

      <Node at={NODE_AT[0]} index={1} title="PLANO" left={100}>
        {["objetivo", "riscos", "passos"].map((t, i) => (
          <div
            key={t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
              opacity: 0.25 + 0.75 * ticks[i],
              transform: `translateX(${(1 - ticks[i]) * -14}px)`,
            }}
          >
            <span style={{ fontFamily: inter, fontWeight: 800, fontSize: 24, color: COLORS.green }}>
              ✓
            </span>
            <span style={{ fontFamily: mono, fontSize: 24, color: COLORS.text }}>{t}</span>
          </div>
        ))}
      </Node>

      <Node at={NODE_AT[1]} index={2} title="TESTE" left={400}>
        <div
          style={{
            height: 16,
            borderRadius: 8,
            background: "rgba(244,236,224,0.12)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${testBar * 100}%`,
              height: "100%",
              background: testPass ? COLORS.green : COLORS.coral,
              boxShadow: testPass ? "0 0 18px rgba(74,222,128,0.6)" : "none",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: mono,
            fontSize: 26,
            color: testPass ? COLORS.green : COLORS.muted,
          }}
        >
          {testPass ? "3/3 passou ✓" : "rodando…"}
        </div>
      </Node>

      <Node at={NODE_AT[2]} index={3} title="CÓDIGO" left={700}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[190, 150, 210].map((w, i) => {
            const fill = interpolate(
              frame,
              [NODE_AT[2] + 6 + i * 8, NODE_AT[2] + 18 + i * 8],
              [0, 1],
              CLAMP,
            );
            return (
              <div
                key={w}
                style={{
                  width: w * fill,
                  height: 12,
                  borderRadius: 6,
                  background: i === 1 ? "rgba(74,222,128,0.6)" : "rgba(244,236,224,0.3)",
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 26,
            color: COLORS.green,
            opacity: interpolate(codeOk, [0, 0.4], [0, 1], CLAMP),
            transform: `scale(${0.8 + 0.2 * codeOk})`,
            transformOrigin: "left center",
          }}
        >
          ✓ entregue
        </div>
      </Node>

      {/* Faixa de fosso — o item que ninguém copia. Ocupa a linha do atalho
          depois que o "bloqueado" sai: a tensão vira credibilidade. */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          width: 1080,
          textAlign: "center",
          opacity: interpolate(moat, [0, 0.4], [0, 1], CLAMP),
          transform: `translateY(${(1 - moat) * 22}px)`,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 26px",
            borderRadius: 999,
            background: COLORS.card,
            border: `1px solid ${COLORS.stroke}`,
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 28,
            color: COLORS.muted,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: COLORS.coral,
              boxShadow: `0 0 ${8 + 12 * glow}px rgba(217,119,87,0.9)`,
            }}
          />
          uso nos sistemas que entrego pra cliente
        </span>
      </div>

      <Punch at={276}>IGUAL DEV SÊNIOR</Punch>
    </PluginStage>
  );
};
