import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "./theme";
import { FLARE_AT } from "./config";

// The Claude "spark": a burst of tapered rays radiating from a glowing core.
// It breathes slowly, brightens as the team comes online, and flares on sync.

const RAYS = 12;
const CENTER = 200;

const Ray: React.FC<{ angle: number; len: number }> = ({ angle, len }) => {
  const half = 8;
  const d = `M ${CENTER - half} ${CENTER} L ${CENTER} ${CENTER - len} L ${
    CENTER + half
  } ${CENTER} Z`;
  return (
    <path
      d={d}
      fill="url(#rayGrad)"
      transform={`rotate(${angle} ${CENTER} ${CENTER})`}
    />
  );
};

export const Spark: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();

  // Slow breathing pulse.
  const breathe = 0.5 + 0.5 * Math.sin(frame / 13);

  // Team comes online -> spark energises from ~56.
  const wake = interpolate(frame, [40, 74], [0.35, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Sync flare around FLARE_AT, then settle.
  const flare = interpolate(
    frame,
    [FLARE_AT - 14, FLARE_AT, FLARE_AT + 22],
    [0, 1, 0.32],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) },
  );

  const energy = Math.min(1, wake + flare * 0.5);
  const scale = 0.9 + 0.08 * breathe + flare * 0.16;
  const rot = frame * 0.14;
  const glowOpacity = 0.35 * wake + 0.5 * flare + 0.12 * breathe;

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
      {/* Soft radial glow behind the rays. */}
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.coral}${Math.round(
            glowOpacity * 255,
          )
            .toString(16)
            .padStart(2, "0")} 0%, rgba(217,119,87,0) 62%)`,
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
          <linearGradient id="rayGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={COLORS.coralDeep} />
            <stop offset="55%" stopColor={COLORS.coral} />
            <stop offset="100%" stopColor={COLORS.coralLight} />
          </linearGradient>
          <radialGradient id="coreGrad">
            <stop offset="0%" stopColor="#FBE7D8" />
            <stop offset="45%" stopColor={COLORS.coralLight} />
            <stop offset="100%" stopColor={COLORS.coral} />
          </radialGradient>
        </defs>
        <g transform={`rotate(${rot} ${CENTER} ${CENTER})`}>
          {Array.from({ length: RAYS }).map((_, i) => (
            <Ray
              key={i}
              angle={(360 / RAYS) * i}
              len={i % 2 === 0 ? 158 : 104}
            />
          ))}
        </g>
        {/* Bright inner core. */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={26 + energy * 8}
          fill="url(#coreGrad)"
        />
        <circle cx={CENTER} cy={CENTER} r={11} fill="#FCEFE4" />
      </svg>
    </div>
  );
};
