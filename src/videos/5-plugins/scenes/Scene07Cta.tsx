import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter } from "../theme";
import { KineticWord } from "../rig";
import { SparkBurst } from "../SparkBurst";

// Cena 07 — CTA "Comenta PLUGINS" (180f / 6s standalone; 270f no master — a
// cena loopa e absorve a folga). Split-safe: tudo na metade de cima, spark e
// grade sangram no frame inteiro. CTA duplo (comenta + me segue), igual ao #0.

export const CTA_DURATION = 180;

// Duas pílulas apenas: é o que a copy promete ("os cinco com o link de
// instalação"). Três estouravam a margem lateral com "PLUGINS" nesse tamanho.
const PILLS = ["OS 5 PLUGINS", "LINK DE INSTALAÇÃO"];

const Pill: React.FC<{ at: number; label: string }> = ({ at, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 18, stiffness: 180 } });
  const bob = Math.sin((frame + at * 7) / 26) * 7;
  return (
    <div
      style={{
        padding: "16px 26px",
        borderRadius: 999,
        border: `2px solid ${COLORS.strokeActive}`,
        background: COLORS.card,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: inter,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 1,
        color: COLORS.text,
        whiteSpace: "nowrap",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 60 + bob}px)`,
      }}
    >
      <span
        style={{
          width: 13,
          height: 13,
          borderRadius: "50%",
          background: COLORS.coral,
          boxShadow: "0 0 14px rgba(217,119,87,0.9)",
        }}
      />
      {label}
    </div>
  );
};

export const Scene07Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introZ = interpolate(frame, [0, 30], [1.16, 1.04], CLAMP);
  const z = introZ + Math.sin(frame / 38) * 0.024;
  const panX = Math.sin(frame / 55) * 9;
  const panY = Math.sin(frame / 69 + 1) * 10;

  const key = spring({
    frame: frame - 18,
    fps,
    config: { damping: 13, stiffness: 130, mass: 1.3 },
  });
  const glow = 0.5 + 0.5 * Math.sin(frame / 9);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Grade de pontos em paralaxe (frame inteiro). */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,236,224,0.05) 2px, transparent 2px)",
          backgroundSize: "76px 76px",
          backgroundPosition: `${-frame * 0.3}px ${-frame * 0.2}px`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${panX}px, ${panY}px) scale(${z})`,
          transformOrigin: "540px 460px",
        }}
      >
        {/* Spark cintilando ao fundo (metade de cima). */}
        <div style={{ position: "absolute", left: 540, top: 430, opacity: 0.85 }}>
          <SparkBurst size={560} idPrefix="plgcta" impactAt={18} baseEnergy={0.8} />
        </div>

        {/* COMENTA. */}
        <div
          style={{
            position: "absolute",
            top: 228,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 82,
            letterSpacing: 20,
            color: COLORS.text,
          }}
        >
          <KineticWord at={6}>COMENTA</KineticWord>
        </div>

        {/* PLUGINS gigante — a keyword. */}
        <div
          style={{
            position: "absolute",
            top: 356,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: fraunces,
            fontWeight: 700,
            fontSize: 182,
            lineHeight: 1,
            letterSpacing: -2,
            color: COLORS.coral,
            opacity: frame < 18 ? 0 : interpolate(key, [0, 0.35], [0, 1], CLAMP),
            transform: `scale(${0.7 + 0.3 * key + 0.018 * Math.sin(frame / 12)}) rotate(${
              Math.sin(frame / 45) * 1.2
            }deg)`,
            textShadow: `0 0 ${90 + 70 * glow}px rgba(217,119,87,${(0.5 + 0.3 * glow).toFixed(
              2,
            )})`,
          }}
        >
          PLUGINS
        </div>

        {/* Pílulas. */}
        <div
          style={{
            position: "absolute",
            top: 636,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            gap: 16,
          }}
        >
          {PILLS.map((p, i) => (
            <Pill key={p} at={40 + i * 10} label={p} />
          ))}
        </div>

        {/* Subline — CTA duplo, igual ao #0. */}
        <div
          style={{
            position: "absolute",
            top: 760,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 38,
            color: COLORS.muted,
            opacity: interpolate(frame, [64, 82], [0, 1], CLAMP),
          }}
        >
          e me segue que vem mais
        </div>
      </div>

      {/* Vinheta. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 74% at 50% 34%, rgba(23,19,16,0) 46%, rgba(10,8,6,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
