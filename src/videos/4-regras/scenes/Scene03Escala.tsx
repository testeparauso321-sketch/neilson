import React from "react";
import {
  Easing,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, INK, hand, inter, marker } from "../theme";
import { Paper } from "../stage";
import { Ink, checkPath, roughLine, roughRect, roughStar, scribblePath } from "../paper";

// Cena 03 — Escala + stake (150f / 5s, split-safe, papel BRANCO quadriculado).
// "Hoje esse arquivo tem mais estrela que o Next.js inteiro — e é ele que separa
// o código que roda do que quebra na frente do cliente." TELA: 188 MIL ⭐.
// Beat 1: estrelas de caneta pipocam e o contador sobe. Beat 2: barras
// rabiscadas comparam com o Next.js. Beat 3: o papel RASGA no meio — RODA de um
// lado, QUEBRA do outro. O rasgo é o stake.

export const ESCALA_DURATION = 150;

// ⚠️ CONFERIR NO DIA DA GRAVAÇÃO — a copy marca isso explicitamente.
const STARS_K = 188; // estrelas do arquivo (mil)
const NEXT_K = 135; // estrelas do Next.js (mil)

const BAR_X = 356;
const BAR_MAX = 560;
const BAR_H = 54;

const Bar: React.FC<{
  label: string;
  value: number;
  w: number;
  y: number;
  at: number;
  color: string;
  seed: string;
  bold?: boolean;
}> = ({ label, value, w, y, at, color, seed, bold }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: bold ? 12 : 18, stiffness: bold ? 150 : 200 },
  });
  const fill = interpolate(s, [0, 1], [0, 1], CLAMP);
  const outline = interpolate(frame, [at, at + 14], [0, 1], CLAMP);
  const hatch = 9;
  return (
    <g transform={`translate(${BAR_X} ${y})`}>
      <defs>
        <clipPath id={`bar-${seed}`}>
          <rect x={-4} y={-8} width={Math.max(0, w * fill) + 4} height={BAR_H + 16} />
        </clipPath>
      </defs>
      <g clipPath={`url(#bar-${seed})`}>
        <Ink path={roughRect(w, BAR_H, `${seed}r`, 2.6, 5)} p={outline} color={color} width={4} />
        {Array.from({ length: hatch }).map((_, i) => {
          const x = ((i + 0.5) * w) / hatch;
          return (
            <Ink
              key={i}
              path={roughLine(x, BAR_H - 3, x + 26, 3, `${seed}h${i}`, 1.6)}
              p={interpolate(frame, [at + i * 1.4, at + i * 1.4 + 8], [0, 1], CLAMP)}
              color={color}
              width={3}
              opacity={0.55}
            />
          );
        })}
      </g>
      <text
        x={-22}
        y={BAR_H / 2 + 12}
        textAnchor="end"
        style={{
          fontFamily: inter,
          fontWeight: bold ? 800 : 600,
          fontSize: 34,
          fill: bold ? INK.ink : INK.soft,
        }}
      >
        {label}
      </text>
      <text
        x={w * fill + 20}
        y={BAR_H / 2 + 13}
        style={{
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 44,
          fill: color,
          opacity: interpolate(fill, [0.5, 1], [0, 1], CLAMP),
        }}
      >
        {Math.round(value * fill)} mil
      </text>
    </g>
  );
};

