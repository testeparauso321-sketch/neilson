import React from "react";
import { interpolate, random, useCurrentFrame } from "remotion";
import { CLAMP, INK, marker } from "./theme";

// Primitivas "desenhadas à mão" para o vídeo 4-regras.
// Nada de realismo: todo traço é um path SVG com jitter DETERMINÍSTICO
// (random() do Remotion, semeado por string), então treme como mão humana e
// mesmo assim é idêntico em todo render. Nenhuma primitiva anima sozinha —
// quem controla o tempo é a cena (prop `p`, 0→1).

const j = (seed: string, i: number, amp: number) =>
  (random(`${seed}:${i}`) - 0.5) * 2 * amp;

export type RoughPath = { d: string; len: number };

const polyPath = (pts: [number, number][], close: boolean): RoughPath => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  if (close && pts.length > 1) {
    const a = pts[pts.length - 1];
    const b = pts[0];
    len += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  const d =
    `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} ` +
    pts
      .slice(1)
      .map((p) => `L ${p[0].toFixed(1)} ${p[1].toFixed(1)}`)
      .join(" ") +
    (close ? " Z" : "");
  return { d, len };
};

// Desvio de mão: soma de poucas harmônicas de BAIXA frequência com fase
// semeada. Ruído por ponto (alta frequência) sai serrilhado, feio; isto sai
// trêmulo como pulso humano. `freq` sobe a frequência quando o traço tem que
// ser um rabisco de verdade (sublinhado de erro, cross-out).
const wobble = (seed: string, t: number, amp: number, freq = 1) => {
  const p1 = random(`${seed}#1`) * Math.PI * 2;
  const p2 = random(`${seed}#2`) * Math.PI * 2;
  const p3 = random(`${seed}#3`) * Math.PI * 2;
  return (
    amp *
    (0.62 * Math.sin(Math.PI * t * 1.7 * freq + p1) +
      0.28 * Math.sin(Math.PI * t * 3.4 * freq + p2) +
      0.12 * Math.sin(Math.PI * t * 6.1 * freq + p3))
  );
};

/** Retângulo tremido (moldura de caneta). */
export const roughRect = (
  w: number,
  h: number,
  seed: string,
  amp = 3,
  segs = 5,
): RoughPath => {
  const pts: [number, number][] = [];
  const edge = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    key: string,
  ) => {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const L = Math.hypot(dx, dy) || 1;
    for (let i = 0; i < segs; i++) {
      const t = i / segs;
      const off = wobble(`${seed}${key}`, t, amp);
      pts.push([x0 + dx * t + (-dy / L) * off, y0 + dy * t + (dx / L) * off]);
    }
  };
  edge(0, 0, w, 0, "t");
  edge(w, 0, w, h, "r");
  edge(w, h, 0, h, "b");
  edge(0, h, 0, 0, "l");
  return polyPath(pts, true);
};

/** Linha tremida, com barriga opcional (`bow` = px de curvatura). */
export const roughLine = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  seed: string,
  amp = 2.5,
  bow = 0,
  segs = 14,
  freq = 1,
): RoughPath => {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const L = Math.hypot(dx, dy) || 1;
  const nx = -dy / L;
  const ny = dx / L;
  const pts: [number, number][] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const off = Math.sin(t * Math.PI) * bow + wobble(seed, t, amp, freq);
    // Um tiquinho de deriva no eixo do traço — a mão não para exatamente.
    const slip = wobble(`${seed}s`, t, amp * 0.35, freq * 0.7);
    pts.push([
      x0 + dx * t + nx * off + (dx / L) * slip,
      y0 + dy * t + ny * off + (dy / L) * slip,
    ]);
  }
  return polyPath(pts, false);
};

/** Elipse rabiscada — dá mais de uma volta, como caneta circulando algo. */
export const roughEllipse = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: string,
  amp = 7,
  turns = 1.14,
  segs = 64,
): RoughPath => {
  const p1 = random(`${seed}@1`) * Math.PI * 2;
  const p2 = random(`${seed}@2`) * Math.PI * 2;
  const p3 = random(`${seed}@3`) * Math.PI * 2;
  const pts: [number, number][] = [];
  const total = Math.round(segs * turns);
  const start = -Math.PI * 0.62;
  for (let i = 0; i <= total; i++) {
    const a = start + (i / segs) * Math.PI * 2;
    const dev =
      amp *
      (0.6 * Math.sin(2 * a + p1) + 0.3 * Math.sin(3 * a + p2) + 0.14 * Math.sin(5 * a + p3));
    // A volta não fecha exata — sempre passa um pouco do começo.
    const drift = (i / Math.max(1, total)) * amp * 0.55;
    pts.push([
      cx + Math.cos(a) * (rx + dev + drift),
      cy + Math.sin(a) * (ry + dev * 0.75 + drift),
    ]);
  }
  return polyPath(pts, false);
};

