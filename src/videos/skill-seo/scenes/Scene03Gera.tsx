import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, geist, mono, SPRING } from "../theme";
import { GlassPanel, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig } from "../rig";
import { Label, Magnifier } from "../search";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 03 — O que a skill gera (246f / 8,2s · blocos 4–6 do handoff).
// Quatro batidas encadeadas: o relatório é sugado pela faísca → 30 cartões de
// post → o FAQ com as perguntas que o público digita → o site subindo na lista
// de procura. Cada batida come a anterior; nada fica parado em tela.

export const GERA_DURATION = 246;

const SUGA = 10; // o relatório começa a ser puxado
const ESTOURO = 36; // a faísca estoura e abre a grade
const FAQ = 104; // entra o cartão de FAQ
const LISTA = 182; // entra a lista de procura
const SOBE = 198; // o site começa a subir

const COLS = 6;
const ROWS = 5;
const CARD_W = 140;
const CARD_H = 48;
const GAP = 14;
const GRID_X = (1080 - (COLS * CARD_W + (COLS - 1) * GAP)) / 2;
const GRID_Y = 496;

const PERGUNTAS = [
  "Quanto custa uma cozinha planejada?",
  "Vale a pena fazer planejado?",
  "Em quanto tempo fica pronta?",
];

const LISTA_ITENS = [
  { n: "outro site", meu: false },
  { n: "concorrente", meu: false },
  { n: "outro site", meu: false },
  { n: "SEU SITE", meu: true },
];
// Antes: [0,1,2,3]. Depois: o seu site assume o topo e os outros descem.
const DEPOIS = [1, 2, 3, 0];
const SLOT_Y = 300;
const SLOT_STEP = 88;

