import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS } from "./theme";

// Spark/sunburst do Claude (adaptado do ClaudeCowork): raios cônicos + núcleo
// brilhante. Respira sempre; flare no frame de impacto da cena.
const RAYS = 12;
const C = 200;

const Ray: React.FC<{ angle: number; len: number; grad: string }> = ({
  angle,
  len,
  grad,
}) => {
  const half = 8;
  const d = `M ${C - half} ${C} L ${C} ${C - len} L ${C + half} ${C} Z`;
  return (
    <path d={d} fill={`url(#${grad})`} transform={`rotate(${angle} ${C} ${C})`} />
  );
};

export const SparkBurst: React.FC<{
  size: number;
  idPrefix: string;
  impactAt?: number;
  baseEnergy?: number;
}> = ({ size, idPrefix, impactAt = -1000, baseEnergy = 0.55 }) => {
  const frame = useCurrentFrame();
  const breathe = 0.5 + 0.5 * Math.sin(frame / 13);
  const flare = interpolate(
    frame,
    [impactAt - 8, impactAt, impactAt + 26],
    [0, 1, 0.3],
    { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
  );
  const scale = 0.92 + 0.07 * breathe + 0.2 * flare;
  const rot = frame * 0.16;
  const glow = Math.min(1, baseEnergy * 0.4 + 0.45 * flare + 0.14 * breathe);
  const grad = `${idPrefix}-ray`;
  const core = `${idPrefix}-core`;

  return (
    <div
      style={{
        position: "absolute",
        left: -size / 2,
        top: -size / 2,
        width: size,
        height: size,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(217,119,87,${(
            glow * 0.6
          ).toFixed(3)}) 0%, rgba(217,119,87,0) 62%)`,
          filter: "blur(6px)",
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox="0 0 400 400"
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id={grad} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={COLORS.coralDeep} />
            <stop offset="55%" stopColor={COLORS.coral} />
            <stop offset="100%" stopColor={COLORS.coralLight} />
          </linearGradient>
          <radialGradient id={core}>
            <stop offset="0%" stopColor="#FBE7D8" />
            <stop offset="45%" stopColor={COLORS.coralLight} />
            <stop offset="100%" stopColor={COLORS.coral} />
          </radialGradient>
        </defs>
        <g transform={`rotate(${rot} ${C} ${C})`}>
          {Array.from({ length: RAYS }).map((_, i) => (
            <Ray
              key={i}
              angle={(360 / RAYS) * i}
              len={i % 2 === 0 ? 158 : 104}
              grad={grad}
            />
          ))}
        </g>
        <circle cx={C} cy={C} r={26 + glow * 8} fill={`url(#${core})`} />
        <circle cx={C} cy={C} r={11} fill="#FCEFE4" />
      </svg>
    </div>
  );
};
