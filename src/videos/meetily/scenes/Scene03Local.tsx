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
import { GlassPanel, GlassPill, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, impulse, Rig } from "../rig";
import { Machine, Waveform, Wifi } from "../audio";

// Cena 03 — O DIFERENCIAL (330f / 11s). Cena-assinatura: a máquina de vidro
// dentro de um cerco. Os pacotes de áudio orbitam DENTRO; quando tentam sair na
// direção de um servidor, batem na parede, ela acende em coral e eles voltam —
// e o servidor apaga. Depois o wi-fi desliga e nada para, que é o argumento
// inteiro da fala.
//
// O cerco é desenhado em SVG de propósito: a primeira versão usava border +
// mask-composite e sumia da tela (o mask radial come o próprio border).

export const LOCAL_DURATION = 330;

// Trava 4 do roteiro: a copy afirma "sem mensalidade, sem conta". Se o tier
// grátis não bastar, é aqui que se troca (ou se apaga o chip) — 1 linha.
const PRECO = ["SEM MENSALIDADE", "SEM CONTA"];

const CX = 540;
const CY = 450;
const R = 270; // raio do cerco = a fronteira do teu computador

const FUGAS = [
  { at: 62, x: 132, y: 240 },
  { at: 96, x: 948, y: 240 },
  { at: 130, x: 948, y: 630 },
];

const WIFI = { x: 132, y: 630 };

const CHIP1 = 168; // "não sobe pra lugar nenhum"
const WIFI_OFF = 206; // wi-fi desliga
const CHIP2 = 244; // "sem internet, continua rodando"
const CHIP3 = 282; // preço

