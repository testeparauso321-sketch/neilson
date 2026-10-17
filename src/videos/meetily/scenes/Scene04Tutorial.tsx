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
import { Rig } from "../rig";
import { clock, Waveform } from "../audio";

// Cena 04 — TUTORIAL (330f / 11s). Motor de save-rate: uma janela só do começo
// ao fim, cursor de vidro andando entre os alvos, 4 passos de 82f. Termina com
// o botão de GRAVAR sendo apertado — a onda da cena 01 volta a correr, que é o
// jeito de fechar o ciclo visual do vídeo.

export const TUTORIAL_DURATION = 330;

const STEP = 82;
const PASSOS = [
  "ABRIR O LINK",
  "BAIXAR O INSTALADOR DO TEU SISTEMA",
  "ABRIR",
  "MANDAR GRAVAR",
];

const WIN = { x: 58, y: 226, w: 964, h: 604 };
const BAR = 62;

type WP = { f: number; x: number; y: number; click?: boolean };
// Alvos medidos na geometria real da janela: barra de endereço (centro y=366),
// botão "Baixar" do card da página (780, 601), card do macOS (300, 449), ícone
// do app (540, 485) e botão de gravar (540, 477).
const WAYPOINTS: WP[] = [
  { f: 0, x: 900, y: 826 },
  { f: 16, x: 400, y: 366, click: true },
  { f: 68, x: 780, y: 601, click: true },
  { f: 112, x: 300, y: 449, click: true },
  { f: 186, x: 540, y: 485, click: true },
  { f: 272, x: 540, y: 477, click: true },
  { f: 329, x: 566, y: 505 },
];

const SISTEMAS = [
  { nome: "macOS", sub: "Apple" },
  { nome: "Windows", sub: "PC" },
];

