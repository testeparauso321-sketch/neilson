import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { PluginStage, Punch } from "../plugin";

// Cena 02 — Ponytail (330f / 11s, split-safe, motion-graphics).
// PROBLEMA: o Claude escreve código demais → o bloco incha (12 linhas, 148
// linhas no contador) → lâmina coral varre → metade evapora e o painel encolhe
// (68 linhas) → chips com os números verdadeiros (−54% código, +27% mais rápido,
// −20% mais barato) → punch.

export const PONYTAIL_DURATION = 330;

const CUT = 118; // frame em que a lâmina passa
const KEEP = 6; // linhas que sobram
const LINES = 12;

// Larguras/indentação das "linhas de código" (bloco gordo → bloco enxuto).
const CODE: { w: number; indent: number; accent?: "coral" | "green" }[] = [
  { w: 470, indent: 0, accent: "coral" },
  { w: 360, indent: 34 },
  { w: 540, indent: 34 },
  { w: 300, indent: 68 },
  { w: 430, indent: 68, accent: "green" },
  { w: 250, indent: 34 },
  { w: 500, indent: 34 },
  { w: 380, indent: 68 },
  { w: 420, indent: 68 },
  { w: 290, indent: 102 },
  { w: 460, indent: 34 },
  { w: 330, indent: 0 },
];

const LINE_H = 15;
const STEP = 22;

const Metric: React.FC<{ at: number; value: string; label: string }> = ({
  at,
  value,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 17, stiffness: 190 } });
  const bob = Math.sin((frame + at * 5) / 27) * 5;
  return (
    <div
      style={{
        padding: "14px 26px",
        borderRadius: 18,
        background: COLORS.card,
        border: `1px solid ${COLORS.strokeActive}`,
        textAlign: "center",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 44 + bob}px)`,
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 46,
          color: COLORS.coralLight,
          lineHeight: 1.1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: 2,
          color: COLORS.muted,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Scene02Ponytail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panel = spring({ frame: frame - 2, fps, config: { damping: 24, stiffness: 150 } });

  // Contador de linhas: sobe até 148 (inchado) e cai para 68 depois do corte.
  const grown = interpolate(frame, [6, 66], [0, 148], CLAMP);
  const cutTo = interpolate(frame, [CUT + 4, CUT + 34], [148, 68], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const lines = Math.round(frame < CUT + 4 ? grown : cutTo);
  const isFat = frame < CUT + 8;

  // Altura do painel: encolhe quando metade do código evapora.
  const fullH = 54 + 20 + (LINES * LINE_H + (LINES - 1) * (STEP - LINE_H)) + 24;
  const cutH = 54 + 20 + (KEEP * LINE_H + (KEEP - 1) * (STEP - LINE_H)) + 24;
  const panelH = interpolate(frame, [CUT + 2, CUT + 36], [fullH, cutH], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Lâmina coral varrendo o bloco.
  const bladeX = interpolate(frame, [CUT, CUT + 16], [-140, 1000], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const bladeO = interpolate(
    frame,
    [CUT - 2, CUT + 2, CUT + 12, CUT + 18],
    [0, 1, 1, 0],
    CLAMP,
  );

  // Pulso "inchado" antes do corte.
  const fatPulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const fatGlow = interpolate(frame, [70, 90, CUT, CUT + 10], [0, 1, 1, 0], CLAMP);

  return (
    <PluginStage
      index={1}
      name="Ponytail"
      problem={
        <>
          O Claude escreve{" "}
          <span style={{ color: COLORS.text, fontWeight: 800 }}>código demais</span>.
        </>
      }
    >
      {/* Painel de código. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 100,
          width: 880,
          height: panelH,
          borderRadius: 24,
          background: COLORS.term,
          border: `1px solid ${
            fatGlow > 0.2 ? COLORS.strokeActive : COLORS.stroke
          }`,
          boxShadow: `0 30px 70px rgba(0,0,0,0.5), 0 0 ${
            30 * fatGlow * fatPulse
          }px rgba(217,119,87,${(0.5 * fatGlow).toFixed(2)})`,
          overflow: "hidden",
          opacity: interpolate(panel, [0, 0.3], [0, 1], CLAMP),
          transform: `translateY(${(1 - panel) * 50}px)`,
        }}
      >
        {/* Header do arquivo. */}
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            gap: 14,
            background: COLORS.termChrome,
          }}
        >
          <span
            style={{ fontFamily: mono, fontSize: 24, color: COLORS.muted }}
          >
            checkout.ts
          </span>
          <span
            style={{
              marginLeft: "auto",
              padding: "6px 16px",
              borderRadius: 999,
              background: isFat ? "rgba(217,119,87,0.16)" : "rgba(74,222,128,0.14)",
              border: `1px solid ${
                isFat ? COLORS.strokeActive : "rgba(74,222,128,0.5)"
              }`,
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 24,
              color: isFat ? COLORS.coralLight : COLORS.green,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {lines} linhas
          </span>
        </div>

        {/* Linhas de código como barras (legível no mobile). */}
        <div style={{ position: "relative", padding: "20px 24px 24px" }}>
          {CODE.map((l, i) => {
            const appear = i * 4;
            const s = spring({
              frame: frame - appear,
              fps,
              config: { damping: 20, stiffness: 200 },
            });
            const dies = i >= KEEP;
            const dieAt = CUT + 4 + (i - KEEP) * 5;
            const die = dies ? interpolate(frame, [dieAt, dieAt + 14], [0, 1], CLAMP) : 0;
            const tint =
              l.accent === "coral"
                ? "rgba(217,119,87,0.75)"
                : l.accent === "green"
                  ? "rgba(74,222,128,0.55)"
                  : "rgba(244,236,224,0.28)";
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 20 + i * STEP,
                  left: 24 + l.indent,
                  width: l.w,
                  height: LINE_H,
                  borderRadius: 8,
                  background: tint,
                  opacity:
                    (frame < appear ? 0 : interpolate(s, [0, 0.5], [0, 1], CLAMP)) *
                    (1 - die),
                  transform: `translateX(${die * 70}px) scaleX(${1 - die * 0.4})`,
                  transformOrigin: "left center",
                }}
              />
            );
          })}
          {/* Espaçador que dá altura ao bloco. */}
          <div style={{ height: LINES * STEP - (STEP - LINE_H) }} />
        </div>

        {/* Lâmina coral do corte. */}
        <div
          style={{
            position: "absolute",
            top: 54,
            left: bladeX,
            width: 130,
            bottom: 0,
            background:
              "linear-gradient(90deg, rgba(217,119,87,0) 0%, rgba(235,169,139,0.95) 55%, rgba(217,119,87,0) 100%)",
            opacity: bladeO,
            filter: "blur(1px)",
          }}
        />
      </div>

      {/* Métricas verdadeiras (checagem factual da copy). */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 0,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <Metric at={168} value="−54%" label="CÓDIGO" />
        <Metric at={192} value="+27%" label="MAIS RÁPIDO" />
        <Metric at={216} value="−20%" label="MAIS BARATO" />
      </div>

      <Punch at={252}>METADE DO CÓDIGO · MESMO RESULTADO</Punch>
    </PluginStage>
  );
};
