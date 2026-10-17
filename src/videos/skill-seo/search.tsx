import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, geist, mono } from "./theme";
import { GlassPanel } from "./glass";

// ---------------------------------------------------------------------------
// Assinatura visual do vídeo "skill-seo": a BUSCA.
//
// O fio condutor é a pergunta que uma pessoa de verdade digita no Google. Ela
// nasce no gancho sendo digitada, empilha no relatório como linha com volume,
// alimenta o gerador de posts, mora dentro do painel e volta no FAQ. Tudo aqui
// é o mesmo material: campo de vidro, texto mono, número em coral.
// ---------------------------------------------------------------------------

/** Milhar com ponto (pt-BR) sem depender de locale do runtime de render. */
export const fmtNum = (n: number): string => {
  const s = Math.round(Math.max(0, n)).toString();
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ".";
    out += s[i];
  }
  return out;
};

/** Texto sendo digitado: quantos caracteres mostrar no frame atual. */
export const typedChars = (
  text: string,
  frame: number,
  from: number,
  to: number,
): string => text.slice(0, Math.round(interpolate(frame, [from, to], [0, text.length], CLAMP)));

/** Lupa — o ícone que carrega a ideia de "procura" sem escrever nada. */
export const Magnifier: React.FC<{ size?: number; color?: string; glow?: number }> = ({
  size = 44,
  color = COLORS.text2,
  glow = 0,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    style={{
      flex: "none",
      filter: glow > 0 ? `drop-shadow(0 0 ${14 * glow}px rgba(${COLORS.coralRGB},${glow}))` : undefined,
    }}
    aria-label="busca"
  >
    <circle cx="10.5" cy="10.5" r="6.6" fill="none" stroke={color} strokeWidth="2.2" />
    <path d="M15.4 15.4 L20.5 20.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

/** Caret piscando — dá vida ao campo mesmo parado (regra: nada estático). */
export const Caret: React.FC<{ height?: number; on?: boolean }> = ({ height = 46, on = true }) => {
  const frame = useCurrentFrame();
  return (
    <span
      style={{
        display: "inline-block",
        width: 4,
        height,
        borderRadius: 2,
        background: COLORS.coralLight,
        opacity: on && frame % 14 < 8 ? 1 : 0.1,
        boxShadow: `0 0 16px rgba(${COLORS.coralRGB},0.85)`,
      }}
    />
  );
};

/**
 * Campo de busca de vidro. O texto entra digitado (passe `text` já cortado por
 * `typedChars`) e o caret continua piscando enquanto `typing` for true.
 */
export const SearchField: React.FC<{
  text: string;
  width: number;
  height?: number;
  fontSize?: number;
  typing?: boolean;
  hot?: number;
  tint?: number;
  sweep?: number;
  placeholder?: string;
  style?: React.CSSProperties;
}> = ({
  text,
  width,
  height = 150,
  fontSize = 46,
  typing = true,
  hot = 0,
  tint = 0,
  sweep = 0,
  placeholder = "Pesquisar no Google",
  style,
}) => (
  <div style={{ width, ...style }}>
    <GlassPanel
      radius={height / 2}
      blur={30}
      hot={hot}
      tint={tint}
      sweep={sweep}
      style={{ height }}
      contentStyle={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: `0 ${Math.round(height * 0.3)}px`,
      }}
    >
      <Magnifier size={fontSize * 1.05} glow={hot * 0.8} />
      <span
        style={{
          fontFamily: geist,
          fontWeight: 500,
          fontSize,
          letterSpacing: -0.5,
          color: text.length > 0 ? COLORS.text : COLORS.faint,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {text.length > 0 ? text : placeholder}
      </span>
      <Caret height={fontSize * 1.05} on={typing} />
    </GlassPanel>
  </div>
);

/**
 * Linha do relatório: a pergunta de um lado, quantas vezes perguntaram do
 * outro, e uma barra de volume por baixo. `active` acende a linha em coral.
 */
export const QueryRow: React.FC<{
  q: string;
  vol: number;
  /** 0..1 — largura da barra em relação à linha mais buscada */
  share: number;
  /** 0..1 — entrada da linha */
  t: number;
  /** 0..1 — destaque coral */
  active?: number;
  width: number;
  fontSize?: number;
}> = ({ q, vol, share, t, active = 0, width, fontSize = 33 }) => (
  <div
    style={{
      width,
      opacity: interpolate(t, [0, 0.35], [0, 1], CLAMP),
      transform: `translateX(${(1 - t) * -40}px)`,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: 24,
        padding: "0 4px 10px",
      }}
    >
      <span
        style={{
          fontFamily: geist,
          fontWeight: active > 0.4 ? 700 : 500,
          fontSize,
          letterSpacing: -0.4,
          color: active > 0.4 ? COLORS.text : COLORS.text2,
          opacity: 0.55 + 0.45 * Math.max(active, 0.35),
          whiteSpace: "nowrap",
        }}
      >
        {q}
      </span>
      <span
        style={{
          fontFamily: mono,
          fontWeight: 700,
          fontSize: fontSize * (1 + 0.24 * active),
          color: active > 0.4 ? COLORS.coralLight : COLORS.muted,
          fontVariantNumeric: "tabular-nums",
          textShadow:
            active > 0.4 ? `0 0 ${26 * active}px rgba(${COLORS.coralRGB},0.8)` : undefined,
        }}
      >
        {fmtNum(vol)}
      </span>
    </div>
    {/* Barra de volume — cresce junto com a entrada da linha. */}
    <div
      style={{
        height: 7,
        borderRadius: 4,
        background: "rgba(255,255,255,0.07)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${share * 100 * Math.min(1, t * 1.4)}%`,
          borderRadius: 4,
          background:
            active > 0.4
              ? `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`
              : "linear-gradient(90deg, rgba(255,255,255,0.22), rgba(255,255,255,0.5))",
          boxShadow: active > 0.4 ? `0 0 22px rgba(${COLORS.coralRGB},0.85)` : undefined,
        }}
      />
    </div>
  </div>
);

/** Rótulo mono em caixa alta — usado como cabeçalho de painel/cartão. */
export const Label: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 26, color = COLORS.muted, style }) => (
  <span
    style={{
      fontFamily: mono,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: size * 0.22,
      color,
      ...style,
    }}
  >
    {children}
  </span>
);

/** Cursor de vidro — o "clique" das cenas de tutorial. */
export const Cursor: React.FC<{ x: number; y: number; press?: number }> = ({
  x,
  y,
  press = 0,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${1 - press * 0.18})`,
      filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.85))",
    }}
  >
    <svg viewBox="0 0 24 24" width={46} height={46} aria-label="cursor">
      <path
        d="M5 2.5 L18.5 12.4 L12.2 13.2 L15.1 20.4 L12.2 21.5 L9.4 14.3 L5 18.4 Z"
        fill="rgba(255,255,255,0.94)"
        stroke="rgba(0,0,0,0.45)"
        strokeWidth="0.8"
      />
    </svg>
    {press > 0.02 ? (
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 8,
          width: 10 + press * 90,
          height: 10 + press * 90,
          marginLeft: -(5 + press * 45),
          marginTop: -(5 + press * 45),
          borderRadius: "50%",
          border: `2px solid rgba(${COLORS.coralRGB},${(0.85 * (1 - press)).toFixed(2)})`,
        }}
      />
    ) : null}
  </div>
);
