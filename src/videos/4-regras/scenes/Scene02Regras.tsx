import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, INK, STICKY, hand, marker, mono } from "../theme";
import { Paper } from "../stage";
import { useDrop } from "../rig";
import {
  Highlight,
  Ink,
  Sheet,
  Sticky,
  Tape,
  checkPath,
  roughEllipse,
  roughLine,
  roughRect,
} from "../paper";

// Cena 02 — A solução (180f / 6s, split-safe, papel CINZA).
// "24 horas depois veio a solução: 4 regras que você cola no teu Claude."
// TELA: 4 REGRAS. Beat 1: relógio a caneta girando + carimbo 24H DEPOIS.
// Corte seco (flash de papel) → a FOLHA INTEIRA do CLAUDE.md cabe numa tela só,
// que é exatamente o ponto da fala. Cada regra recebe ✓ à mão e marca-texto na
// keyword. Fecha com o carimbo 4 REGRAS circulado a caneta.

export const REGRAS_DURATION = 180;

const CUT = 36; // frame do corte seco

const SHEET_X = 88;
const SHEET_Y = 164;
const SHEET_W = 904;
const SHEET_H = 512;

const TEXT_X = 132; // depois do checkbox
const FS = 34; // mono
const ADV = FS * 0.6; // avanço do JetBrains Mono
const ROW_Y = 116; // y da 1ª linha, dentro da folha
const ROW_H = 96;

type Rule = { text: string; kwAt: number; kwLen: number };

const RULES: Rule[] = [
  { text: "faça o mínimo — nada além do pedido", kwAt: 5, kwLen: 8 },
  { text: "siga TODAS as instruções, uma a uma", kwAt: 5, kwLen: 5 },
  { text: 'só diga "pronto" depois de rodar', kwAt: 27, kwLen: 5 },
  { text: "não invente API — verifique na doc", kwAt: 18, kwLen: 9 },
];

const IN_AT = [54, 70, 86, 102];
const CHK_AT = [68, 84, 100, 116];
const HL_AT = [74, 90, 106, 122];

