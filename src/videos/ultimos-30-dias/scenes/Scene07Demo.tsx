import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { Drift } from "../rig";
import { Cursor, SPINNER, TerminalWindow, TermLine, typed } from "../terminal";

// Cena 07 — Demo: um tópico, tudo organizado (510f / 17s, split-safe,
// terminal-inserts, padrão "command → generated cards"). No master roda 540f
// (absorve a sobra do corte de 85s) — o hold final é periódico e aguenta.

export const DEMO_DURATION = 510;

const RunRow: React.FC<{
  at: number;
  doneAt: number;
  text: string;
  result: string;
}> = ({ at, doneAt, text, result }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 7], [0, 1], CLAMP);
  const x = interpolate(frame, [at, at + 9], [-16, 0], CLAMP);
  const spin = SPINNER[Math.floor(frame / 3) % SPINNER.length];
  return (
    <div style={{ opacity: o, transform: `translateX(${x}px)`, whiteSpace: "pre" }}>
      <span style={{ color: COLORS.muted }}>{"◇ "}</span>
      <span style={{ color: COLORS.text }}>{text}</span>
      {frame < doneAt ? (
        <span style={{ color: COLORS.coral }}> {spin}</span>
      ) : (
        <span style={{ color: COLORS.green }}> ✓ {result}</span>
      )}
    </div>
  );
};

const Col: React.FC<{
  at: number;
  label: string;
  count: number;
  bars: [number, number];
}> = ({ at, label, count, bars }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 20, stiffness: 170 },
  });
  const n = interpolate(frame, [at + 4, at + 34], [0, count], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 40}px)`,
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 64,
          color: COLORS.text,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(n)}
      </div>
      <div
        style={{
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 23,
          letterSpacing: 2,
          color: COLORS.muted,
        }}
      >
        {label}
      </div>
      {bars.map((w, i) => {
        const shimmer = ((frame * 5 + i * 90) % 320) - 160;
        return (
          <div
            key={i}
            style={{
              width: `${w}%`,
              height: 12,
              borderRadius: 7,
              background: COLORS.cardActive,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: shimmer,
                top: 0,
                bottom: 0,
                width: 90,
                background:
                  "linear-gradient(90deg, transparent, rgba(217,119,87,0.45), transparent)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export const Scene07Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardIn = spring({
    frame: frame - 180,
    fps,
    config: { damping: 22, stiffness: 120 },
  });
  const tagPulse = 0.6 + 0.4 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <Drift>
        {/* Terminal compacto no topo. */}
        <div style={{ position: "absolute", left: 80, top: 100 }}>
          <TerminalWindow title="last30days" width={920} height={470} fontSize={26}>
            <div style={{ whiteSpace: "pre" }}>
              <span style={{ color: COLORS.green }}>{"~ $ "}</span>
              <span>{typed('last30days "agentes de IA"', frame, 14)}</span>
              {frame < 48 ? <Cursor /> : null}
            </div>
            <TermLine at={52}>
              <span style={{ color: COLORS.muted }}>
                ┌ varrendo os últimos 30 dias...
              </span>
            </TermLine>
            <RunRow at={64} doneAt={118} text="reddit · discussões" result="4" />
            <RunRow at={78} doneAt={132} text="x · posts virais" result="12" />
            <RunRow at={92} doneAt={146} text="youtube · vídeos" result="6" />
            <TermLine at={162}>
              <span style={{ color: COLORS.green }}>
                ✓ consolidado em 1 resumo{" "}
              </span>
              {frame >= 162 ? <Cursor /> : null}
            </TermLine>
          </TerminalWindow>
        </div>

        {/* Card de output gerado. */}
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 610,
            width: 880,
            borderRadius: 26,
            background: COLORS.bgLift,
            border: `1px solid ${COLORS.strokeActive}`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
            padding: "30px 40px 36px",
            opacity: frame < 180 ? 0 : interpolate(cardIn, [0, 0.4], [0, 1], CLAMP),
            transform: `translateY(${(1 - cardIn) * 150}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 26,
            }}
          >
            <div
              style={{
                fontFamily: mono,
                fontWeight: 500,
                fontSize: 26,
                color: COLORS.muted,
              }}
            >
              resumo · agentes de IA
            </div>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                background: COLORS.coral,
                fontFamily: inter,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: 2,
                color: COLORS.bg,
                boxShadow: `0 0 ${18 + 18 * tagPulse}px rgba(217,119,87,${(
                  0.45 + 0.35 * tagPulse
                ).toFixed(2)})`,
              }}
            >
              ESTE MÊS
            </div>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            <Col at={196} label="DISCUSSÕES" count={4} bars={[92, 64]} />
            <Col at={208} label="VIRAIS" count={12} bars={[86, 58]} />
            <Col at={220} label="VÍDEOS" count={6} bars={[90, 52]} />
          </div>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
