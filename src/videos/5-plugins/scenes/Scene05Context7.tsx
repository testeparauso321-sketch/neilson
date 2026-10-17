import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { PluginStage, Punch } from "../plugin";

// Cena 05 — Context7 (330f / 11s, split-safe, loopável, motion-graphics +
// terminal). PROBLEMA: ele escreve API que nem existe mais → a chamada morta
// ganha sublinhado coral + selo "removido na v2" → o card do context7 carrega a
// doc de hoje → o feixe sobe e a linha SE REESCREVE certa, com ✓ verde.
// Ciclo de 165f × 2 = 330f.

export const CONTEXT7_DURATION = 330;

const CYCLE = 165;

const OLD_CALL = "session()";
const NEW_CALL = "getSession()";
const CHAR_W = 18; // largura aproximada do mono em 30px

// Sublinhado tremido (estilo "erro") desenhado em SVG.
const Squiggle: React.FC<{ width: number; progress: number }> = ({
  width,
  progress,
}) => {
  const steps = Math.max(2, Math.round(width / 9));
  let d = "M 0 7";
  for (let i = 1; i <= steps; i++) {
    d += ` L ${i * 9} ${i % 2 === 0 ? 7 : 1}`;
  }
  return (
    <svg
      width={steps * 9}
      height={10}
      viewBox={`0 0 ${steps * 9} 10`}
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d={d}
        fill="none"
        stroke={COLORS.coral}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={steps * 10}
        strokeDashoffset={steps * 10 * (1 - progress)}
      />
    </svg>
  );
};

