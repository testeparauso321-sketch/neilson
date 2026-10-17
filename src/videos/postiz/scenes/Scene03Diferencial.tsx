import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter, mono } from "../theme";
import { Stage } from "../stage";
import { typed, Cursor } from "../terminal";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 03 — Diferencial (165f / 5,5s, split-safe, motion-graphics).
// "TEM VÁRIAS, tipo Buffer" (painel morto) → pivô "MAS" → aqui você CONVERSA
// com o Claude (logo coral + balão digitando). Não loopa (pivô de estado).

export const DIFERENCIAL_DURATION = 165;

export const Scene03Diferencial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const old = spring({ frame: frame - 6, fps, config: { damping: 22, stiffness: 160 } });
  const oldFade = interpolate(frame, [40, 58], [1, 0.34], CLAMP);
  const mas = spring({ frame: frame - 36, fps, config: { damping: 11, stiffness: 150, mass: 1.2 } });
  const masLine = interpolate(frame, [44, 60], [0, 1], CLAMP);
  const claudeIn = spring({ frame: frame - 58, fps, config: { damping: 14, stiffness: 180 } });
  const bubble = spring({ frame: frame - 70, fps, config: { damping: 20, stiffness: 170 } });
  const spark = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <Stage eyebrow="O DIFERENCIAL">
      {/* Bloco "as outras" — Buffer + painel morto. */}
      <div
        style={{
          position: "absolute",
          top: 232,
          left: 90,
          width: 900,
          display: "flex",
          alignItems: "center",
          gap: 20,
          opacity: interpolate(old, [0, 0.4], [0, 1], CLAMP) * oldFade,
          transform: `translateY(${(1 - old) * 30}px)`,
          filter: `grayscale(${0.5 + 0.5 * (1 - oldFade)})`,
        }}
      >
        <span
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 26,
            letterSpacing: 3,
            color: COLORS.muted,
            whiteSpace: "nowrap",
          }}
        >
          AGENDAR
          <br />
          TEM VÁRIAS
        </span>
        <div
          style={{
            padding: "14px 24px",
            borderRadius: 16,
            background: COLORS.card,
            border: `1px solid ${COLORS.stroke}`,
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 34,
            color: COLORS.muted,
          }}
        >
          Buffer
        </div>
        {/* Painel morto (form cinza). */}
        <div
          style={{
            flex: 1,
            padding: "16px 20px",
            borderRadius: 16,
            background: COLORS.card,
            border: `1px solid ${COLORS.stroke}`,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ height: 16, borderRadius: 8, background: "rgba(162,147,127,0.35)", width: "80%" }} />
          <div style={{ height: 16, borderRadius: 8, background: "rgba(162,147,127,0.22)", width: "55%" }} />
          <div
            style={{
              alignSelf: "flex-end",
              padding: "8px 20px",
              borderRadius: 10,
              background: "rgba(162,147,127,0.3)",
              fontFamily: inter,
              fontSize: 20,
              color: COLORS.bg,
              fontWeight: 700,
            }}
          >
            preencher
          </div>
        </div>
      </div>

      {/* Pivô "MAS". */}
      <div
        style={{
          position: "absolute",
          top: 404,
          left: 0,
          width: 1080,
          textAlign: "center",
        }}
      >
        <span
          style={{
            display: "inline-block",
            position: "relative",
            fontFamily: fraunces,
            fontWeight: 700,
            fontSize: 120,
            lineHeight: 1,
            color: COLORS.coral,
            letterSpacing: 2,
            opacity: frame < 36 ? 0 : interpolate(mas, [0, 0.3], [0, 1], CLAMP),
            transform: `scale(${0.6 + 0.4 * mas})`,
            textShadow: `0 0 ${40 + 30 * spark}px rgba(217,119,87,0.6)`,
          }}
        >
          MAS
          <div
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              bottom: 6,
              height: 8,
              borderRadius: 6,
              background: COLORS.coralDeep,
              transform: `scaleX(${masLine})`,
              transformOrigin: "left center",
            }}
          />
        </span>
      </div>

      {/* Bloco "aqui você CONVERSA com o Claude". */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 90,
          width: 900,
          opacity: interpolate(claudeIn, [0, 0.35], [0, 1], CLAMP),
          transform: `translateY(${(1 - claudeIn) * 44}px)`,
        }}
      >
        <div
          style={{
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 40,
            color: COLORS.text,
            marginBottom: 22,
          }}
        >
          aqui você{" "}
          <span style={{ color: COLORS.coralLight }}>CONVERSA</span> com o Claude
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div
            style={{
              width: 132,
              height: 132,
              borderRadius: 30,
              background: COLORS.card,
              border: `1px solid ${COLORS.strokeActive}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 0 ${34 + 26 * spark}px rgba(217,119,87,${(0.4 + 0.3 * spark).toFixed(2)})`,
              transform: `scale(${0.9 + 0.1 * claudeIn})`,
            }}
          >
            <BrandLogo name="claude" size={76} color={COLORS.coral} />
          </div>
          {/* Balão de chat digitando. */}
          <div
            style={{
              flex: 1,
              padding: "24px 28px",
              borderRadius: "26px 26px 26px 6px",
              background: COLORS.cardActive,
              border: `1px solid ${COLORS.strokeActive}`,
              fontFamily: mono,
              fontSize: 34,
              color: COLORS.text,
              lineHeight: 1.4,
              opacity: interpolate(bubble, [0, 0.4], [0, 1], CLAMP),
              transform: `scale(${0.94 + 0.06 * bubble})`,
              transformOrigin: "left center",
            }}
          >
            <span style={{ color: COLORS.coralLight }}>❯ </span>
            {typed("escreve meus posts da semana", frame, 74, 1.2)}
            <Cursor />
          </div>
        </div>
      </div>
    </Stage>
  );
};
