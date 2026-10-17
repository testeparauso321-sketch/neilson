import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { McpScaffold } from "../mcp";
import { typed } from "../terminal";

// Cena 03 — Playwright (240f / 8s, split-safe, motion-graphics).
// Janela de navegador; cursor autônomo digita 2 campos, marca checkbox, clica
// "Entrar" (ripple) → toast "✓ testado sozinho". Loop no ciclo do cursor.

export const PLAYWRIGHT_DURATION = 240;

const CT = [0, 30, 46, 62, 82, 95, 110, 120, 240];
const CX = [790, 320, 320, 320, 320, 61, 61, 480, 480];
const CY = [70, 167, 167, 245, 245, 321, 321, 401, 401];

const Field: React.FC<{
  y: number;
  label: string;
  value: string;
  active: boolean;
}> = ({ y, label, value, active }) => (
  <div
    style={{
      position: "absolute",
      left: 40,
      top: y,
      width: 560,
      height: 62,
      borderRadius: 12,
      background: COLORS.term,
      border: `2px solid ${active ? COLORS.coral : COLORS.stroke}`,
      boxShadow: active ? "0 0 20px rgba(217,119,87,0.4)" : "none",
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      fontFamily: mono,
      fontSize: 27,
    }}
  >
    <span style={{ color: value ? COLORS.text : COLORS.muted }}>{value || label}</span>
  </div>
);

export const Scene03Playwright: React.FC = () => {
  const frame = useCurrentFrame();

  const cx = interpolate(frame, CT, CX, CLAMP);
  const cy = interpolate(frame, CT, CY, CLAMP);

  const email = typed("qa@seusistema.com", frame, 34, 0.9);
  const senha = "•".repeat(Math.max(0, Math.min(9, Math.floor((frame - 66) * 0.9))));
  const checked = frame >= 98;
  const clicked = frame >= 120;

  const depress = interpolate(frame, [120, 124, 132], [0, 1, 0], CLAMP);
  const ripple = interpolate(frame, [120, 150], [0, 1], CLAMP);
  const toast = interpolate(frame, [134, 148], [0, 1], CLAMP);

  return (
    <McpScaffold
      index={2}
      name="Playwright"
      tagline="Ele controla um navegador de verdade."
    >
      <div style={{ position: "relative", left: 100, width: 880 }}>
        <div
          style={{
            position: "relative",
            width: 880,
            height: 458,
            borderRadius: 22,
            background: COLORS.bgLift,
            border: `1px solid ${COLORS.stroke}`,
            boxShadow: "0 34px 80px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          {/* Chrome bar. */}
          <div
            style={{
              height: 56,
              background: COLORS.termChrome,
              display: "flex",
              alignItems: "center",
              padding: "0 22px",
              gap: 10,
            }}
          >
            {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
              <div key={c} style={{ width: 16, height: 16, borderRadius: "50%", background: c }} />
            ))}
            <div
              style={{
                flex: 1,
                marginLeft: 14,
                height: 34,
                borderRadius: 999,
                background: COLORS.term,
                border: `1px solid ${COLORS.stroke}`,
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                fontFamily: mono,
                fontSize: 22,
                color: COLORS.muted,
              }}
            >
              app.seusistema.com
            </div>
          </div>

          {/* Body: formulário. */}
          <div style={{ position: "relative", height: 402 }}>
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 22,
                fontFamily: inter,
                fontWeight: 700,
                fontSize: 30,
                color: COLORS.text,
              }}
            >
              Login
            </div>

            <Field y={80} label="email" value={email} active={frame >= 30 && frame < 62} />
            <Field y={158} label="senha" value={senha} active={frame >= 62 && frame < 95} />

            {/* Checkbox. */}
            <div
              style={{
                position: "absolute",
                left: 40,
                top: 248,
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: checked ? COLORS.coral : COLORS.term,
                  border: `2px solid ${checked ? COLORS.coralLight : COLORS.stroke}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 800,
                  color: COLORS.bg,
                }}
              >
                {checked ? "✓" : ""}
              </div>
              <span style={{ fontFamily: inter, fontSize: 27, color: COLORS.muted }}>
                lembrar de mim
              </span>
            </div>

            {/* Botão Entrar. */}
            <div
              style={{
                position: "absolute",
                left: 360,
                top: 314,
                width: 240,
                height: 62,
                borderRadius: 14,
                background: COLORS.coral,
                boxShadow: `0 0 ${20 + 40 * depress}px rgba(217,119,87,${(0.4 + 0.4 * depress).toFixed(
                  2,
                )})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 30,
                color: COLORS.bg,
                overflow: "hidden",
                transform: `scale(${1 - 0.06 * depress})`,
              }}
            >
              {/* Ripple do clique. */}
              <div
                style={{
                  position: "absolute",
                  width: 300,
                  height: 300,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.35)",
                  opacity: (1 - ripple) * (clicked ? 1 : 0),
                  transform: `scale(${ripple * 1.2})`,
                }}
              />
              <span style={{ position: "relative" }}>Entrar</span>
            </div>

            {/* Toast. */}
            <div
              style={{
                position: "absolute",
                left: 30,
                bottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 22px",
                borderRadius: 999,
                background: "rgba(74,222,128,0.14)",
                border: "1px solid rgba(74,222,128,0.55)",
                fontFamily: inter,
                fontWeight: 700,
                fontSize: 27,
                color: COLORS.green,
                opacity: toast,
                transform: `translateY(${(1 - toast) * 26}px)`,
              }}
            >
              ✓ testado sozinho
            </div>

            {/* Cursor autônomo. */}
            <svg
              width={38}
              height={38}
              viewBox="0 0 24 24"
              style={{
                position: "absolute",
                left: cx,
                top: cy,
                filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.6))",
                transform: `scale(${1 - 0.18 * depress})`,
              }}
            >
              <path
                d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 14 L19 14 Z"
                fill={COLORS.text}
                stroke={COLORS.bg}
                strokeWidth={1.2}
              />
            </svg>
          </div>
        </div>

        {/* Sub-linha. */}
        <div
          style={{
            marginTop: 22,
            textAlign: "center",
            fontFamily: inter,
            fontWeight: 600,
            fontStyle: "italic",
            fontSize: 30,
            color: COLORS.muted,
            opacity: interpolate(frame, [150, 164], [0, 1], CLAMP),
          }}
        >
          teu site testado — sem contratar ninguém
        </div>
      </div>
    </McpScaffold>
  );
};