export const Scene02Regras: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 1 — o relógio das 24h.
  const clockIn = spring({ frame: frame - 2, fps, config: { damping: 13, stiffness: 190 } });
  const clockOut = interpolate(frame, [CUT - 6, CUT], [1, 0], CLAMP);
  const clockDraw = interpolate(frame, [4, 22], [0, 1], CLAMP);
  const minHand = frame * 17;
  const hourHand = frame * 1.6;
  const stampIn = spring({ frame: frame - 12, fps, config: { damping: 11, stiffness: 200 } });

  // Corte seco: estouro de luz no papel.
  const flash = interpolate(frame, [CUT - 2, CUT, CUT + 8], [0, 0.85, 0], CLAMP);

  const drop = useDrop(CUT, 1.1);
  const tab = spring({ frame: frame - 48, fps, config: { damping: 12, stiffness: 220 } });

  // Punch final — 4 REGRAS.
  const punch = spring({
    frame: frame - 140,
    fps,
    config: { damping: 11, stiffness: 150, mass: 1.2 },
  });
  const ringP = interpolate(frame, [148, 174], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const breathe = 1 + Math.sin(frame / 11) * 0.014;

  const ring = roughEllipse(540, 794, 374, 108, "regrasring", 11, 1.12);

  return (
    <Paper tone="gray" grid="rule" note="24h">
      {/* Beat 1 — relógio de caneta + carimbo 24H DEPOIS. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1080,
          opacity: clockOut,
          transform: `scale(${(0.6 + 0.4 * clockIn) * (1 + (1 - clockOut) * 0.25)})`,
          transformOrigin: "540px 460px",
        }}
      >
        <svg width={1080} height={760} style={{ position: "absolute", overflow: "visible" }}>
          <Ink path={roughEllipse(540, 400, 128, 128, "clk", 6, 1.12)} p={clockDraw} width={7} />
          <Ink path={roughEllipse(540, 400, 112, 112, "clk2", 8, 1.06)} p={clockDraw} width={3} opacity={0.4} />
          {[0, 1, 2, 3].map((i) => (
            <Ink
              key={i}
              path={roughLine(
                540 + Math.cos((i * Math.PI) / 2) * 92,
                400 + Math.sin((i * Math.PI) / 2) * 92,
                540 + Math.cos((i * Math.PI) / 2) * 112,
                400 + Math.sin((i * Math.PI) / 2) * 112,
                `tick${i}`,
                1.5,
              )}
              p={clockDraw}
              width={5}
            />
          ))}
          <g transform={`rotate(${hourHand} 540 400)`}>
            <Ink path={roughLine(540, 400, 540, 330, "hh", 2)} p={clockDraw} width={8} />
          </g>
          <g transform={`rotate(${minHand} 540 400)`}>
            <Ink path={roughLine(540, 400, 540, 296, "mh", 2)} p={clockDraw} color={INK.red} width={6} />
          </g>
        </svg>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 566,
            width: 1080,
            textAlign: "center",
            fontFamily: marker,
            fontSize: 96,
            color: INK.ink,
            opacity: interpolate(stampIn, [0, 0.3], [0, 1], CLAMP),
            transform: `rotate(-3deg) scale(${interpolate(
              frame - 12,
              [0, 4, 9, 14],
              [1.9, 0.92, 1.05, 1],
              CLAMP,
            )})`,
          }}
        >
          24H DEPOIS
        </div>
      </div>

      {/* Beat 2 — a folha inteira do CLAUDE.md. */}
      <div style={{ position: "absolute", left: SHEET_X, top: SHEET_Y, opacity: drop.opacity }}>
        <div style={{ transform: drop.transform, transformOrigin: "452px 0px" }}>
          <Sheet w={SHEET_W} h={SHEET_H} seed="mdsheet" bg="#FFFDF7">
            {/* Linhas do bloco. */}
            <svg
              width={SHEET_W}
              height={SHEET_H}
              style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
            >
              {RULES.map((r, i) => {
                const y = ROW_Y + i * ROW_H;
                const cp = interpolate(frame, [CHK_AT[i], CHK_AT[i] + 10], [0, 1], CLAMP);
                const bp = interpolate(frame, [IN_AT[i], IN_AT[i] + 10], [0, 1], CLAMP);
                return (
                  <g key={r.text}>
                    <g transform={`translate(52 ${y - 34})`}>
                      <Ink path={roughRect(46, 46, `box${i}`, 2.4, 4)} p={bp} width={4} />
                      <g transform="translate(2 2)">
                        <Ink
                          path={checkPath(44, `chk${i}`)}
                          p={cp}
                          color={INK.green}
                          width={7}
                        />
                      </g>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Aba de arquivo (adesivo) grudada na folha. */}
            <div
              style={{
                position: "absolute",
                left: 44,
                top: -34,
                opacity: interpolate(tab, [0, 0.4], [0, 1], CLAMP),
                transform: `rotate(-1.6deg) translateY(${(1 - tab) * -22}px)`,
              }}
            >
              <Sticky w={286} h={66} color={STICKY.yellow} seed="mdtab" rotate={0}>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: mono,
                    fontWeight: 700,
                    fontSize: 34,
                    color: INK.ink,
                  }}
                >
                  CLAUDE.md
                </div>
              </Sticky>
            </div>

            {/* As 4 regras, em mono, com marca-texto na keyword. */}
            {RULES.map((r, i) => {
              const y = ROW_Y + i * ROW_H;
              const s = spring({
                frame: frame - IN_AT[i],
                fps,
                config: { damping: 16, stiffness: 220 },
              });
              const hp = interpolate(frame, [HL_AT[i], HL_AT[i] + 16], [0, 1], {
                ...CLAMP,
                easing: Easing.out(Easing.cubic),
              });
              return (
                <div
                  key={r.text}
                  style={{
                    position: "absolute",
                    left: TEXT_X,
                    top: y - 30,
                    height: 56,
                    opacity: frame < IN_AT[i] ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
                    transform: `translateX(${(1 - s) * 34}px)`,
                  }}
                >
                  <Highlight
                    id={`rl${i}`}
                    w={r.kwLen * ADV + 14}
                    h={50}
                    p={hp}
                    style={{ left: r.kwAt * ADV - 7, top: 4 }}
                  />
                  <span
                    style={{
                      position: "relative",
                      fontFamily: mono,
                      fontWeight: 500,
                      fontSize: FS,
                      lineHeight: "56px",
                      color: INK.ink,
                      whiteSpace: "pre",
                    }}
                  >
                    {r.text}
                  </span>
                </div>
              );
            })}

            {/* Anotação de margem — a folha inteira numa tela só. */}
            <div
              style={{
                position: "absolute",
                right: 44,
                bottom: 18,
                fontFamily: hand,
                fontWeight: 700,
                fontSize: 42,
                color: INK.faint,
                transform: "rotate(-2deg)",
                opacity: interpolate(frame, [124, 140], [0, 1], CLAMP),
              }}
            >
              é isso. o arquivo todo.
            </div>
          </Sheet>

          <Tape
            w={176}
            h={50}
            seed="mdtape"
            style={{
              right: -48,
              top: -24,
              transform: "rotate(24deg)",
              opacity: interpolate(frame, [CUT + 6, CUT + 14], [0, 1], CLAMP),
            }}
          />
        </div>
      </div>

      {/* TELA: 4 REGRAS. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 706,
          width: 1080,
          textAlign: "center",
          opacity: frame < 140 ? 0 : interpolate(punch, [0, 0.3], [0, 1], CLAMP),
          transform: `rotate(-2.5deg) scale(${(0.55 + 0.45 * punch) * breathe})`,
          transformOrigin: "540px 90px",
        }}
      >
        <span
          style={{
            fontFamily: marker,
            fontSize: 128,
            color: INK.coral,
            letterSpacing: 2,
          }}
        >
          4 REGRAS
        </span>
      </div>
      <svg
        width={1080}
        height={1000}
        style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
      >
        <Ink path={ring} p={ringP} color={INK.ink} width={6} opacity={0.85} />
      </svg>

      {/* Flash do corte seco. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FFFDF5",
          opacity: flash,
          pointerEvents: "none",
        }}
      />
    </Paper>
  );
};
