import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, INK, STICKY, hand, marker, mono } from "../theme";
import { Paper } from "../stage";
import {
  Ink,
  Sticky,
  Tape,
  checkPath,
  roughEllipse,
  roughLine,
  roughRect,
} from "../paper";

// Cena 04 — As 4 dores (360f / 12s, split-safe, papel CINZA).
// "ele escreve código demais pra uma tarefa boba. Ignora metade do que você
// mandou. Fala que terminou quando não terminou. E inventa função que não
// existe." Mural 2×2 de post-its que grudam com pancada, um a cada ~2,9s. Cada
// post-it roda sua micro-demo EM LOOP — nenhum congela depois que entra. As
// quatro dores espelham, na ordem, as quatro regras da cena 02.

export const DORES_DURATION = 360;

const AT = [8, 94, 180, 266];
const POS = [
  { x: 76, y: 208, rot: -2.6 },
  { x: 566, y: 208, rot: 2.1 },
  { x: 76, y: 556, rot: -1.4 },
  { x: 566, y: 556, rot: 2.7 },
];
const SW = 430;
const SH = 320;
const PAD = 26;

const TITLES = ["ESCREVE DEMAIS", "IGNORA METADE", "DIZ QUE TERMINOU", "INVENTA FUNÇÃO"];
const COLORS = [STICKY.yellow, STICKY.pink, STICKY.blue, STICKY.green];

