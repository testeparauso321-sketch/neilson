import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS } from "../theme";
import { Drift } from "../rig";
import { Cursor, SPINNER, TerminalWindow, TermLine, typed } from "../terminal";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 03 — Pesquisa simultânea (210f / 7s, split-safe, terminal-inserts).
// 4 buscas paralelas com logos oficiais das fontes: spinners virando ✓ em
// cascata. Layout v2: todo conteúdo informacional na metade superior
// (y 0–960, margem 48px das bordas e da linha do meio); só o fundo é full-frame.

export const PESQUISA_DURATION = 210;

const CMD = "~ $ claude run last30days";

const SearchRow: React.FC<{
  at: number;
  doneAt: number;
  brand: string;
  logoColor?: string;
  result: string;
}> = ({ at, doneAt, brand, logoColor, result }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 7], [0, 1], CLAMP);
  const x = interpolate(frame, [at, at + 9], [-16, 0], CLAMP);
  const pop = interpolate(frame, [at, at + 14], [0.35, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(2.2)),
  });
  const spin = SPINNER[Math.floor(frame / 3) % SPINNER.length];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 48,
        opacity: o,
        transform: `translateX(${x}px)`,
        whiteSpace: "pre",
      }}
    >
      <span style={{ color: COLORS.muted }}>{"◇ "}</span>
      <span style={{ width: 64, display: "inline-flex", alignItems: "center" }}>
        <BrandLogo
          name={brand}
          size={34}
          color={logoColor}
          style={{ transform: `scale(${pop})` }}
        />
      </span>
      {frame < doneAt ? (
        <span style={{ color: COLORS.coral }}>{spin}</span>
      ) : (
        <span style={{ color: COLORS.green }}>✓ {result}</span>
      )}
    </div>
  );
};

export const Scene03Pesquisa: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Brilho quente ambiente atrás do terminal. */}
      <div
        style={{
          position: "absolute",
          left: 540 - 700,
          top: 430 - 700,
          width: 1400,
          height: 1400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217,119,87,0.14) 0%, rgba(23,19,16,0) 60%)",
        }}
      />
      <Drift>
        <div style={{ position: "absolute", left: 80, top: 120 }}>
          <TerminalWindow title="claude — pesquisa" width={920} height={660}>
            <div style={{ whiteSpace: "pre" }}>
              <span style={{ color: COLORS.green }}>{"~ $ "}</span>
              <span>{typed(CMD.slice(4), frame, 14)}</span>
              {frame < 46 ? <Cursor /> : null}
            </div>
            <TermLine at={48}>
              <span style={{ color: COLORS.muted }}>
                ┌ pesquisando 4 fontes em paralelo...
              </span>
            </TermLine>
            <SearchRow at={58} doneAt={112} brand="reddit" result="128 threads" />
            <SearchRow
              at={68}
              doneAt={126}
              brand="x"
              logoColor={COLORS.text}
              result="342 posts"
            />
            <SearchRow at={78} doneAt={140} brand="youtube" result="57 vídeos" />
            <SearchRow at={88} doneAt={154} brand="hackernews" result="46 stories" />
            <TermLine at={172}>
              <span style={{ color: COLORS.green }}>
                ✓ 4 fontes · classificando resultados{" "}
              </span>
              {frame >= 172 ? <Cursor /> : null}
            </TermLine>
          </TerminalWindow>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
