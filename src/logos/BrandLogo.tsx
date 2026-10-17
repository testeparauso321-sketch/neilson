import React from "react";
import { LOGOS, resolveBrand } from "./registry";

// Logo de marca como SVG puro — sem animação embutida: as cenas animam por
// fora (scale/opacity/transform num wrapper). `color` sobrescreve a cor
// oficial para uso monocromático (ex.: branco sobre fundo escuro).

export const BrandLogo: React.FC<{
  /** slug canônico ou alias falado — ver registry.ts (ex.: "claude", "chat gpt") */
  name: string;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ name, size = 96, color, style }) => {
  const logo = resolveBrand(name);
  if (!logo) {
    throw new Error(
      `BrandLogo: marca desconhecida "${name}". Disponíveis: ${Object.keys(LOGOS).join(", ")}`,
    );
  }
  return (
    <svg
      viewBox={logo.viewBox}
      width={size}
      height={size}
      style={style}
      aria-label={logo.title}
    >
      <path d={logo.path} fill={color ?? logo.hex} />
    </svg>
  );
};
