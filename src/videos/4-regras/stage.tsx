import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { INK, TONE, ToneName, hand } from "./theme";
import { Ink, roughEllipse, roughLine, roughStar } from "./paper";

// Superfície comum de todas as cenas: a MESA DE PAPEL.
// O prop `tone` alterna BRANCO/CINZA clipe a clipe (pedido do usuário) —
// ver a tabela de alternância no brief.md. A textura, a grade e os rabiscos de
// fundo sangram no FRAME INTEIRO (continuidade sob a máscara da webcam), mas
// todo conteúdo informativo das cenas fica na metade de cima.

export type Grid = "none" | "rule" | "graph" | "dots";

// Rabiscos ambientes — ficam de fundo, bem apagados, e derivam devagar.
const Doodles: React.FC<{ tone: ToneName }> = ({ tone }) => {
  const frame = useCurrentFrame();
  const ink = tone === "white" ? "rgba(40,28,20,0.10)" : "rgba(30,22,14,0.13)";
  const items = React.useMemo(
    () =>
      Array.from({ length: 9 }).map((_, i) => ({
        x: 60 + random(`dx${i}`) * 960,
        y: 40 + random(`dy${i}`) * 1840,
        k: Math.floor(random(`dk${i}`) * 3),
        s: 0.6 + random(`ds${i}`) * 0.9,
        r: (random(`dr${i}`) - 0.5) * 60,
        ph: random(`dp${i}`) * 10,
      })),
    [],
  );
  return (
    <svg
      width={1080}
      height={1920}
      style={{ position: "absolute", inset: 0, overflow: "visible" }}
    >
      {items.map((it, i) => {
        const float = Math.sin(frame / 70 + it.ph) * 7;
        const p =
          it.k === 0
            ? roughStar(0, 0, 26, `amb${i}`)
            : it.k === 1
              ? roughEllipse(0, 0, 30, 22, `amb${i}`, 6, 1.05)
              : roughLine(-34, 0, 34, 0, `amb${i}`, 3, 9);
        return (
          <g
            key={i}
            transform={`translate(${it.x} ${it.y + float}) rotate(${it.r}) scale(${it.s})`}
          >
            <Ink path={p} color={ink} width={3.5} />
          </g>
        );
      })}
    </svg>
  );
};

const gridLayer = (grid: Grid, tone: ToneName, frame: number): React.CSSProperties => {
  const c = TONE[tone].rule;
  const drift = `${(-frame * 0.14).toFixed(2)}px ${(-frame * 0.09).toFixed(2)}px`;
  if (grid === "rule") {
    return {
      backgroundImage: `repeating-linear-gradient(0deg, ${c} 0 2px, transparent 2px 74px)`,
      backgroundPosition: drift,
    };
  }
  if (grid === "graph") {
    return {
      backgroundImage: `repeating-linear-gradient(0deg, ${c} 0 1.5px, transparent 1.5px 46px), repeating-linear-gradient(90deg, ${c} 0 1.5px, transparent 1.5px 46px)`,
      backgroundPosition: drift,
    };
  }
  if (grid === "dots") {
    return {
      backgroundImage: `radial-gradient(${c} 2.5px, transparent 2.5px)`,
      backgroundSize: "62px 62px",
      backgroundPosition: drift,
    };
  }
  return {};
};

export const Paper: React.FC<{
  tone: ToneName;
  grid?: Grid;
  /** anotação de margem, canto superior direito (opcional) */
  note?: string;
  doodles?: boolean;
  children: React.ReactNode;
}> = ({ tone, grid = "none", note, doodles = true, children }) => {
  const frame = useCurrentFrame();
  const t = TONE[tone];
  // Manchas de luz que passeiam pelo papel — impede frame estático mesmo em
  // cenas arejadas.
  const bx = 50 + Math.sin(frame / 96) * 16;
  const by = 30 + Math.cos(frame / 118) * 12;

  return (
    <AbsoluteFill style={{ backgroundColor: t.bg, overflow: "hidden" }}>
      {/* Fibra do papel. */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(102deg, ${t.fiber} 0 1px, transparent 1px 5px), repeating-linear-gradient(9deg, ${t.fiber} 0 1px, transparent 1px 7px)`,
          opacity: 0.7,
        }}
      />
      {/* Grade opcional (caderno / quadriculado / pontilhado). */}
      <AbsoluteFill style={gridLayer(grid, tone, frame)} />
      {/* Luz de mesa passeando. */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(64% 40% at ${bx}% ${by}%, rgba(255,252,240,0.85) 0%, rgba(255,252,240,0) 68%)`,
          mixBlendMode: "soft-light",
        }}
      />
      {doodles ? <Doodles tone={tone} /> : null}

      {children}

      {note ? (
        <div
          style={{
            position: "absolute",
            top: 104,
            right: 74,
            fontFamily: hand,
            fontWeight: 700,
            fontSize: 44,
            color: INK.faint,
            transform: `rotate(${-3 + Math.sin(frame / 64) * 0.9}deg)`,
          }}
        >
          {note}
        </div>
      ) : null}

      {/* Vinheta quente — foca a metade de cima sem escurecer o papel. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(118% 76% at 50% 32%, rgba(0,0,0,0) 48%, ${
            tone === "white" ? "rgba(90,70,44,0.16)" : "rgba(60,46,28,0.24)"
          } 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
