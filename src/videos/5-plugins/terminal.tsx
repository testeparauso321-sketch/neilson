import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, mono } from "./theme";

// Digitação char a char (~1 char/frame por padrão).
export const typed = (text: string, frame: number, start: number, cpf = 1) => {
  const chars = Math.max(0, Math.floor((frame - start) * cpf));
  return text.slice(0, Math.min(text.length, chars));
};

export const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

export const Cursor: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <span style={{ opacity: frame % 26 < 14 ? 1 : 0, color: COLORS.green }}>
      ▊
    </span>
  );
};

// Linha de CLI que entra com slide + fade; ✓ verde opcional alguns frames depois.
export const TermLine: React.FC<{
  at: number;
  checkAt?: number;
  children: React.ReactNode;
}> = ({ at, checkAt, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 7], [0, 1], CLAMP);
  const x = interpolate(frame, [at, at + 9], [-16, 0], CLAMP);
  const check =
    checkAt === undefined ? 0 : interpolate(frame, [checkAt, checkAt + 5], [0, 1], CLAMP);
  return (
    <div style={{ opacity: o, transform: `translateX(${x}px)`, whiteSpace: "pre" }}>
      {children}
      {checkAt !== undefined ? (
        <span style={{ color: COLORS.green, opacity: check }}> ✓</span>
      ) : null}
    </div>
  );
};

// Janela de terminal flutuante: entra de baixo com perspectiva 3D e oscila
// sutilmente (tela flutuante premium, sempre em movimento).
export const TerminalWindow: React.FC<{
  title: string;
  width: number;
  height: number;
  enterAt?: number;
  fontSize?: number;
  children: React.ReactNode;
}> = ({ title, width, height, enterAt = 0, fontSize = 27, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - enterAt,
    fps,
    config: { damping: 26, stiffness: 130 },
  });
  const yIn = interpolate(enter, [0, 1], [420, 0]);
  const tiltX = interpolate(enter, [0, 1], [22, 7]) + Math.sin(frame / 53) * 1.6;
  const tiltY = Math.sin(frame / 67) * 2.2;
  const scaleIn = interpolate(enter, [0, 1], [0.92, 1]);
  return (
    <div
      style={{
        width,
        height,
        transform: `perspective(1600px) translateY(${yIn}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scaleIn})`,
        opacity: interpolate(enter, [0, 0.25], [0, 1], CLAMP),
        borderRadius: 22,
        background: COLORS.term,
        border: `1px solid ${COLORS.stroke}`,
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 62,
          background: COLORS.termChrome,
          display: "flex",
          alignItems: "center",
          padding: "0 26px",
          gap: 10,
        }}
      >
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
          <div
            key={c}
            style={{ width: 18, height: 18, borderRadius: "50%", background: c }}
          />
        ))}
        <div
          style={{
            flex: 1,
            textAlign: "center",
            fontFamily: mono,
            fontSize: 22,
            color: COLORS.muted,
            marginRight: 74,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          padding: "28px 36px",
          fontFamily: mono,
          fontSize,
          lineHeight: 1.78,
          color: COLORS.text,
        }}
      >
        {children}
      </div>
    </div>
  );
};
