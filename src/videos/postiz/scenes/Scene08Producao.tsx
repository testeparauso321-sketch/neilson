import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, fraunces, inter, mono } from "../theme";
import { LIGHT } from "../themeLight";
import { Drift } from "../rig";

// Cena 08 — Produção / fosso (90f / 3s, split-safe, TESTE fundo branco).
// "Toda semana eu construo sistema rodando em produção pra clientes." Motion:
// pipeline de deploy (commit→build→deploy→LIVE) com pulso viajando em loop,
// selo ● PROD e sparkline de tráfego ao vivo. Nunca estático.

export const PRODUCAO_DURATION = 90;

const STAGES = ["commit", "build", "deploy", "LIVE"];
const NODE_X = [8, 218, 428, 638]; // left de cada nó (largura 174)
const CENTER = NODE_X.map((x) => x + 87);
const PERIOD = 54;

// Sparkline de tráfego rolando (motion perpétuo).
const Spark: React.FC = () => {
  const frame = useCurrentFrame();
  const N = 34;
  const step = 812 / (N - 1);
  const pts = Array.from({ length: N })
    .map((_, i) => {
      const x = i * step;
      const y =
        44 -
        (Math.sin((i + frame * 0.5) / 1.6) * 15 +
          Math.sin((i + frame * 0.3) / 3.1) * 10);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={812} height={70} viewBox="0 0 812 70" style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={LIGHT.coral}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.85}
      />
    </svg>
  );
};

const Word: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 220 } });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 46}px) scale(${0.74 + 0.26 * s})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export const Scene08Producao: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = spring({ frame: frame - 26, fps, config: { damping: 22, stiffness: 150 } });

  // Pulso viajando pelo pipeline (loop).
  const t = (frame % PERIOD) / PERIOD;
  const dotX = interpolate(t, [0, 1], [CENTER[0], CENTER[3]]);
  const prodPulse = 0.45 + 0.55 * Math.sin(frame / 6);
  const glowX = 300 + Math.sin(frame / 40) * 220;

  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT.bg, overflow: "hidden" }}>
      {/* Grade de pontos clara com paralaxe. */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(40,28,20,0.06) 2px, transparent 2px)",
          backgroundSize: "74px 74px",
          backgroundPosition: `${-frame * 0.2}px ${-frame * 0.12}px`,
        }}
      />
      {/* Brilho coral que deriva. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(48% 34% at ${glowX}px 360px, rgba(217,102,59,0.14) 0%, rgba(217,102,59,0) 70%)`,
        }}
      />

      <Drift amount={0.7}>
        {/* Sobrancelha + headline. */}
        <div style={{ position: "absolute", top: 176, left: 90, width: 900 }}>
          <Word
            at={0}
            style={{
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 6,
              color: LIGHT.coral,
            }}
          >
            TODA SEMANA
          </Word>
          <div
            style={{
              marginTop: 12,
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 100,
              lineHeight: 1,
              color: LIGHT.ink,
              letterSpacing: -2,
            }}
          >
            <div>
              <Word at={6}>SISTEMA</Word> <Word at={14}>EM</Word>
            </div>
            <div>
              <Word at={22} style={{ color: LIGHT.coral }}>
                PRODUÇÃO
              </Word>
            </div>
          </div>
        </div>

        {/* Card do pipeline de deploy. */}
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 90,
            width: 900,
            borderRadius: 30,
            background: LIGHT.card,
            border: `1px solid ${LIGHT.stroke}`,
            boxShadow: LIGHT.shadow,
            padding: "30px 40px",
            opacity: interpolate(card, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - card) * 60}px) scale(${0.96 + 0.04 * card})`,
          }}
        >
          {/* Topo: PROD + tráfego. */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 20px",
                borderRadius: 999,
                background: "rgba(46,158,91,0.12)",
                border: "1px solid rgba(46,158,91,0.5)",
              }}
            >
              <span
                style={{
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  background: LIGHT.green,
                  boxShadow: `0 0 ${6 + 12 * prodPulse}px rgba(46,158,91,${(0.5 + 0.5 * prodPulse).toFixed(
                    2,
                  )})`,
                }}
              />
              <span
                style={{ fontFamily: inter, fontWeight: 800, fontSize: 26, letterSpacing: 3, color: LIGHT.green }}
              >
                PROD
              </span>
            </div>
            <div
              style={{
                marginLeft: "auto",
                fontFamily: mono,
                fontSize: 26,
                color: LIGHT.inkSoft,
              }}
            >
              uptime 99.98%
            </div>
          </div>

          <Spark />

          {/* Pipeline. */}
          <div style={{ position: "relative", height: 174, marginTop: 8 }}>
            {/* Conectores. */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 86,
                  left: CENTER[i],
                  width: CENTER[i + 1] - CENTER[i],
                  height: 4,
                  background: LIGHT.stroke,
                  borderRadius: 2,
                }}
              />
            ))}
            {/* Pulso viajando. */}
            <div
              style={{
                position: "absolute",
                top: 78,
                left: dotX - 10,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: LIGHT.coral,
                boxShadow: `0 0 20px ${LIGHT.coral}`,
                zIndex: 3,
              }}
            />
            {/* Nós. */}
            {STAGES.map((label, i) => {
              const active = Math.abs(dotX - CENTER[i]) < 80;
              const isLive = i === STAGES.length - 1;
              const litGreen = isLive && active;
              const accent = litGreen ? LIGHT.green : LIGHT.coral;
              return (
                <div
                  key={label}
                  style={{
                    position: "absolute",
                    top: 30,
                    left: NODE_X[i],
                    width: 174,
                    height: 116,
                    borderRadius: 18,
                    background: active ? LIGHT.cardActive : LIGHT.bgSoft,
                    border: `2px solid ${active ? accent : LIGHT.stroke}`,
                    boxShadow: active ? `0 0 26px ${accent}55` : "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transform: `scale(${active ? 1.05 : 1})`,
                  }}
                >
                  <span style={{ fontSize: 34, color: active ? accent : LIGHT.ink }}>
                    {["◆", "■", "▲", "●"][i]}
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 24,
                      color: active ? accent : LIGHT.inkSoft,
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sub. */}
        <div
          style={{
            position: "absolute",
            top: 866,
            left: 90,
            width: 900,
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 34,
            color: LIGHT.inkSoft,
            opacity: interpolate(frame, [44, 60], [0, 1], CLAMP),
          }}
        >
          pra <span style={{ color: LIGHT.coral, fontWeight: 800 }}>clientes de verdade</span>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
