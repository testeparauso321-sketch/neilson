import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "./theme";

// ---------------------------------------------------------------------------
// Sistema LIQUID GLASS.
//
// O material da Apple não é blur: é REFRAÇÃO (lensing) + specular highlight +
// sombra adaptativa. Reproduzido aqui em 5 camadas, todas baratas o bastante
// para 2100 frames em 1080×1920:
//
//   1. o fundo se deforma de verdade  → feTurbulence + feDisplacementMap num
//      `filter:` normal (suporte total), não em `backdrop-filter` (Chromium-only
//      e caríssimo em tela cheia).
//   2. frost                          → backdrop-filter: blur + saturate.
//   3. lente de quina                 → anel de 14px com backdrop mais claro e
//      menos blur, recortado por mask-composite — é o que faz a borda "engordar"
//      a luz atrás dela.
//   4. rim cromático                  → conic-gradient em borda mascarada.
//   5. specular                       → banda varrendo em blend `screen`.
// ---------------------------------------------------------------------------

const GRAIN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='240' height='240' filter='url(#n)'/></svg>`;

export const GRAIN_URL = `url("data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}")`;

/** Grão de filme — tira o "digital limpo demais" do preto absoluto. */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  // Salta de posição a cada frame: grão vivo, não textura parada.
  const x = (frame * 37) % 240;
  const y = (frame * 61) % 240;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: GRAIN_URL,
        backgroundPosition: `${x}px ${y}px`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    />
  );
};

type BlobSpec = {
  x: number;
  y: number;
  r: number;
  color: string;
  /** velocidade e fase da deriva */
  sx: number;
  sy: number;
  ph: number;
};

// Metade da resolução: o filtro de turbulência roda em 540×960 e só depois a
// camada é escalada 2×. Fica 4× mais barato e blob borrado não perde nada.
const HALF_W = 540;
const HALF_H = 960;

// Luz forte, e de propósito espalhada pelas bordas: é ela que o vidro refrata.
// Com blobs fracos o painel vira plástico cinza — foi o erro do primeiro teste.
const DEFAULT_BLOBS: BlobSpec[] = [
  { x: 78, y: 196, r: 268, color: "rgba(255,255,255,0.52)", sx: 71, sy: 97, ph: 0 },
  { x: 472, y: 296, r: 252, color: "rgba(178,205,255,0.44)", sx: 89, sy: 63, ph: 1.7 },
  { x: 268, y: 556, r: 340, color: `rgba(${COLORS.coralRGB},0.42)`, sx: 111, sy: 83, ph: 3.1 },
  { x: 452, y: 752, r: 286, color: "rgba(255,255,255,0.26)", sx: 57, sy: 121, ph: 4.4 },
  { x: 84, y: 828, r: 250, color: "rgba(165,190,255,0.24)", sx: 133, sy: 74, ph: 5.6 },
];

/**
 * Fundo líquido: preto absoluto + blobs de luz que se deformam por turbulência.
 * É a única fonte de contraste do vídeo — sem ele o vidro não teria o que refratar.
 */
export const LiquidBackdrop: React.FC<{
  idPrefix: string;
  blobs?: BlobSpec[];
  /** 0 = quase parado, 1 = padrão, 2 = agitado (usado no hook) */
  energy?: number;
  grid?: boolean;
}> = ({ idPrefix, blobs = DEFAULT_BLOBS, energy = 1, grid = true }) => {
  const frame = useCurrentFrame();
  const fid = `${idPrefix}-liquid`;

  const freq = 0.0055 + Math.sin(frame / 78) * 0.0022;
  const scale = (52 + Math.sin(frame / 44) * 30) * energy;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={freq}
              numOctaves={2}
              seed={7}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: HALF_W,
          height: HALF_H,
          transform: "scale(2)",
          transformOrigin: "0 0",
          filter: `url(#${fid}) blur(18px)`,
        }}
      >
        {blobs.map((b, i) => {
          const bx = b.x + Math.sin(frame / b.sx + b.ph) * 46 * energy;
          const by = b.y + Math.cos(frame / b.sy + b.ph) * 38 * energy;
          const br = b.r * (1 + Math.sin(frame / 67 + b.ph) * 0.09 * energy);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: bx - br,
                top: by - br,
                width: br * 2,
                height: br * 2,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
              }}
            />
          );
        })}
      </div>

      {/* Cáusticas: fios de luz diagonais escorrendo. É o que lê como "líquido". */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(102deg, rgba(255,255,255,0) 0px, rgba(255,255,255,0.055) 3px, rgba(255,255,255,0) 9px, rgba(255,255,255,0) 118px)",
          backgroundPosition: `${frame * 1.6}px ${frame * 0.7}px`,
          opacity: 0.32,
          mixBlendMode: "screen",
          maskImage:
            "radial-gradient(140% 78% at 50% 24%, #000 0%, rgba(0,0,0,0.35) 62%, transparent 100%)",
        }}
      />

      {grid ? (
        <AbsoluteFill
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)",
            backgroundSize: "64px 64px",
            backgroundPosition: `${-frame * 0.4}px ${-frame * 0.28}px`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};

