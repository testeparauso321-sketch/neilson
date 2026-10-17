import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, mono } from "./theme";
import { GlassPanel } from "./glass";

// ---------------------------------------------------------------------------
// Assinatura visual do vídeo: a ONDA DE ÁUDIO.
//
// Ela atravessa o vídeo inteiro e amarra as cenas — reunião correndo (01),
// colapsando em ata (02), presa dentro da máquina (03), voltando a correr
// quando o botão de gravar é apertado (04). Tudo determinístico: nenhum
// Math.random, senão o render não é reprodutível frame a frame.
// ---------------------------------------------------------------------------

/** Nível de uma barra: soma de senóides + envelope de sílaba (fala tem pausa). */
const level = (i: number, t: number, seed: number) => {
  const a = Math.sin(i * 0.63 + t * 2.1 + seed);
  const b = Math.sin(i * 1.47 - t * 1.3 + seed * 2.3);
  const c = Math.sin(i * 0.19 + t * 0.7 + seed * 0.5);
  const silaba = 0.42 + 0.58 * Math.abs(Math.sin(t * 1.15 + seed));
  return Math.min(1, Math.abs(a * 0.48 + b * 0.3 + c * 0.3) * silaba * 1.35);
};

/**
 * Onda de áudio em barras. `amp` é o que as cenas animam: 1 = reunião rolando,
 * 0 = congelada/colapsada (a onda vira uma linha, que é a deixa visual para o
 * texto da ata aparecer).
 */
export const Waveform: React.FC<{
  width: number;
  height: number;
  bars?: number;
  /** 0..1 — altura geral. Anime para 0 e a onda vira linha. */
  amp?: number;
  /** velocidade da fala */
  speed?: number;
  seed?: number;
  color?: string;
  /** barras acesas em coral a partir daqui (playhead) */
  playhead?: number;
  style?: React.CSSProperties;
}> = ({
  width,
  height,
  bars = 46,
  amp = 1,
  speed = 1,
  seed = 0,
  color = COLORS.text,
  playhead,
  style,
}) => {
  const frame = useCurrentFrame();
  const t = (frame / 30) * speed;
  const gap = 6;
  const bw = (width - gap * (bars - 1)) / bars;

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        gap,
        ...style,
      }}
    >
      {Array.from({ length: bars }, (_, i) => {
        const h = Math.max(4, level(i, t, seed) * height * amp);
        const quente = playhead !== undefined && i / bars <= playhead;
        return (
          <div
            key={i}
            style={{
              width: bw,
              height: h,
              borderRadius: bw / 2,
              background: quente
                ? `linear-gradient(180deg, ${COLORS.coralLight}, ${COLORS.coral})`
                : color,
              opacity: quente ? 1 : 0.42 + 0.5 * (h / height),
              boxShadow: quente
                ? `0 0 14px rgba(${COLORS.coralRGB},0.75)`
                : "none",
            }}
          />
        );
      })}
    </div>
  );
};

/** Ponto de gravação pulsando + rótulo. */
export const RecDot: React.FC<{ label?: string; size?: number }> = ({
  label = "GRAVANDO",
  size = 18,
}) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 6);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span
        style={{
          width: size,
          height: size,
          borderRadius: size,
          background: COLORS.coral,
          boxShadow: `0 0 ${14 + 20 * pulse}px rgba(${COLORS.coralRGB},${(
            0.6 + 0.4 * pulse
          ).toFixed(2)})`,
          transform: `scale(${0.88 + 0.12 * pulse})`,
        }}
      />
      <span
        style={{
          fontFamily: mono,
          fontWeight: 500,
          fontSize: size * 1.5,
          letterSpacing: 4,
          color: COLORS.text2,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** mm:ss a partir de segundos. */
export const clock = (segundos: number) => {
  const s = Math.max(0, Math.floor(segundos));
  return `${Math.floor(s / 60)
    .toString()
    .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
};

/**
 * "O teu computador": laptop de vidro. Não é ilustração de produto — é a
 * fronteira da cena 03, o lugar de onde o áudio não sai.
 */
export const Machine: React.FC<{
  width: number;
  hot?: number;
  sweep?: number;
  children?: React.ReactNode;
}> = ({ width, hot = 0, sweep = 0, children }) => {
  const h = width * 0.63;
  return (
    <div style={{ width, position: "relative" }}>
      <GlassPanel radius={26} blur={26} hot={hot} sweep={sweep} style={{ height: h }}>
        <div style={{ height: "100%", padding: 22 }}>{children}</div>
      </GlassPanel>

      {/* Base — o lábio de luz embaixo é o que faz ler como objeto físico. */}
      <div
        style={{
          width: width * 1.16,
          height: 20,
          marginLeft: -width * 0.08,
          marginTop: 8,
          borderRadius: "0 0 18px 18px",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05))",
          boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.5), 0 26px 52px -14px rgba(0,0,0,0.9)`,
        }}
      />
      <div
        style={{
          width: width * 0.22,
          height: 6,
          margin: "0 auto",
          borderRadius: 6,
          background: "rgba(255,255,255,0.14)",
        }}
      />
    </div>
  );
};

/** Ícone de wi-fi em arcos, com risca de "desligado". */
export const Wifi: React.FC<{ size?: number; off?: number; color?: string }> = ({
  size = 76,
  off = 0,
  color = COLORS.text2,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ width: size, height: size, position: "relative" }}>
      <svg viewBox="0 0 24 24" width={size} height={size}>
        {[
          { d: "M2.6 8.5a15 15 0 0 1 18.8 0", w: 2.1, i: 0 },
          { d: "M6 12.2a10 10 0 0 1 12 0", w: 2.1, i: 1 },
          { d: "M9.4 15.9a5 5 0 0 1 5.2 0", w: 2.1, i: 2 },
        ].map((a) => (
          <path
            key={a.i}
            d={a.d}
            fill="none"
            stroke={color}
            strokeWidth={a.w}
            strokeLinecap="round"
            opacity={
              off > 0.5
                ? 0.16
                : 0.35 + 0.65 * Math.abs(Math.sin(frame / 12 - a.i * 0.7))
            }
          />
        ))}
        <circle
          cx="12"
          cy="19.2"
          r="1.5"
          fill={color}
          opacity={off > 0.5 ? 0.16 : 0.95}
        />
      </svg>

      {/* Risca coral de desligado. */}
      <div
        style={{
          position: "absolute",
          left: size * 0.06,
          top: size * 0.48,
          width: size * 0.88,
          height: 5,
          borderRadius: 3,
          transformOrigin: "left center",
          transform: `rotate(-38deg) scaleX(${interpolate(off, [0, 1], [0, 1], CLAMP)})`,
          background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
          boxShadow: `0 0 22px rgba(${COLORS.coralRGB},0.9)`,
        }}
      />
    </div>
  );
};
