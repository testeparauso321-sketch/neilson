import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter, mono } from "../theme";
import { Stage } from "../stage";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 02 — Prova (210f / 7s, split-safe, article-highlights).
// Wordmark POSTIZ com traço marca-texto coral; card GitHub com contador
// ★ 0→30.000 e partículas de estrela. Reforça "eu testo de verdade".

export const PROVA_DURATION = 210;

// Agrupa milhar com ponto (pt-BR) sem depender de locale no render.
const grp = (n: number) =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const StarParticle: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const t = ((frame + i * 33) % 90) / 90;
  const x = 120 + ((i * 97) % 720);
  const y = 300 - t * 260;
  const op = Math.sin(t * Math.PI) * 0.55;
  return (
    <span
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: 20 + (i % 3) * 8,
        color: COLORS.coralLight,
        opacity: op,
      }}
    >
      ★
    </span>
  );
};

export const Scene02Prova: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameIn = spring({ frame: frame - 8, fps, config: { damping: 16, stiffness: 170 } });
  const hl = interpolate(frame, [22, 46], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const card = spring({ frame: frame - 44, fps, config: { damping: 22, stiffness: 150 } });

  const count = interpolate(frame, [58, 132], [0, 30000], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const starPulse = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <Stage eyebrow="EU TESTO DE VERDADE">
      {/* Wordmark POSTIZ com marca-texto coral. */}
      <div
        style={{
          position: "absolute",
          top: 236,
          left: 0,
          width: 1080,
          textAlign: "center",
        }}
      >
        <div style={{ position: "relative", display: "inline-block", padding: "0 18px" }}>
          <div
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              bottom: 18,
              height: 54,
              background: COLORS.coral,
              opacity: 0.42,
              borderRadius: 10,
              transform: `skewX(-6deg) scaleX(${hl})`,
              transformOrigin: "left center",
            }}
          />
          <span
            style={{
              position: "relative",
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 168,
              lineHeight: 1,
              color: COLORS.text,
              letterSpacing: -3,
              opacity: interpolate(nameIn, [0, 0.35], [0, 1], CLAMP),
              transform: `translateY(${(1 - nameIn) * 40}px) scale(${0.86 + 0.14 * nameIn})`,
              display: "inline-block",
            }}
          >
            Postiz
          </span>
        </div>
      </div>

      {/* Card GitHub com contador de estrelas. */}
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 90,
          width: 900,
          borderRadius: 30,
          background: COLORS.bgLift,
          border: `1px solid ${COLORS.stroke}`,
          boxShadow: "0 34px 80px rgba(0,0,0,0.5)",
          padding: "34px 40px",
          overflow: "hidden",
          opacity: interpolate(card, [0, 0.3], [0, 1], CLAMP),
          transform: `translateY(${(1 - card) * 70}px) scale(${0.95 + 0.05 * card})`,
        }}
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <StarParticle key={i} i={i} />
        ))}

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24 }}>
          <BrandLogo name="github" size={78} color={COLORS.text} />
          <div>
            <div
              style={{
                fontFamily: mono,
                fontSize: 30,
                color: COLORS.muted,
                marginBottom: 2,
              }}
            >
              github.com/gitroomhq/postiz-app
            </div>
            <div
              style={{
                fontFamily: inter,
                fontWeight: 700,
                fontSize: 30,
                color: COLORS.text,
              }}
            >
              30 mil de olho no repo
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 72,
              color: COLORS.coral,
              transform: `scale(${1 + 0.12 * starPulse})`,
              textShadow: `0 0 ${18 + 22 * starPulse}px rgba(217,119,87,0.7)`,
            }}
          >
            ★
          </div>
        </div>

        {/* Contador. */}
        <div
          style={{
            position: "relative",
            marginTop: 20,
            display: "flex",
            alignItems: "baseline",
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 150,
              lineHeight: 1,
              color: COLORS.text,
              letterSpacing: -2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {grp(count)}
          </span>
          <span
            style={{
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 4,
              color: COLORS.coralLight,
            }}
          >
            STARS
          </span>
        </div>
      </div>

      {/* Rodapé de credibilidade. */}
      <div
        style={{
          position: "absolute",
          top: 852,
          left: 90,
          width: 900,
          textAlign: "center",
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 32,
          color: COLORS.muted,
          opacity: interpolate(frame, [120, 140], [0, 1], CLAMP),
        }}
      >
        código aberto{"  ·  "}
        <span style={{ color: COLORS.coralLight }}>testado em produção</span>
      </div>
    </Stage>
  );
};