export const Scene05Context7: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = frame % CYCLE;

  const squiggle = interpolate(phase, [20, 36], [0, 1], CLAMP);
  const flagIn = interpolate(phase, [28, 38], [0, 1], CLAMP);
  const flagShake = interpolate(phase, [28, 32, 44], [0, 1, 0], CLAMP);

  const docIn = interpolate(phase, [46, 62], [0, 1], CLAMP);
  const beam = interpolate(phase, [80, 90, 100], [0, 1, 0], CLAMP);
  const beamY = interpolate(phase, [80, 100], [1, 0], CLAMP);

  // A linha se reescreve: apaga a chamada morta, digita a atual.
  const erase = Math.round(interpolate(phase, [96, 108], [OLD_CALL.length, 0], CLAMP));
  const write = Math.round(interpolate(phase, [108, 124], [0, NEW_CALL.length], CLAMP));
  const fixed = phase >= 108;
  const call = fixed ? NEW_CALL.slice(0, write) : OLD_CALL.slice(0, erase);
  const okIn = interpolate(phase, [126, 138], [0, 1], CLAMP);

  // Respiro no fim do ciclo (esconde o corte do loop).
  const wrap = interpolate(phase, [152, CYCLE], [1, 0.3], CLAMP);
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <PluginStage
      index={4}
      name="Context7"
      problem={
        <>
          Ele escreve API que{" "}
          <span style={{ color: COLORS.text, fontWeight: 800 }}>nem existe mais</span>.
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
          height: 200,
          borderRadius: 24,
          background: COLORS.term,
          border: `1px solid ${fixed ? "rgba(74,222,128,0.45)" : COLORS.stroke}`,
          boxShadow: "0 26px 60px rgba(0,0,0,0.5)",
          overflow: "hidden",
          opacity: wrap,
        }}
      >
        {/* Chrome do arquivo + selo do estado. */}
        <div
          style={{
            height: 54,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            background: COLORS.termChrome,
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 22, color: COLORS.muted }}>
            auth.ts
          </span>
          <span
            style={{
              marginLeft: "auto",
              padding: "7px 18px",
              borderRadius: 999,
              background: fixed ? "rgba(74,222,128,0.14)" : "rgba(217,119,87,0.16)",
              border: `1px solid ${
                fixed ? "rgba(74,222,128,0.5)" : COLORS.strokeActive
              }`,
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 1,
              color: fixed ? COLORS.green : COLORS.coralLight,
              opacity: fixed ? interpolate(phase, [108, 118], [0, 1], CLAMP) : flagIn,
              transform: `translateX(${Math.sin(frame * 3) * 6 * flagShake}px)`,
            }}
          >
            {fixed ? "doc de hoje" : "removido na v2"}
          </span>
        </div>

        {/* Código. */}
        <div
          style={{
            padding: "24px 24px",
            fontFamily: mono,
            fontSize: 30,
            lineHeight: 1.55,
            color: COLORS.text,
            whiteSpace: "pre",
          }}
        >
          <div>
            <span style={{ color: COLORS.muted }}>const</span> {"{ data } ="}
          </div>
          <div style={{ position: "relative" }}>
            <span style={{ color: COLORS.muted }}>{"  await "}</span>
            supabase.auth.
            <span style={{ color: fixed ? COLORS.green : COLORS.coralLight }}>
              {call}
            </span>
            <span
              style={{
                color: COLORS.green,
                opacity: okIn,
                textShadow: `0 0 ${8 + 10 * glow}px rgba(74,222,128,0.5)`,
              }}
            >
              {" ✓"}
            </span>
            {/* Sublinhado de erro sob a chamada morta. */}
            <div
              style={{
                position: "absolute",
                left: 22 * CHAR_W,
                bottom: 0,
                opacity: fixed ? 0 : 1,
              }}
            >
              <Squiggle width={OLD_CALL.length * CHAR_W} progress={squiggle} />
            </div>
          </div>
        </div>
      </div>

      {/* Feixe: a doc de hoje sobe e corrige a linha. */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 520,
          width: 6,
          height: 92,
          borderRadius: 6,
          background: `linear-gradient(180deg, rgba(217,119,87,0) 0%, ${COLORS.coralLight} 55%, rgba(217,119,87,0) 100%)`,
          boxShadow: "0 0 26px rgba(217,119,87,0.9)",
          opacity: beam,
          transform: `translateY(${beamY * 40}px)`,
        }}
      />

      {/* Card da doc atualizada. */}
      <div
        style={{
          position: "absolute",
          top: 232,
          left: 100,
          width: 880,
          height: 122,
          borderRadius: 24,
          background: COLORS.bgLift,
          border: `1px solid ${COLORS.strokeActive}`,
          boxShadow: `0 26px 60px rgba(0,0,0,0.45), 0 0 ${
            16 + 28 * docIn * glow
          }px rgba(217,119,87,${(0.28 * docIn).toFixed(2)})`,
          padding: "0 28px",
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: (0.4 + 0.6 * docIn) * wrap,
          transform: `translateY(${(1 - docIn) * 16}px)`,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: 3,
              color: COLORS.coralLight,
            }}
          >
            CONTEXT7
          </div>
          <div
            style={{
              fontFamily: mono,
              fontSize: 22,
              color: COLORS.muted,
              whiteSpace: "nowrap",
            }}
          >
            supabase-js@latest
          </div>
        </div>

        {/* Linhas da doc carregando. */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
          {[300, 240, 330].map((w, i) => {
            const fill = interpolate(phase, [50 + i * 8, 64 + i * 8], [0, 1], CLAMP);
            return (
              <div
                key={w}
                style={{
                  width: w * fill,
                  height: 10,
                  borderRadius: 6,
                  background: i === 0 ? "rgba(217,119,87,0.75)" : "rgba(244,236,224,0.26)",
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: inter,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 1,
            color: COLORS.green,
            opacity: docIn,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: COLORS.green,
              boxShadow: `0 0 ${6 + 14 * glow}px rgba(74,222,128,0.85)`,
            }}
          />
          atualizado hoje
        </div>
      </div>

      <Punch at={250}>DOC DE HOJE · CÓDIGO QUE RODA</Punch>
    </PluginStage>
  );
};
