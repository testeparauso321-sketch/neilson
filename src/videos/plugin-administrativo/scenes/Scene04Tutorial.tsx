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
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 04 — TUTORIAL (660f / 22s). É o motor de save-rate do vídeo, então a
// janela é a mesma do começo ao fim (o espectador não perde o contexto) e só o
// conteúdo troca, com cursor de vidro indo até o alvo e clicando. Janela em
// vidro estilo macOS Tahoe: barra translúcida, sidebar de vidro, conteúdo por cima.

export const TUTORIAL_DURATION = 660;

const STEP = 132;
const PASSOS = [
  "BAIXAR O APP NO COMPUTADOR",
  "ABA CUSTOMIZADOS",
  "BROWSE PLUGINS",
  "PESQUISAR SMALL BUSINESS",
  "PERSONALIZAR PRO TEU NEGÓCIO",
];

// Geometria da janela (coordenadas de cena).
const WIN = { x: 58, y: 236, w: 964, h: 664 };
const BAR = 70;
const SIDE = 268;

type WP = { f: number; x: number; y: number; click?: boolean };
const WAYPOINTS: WP[] = [
  { f: 0, x: 900, y: 854 },
  { f: 46, x: 686, y: 576, click: true },
  { f: 152, x: 214, y: 488, click: true },
  { f: 302, x: 700, y: 516, click: true },
  { f: 422, x: 664, y: 400, click: true },
  { f: 502, x: 890, y: 654, click: true },
  { f: 574, x: 640, y: 654, click: true },
  { f: 659, x: 640, y: 654 },
];

const NAV = ["Chats", "Projetos", "Artefatos", "Customizados", "Ajustes"];

