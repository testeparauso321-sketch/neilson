import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, SPRING } from "./theme";

/** Impacto: 1 no frame `at`, decaindo em `decay` frames. */
export const impulse = (frame: number, at: number, decay = 14) =>
  interpolate(frame, [at - 2, at, at + decay], [0, 1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });

/**
 * Rig de câmera contínuo. Push-in no começo, deriva permanente (regra de
 * retenção: nenhum frame estático) e shake somado nos frames de impacto.
 */
export const Rig: React.FC<{
  children: React.ReactNode;
  /** frames onde a tela deve tremer */
  impacts?: number[];
  /** zoom inicial → final */
  push?: [number, number];
  pushFrames?: number;
  amount?: number;
  origin?: string;
}> = ({
  children,
  impacts = [],
  push = [1.1, 1.02],
  pushFrames = 48,
  amount = 1,
  origin = "540px 430px",
}) => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, pushFrames], push, {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const breathe = Math.sin(frame / 79) * 0.011 * amount;

  let hit = 0;
  for (const at of impacts) hit = Math.max(hit, impulse(frame, at));

  const x =
    Math.sin(frame / 43) * 8 * amount + Math.sin(frame * 3.1) * 15 * hit;
  const y =
    Math.cos(frame / 57 + 0.8) * 7 * amount + Math.cos(frame * 3.7) * 13 * hit;
  const rot = Math.sin(frame / 91) * 0.28 * amount + Math.sin(frame * 2.6) * 0.7 * hit;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${
          zoom + breathe + hit * 0.02
        })`,
        transformOrigin: origin,
      }}
    >
      {children}
    </div>
  );
};

/** Palavra cinética: sobe + escala com mola. */
export const Word: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  rise?: number;
  config?: { damping: number; stiffness: number; mass?: number };
}> = ({ at, children, style, rise = 48, config = SPRING.snap }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * rise}px) scale(${0.74 + 0.26 * s})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

type Shard = { a: number; d: number; w: number; h: number; r: number; sp: number };

const makeShards = (n: number, seed: number): Shard[] =>
  Array.from({ length: n }, (_, i) => {
    // Pseudo-aleatório determinístico — render precisa ser reprodutível.
    const t = (i + 1) * (seed + 13.37);
    const f = (k: number) => ((Math.sin(t * k) + 1) / 2);
    return {
      a: (i / n) * Math.PI * 2 + f(1.7) * 0.7,
      d: 210 + f(2.3) * 360,
      w: 26 + f(3.1) * 92,
      h: 10 + f(4.9) * 34,
      r: f(5.3) * 360,
      sp: 0.6 + f(6.1) * 0.9,
    };
  });

/**
 * Cacos de vidro. `mode="out"` explode do centro (quebra), `mode="in"` traz de
 * fora pra dentro (montagem do selo da cena 05).
 */
export const Shards: React.FC<{
  at: number;
  count?: number;
  seed?: number;
  mode?: "out" | "in";
  duration?: number;
  size?: number;
}> = ({ at, count = 22, seed = 3, mode = "out", duration = 34, size = 1 }) => {
  const frame = useCurrentFrame();
  const shards = React.useMemo(() => makeShards(count, seed), [count, seed]);
  const t = interpolate(frame, [at, at + duration], [0, 1], {
    ...CLAMP,
    easing: mode === "out" ? Easing.out(Easing.quad) : Easing.out(Easing.cubic),
  });
  if (frame < at || (mode === "out" && t >= 1)) return null;

  return (
    <>
      {shards.map((s, i) => {
        const p = mode === "out" ? t * s.sp : 1 - (1 - t) * s.sp;
        const dist = mode === "out" ? p * s.d : (1 - p) * s.d;
        const op =
          mode === "out"
            ? interpolate(p, [0, 0.15, 1], [0, 1, 0], CLAMP)
            : interpolate(p, [0, 0.25, 1], [0, 0.9, 0], CLAMP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.cos(s.a) * dist,
              top: Math.sin(s.a) * dist,
              width: s.w * size,
              height: s.h * size,
              marginLeft: (-s.w * size) / 2,
              marginTop: (-s.h * size) / 2,
              borderRadius: 4,
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.62), rgba(255,255,255,0.06) 55%, rgba(255,255,255,0.34))",
              boxShadow: `0 0 18px rgba(255,255,255,0.28), inset 0 0 0 1px ${COLORS.rim}`,
              transform: `rotate(${s.r + p * 260 * (mode === "out" ? 1 : -1)}deg) skewX(-12deg)`,
              opacity: op,
            }}
          />
        );
      })}
    </>
  );
};

/** Flash branco curto — o "corte" do impacto. */
export const Flash: React.FC<{ at: number; len?: number; peak?: number }> = ({
  at,
  len = 5,
  peak = 0.75,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 1, at, at + len], [0, peak, 0], CLAMP);
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#FFFFFF",
        opacity: o,
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};
