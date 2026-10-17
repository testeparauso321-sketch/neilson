import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { COLORS, inter } from "./theme";
import { Icon } from "./Icons";
import { FLARE_AT, type Agent } from "./config";

const CARD_W = 322;
const CARD_H = 112;

// A specialist agent card. It sits fixed in the world ring; it "comes online"
// (fades to full, accent lights up, task fills) at its activation frame, then
// pulses in sync with the rest of the team on the flare.
export const AgentNode: React.FC<{ agent: Agent }> = ({ agent }) => {
  const frame = useCurrentFrame();
  const { x, y, activateAt } = agent;

  // The opening agent is already online and working when we cut in.
  const isOpening = activateAt === 0;

  // Idle -> online.
  const online = isOpening
    ? 1
    : interpolate(frame, [activateAt, activateAt + 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      });

  // Task progress bar fills after coming online (immediately for the opener).
  const fillStart = isOpening ? 0 : activateAt + 6;
  const progress = interpolate(frame, [fillStart, fillStart + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });
  const done = progress > 0.999;

  // Unified sync pulse on the flare.
  const pulse = interpolate(
    frame,
    [FLARE_AT - 6, FLARE_AT + 2, FLARE_AT + 16],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = 0.24 + 0.76 * online;
  const scale = (0.97 + 0.03 * online) * (1 + 0.05 * pulse);
  const accent = COLORS.coral;
  const iconColor = online > 0.5 ? accent : COLORS.muted;

  return (
    <div
      style={{
        position: "absolute",
        left: x - CARD_W / 2,
        top: y - CARD_H / 2,
        width: CARD_W,
        height: CARD_H,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 22,
          background: online > 0.5 ? COLORS.cardActive : COLORS.card,
          border: `1.5px solid ${
            online > 0.5 ? COLORS.strokeActive : COLORS.stroke
          }`,
          boxShadow:
            online > 0.5
              ? `0 0 ${18 + 26 * pulse}px rgba(217,119,87,${0.16 + 0.3 * pulse})`
              : "none",
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 22px",
        }}
      >
        {/* Icon badge */}
        <div
          style={{
            width: 60,
            height: 60,
            flexShrink: 0,
            borderRadius: 16,
            background: online > 0.5 ? "rgba(217,119,87,0.14)" : "rgba(244,236,224,0.05)",
            border: `1.5px solid ${online > 0.5 ? "rgba(217,119,87,0.4)" : COLORS.stroke}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={agent.icon} color={iconColor} size={32} />
        </div>

        {/* Label + task progress */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: inter,
              fontWeight: 600,
              fontSize: 34,
              letterSpacing: -0.3,
              color: COLORS.text,
              marginBottom: 12,
            }}
          >
            {agent.label}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                flex: 1,
                height: 8,
                borderRadius: 4,
                background: "rgba(244,236,224,0.09)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress * 100}%`,
                  height: "100%",
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
                }}
              />
            </div>
            {/* Status dot: fills to a check when the task completes. */}
            <div
              style={{
                width: 22,
                height: 22,
                flexShrink: 0,
                borderRadius: "50%",
                background: done ? COLORS.coral : "transparent",
                border: `1.5px solid ${done ? COLORS.coral : COLORS.muted}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {done ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#171310" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="5,13 10,18 19,6" />
                </svg>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
