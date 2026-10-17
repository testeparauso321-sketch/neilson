import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, INK, STICKY, hand, inter, marker, mono } from "../theme";
import { Paper } from "../stage";
import { useDrop } from "../rig";
import { Ink, Sheet, Sticky, Tape, arrowPaths, checkPath, roughLine } from "../paper";

// Cena 05 — O take que decide o vídeo (240f / 8s, split-safe, papel BRANCO).
// "Mesmo prompt, com e sem o arquivo. Olha a diferença." Um plano só, sem
// cortes: o mesmo prompt num post-it em cima, seta bifurcando pra duas folhas
// que digitam AO MESMO TEMPO. A alucinação (função que não existe) é a prova —
// é a dor mais fácil de ver em 2 segundos.

export const DEMO_DURATION = 240;

const SHEET_Y = 372;
const SHEET_W = 462;
const SHEET_H = 500;
const LX = 58;
const RX = 560;
const PAD = 28;

const L1 = "const fix = await";
const L2A = "  sdk.autoFix(bug)";
const L2B = "  sdk.repair(bug)";

const typed = (s: string, frame: number, at: number, perChar: number) =>
  s.slice(0, Math.max(0, Math.floor((frame - at) / perChar)));

const Side: React.FC<{
  x: number;
  at: number;
  rot: number;
  seed: string;
  title: string;
  color: string;
  line2: string;
  children?: React.ReactNode;
}> = ({ x, at, rot, seed, title, color, line2, children }) => {
  const frame = useCurrentFrame();
  const drop = useDrop(at, rot);
  return (
    <div style={{ position: "absolute", left: x, top: SHEET_Y, opacity: drop.opacity }}>
      <div style={{ transform: drop.transform, transformOrigin: `${SHEET_W / 2}px 0px` }}>
        <Sheet w={SHEET_W} h={SHEET_H} seed={seed} bg="#FFFDF7">
          {/* Etiqueta do lado. */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 26,
              padding: "6px 16px",
              border: `4px solid ${color}`,
              borderRadius: 8,
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 2,
              color,
              transform: `rotate(${-1.4 + rot * 0.2}deg)`,
            }}
          >
            {title}
          </div>
          {/* O código. */}
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 116,
              fontFamily: mono,
              fontWeight: 500,
              fontSize: 28,
              lineHeight: 1.5,
              color: INK.ink,
              whiteSpace: "pre",
            }}
          >
            <div>{typed(L1, frame, 46, 1.8)}</div>
            <div>
              {typed(line2, frame, 82, 1.8)}
              <span style={{ opacity: frame % 16 < 8 ? 1 : 0, color: INK.faint }}>▌</span>
            </div>
          </div>
          {children}
        </Sheet>
      </div>
    </div>
  );
};