export const Scene03Gera: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  // --- batida 1: o relatório é sugado --------------------------------------
  const suga = interpolate(frame, [SUGA, ESTOURO], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const faiscaHot = interpolate(
    frame,
    [ESTOURO - 6, ESTOURO, ESTOURO + 22],
    [0, 1, 0.18],
    CLAMP,
  );

  // A faísca sobe pro topo depois de estourar e vira o "motor" da cena.
  const faiscaY = interpolate(frame, [ESTOURO, ESTOURO + 16], [520, 296], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // --- batida 2: a grade de posts ------------------------------------------
  const grade = interpolate(frame, [ESTOURO, ESTOURO + 6, FAQ - 8, FAQ], [0, 1, 1, 0], CLAMP);
  const feitos = Math.max(
    0,
    Math.min(30, Math.floor(interpolate(frame, [ESTOURO + 2, ESTOURO + 58], [0, 30], CLAMP))),
  );

  // --- batida 3: o FAQ ------------------------------------------------------
  const faq = interpolate(frame, [FAQ, FAQ + 10, LISTA - 8, LISTA], [0, 1, 1, 0], CLAMP);
  const faqSpring = spring({ frame: frame - FAQ, fps, config: SPRING.soft });

  // --- batida 4: a lista de procura ----------------------------------------
  const lista = interpolate(frame, [LISTA, LISTA + 10], [0, 1], CLAMP);
  const sobe = interpolate(frame, [SOBE, SOBE + 30], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="seo-gera" energy={1.35} />

      <Rig
        impacts={[ESTOURO, FAQ, LISTA, SOBE + 30]}
        push={[1.12, 1.01]}
        pushFrames={64}
        origin="540px 430px"
      >
        {/* ---- o relatório sendo sugado ---- */}
        <div
          style={{
            position: "absolute",
            left: 290,
            top: 196,
            width: 500,
            opacity: interpolate(frame, [0, 6], [0, 1], CLAMP) * (1 - suga),
            transform: `translate(${suga * 0}px, ${suga * 300}px) scale(${1 - suga * 0.62})`,
            transformOrigin: "50% 100%",
          }}
        >
          <GlassPanel
            radius={26}
            blur={24}
            sweep={frame * 2}
            style={{ height: 152 }}
            contentStyle={{
              height: "100%",
              padding: "22px 26px",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <Label size={20} color={COLORS.faint}>
              RELATÓRIO
            </Label>
            {[1, 0.74, 0.52].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 12,
                  width: `${w * 100}%`,
                  borderRadius: 6,
                  background: `rgba(255,255,255,${0.34 - i * 0.08})`,
                }}
              />
            ))}
          </GlassPanel>
        </div>

        {/* Feixe de sucção. */}
        <div
          style={{
            position: "absolute",
            left: 528,
            top: 340,
            width: 24,
            height: 190,
            borderRadius: 12,
            background: `linear-gradient(180deg, rgba(${COLORS.coralRGB},0), rgba(${COLORS.coralRGB},0.75))`,
            filter: "blur(6px)",
            opacity: interpolate(frame, [SUGA, SUGA + 6, ESTOURO], [0, 0.9, 0], CLAMP),
          }}
        />

        {/* ---- a faísca ---- */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: faiscaY,
            transform: `translate(-50%, -50%) scale(${
              (frame < ESTOURO ? 0.9 : 0.72) + faiscaHot * 0.4 + pulse * 0.04
            }) rotate(${frame * 0.7}deg)`,
            filter: `drop-shadow(0 0 ${30 + 90 * faiscaHot}px rgba(${COLORS.coralRGB},${(
              0.5 + 0.45 * faiscaHot
            ).toFixed(2)}))`,
            opacity: interpolate(frame, [LISTA - 10, LISTA], [1, 0], CLAMP),
          }}
        >
          <BrandLogo name="claude" size={132} color={COLORS.coral} />
        </div>

        {/* ---- batida 2: 30 ideias de posts ---- */}
        <div style={{ position: "absolute", inset: 0, opacity: grade }}>
          <div
            style={{
              position: "absolute",
              top: 384,
              left: 0,
              width: 1080,
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 76,
                letterSpacing: -3,
                color: COLORS.coral,
                textShadow: `0 0 ${44 + 40 * pulse}px rgba(${COLORS.coralRGB},0.7)`,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {feitos}
            </span>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 700,
                fontSize: 42,
                letterSpacing: -1,
                color: COLORS.text,
                marginLeft: 18,
              }}
            >
              IDEIAS DE POSTS
            </span>
          </div>

          {Array.from({ length: COLS * ROWS }, (_, i) => {
            const at = ESTOURO + 2 + i * 1.85;
            const s = spring({ frame: frame - at, fps, config: SPRING.snap });
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const lit = i % 7 === 3 ? 1 : 0;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: GRID_X + col * (CARD_W + GAP),
                  top: GRID_Y + row * (CARD_H + GAP),
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 12,
                  background: lit
                    ? `linear-gradient(140deg, rgba(${COLORS.coralRGB},0.4), rgba(${COLORS.coralRGB},0.12))`
                    : "linear-gradient(140deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05))",
                  boxShadow: lit
                    ? `inset 0 1px 0 rgba(255,255,255,0.35), 0 0 26px rgba(${COLORS.coralRGB},0.5)`
                    : "inset 0 1px 0 rgba(255,255,255,0.22), 0 8px 20px rgba(0,0,0,0.6)",
                  opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
                  transform: `scale(${0.4 + 0.6 * s}) rotate(${(1 - s) * (col % 2 ? 8 : -8)}deg)`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: 7,
                  padding: "0 12px",
                }}
              >
                <div
                  style={{
                    height: 6,
                    width: "78%",
                    borderRadius: 3,
                    background: lit ? COLORS.coralLight : "rgba(255,255,255,0.5)",
                  }}
                />
                <div
                  style={{
                    height: 6,
                    width: "52%",
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.26)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ---- batida 3: o FAQ ---- */}
        <div style={{ position: "absolute", inset: 0, opacity: faq }}>
          <div
            style={{
              position: "absolute",
              top: 404,
              left: 90,
              width: 900,
              transform: `translateY(${(1 - faqSpring) * 40}px)`,
            }}
          >
            <GlassPanel
              radius={34}
              blur={30}
              hot={0.2}
              sweep={frame * 2.3}
              style={{ height: 388 }}
              contentStyle={{
                height: "100%",
                padding: "30px 36px",
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span
                  style={{
                    fontFamily: geist,
                    fontWeight: 900,
                    fontSize: 46,
                    letterSpacing: -1,
                    color: COLORS.coralLight,
                  }}
                >
                  FAQ
                </span>
                <Label size={22} color={COLORS.muted}>
                  AS PERGUNTAS QUE ELES DIGITAM
                </Label>
              </div>

              {PERGUNTAS.map((p, i) => {
                const at = FAQ + 12 + i * 16;
                const s = spring({ frame: frame - at, fps, config: SPRING.snap });
                const abre = interpolate(frame, [at + 8, at + 24], [0, 1], {
                  ...CLAMP,
                  easing: Easing.out(Easing.cubic),
                });
                return (
                  <div
                    key={p}
                    style={{
                      opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                      transform: `translateX(${(1 - s) * -30}px)`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <Magnifier size={26} color={COLORS.coralLight} />
                      <span
                        style={{
                          fontFamily: geist,
                          fontWeight: 600,
                          fontSize: 34,
                          letterSpacing: -0.5,
                          color: COLORS.text,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p}
                      </span>
                    </div>
                    {/* A resposta se abrindo por baixo da pergunta. */}
                    <div
                      style={{
                        marginTop: 10,
                        marginLeft: 40,
                        height: 9,
                        width: `${abre * 74}%`,
                        borderRadius: 5,
                        background: "rgba(255,255,255,0.3)",
                      }}
                    />
                  </div>
                );
              })}
            </GlassPanel>
          </div>
        </div>

        {/* ---- batida 4: a lista de procura ---- */}
        <div style={{ position: "absolute", inset: 0, opacity: lista }}>
          <div
            style={{
              position: "absolute",
              top: 196,
              left: 0,
              width: 1080,
              textAlign: "center",
            }}
          >
            <Label size={28}>NAS PROCURAS DO GOOGLE</Label>
          </div>

          {LISTA_ITENS.map((item, i) => {
            const slot = i + (DEPOIS[i] - i) * sobe;
            const y = SLOT_Y + slot * SLOT_STEP;
            const topo = item.meu ? sobe : 0;
            return (
              <div
                key={item.n}
                style={{
                  position: "absolute",
                  left: 130,
                  top: y,
                  width: 820,
                  transform: `scale(${1 + topo * 0.06})`,
                  transformOrigin: "50% 50%",
                }}
              >
                <GlassPanel
                  radius={22}
                  blur={20}
                  hot={topo * 0.7}
                  tint={topo}
                  sweep={frame * 2 + i * 40}
                  lens={false}
                  style={{ height: 74 }}
                  contentStyle={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 22,
                    padding: "0 28px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 30,
                      color: topo > 0.5 ? COLORS.coralLight : COLORS.faint,
                      width: 54,
                    }}
                  >
                    {Math.round(slot) + 1}º
                  </span>
                  <span
                    style={{
                      fontFamily: geist,
                      fontWeight: item.meu ? 800 : 500,
                      fontSize: 36,
                      letterSpacing: -0.5,
                      color: item.meu ? COLORS.text : COLORS.muted,
                      textShadow: topo > 0.5 ? `0 0 26px rgba(${COLORS.coralRGB},0.6)` : undefined,
                    }}
                  >
                    {item.n}
                  </span>
                </GlassPanel>
              </div>
            );
          })}
        </div>
      </Rig>

      <Flash at={ESTOURO} len={6} peak={0.66} />
      <Flash at={FAQ} len={4} peak={0.32} />
      <Flash at={LISTA} len={4} peak={0.38} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