const StepContent: React.FC<{ step: number; local: number; frame: number }> = ({
  step,
  local,
  frame,
}) => {
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // ---- passo 1: abrir o link -------------------------------------------
  if (step === 0) {
    const url = "github.com/Zackriya-Solutions/meetily";
    const n = Math.round(interpolate(local, [12, 40], [0, url.length], CLAMP));
    const pagina = interpolate(local, [42, 56], [0, 1], {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    });
    return (
      <div style={{ padding: "40px 52px" }}>
        {/* Barra de endereço. */}
        <div
          style={{
            height: 76,
            borderRadius: 999,
            background: "rgba(255,255,255,0.06)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.32), inset 0 0 0 1px rgba(255,255,255,${
              local > 10 && local < 44 ? 0.32 : 0.08
            })`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 30px",
          }}
        >
          <span style={{ fontSize: 26, color: COLORS.muted }}>⌾</span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 30,
              letterSpacing: 0.5,
              color: n > 0 ? COLORS.text2 : COLORS.faint,
              whiteSpace: "nowrap",
            }}
          >
            {n > 0 ? url.slice(0, n) : "abrir link"}
          </span>
          <span
            style={{
              width: 3,
              height: 32,
              background: COLORS.coralLight,
              opacity: n > 0 && n < url.length && frame % 12 < 7 ? 1 : 0,
            }}
          />
        </div>

        {/* A página abrindo. */}
        <div
          style={{
            marginTop: 34,
            opacity: pagina,
            transform: `translateY(${(1 - pagina) * 26}px)`,
          }}
        >
          <GlassPanel radius={30} blur={18} lens={false} sweep={frame * 2} style={{ height: 280 }}>
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 28,
                padding: "0 34px",
              }}
            >
              <div
                style={{
                  width: 108,
                  height: 108,
                  borderRadius: 28,
                  flexShrink: 0,
                  background: `rgba(${COLORS.coralRGB},0.2)`,
                  boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.45), 0 0 ${
                    20 + 22 * pulse
                  }px rgba(${COLORS.coralRGB},0.4)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 52,
                  color: COLORS.coralLight,
                }}
              >
                ◉
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: geist,
                    fontWeight: 800,
                    fontSize: 46,
                    color: COLORS.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  Ata de reunião
                </div>
                <div
                  style={{
                    fontFamily: geist,
                    fontWeight: 500,
                    fontSize: 30,
                    color: COLORS.muted,
                    marginTop: 8,
                    whiteSpace: "nowrap",
                  }}
                >
                  roda no teu computador
                </div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  padding: "16px 32px",
                  borderRadius: 999,
                  fontFamily: geist,
                  fontWeight: 800,
                  fontSize: 32,
                  color: COLORS.text,
                  background: `rgba(${COLORS.coralRGB},${(0.24 + 0.12 * pulse).toFixed(3)})`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 0 1px rgba(${COLORS.coralRGB},0.55)`,
                  whiteSpace: "nowrap",
                }}
              >
                Baixar
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    );
  }

  // ---- passo 2: baixar o instalador -------------------------------------
  if (step === 1) {
    const baixando = interpolate(local, [34, 68], [0, 1], {
      ...CLAMP,
      easing: Easing.inOut(Easing.cubic),
    });
    return (
      <div style={{ padding: "36px 72px" }}>
        <div style={{ display: "flex", gap: 60 }}>
          {SISTEMAS.map((s, i) => {
            const escolhido = i === 0 && local >= 30;
            return (
              <div key={s.nome} style={{ width: 340 }}>
                <GlassPanel
                  radius={30}
                  blur={18}
                  lens={false}
                  tint={escolhido ? 0.9 : 0}
                  hot={escolhido ? 0.25 + 0.2 * pulse : 0}
                  sweep={frame * 2 + i * 40}
                  style={{ height: 300 }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        borderRadius: 26,
                        background: "rgba(255,255,255,0.08)",
                        boxShadow: "inset 0 1.5px 0 rgba(255,255,255,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 46,
                        color: escolhido ? COLORS.coralLight : COLORS.text2,
                        transform: `translateY(${Math.sin(frame / 20 + i) * 5}px)`,
                      }}
                    >
                      ↓
                    </div>
                    <span
                      style={{
                        fontFamily: geist,
                        fontWeight: 800,
                        fontSize: 42,
                        color: COLORS.text,
                      }}
                    >
                      {s.nome}
                    </span>
                    <span
                      style={{
                        fontFamily: mono,
                        fontSize: 24,
                        letterSpacing: 3,
                        color: COLORS.muted,
                      }}
                    >
                      {s.sub.toUpperCase()}
                    </span>
                  </div>
                </GlassPanel>
              </div>
            );
          })}
        </div>

        {/* Barra de download. */}
        <div style={{ marginTop: 44, opacity: interpolate(local, [30, 40], [0, 1], CLAMP) }}>
          <div
            style={{
              height: 14,
              borderRadius: 7,
              background: "rgba(255,255,255,0.09)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${baixando * 100}%`,
                height: "100%",
                borderRadius: 7,
                background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
                boxShadow: `0 0 22px rgba(${COLORS.coralRGB},0.8)`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 14,
              fontFamily: mono,
              fontSize: 26,
              letterSpacing: 3,
              color: baixando >= 1 ? COLORS.ok : COLORS.muted,
            }}
          >
            {baixando >= 1 ? "BAIXADO" : `BAIXANDO ${Math.round(baixando * 100)}%`}
          </div>
        </div>
      </div>
    );
  }

  // ---- passo 3: abrir ----------------------------------------------------
  if (step === 2) {
    const abre = interpolate(local, [26, 54], [0, 1], {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    });
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <div
          style={{
            width: 176,
            height: 176,
            borderRadius: 44,
            background: `rgba(${COLORS.coralRGB},${(0.16 + 0.12 * abre).toFixed(3)})`,
            boxShadow: `inset 0 2px 0 rgba(255,255,255,0.45), 0 26px 56px rgba(0,0,0,0.7), 0 0 ${
              24 + 40 * abre * pulse
            }px rgba(${COLORS.coralRGB},0.5)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 88,
            color: COLORS.coralLight,
            transform: `translateY(${Math.sin(frame / 18) * 7 - abre * 8}px) scale(${
              0.9 + 0.1 * abre
            })`,
          }}
        >
          ◉
        </div>
        <span
          style={{
            fontFamily: geist,
            fontWeight: 800,
            fontSize: 46,
            color: COLORS.text,
          }}
        >
          Abrir no computador
        </span>
        <div style={{ opacity: abre, transform: `translateY(${(1 - abre) * 20}px)` }}>
          <GlassPill blur={18} sweep={frame * 2} style={{ padding: "12px 28px" }}>
            <span
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: 3,
                color: COLORS.ok,
              }}
            >
              PRONTO PRA GRAVAR
            </span>
          </GlassPill>
        </div>
      </div>
    );
  }

  // ---- passo 4: mandar gravar -------------------------------------------
  const apertou = local >= 26;
  const press = interpolate(local, [22, 26, 34], [1, 0.9, 1], CLAMP);
  const gravando = Math.max(0, local - 26) / 30;
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
      }}
    >
      <div
        style={{
          width: 196,
          height: 196,
          borderRadius: 98,
          background: apertou
            ? `rgba(${COLORS.coralRGB},${(0.34 + 0.14 * pulse).toFixed(3)})`
            : "rgba(255,255,255,0.08)",
          boxShadow: apertou
            ? `inset 0 2px 0 rgba(255,255,255,0.4), 0 0 ${
                50 + 60 * pulse
              }px rgba(${COLORS.coralRGB},0.75)`
            : "inset 0 2px 0 rgba(255,255,255,0.4), 0 20px 46px rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${press})`,
        }}
      >
        <div
          style={{
            width: apertou ? 66 : 84,
            height: apertou ? 66 : 84,
            borderRadius: apertou ? 16 : 42,
            background: COLORS.coral,
            boxShadow: `0 0 30px rgba(${COLORS.coralRGB},0.9)`,
          }}
        />
      </div>

      <div style={{ height: 74, display: "flex", alignItems: "center" }}>
        {apertou ? (
          <Waveform width={620} height={70} bars={40} amp={0.95} speed={1.3} seed={6.2} />
        ) : (
          <span
            style={{
              fontFamily: geist,
              fontWeight: 700,
              fontSize: 42,
              color: COLORS.text2,
            }}
          >
            Gravar
          </span>
        )}
      </div>

      <span
        style={{
          fontFamily: mono,
          fontWeight: 700,
          fontSize: 40,
          letterSpacing: 2,
          color: apertou ? COLORS.text : COLORS.faint,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {clock(apertou ? gravando * 22 : 0)}
      </span>
    </div>
  );
};

export const Scene04Tutorial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step = Math.min(3, Math.floor(frame / STEP));
  const local = frame - step * STEP;

  const janela = spring({ frame: frame - 4, fps, config: SPRING.soft });
  const progresso = interpolate(frame, [0, TUTORIAL_DURATION - 8], [0, 1], CLAMP);

  const cx = interpolate(
    frame,
    WAYPOINTS.map((w) => w.f),
    WAYPOINTS.map((w) => w.x),
    { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
  );
  const cy = interpolate(
    frame,
    WAYPOINTS.map((w) => w.f),
    WAYPOINTS.map((w) => w.y),
    { ...CLAMP, easing: Easing.inOut(Easing.cubic) },
  );

  // Troca de passo: conteúdo entra deslizando com blur direcional.
  const troca = interpolate(local, [0, 16], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const dois = spring({ frame: frame - 296, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="mt-tuto" energy={0.9} grid={false} />

      <Rig
        impacts={WAYPOINTS.filter((w) => w.click).map((w) => w.f + 6)}
        push={[1.06, 1.0]}
        amount={0.6}
        origin="540px 460px"
      >
        {/* Chip do passo. */}
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <GlassPill blur={20} sweep={frame * 1.6} style={{ padding: "12px 30px" }}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 32,
                color: COLORS.coralLight,
              }}
            >
              {step + 1}/4
            </span>
            <span style={{ color: COLORS.faint, fontSize: 24 }}>·</span>
            <span
              style={{
                fontFamily: mono,
                fontWeight: 500,
                fontSize: 26,
                letterSpacing: 3,
                color: COLORS.text2,
                whiteSpace: "nowrap",
              }}
            >
              {PASSOS[step]}
            </span>
          </GlassPill>
        </div>

        {/* Barra de progresso líquida. */}
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 196,
            width: 640,
            height: 8,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progresso * 100}%`,
              height: "100%",
              borderRadius: 4,
              background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
              boxShadow: `0 0 18px rgba(${COLORS.coralRGB},0.8)`,
            }}
          />
        </div>

        {/* --- Janela --- */}
        <div
          style={{
            position: "absolute",
            left: WIN.x,
            top: WIN.y,
            width: WIN.w,
            opacity: interpolate(janela, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - janela) * 46}px) scale(${0.96 + 0.04 * janela})`,
          }}
        >
          <GlassPanel radius={40} blur={32} sweep={frame * 1.3} style={{ height: WIN.h }}>
            <div
              style={{
                height: BAR,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 26px",
                boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.09)",
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <span
                  key={c}
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 9,
                    background: c,
                    opacity: 0.55,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
                  }}
                />
              ))}
              <span style={{ flex: 1 }} />
              <span
                style={{
                  fontFamily: mono,
                  fontSize: 23,
                  letterSpacing: 3,
                  color: COLORS.faint,
                }}
              >
                {step === 0 ? "NAVEGADOR" : "NO TEU COMPUTADOR"}
              </span>
            </div>

            <div
              style={{
                height: WIN.h - BAR,
                position: "relative",
                overflow: "hidden",
                opacity: 1 - troca,
                transform: `translateX(${troca * 56}px)`,
                filter: `blur(${troca * 14}px)`,
              }}
            >
              <StepContent step={step} local={local} frame={frame} />
            </div>
          </GlassPanel>
        </div>

        {/* Ondas de clique. */}
        {WAYPOINTS.filter((w) => w.click).map((w) => {
          const p = interpolate(frame, [w.f + 4, w.f + 30], [0, 1], CLAMP);
          if (frame < w.f + 4 || p >= 1) return null;
          return (
            <div
              key={w.f}
              style={{
                position: "absolute",
                left: w.x,
                top: w.y,
                width: p * 190,
                height: p * 190,
                marginLeft: (-p * 190) / 2,
                marginTop: (-p * 190) / 2,
                borderRadius: "50%",
                border: `2px solid rgba(${COLORS.coralRGB},${(0.85 * (1 - p)).toFixed(2)})`,
                opacity: 1 - p,
              }}
            />
          );
        })}

        {/* Cursor de vidro. */}
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            width: 30,
            height: 30,
            marginLeft: -15,
            marginTop: -15,
            borderRadius: 15,
            background:
              "radial-gradient(circle at 34% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.35) 60%, rgba(255,255,255,0.1))",
            boxShadow:
              "0 0 26px rgba(255,255,255,0.65), 0 6px 18px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.6)",
            zIndex: 20,
          }}
        />

        {/* Fecho: o custo de fazer isso. */}
        <div
          style={{
            position: "absolute",
            top: 764,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < 296 ? 0 : interpolate(dois, [0, 0.3], [0, 1], CLAMP),
            transform: `scale(${0.7 + 0.3 * dois})`,
            zIndex: 25,
          }}
        >
          <GlassPill blur={24} tint={0.9} hot={0.3} sweep={frame * 2.6} style={{ padding: "16px 36px" }}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 44,
                color: COLORS.text,
              }}
            >
              DOIS MINUTOS
            </span>
          </GlassPill>
        </div>
      </Rig>

      <Grain opacity={0.045} />
      <Vignette />
    </AbsoluteFill>
  );
};
