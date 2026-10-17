import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, INK, STICKY, hand, inter, marker, mono } from "../theme";
import { Paper } from "../stage";
import { Ink, Sticky, Tape, arrowPaths, roughEllipse, roughLine, roughRect } from "../paper";

// Cena 07 — CTA (180f / 6s, 330f no master, split-safe, papel BRANCO, loopável).
// "Comenta REGRAS aqui embaixo que eu te mando o arquivo e onde colar."
// TELA: comenta "REGRAS". Balão de fala desenhado com REGRAS em marcador
// pulsando, explosão de traços atrás girando devagar, seta rabiscada apontando
// pra caixa de comentário que digita REGRAS em loop, e 3 adesivos respirando.
// Todo movimento depois do frame ~120 é cíclico — a cena absorve os 5s de folga
// do master sem emenda.

export const CTA_DURATION = 180;

const TYPE_PERIOD = 90;
const WORD = "REGRAS";

const CHIPS = ["O ARQUIVO", "ONDE COLAR", "NO DIRECT"];
const CHIP_X = [62, 390, 718];
const CHIP_ROT = [-2.6, 1.8, -1.4];

export const Scene07Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bubble = interpolate(frame, [6, 34], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const burst = interpolate(frame, [20, 48], [0, 1], CLAMP);
  const word = spring({ frame: frame - 16, fps, config: { damping: 11, stiffness: 160, mass: 1.2 } });
  const comenta = spring({ frame: frame - 2, fps, config: { damping: 14, stiffness: 210 } });
  const arrow = interpolate(frame, [46, 64], [0, 1], CLAMP);
  const box = interpolate(frame, [62, 86], [0, 1], CLAMP);

  // Pulso perpétuo do REGRAS (fecha o ciclo pro loop do master).
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
  const spin = frame * 0.004; // rad/frame — os raios caminham pela borda

  // A caixa de comentário digita REGRAS em loop.
  const k = frame % TYPE_PERIOD;
  const n =
    k < 40
      ? Math.min(WORD.length, Math.floor(k / 6))
      : k < 70
        ? WORD.length
        : Math.max(0, WORD.length - Math.floor((k - 70) / 3));
  const caret = frame % 16 < 8;

  const { shaft, head } = arrowPaths(540, 548, 546, 614, "ctaarrow", 16);

  return (
    <Paper tone="white" grid="dots" note="↓">
      {/* Explosão de traços atrás do balão — gira devagar, nunca para. */}
      <svg width={1080} height={960} style={{ position: "absolute", top: 0, overflow: "visible" }}>
        <g>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2 + spin;
            // Raio sai da BORDA do balão pra fora, radialmente. Os traços de
            // cima são curtos pra não bater no "comenta".
            const ex = Math.cos(a) * 356;
            const ey = Math.sin(a) * 146;
            const L = Math.hypot(ex, ey) || 1;
            const len =
              (i % 2 === 0 ? 78 : 46) * (0.4 + 0.6 * Math.abs(Math.cos(a))) * (1 + pulse * 0.16);
            return (
              <Ink
                key={i}
                path={roughLine(
                  540 + ex,
                  372 + ey,
                  540 + ex + (ex / L) * len,
                  372 + ey + (ey / L) * len,
                  `bst${i}`,
                  2,
                )}
                p={interpolate(burst, [i / 32, i / 32 + 0.5], [0, 1], CLAMP)}
                color={INK.coral}
                width={6}
                opacity={0.5 + 0.3 * pulse}
              />
            );
          })}
        </g>
      </svg>

      {/* "comenta" à mão. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 112,
          width: 1080,
          textAlign: "center",
          fontFamily: hand,
          fontWeight: 700,
          fontSize: 72,
          color: INK.soft,
          opacity: interpolate(comenta, [0, 0.4], [0, 1], CLAMP),
          transform: `rotate(-2deg) translateY(${(1 - comenta) * -26}px)`,
        }}
      >
        comenta
      </div>

      {/* Balão de fala + REGRAS. */}
      <svg width={1080} height={720} style={{ position: "absolute", top: 0, overflow: "visible" }}>
        <Ink
          path={roughEllipse(540, 378, 336, 128, "ctabub", 9, 1.1)}
          p={bubble}
          color={INK.ink}
          width={7}
          fill="#FFFDF7"
        />
        <Ink path={roughLine(470, 498, 436, 556, "ctatail1", 2.5)} p={bubble} color={INK.ink} width={7} />
        <Ink path={roughLine(436, 556, 522, 500, "ctatail2", 2.5)} p={bubble} color={INK.ink} width={7} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 306,
          width: 1080,
          textAlign: "center",
          opacity: frame < 16 ? 0 : interpolate(word, [0, 0.3], [0, 1], CLAMP),
          transform: `rotate(-1.6deg) scale(${(0.55 + 0.45 * word) * (1 + pulse * 0.024)})`,
        }}
      >
        <span
          style={{
            fontFamily: marker,
            fontSize: 138,
            color: INK.coral,
            letterSpacing: 2,
          }}
        >
          {WORD}
        </span>
      </div>

      {/* Seta pra caixa de comentário. */}
      <svg width={1080} height={720} style={{ position: "absolute", top: 0, overflow: "visible" }}>
        <Ink path={shaft} p={arrow} color={INK.ink} width={6} />
        <Ink path={head} p={interpolate(arrow, [0.6, 1], [0, 1], CLAMP)} color={INK.ink} width={6} />
      </svg>

      {/* Caixa de comentário digitando REGRAS em loop. */}
      <svg width={1080} height={220} style={{ position: "absolute", top: 626, overflow: "visible" }}>
        <g transform="translate(186 0)">
          <Ink path={roughRect(708, 112, "ctabox", 3.4, 6)} p={box} color={INK.soft} width={5} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          left: 218,
          top: 660,
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 46,
          color: INK.ink,
          opacity: interpolate(box, [0.6, 1], [0, 1], CLAMP),
          whiteSpace: "pre",
        }}
      >
        {WORD.slice(0, n)}
        <span style={{ opacity: caret ? 1 : 0, color: INK.coral }}>▌</span>
      </div>

      {/* Adesivos do que o comentário devolve. */}
      {CHIPS.map((label, i) => {
        const s = spring({
          frame: frame - (92 + i * 12),
          fps,
          config: { damping: 12, stiffness: 200 },
        });
        const wob = Math.sin(frame / 17 + i * 1.7) * 1.1;
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: CHIP_X[i],
              top: 774,
              opacity: interpolate(s, [0, 0.35], [0, 1], CLAMP),
              transform: `rotate(${CHIP_ROT[i] + wob + (1 - s) * 10}deg) scale(${0.7 + 0.3 * s})`,
              transformOrigin: "150px 53px",
            }}
          >
            <Sticky
              w={300}
              h={106}
              color={[STICKY.yellow, STICKY.blue, STICKY.pink][i]}
              seed={`ctachip${i}`}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: inter,
                  fontWeight: 800,
                  fontSize: 30,
                  letterSpacing: 1.5,
                  color: INK.ink,
                }}
              >
                {label}
              </div>
            </Sticky>
            <Tape
              w={96}
              h={32}
              seed={`ctatp${i}`}
              style={{ left: 102, top: -12, transform: `rotate(${i % 2 === 0 ? -6 : 6}deg)` }}
            />
          </div>
        );
      })}
    </Paper>
  );
};