export const Scene03Local: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entra = spring({ frame: frame - 4, fps, config: SPRING.gel });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const cerco = interpolate(frame, [8, 40], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Batida na parede: soma dos impactos das três fugas.
  let parede = 0;
  for (const f of FUGAS) parede = Math.max(parede, impulse(frame, f.at + 15, 20));

  const off = interpolate(frame, [WIFI_OFF, WIFI_OFF + 10], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const chips = [
    { at: CHIP1, texto: "NÃO SOBE PRA LUGAR NENHUM", forte: true },
    { at: CHIP2, texto: "SEM INTERNET · CONTINUA RODANDO", forte: false },
  ];

  const circ = 2 * Math.PI * R;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="mt-local" energy={1.15} grid={false} />

      <Rig
        impacts={[...FUGAS.map((f) => f.at + 15), WIFI_OFF, CHIP3]}
        push={[1.06, 1.0]}
        amount={0.8}
        origin="540px 450px"
      >
        {/* Rótulo. */}
        <div
          style={{
            position: "absolute",
            top: 128,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: mono,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: 7,
            color: COLORS.muted,
            opacity: interpolate(frame, [0, 12], [0, 1], CLAMP),
          }}
        >
          A CONVERSA COM O TEU CLIENTE
        </div>

        {/* --- Servidores lá fora: apagam quando o pacote bate e volta --- */}
        {FUGAS.map((s, i) => {
          const morto = interpolate(frame, [s.at + 15, s.at + 32], [0, 1], CLAMP);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.x - 66,
                top: s.y - 74,
                width: 132,
                opacity: interpolate(frame, [18 + i * 6, 30 + i * 6], [0, 1], CLAMP) *
                  (1 - morto * 0.62),
                transform: `translateY(${Math.sin(frame / 30 + i) * 5}px) scale(${
                  1 - morto * 0.08
                })`,
                filter: `saturate(${1 - morto}) brightness(${1 - morto * 0.5})`,
              }}
            >
              <div style={{ position: "relative" }}>
                <GlassPanel
                  radius={24}
                  blur={16}
                  lens={false}
                  sweep={frame * 1.4 + i * 40}
                  style={{ height: 112 }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      gap: 9,
                      padding: "0 20px",
                    }}
                  >
                    {[0, 1, 2].map((k) => (
                      <div
                        key={k}
                        style={{
                          height: 17,
                          borderRadius: 5,
                          background: "rgba(255,255,255,0.1)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 4,
                            background: COLORS.text2,
                            opacity:
                              0.4 + 0.6 * Math.abs(Math.sin(frame / 9 + k + i)),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </GlassPanel>

                {/* Corte coral quando o pacote volta: esse servidor não recebe. */}
                <div
                  style={{
                    position: "absolute",
                    left: 10,
                    top: 54,
                    width: 112,
                    height: 5,
                    borderRadius: 3,
                    transformOrigin: "left center",
                    transform: `rotate(-26deg) scaleX(${morto})`,
                    background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
                    boxShadow: `0 0 20px rgba(${COLORS.coralRGB},0.9)`,
                  }}
                />
              </div>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontFamily: mono,
                  fontSize: 21,
                  letterSpacing: 3,
                  color: morto > 0.5 ? COLORS.faint : COLORS.muted,
                }}
              >
                SERVIDOR
              </div>
            </div>
          );
        })}

        {/* --- Wi-fi: o quarto canto --- */}
        <div
          style={{
            position: "absolute",
            left: WIFI.x - 60,
            top: WIFI.y - 66,
            width: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: interpolate(frame, [30, 42], [0, 1], CLAMP),
          }}
        >
          <Wifi size={86} off={off} />
          <span
            style={{
              fontFamily: mono,
              fontSize: 21,
              letterSpacing: 3,
              color: off > 0.5 ? COLORS.coralLight : COLORS.muted,
            }}
          >
            {off > 0.5 ? "OFFLINE" : "WI-FI"}
          </span>
        </div>

        {/* --- O cerco --- */}
        <svg
          width={R * 2 + 40}
          height={R * 2 + 40}
          style={{ position: "absolute", left: CX - R - 20, top: CY - R - 20 }}
        >
          {/* Campo interno: dá volume ao "dentro". */}
          <circle
            cx={R + 20}
            cy={R + 20}
            r={R}
            fill={`rgba(${COLORS.coralRGB},${(0.028 + 0.09 * parede).toFixed(3)})`}
            opacity={cerco}
          />
          {/* Parede. */}
          <circle
            cx={R + 20}
            cy={R + 20}
            r={R}
            fill="none"
            stroke={`rgba(255,255,255,${(0.24 + 0.5 * parede).toFixed(3)})`}
            strokeWidth={2.5}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - cerco)}
            transform={`rotate(-90 ${R + 20} ${R + 20})`}
            style={{
              filter: `drop-shadow(0 0 ${(10 + 40 * parede).toFixed(0)}px rgba(${
                COLORS.coralRGB
              },${(0.35 + 0.6 * parede).toFixed(2)}))`,
            }}
          />
          {/* Marcação girando — a parede está viva, não é um desenho parado. */}
          <circle
            cx={R + 20}
            cy={R + 20}
            r={R}
            fill="none"
            stroke={COLORS.coralLight}
            strokeWidth={7}
            strokeDasharray="3 26"
            opacity={(0.3 + 0.5 * parede) * cerco}
            transform={`rotate(${frame * 0.4} ${R + 20} ${R + 20})`}
          />
        </svg>

        {/* Ondulações do ponto onde o pacote bateu. */}
        {FUGAS.map((f, i) => {
          const p = interpolate(frame, [f.at + 15, f.at + 42], [0, 1], CLAMP);
          if (p <= 0 || p >= 1) return null;
          const ang = Math.atan2(f.y - CY, f.x - CX);
          const d = 130 + p * 110;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CX + Math.cos(ang) * R - d / 2,
                top: CY + Math.sin(ang) * R - d / 2,
                width: d,
                height: d,
                borderRadius: "50%",
                border: `3px solid rgba(${COLORS.coralRGB},${(0.9 * (1 - p)).toFixed(3)})`,
                boxShadow: `0 0 44px rgba(${COLORS.coralRGB},${(0.6 * (1 - p)).toFixed(3)})`,
              }}
            />
          );
        })}

        {/* --- Pacotes de áudio: orbitam dentro, e voltam quando tentam sair --- */}
        {Array.from({ length: 8 }, (_, i) => {
          const base = (i / 8) * Math.PI * 2;
          // Órbita ELÍPTICA, rente à parede: no centro fica a máquina, então um
          // círculo pequeno esconderia os pacotes atrás dela.
          const rx = 236 + (i % 3) * 12;
          const ry = 196 + (i % 3) * 10;
          const vel = 0.017 + (i % 4) * 0.004;
          const ang0 = base + frame * vel;
          let ang = ang0;
          const orbita = (a: number) =>
            1 / Math.hypot(Math.cos(a) / rx, Math.sin(a) / ry);
          let dist = orbita(ang);

          const fuga = FUGAS[i];
          if (fuga && frame >= fuga.at) {
            // Alvo trazido para a volta mais próxima, senão o pacote dá um giro
            // inteiro na interpolação.
            const cru = Math.atan2(fuga.y - CY, fuga.x - CX);
            const alvo = cru + Math.round((ang0 - cru) / (Math.PI * 2)) * Math.PI * 2;
            const ida = interpolate(frame, [fuga.at, fuga.at + 15], [0, 1], {
              ...CLAMP,
              easing: Easing.in(Easing.cubic),
            });
            const volta = interpolate(frame, [fuga.at + 15, fuga.at + 46], [0, 1], {
              ...CLAMP,
              easing: Easing.out(Easing.cubic),
            });
            ang = ang0 * (1 - ida) + alvo * ida + volta * 0.9;
            const orb = orbita(ang);
            dist = orb + (R - 22 - orb) * ida * (1 - volta);
          }

          const sz = 22 + (i % 3) * 6;
          const fujao = Boolean(fuga);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CX + Math.cos(ang) * dist - sz / 2,
                top: CY + Math.sin(ang) * dist - sz / 2,
                width: sz,
                height: sz,
                borderRadius: sz,
                background: fujao
                  ? `radial-gradient(circle at 35% 30%, #FFFFFF, ${COLORS.coral})`
                  : "radial-gradient(circle at 35% 30%, #FFFFFF, rgba(255,255,255,0.5))",
                boxShadow: fujao
                  ? `0 0 26px rgba(${COLORS.coralRGB},0.95)`
                  : "0 0 20px rgba(255,255,255,0.6)",
                opacity: interpolate(frame, [14, 28], [0, 0.95], CLAMP),
              }}
            />
          );
        })}

        {/* --- A máquina --- */}
        <div
          style={{
            position: "absolute",
            left: CX - 220,
            top: CY - 162,
            width: 440,
            opacity: interpolate(entra, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - entra) * 46}px) scale(${
              0.82 + 0.18 * entra
            })`,
          }}
        >
          <Machine width={440} hot={parede * 0.6} sweep={frame * 2.2}>
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 17,
              }}
            >
              <Waveform width={352} height={62} bars={28} amp={0.92} speed={1.1} seed={2.4} />
              {/* A ata continua se escrevendo — inclusive com o wi-fi desligado. */}
              {[0, 1, 2].map((i) => {
                const ini = 60 + i * 46;
                const w = interpolate(frame, [ini, ini + 52], [0, 1], {
                  ...CLAMP,
                  easing: Easing.out(Easing.cubic),
                });
                const cont = interpolate(frame, [WIFI_OFF, WIFI_OFF + 60], [0, 1], CLAMP);
                const total = Math.min(1, w + cont * 0.35);
                return (
                  <div
                    key={i}
                    style={{
                      height: 14,
                      width: `${(58 + i * 14) * total}%`,
                      borderRadius: 7,
                      background:
                        i === 0
                          ? `linear-gradient(90deg, ${COLORS.coral}, ${COLORS.coralLight})`
                          : "rgba(255,255,255,0.42)",
                      boxShadow:
                        i === 0 ? `0 0 16px rgba(${COLORS.coralRGB},0.7)` : "none",
                    }}
                  />
                );
              })}
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 21,
                  letterSpacing: 3,
                  color: COLORS.muted,
                }}
              >
                O TEU COMPUTADOR
              </span>
            </div>
          </Machine>
        </div>

        {/* --- Chip do argumento: um slot só, a segunda frase TROCA a primeira
             (a troca é a batida visual do wi-fi desligando) --- */}
        <div style={{ position: "absolute", top: 742, left: 0, width: 1080, height: 86 }}>
          {chips.map((c, i) => {
            const s = spring({ frame: frame - c.at, fps, config: SPRING.bouncy });
            const sai = i === 0 ? interpolate(frame, [CHIP2 - 8, CHIP2], [1, 0], CLAMP) : 1;
            return (
              <div
                key={c.texto}
                style={{
                  position: "absolute",
                  left: 0,
                  width: 1080,
                  display: "flex",
                  justifyContent: "center",
                  opacity:
                    frame < c.at ? 0 : interpolate(s, [0, 0.3], [0, 1], CLAMP) * sai,
                  transform: `translateY(${(1 - s) * 30 - (1 - sai) * 26}px) scale(${
                    0.86 + 0.14 * s
                  })`,
                }}
              >
                <GlassPill
                  blur={22}
                  tint={0.9}
                  hot={0.2 + 0.2 * pulse}
                  sweep={frame * 2.2 + c.at}
                  style={{ padding: "14px 32px" }}
                >
                  <span
                    style={{
                      fontFamily: geist,
                      fontWeight: 800,
                      fontSize: c.forte ? 42 : 36,
                      letterSpacing: -0.5,
                      color: COLORS.text,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.texto}
                  </span>
                </GlassPill>
              </div>
            );
          })}
        </div>

        {/* Preço — trava 4 do roteiro vive na constante PRECO. */}
        <div
          style={{
            position: "absolute",
            top: 836,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            gap: 14,
          }}
        >
          {PRECO.map((p, i) => {
            const at = CHIP3 + i * 12;
            const s = spring({ frame: frame - at, fps, config: SPRING.snap });
            return (
              <div
                key={p}
                style={{
                  opacity: frame < at ? 0 : interpolate(s, [0, 0.3], [0, 1], CLAMP),
                  transform: `translateY(${(1 - s) * 24}px)`,
                }}
              >
                <GlassPill blur={18} sweep={frame * 2 + i * 30} style={{ padding: "11px 26px" }}>
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 27,
                      letterSpacing: 3,
                      color: COLORS.coralLight,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p}
                  </span>
                </GlassPill>
              </div>
            );
          })}
        </div>
      </Rig>

      <Flash at={WIFI_OFF} len={5} peak={0.5} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
