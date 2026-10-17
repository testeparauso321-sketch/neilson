import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
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
  damping?: number;
  stiffness?: number;
}> = ({ at, children, style, damping = 16, stiffness = 230 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping, stiffness } });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 48}px) scale(${0.72 + 0.28 * s})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Papel que "cai na mesa": chega de cima, rodado, e assenta com overshoot.
 * `impact` devolve 0→1 no frame da pancada pra cena sincronizar shake/carimbo.
 */
export const useDrop = (at: number, restRotate = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 13, stiffness: 130, mass: 1.2 },
  });
  return {
    opacity: frame < at ? 0 : interpolate(s, [0, 0.25], [0, 1], CLAMP),
    transform: `translateY(${(1 - s) * -280}px) rotate(${
      restRotate + (1 - s) * -9
    }deg) scale(${0.86 + 0.14 * s})`,
    settled: s,
  };
};

/** Micro-shake de câmera no frame de impacto (pancada de papel/carimbo). */
export const shakeAt = (frame: number, at: number, amp = 10) => {
  const k = interpolate(frame, [at - 2, at + 2, at + 15], [0, 1, 0], CLAMP);
  return {
    x: Math.sin(frame * 2.9) * amp * k,
    y: Math.cos(frame * 3.3) * amp * 0.8 * k,
  };
};