/** Vinheta de espaço de tela — some depois do rig de câmera. */
export const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background:
        "radial-gradient(128% 80% at 50% 30%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.66) 100%)",
    }}
  />
);

// --- máscara de "só a borda" (truque padrão do mask-composite) ---------------
const ringMask = (pad: number): React.CSSProperties => ({
  padding: pad,
  WebkitMask:
    "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
});

export type GlassProps = {
  children?: React.ReactNode;
  radius?: number;
  /** intensidade do frost */
  blur?: number;
  /** 0..1 — quanto o painel "acende" (usado em impactos) */
  hot?: number;
  /** fase do specular; passe o frame para a banda varrer */
  sweep?: number;
  /** tinge o vidro de coral (estado ativo) */
  tint?: number;
  style?: React.CSSProperties;
  /** desliga a lente de quina em painéis muito pequenos */
  lens?: boolean;
  /** estilo do wrapper interno — é ele que recebe os filhos, então é aqui que
   * mora qualquer layout (flex/gap). Sem isso, um `gap` no painel não vale
   * para os filhos: eles vivem um nível abaixo. */
  contentStyle?: React.CSSProperties;
};

/**
 * Painel de vidro. O `boxShadow` é onde mora quase toda a leitura do material:
 * lábio superior brilhante, lábio inferior fraco, luz interna difusa e uma
 * sombra externa longa que separa o painel do preto.
 */