// ── Demo 1: o código incha sem parar (loop de 96f). ──────────────────────────
const DemoInchado: React.FC<{ t: number }> = ({ t }) => {
  const k = t % 96;
  const lines = Math.min(9, Math.max(0, Math.floor(k / 7)));
  const count = Math.round(interpolate(k, [0, 63], [20, 412], CLAMP));
  return (
    <>
      <svg width={378} height={132} style={{ position: "absolute", left: PAD, top: 96 }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const w = 130 + ((i * 61) % 220);
          return (
            <Ink
              key={i}
              path={roughLine(0, 8 + i * 14, w, 8 + i * 14, `inl${i}`, 1.4)}
              p={i < lines ? 1 : 0}
              color={i > 3 ? INK.red : INK.ink}
              width={7}
              opacity={i > 3 ? 0.85 : 0.55}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 238,
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 46,
          color: INK.red,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count} linhas
      </div>
      <div
        style={{
          position: "absolute",
          right: PAD,
          top: 246,
          fontFamily: hand,
          fontWeight: 600,
          fontSize: 34,
          color: INK.soft,
        }}
      >
        pedi 20
      </div>
    </>
  );
};

// ── Demo 2: metade do pedido some (loop de 108f). ────────────────────────────
const DemoIgnora: React.FC<{ t: number }> = ({ t }) => {
  const k = t % 108;
  const done = [true, false, true, false];
  return (
    <svg width={378} height={214} style={{ position: "absolute", left: PAD, top: 96 }}>
      {done.map((ok, i) => {
        const at = 8 + i * 16;
        const p = interpolate(k, [at, at + 10], [0, 1], CLAMP);
        const lineW = 190 + ((i * 47) % 110);
        return (
          <g key={TITLES[1] + i} transform={`translate(0 ${i * 48})`}>
            <Ink path={roughRect(30, 30, `ib${i}`, 2, 4)} p={1} width={3.5} />
            {ok ? (
              <g transform="translate(1 1)">
                <Ink path={checkPath(28, `ic${i}`)} p={p} color={INK.green} width={6} />
              </g>
            ) : (
              <>
                <Ink path={roughLine(4, 4, 26, 26, `ix${i}a`, 1.5)} p={p} color={INK.red} width={6} />
                <Ink path={roughLine(26, 4, 4, 26, `ix${i}b`, 1.5)} p={p} color={INK.red} width={6} />
              </>
            )}
            <Ink
              path={roughLine(48, 16, 48 + lineW, 16, `il${i}`, 1.6)}
              p={1}
              color={ok ? INK.ink : INK.faint}
              width={7}
              opacity={ok ? 0.6 : 0.32}
            />
            {/* O que ele ignorou some riscado. */}
            {ok ? null : (
              <Ink
                path={roughLine(44, 16, 52 + lineW, 16, `is${i}`, 2.4)}
                p={p}
                color={INK.red}
                width={4}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ── Demo 3: "pronto!" levando carimbo (loop de 96f). ─────────────────────────
const DemoPronto: React.FC<{ t: number }> = ({ t }) => {
  const k = t % 96;
  const bub = interpolate(k, [4, 16], [0, 1], CLAMP);
  const st = interpolate(k, [40, 44, 48, 54], [2.2, 0.9, 1.06, 1], CLAMP);
  const stOp = interpolate(k, [40, 43, 86, 92], [0, 1, 1, 0], CLAMP);
  return (
    <>
      <svg width={378} height={150} style={{ position: "absolute", left: PAD, top: 98 }}>
        <Ink path={roughEllipse(150, 56, 138, 48, "bub", 6, 1.08)} p={bub} width={4.5} />
        <Ink path={roughLine(96, 100, 78, 132, "tail", 2)} p={bub} width={4.5} />
        <Ink path={roughLine(78, 132, 122, 104, "tail2", 2)} p={bub} width={4.5} />
        <g transform="translate(214 38)">
          <Ink path={checkPath(34, "prck")} p={bub} color={INK.green} width={6} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: PAD + 42,
          top: 128,
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 54,
          color: INK.ink,
          opacity: bub,
        }}
      >
        pronto!
      </div>
      <div
        style={{
          position: "absolute",
          left: PAD + 26,
          top: 214,
          padding: "4px 16px 8px",
          border: `4px solid ${INK.red}`,
          borderRadius: 8,
          fontFamily: marker,
          fontSize: 42,
          color: INK.red,
          opacity: stOp,
          transform: `rotate(-8deg) scale(${st})`,
        }}
      >
        NÃO TESTOU
      </div>
    </>
  );
};

// ── Demo 4: função que não existe (loop de 102f). ────────────────────────────
const DemoInventa: React.FC<{ t: number }> = ({ t }) => {
  const k = t % 102;
  const typedN = Math.max(0, Math.min(17, Math.floor(k / 2.2)));
  const squig = interpolate(k, [42, 58], [0, 1], CLAMP);
  const tag = interpolate(k, [60, 70], [0, 1], CLAMP);
  const wig = 4 + Math.sin(k / 3) * 2;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: PAD,
          top: 116,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 30,
          color: INK.ink,
          whiteSpace: "pre",
        }}
      >
        {"client.magicFix()".slice(0, typedN)}
        <span style={{ opacity: k % 16 < 8 ? 1 : 0 }}>▌</span>
      </div>
      <svg width={378} height={130} style={{ position: "absolute", left: PAD, top: 152 }}>
        <Ink
          path={roughLine(0, 10, 266, 10, "sqg", wig, 0, 26, 7)}
          p={squig}
          color={INK.red}
          width={5}
        />
        <Ink path={roughLine(120, 58, 62, 20, "invarr", 2, 12)} p={tag} color={INK.red} width={4} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: PAD + 30,
          top: 222,
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 46,
          color: INK.red,
          opacity: tag,
          transform: `rotate(-5deg) scale(${0.7 + 0.3 * tag})`,
        }}
      >
        não existe
      </div>
    </>
  );
};

const DEMOS = [DemoInchado, DemoIgnora, DemoPronto, DemoInventa];

export const Scene04Dores: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shown = AT.filter((a) => frame >= a).length;

  // Moldura vermelha fechando as quatro no fim.
  const frameP = interpolate(frame, [322, 352], [0, 1], CLAMP);
  const grid = roughRect(946, 700, "doresframe", 5, 7);

  return (
    <Paper tone="gray" grid="dots" doodles={false}>
      {/* Marcação de contagem — 4 riscos que vão sendo feitos. */}
      <svg width={1080} height={200} style={{ position: "absolute", top: 0, overflow: "visible" }}>
        {AT.map((a, i) => (
          <Ink
            key={i}
            path={roughLine(80 + i * 46, 168, 96 + i * 46, 116, `tally${i}`, 2.5)}
            p={interpolate(frame, [a, a + 8], [0, 1], CLAMP)}
            color={INK.red}
            width={9}
          />
        ))}
      </svg>
      <div
        style={{
          position: "absolute",
          right: 78,
          top: 108,
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 62,
          color: INK.soft,
          fontVariantNumeric: "tabular-nums",
          transform: `rotate(${-2 + Math.sin(frame / 40) * 1.2}deg)`,
        }}
      >
        {shown}/4
      </div>

      {/* Mural 2×2. */}
      {POS.map((p, i) => {
        const s = spring({
          frame: frame - AT[i],
          fps,
          config: { damping: 11, stiffness: 190, mass: 1.1 },
        });
        const t = frame - AT[i];
        const Demo = DEMOS[i];
        const live = frame >= AT[i];
        const breathe = i === shown - 1 ? 1 + Math.sin(frame / 13) * 0.007 : 1;
        return (
          <div
            key={TITLES[i]}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              opacity: live ? interpolate(s, [0, 0.3], [0, 1], CLAMP) : 0,
              transform: `rotate(${p.rot + (1 - s) * (i % 2 === 0 ? -10 : 10)}deg) scale(${
                (0.7 + 0.3 * s) * breathe
              })`,
              transformOrigin: `${SW / 2}px ${SH / 2}px`,
            }}
          >
            <Sticky w={SW} h={SH} color={COLORS[i]} seed={`sk${i}`}>
              <div
                style={{
                  position: "absolute",
                  left: PAD,
                  top: 34,
                  fontFamily: marker,
                  fontSize: 38,
                  color: INK.ink,
                  letterSpacing: 0.5,
                }}
              >
                {TITLES[i]}
              </div>
              {live ? <Demo t={t} /> : null}
            </Sticky>
            <Tape
              w={126}
              h={40}
              seed={`sktp${i}`}
              style={{
                left: SW / 2 - 63,
                top: -18,
                transform: `rotate(${i % 2 === 0 ? -6 : 5}deg)`,
              }}
            />
          </div>
        );
      })}

      {/* Moldura de caneta fechando o mural. */}
      <svg
        width={1080}
        height={960}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <g transform="translate(68 190)">
          <Ink path={grid} p={frameP} color={INK.red} width={6} opacity={0.8} />
        </g>
      </svg>
    </Paper>
  );
};
