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

// Cena 08 — CTA "Comenta 30" (300f / 10s, fullscreen, cinematic + motion-graphics).
// "30" gigante coral com glow pulsante e câmera respirando; pílulas orbitam.

export const CTA_DURATION = 300;

const PILLS = ["GRÁTIS", "OPEN SOURCE", "ZERO CONFIG"];

const Pill: React.FC<{ at: number; label: string }> = ({ at, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 18, stiffness: 180 },
  });
  const bob = Math.sin((frame + at * 7) / 26) * 8;
  return (
    <div
      style={{
        padding: "18px 28px",
        borderRadius: 999,
        border: `2px solid ${COLORS.strokeActive}`,
        background: COLORS.card,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: inter,
        fontWeight: 700,
        fontSize: 29,
        letterSpacing: 2,
        color: COLORS.text,
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 70 + bob}px)`,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: COLORS.coral,
          boxShadow: "0 0 14px rgba(217,119,87,0.9)",
        }}
      />
      {label}
    </div>
  );
};

export const Scene08Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Câmera respirando: push-in de entrada, depois pulso contínuo.
  const introZ = interpolate(frame, [0, 30], [1.28, 1.06], {
    ...CLAMP,
  });
  const z = introZ + Math.sin(frame / 40) * 0.028;
  const panX = Math.sin(frame / 57) * 10;
  const panY = Math.sin(frame / 71 + 1.1) * 12;

  const thirty = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 110, mass: 1.5 },
  });
  const glowPulse = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${panX}px, ${panY}px) scale(${z})`,
          transformOrigin: "540px 900px",
        }}
      >
        {/* Spark cintilando ao fundo. */}
        <div style={{ position: "absolute", left: 540, top: 870, opacity: 0.85 }}>
          <SparkBurst size={560} idPrefix="cta" impactAt={20} baseEnergy={0.8} />
        </div>

        {/* COMENTA */}
        <div
          style={{
            position: "absolute",
            top: 480,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 92,
            letterSpacing: 26,
            color: COLORS.text,
          }}
        >
          <KineticWord at={8}>COMENTA</KineticWord>
        </div>

        {/* 30 gigante. */}
        <div
          style={{
            position: "absolute",
            top: 610,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: fraunces,
            fontWeight: 700,
            fontSize: 560,
            lineHeight: 1,
            color: COLORS.coral,
            opacity: frame < 20 ? 0 : interpolate(thirty, [0, 0.35], [0, 1], CLAMP),
            transform: `scale(${0.7 + 0.3 * thirty + 0.018 * Math.sin(frame / 12)}) rotate(${
              Math.sin(frame / 47) * 1.4
            }deg)`,
            textShadow: `0 0 ${90 + 70 * glowPulse}px rgba(217,119,87,${(
              0.5 + 0.3 * glowPulse
            ).toFixed(2)})`,
          }}
        >
          30
        </div>

        {/* Pílulas. */}
        <div
          style={{
            position: "absolute",
            top: 1360,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            gap: 18,
          }}
        >
          {PILLS.map((p, i) => (
            <Pill key={p} at={46 + i * 10} label={p} />
          ))}
        </div>
      </div>

      {/* Vinheta. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 46%, rgba(23,19,16,0) 46%, rgba(10,8,6,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
