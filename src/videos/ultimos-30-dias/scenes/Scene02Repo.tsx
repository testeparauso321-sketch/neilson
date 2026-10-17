import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, fraunces, inter, mono } from "../theme";
import { Drift } from "../rig";

// Cena 02 — Repo 40 mil estrelas (120f / 4s, split-safe, article-highlights).
// Card editorial estilo GitHub: blur-in, zoom lento + tilt 3D, contador de
// estrelas rolando e highlighter irregular atrás do nome do repo.

export const REPO_DURATION = 120;

const fmt = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const Scene02Repo: React.FC = () => {
  const frame = useCurrentFrame();

  const blur = interpolate(frame, [0, 26], [16, 0], CLAMP);
  const opacity = interpolate(frame, [0, 18], [0, 1], CLAMP);
  const zoom = interpolate(frame, [0, REPO_DURATION], [1.0, 1.09], CLAMP);
  const rotY = interpolate(frame, [0, REPO_DURATION], [-6, 4], CLAMP);

  const stars = interpolate(frame, [26, 96], [0, 39847], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Highlighter atrás do nome do repo (varre da esquerda pra direita).
  const hl = interpolate(frame, [40, 60], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <Drift>
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 150,
            width: 900,
            filter: `blur(${blur}px)`,
            opacity,
            transform: `perspective(1700px) rotateY(${rotY}deg) rotateX(4deg) scale(${zoom})`,
          }}
        >
          <div
            style={{
              borderRadius: 26,
              background: COLORS.bgLift,
              border: `1px solid ${COLORS.stroke}`,
              boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
              padding: "54px 58px 50px",
            }}
          >
            {/* Header do repo. */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: COLORS.card,
                  border: `1px solid ${COLORS.strokeActive}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  color: COLORS.coral,
                }}
              >
                ✦
              </div>
              <div style={{ position: "relative", display: "inline-block" }}>
                {/* Traço de marca-texto irregular. */}
                <svg
                  width={560}
                  height={78}
                  viewBox="0 0 560 78"
                  style={{ position: "absolute", left: -16, top: -6 }}
                >
                  <defs>
                    <clipPath id="repo-hl-clip">
                      <rect x={0} y={0} width={560 * hl} height={78} />
                    </clipPath>
                  </defs>
                  <path
                    d="M8,52 C60,40 150,36 260,38 C370,40 480,34 548,44 L552,64 C460,58 340,62 230,60 C130,58 50,66 12,68 Z"
                    fill={COLORS.coral}
                    opacity={0.38}
                    clipPath="url(#repo-hl-clip)"
                  />
                </svg>
                <span
                  style={{
                    position: "relative",
                    fontFamily: mono,
                    fontWeight: 700,
                    fontSize: 52,
                    color: COLORS.text,
                  }}
                >
                  ultimos-30-dias
                </span>
              </div>
            </div>

            <div
              style={{
                marginTop: 30,
                fontFamily: inter,
                fontWeight: 400,
                fontSize: 32,
                color: COLORS.muted,
                lineHeight: 1.45,
              }}
            >
              Pesquisa multi-fonte para Claude · Reddit · X · YouTube · HN
            </div>

            {/* Contador de estrelas. */}
            <div
              style={{
                marginTop: 44,
                display: "flex",
                alignItems: "baseline",
                gap: 22,
              }}
            >
              <span
                style={{
                  fontSize: 64,
                  color: COLORS.coral,
                  textShadow: "0 0 34px rgba(217,119,87,0.55)",
                }}
              >
                ★
              </span>
              <span
                style={{
                  fontFamily: fraunces,
                  fontWeight: 700,
                  fontSize: 128,
                  color: COLORS.text,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: 1,
                }}
              >
                {fmt(stars)}
              </span>
              <span
                style={{
                  fontFamily: inter,
                  fontWeight: 500,
                  fontSize: 36,
                  color: COLORS.muted,
                }}
              >
                stars
              </span>
            </div>

            <div
              style={{
                marginTop: 26,
                fontFamily: inter,
                fontWeight: 500,
                fontSize: 27,
                color: COLORS.muted,
                opacity: interpolate(frame, [70, 84], [0, 1], CLAMP),
              }}
            >
              github.com/ultimos-30-dias · open source
            </div>
          </div>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
