import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter } from "../theme";
import { Drift } from "../rig";

// Cena 04 — Ranking com sinais reais (180f / 6s, split-safe, article-highlights).
// Três stat-cards empilham; números rolam; sublinhado coral em "reais"/"real".

export const RANKING_DURATION = 180;

const fmt = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

type Stat = {
  icon: string;
  value: number;
  prefix?: string;
  labelBefore: string;
  keyword: string;
  labelAfter?: string;
};

const STATS: Stat[] = [
  { icon: "▲", value: 12437, labelBefore: "upvotes ", keyword: "reais" },
  { icon: "▶", value: 2104882, labelBefore: "visualizações ", keyword: "reais" },
  {
    icon: "$",
    value: 1800000,
    prefix: "$ ",
    labelBefore: "dinheiro ",
    keyword: "real",
    labelAfter: " · Polymarket",
  },
];

const StatCard: React.FC<{ stat: Stat; at: number }> = ({ stat, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 20, stiffness: 160 },
  });
  const value = interpolate(frame, [at + 8, at + 66], [0, stat.value], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const underline = interpolate(frame, [at + 48, at + 64], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 0.75 + 0.25 * Math.sin(frame / 9);
  return (
    <div
      style={{
        width: 880,
        borderRadius: 24,
        background: COLORS.card,
        border: `1px solid ${COLORS.stroke}`,
        boxShadow: "0 26px 60px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: 34,
        padding: "34px 44px",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `translateY(${(1 - s) * 80}px) scale(${0.94 + 0.06 * s})`,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: 22,
          background: COLORS.cardActive,
          border: `1px solid ${COLORS.strokeActive}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 44,
          color: COLORS.coral,
          textShadow: "0 0 22px rgba(217,119,87,0.6)",
          flexShrink: 0,
        }}
      >
        {stat.icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 78,
            color: COLORS.text,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.05,
          }}
        >
          {stat.prefix ?? ""}
          {fmt(value)}
        </div>
        <div
          style={{
            fontFamily: inter,
            fontWeight: 500,
            fontSize: 34,
            color: COLORS.muted,
          }}
        >
          {stat.labelBefore}
          <span style={{ position: "relative", color: COLORS.text, fontWeight: 700 }}>
            {stat.keyword}
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: -7,
                height: 6,
                width: `${underline * 100}%`,
                borderRadius: 4,
                background: COLORS.coral,
                boxShadow: `0 0 16px rgba(217,119,87,${(0.7 * pulse).toFixed(2)})`,
              }}
            />
          </span>
          {stat.labelAfter ?? ""}
        </div>
      </div>
    </div>
  );
};

export const Scene04Ranking: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      <Drift amount={1.2}>
        <div
          style={{
            position: "absolute",
            left: 100,
            top: 130,
            display: "flex",
            flexDirection: "column",
            gap: 34,
          }}
        >
          <StatCard stat={STATS[0]} at={8} />
          <StatCard stat={STATS[1]} at={30} />
          <StatCard stat={STATS[2]} at={52} />
        </div>
      </Drift>
    </AbsoluteFill>
  );
};
