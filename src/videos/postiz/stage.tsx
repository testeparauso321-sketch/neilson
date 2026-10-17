import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, fraunces, inter } from "./theme";
import { Drift } from "./rig";

// Scaffold comum das cenas de corpo (split-safe): fundo escuro + grade de pontos
// em paralaxe (nunca estático) + Drift, wordmark POSTIZ persistente e uma
// sobrancelha de seção que muda por cena. TODO o conteúdo informativo das cenas
// vive na METADE DE CIMA (y 60→900); o fundo sangra no frame inteiro para
// continuidade sob a máscara da webcam do usuário na metade de baixo.

export const SAFE_TOP = 210; // onde o conteúdo das cenas começa (abaixo do header)

// Wordmark "Postiz" com dot ● vivo pulsando — continuidade de marca.
const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.45 + 0.55 * Math.sin(frame / 7);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: COLORS.coral,
          boxShadow: `0 0 ${8 + 14 * pulse}px rgba(217,119,87,${(
            0.5 + 0.5 * pulse
          ).toFixed(2)})`,
        }}
      />
      <span
        style={{
          fontFamily: fraunces,
          fontWeight: 700,
          fontSize: 44,
          color: COLORS.text,
          letterSpacing: -0.5,
        }}
      >
        Postiz
      </span>
    </div>
  );
};

const EyebrowChip: React.FC<{ label: string }> = ({ label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 180 } });
  return (
    <div
      style={{
        padding: "12px 22px",
        borderRadius: 999,
        background: COLORS.card,
        border: `1px solid ${COLORS.strokeActive}`,
        fontFamily: inter,
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: 4,
        color: COLORS.coralLight,
        opacity: interpolate(s, [0, 0.5], [0, 1], CLAMP),
        transform: `translateX(${(1 - s) * 26}px)`,
      }}
    >
      {label}
    </div>
  );
};

export const Stage: React.FC<{
  eyebrow: string;
  children: React.ReactNode;
}> = ({ eyebrow, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Grade de pontos ambiente com paralaxe lenta (nunca estático). */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,236,224,0.05) 2px, transparent 2px)",
          backgroundSize: "76px 76px",
          backgroundPosition: `${-frame * 0.2}px ${-frame * 0.12}px`,
        }}
      />
      {/* Brilho quente ancorado na metade de cima. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(70% 42% at 50% 30%, rgba(217,119,87,0.12) 0%, rgba(217,119,87,0) 70%)",
        }}
      />
      <Drift>
        {/* Header persistente: wordmark + sobrancelha de seção. */}
        <div
          style={{
            position: "absolute",
            top: 92,
            left: 80,
            right: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Wordmark />
          <EyebrowChip label={eyebrow} />
        </div>
        {/* Régua fina sob o header. */}
        <div
          style={{
            position: "absolute",
            top: 164,
            left: 80,
            right: 80,
            height: 1,
            background: COLORS.stroke,
          }}
        />
        {children}
      </Drift>

      {/* Vinheta em espaço de tela — mantém foco na metade de cima. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(115% 70% at 50% 34%, rgba(23,19,16,0) 52%, rgba(10,8,6,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