/** Estrela de 5 pontas desenhada a caneta. */
export const roughStar = (
  cx: number,
  cy: number,
  r: number,
  seed: string,
  amp = 2,
): RoughPath => {
  const pts: [number, number][] = [];
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.42;
    pts.push([
      cx + Math.cos(a) * rr + j(`${seed}x`, i, amp),
      cy + Math.sin(a) * rr + j(`${seed}y`, i, amp),
    ]);
  }
  return polyPath(pts, true);
};

/** Tique de conferido. */
export const checkPath = (size: number, seed: string): RoughPath =>
  polyPath(
    [
      [size * 0.08 + j(seed, 0, 1.5), size * 0.52 + j(seed, 1, 1.5)],
      [size * 0.38 + j(seed, 2, 1.5), size * 0.84 + j(seed, 3, 1.5)],
      [size * 0.95 + j(seed, 4, 2), size * 0.12 + j(seed, 5, 2)],
    ],
    false,
  );

/** Rabisco de riscar (cross-out) em zigue-zague. */
export const scribblePath = (
  w: number,
  h: number,
  seed: string,
  passes = 5,
): RoughPath => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= passes; i++) {
    const t = i / passes;
    pts.push([w * t + j(`${seed}x`, i, 6), (i % 2 === 0 ? 0.16 : 0.84) * h + j(`${seed}y`, i, 4)]);
  }
  return polyPath(pts, false);
};

/** Seta rabiscada: haste curva + duas farpas. */
export const arrowPaths = (
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  seed: string,
  bow = 26,
): { shaft: RoughPath; head: RoughPath } => {
  const shaft = roughLine(x0, y0, x1, y1, `${seed}s`, 2, bow, 12);
  const a = Math.atan2(y1 - y0, x1 - x0) + (bow / 120);
  const hl = 30;
  const head = polyPath(
    [
      [
        x1 - Math.cos(a - 0.42) * hl + j(`${seed}h`, 0, 2),
        y1 - Math.sin(a - 0.42) * hl + j(`${seed}h`, 1, 2),
      ],
      [x1, y1],
      [
        x1 - Math.cos(a + 0.42) * hl + j(`${seed}h`, 2, 2),
        y1 - Math.sin(a + 0.42) * hl + j(`${seed}h`, 3, 2),
      ],
    ],
    false,
  );
  return { shaft, head };
};

/**
 * Traço de caneta que se DESENHA (dash offset). `p` 0→1 é a cena que controla:
 * 0 = folha em branco, 1 = traço inteiro no papel.
 */
export const Ink: React.FC<{
  path: RoughPath;
  p?: number;
  color?: string;
  width?: number;
  opacity?: number;
  fill?: string;
  cap?: "round" | "butt";
}> = ({ path, p = 1, color = INK.ink, width = 3, opacity = 1, fill = "none", cap = "round" }) => (
  <path
    d={path.d}
    fill={fill}
    stroke={color}
    strokeWidth={width}
    strokeLinecap={cap}
    strokeLinejoin="round"
    opacity={opacity}
    strokeDasharray={path.len}
    strokeDashoffset={path.len * (1 - Math.max(0, Math.min(1, p)))}
  />
);

/** Moldura de caneta ao redor de um bloco (2 passadas = traço de verdade). */
export const HandBox: React.FC<{
  w: number;
  h: number;
  seed: string;
  p?: number;
  color?: string;
  width?: number;
  fill?: string;
  style?: React.CSSProperties;
}> = ({ w, h, seed, p = 1, color = INK.ink, width = 3, fill = "none", style }) => {
  const a = roughRect(w, h, `${seed}a`, 3);
  const b = roughRect(w, h, `${seed}b`, 4.5);
  return (
    <svg
      width={w + 18}
      height={h + 18}
      viewBox={`-9 -9 ${w + 18} ${h + 18}`}
      style={{ position: "absolute", left: -9, top: -9, overflow: "visible", ...style }}
    >
      {fill === "none" ? null : <path d={a.d} fill={fill} />}
      <Ink path={a} p={p} color={color} width={width} />
      <Ink path={b} p={p} color={color} width={width * 0.62} opacity={0.5} />
    </svg>
  );
};

/** Borda recortada à mão para folhas/adesivos (clip-path com cantos tortos). */
export const paperClip = (seed: string, amp = 1.1): string => {
  const pts: string[] = [];
  const n = 7;
  const push = (x: number, y: number, i: number, key: string) =>
    pts.push(
      `${(x + j(`${seed}${key}x`, i, amp)).toFixed(2)}% ${(y + j(`${seed}${key}y`, i, amp)).toFixed(2)}%`,
    );
  for (let i = 0; i < n; i++) push((i / n) * 100, 0, i, "t");
  for (let i = 0; i < n; i++) push(100, (i / n) * 100, i, "r");
  for (let i = 0; i < n; i++) push(100 - (i / n) * 100, 100, i, "b");
  for (let i = 0; i < n; i++) push(0, 100 - (i / n) * 100, i, "l");
  return `polygon(${pts.join(", ")})`;
};

