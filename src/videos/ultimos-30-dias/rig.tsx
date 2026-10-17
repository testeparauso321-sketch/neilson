import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP } from "./theme";

export const easeCam = Easing.inOut(Easing.cubic);

// Deriva constante de câmera — regra de retenção: nenhum frame estático.
// Escala base 1.03 evita frestas nas bordas durante o translate.
export const Drift: React.FC<{
  children: React.ReactNode;
  amount?: number;
}> = ({ children, amount = 1 }) => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 47) * 7 * amount;
  const y = Math.sin(frame / 61 + 1.3) * 9 * amount;
  const s = 1.03 + Math.sin(frame / 83 + 0.6) * 0.012 * amount;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${x}px, ${y}px) scale(${s})`,
      }}
    >
      {children}
    </div>
  );
};

// Palavra cinética: entra com spring (slide + scale + fade).
export const KineticWord: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 18, stiffness: 210 },
  });
  const opacity = frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP);
  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${(1 - s) * 46}px) scale(${0.72 + 0.28 * s})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
