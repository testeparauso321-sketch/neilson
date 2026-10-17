import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter } from "../theme";
import { Drift } from "../rig";

// Cena 07 — Fecho + Save (150f / 5s, fullscreen, motion-graphics).
// Os 5 badges convergem em "CLAUDE CODE" + selo IRRECONHECÍVEL; depois o ícone
// de SALVAR gigante pulsa — sinal mais forte do vídeo.

export const FECHO_DURATION = 150;

const HOMES = [180, 360, 540, 720, 900];

const Badge: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - (8 + index * 5),
    fps,
    config: { damping: 16, stiffness: 200 },
  });
  const conv = interpolate(frame, [40, 58], [0, 1], {
    ...CLAMP,
    easing: (t) => t * t,
  });
  const x = interpolate(conv, [0, 1], [HOMES[index], 540]);
  const y = interpolate(conv, [0, 1], [0, 60]);
  const scale = (0.5 + 0.5 * enter) * (1 - 0.7 * conv);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 560 + y,
        width: 120,
        height: 120,
        marginLeft: -60,
        borderRadius: 28,
        background: COLORS.coral,
        border: `1px solid ${COLORS.coralLight}`,
        boxShadow: "0 0 40px rgba(217,119,87,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: inter,
        fontWeight: 800,
        fontSize: 60,
        color: COLORS.bg,
        opacity: (frame < 8 + index * 5 ? 0 : 1) * (1 - conv),
        transform: `scale(${scale})`,
      }}
    >
      {String(index + 1).padStart(2, "0")}
    </div>
  );
};

export const Scene07Fecho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const breathe = 1.04 + Math.sin(frame / 40) * 0.02;

  const lock = spring({ frame: frame - 50, fps, config: { damping: 14, stiffness: 130 } });
  const seal = spring({ frame: frame - 64, fps, config: { damping: 11, stiffness: 160 } });

  const savePop = spring({ frame: frame - 80, fps, config: { damping: 13, stiffness: 150 } });
  const glow = 0.5 + 0.5 * Math.sin(frame / 7);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,236,224,0.05) 2px, transparent 2px)",
          backgroundSize: "76px 76px",
          backgroundPosition: `${-frame * 0.3}px ${-frame * 0.2}px`,
        }}
      />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${breathe})` }}>
        <Drift amount={0.7}>
          {/* Kicker. */}
          <div
            style={{
              position: "absolute",
              top: 430,
              left: 0,
              width: 1080,
              textAlign: "center",
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 8,
              color: COLORS.muted,
              opacity: interpolate(frame, [4, 18], [0, 1], CLAMP),
            }}
          >
            JUNTA OS CINCO
          </div>

          {/* Badges convergindo. */}
          {HOMES.map((_, i) => (
            <Badge key={i} index={i} />
          ))}

          {/* Lockup CLAUDE CODE. */}
          <div
            style={{
              position: "absolute",
              top: 600,
              left: 0,
              width: 1080,
              textAlign: "center",
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 108,
              lineHeight: 1,
              color: COLORS.text,
              opacity: frame < 50 ? 0 : interpolate(lock, [0, 0.4], [0, 1], CLAMP),
              transform: `scale(${0.7 + 0.3 * lock})`,
            }}
          >
            CLAUDE CODE
          </div>

          {/* Selo IRRECONHECÍVEL. */}
          <div
            style={{
              position: "absolute",
              top: 740,
              left: 0,
              width: 1080,
              textAlign: "center",
              opacity: frame < 64 ? 0 : 1,
              transform: `scale(${1.4 - 0.4 * seal}) rotate(${-5 + 3 * seal}deg)`,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "14px 34px",
                borderRadius: 14,
                border: `3px solid ${COLORS.coral}`,
                background: "rgba(217,119,87,0.12)",
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 48,
                letterSpacing: 4,
                color: COLORS.coralLight,
              }}
            >
              IRRECONHECÍVEL
            </span>
          </div>

          {/* Bloco SALVAR. */}
          <div
            style={{
              position: "absolute",
              top: 1080,
              left: 0,
              width: 1080,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
              opacity: frame < 80 ? 0 : 1,
            }}
          >
            <div
              style={{
                transform: `scale(${(0.4 + 0.6 * savePop) * (1 + 0.05 * glow)})`,
              }}
            >
              <svg width={180} height={210} viewBox="0 0 180 210">
                <path
                  d="M30 12 h120 a10 10 0 0 1 10 10 v168 l-80 -54 l-80 54 v-168 a10 10 0 0 1 10 -10 Z"
                  fill={COLORS.coral}
                  stroke={COLORS.coralLight}
                  strokeWidth={4}
                  style={{ filter: `drop-shadow(0 0 ${20 + 34 * glow}px rgba(217,119,87,0.75))` }}
                />
              </svg>
            </div>
            <div
              style={{
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 62,
                letterSpacing: 2,
                color: COLORS.text,
                textAlign: "center",
              }}
            >
              SALVA PRA INSTALAR <span style={{ color: COLORS.coral }}>DEPOIS</span>
            </div>
          </div>
        </Drift>
      </div>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 48%, rgba(23,19,16,0) 46%, rgba(10,8,6,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
