import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter } from "../theme";
import { Drift, KineticWord } from "../rig";

// Cena 05 — Resumo verificado de qualquer coisa (630f / 21s, split-safe,
// motion-graphics). Selo carimba "VERIFICADO"; chips de casos de uso trocam a
// cada ~1,75s; timeline de 30 dias varre em ciclo de 210f (loop limpo).

export const RESUMO_DURATION = 630;

const CYCLE = 210;
const CHIPS = ["SEU NICHO", "UM CONCORRENTE", "UMA FERRAMENTA", "QUALQUER COISA"];
const SLOT = CYCLE / CHIPS.length; // 52.5f por chip

const Chip: React.FC = () => {
  const frame = useCurrentFrame();
  const fLocal = frame - 40;
  if (fLocal < 0) {
    return null;
  }
  const slotF = fLocal % SLOT;
  const idx = Math.floor((fLocal % CYCLE) / SLOT);
  const label = CHIPS[idx];
  const isLast = idx === CHIPS.length - 1;

  const enter = interpolate(slotF, [0, 10], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(1.6)),
  });
  const exit = interpolate(slotF, [SLOT - 8, SLOT - 1], [0, 1], CLAMP);
  const pulse = 1 + (isLast ? 0.03 * Math.sin(frame / 5) : 0);

  return (
    <div
      style={{
        display: "inline-block",
        padding: "26px 54px",
        borderRadius: 999,
        background: isLast ? COLORS.coral : COLORS.cardActive,
        border: `2px solid ${isLast ? COLORS.coralLight : COLORS.strokeActive}`,
        boxShadow: isLast
          ? "0 0 60px rgba(217,119,87,0.55)"
          : "0 18px 44px rgba(0,0,0,0.35)",
        fontFamily: inter,
        fontWeight: 800,
        fontSize: isLast ? 68 : 60,
        letterSpacing: 2,
        color: isLast ? COLORS.bg : COLORS.text,
        opacity: enter * (1 - exit),
        transform: `translateY(${(1 - enter) * 40 - exit * 34}px) scale(${
          (0.9 + 0.1 * enter + (isLast ? 0.08 : 0)) * pulse
        })`,
      }}
    >
      {label}
    </div>
  );
};

export const Scene05Resumo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Selo carimbando.
  const stamp = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 190 },
  });
  const ringT = ((frame - 30 + 900) % 90) / 90;

  // Highlighter atrás de VERIFICADO.
  const hl = interpolate(frame, [20, 36], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Timeline dos 30 dias — varredura em ciclo (loop limpo a cada 210f).
  const sweep = (frame % CYCLE) / CYCLE;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Grade de pontos ambiente com paralaxe lenta. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,236,224,0.06) 2px, transparent 2px)",
          backgroundSize: "72px 72px",
          backgroundPosition: `${-frame * 0.22}px ${-frame * 0.13}px`,
        }}
      />
      <Drift>
        {/* Título + selo. */}
        <div
          style={{
            position: "absolute",
            top: 130,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: fraunces,
            fontWeight: 700,
            fontSize: 100,
            lineHeight: 1.08,
            color: COLORS.text,
          }}
        >
          <KineticWord at={6}>RESUMO</KineticWord>{" "}
          <KineticWord at={14} style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: -12,
                right: -12,
                top: 16,
                bottom: 4,
                background: COLORS.coralDeep,
                opacity: 0.5,
                borderRadius: 12,
                transform: `skewX(-6deg) scaleX(${hl})`,
                transformOrigin: "left center",
              }}
            />
            <span style={{ position: "relative", color: COLORS.coralLight }}>
              VERIFICADO
            </span>
          </KineticWord>
        </div>

        {/* Selo de check com anel pulsante. */}
        <div
          style={{
            position: "absolute",
            left: 845,
            top: 115,
            opacity: frame < 30 ? 0 : 1,
            transform: `scale(${1.9 - 0.9 * stamp}) rotate(${-24 + 14 * stamp}deg)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              border: `3px solid ${COLORS.coral}`,
              opacity: Math.max(0, 0.5 - ringT * 0.5),
              transform: `scale(${1 + ringT * 0.55})`,
            }}
          />
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `6px solid ${COLORS.coral}`,
              background: "rgba(217,119,87,0.14)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 58,
              color: COLORS.coral,
              textShadow: "0 0 24px rgba(217,119,87,0.7)",
            }}
          >
            ✓
          </div>
        </div>

        {/* Chip rotativo de casos de uso. */}
        <div
          style={{
            position: "absolute",
            top: 430,
            left: 0,
            width: 1080,
            textAlign: "center",
          }}
        >
          <Chip />
        </div>

        {/* Timeline 30 dias. */}
        <div style={{ position: "absolute", top: 680, left: 130, width: 820 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: inter,
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: 3,
              color: COLORS.muted,
              marginBottom: 18,
            }}
          >
            <span>−30D</span>
            <span style={{ color: COLORS.coralLight }}>ÚLTIMOS 30 DIAS</span>
            <span>HOJE</span>
          </div>
          <div
            style={{
              position: "relative",
              height: 12,
              borderRadius: 8,
              background: COLORS.card,
              border: `1px solid ${COLORS.stroke}`,
              overflow: "visible",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${sweep * 100}%`,
                borderRadius: 8,
                background: `linear-gradient(90deg, rgba(217,119,87,0.15), ${COLORS.coral})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: `${sweep * 100}%`,
                top: "50%",
                width: 26,
                height: 26,
                marginLeft: -13,
                marginTop: -13,
                borderRadius: "50%",
                background: COLORS.coralLight,
                boxShadow: "0 0 30px rgba(217,119,87,0.9)",
              }}
            />
          </div>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
