import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, fraunces, inter } from "../theme";
import { LIGHT } from "../themeLight";
import { Drift } from "../rig";

// Cena 09 — Muda o jogo (90f / 3s, split-safe, TESTE fundo branco).
// "E uma ferramenta dessas pode mudar o jogo." Motion: gráfico que sobe com
// ponto viajando + seta pulsando + burst no topo; "O JOGO" com glow. Loop.

export const MUDAJOGO_DURATION = 90;

const N = 40;
const PTS = Array.from({ length: N }).map((_, i) => {
  const p = i / (N - 1);
  const x = p * 820;
  const y = 250 - Math.pow(p, 1.4) * 214 + Math.sin(p * 6) * 4;
  return { x, y };
});

const Word: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  at,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 15, stiffness: 220 } });
  return (
    <span
      style={{
        display: "inline-block",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 48}px) scale(${0.72 + 0.28 * s})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export const Scene09MudaJogo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const card = spring({ frame: frame - 20, fps, config: { damping: 22, stiffness: 150 } });
  const glow = 0.5 + 0.5 * Math.sin(frame / 8);
  const jogo = spring({ frame: frame - 12, fps, config: { damping: 13, stiffness: 150, mass: 1.2 } });
  const glowX = 620 + Math.sin(frame / 36) * 200;

  // Desenho do gráfico + ponto viajando.
  const drawP = interpolate(frame, [24, 52], [0, 1], CLAMP);
  const kDraw = Math.max(2, Math.floor(drawP * N));
  const drawn = frame >= 52;
  const tt = ((frame - 52) % 40) / 40;
  const di = drawn ? Math.floor(tt * (N - 1)) : kDraw - 1;
  const tip = PTS[Math.min(N - 1, Math.max(0, di))];
  const peak = PTS[N - 1];
  const arrow = interpolate(frame, [48, 58], [0, 1], CLAMP);
  const burst = 0.5 + 0.5 * Math.sin(frame / 5);

  const line = PTS.slice(0, kDraw).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area =
    `0,260 ` + PTS.slice(0, kDraw).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
    ` ${PTS[kDraw - 1].x.toFixed(1)},260`;

  return (
    <AbsoluteFill style={{ backgroundColor: LIGHT.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(40,28,20,0.06) 2px, transparent 2px)",
          backgroundSize: "74px 74px",
          backgroundPosition: `${-frame * 0.2}px ${-frame * 0.12}px`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(46% 32% at ${glowX}px 300px, rgba(217,102,59,0.16) 0%, rgba(217,102,59,0) 70%)`,
        }}
      />

      <Drift amount={0.7}>
        {/* Sobrancelha. */}
        <div style={{ position: "absolute", top: 190, left: 90, width: 900 }}>
          <Word
            at={0}
            style={{
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 6,
              color: LIGHT.coral,
            }}
          >
            UMA FERRAMENTA DESSAS
          </Word>
        </div>

        {/* Headline. */}
        <div style={{ position: "absolute", top: 244, left: 90, width: 900 }}>
          <div
            style={{
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 82,
              lineHeight: 1,
              color: LIGHT.ink,
              letterSpacing: -1,
            }}
          >
            <Word at={6}>PODE</Word> <Word at={12}>MUDAR</Word>
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: fraunces,
              fontWeight: 700,
              fontSize: 168,
              lineHeight: 1,
              color: LIGHT.coral,
              letterSpacing: -3,
              opacity: frame < 12 ? 0 : interpolate(jogo, [0, 0.35], [0, 1], CLAMP),
              transform: `scale(${0.7 + 0.3 * jogo}) rotate(${Math.sin(frame / 30) * 1}deg)`,
              transformOrigin: "left center",
              textShadow: `0 0 ${30 + 34 * glow}px rgba(217,102,59,${(0.28 + 0.22 * glow).toFixed(2)})`,
            }}
          >
            O JOGO
          </div>
        </div>

        {/* Card do gráfico que sobe. */}
        <div
          style={{
            position: "absolute",
            top: 548,
            left: 90,
            width: 900,
            height: 322,
            borderRadius: 30,
            background: LIGHT.card,
            border: `1px solid ${LIGHT.stroke}`,
            boxShadow: LIGHT.shadow,
            padding: 40,
            overflow: "hidden",
            opacity: interpolate(card, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - card) * 60}px) scale(${0.96 + 0.04 * card})`,
          }}
        >
          <svg width={820} height={260} viewBox="0 0 820 260" style={{ display: "block" }}>
            <defs>
              <linearGradient id="mjArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={LIGHT.coral} stopOpacity={0.28} />
                <stop offset="100%" stopColor={LIGHT.coral} stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* baseline */}
            <line x1={0} y1={260} x2={820} y2={260} stroke={LIGHT.stroke} strokeWidth={2} />
            <polygon points={area} fill="url(#mjArea)" />
            <polyline
              points={line}
              fill="none"
              stroke={LIGHT.coral}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* ponto viajando / ponta do desenho */}
            <circle cx={tip.x} cy={tip.y} r={11} fill={LIGHT.coral} />
            <circle cx={tip.x} cy={tip.y} r={20} fill="none" stroke={LIGHT.coral} strokeWidth={2} opacity={0.5} />
            {/* seta + burst no topo */}
            {arrow > 0 ? (
              <g transform={`translate(${peak.x} ${peak.y})`} opacity={arrow}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <line
                    key={i}
                    x1={0}
                    y1={0}
                    x2={Math.cos((i / 6) * Math.PI * 2) * (16 + 10 * burst)}
                    y2={Math.sin((i / 6) * Math.PI * 2) * (16 + 10 * burst)}
                    stroke={LIGHT.coral}
                    strokeWidth={3}
                    strokeLinecap="round"
                    opacity={0.55}
                  />
                ))}
                <path d="M0,-26 L15,-4 L-15,-4 Z" fill={LIGHT.coral} transform="rotate(38)" />
              </g>
            ) : null}
          </svg>
          {/* rótulo */}
          <div
            style={{
              position: "absolute",
              right: 44,
              top: 40,
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 32,
              color: LIGHT.ink,
              opacity: interpolate(frame, [56, 70], [0, 1], CLAMP),
            }}
          >
            no teu negócio
          </div>
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