export const Scene05Demo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Câmera: push-in lento na bifurcação — a comparação inteira num plano só.
  const z = interpolate(frame, [0, 240], [1.0, 1.09], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const camX = Math.sin(frame / 51) * 5;
  const camY = Math.sin(frame / 67 + 0.7) * 6;

  const prompt = spring({ frame: frame - 4, fps, config: { damping: 11, stiffness: 200 } });
  const fork = interpolate(frame, [18, 38], [0, 1], { ...CLAMP, easing: Easing.out(Easing.quad) });

  // Esquerda: a alucinação.
  const squig = interpolate(frame, [122, 142], [0, 1], CLAMP);
  const wig = 4 + Math.sin(frame / 3.2) * 2.2;
  const tagL = spring({ frame: frame - 146, fps, config: { damping: 13, stiffness: 200 } });
  const stampL = interpolate(frame - 166, [0, 4, 8, 13], [2.2, 0.9, 1.06, 1], CLAMP);
  const stampLop = interpolate(frame, [166, 170], [0, 1], CLAMP);

  // Direita: a doc conferida.
  const doc = spring({ frame: frame - 128, fps, config: { damping: 15, stiffness: 190 } });
  const chk = interpolate(frame, [150, 166], [0, 1], CLAMP);
  const stampR = interpolate(frame - 178, [0, 4, 8, 13], [2.2, 0.9, 1.06, 1], CLAMP);
  const stampRop = interpolate(frame, [178, 182], [0, 1], CLAMP);

  const breathe = 1 + Math.sin(frame / 12) * 0.012;

  const left = arrowPaths(504, 300, 288, 366, "forkL", -30);
  const right = arrowPaths(576, 300, 792, 366, "forkR", 30);

  return (
    <Paper tone="white" grid="graph" doodles={false}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${camX}px, ${camY}px) scale(${z})`,
          transformOrigin: "540px 520px",
        }}
      >
        {/* O prompt — um só, pros dois lados. */}
        <div
          style={{
            position: "absolute",
            left: 250,
            top: 140,
            opacity: interpolate(prompt, [0, 0.3], [0, 1], CLAMP),
            transform: `rotate(${-1.6 + (1 - prompt) * 8}deg) scale(${0.7 + 0.3 * prompt})`,
            transformOrigin: "290px 60px",
          }}
        >
          <Sticky w={580} h={140} color={STICKY.yellow} seed="promptnote">
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 18,
                width: 580,
                textAlign: "center",
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: 5,
                color: INK.soft,
              }}
            >
              MESMO PROMPT
            </div>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 52,
                width: 580,
                textAlign: "center",
                fontFamily: hand,
                fontWeight: 700,
                fontSize: 48,
                color: INK.ink,
              }}
            >
              &ldquo;corrige o bug do checkout&rdquo;
            </div>
          </Sticky>
          <Tape w={140} h={44} seed="pnt" style={{ left: 220, top: -20, transform: "rotate(-5deg)" }} />
        </div>

        {/* Bifurcação. */}
        <svg width={1080} height={480} style={{ position: "absolute", top: 0, overflow: "visible" }}>
          <Ink path={left.shaft} p={fork} color={INK.red} width={5} />
          <Ink path={left.head} p={interpolate(fork, [0.7, 1], [0, 1], CLAMP)} color={INK.red} width={5} />
          <Ink path={right.shaft} p={fork} color={INK.green} width={5} />
          <Ink path={right.head} p={interpolate(fork, [0.7, 1], [0, 1], CLAMP)} color={INK.green} width={5} />
        </svg>

        {/* SEM O ARQUIVO — inventa a função. */}
        <Side
          x={LX}
          at={30}
          rot={-1.5}
          seed="sideL"
          title="SEM O ARQUIVO"
          color={INK.red}
          line2={L2A}
        >
          <svg width={410} height={160} style={{ position: "absolute", left: PAD, top: 190 }}>
            <Ink
              path={roughLine(28, 12, 232, 12, "l2squig", wig, 0, 24, 7)}
              p={squig}
              color={INK.red}
              width={5}
            />
            <Ink path={roughLine(150, 58, 92, 24, "l2arr", 2, 12)} p={tagL} color={INK.red} width={4} />
          </svg>
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 258,
              fontFamily: hand,
              fontWeight: 700,
              fontSize: 42,
              color: INK.red,
              opacity: interpolate(tagL, [0, 0.4], [0, 1], CLAMP),
              transform: `rotate(-5deg) scale(${0.7 + 0.3 * tagL})`,
            }}
          >
            essa função não existe
          </div>
          <div
            style={{
              position: "absolute",
              left: PAD + 34,
              top: 356,
              padding: "6px 22px 10px",
              border: `5px solid ${INK.red}`,
              borderRadius: 10,
              fontFamily: marker,
              fontSize: 62,
              color: INK.red,
              opacity: stampLop,
              transform: `rotate(-8deg) scale(${stampL * breathe})`,
            }}
          >
            QUEBRA
          </div>
        </Side>

        {/* COM O ARQUIVO — confere a doc. */}
        <Side
          x={RX}
          at={36}
          rot={1.8}
          seed="sideR"
          title="COM O ARQUIVO"
          color={INK.green}
          line2={L2B}
        >
          <div
            style={{
              position: "absolute",
              left: PAD,
              top: 208,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              border: `3px dashed ${INK.green}`,
              borderRadius: 12,
              opacity: interpolate(doc, [0, 0.4], [0, 1], CLAMP),
              transform: `translateY(${(1 - doc) * 22}px)`,
            }}
          >
            <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 26, color: INK.green }}>
              conferido na doc
            </span>
            <svg width={34} height={34} style={{ overflow: "visible" }}>
              <Ink path={checkPath(30, "docchk")} p={chk} color={INK.green} width={6} />
            </svg>
          </div>
          <div
            style={{
              position: "absolute",
              left: PAD + 34,
              top: 356,
              padding: "6px 26px 10px",
              border: `5px solid ${INK.green}`,
              borderRadius: 10,
              fontFamily: marker,
              fontSize: 62,
              color: INK.green,
              opacity: stampRop,
              transform: `rotate(6deg) scale(${stampR * breathe})`,
            }}
          >
            RODA
          </div>
        </Side>
      </div>
    </Paper>
  );
};
