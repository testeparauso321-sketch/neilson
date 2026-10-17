import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, inter } from "../theme";
import { Drift } from "../rig";
import { Cursor, TerminalWindow, TermLine, typed } from "../terminal";

// Cena 06 — Instalação em 3 passos (360f / 12s, split-safe, terminal-inserts).
// Stepper 1-2-3 acende em sequência; terminal Claude Code: URL colada com
// flash coral, pedido digitado, skill instala com ◇/✓.

export const INSTALACAO_DURATION = 360;

const STEPS: { label: string; at: number }[] = [
  { label: "COPIA O LINK", at: 30 },
  { label: "COLA NO CLAUDE", at: 120 },
  { label: "PEDE PRA INSTALAR", at: 152 },
];

const Step: React.FC<{ index: number; label: string; at: number }> = ({
  index,
  label,
  at,
}) => {
  const frame = useCurrentFrame();
  const on = interpolate(frame, [at, at + 14], [0, 1], CLAMP);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: "50%",
          border: `2px solid ${COLORS.strokeActive}`,
          background: `rgba(217,119,87,${(on * 0.95).toFixed(2)})`,
          boxShadow: on > 0.5 ? "0 0 30px rgba(217,119,87,0.5)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: inter,
          fontWeight: 700,
          fontSize: 28,
          color: on > 0.5 ? COLORS.bg : COLORS.muted,
          flexShrink: 0,
          transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, on) * Math.PI)})`,
        }}
      >
        {index + 1}
      </div>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 24,
          letterSpacing: 1.5,
          color: on > 0.5 ? COLORS.text : COLORS.muted,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Scene06Instalacao: React.FC = () => {
  const frame = useCurrentFrame();

  // Flash coral no momento do "colar".
  const pasteFlash = interpolate(frame, [120, 126, 156], [0, 0.45, 0.12], CLAMP);
  const pasteIn = interpolate(frame, [120, 127], [0, 1], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <Drift>
        {/* Stepper. */}
        <div
          style={{
            position: "absolute",
            top: 90,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            gap: 44,
          }}
        >
          {STEPS.map((s, i) => (
            <Step key={s.label} index={i} label={s.label} at={s.at} />
          ))}
        </div>

        {/* Terminal Claude Code. */}
        <div style={{ position: "absolute", left: 80, top: 220 }}>
          <TerminalWindow title="claude code" width={920} height={640} enterAt={4}>
            <div style={{ whiteSpace: "pre" }}>
              <span style={{ color: COLORS.green }}>{"~ $ "}</span>
              <span>{typed("claude", frame, 36)}</span>
              {frame >= 36 && frame < 56 ? <Cursor /> : null}
            </div>
            <TermLine at={56}>
              <span style={{ color: COLORS.muted }}>
                Claude Code — sessão iniciada
              </span>
            </TermLine>
            {/* URL colada (aparece inteira, com flash). */}
            <div style={{ whiteSpace: "pre", opacity: pasteIn }}>
              <span style={{ color: COLORS.coral }}>{"> "}</span>
              <span
                style={{
                  background: `rgba(217,119,87,${pasteFlash.toFixed(2)})`,
                  borderRadius: 6,
                  color: COLORS.text,
                }}
              >
                github.com/ultimos-30-dias
              </span>
            </div>
            {/* Pedido digitado. */}
            <div style={{ whiteSpace: "pre" }}>
              {frame >= 152 ? (
                <>
                  <span style={{ color: COLORS.coral }}>{"> "}</span>
                  <span>{typed("instala esse repo pra mim", frame, 152)}</span>
                  {frame < 210 ? <Cursor /> : null}
                </>
              ) : null}
            </div>
            <TermLine at={210}>
              <span style={{ color: COLORS.muted }}>┌ instalando last30days...</span>
            </TermLine>
            <TermLine at={232} checkAt={244}>
              <span style={{ color: COLORS.muted }}>{"◇ "}</span>
              <span>clonando ultimos-30-dias</span>
            </TermLine>
            <TermLine at={254} checkAt={266}>
              <span style={{ color: COLORS.muted }}>{"◇ "}</span>
              <span>registrando skill de pesquisa</span>
            </TermLine>
            <TermLine at={276} checkAt={288}>
              <span style={{ color: COLORS.muted }}>{"◇ "}</span>
              <span>fontes: reddit · x · youtube · hn</span>
            </TermLine>
            <TermLine at={302}>
              <span style={{ color: COLORS.green }}>
                ✓ instalado — zero config{" "}
              </span>
              {frame >= 302 ? <Cursor /> : null}
            </TermLine>
          </TerminalWindow>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
