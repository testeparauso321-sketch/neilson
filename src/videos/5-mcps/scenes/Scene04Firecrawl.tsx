import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, fraunces, inter, mono } from "../theme";
import { McpScaffold } from "../mcp";
import { Cursor, SPINNER, typed } from "../terminal";

// Cena 04 — Firecrawl (210f / 7s, split-safe, motion-graphics + terminal).
// Comando `firecrawl` digitado; páginas rastreadas em cascata → caixa CONTEXTO
// enche; punch "UMA LINHA". Loop no ciclo do crawl.

export const FIRECRAWL_DURATION = 210;

const PAGES = ["/", "/precos", "/sobre", "/blog", "/casos", "/contato"];
const CRAWL_START = 46;
const STEP = 11;

const PageChip: React.FC<{ label: string; index: number }> = ({ label, index }) => {
  const frame = useCurrentFrame();
  const at = CRAWL_START + index * STEP;
  const on = interpolate(frame, [at, at + 8], [0, 1], CLAMP);
  const done = frame >= at + 8;
  const spin = SPINNER[Math.floor(frame / 3) % SPINNER.length];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        height: 50,
        padding: "0 18px",
        borderRadius: 12,
        background: on > 0 ? COLORS.cardActive : COLORS.card,
        border: `1px solid ${on > 0.5 ? COLORS.strokeActive : COLORS.stroke}`,
        opacity: 0.4 + 0.6 * Math.min(1, on + (frame >= at - STEP ? 0.4 : 0)),
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 22,
          color: done ? COLORS.green : COLORS.coral,
          width: 22,
          textAlign: "center",
        }}
      >
        {frame < at ? "·" : done ? "✓" : spin}
      </span>
      <span style={{ fontFamily: mono, fontSize: 27, color: COLORS.text }}>{label}</span>
    </div>
  );
};

export const Scene04Firecrawl: React.FC = () => {
  const frame = useCurrentFrame();

  const cmdDone = frame >= CRAWL_START;
  const crawled = Math.max(
    0,
    Math.min(PAGES.length, Math.floor((frame - CRAWL_START) / STEP) + 1),
  );
  const totalCount = Math.round(interpolate(frame, [CRAWL_START, 150], [0, 48], CLAMP));
  const fill = interpolate(frame, [CRAWL_START, 150], [0, 1], CLAMP);
  const punch = interpolate(frame, [150, 162], [0, 1], CLAMP);

  return (
    <McpScaffold
      index={3}
      name="Firecrawl"
      tagline="Rastreia um site inteiro → contexto."
    >
      <div style={{ position: "relative", left: 100, width: 880 }}>
        {/* Linha de comando. */}
        <div
          style={{
            width: 880,
            height: 62,
            borderRadius: 14,
            background: COLORS.term,
            border: `1px solid ${COLORS.stroke}`,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            fontFamily: mono,
            fontSize: 28,
            whiteSpace: "pre",
          }}
        >
          <span style={{ color: COLORS.coral }}>{"> "}</span>
          <span style={{ color: COLORS.text }}>{typed("firecrawl concorrente.com", frame, 8)}</span>
          {frame < CRAWL_START ? <Cursor /> : null}
        </div>

        <div style={{ display: "flex", gap: 30, marginTop: 24 }}>
          {/* Lista de páginas rastreadas. */}
          <div style={{ width: 420 }}>
            <div
              style={{
                fontFamily: inter,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: 2,
                color: COLORS.muted,
                marginBottom: 14,
                opacity: cmdDone ? 1 : 0.3,
              }}
            >
              RASTREANDO
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PAGES.map((p, i) => (
                <PageChip key={p} label={p} index={i} />
              ))}
            </div>
          </div>

          {/* Caixa CONTEXTO. */}
          <div
            style={{
              flex: 1,
              borderRadius: 18,
              background: COLORS.bgLift,
              border: `1px solid ${COLORS.strokeActive}`,
              boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
              padding: 26,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Preenchimento coral. */}
            <div
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                height: `${fill * 100}%`,
                background:
                  "linear-gradient(180deg, rgba(217,119,87,0.05), rgba(217,119,87,0.22))",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  fontFamily: inter,
                  fontWeight: 800,
                  fontSize: 30,
                  letterSpacing: 3,
                  color: COLORS.coralLight,
                }}
              >
                CONTEXTO
              </div>
              <div
                style={{
                  marginTop: 20,
                  fontFamily: fraunces,
                  fontWeight: 800,
                  fontSize: 92,
                  color: COLORS.text,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {totalCount}
              </div>
              <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 28, color: COLORS.muted }}>
                páginas · site inteiro
              </div>
              <div
                style={{
                  marginTop: 16,
                  fontFamily: mono,
                  fontSize: 22,
                  color: COLORS.green,
                  opacity: crawled >= PAGES.length ? 1 : 0.3,
                }}
              >
                ✓ pronto pro Claude
              </div>
            </div>
          </div>
        </div>

        {/* Punch "UMA LINHA". */}
        <div
          style={{
            marginTop: 22,
            textAlign: "center",
            opacity: punch,
            transform: `scale(${0.85 + 0.15 * punch})`,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: 4,
              color: COLORS.text,
            }}
          >
            concorrente por completo? <span style={{ color: COLORS.coral }}>UMA LINHA.</span>
          </span>
        </div>
      </div>
    </McpScaffold>
  );
};