export const Scene03Escala: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 1 — contador de estrelas.
  const count = Math.round(
    interpolate(frame, [6, 52], [0, STARS_K], { ...CLAMP, easing: Easing.out(Easing.cubic) }),
  );
  const numIn = spring({ frame: frame - 4, fps, config: { damping: 13, stiffness: 180 } });
  const starSpin = Math.sin(frame / 15) * 9;

  // Beat 3 — o rasgo.
  const tear = interpolate(frame, [100, 126], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const split = spring({ frame: frame - 118, fps, config: { damping: 20, stiffness: 130 } });
  const rodaIn = spring({ frame: frame - 124, fps, config: { damping: 12, stiffness: 190 } });
  const quebraIn = spring({ frame: frame - 132, fps, config: { damping: 11, stiffness: 170 } });
  const scrib = interpolate(frame, [140, 150], [0, 1], CLAMP);

  const tearPath = roughLine(540, 616, 540, 900, "tear", 11, 0, 26, 5);

  return (
    <Paper tone="white" grid="graph" note="⭐">
      {/* Estrelas de caneta pipocando. */}
      <svg width={1080} height={960} style={{ position: "absolute", overflow: "visible" }}>
        {Array.from({ length: 11 }).map((_, i) => {
          // Só nas laterais: o número fica limpo no centro.
          const x = i % 2 === 0 ? 52 + random(`sx${i}`) * 178 : 856 + random(`sx${i}`) * 172;
          const y = 128 + random(`sy${i}`) * 250;
          const at = 4 + i * 3;
          const s = spring({ frame: frame - at, fps, config: { damping: 10, stiffness: 220 } });
          const r = 16 + random(`sr${i}`) * 16;
          const float = Math.sin(frame / 22 + i) * 5;
          return (
            <g
              key={i}
              transform={`translate(${x} ${y + float}) rotate(${(random(`sa${i}`) - 0.5) * 50}) scale(${s})`}
              opacity={0.9}
            >
              <Ink
                path={roughStar(0, 0, r, `st${i}`)}
                p={1}
                color={INK.coral}
                width={3.5}
                fill={i % 3 === 0 ? INK.yellowSolid : "none"}
              />
            </g>
          );
        })}
      </svg>

      {/* TELA: 188 MIL ⭐ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 196,
          width: 1080,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          opacity: interpolate(numIn, [0, 0.3], [0, 1], CLAMP),
          transform: `scale(${0.7 + 0.3 * numIn})`,
        }}
      >
        <span
          style={{
            fontFamily: marker,
            fontSize: 156,
            color: INK.ink,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -2,
          }}
        >
          {count}
        </span>
        <span style={{ fontFamily: marker, fontSize: 92, color: INK.soft }}>MIL</span>
        <svg width={110} height={110} style={{ overflow: "visible" }}>
          <g transform={`translate(55 58) rotate(${starSpin})`}>
            <Ink
              path={roughStar(0, 0, 46, "bigstar")}
              p={1}
              color={INK.coral}
              width={5}
              fill={INK.yellowSolid}
            />
          </g>
        </svg>
      </div>

      {/* Beat 2 — comparação rabiscada. */}
      <svg width={1080} height={720} style={{ position: "absolute", top: 0, overflow: "visible" }}>
        <Bar
          label="Next.js"
          value={NEXT_K}
          w={(NEXT_K / STARS_K) * BAR_MAX}
          y={400}
          at={58}
          color={INK.soft}
          seed="nx"
        />
        <Bar
          label="este arquivo"
          value={STARS_K}
          w={BAR_MAX}
          y={488}
          at={76}
          color={INK.coral}
          seed="fl"
          bold
        />
      </svg>

      {/* Beat 3 — o papel rasga: RODA | QUEBRA. */}
      <svg width={1080} height={960} style={{ position: "absolute", top: 0, overflow: "visible" }}>
        <Ink path={tearPath} p={tear} color={INK.ink} width={7} opacity={0.9} />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 640,
          width: 496,
          textAlign: "center",
          transform: `translateX(${-split * 16}px)`,
          opacity: frame < 124 ? 0 : interpolate(rodaIn, [0, 0.3], [0, 1], CLAMP),
        }}
      >
        <svg width={72} height={72} style={{ overflow: "visible", margin: "0 auto" }}>
          <g transform="translate(8 4)">
            <Ink path={checkPath(58, "roda")} p={interpolate(frame, [128, 142], [0, 1], CLAMP)} color={INK.green} width={9} />
          </g>
        </svg>
        <div
          style={{
            fontFamily: marker,
            fontSize: 92,
            lineHeight: 1.15,
            color: INK.green,
            transform: `rotate(-3deg) scale(${0.7 + 0.3 * rodaIn})`,
          }}
        >
          RODA
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 584,
          top: 640,
          width: 496,
          textAlign: "center",
          transform: `translateX(${split * 16}px)`,
          opacity: frame < 132 ? 0 : interpolate(quebraIn, [0, 0.3], [0, 1], CLAMP),
        }}
      >
        <svg width={72} height={72} style={{ overflow: "visible", margin: "0 auto" }}>
          <g transform="translate(10 8)">
            <Ink path={roughLine(4, 4, 50, 50, "x1", 2)} p={interpolate(frame, [130, 142], [0, 1], CLAMP)} color={INK.red} width={9} />
            <Ink path={roughLine(50, 4, 4, 50, "x2", 2)} p={interpolate(frame, [136, 148], [0, 1], CLAMP)} color={INK.red} width={9} />
          </g>
        </svg>
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontFamily: marker,
              fontSize: 84,
              lineHeight: 1.15,
              color: INK.red,
              transform: `rotate(3deg) scale(${0.7 + 0.3 * quebraIn})`,
            }}
          >
            QUEBRA
          </div>
          {/* Sublinhado raivoso (ênfase, não cross-out). */}
          <svg
            width={330}
            height={54}
            style={{ position: "absolute", left: 84, top: 98, overflow: "visible" }}
          >
            <Ink path={scribblePath(320, 32, "qscrib", 7)} p={scrib} color={INK.red} width={6} opacity={0.8} />
          </svg>
        </div>
      </div>
    </Paper>
  );
};
