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

// Cena 05 — FOSSO (210f / 7s). Amarra no gancho: ele não contratou porque testou.
// Cacos vêm de fora e se juntam num selo de vidro; o anel coral se desenha em
// volta. Nenhum nome de cliente aparece — regra dura do vault.

export const FOSSO_DURATION = 210;

const SELO = 26;
const R = 196;
const CIRC = 2 * Math.PI * R;

const PROVAS = [
  { t: "sistema rodando", at: 108 },
  { t: "cliente real", at: 124 },
  { t: "eu testo primeiro", at: 140 },
];

export const Scene05Fosso: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const selo = spring({ frame: frame - SELO, fps, config: SPRING.gel });
  const anel = interpolate(frame, [SELO + 10, SELO + 60], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="fosso" energy={1} />

      <Rig impacts={[SELO, SELO + 60, 108]} push={[1.14, 1.02]} amount={0.8} origin="540px 400px">
        {/* Cacos vindo de fora pra dentro — o selo se monta a partir deles. */}
        <div style={{ position: "absolute", left: 540, top: 400 }}>
          <Shards at={0} count={26} seed={11} mode="in" duration={34} size={1.1} />
        </div>

        {/* Anel coral que se desenha. */}
        <svg
          width={520}
          height={520}
          viewBox="0 0 520 520"
          style={{ position: "absolute", left: 540 - 260, top: 400 - 260 }}
        >
          <circle
            cx={260}
            cy={260}
            r={R + 34}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={2}
          />
          <circle
            cx={260}
            cy={260}
            r={R}
            fill="none"
            stroke={COLORS.coral}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - anel)}
            transform="rotate(-90 260 260)"
            style={{ filter: `drop-shadow(0 0 ${14 + 14 * pulse}px rgba(${COLORS.coralRGB},0.9))` }}
          />
        </svg>

        {/* Selo de vidro. */}
        <div
          style={{
            position: "absolute",
            left: 540 - 178,
            top: 400 - 178,
            width: 356,
            height: 356,
            opacity: frame < SELO ? 0 : interpolate(selo, [0, 0.3], [0, 1], CLAMP),
            transform: `scale(${0.6 + 0.4 * selo}) rotate(${(1 - selo) * -14}deg)`,
          }}
        >
          <GlassPanel
            radius={178}
            blur={30}
            hot={interpolate(frame, [SELO, SELO + 10, SELO + 30], [1, 0.4, 0.1], CLAMP)}
            sweep={frame * 2.4}
            style={{ height: 356 }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                padding: 30,
                textAlign: "center",
              }}
            >
              <Word
                at={SELO + 14}
                config={SPRING.bouncy}
                style={{
                  fontFamily: mono,
                  fontWeight: 500,
                  fontSize: 26,
                  letterSpacing: 6,
                  color: COLORS.muted,
                  marginBottom: 10,
                }}
              >
                EU
              </Word>
              <Word
                at={SELO + 22}
                config={SPRING.bouncy}
                style={{
                  fontFamily: geist,
                  fontWeight: 900,
                  fontSize: 66,
                  lineHeight: 1,
                  letterSpacing: -1.5,
                  color: COLORS.text,
                }}
              >
                TESTO
              </Word>
              <Word
                at={SELO + 32}
                config={SPRING.bouncy}
                style={{
                  fontFamily: geist,
                  fontWeight: 900,
                  fontSize: 44,
                  lineHeight: 1.15,
                  letterSpacing: -0.5,
                  color: COLORS.coralLight,
                  textShadow: `0 0 ${22 + 22 * pulse}px rgba(${COLORS.coralRGB},0.65)`,
                }}
              >
                ANTES DE
              </Word>
              <Word
                at={SELO + 40}
                config={SPRING.bouncy}
                style={{
                  fontFamily: geist,
                  fontWeight: 900,
                  fontSize: 44,
                  lineHeight: 1.15,
                  letterSpacing: -0.5,
                  color: COLORS.coralLight,
                  textShadow: `0 0 ${22 + 22 * pulse}px rgba(${COLORS.coralRGB},0.65)`,
                }}
              >
                INDICAR
              </Word>
            </div>
          </GlassPanel>
        </div>

        {/* Provas. */}
        <div
          style={{
            position: "absolute",
            top: 668,
            left: 0,
            width: 1080,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          {PROVAS.map((p) => {
            const s = spring({ frame: frame - p.at, fps, config: SPRING.snap });
            return (
              <div
                key={p.t}
                style={{
                  opacity: frame < p.at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                  transform: `translateX(${(1 - s) * 40}px)`,
                }}
              >
                <GlassPill blur={18} sweep={frame * 1.9 + p.at} style={{ padding: "11px 26px" }}>
                  <span
                    style={{
                      width: 9,
                      height: 9,
                      borderRadius: 5,
                      background: COLORS.ok,
                      boxShadow: "0 0 14px rgba(48,209,88,0.9)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: geist,
                      fontWeight: 600,
                      fontSize: 34,
                      color: COLORS.text2,
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

      <Flash at={SELO} len={5} peak={0.4} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
