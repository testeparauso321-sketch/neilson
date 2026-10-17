// Claude Cowork — shared world configuration.
// One continuous scene: a central Claude "spark" (the orchestrator) with a ring
// of specialist agents around it. The camera travels through this world.

export const FPS = 30;
export const DURATION = 180; // 6s

// Viewport (vertical short-form).
export const VIEW_W = 1080;
export const VIEW_H = 1920;

// World is larger than the viewport so the camera can travel through it.
export const WORLD_W = 1600;
export const WORLD_H = 2400;

// The orchestrator core sits at the world centre.
export const CORE = { x: 800, y: 1200 };

// Ring radius for the specialist agents.
export const RING_R = 470;

type IconKey = "research" | "code" | "write" | "design" | "review";

export type Agent = {
  id: string;
  label: string;
  icon: IconKey;
  theta: number; // degrees, CCW from +x axis
  x: number;
  y: number;
  // When this agent "comes online" (card lights up + its line finishes drawing).
  activateAt: number;
  // Slight alternating bow direction for its connection line.
  bow: 1 | -1;
};

const at = (theta: number) => ({
  x: Math.round(CORE.x + RING_R * Math.cos((theta * Math.PI) / 180)),
  y: Math.round(CORE.y - RING_R * Math.sin((theta * Math.PI) / 180)),
});

// Agent A (research) sits directly above the core (theta 90) so the opening
// dolly-out is a clean vertical move (same x as the core).
export const AGENTS: Agent[] = [
  { id: "a", label: "Research", icon: "research", theta: 90, ...at(90), activateAt: 0, bow: 1 },
  { id: "b", label: "Code", icon: "code", theta: 18, ...at(18), activateAt: 58, bow: -1 },
  { id: "c", label: "Write", icon: "write", theta: 306, ...at(306), activateAt: 64, bow: 1 },
  { id: "d", label: "Design", icon: "design", theta: 234, ...at(234), activateAt: 70, bow: -1 },
  { id: "e", label: "Review", icon: "review", theta: 162, ...at(162), activateAt: 76, bow: 1 },
];

// ---- Camera rig keyframes (one shared timeline) ----
// A (research) is directly above the core, so fx is constant and the move reads
// as a vertical dolly-out from one working agent to the whole coordinated team.
export const KEY_T = [0, 34, 56, 92, 114, DURATION];
export const KEY_FX = [CORE.x, CORE.x, CORE.x, CORE.x, CORE.x, CORE.x];
export const KEY_FY = [AGENTS[0].y, AGENTS[0].y, CORE.y, CORE.y, CORE.y, CORE.y];
export const KEY_Z = [2.1, 2.1, 0.82, 0.82, 0.86, 0.86];

// Sync "flare" window — all agents pulse together and packets converge.
export const FLARE_AT = 104;
