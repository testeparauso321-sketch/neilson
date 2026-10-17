import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { Stage } from "../stage";
import { typed, Cursor, SPINNER } from "../terminal";

// Cena 04 — Fila (255f / 8,5s, split-safe, loopável, terminal + motion-graphics).
// Chat (você→Claude) gera posts que VOAM para a fila de publicação que enche.
// Selo "SEM ABRIR PAINEL". Ciclo gerar→enfileirar loopa (conveyor perpétuo).

export const FILA_DURATION = 255;

const CYCLE = 78;
const POSTS = [
  { day: "SEG", text: "dica de IA" },
  { day: "TER", text: "bastidor" },
  { day: "QUA", text: "tutorial" },
  { day: "QUI", text: "enquete" },
];

const slotY = (i: number) => 360 + i * 116;

export const Scene04Fila: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panels = spring({ frame: frame - 6, fps, config: { damping: 22, stiffness: 150 } });

  const cur = Math.floor(frame / CYCLE) % POSTS.length;
  const phase = frame % CYCLE;
  const filled = Math.min(POSTS.length, 1 + Math.floor(frame / CYCLE));

  // Card voando do chat até a fila.
  const flyT = interpolate(phase, [20, 56], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const flyVisible = phase >= 18 && phase <= 60;
  const flyX = interpolate(flyT, [0, 1], [430, 596]);
  const flyYEnd = slotY(cur);
  const flyY = interpolate(flyT, [0, 1], [522, flyYEnd]);
  const flyScale = interpolate(flyT, [0, 0.5, 1], [0.7, 1, 0.82]);

  const spin = SPINNER[frame % SPINNER.length];
  const stamp = spring({ frame: frame - 44, fps, config: { damping: 13, stiffness: 150 } });

  return (
    <Stage eyebrow="SEM PAINEL">
      {/* Painel de chat (esquerda). */}
      <div
        style={{
          position: "absolute",
          top: 236,
          left: 84,
          width: 428,
          height: 600,
          borderRadius: 26,
          background: COLORS.term,
          border: `1px solid ${COLORS.stroke}`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
          padding: 28,
          opacity: interpolate(panels, [0, 0.3], [0, 1], CLAMP),
          transform: `translateY(${(1 - panels) * 60}px)`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 3,
            color: COLORS.muted,
            marginBottom: 22,
          }}
        >
          VOCÊ → CLAUDE
        </div>
        <div style={{ fontFamily: mono, fontSize: 30, color: COLORS.text, lineHeight: 1.5 }}>
          <span style={{ color: COLORS.coralLight }}>❯ </span>
          {typed("monta minha semana", frame, 10, 1.4)}
          {frame < 40 ? <Cursor /> : null}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: mono,
            fontSize: 26,
            color: COLORS.green,
            opacity: interpolate(frame, [40, 52], [0, 1], CLAMP),
          }}
        >
          {spin} escrevendo {POSTS[cur].day.toLowerCase()}…
        </div>
        {/* Card sendo escrito. */}
        <div
          style={{
            marginTop: 22,
            padding: "18px 20px",
            borderRadius: 16,
            background: COLORS.cardActive,
            border: `1px solid ${COLORS.strokeActive}`,
            opacity: phase < 18 ? interpolate(phase, [2, 16], [0, 1], CLAMP) : interpolate(phase, [18, 24], [1, 0.15], CLAMP),
          }}
        >
          <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 26, color: COLORS.coralLight }}>
            {POSTS[cur].day}
          </div>
          <div style={{ fontFamily: inter, fontSize: 26, color: COLORS.text, marginTop: 4 }}>
            {POSTS[cur].text}
          </div>
        </div>
      </div>

      {/* Painel da fila (direita). */}
      <div
        style={{
          position: "absolute",
          top: 236,
          left: 568,
          width: 428,
          height: 600,
          borderRadius: 26,
          background: COLORS.bgLift,
          border: `1px solid ${COLORS.stroke}`,
          boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
          padding: 28,
          opacity: interpolate(panels, [0, 0.3], [0, 1], CLAMP),
          transform: `translateY(${(1 - panels) * 60}px)`,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 2,
            color: COLORS.text,
            marginBottom: 4,
          }}
        >
          FILA DA SEMANA
        </div>
        <div style={{ fontFamily: inter, fontSize: 22, color: COLORS.muted, marginBottom: 18 }}>
          publica sozinho
        </div>
      </div>

      {/* Slots da fila (fora do padding do painel, alinhados). */}
      {POSTS.map((p, i) => {
        const isFilled = i < filled;
        const isCur = i === cur && phase > 52;
        const pop = isCur ? 1 + 0.05 * Math.sin(frame / 4) : 1;
        return (
          <div
            key={p.day}
            style={{
              position: "absolute",
              top: slotY(i),
              left: 596,
              width: 372,
              height: 96,
              borderRadius: 16,
              background: isFilled ? COLORS.cardActive : COLORS.card,
              border: `1px solid ${isCur ? COLORS.strokeActive : COLORS.stroke}`,
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 20px",
              opacity: interpolate(panels, [0.2, 0.5], [0, 1], CLAMP),
              transform: `scale(${pop})`,
              boxShadow: isCur ? "0 0 26px rgba(217,119,87,0.5)" : "none",
            }}
          >
            <div
              style={{
                width: 66,
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 24,
                color: isFilled ? COLORS.coralLight : COLORS.muted,
              }}
            >
              {p.day}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  height: 12,
                  borderRadius: 6,
                  background: isFilled ? "rgba(217,119,87,0.55)" : "rgba(162,147,127,0.25)",
                  width: isFilled ? "85%" : "50%",
                }}
              />
              <div
                style={{
                  height: 12,
                  borderRadius: 6,
                  marginTop: 8,
                  background: isFilled ? "rgba(217,119,87,0.3)" : "rgba(162,147,127,0.16)",
                  width: isFilled ? "60%" : "35%",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 30,
                color: isFilled ? COLORS.green : COLORS.muted,
                opacity: isFilled ? 1 : 0.4,
              }}
            >
              {isFilled ? "✓" : "•"}
            </div>
          </div>
        );
      })}

      {/* Card voando chat → fila. */}
      {flyVisible ? (
        <div
          style={{
            position: "absolute",
            top: flyY,
            left: flyX,
            width: 210,
            padding: "14px 18px",
            borderRadius: 14,
            background: COLORS.card,
            border: `1px solid ${COLORS.strokeActive}`,
            boxShadow: "0 14px 34px rgba(0,0,0,0.5)",
            transform: `scale(${flyScale}) rotate(${(1 - flyT) * -8}deg)`,
            zIndex: 5,
          }}
        >
          <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 22, color: COLORS.coralLight }}>
            {POSTS[cur].day}
          </div>
          <div style={{ fontFamily: inter, fontSize: 22, color: COLORS.text }}>
            {POSTS[cur].text}
          </div>
        </div>
      ) : null}

      {/* Selo "SEM ABRIR PAINEL". */}
      <div
        style={{
          position: "absolute",
          top: 862,
          left: 0,
          width: 1080,
          textAlign: "center",
          opacity: interpolate(stamp, [0, 0.4], [0, 1], CLAMP),
          transform: `scale(${0.8 + 0.2 * stamp})`,
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "12px 30px",
            borderRadius: 999,
            background: "rgba(217,119,87,0.14)",
            border: `1px solid ${COLORS.strokeActive}`,
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 32,
            letterSpacing: 2,
            color: COLORS.coralLight,
          }}
        >
          SEM ABRIR PAINEL · 0 CLIQUES
        </span>
      </div>
    </Stage>
  );
};
