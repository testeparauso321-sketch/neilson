import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter, NETWORK } from "../theme";
import { SparkBurst } from "../SparkBurst";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 01 — Hook (150f / 5s, split-safe, cinematic-camera + motion-graphics).
// 3 estímulos já no frame 0: (1) "UMA IA QUE POSTA" entrando, (2) SparkBurst do
// Claude pulsando atrás, (3) grade de pontos deslizando. Beat 1: karaokê +
// "SOZINHA" estoura em coral com micro-shake. Beat 2: leque de redes. Beat 3:
// punch "DE GRAÇA · NO SEU PC". Todo o texto na metade de cima; fundo sangra.

export const HOOK_DURATION = 150;

const IMPACT = 26; // frame em que "SOZINHA" carimba

const NETS = ["instagram", "tiktok", "youtube", "linkedin"] as const;

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
        transform: `translateY(${(1 - s) * 52}px) scale(${0.72 + 0.28 * s})`,
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

  // Câmera: push-in agressivo → drift + micro-shake no impacto do "SOZINHA".
  const zoom = interpolate(frame, [0, 40], [1.12, 1.03], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const z = zoom + Math.sin(frame / 42) * 0.01;
  const shake = interpolate(frame, [IMPACT - 2, IMPACT + 2, IMPACT + 16], [0, 1, 0], CLAMP);
  const camX = Math.sin(frame / 39) * 8 + Math.sin(frame * 2.9) * 10 * shake;
  const camY = Math.sin(frame / 51 + 1) * 7 + Math.cos(frame * 3.2) * 8 * shake;

  // Karaokê coral varrendo por baixo de "UMA IA QUE POSTA".
  const karaoke = interpolate(frame, [4, 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // "SOZINHA" estourando.
  const soz = spring({
    frame: frame - IMPACT,
    fps,
    config: { damping: 12, stiffness: 150, mass: 1.3 },
  });
  const glow = 0.5 + 0.5 * Math.sin(frame / 9);

  // Punch da TELA.
  const punch = spring({
    frame: frame - 96,
    fps,
    config: { damping: 13, stiffness: 150, mass: 1.2 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Estímulo 3 — grade de pontos em paralaxe (frame inteiro). */}
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
          inset: 0,
          transform: `translate(${camX}px, ${camY}px) scale(${z})`,
          transformOrigin: "540px 470px",
        }}
      >
        {/* Estímulo 2 — SparkBurst pulsando atrás (metade de cima). */}
        <div style={{ position: "absolute", left: 540, top: 336, opacity: 0.78 }}>
          <SparkBurst size={560} idPrefix="hook" impactAt={IMPACT} baseEnergy={0.75} />
        </div>

        {/* Beat 1 — headline "UMA IA QUE POSTA / SOZINHA". */}
        <div
          style={{
            position: "absolute",
            top: 190,
            left: 0,
            width: 1080,
            textAlign: "center",
          }}
        >
          <div style={{ position: "relative", display: "inline-block", padding: "0 10px" }}>
            <div
              style={{
                position: "absolute",
                left: -16,
                top: 6,
                bottom: 10,
                width: `${karaoke * 100}%`,
                maxWidth: "calc(100% + 32px)",
                background: COLORS.coralDeep,
                opacity: 0.5,
                borderRadius: 14,
                transform: "skewX(-5deg)",
              }}
            />
            <div
              style={{
                position: "relative",
                fontFamily: fraunces,
                fontWeight: 700,
                fontSize: 88,
                lineHeight: 1.04,
                color: COLORS.text,
                letterSpacing: -1,
              }}
            >
              <div>
                <Word at={0} damping={13} stiffness={260}>
                  UMA
                </Word>{" "}
                <Word at={8}>IA</Word> <Word at={14}>QUE</Word>{" "}
                <Word at={20}>POSTA</Word>
              </div>
            </div>
          </div>
          {/* "SOZINHA" gigante coral. */}
          <div style={{ marginTop: 8 }}>
            <span
              style={{
                display: "inline-block",
                fontFamily: fraunces,
                fontWeight: 700,
                fontSize: 176,
                lineHeight: 0.98,
                color: COLORS.coral,
                letterSpacing: -3,
                opacity: frame < IMPACT ? 0 : interpolate(soz, [0, 0.3], [0, 1], CLAMP),
                transform: `scale(${0.55 + 0.45 * soz}) rotate(${Math.sin(frame / 26) * 1.4}deg)`,
                textShadow: `0 0 ${60 + 60 * glow}px rgba(217,119,87,${(
                  0.45 + 0.35 * glow
                ).toFixed(2)})`,
              }}
            >
              SOZINHA
            </span>
          </div>
        </div>

        {/* Beat 2 — "em TODAS as suas redes" + leque de logos. */}
        <div
          style={{
            position: "absolute",
            top: 500,
            left: 0,
            width: 1080,
            textAlign: "center",
          }}
        >
          <Word
            at={52}
            style={{
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 3,
              color: COLORS.muted,
            }}
          >
            em <span style={{ color: COLORS.text }}>TODAS</span> as suas redes
          </Word>
          <div
            style={{
              marginTop: 26,
              display: "flex",
              justifyContent: "center",
              gap: 22,
            }}
          >
            {NETS.map((net, i) => {
              const s = spring({
                frame: frame - (60 + i * 6),
                fps,
                config: { damping: 15, stiffness: 200 },
              });
              const accent = NETWORK[net];
              return (
                <div
                  key={net}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 26,
                    background: COLORS.card,
                    border: `1px solid ${COLORS.stroke}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 30px ${accent}44`,
                    opacity: frame < 60 + i * 6 ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
                    transform: `translateY(${(1 - s) * 40}px) scale(${0.7 + 0.3 * s})`,
                  }}
                >
                  <BrandLogo name={net} size={52} color={COLORS.text} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Beat 3 — punch da TELA "DE GRAÇA / NO SEU PC" (duas linhas). */}
        <div
          style={{
            position: "absolute",
            top: 700,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: frame < 96 ? 0 : interpolate(punch, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - punch) * 36}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 104,
              lineHeight: 1,
              color: COLORS.coralLight,
              letterSpacing: -1,
              textShadow: `0 0 ${40 + 40 * glow}px rgba(217,119,87,${(0.4 + 0.3 * glow).toFixed(
                2,
              )})`,
            }}
          >
            DE GRAÇA
          </div>
          <div
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 90,
              lineHeight: 1.06,
              color: COLORS.text,
              letterSpacing: -1,
            }}
          >
            NO SEU PC
          </div>
        </div>
      </div>

      {/* Vinheta em espaço de tela. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 74% at 50% 34%, rgba(23,19,16,0) 46%, rgba(10,8,6,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
