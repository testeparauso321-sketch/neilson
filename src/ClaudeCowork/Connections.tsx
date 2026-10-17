import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS } from "./theme";
import { AGENTS, CORE, WORLD_W, WORLD_H, FLARE_AT, type Agent } from "./config";

type Pt = { x: number; y: number };

// Geometry for one agent -> core link (endpoints pulled in off the card / spark).
const linkGeometry = (agent: Agent) => {
  const P0c: Pt = { x: agent.x, y: agent.y };
  const P2c: Pt = CORE;
  const dx = P2c.x - P0c.x;
  const dy = P2c.y - P0c.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const P0: Pt = { x: P0c.x + ux * 78, y: P0c.y + uy * 78 }; // leave the card edge
  const P2: Pt = { x: P2c.x - ux * 84, y: P2c.y - uy * 84 }; // stop at spark edge
  const mid: Pt = { x: (P0.x + P2.x) / 2, y: (P0.y + P2.y) / 2 };
  const perp: Pt = { x: -uy, y: ux };
  const bow = 64 * agent.bow;
  const P1: Pt = { x: mid.x + perp.x * bow, y: mid.y + perp.y * bow };
  return { P0, P1, P2 };
};

const bezier = (P0: Pt, P1: Pt, P2: Pt, t: number): Pt => {
  const mt = 1 - t;
  return {
    x: mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x,
    y: mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y,
  };
};

const drawWindow = (agent: Agent): [number, number] =>
  agent.id === "a" ? [34, 56] : [agent.activateAt - 6, agent.activateAt + 12];

const frac = (n: number) => n - Math.floor(n);

export const Connections: React.FC = () => {
  const frame = useCurrentFrame();

  // Packets glow brighter once the team is synced.
  const syncBoost = interpolate(frame, [92, FLARE_AT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg
      width={WORLD_W}
      height={WORLD_H}
      viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
    >
      {AGENTS.map((agent) => {
        const { P0, P1, P2 } = linkGeometry(agent);
        const d = `M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`;
        const [ds, de] = drawWindow(agent);
        const draw = interpolate(frame, [ds, de], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Packets begin once the line is drawn.
        const pStart = de;
        const period = 34;
        const packets = [0, 1, 2].map((k) => {
          const g = (frame - pStart) / period - k * 0.34;
          if (g < 0) return null;
          const t = frac(g);
          const pos = bezier(P0, P1, P2, t);
          const fade = interpolate(t, [0, 0.12, 0.82, 1], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return { pos, fade, key: k };
        });

        return (
          <g key={agent.id}>
            <path
              d={d}
              fill="none"
              stroke={COLORS.coral}
              strokeOpacity={0.32 + 0.18 * syncBoost}
              strokeWidth={2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
            />
            {draw > 0.99 &&
              packets.map((p) =>
                p ? (
                  <g key={p.key} opacity={p.fade}>
                    <circle
                      cx={p.pos.x}
                      cy={p.pos.y}
                      r={9 + 3 * syncBoost}
                      fill={COLORS.coralLight}
                      opacity={0.22 + 0.2 * syncBoost}
                    />
                    <circle
                      cx={p.pos.x}
                      cy={p.pos.y}
                      r={4}
                      fill="#FDEFE4"
                    />
                  </g>
                ) : null,
              )}
          </g>
        );
      })}
    </svg>
  );
};