/** Fita crepe: retângulo torto, translúcido, com pontas rasgadas. */
export const Tape: React.FC<{
  w?: number;
  h?: number;
  rotate?: number;
  seed?: string;
  style?: React.CSSProperties;
}> = ({ w = 150, h = 46, rotate = -8, seed = "tape", style }) => {
  const teeth = 6;
  const pts: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = (i % 2 === 0 ? 3 : 0) + j(`${seed}l`, i, 1.4);
    pts.push(`${x.toFixed(1)}% ${((i / teeth) * 100).toFixed(1)}%`);
  }
  const right: string[] = [];
  for (let i = teeth; i >= 0; i--) {
    const x = (i % 2 === 0 ? 97 : 100) + j(`${seed}r`, i, 1.4);
    right.push(`${x.toFixed(1)}% ${((i / teeth) * 100).toFixed(1)}%`);
  }
  return (
    <div
      style={{
        position: "absolute",
        width: w,
        height: h,
        background: INK.tape,
        mixBlendMode: "multiply",
        clipPath: `polygon(${[...pts, ...right.reverse()].join(", ")})`,
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 3px 8px rgba(60,44,28,0.12)",
        opacity: 0.92,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.30) 0 3px, rgba(0,0,0,0.03) 3px 7px)",
        }}
      />
    </div>
  );
};

/** Post-it: papel colorido recortado à mão, torto, com sombra e dobra. */
export const Sticky: React.FC<{
  w: number;
  h: number;
  color: string;
  seed: string;
  rotate?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, color, seed, rotate = 0, children, style }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: h,
      transform: `rotate(${rotate}deg)`,
      filter: "drop-shadow(0 14px 22px rgba(60,44,28,0.22))",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(168deg, ${color} 0%, ${color} 62%, rgba(0,0,0,0.06) 100%)`,
        clipPath: paperClip(seed, 0.9),
      }}
    />
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);

/** Folha de papel (card) recortada à mão. */
export const Sheet: React.FC<{
  w: number;
  h: number;
  seed: string;
  bg?: string;
  rotate?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, seed, bg = "#FFFFFF", rotate = 0, children, style }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: h,
      transform: `rotate(${rotate}deg)`,
      filter: "drop-shadow(0 18px 34px rgba(60,44,28,0.20))",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        clipPath: paperClip(seed, 0.55),
      }}
    />
    <div style={{ position: "absolute", inset: 0 }}>{children}</div>
  </div>
);

/**
 * Marca-texto: borrão de marcador ATRÁS do texto, revelado da esquerda pra
 * direita como se a mão arrastasse a ponta grossa.
 */
export const Highlight: React.FC<{
  w: number;
  h: number;
  p: number;
  id: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({ w, h, p, id, color = INK.yellow, style }) => {
  const segs = 9;
  const top: [number, number][] = [];
  const bottom: [number, number][] = [];
  for (let i = 0; i <= segs; i++) {
    const x = (w / segs) * i;
    top.push([x, 4 + j(`${id}t`, i, 3.5)]);
    bottom.push([x, h - 4 + j(`${id}b`, i, 4)]);
  }
  const d =
    `M ${top.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(" L ")} ` +
    `L ${bottom
      .reverse()
      .map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`)
      .join(" L ")} Z`;
  const clamped = Math.max(0, Math.min(1, p));
  return (
    <svg
      width={w}
      height={h}
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <defs>
        <clipPath id={`hl-${id}`}>
          <rect x={-6} y={-8} width={(w + 12) * clamped} height={h + 16} />
        </clipPath>
      </defs>
      <path
        d={d}
        fill={color}
        clipPath={`url(#hl-${id})`}
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
};

/** Carimbo de borracha: bate com overshoot, gira torto, tinta irregular. */
export const Stamp: React.FC<{
  label: string;
  at: number;
  color?: string;
  rotate?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ label, at, color = INK.red, rotate = -7, fontSize = 54, style }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  // Bate como carimbo de borracha: chega grande, esmaga, volta.
  const scale = interpolate(t, [0, 4, 8, 13], [2.1, 0.9, 1.06, 1], CLAMP);
  const opacity = interpolate(t, [0, 3], [0, 1], CLAMP);
  // Tinta irregular: respira de leve depois de bater.
  const wob = Math.sin((frame + 11) / 17) * 0.5;
  return (
    <div
      style={{
        position: "absolute",
        transform: `rotate(${rotate + wob}deg) scale(${scale})`,
        opacity,
        padding: "6px 22px 10px",
        border: `5px solid ${color}`,
        borderRadius: 10,
        color,
        fontFamily: marker,
        fontSize,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        boxShadow: `inset 0 0 0 2px ${color}22`,
        ...style,
      }}
    >
      {label}
    </div>
  );
};
