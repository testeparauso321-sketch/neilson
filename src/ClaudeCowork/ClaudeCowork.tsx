import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { COLORS, fraunces } from "./theme";
import {
  AGENTS,
  CORE,
  KEY_T,
  KEY_FX,
  KEY_FY,
  KEY_Z,
  VIEW_W,
  VIEW_H,
  WORLD_W,
  WORLD_H,
} from "./config";
import { Spark } from "./Spark";
import { AgentNode } from "./AgentNode";
import { Connections } from "./Connections";

const ease = Easing.inOut(Easing.cubic);

export const ClaudeCowork: React.FC = () => {
  const frame = useCurrentFrame();

  // ---- Shared camera rig ----
  const fx = interpolate(frame, KEY_T, KEY_FX, {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fy = interpolate(frame, KEY_T, KEY_FY, {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const z = interpolate(frame, KEY_T, KEY_Z, {
    easing: ease,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Core glow strengthens as the team wakes up.
  const wake = interpolate(frame, [40, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // End lockup.
  const lockup = interpolate(frame, [120, 142], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* ---- World (moved by the camera) ---- */}
      <div
        style={{
          position: "absolute",
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate(${VIEW_W / 2 - fx}px, ${
            VIEW_H / 2 - fy
          }px) scale(${z})`,
          transformOrigin: `${fx}px ${fy}px`,
        }}
      >
        {/* Warm core glow lighting the scene from the centre. */}
        <div
          style={{
            position: "absolute",
            left: CORE.x - 620,
            top: CORE.y - 620,
            width: 1240,
            height: 1240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(217,119,87,0.28) 0%, rgba(190,95,60,0.10) 34%, rgba(23,19,16,0) 66%)",
            opacity: 0.35 + 0.65 * wake,
          }}
        />

        {/* Connection lines + flowing packets (under the cards). */}
        <Connections />

        {/* Specialist agents around the ring. */}
        {AGENTS.map((agent) => (
          <AgentNode key={agent.id} agent={agent} />
        ))}

        {/* Central Claude spark (orchestrator). */}
        <div style={{ position: "absolute", left: CORE.x, top: CORE.y }}>
          <Spark size={300} />
        </div>

        {/* End lockup below the constellation. */}
        <div
          style={{
            position: "absolute",
            left: CORE.x - 500,
            top: 1808,
            width: 1000,
            textAlign: "center",
            opacity: lockup,
            transform: `translateY(${interpolate(lockup, [0, 1], [16, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fraunces,
              fontWeight: 600,
              fontSize: 62,
              color: COLORS.text,
              letterSpacing: -0.5,
            }}
          >
            Claude{" "}
            <span style={{ color: COLORS.coral }}>Cowork</span>
          </div>
        </div>
      </div>

      {/* ---- Screen-space vignette ---- */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(120% 80% at 50% 42%, rgba(23,19,16,0) 46%, rgba(10,8,6,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
