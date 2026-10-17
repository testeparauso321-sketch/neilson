import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter, mono } from "../theme";
import { easeCam } from "../rig";
import { SparkBurst } from "../SparkBurst";

// Cena 01 — Hook (180f / 6s, fullscreen, cinematic-camera).
// 3 estímulos já no frame 0: (1) "NÃO" em entrada, (2) SparkBurst pulsando,
// (3) grade de pontos deslizando. Beat 1: karaokê "NÃO ABRE O CLAUDE CODE" com
// stop/push-in + micro-shake. Beat 2: o "5" estoura gigante. Beat 3: teaser do 5º.

export const HOOK_DURATION = 180;

const VIEW_W = 1080;
const VIEW_H = 1920;
const IMPACT = 10;

// Rig de câmera (timeline compartilhada; holds via valores repetidos).
const KEY_T = [0, 52, 66, 108, 128, 180];
const KEY_FY = [740, 740, 1300, 1300, 1900, 1912];
const KEY_Z = [1.34, 1.18, 1.16, 1.12, 1.1, 1.06];

const Word: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  damping?: number;
  stiffness?: number;
}> = ({ at, children, style, damping = 16, stiffness = 240 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping, stiffness } });
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

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fyBase = interpolate(frame, KEY_T, KEY_FY, { easing: easeCam, ...CLAMP });
  const z = interpolate(frame, KEY_T, KEY_Z, { easing: easeCam, ...CLAMP });

  // Micro-shake no "NÃO".
  const shakeEnv = interpolate(frame, [IMPACT - 2, IMPACT + 2, IMPACT + 18], [0, 1, 0], CLAMP);
  const fx = 540 + Math.sin(frame / 33) * 6 + Math.sin(frame * 2.9) * 12 * shakeEnv;
  const fy = fyBase + Math.sin(frame / 45 + 2) * 5 + Math.cos(frame * 3.3) * 9 * shakeEnv;

  // Karaokê: highlight coral varrendo por baixo de "NÃO ABRE O CLAUDE CODE".
  const karaoke = interpolate(frame, [8, 52], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // "5" estourando.
  const five = spring({
    frame: frame - 70,
    fps,
    config: { damping: 12, stiffness: 130, mass: 1.4 },
  });
  const glowPulse = 0.5 + 0.5 * Math.sin(frame / 9);

  // Teaser do 5º — aba do Chrome espiando.
  const tab = spring({
    frame: frame - 140,
    fps,
    config: { damping: 18, stiffness: 160 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Estímulo 3: grade de pontos em paralaxe, já em movimento no frame 0. */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,236,224,0.06) 2px, transparent 2px)",
          backgroundSize: "70px 70px",
          backgroundPosition: `${-frame * 0.5}px ${-frame * 0.35}px`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: VIEW_W,
          height: 2700,
          transform: `translate(${VIEW_W / 2 - fx}px, ${VIEW_H / 2 - fy}px) scale(${z})`,
          transformOrigin: `${fx}px ${fy}px`,
        }}
      >
        {/* Estímulo 2: SparkBurst pulsando atrás do lockup desde o frame 0. */}
        <div style={{ position: "absolute", left: 540, top: 700, opacity: 0.85 }}>
          <SparkBurst size={640} idPrefix="hook" impactAt={IMPACT} baseEnergy={0.7} />
        </div>

        {/* Beat 1 — karaokê "NÃO ABRE O CLAUDE CODE". */}
        <div
          style={{
            position: "absolute",
            top: 470,
            left: 0,
            width: VIEW_W,
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative", display: "inline-block", padding: "0 8px" }}>
            {/* Wipe coral de karaokê por trás do texto. */}
            <div
              style={{
                position: "absolute",
                left: -18,
                top: 8,
                bottom: 12,
                width: `${karaoke * 100}%`,
                maxWidth: "calc(100% + 36px)",
                background: COLORS.coralDeep,
                opacity: 0.5,
                borderRadius: 16,
                transform: "skewX(-5deg)",
              }}
            />
            <div
              style={{
                position: "relative",
                fontFamily: fraunces,
                fontWeight: 700,
                fontSize: 128,
                lineHeight: 1.02,
                color: COLORS.text,
                letterSpacing: -1,
              }}
            >
              <div>
                <Word at={0} damping={13} stiffness={260}>
                  NÃO
                </Word>{" "}
                <Word at={14}>ABRE</Word>
              </div>
              <div>
                <Word at={28}>O</Word> <Word at={36}>CLAUDE</Word>{" "}
                <Word at={46}>CODE</Word>
              </div>
            </div>
          </div>
        </div>

        {/* Beat 2 — "…antes de instalar esses 5 MCPs". */}
        <div
          style={{
            position: "absolute",
            top: 1130,
            left: 0,
            width: VIEW_W,
            textAlign: "center",
          }}
        >
          <Word
            at={62}
            style={{
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 44,
              letterSpacing: 6,
              color: COLORS.muted,
            }}
          >
            ANTES DE INSTALAR ESSES
          </Word>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 30,
            }}
          >
            <span
              style={{
                fontFamily: fraunces,
                fontWeight: 700,
                fontSize: 380,
                lineHeight: 0.9,
                color: COLORS.coral,
                opacity: frame < 70 ? 0 : interpolate(five, [0, 0.3], [0, 1], CLAMP),
                transform: `scale(${0.5 + 0.5 * five}) rotate(${Math.sin(frame / 24) * 2}deg)`,
                textShadow: `0 0 ${70 + 60 * glowPulse}px rgba(217,119,87,${(
                  0.5 + 0.3 * glowPulse
                ).toFixed(2)})`,
              }}
            >
              5
            </span>
            <Word
              at={86}
              style={{
                fontFamily: fraunces,
                fontWeight: 700,
                fontSize: 150,
                color: COLORS.text,
              }}
            >
              MCPs
            </Word>
          </div>
        </div>

        {/* Beat 3 — teaser do 5º MCP (Chrome). */}
        <div
          style={{
            position: "absolute",
            top: 1780,
            left: 90,
            width: VIEW_W - 180,
            textAlign: "center",
            opacity: interpolate(frame, [124, 140], [0, 1], CLAMP),
          }}
        >
          <div
            style={{
              fontFamily: inter,
              fontWeight: 600,
              fontSize: 50,
              lineHeight: 1.25,
              color: COLORS.text,
            }}
          >
            e o 5º lê tudo que você tem{" "}
            <span style={{ position: "relative", color: COLORS.coralLight, fontWeight: 800 }}>
              aberto no Chrome
            </span>
          </div>
          {/* Aba do Chrome espiando. */}
          <div
            style={{
              marginTop: 34,
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              padding: "18px 30px",
              borderRadius: "16px 16px 0 0",
              background: COLORS.card,
              border: `1px solid ${COLORS.strokeActive}`,
              borderBottom: "none",
              opacity: frame < 140 ? 0 : 1,
              transform: `translateY(${(1 - tab) * 60}px)`,
            }}
          >
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: `conic-gradient(#EA4335,#FBBC05,#34A853,#4285F4,#EA4335)`,
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: COLORS.bg,
                marginLeft: -32,
              }}
            />
            <span
              style={{
                fontFamily: mono,
                fontWeight: 500,
                fontSize: 28,
                color: COLORS.muted,
              }}
            >
              suas abas abertas
            </span>
          </div>
        </div>
      </div>

      {/* Vinheta em espaço de tela. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 44%, rgba(23,19,16,0) 44%, rgba(10,8,6,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