export const GlassPanel: React.FC<GlassProps> = ({
  children,
  radius = 34,
  blur = 30,
  hot = 0,
  sweep = 0,
  tint = 0,
  style,
  lens = true,
  contentStyle,
}) => {
  const rimA = 0.42 + 0.5 * hot;
  const rimB = 0.14 + 0.28 * hot;
  const sweepX = ((sweep % 200) / 200) * 260 - 80;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        isolation: "isolate",
        background: `linear-gradient(148deg, rgba(255,255,255,${(
          0.1 +
          0.1 * hot
        ).toFixed(3)}) 0%, rgba(255,255,255,0.028) 42%, rgba(255,255,255,${(
          0.055 +
          0.06 * hot
        ).toFixed(3)}) 100%), linear-gradient(0deg, rgba(${COLORS.coralRGB},${(
          0.1 * tint
        ).toFixed(3)}), rgba(${COLORS.coralRGB},${(0.1 * tint).toFixed(3)}))`,
        backdropFilter: `blur(${blur}px) saturate(1.7) brightness(1.05)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(1.7) brightness(1.05)`,
        boxShadow: [
          `inset 0 1.5px 0 0 rgba(255,255,255,${rimA.toFixed(3)})`,
          `inset 1.5px 0 0 0 rgba(255,255,255,${(rimB * 1.1).toFixed(3)})`,
          `inset -1.5px 0 0 0 rgba(255,255,255,${(rimB * 0.85).toFixed(3)})`,
          `inset 0 -1.5px 0 0 rgba(255,255,255,${(rimB * 1.4).toFixed(3)})`,
          `inset 0 26px 52px -26px rgba(255,255,255,${(0.3 + 0.3 * hot).toFixed(3)})`,
          `inset 0 -34px 64px -34px rgba(255,255,255,0.1)`,
          `0 44px 92px -22px rgba(0,0,0,0.88)`,
          `0 10px 28px rgba(0,0,0,0.6)`,
          hot > 0.01
            ? `0 0 ${(50 * hot).toFixed(0)}px rgba(255,255,255,${(0.2 * hot).toFixed(3)})`
            : `0 0 0 rgba(0,0,0,0)`,
        ].join(", "),
        ...style,
      }}
    >
      {/* 3. lente de quina — a luz de trás engorda na borda */}
      {lens ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            backdropFilter: "blur(2px) brightness(1.6) saturate(1.5)",
            WebkitBackdropFilter: "blur(2px) brightness(1.6) saturate(1.5)",
            pointerEvents: "none",
            ...ringMask(13),
          }}
        />
      ) : null}

      {/* 4. rim cromático — aberração só na quina, nunca no texto */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: `conic-gradient(from ${(sweep * 1.6) % 360}deg at 50% 50%, rgba(255,255,255,0) 0deg, ${
            COLORS.chromaA
          } 46deg, rgba(255,255,255,0.9) 92deg, ${COLORS.chromaB} 140deg, rgba(255,255,255,0) 200deg, rgba(${
            COLORS.coralRGB
          },0.5) 268deg, rgba(255,255,255,0.75) 312deg, rgba(255,255,255,0) 360deg)`,
          opacity: 0.55 + 0.4 * hot,
          pointerEvents: "none",
          ...ringMask(1.6),
        }}
      />

      {/* 5. specular varrendo */}
      <div
        style={{
          position: "absolute",
          inset: "-30%",
          transform: `translateX(${sweepX}%) rotate(16deg)`,
          background:
            "linear-gradient(90deg, transparent 34%, rgba(255,255,255,0.16) 46%, rgba(255,255,255,0.42) 50%, rgba(255,255,255,0.16) 54%, transparent 66%)",
          mixBlendMode: "screen",
          // Baixo de propósito: em painéis grandes a banda lavava texto cinza
          // e sumia com os rótulos da sidebar.
          opacity: 0.3 + 0.35 * hot,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 2, height: "100%", ...contentStyle }}>
        {children}
      </div>
    </div>
  );
};

/** Chip/pill de vidro — versão leve, sem lente (borda fina demais pra valer). */
export const GlassPill: React.FC<GlassProps> = ({
  children,
  radius = 999,
  blur = 18,
  hot = 0,
  tint = 0,
  sweep = 0,
  style,
  contentStyle,
}) => (
  <GlassPanel
    radius={radius}
    blur={blur}
    hot={hot}
    tint={tint}
    sweep={sweep}
    lens={false}
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "14px 28px",
      ...style,
    }}
    // O flex tem que viver no wrapper interno, que é quem recebe os filhos.
    contentStyle={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      ...contentStyle,
    }}
  >
    {children}
  </GlassPanel>
);

/**
 * Texto com separação cromática — a "vibração" pedida no gancho. Em `amount`
 * alto as cópias ciano/coral se afastam e o texto parece tremer na tela.
 */
export const ChromaText: React.FC<{
  children: React.ReactNode;
  amount: number;
  style?: React.CSSProperties;
}> = ({ children, amount, style }) => (
  <span style={{ position: "relative", display: "inline-block", ...style }}>
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        color: "#4FC3FF",
        transform: `translate(${amount}px, ${amount * 0.35}px)`,
        mixBlendMode: "screen",
        opacity: Math.min(1, Math.abs(amount) / 5),
      }}
    >
      {children}
    </span>
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        color: COLORS.coral,
        transform: `translate(${-amount}px, ${-amount * 0.35}px)`,
        mixBlendMode: "screen",
        opacity: Math.min(1, Math.abs(amount) / 5),
      }}
    >
      {children}
    </span>
    <span style={{ position: "relative" }}>{children}</span>
  </span>
);
