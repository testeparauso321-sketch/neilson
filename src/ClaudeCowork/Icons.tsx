import React from "react";

// Minimal single-stroke glyphs identifying each specialist.
const PATHS: Record<string, React.ReactNode> = {
  research: (
    <>
      <circle cx="10" cy="10" r="6" />
      <line x1="14.5" y1="14.5" x2="20" y2="20" />
    </>
  ),
  code: (
    <>
      <polyline points="8,6 3,12 8,18" />
      <polyline points="16,6 21,12 16,18" />
    </>
  ),
  write: (
    <>
      <path d="M5 19 l0 -3 10 -10 3 3 -10 10 z" />
      <line x1="13" y1="8" x2="16" y2="11" />
    </>
  ),
  design: (
    <>
      <path d="M12 4 L20 18 L4 18 Z" />
    </>
  ),
  review: <polyline points="5,13 10,18 19,6" />,
};

export const Icon: React.FC<{ name: string; color: string; size?: number }> = ({
  name,
  color,
  size = 34,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {PATHS[name]}
  </svg>
);
