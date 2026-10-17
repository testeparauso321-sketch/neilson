import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, INK, STICKY, hand, inter, marker, mono } from "../theme";
import { Paper } from "../stage";
import { Ink, Sheet, Sticky, Tape, checkPath, roughLine } from "../paper";

// Cena 06 — Fosso (240f / 8s, split-safe, papel CINZA, loopável).
// "Isso roda em todo sistema que eu entrego pra cliente. Ferramenta é bastidor
// — o que importa é o código chegar funcionando." A copy pede ROSTO neste
// bloco, então a cena é deliberadamente AREJADA: só a pilha de entregas sendo
// carimbada em loop (3 ciclos exatos de 80f) e a fileira de ✓ acumulando.
// Nenhum texto compete com a fala.

export const FOSSO_DURATION = 240;

const PERIOD = 80; // 240 = 3 ciclos exatos → o ritmo fecha sem emenda
const SX = 298;
const SY = 244;
const SW = 484;
const SH = 316;

export const Scene06Fosso: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = Math.floor(frame / PERIOD);
  const k = frame % PERIOD;

  // A folha entra pela esquerda, é carimbada e sai pela direita.
  const inX = interpolate(k, [0, 14], [-820, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const outX = interpolate(k, [64, 80], [0, 820], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const x = inX + outX;
  const tilt = interpolate(k, [0, 14, 64, 80], [-7, 0.8, 0.8, 9], CLAMP);
  const stampScale = interpolate(k - 30, [0, 4, 8, 13], [2.2, 0.9, 1.06, 1], CLAMP);
  const stampOp = interpolate(k, [30, 33, 62, 68], [0, 1, 1, 0], CLAMP);

  return (
    <Paper tone="gray" grid="rule">
      {/* Etiqueta de contexto, pequena e colada no canto. */}
      <div style={{ position: "absolute", left: 84, top: 132 }}>
        <Sticky w={252} h={74} color={STICKY.green} seed="prodtag" rotate={-2.4}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: 4,
              color: INK.ink,
            }}
          >
            PRODUÇÃO
          </div>
        </Sticky>
        <Tape w={110} h={36} seed="prodtape" style={{ left: 70, top: -14, transform: "rotate(-7deg)" }} />
      </div>

      {/* Pilha atrás — dá volume de "todo sistema". */}
      {[2, 1].map((d) => (
        <div
          key={d}
          style={{
            position: "absolute",
            left: SX + d * 11,
            top: SY + d * 13,
            opacity: 0.5 - d * 0.14,
          }}
        >
          <Sheet w={SW} h={SH} seed={`stk${d}`} bg="#F3EEE2" rotate={d === 1 ? 1.8 : -2.4} />
        </div>
      ))}

      {/* A folha da vez. */}
      <div
        style={{
          position: "absolute",
          left: SX,
          top: SY,
          transform: `translateX(${x}px) rotate(${tilt}deg)`,
          transformOrigin: `${SW / 2}px ${SH / 2}px`,
        }}
      >
        <Sheet w={SW} h={SH} seed="delivery" bg="#FFFDF7">
          <div
            style={{
              position: "absolute",
              left: 34,
              top: 30,
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 30,
              color: INK.soft,
            }}
          >
            sistema 0{(cycle % 3) + 1}
          </div>
          <svg width={SW - 68} height={170} style={{ position: "absolute", left: 34, top: 92 }}>
            {[0, 1, 2].map((i) => (
              <g key={i} transform={`translate(0 ${i * 52})`}>
                <Ink
                  path={checkPath(34, `dl${i}`)}
                  p={interpolate(k, [8 + i * 7, 16 + i * 7], [0, 1], CLAMP)}
                  color={INK.green}
                  width={6}
                />
                <Ink
                  path={roughLine(54, 22, 54 + 180 + i * 46, 22, `dln${i}`, 1.6)}
                  p={1}
                  color={INK.ink}
                  width={7}
                  opacity={0.42}
                />
              </g>
            ))}
          </svg>
          <div
            style={{
              position: "absolute",
              left: 46,
              top: 218,
              padding: "4px 20px 8px",
              border: `5px solid ${INK.green}`,
              borderRadius: 10,
              fontFamily: marker,
              fontSize: 48,
              color: INK.green,
              opacity: stampOp,
              transform: `rotate(-9deg) scale(${stampScale})`,
            }}
          >
            ENTREGUE ✓
          </div>
        </Sheet>
      </div>

      {/* Fileira de entregas acumulando — a prova de "todo sistema". */}
      <svg width={1080} height={140} style={{ position: "absolute", top: 636, overflow: "visible" }}>
        {Array.from({ length: 9 }).map((_, i) => {
          const old = i < 6;
          const done = old || i - 6 <= cycle;
          const at = (i - 6) * PERIOD + 34;
          const p = old ? 1 : interpolate(frame, [at, at + 10], [0, 1], CLAMP);
          const bob = Math.sin(frame / 24 + i * 0.8) * 3;
          return (
            <g key={i} transform={`translate(${168 + i * 82} ${20 + bob})`} opacity={done ? 1 : 0.18}>
              <Ink
                path={checkPath(44, `tl${i}`)}
                p={p}
                color={old ? INK.faint : INK.green}
                width={old ? 6 : 8}
              />
            </g>
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 754,
          width: 1080,
          textAlign: "center",
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 44,
          color: INK.faint,
          transform: `rotate(${-1 + Math.sin(frame / 52) * 0.8}deg)`,
        }}
      >
        um atrás do outro
      </div>
    </Paper>
  );
};
