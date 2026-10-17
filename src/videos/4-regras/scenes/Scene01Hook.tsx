import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, INK, hand, inter } from "../theme";
import { Paper } from "../stage";
import { useDrop, shakeAt } from "../rig";
import {
  Highlight,
  Ink,
  Sheet,
  Tape,
  arrowPaths,
  roughEllipse,
  roughLine,
} from "../paper";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 01 — Hook (150f / 5s, split-safe, papel BRANCO).
// "O melhor engenheiro da Tesla reclamou do Claude num post." A copy pede TELA
// vazia neste bloco: o print do post É o gráfico. Ele é DESENHADO, não um
// screenshot — nome rasurado (ninguém real é identificado), chip TESLA legível,
// reclamação escrita à mão char a char, caneta vermelha circulando o logo do
// Claude e marca-texto no punch. Tudo entre y 150 e 900.

export const HOOK_DURATION = 150;

const IMPACT = 9; // frame em que o cartão bate na mesa

const CARD_X = 96;
const CARD_Y = 196;
const CARD_W = 888;
const CARD_H = 604;
const PAD = 48;

const L1 = "400 linhas pra uma tarefa de 20";
const L2 = "disse que testou.";

const typed = (s: string, frame: number, at: number, perChar: number) =>
  s.slice(0, Math.max(0, Math.floor((frame - at) / perChar)));

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Câmera: push-in agressivo no cartão → assenta e abre de leve no fim.
  const z = interpolate(frame, [0, 40, 120, 150], [1.2, 1.05, 1.03, 1.06], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const sh = shakeAt(frame, IMPACT, 12);
  const camX = Math.sin(frame / 49) * 6 + sh.x;
  const camY = Math.sin(frame / 63 + 1.1) * 7 + sh.y;

  const drop = useDrop(0, -1.6);

  // Fitas crepe batendo nos cantos (estímulo 2 do primeiro frame).
  const tape1 = spring({ frame: frame - 8, fps, config: { damping: 11, stiffness: 260 } });
  const tape2 = spring({ frame: frame - 13, fps, config: { damping: 11, stiffness: 260 } });

  // Cabeçalho do post se desenhando.
  const head = interpolate(frame, [12, 30], [0, 1], CLAMP);

  // Punch "não testou." entrando à mão.
  const punch = spring({
    frame: frame - 66,
    fps,
    config: { damping: 12, stiffness: 160, mass: 1.2 },
  });

  // Caneta vermelha: círculo no logo do Claude → seta → anotação.
  const circle = interpolate(frame, [76, 100], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const arrow = interpolate(frame, [98, 114], [0, 1], CLAMP);
  const noteIn = spring({ frame: frame - 108, fps, config: { damping: 15, stiffness: 200 } });

  // Marca-texto no punch.
  const hl = interpolate(frame, [118, 140], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Engajamento subindo (dado do gráfico, não legenda).
  const likes = interpolate(frame, [30, 150], [8.1, 12.4], CLAMP);
  const reposts = interpolate(frame, [36, 150], [1.4, 3.2], CLAMP);

  // Anotações de caneta vermelha em coordenadas do CARTÃO.
  const ring = roughEllipse(760, 84, 108, 56, "hookring", 9, 1.22);
  const { shaft, head: ahead } = arrowPaths(742, 392, 786, 158, "hookarrow", 46);

  return (
    <Paper tone="white" grid="rule">
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${camX}px, ${camY}px) scale(${z})`,
          transformOrigin: "540px 480px",
        }}
      >
        <div style={{ position: "absolute", left: CARD_X, top: CARD_Y, opacity: drop.opacity }}>
          <div style={{ transform: drop.transform, transformOrigin: "444px 0px" }}>
            <Sheet w={CARD_W} h={CARD_H} seed="postcard" bg="#FFFDF8">
              {/* Cabeçalho: avatar desenhado + nome RASURADO. */}
              <svg
                width={CARD_W}
                height={160}
                style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
              >
                <g transform={`translate(${PAD + 44} 88)`}>
                  <Ink path={roughEllipse(0, 0, 44, 44, "avatar", 4, 1.1)} p={head} width={4} />
                  <Ink path={roughEllipse(-15, -8, 4, 5, "eyeL", 1.5, 1)} p={head} width={4} />
                  <Ink path={roughEllipse(13, -8, 4, 5, "eyeR", 1.5, 1)} p={head} width={4} />
                  <Ink path={roughLine(-16, 18, 16, 14, "mouth", 2, -5)} p={head} width={4} />
                </g>
                <g transform={`translate(${PAD + 108} 62)`}>
                  <Ink path={roughLine(0, 0, 236, 0, "nm1", 3.5, 6, 14)} p={head} width={10} opacity={0.7} />
                  <Ink path={roughLine(4, 11, 228, 8, "nm2", 3.5, -7, 14)} p={head} width={9} opacity={0.55} />
                </g>
              </svg>

              {/* Chip TESLA — a única identificação legível, como na fala. */}
              <div
                style={{
                  position: "absolute",
                  left: PAD + 108,
                  top: 92,
                  padding: "6px 18px",
                  border: `3px solid ${INK.ink}`,
                  borderRadius: 6,
                  fontFamily: inter,
                  fontWeight: 800,
                  fontSize: 26,
                  letterSpacing: 6,
                  color: INK.ink,
                  transform: `rotate(-1.4deg) scale(${interpolate(head, [0.45, 1], [0, 1], CLAMP)})`,
                  transformOrigin: "0 50%",
                }}
              >
                TESLA
              </div>

              {/* Assunto do post: logo oficial do Claude. */}
              <div
                style={{
                  position: "absolute",
                  right: PAD,
                  top: 56,
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: interpolate(frame, [16, 30], [0, 1], CLAMP),
                }}
              >
                <BrandLogo name="claude" size={54} color={INK.coral} />
                <span style={{ fontFamily: inter, fontWeight: 700, fontSize: 30, color: INK.soft }}>
                  claude
                </span>
              </div>

              {/* Corpo: a reclamação escrita à mão, char a char. */}
              <div
                style={{
                  position: "absolute",
                  left: PAD,
                  top: 190,
                  width: CARD_W - PAD * 2,
                  fontFamily: hand,
                  fontWeight: 600,
                  fontSize: 56,
                  lineHeight: 1.2,
                  color: INK.ink,
                  whiteSpace: "pre",
                }}
              >
                <div>{typed(L1, frame, 20, 0.85)}</div>
                <div style={{ marginTop: 4 }}>{typed(L2, frame, 48, 0.85)}</div>
              </div>

              {/* Punch do post + marca-texto amarelo. */}
              <div
                style={{
                  position: "absolute",
                  left: PAD,
                  top: 356,
                  opacity: frame < 66 ? 0 : interpolate(punch, [0, 0.3], [0, 1], CLAMP),
                  transform: `rotate(${-2 + (1 - punch) * -5}deg) scale(${0.6 + 0.4 * punch})`,
                  transformOrigin: "0 60%",
                }}
              >
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Highlight id="hooknao" w={452} h={78} p={hl} style={{ left: -16, top: 28 }} />
                  <span
                    style={{
                      position: "relative",
                      fontFamily: hand,
                      fontWeight: 700,
                      fontSize: 96,
                      color: INK.ink,
                      whiteSpace: "pre",
                    }}
                  >
                    não testou.
                  </span>
                </div>
              </div>

              {/* Engajamento subindo. */}
              <div
                style={{
                  position: "absolute",
                  left: PAD,
                  bottom: 40,
                  display: "flex",
                  gap: 44,
                  fontFamily: hand,
                  fontWeight: 700,
                  fontSize: 46,
                  color: INK.soft,
                  fontVariantNumeric: "tabular-nums",
                  opacity: interpolate(frame, [30, 44], [0, 1], CLAMP),
                }}
              >
                <span>♥ {likes.toFixed(1).replace(".", ",")} mil</span>
                <span>↻ {reposts.toFixed(1).replace(".", ",")} mil</span>
              </div>

              {/* Caneta vermelha por cima de tudo (coordenadas do cartão). */}
              <svg
                width={CARD_W}
                height={CARD_H}
                style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
              >
                <Ink path={ring} p={circle} color={INK.red} width={6} />
                <Ink path={shaft} p={arrow} color={INK.red} width={5} />
                <Ink
                  path={ahead}
                  p={interpolate(arrow, [0.65, 1], [0, 1], CLAMP)}
                  color={INK.red}
                  width={5}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: 520,
                  top: 396,
                  fontFamily: hand,
                  fontWeight: 700,
                  fontSize: 58,
                  color: INK.red,
                  opacity: noteIn,
                  transform: `rotate(-7deg) scale(${0.65 + 0.35 * noteIn})`,
                  transformOrigin: "0 50%",
                  whiteSpace: "pre",
                }}
              >
                de novo…
              </div>
            </Sheet>

            {/* Fitas crepe nos cantos. */}
            <Tape
              w={188}
              h={54}
              seed="tp1"
              style={{
                left: -56,
                top: -26,
                opacity: tape1,
                transform: `rotate(${-26 - (1 - tape1) * 22}deg) scale(${0.6 + 0.4 * tape1})`,
              }}
            />
            <Tape
              w={188}
              h={54}
              seed="tp2"
              style={{
                right: -56,
                top: -30,
                opacity: tape2,
                transform: `rotate(${22 + (1 - tape2) * 24}deg) scale(${0.6 + 0.4 * tape2})`,
              }}
            />
          </div>
        </div>
      </div>
    </Paper>
  );
};
