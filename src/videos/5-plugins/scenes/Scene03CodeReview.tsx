import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CLAMP, COLORS, inter } from "../theme";
import { PluginStage, Punch } from "../plugin";
import { Cursor, SPINNER, TerminalWindow, typed } from "../terminal";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 03 — Code Review, oficial da Anthropic (330f / 11s, split-safe,
// terminal-inserts). PROBLEMA: o bug aparece depois do deploy → comando digitado
// → varredura dos 24 arquivos com spinner → 3 achados reais com ✗ coral →
// linha de sucesso verde → punch "acha antes do teu cliente".

export const CODEREVIEW_DURATION = 330;

const FINDINGS = [
  { at: 118, file: "auth.ts:42", issue: "token sem expiração" },
  { at: 150, file: "api/pay.ts:88", issue: "erro não tratado" },
  { at: 182, file: "db.ts:15", issue: "query sem índice" },
];

// Linha de achado: entra deslizando, o ✗ coral pisca alguns frames depois.
const Finding: React.FC<{ at: number; file: string; issue: string }> = ({
  at,
  file,
  issue,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  const x = interpolate(frame, [at, at + 10], [-18, 0], CLAMP);
  const mark = interpolate(frame, [at + 10, at + 16], [0, 1], CLAMP);
  const pulse = 0.5 + 0.5 * Math.sin((frame - at) / 7);
  return (
    <div style={{ opacity: o, transform: `translateX(${x}px)`, whiteSpace: "pre" }}>
      <span style={{ color: COLORS.muted }}>◇ </span>
      <span style={{ color: COLORS.text }}>{file}</span>
      <span style={{ color: COLORS.muted }}> — {issue}</span>
      <span
        style={{
          color: COLORS.coral,
          opacity: mark,
          textShadow: `0 0 ${6 + 10 * pulse}px rgba(217,119,87,0.8)`,
        }}
      >
        {" "}
        ✗
      </span>
    </div>
  );
};

export const Scene03CodeReview: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scanned = Math.round(interpolate(frame, [56, 100], [0, 24], CLAMP));
  const scanDone = frame >= 104;
  const spin = SPINNER[frame % SPINNER.length];

  const okLine = interpolate(frame, [228, 240], [0, 1], CLAMP);
  const okPulse = 0.5 + 0.5 * Math.sin(frame / 9);

  const badge = spring({ frame: frame - 64, fps, config: { damping: 18, stiffness: 180 } });

  return (
    <PluginStage
      index={2}
      name="Code Review"
      problem={
        <>
          O bug aparece{" "}
          <span style={{ color: COLORS.text, fontWeight: 800 }}>depois</span> do
          deploy.
        </>
      }
      badge={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 20px",
            borderRadius: 999,
            background: COLORS.card,
            border: `1px solid ${COLORS.strokeActive}`,
            opacity: frame < 64 ? 0 : interpolate(badge, [0, 0.4], [0, 1], CLAMP),
            transform: `translateY(${(1 - badge) * 22}px)`,
          }}
        >
          <BrandLogo name="anthropic" size={28} color={COLORS.coralLight} />
          <span
            style={{
              fontFamily: inter,
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 2,
              color: COLORS.coralLight,
            }}
          >
            OFICIAL
          </span>
        </div>
      }
    >
      <div style={{ position: "absolute", top: 0, left: 100 }}>
        <TerminalWindow
          title="claude-code — review"
          width={880}
          height={352}
          fontSize={25}
          enterAt={0}
        >
          <div style={{ lineHeight: 1.55 }}>
            {/* Comando. */}
            <div style={{ whiteSpace: "pre" }}>
              <span style={{ color: COLORS.coralLight }}>❯ </span>
              <span>{typed("claude /code-review", frame, 16, 1)}</span>
              {frame < 44 ? <Cursor /> : null}
            </div>

            {/* Varredura dos arquivos. */}
            <div
              style={{
                opacity: interpolate(frame, [52, 60], [0, 1], CLAMP),
                whiteSpace: "pre",
                color: COLORS.muted,
              }}
            >
              <span style={{ color: COLORS.text }}>┌ </span>
              {scanDone ? "  " : `${spin} `}
              analisando{" "}
              <span style={{ color: COLORS.text, fontVariantNumeric: "tabular-nums" }}>
                {scanned}
              </span>{" "}
              arquivos
              <span style={{ color: COLORS.green, opacity: scanDone ? 1 : 0 }}> ✓</span>
            </div>

            {/* Achados. */}
            {FINDINGS.map((f) => (
              <Finding key={f.file} at={f.at} file={f.file} issue={f.issue} />
            ))}

            {/* Linha de sucesso. */}
            <div
              style={{
                opacity: okLine,
                whiteSpace: "pre",
                color: COLORS.green,
                textShadow: `0 0 ${8 + 12 * okPulse}px rgba(74,222,128,0.45)`,
              }}
            >
              ✓ 3 problemas achados antes do deploy
              {frame >= 240 ? <Cursor /> : null}
            </div>
          </div>
        </TerminalWindow>
      </div>

      <Punch at={262}>ACHA ANTES DO TEU CLIENTE</Punch>
    </PluginStage>
  );
};
