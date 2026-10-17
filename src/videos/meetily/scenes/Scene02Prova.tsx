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
import { Flash, Rig } from "../rig";
import { Waveform } from "../audio";

// Cena 02 — A PROVA (390f / 13s). O take que decide o vídeo: acabou a call,
// abriu, a ata já estava lá. A onda da cena 01 volta por 40 frames e COLAPSA em
// linha — é a transição visual de "conversa" para "ata". Depois os três blocos
// se escrevem sozinhos. Nome de cliente sempre tarjado (regra dura do vault) —
// e a tarja ainda reforça que é tela real.

export const PROVA_DURATION = 390;

const WIN = { x: 58, y: 190, w: 964, h: 672 };
const BAR = 64;

const COLAPSO = 30; // a onda vira linha
const CABECA = 52; // cabeçalho da ata
const B1 = 74; // bloco: o que ficou combinado
const B2 = 196; // bloco: quem faz o quê
const B3 = 274; // bloco: prazo
const CARIMBO = 322; // "eu não anotei nada"

const COMBINADO = [
  "Fase 1 fechada — fase 2 só depois do aceite",
  "Valor revisado, com desconto à vista",
  "Acompanhamento toda quinta, 30 minutos",
];

const TAREFAS = [
  { dono: "EU", texto: "Mandar a proposta revisada" },
  { dono: "CLIENTE", texto: "Enviar os acessos da conta" },
];

const PRAZOS = ["PROPOSTA · SEXTA", "ACESSOS · ATÉ QUARTA"];

/** Texto que se escreve sozinho, com cursor enquanto digita. */
const Typed: React.FC<{
  texto: string;
  at: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({ texto, at, dur = 30, style }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [at, at + dur], [0, texto.length], CLAMP));
  const digitando = frame >= at && n < texto.length;
  return (
    <span style={{ whiteSpace: "nowrap", ...style }}>
      {texto.slice(0, n)}
      <span
        style={{
          display: "inline-block",
          width: 3,
          height: 30,
          verticalAlign: -5,
          marginLeft: 4,
          background: COLORS.coralLight,
          opacity: digitando && frame % 12 < 7 ? 1 : 0,
        }}
      />
    </span>
  );
};

/** Rótulo de bloco em mono + filete que se desenha. */
const Bloco: React.FC<{ label: string; at: number }> = ({ label, at }) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [at, at + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: interpolate(frame, [at, at + 8], [0, 1], CLAMP),
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontWeight: 500,
          fontSize: 24,
          letterSpacing: 4,
          color: COLORS.coralLight,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          flex: 1,
          height: 1,
          transformOrigin: "left center",
          transform: `scaleX(${w})`,
          background: `linear-gradient(90deg, rgba(${COLORS.coralRGB},0.6), rgba(255,255,255,0.06))`,
        }}
      />
    </div>
  );
};

