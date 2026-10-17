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
import { Flash, Rig, Word } from "../rig";

// Cena 02 — A PROVA (360f / 12s). O take que decide o vídeo: o plugin listou
// quem devia e escreveu um follow-up DIFERENTE pra cada um. Nomes de cliente
// entram tarjados (regra dura do vault: nunca citar cliente) — e a tarja ainda
// reforça que é tela real. Batidas: lista entra → scanner varre → cada linha
// acende e cospe seu follow-up sendo digitado → fecho "cada um diferente".

export const PROVA_DURATION = 360;

const CLIENTES = [
  { valor: "1.240", dias: 14, at: 22 },
  { valor: "3.800", dias: 9, at: 34 },
  { valor: "620", dias: 27, at: 46 },
  { valor: "2.150", dias: 5, at: 58 },
];

const FOLLOWUPS = [
  "Oi! A fatura de R$ 1.240 venceu há 14 dias. Quer que eu gere um novo boleto?",
  "Bom dia! Vi que os R$ 3.800 estão em aberto. Posso dividir em 2× pra facilitar?",
  "Olá! São 27 dias da fatura de R$ 620 — deixo o Pix aqui embaixo?",
];

const FU_START = 116;
const FU_LEN = 72;

const SCAN = 76;

export const Scene02Prova: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const painel = spring({ frame: frame - 12, fps, config: SPRING.soft });

  // Varredura do scanner descendo pelas linhas.
  const scanP = interpolate(frame, [SCAN, SCAN + 30], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const scanning = frame >= SCAN && frame <= SCAN + 30;

  // Qual follow-up está em cena.
  const fuIdx = Math.min(
    FOLLOWUPS.length - 1,
    Math.max(0, Math.floor((frame - FU_START) / FU_LEN)),
  );
  const fuLocal = frame - FU_START - fuIdx * FU_LEN;
  const fuAtivo = frame >= FU_START;
  const texto = FOLLOWUPS[fuIdx];
  const chars = Math.round(
    interpolate(fuLocal, [8, 50], [0, texto.length], CLAMP),
  );
  const fuIn = spring({ frame: fuLocal, fps, config: SPRING.snap });

  const fecho = spring({ frame: frame - 312, fps, config: SPRING.bouncy });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="prova" energy={1.15} />

      <Rig
        impacts={[12, SCAN, FU_START, FU_START + FU_LEN, FU_START + FU_LEN * 2, 312]}
        push={[1.08, 1.01]}
        amount={0.85}
        origin="540px 400px"
      >
        {/* Cabeçalho. */}
        <div
          style={{
            position: "absolute",
            top: 124,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [0, 10], [0, 1], CLAMP),
          }}
        >
          <GlassPill blur={20} sweep={frame * 1.5} style={{ padding: "13px 30px" }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                background: COLORS.coral,
                boxShadow: `0 0 ${12 + 14 * pulse}px rgba(${COLORS.coralRGB},0.9)`,
              }}
            />
            <span
              style={{
                fontFamily: mono,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 5,
                color: COLORS.text2,
              }}
            >
              EM ABERTO
            </span>
            <span style={{ color: COLORS.faint, fontSize: 26 }}>·</span>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 800,
                fontSize: 32,
                color: COLORS.coralLight,
              }}
            >
              4 CLIENTES
            </span>
          </GlassPill>
        </div>

        {/* Lista de inadimplentes. */}
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 206,
            width: 896,
            opacity: interpolate(painel, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - painel) * 40}px)`,
          }}
        >
          <GlassPanel
            radius={38}
            blur={30}
            sweep={frame * 1.7}
            hot={scanning ? 0.35 : 0.05}
            style={{ height: 344 }}
          >
            <div style={{ position: "relative", height: "100%", padding: "24px 30px" }}>
              {CLIENTES.map((c, i) => {
                const s = spring({ frame: frame - c.at, fps, config: SPRING.snap });
                // A linha acende quando o follow-up dela está sendo escrito.
                const ativa = fuAtivo && i === fuIdx && fuIdx < FOLLOWUPS.length;
                return (
                  <div
                    key={i}
                    style={{
                      position: "relative",
                      height: 74,
                      display: "flex",
                      alignItems: "center",
                      gap: 18,
                      paddingLeft: 16,
                      paddingRight: 16,
                      borderRadius: 18,
                      background: ativa
                        ? `rgba(${COLORS.coralRGB},${(0.13 + 0.07 * pulse).toFixed(3)})`
                        : "transparent",
                      boxShadow: ativa
                        ? `inset 0 0 0 1px rgba(${COLORS.coralRGB},0.45)`
                        : "none",
                      opacity: frame < c.at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                      transform: `translateX(${(1 - s) * -34}px)`,
                    }}
                  >
                    {/* Nome tarjado. */}
                    <span
                      style={{
                        fontFamily: mono,
                        fontWeight: 500,
                        fontSize: 32,
                        letterSpacing: 1,
                        color: COLORS.muted,
                      }}
                    >
                      CLIENTE
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontWeight: 700,
                        fontSize: 32,
                        color: "rgba(255,255,255,0.72)",
                        filter: "blur(5px)",
                        letterSpacing: 2,
                      }}
                    >
                      ██████
                    </span>
                    <span style={{ flex: 1 }} />
                    <span
                      style={{
                        fontFamily: geist,
                        fontWeight: 700,
                        fontSize: 38,
                        color: COLORS.text,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      R$ {c.valor}
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontWeight: 500,
                        fontSize: 28,
                        color: COLORS.coral,
                        minWidth: 132,
                        textAlign: "right",
                      }}
                    >
                      {c.dias} dias
                    </span>
                  </div>
                );
              })}

              {/* Varredura do scanner. */}
              {scanning ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: scanP * 344,
                    height: 5,
                    background: `linear-gradient(90deg, transparent, ${COLORS.coralLight}, transparent)`,
                    boxShadow: `0 0 34px rgba(${COLORS.coralRGB},0.9)`,
                  }}
                />
              ) : null}
            </div>
          </GlassPanel>
        </div>

        {/* Conector: da linha ativa desce até o card. */}
        {fuAtivo && fuIdx < FOLLOWUPS.length ? (
          <div
            style={{
              position: "absolute",
              left: 540,
              top: 550,
              width: 3,
              height: interpolate(fuLocal, [0, 12], [0, 24], CLAMP),
              marginLeft: -1.5,
              background: `linear-gradient(180deg, rgba(${COLORS.coralRGB},0.9), rgba(${COLORS.coralRGB},0.2))`,
              boxShadow: `0 0 18px rgba(${COLORS.coralRGB},0.7)`,
            }}
          />
        ) : null}

        {/* Card do follow-up gerado. */}
        {fuAtivo ? (
          <div
            style={{
              position: "absolute",
              left: 92,
              top: 574,
              width: 896,
              opacity: interpolate(fuIn, [0, 0.3], [0, 1], CLAMP),
              transform: `translateY(${(1 - fuIn) * 34}px) scale(${0.95 + 0.05 * fuIn})`,
            }}
          >
            <GlassPanel
              radius={34}
              blur={26}
              tint={0.5}
              hot={interpolate(fuLocal, [0, 8, 22], [0.9, 0.4, 0.08], CLAMP)}
              sweep={frame * 2.2}
              style={{ height: 268 }}
            >
              <div style={{ padding: "26px 32px", height: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 20,
                  }}
                >
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: 500,
                      fontSize: 25,
                      letterSpacing: 4,
                      color: COLORS.coralLight,
                    }}
                  >
                    FOLLOW-UP {fuIdx + 1}/{FOLLOWUPS.length}
                  </span>
                  <span style={{ flex: 1 }} />
                  <span
                    style={{
                      fontFamily: mono,
                      fontSize: 25,
                      letterSpacing: 3,
                      color: COLORS.muted,
                    }}
                  >
                    CLIENTE
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 25,
                      color: "rgba(255,255,255,0.7)",
                      filter: "blur(4px)",
                    }}
                  >
                    █████
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: geist,
                    fontWeight: 500,
                    fontSize: 40,
                    lineHeight: 1.32,
                    color: COLORS.text,
                    letterSpacing: -0.4,
                  }}
                >
                  {texto.slice(0, chars)}
                  <span
                    style={{
                      display: "inline-block",
                      width: 3,
                      height: 38,
                      marginLeft: 4,
                      verticalAlign: -6,
                      background: COLORS.coralLight,
                      opacity: chars < texto.length ? (frame % 12 < 7 ? 1 : 0.15) : 0,
                    }}
                  />
                </div>
              </div>
            </GlassPanel>
          </div>
        ) : null}

        {/* Fecho: o ponto da fala é que cada um é DIFERENTE. */}
        <div
          style={{
            position: "absolute",
            top: 842,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < 312 ? 0 : interpolate(fecho, [0, 0.35], [0, 1], CLAMP),
            transform: `scale(${0.8 + 0.2 * fecho})`,
          }}
        >
          <GlassPill blur={22} tint={0.7} hot={0.3} sweep={frame * 2.6} style={{ padding: "14px 32px" }}>
            <Word
              at={312}
              config={SPRING.bouncy}
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 44,
                color: COLORS.coralLight,
                textShadow: `0 0 ${26 + 24 * pulse}px rgba(${COLORS.coralRGB},0.7)`,
              }}
            >
              CADA UM DIFERENTE
            </Word>
          </GlassPill>
        </div>
      </Rig>

      <Flash at={SCAN} len={3} peak={0.2} />
      <Flash at={FU_START} len={4} peak={0.3} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
