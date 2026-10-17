import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter } from "../theme";
import { easeCam } from "../rig";
import { SparkBurst } from "../SparkBurst";

// Cena 01 — Hook (210f / 7s, fullscreen, cinematic-camera).
// Beat 1: lockup cinético gigante com push-in + impacto no "MELHOR".
// Beat 2: whip-pan para baixo — resultados genéricos idênticos levam um risco.

export const HOOK_DURATION = 210;

const VIEW_W = 1080;
const VIEW_H = 1920;
const IMPACT = 42;

// Rig de câmera (uma timeline compartilhada; holds via valores repetidos).
const KEY_T = [0, 34, IMPACT, 52, 100, 122, 146, 200, 210];
const KEY_FY = [640, 680, 800, 820, 830, 830, 1930, 1945, 1945];
const KEY_Z = [1.3, 1.26, 1.4, 1.16, 1.12, 1.12, 1.1, 1.08, 1.08];

const Word: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 16, stiffness: 240 },
  });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 54}px) scale(${0.7 + 0.3 * s})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

const GhostResult: React.FC<{ at: number; index: number }> = ({ at, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 22, stiffness: 170 },
  });
  return (
    <div
      style={{
        width: 700,
        height: 88,
        borderRadius: 16,
        background: COLORS.card,
        border: `1px solid ${COLORS.stroke}`,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "0 28px",
        opacity: frame < at ? 0 : 0.35 + 0.35 * s,
        transform: `translateX(${(1 - s) * (index % 2 === 0 ? -60 : 60)}px)`,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: COLORS.cardActive,
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div
          style={{
            height: 16,
            width: "72%",
            borderRadius: 8,
            background: "rgba(162,147,127,0.4)",
          }}
        />
        <div
          style={{
            height: 12,
            width: "48%",
            borderRadius: 6,
            background: "rgba(162,147,127,0.22)",
          }}
        />
      </div>
    </div>
  );
};

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fyBase = interpolate(frame, KEY_T, KEY_FY, {
    easing: easeCam,
    ...CLAMP,
  });
  const z = interpolate(frame, KEY_T, KEY_Z, { easing: easeCam, ...CLAMP });

  // Micro-shake no impacto do "MELHOR".
  const shakeEnv = interpolate(frame, [IMPACT - 2, IMPACT + 2, IMPACT + 18], [0, 1, 0], CLAMP);
  const fx = 540 + Math.sin(frame / 31) * 6 + Math.sin(frame * 2.9) * 10 * shakeEnv;
  const fy = fyBase + Math.sin(frame / 43 + 2) * 5 + Math.cos(frame * 3.4) * 8 * shakeEnv;

  // Highlight varrendo atrás de "SEU CLAUDE".
  const hl = interpolate(frame, [28, 40], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Risco coral sobre os resultados genéricos.
  const strike = interpolate(frame, [158, 176], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // O bloco genérico "tomba" depois do risco.
  const fall = spring({
    frame: frame - 182,
    fps,
    config: { damping: 15, stiffness: 90, mass: 1.4 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: VIEW_W,
          height: 2800,
          transform: `translate(${VIEW_W / 2 - fx}px, ${VIEW_H / 2 - fy}px) scale(${z})`,
          transformOrigin: `${fx}px ${fy}px`,
        }}
      >
        {/* Spark flare atrás do lockup. */}
        <div style={{ position: "absolute", left: 540, top: 770, opacity: 0.9 }}>
          <SparkBurst size={620} idPrefix="hook" impactAt={IMPACT} baseEnergy={0.7} />
        </div>

        {/* Beat 1 — lockup cinético. */}
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 0,
            width: VIEW_W,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            textAlign: "center",
          }}
        >
          <Word
            at={8}
            style={{
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: 10,
              color: COLORS.muted,
            }}
          >
            ESSE REPOSITÓRIO
          </Word>
          <div
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 86,
              color: COLORS.text,
              lineHeight: 1.05,
            }}
          >
            <Word at={16}>{"FAZ O "}</Word>
            <Word at={24}>
              <span style={{ position: "relative", display: "inline-block" }}>
                <span
                  style={{
                    position: "absolute",
                    left: -14,
                    right: -14,
                    top: 14,
                    bottom: 2,
                    background: COLORS.coralDeep,
                    opacity: 0.55,
                    borderRadius: 12,
                    transform: `skewX(-6deg) scaleX(${hl})`,
                    transformOrigin: "left center",
                  }}
                />
                <span style={{ position: "relative" }}>SEU CLAUDE</span>
              </span>
            </Word>
          </div>
          <Word
            at={IMPACT}
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 176,
              lineHeight: 1,
              color: COLORS.coral,
              textShadow: "0 0 70px rgba(217,119,87,0.6)",
            }}
          >
            MELHOR
          </Word>
          <div
            style={{
              fontFamily: fraunces,
              fontWeight: 600,
              fontSize: 74,
              lineHeight: 1.1,
              color: COLORS.text,
            }}
          >
            <Word at={54}>{"QUE O DE "}</Word>
            <Word at={60} style={{ color: COLORS.coralLight }}>
              TODO MUNDO
            </Word>
          </div>
        </div>

        {/* Beat 2 — a pesquisa genérica de sempre, riscada. */}
        <div
          style={{
            position: "absolute",
            top: 1700,
            left: 0,
            width: VIEW_W,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 26,
            transform: `rotate(${-4 * fall}deg) translateY(${26 * fall}px)`,
            opacity: 1 - 0.25 * fall,
          }}
        >
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>
            <GhostResult at={126} index={0} />
            <GhostResult at={134} index={1} />
            <GhostResult at={142} index={2} />
            {/* Risco de highlighter coral. */}
            <div
              style={{
                position: "absolute",
                left: -30,
                top: "50%",
                width: 760,
                height: 10,
                borderRadius: 6,
                background: COLORS.coral,
                boxShadow: "0 0 26px rgba(217,119,87,0.7)",
                transform: `rotate(-7deg) scaleX(${strike})`,
                transformOrigin: "left center",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: inter,
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: 44,
              color: COLORS.muted,
              opacity: interpolate(frame, [148, 160], [0, 1], CLAMP),
            }}
          >
            a pesquisa genérica de sempre
          </div>
        </div>
      </div>

      {/* Vinheta em espaço de tela. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 42%, rgba(23,19,16,0) 46%, rgba(10,8,6,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
