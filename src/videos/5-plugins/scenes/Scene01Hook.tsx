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
import { SparkBurst } from "../SparkBurst";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 01 — Hook (180f / 6s, split-safe, cinematic-camera + motion-graphics).
// 3 estímulos já no frame 0: (1) "6 MESES" entrando, (2) SparkBurst do Claude
// pulsando atrás, (3) grade de pontos deslizando. Beat 2: "PERDIDOS" carimba com
// micro-shake. Beat 3: a marca (Claude Code). Beat 4: "5 PLUGINS" planta a lista
// e a keyword. Beat 5: a promessa "−100 HORAS". Tudo na metade de cima.

export const HOOK_DURATION = 180;

const IMPACT = 26; // frame em que "PERDIDOS" carimba

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

  // Câmera: push-in agressivo → drift + micro-shake no carimbo do "PERDIDOS".
  const zoom = interpolate(frame, [0, 44], [1.14, 1.03], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const z = zoom + Math.sin(frame / 44) * 0.012;
  const shake = interpolate(
    frame,
    [IMPACT - 2, IMPACT + 2, IMPACT + 16],
    [0, 1, 0],
    CLAMP,
  );
  const camX = Math.sin(frame / 41) * 8 + Math.sin(frame * 2.9) * 11 * shake;
  const camY = Math.sin(frame / 53 + 1) * 7 + Math.cos(frame * 3.2) * 9 * shake;

  // Karaokê coral varrendo por baixo de "6 MESES".
  const karaoke = interpolate(frame, [4, 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // "PERDIDOS" carimbando.
  const perdidos = spring({
    frame: frame - IMPACT,
    fps,
    config: { damping: 12, stiffness: 150, mass: 1.3 },
  });
  const glow = 0.5 + 0.5 * Math.sin(frame / 9);

  // Chip da marca.
  const brand = spring({
    frame: frame - 62,
    fps,
    config: { damping: 18, stiffness: 170 },
  });

  // "5 PLUGINS".
  const five = spring({
    frame: frame - 100,
    fps,
    config: { damping: 12, stiffness: 140, mass: 1.3 },
  });

  // Promessa "−100 HORAS" com contador.
  const promise = spring({
    frame: frame - 134,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const hours = Math.round(interpolate(frame, [134, 168], [0, 100], CLAMP));

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
          transformOrigin: "540px 440px",
        }}
      >
        {/* Estímulo 2 — SparkBurst pulsando atrás (metade de cima). */}
        <div style={{ position: "absolute", left: 540, top: 350, opacity: 0.72 }}>
          <SparkBurst size={600} idPrefix="plghook" impactAt={IMPACT} baseEnergy={0.75} />
        </div>

        {/* Beat 1 — "6 MESES" com karaokê coral. */}
        <div
          style={{
            position: "absolute",
            top: 192,
            left: 0,
            width: 1080,
            textAlign: "center",
          }}
        >
          <div
            style={{ position: "relative", display: "inline-block", padding: "0 10px" }}
          >
            <div
              style={{
                position: "absolute",
                left: -16,
                top: 4,
                bottom: 8,
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
                fontSize: 92,
                lineHeight: 1,
                color: COLORS.text,
                letterSpacing: -1,
              }}
            >
              <Word at={0} damping={13} stiffness={260}>
                6
              </Word>{" "}
              <Word at={8}>MESES</Word>
            </div>
          </div>
        </div>

        {/* Beat 2 — "PERDIDOS" gigante coral. */}
        <div
          style={{
            position: "absolute",
            top: 292,
            left: 0,
            width: 1080,
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 168,
              lineHeight: 0.98,
              color: COLORS.coral,
              letterSpacing: -3,
              opacity:
                frame < IMPACT ? 0 : interpolate(perdidos, [0, 0.3], [0, 1], CLAMP),
              transform: `scale(${0.55 + 0.45 * perdidos}) rotate(${
                Math.sin(frame / 27) * 1.3
              }deg)`,
              textShadow: `0 0 ${60 + 60 * glow}px rgba(217,119,87,${(
                0.45 + 0.35 * glow
              ).toFixed(2)})`,
            }}
          >
            PERDIDOS
          </span>
        </div>

        {/* Beat 3 — a marca: chip com o logo oficial do Claude. */}
        <div
          style={{
            position: "absolute",
            top: 500,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < 62 ? 0 : interpolate(brand, [0, 0.4], [0, 1], CLAMP),
            transform: `translateY(${(1 - brand) * 40}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "16px 34px",
              borderRadius: 999,
              background: COLORS.card,
              border: `1px solid ${COLORS.strokeActive}`,
              boxShadow: `0 0 ${24 + 22 * glow}px rgba(217,119,87,0.28)`,
            }}
          >
            <BrandLogo name="claude" size={48} color={COLORS.coral} />
            <span
              style={{
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 44,
                letterSpacing: 4,
                color: COLORS.text,
              }}
            >
              NO CLAUDE CODE
            </span>
          </div>
        </div>

        {/* Beat 4 — "5 PLUGINS" (planta a lista e a keyword). */}
        <div
          style={{
            position: "absolute",
            top: 604,
            left: 0,
            width: 1080,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 132,
              lineHeight: 1,
              color: COLORS.coral,
              opacity: frame < 100 ? 0 : interpolate(five, [0, 0.3], [0, 1], CLAMP),
              transform: `scale(${0.5 + 0.5 * five})`,
              textShadow: `0 0 ${44 + 40 * glow}px rgba(217,119,87,0.55)`,
            }}
          >
            5
          </span>
          <Word
            at={110}
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 96,
              color: COLORS.text,
              letterSpacing: -1,
            }}
          >
            PLUGINS
          </Word>
        </div>

        {/* Beat 5 — a promessa: "−100 HORAS" com contador. */}
        <div
          style={{
            position: "absolute",
            top: 748,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity:
              frame < 134 ? 0 : interpolate(promise, [0, 0.35], [0, 1], CLAMP),
            transform: `translateY(${(1 - promise) * 34}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 16,
              padding: "14px 38px",
              borderRadius: 22,
              background: "rgba(217,119,87,0.14)",
              border: `1px solid ${COLORS.strokeActive}`,
              boxShadow: `0 0 ${26 + 30 * glow}px rgba(217,119,87,0.3)`,
            }}
          >
            <span
              style={{
                fontFamily: fraunces,
                fontWeight: 700,
                fontSize: 78,
                color: COLORS.coralLight,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              −{hours}
            </span>
            <span
              style={{
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 46,
                letterSpacing: 4,
                color: COLORS.text,
              }}
            >
              HORAS
            </span>
          </div>
        </div>
      </div>

      {/* Vinheta em espaço de tela. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 74% at 50% 32%, rgba(23,19,16,0) 46%, rgba(10,8,6,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