export const Scene02Prova: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const janela = spring({ frame: frame - 4, fps, config: SPRING.soft });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // A onda encolhe até virar linha e some.
  const ampOnda = interpolate(frame, [10, COLAPSO], [1, 0.06], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const ondaOp = interpolate(frame, [COLAPSO + 4, COLAPSO + 16], [1, 0], CLAMP);

  // Scanner: uma varredura por bloco.
  const scan = (at: number) =>
    interpolate(frame, [at - 12, at + 18], [0, 1], {
      ...CLAMP,
      easing: Easing.inOut(Easing.cubic),
    });
  const scanAtivo = [B1, B2, B3].some((a) => frame >= a - 12 && frame <= a + 18);
  const scanP = Math.max(scan(B1), scan(B2), scan(B3));

  const carimbo = spring({ frame: frame - CARIMBO, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="mt-prova" energy={1.1} />

      <Rig
        impacts={[COLAPSO, B1, B2, B3, CARIMBO]}
        push={[1.08, 1.005]}
        amount={0.85}
        origin="540px 430px"
      >
        {/* --- Janela da ata --- */}
        <div
          style={{
            position: "absolute",
            left: WIN.x,
            top: WIN.y,
            width: WIN.w,
            opacity: interpolate(janela, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - janela) * 44}px) scale(${0.94 + 0.06 * janela})`,
          }}
        >
          <GlassPanel radius={38} blur={30} sweep={frame * 1.7} style={{ height: WIN.h }}>
            {/* Barra de título estilo macOS Tahoe. */}
            <div
              style={{
                height: BAR,
                display: "flex",
                alignItems: "center",
                padding: "0 26px",
                gap: 12,
                borderBottom: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: 8,
                    background: "rgba(255,255,255,0.16)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45)",
                  }}
                />
              ))}
              <span
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontFamily: geist,
                  fontWeight: 600,
                  fontSize: 28,
                  color: COLORS.muted,
                  marginLeft: -45,
                }}
              >
                Ata da reunião
              </span>
            </div>

            <div style={{ position: "relative", height: WIN.h - BAR, padding: "26px 40px" }}>
              {/* Varredura do scanner — desce antes de cada bloco. */}
              {scanAtivo ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: scanP * (WIN.h - BAR),
                    height: 120,
                    marginTop: -60,
                    background: `linear-gradient(180deg, transparent, rgba(${COLORS.coralRGB},0.16) 50%, transparent)`,
                    pointerEvents: "none",
                  }}
                />
              ) : null}

              {/* Onda que colapsa em linha: a call vira ata. */}
              <div
                style={{
                  height: ondaOp > 0 ? 84 : 0,
                  opacity: ondaOp,
                  overflow: "hidden",
                  marginBottom: ondaOp > 0 ? 10 : 0,
                }}
              >
                <Waveform
                  width={884}
                  height={80}
                  bars={54}
                  amp={ampOnda}
                  speed={1.2}
                  seed={4.1}
                  color={COLORS.text2}
                />
              </div>

              {/* Contexto da reunião — cliente TARJADO. */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  marginBottom: 22,
                  opacity: interpolate(frame, [CABECA, CABECA + 10], [0, 1], CLAMP),
                  transform: `translateY(${interpolate(frame, [CABECA, CABECA + 14], [-14, 0], {
                    ...CLAMP,
                    easing: Easing.out(Easing.cubic),
                  })}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: geist,
                    fontWeight: 700,
                    fontSize: 34,
                    color: COLORS.text,
                  }}
                >
                  Cliente
                </span>
                {/* A tarja: some com o nome e reforça que é tela real. */}
                <span
                  style={{
                    fontFamily: mono,
                    fontWeight: 700,
                    fontSize: 32,
                    letterSpacing: -2,
                    color: "rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    padding: "2px 12px",
                    filter: "blur(2.5px)",
                  }}
                >
                  ▓▓▓▓▓▓▓
                </span>
                <span style={{ color: COLORS.faint, fontSize: 26 }}>·</span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 27,
                    letterSpacing: 2,
                    color: COLORS.muted,
                  }}
                >
                  47 MIN
                </span>
                <span style={{ color: COLORS.faint, fontSize: 26 }}>·</span>
                <span
                  style={{
                    fontFamily: mono,
                    fontSize: 27,
                    letterSpacing: 2,
                    color: COLORS.muted,
                  }}
                >
                  HOJE, 14:03
                </span>
              </div>

              {/* Bloco 1 — o que ficou combinado. */}
              <Bloco label="O QUE FICOU COMBINADO" at={B1} />
              <div style={{ marginBottom: 18 }}>
                {COMBINADO.map((c, i) => {
                  const at = B1 + 10 + i * 34;
                  return (
                    <div
                      key={c}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        height: 44,
                        opacity: interpolate(frame, [at, at + 6], [0, 1], CLAMP),
                      }}
                    >
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: 5,
                          flexShrink: 0,
                          background: COLORS.coral,
                          boxShadow: `0 0 12px rgba(${COLORS.coralRGB},0.8)`,
                        }}
                      />
                      <Typed
                        texto={c}
                        at={at}
                        dur={26}
                        style={{
                          fontFamily: geist,
                          fontWeight: 500,
                          fontSize: 33,
                          color: COLORS.text2,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Bloco 2 — quem faz o quê. */}
              <Bloco label="QUEM FAZ O QUÊ" at={B2} />
              <div style={{ marginBottom: 18 }}>
                {TAREFAS.map((t, i) => {
                  const at = B2 + 10 + i * 32;
                  const s = spring({ frame: frame - at, fps, config: SPRING.snap });
                  return (
                    <div
                      key={t.texto}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        height: 56,
                        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                        transform: `translateX(${(1 - s) * 26}px)`,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: mono,
                          fontWeight: 700,
                          fontSize: 24,
                          letterSpacing: 3,
                          color: t.dono === "EU" ? COLORS.text : COLORS.coralLight,
                          padding: "7px 16px",
                          borderRadius: 999,
                          background:
                            t.dono === "EU"
                              ? "rgba(255,255,255,0.1)"
                              : `rgba(${COLORS.coralRGB},0.18)`,
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                          flexShrink: 0,
                        }}
                      >
                        {t.dono}
                      </span>
                      <Typed
                        texto={t.texto}
                        at={at + 4}
                        dur={22}
                        style={{
                          fontFamily: geist,
                          fontWeight: 600,
                          fontSize: 34,
                          color: COLORS.text,
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Bloco 3 — prazo. */}
              <Bloco label="PRAZO" at={B3} />
              <div style={{ display: "flex", gap: 14 }}>
                {PRAZOS.map((p, i) => {
                  const at = B3 + 10 + i * 16;
                  const s = spring({ frame: frame - at, fps, config: SPRING.snap });
                  return (
                    <div
                      key={p}
                      style={{
                        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                        transform: `translateY(${(1 - s) * 22}px)`,
                        fontFamily: mono,
                        fontWeight: 700,
                        fontSize: 27,
                        letterSpacing: 3,
                        color: COLORS.coralLight,
                        padding: "12px 22px",
                        borderRadius: 999,
                        background: `rgba(${COLORS.coralRGB},0.14)`,
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 0 1px rgba(${COLORS.coralRGB},0.45)`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* --- Carimbo final: o custo humano disso foi zero --- */}
        <div
          style={{
            position: "absolute",
            top: 726,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < CARIMBO ? 0 : interpolate(carimbo, [0, 0.3], [0, 1], CLAMP),
            transform: `scale(${0.6 + 0.4 * carimbo}) rotate(${
              Math.sin(frame / 24) * 0.9
            }deg)`,
          }}
        >
          <GlassPill
            blur={24}
            tint={0.9}
            hot={0.25 + 0.25 * pulse}
            sweep={frame * 2.6}
            style={{ padding: "18px 38px" }}
          >
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 46,
                letterSpacing: -0.5,
                color: COLORS.text,
              }}
            >
              EU NÃO ANOTEI
            </span>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 46,
                color: COLORS.coralLight,
                textShadow: `0 0 ${26 + 26 * pulse}px rgba(${COLORS.coralRGB},0.8)`,
              }}
            >
              UMA LINHA
            </span>
          </GlassPill>
        </div>
      </Rig>

      <Flash at={COLAPSO} len={4} peak={0.3} />
      <Flash at={CARIMBO} len={4} peak={0.4} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