const Row: React.FC<{
  label: string;
  active?: boolean;
  frame: number;
}> = ({ label, active, frame }) => (
  <div
    style={{
      height: 74,
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 20px",
      marginBottom: 8,
      borderRadius: 18,
      background: active
        ? `rgba(${COLORS.coralRGB},${(0.16 + 0.06 * Math.sin(frame / 8)).toFixed(3)})`
        : "rgba(255,255,255,0.03)",
      boxShadow: active ? `inset 0 0 0 1px rgba(${COLORS.coralRGB},0.5)` : "none",
    }}
  >
    <span
      style={{
        width: 10,
        height: 10,
        borderRadius: 5,
        background: active ? COLORS.coral : COLORS.faint,
      }}
    />
    <span
      style={{
        fontFamily: geist,
        fontWeight: active ? 700 : 500,
        fontSize: 30,
        color: active ? COLORS.text : COLORS.text2,
        opacity: active ? 1 : 0.62,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  </div>
);

const StepContent: React.FC<{ step: number; local: number; frame: number }> = ({
  step,
  local,
  frame,
}) => {
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  if (step === 0) {
    const dl = interpolate(local, [54, 110], [0, 1], {
      ...CLAMP,
      easing: Easing.inOut(Easing.cubic),
    });
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 30,
        }}
      >
        <div
          style={{
            width: 168,
            height: 168,
            borderRadius: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.07)",
            boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.45), 0 22px 50px rgba(0,0,0,0.7), 0 0 ${
              30 + 30 * pulse
            }px rgba(${COLORS.coralRGB},0.3)`,
            transform: `translateY(${Math.sin(frame / 22) * 7}px)`,
          }}
        >
          <BrandLogo name="claude" size={96} color={COLORS.coral} />
        </div>
        <span
          style={{
            fontFamily: geist,
            fontWeight: 800,
            fontSize: 50,
            color: COLORS.text,
            letterSpacing: -0.5,
          }}
        >
          Claude para computador
        </span>
        <div
          style={{
            width: 440,
            height: 12,
            borderRadius: 6,
            background: "rgba(255,255,255,0.09)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${dl * 100}%`,
              height: "100%",
              borderRadius: 6,
              background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
              boxShadow: `0 0 22px rgba(${COLORS.coralRGB},0.8)`,
            }}
          />
        </div>
        <span style={{ fontFamily: mono, fontSize: 28, color: COLORS.muted, letterSpacing: 3 }}>
          {dl >= 1 ? "INSTALADO" : `BAIXANDO ${Math.round(dl * 100)}%`}
        </span>
      </div>
    );
  }

  if (step === 1) {
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
        <span
          style={{
            fontFamily: geist,
            fontWeight: 800,
            fontSize: 58,
            color: COLORS.text,
            letterSpacing: -1,
          }}
        >
          Customizados
        </span>
        <span
          style={{
            fontFamily: geist,
            fontWeight: 500,
            fontSize: 34,
            color: COLORS.muted,
            textAlign: "center",
            maxWidth: 520,
            lineHeight: 1.35,
          }}
        >
          Aqui ficam os pacotes que você instala
        </span>
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 116,
                height: 116,
                borderRadius: 26,
                background: "rgba(255,255,255,0.05)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
                transform: `translateY(${Math.sin(frame / 18 + i) * 6}px)`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (step === 2) {
    const press = interpolate(local, [36, 42, 52], [1, 0.94, 1], CLAMP);
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 34,
        }}
      >
        <span
          style={{
            fontFamily: geist,
            fontWeight: 500,
            fontSize: 34,
            color: COLORS.muted,
          }}
        >
          Nenhum pacote instalado ainda
        </span>
        <div style={{ transform: `scale(${press})` }}>
          <GlassPill
            blur={18}
            tint={0.9}
            hot={0.35 + 0.3 * pulse}
            sweep={frame * 3}
            style={{ padding: "22px 46px" }}
          >
            <span
              style={{
                fontFamily: geist,
                fontWeight: 800,
                fontSize: 44,
                color: COLORS.text,
              }}
            >
              Browse Plugins
            </span>
          </GlassPill>
        </div>
      </div>
    );
  }

  if (step === 3) {
    const q = "Small Business";
    const chars = Math.round(interpolate(local, [16, 52], [0, q.length], CLAMP));
    const achou = local > 58;
    const inst = interpolate(local, [86, 104], [0, 1], CLAMP);
    return (
      <div style={{ height: "100%", padding: "44px 40px", display: "flex", flexDirection: "column", gap: 26 }}>
        {/* Campo de busca. */}
        <div
          style={{
            height: 82,
            borderRadius: 22,
            background: "rgba(255,255,255,0.06)",
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.32), inset 0 0 0 1px rgba(255,255,255,${
              local > 10 && local < 60 ? 0.3 : 0.08
            })`,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 26px",
          }}
        >
          <span style={{ fontSize: 32, color: COLORS.muted }}>⌕</span>
          <span
            style={{
              fontFamily: geist,
              fontWeight: 500,
              fontSize: 36,
              color: chars > 0 ? COLORS.text : COLORS.faint,
            }}
          >
            {chars > 0 ? q.slice(0, chars) : "Buscar pacote"}
          </span>
          {chars > 0 && chars < q.length ? (
            <span
              style={{
                width: 3,
                height: 34,
                background: COLORS.coralLight,
                opacity: frame % 12 < 7 ? 1 : 0.2,
              }}
            />
          ) : null}
        </div>

        {/* Resultado. */}
        <div
          style={{
            opacity: achou ? interpolate(local, [58, 70], [0, 1], CLAMP) : 0,
            transform: `translateY(${interpolate(local, [58, 74], [22, 0], {
              ...CLAMP,
              easing: Easing.out(Easing.cubic),
            })}px)`,
          }}
        >
          <GlassPanel radius={26} blur={18} lens={false} sweep={frame * 2} style={{ height: 194 }}>
            <div style={{ padding: "24px 24px", display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: 20,
                  flexShrink: 0,
                  background: `rgba(${COLORS.coralRGB},0.18)`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BrandLogo name="claude" size={44} color={COLORS.coralLight} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: geist,
                    fontWeight: 800,
                    fontSize: 36,
                    color: COLORS.text,
                    marginBottom: 6,
                    whiteSpace: "nowrap",
                  }}
                >
                  Small Business
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 23,
                    letterSpacing: 2,
                    color: COLORS.coralLight,
                    whiteSpace: "nowrap",
                  }}
                >
                  31 TAREFAS
                </div>
              </div>
              <div
                style={{
                  flexShrink: 0,
                  padding: "13px 24px",
                  borderRadius: 999,
                  background:
                    inst > 0.5
                      ? "rgba(48,209,88,0.16)"
                      : `rgba(${COLORS.coralRGB},${0.2 + 0.12 * pulse})`,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 0 1px ${
                    inst > 0.5 ? "rgba(48,209,88,0.55)" : `rgba(${COLORS.coralRGB},0.55)`
                  }`,
                  fontFamily: geist,
                  fontWeight: 800,
                  fontSize: 28,
                  color: inst > 0.5 ? COLORS.ok : COLORS.text,
                  whiteSpace: "nowrap",
                }}
              >
                {inst > 0.5 ? "Instalado ✓" : "Instalar"}
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Resultados apagados atrás — a lista continua, como num app de verdade. */}
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              height: 92,
              borderRadius: 22,
              background: "rgba(255,255,255,0.028)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "0 24px",
              opacity: interpolate(local, [64 + i * 8, 80 + i * 8], [0, 0.5], CLAMP),
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 15,
                background: "rgba(255,255,255,0.07)",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                height: 16,
                width: i === 0 ? 300 : 232,
                borderRadius: 8,
                background: "rgba(255,255,255,0.09)",
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  // step 4 — personalizar. Valores concretos e de negócio: é o que faz o
  // espectador entender que o pacote vira DELE, não genérico.
  const campos = [
    { l: "Seu negócio", v: "Loja de materiais de construção" },
    { l: "Como você cobra", v: "Boleto e Pix, 30 dias" },
    { l: "Tom das mensagens", v: "Direto e cordial" },
  ];
  return (
    <div style={{ height: "100%", padding: "38px 36px", display: "flex", flexDirection: "column", gap: 16 }}>
      <span
        style={{
          fontFamily: geist,
          fontWeight: 800,
          fontSize: 40,
          color: COLORS.text,
          marginBottom: 4,
          whiteSpace: "nowrap",
          letterSpacing: -0.5,
        }}
      >
        Personalizar pro seu negócio
      </span>
      {campos.map((c, i) => {
        const ini = 22 + i * 26;
        const n = Math.round(
          interpolate(local, [ini, ini + 26], [0, c.v.length], CLAMP),
        );
        const a = interpolate(local, [ini, ini + 8], [0, 1], {
          ...CLAMP,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={i}
            style={{
              height: 104,
              borderRadius: 22,
              background: "rgba(255,255,255,0.05)",
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), inset 0 0 0 1px rgba(${
                COLORS.coralRGB
              },${(0.5 * a).toFixed(2)})`,
              padding: "15px 24px",
              opacity: interpolate(a, [0, 0.4], [0.4, 1], CLAMP),
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 23, letterSpacing: 3, color: COLORS.muted }}>
              {c.l.toUpperCase()}
            </div>
            <div
              style={{
                fontFamily: geist,
                fontWeight: 600,
                fontSize: 34,
                color: COLORS.text2,
                marginTop: 6,
                whiteSpace: "nowrap",
              }}
            >
              {c.v.slice(0, n)}
              <span
                style={{
                  display: "inline-block",
                  width: 3,
                  height: 30,
                  verticalAlign: -5,
                  marginLeft: 3,
                  background: COLORS.coralLight,
                  opacity: n > 0 && n < c.v.length && frame % 12 < 7 ? 1 : 0,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const Scene04Tutorial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const step = Math.min(4, Math.floor(frame / STEP));
  const local = frame - step * STEP;

  const janela = spring({ frame: frame - 4, fps, config: SPRING.soft });
  const progresso = interpolate(frame, [0, TUTORIAL_DURATION - 8], [0, 1], CLAMP);

  const cx = interpolate(frame, WAYPOINTS.map((w) => w.f), WAYPOINTS.map((w) => w.x), {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const cy = interpolate(frame, WAYPOINTS.map((w) => w.f), WAYPOINTS.map((w) => w.y), {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Entrada de conteúdo: desliza com blur direcional a cada troca de passo.
  const troca = interpolate(local, [0, 18], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="tuto" energy={0.85} grid={false} />

      <Rig
        impacts={WAYPOINTS.filter((w) => w.click).map((w) => w.f + 6)}
        push={[1.06, 1.0]}
        amount={0.6}
        origin="540px 460px"
      >
        {/* Chip do passo + barra de progresso. */}
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
              {step + 1}/5
            </span>
            <span style={{ color: COLORS.faint, fontSize: 24 }}>·</span>
            <span
              style={{
                fontFamily: mono,
                fontWeight: 500,
                fontSize: 26,
                letterSpacing: 3,
                color: COLORS.text2,
              }}
            >
              {PASSOS[step]}
            </span>
          </GlassPill>
        </div>

        <div
          style={{
            position: "absolute",
            left: 220,
            top: 206,
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

        {/* --- Janela de vidro --- */}
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
          <GlassPanel radius={40} blur={34} sweep={frame * 1.3} style={{ height: WIN.h }}>
            {/* Barra de título. */}
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
                    width: 18,
                    height: 18,
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
                  fontSize: 24,
                  letterSpacing: 3,
                  color: COLORS.faint,
                }}
              >
                CLAUDE
              </span>
            </div>

            <div style={{ display: "flex", height: WIN.h - BAR }}>
              {/* Sidebar. */}
              <div
                style={{
                  width: SIDE,
                  padding: "22px 16px",
                  boxShadow: "inset -1px 0 0 rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.025)",
                }}
              >
                {NAV.map((n) => (
                  <Row key={n} label={n} active={step >= 1 && n === "Customizados"} frame={frame} />
                ))}
              </div>

              {/* Conteúdo. */}
              <div
                style={{
                  flex: 1,
                  position: "relative",
                  overflow: "hidden",
                  opacity: 1 - troca,
                  transform: `translateX(${troca * 56}px)`,
                  filter: `blur(${troca * 14}px)`,
                }}
              >
                <StepContent step={step} local={local} frame={frame} />
              </div>
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
      </Rig>

      <Grain opacity={0.045} />
      <Vignette />
    </AbsoluteFill>
  );
};
