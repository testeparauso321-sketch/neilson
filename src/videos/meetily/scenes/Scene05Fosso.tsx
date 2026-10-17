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
import { Flash, Rig, Shards, Word } from "../rig";

// Cena 05 — FOSSO (255f / 8,5s). O selo se monta a partir de cacos vindos de
// fora: é a prova de que o cara usa antes de indicar. Nenhum nome de cliente
// aparece — regra dura do vault. Câmera em órbita lenta.

export const FOSSO_DURATION = 255;

const CX = 540;
const CY = 414;
const R = 218;

const MONTA = 12; // cacos entram
const SELO = 44; // selo trava

const PROVAS = [
  { t: "sistema rodando pra cliente", at: 118 },
  { t: "eu testo antes de indicar", at: 140 },
  { t: "em reunião de verdade", at: 162 },
];

export const Scene05Fosso: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const selo = spring({ frame: frame - SELO, fps, config: SPRING.bouncy });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  // Anel coral se desenhando em 40 frames.
  const anel = interpolate(frame, [SELO + 4, SELO + 44], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const circ = 2 * Math.PI * (R - 12);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="mt-fosso" energy={1} grid={false} />

      <Rig impacts={[SELO, ...PROVAS.map((p) => p.at)]} push={[1.12, 1.01]} amount={0.9} origin="540px 414px">
        {/* Órbita de pontos: a câmera nunca para, o selo também não. */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2 + frame * 0.012;
          const d = R + 46 + Math.sin(frame / 30 + i) * 12;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: CX + Math.cos(a) * d - 4,
                top: CY + Math.sin(a) * d - 4,
                width: 8,
                height: 8,
                borderRadius: 4,
                background: i % 4 === 0 ? COLORS.coralLight : COLORS.text2,
                opacity: interpolate(frame, [SELO, SELO + 20], [0, 0.5], CLAMP),
                boxShadow:
                  i % 4 === 0 ? `0 0 14px rgba(${COLORS.coralRGB},0.8)` : "none",
              }}
            />
          );
        })}

        {/* Cacos montando o selo. */}
        <div style={{ position: "absolute", left: CX, top: CY }}>
          <Shards at={MONTA} count={26} seed={9} mode="in" duration={34} size={1.05} />
        </div>

        {/* --- O selo --- */}
        <div
          style={{
            position: "absolute",
            left: CX - R,
            top: CY - R,
            width: R * 2,
            height: R * 2,
            opacity: frame < SELO ? 0 : interpolate(selo, [0, 0.25], [0, 1], CLAMP),
            transform: `scale(${0.62 + 0.38 * selo}) rotate(${Math.sin(frame / 40) * 1.6}deg)`,
          }}
        >
          <GlassPanel
            radius={R}
            blur={30}
            hot={interpolate(frame, [SELO, SELO + 12, SELO + 30], [1, 0.4, 0.12], CLAMP)}
            sweep={frame * 2.4}
            style={{ height: R * 2 }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontWeight: 500,
                  fontSize: 24,
                  letterSpacing: 6,
                  color: COLORS.muted,
                  marginBottom: 10,
                }}
              >
                <Word at={SELO + 8}>ESSE AQUI</Word>
              </span>
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 900,
                  fontSize: 52,
                  lineHeight: 1.05,
                  letterSpacing: -1.5,
                  color: COLORS.text,
                }}
              >
                <Word at={SELO + 12} config={SPRING.bouncy}>
                  EU USO
                </Word>
              </span>
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 900,
                  fontSize: 52,
                  lineHeight: 1.05,
                  letterSpacing: -1.5,
                  color: COLORS.coralLight,
                  textShadow: `0 0 ${30 + 34 * pulse}px rgba(${COLORS.coralRGB},0.75)`,
                }}
              >
                <Word at={SELO + 18} config={SPRING.bouncy}>
                  DE VERDADE
                </Word>
              </span>
            </div>
          </GlassPanel>

          {/* Anel coral desenhando. */}
          <svg
            width={R * 2}
            height={R * 2}
            style={{ position: "absolute", left: 0, top: 0, transform: "rotate(-90deg)" }}
          >
            <circle
              cx={R}
              cy={R}
              r={R - 12}
              fill="none"
              stroke={COLORS.coral}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - anel)}
              opacity={0.9}
              style={{ filter: `drop-shadow(0 0 14px rgba(${COLORS.coralRGB},0.85))` }}
            />
          </svg>
        </div>

        {/* --- Provas --- */}
        <div
          style={{
            position: "absolute",
            top: 664,
            left: 0,
            width: 1080,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          {PROVAS.map((p) => {
            const s = spring({ frame: frame - p.at, fps, config: SPRING.snap });
            return (
              <div
                key={p.t}
                style={{
                  opacity: frame < p.at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                  transform: `translateY(${(1 - s) * 26}px)`,
                }}
              >
                <GlassPill blur={20} sweep={frame * 2 + p.at} style={{ padding: "13px 30px" }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      background: COLORS.coral,
                      boxShadow: `0 0 12px rgba(${COLORS.coralRGB},0.85)`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: geist,
                      fontWeight: 700,
                      fontSize: 38,
                      color: COLORS.text,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.t}
                  </span>
                </GlassPill>
              </div>
            );
          })}
        </div>
      </Rig>

      <Flash at={SELO} len={5} peak={0.5} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
