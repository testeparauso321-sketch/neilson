import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, inter, mono } from "./theme";
import { Drift } from "./rig";
import { BrandLogo } from "../../logos/BrandLogo";

// Scaffold comum dos 5 cards de plugin (formato lista, replicando o #0):
// lockup Claude Code + trilho de progresso 1→5 no header, PROBLEMA no topo
// (a tensão vem antes da solução), badge de índice coral + nome do plugin, e a
// área de demo. TODO o conteúdo informativo vive na METADE DE CIMA (y 92→912);
// o fundo (grade, gradiente, vinheta) sangra no frame inteiro para continuidade
// sob a máscara da webcam do usuário na metade de baixo.

export const DEMO_TOP = 466; // topo da área de demo de cada cena
export const PUNCH_TOP = 844; // faixa de punch no fim da faixa segura

// Trilho de progresso: 5 pílulas, as <= active acesas, a atual pulsa.
const ProgressRail: React.FC<{ active: number }> = ({ active }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const on = i + 1 <= active;
        const isCur = i + 1 === active;
        const pulse = isCur ? 1 + 0.07 * Math.sin(frame / 7) : 1;
        return (
          <div
            key={i}
            style={{
              width: isCur ? 52 : 28,
              height: 13,
              borderRadius: 999,
              background: on ? COLORS.coral : COLORS.card,
              border: `1px solid ${on ? COLORS.coralLight : COLORS.stroke}`,
              boxShadow: isCur ? "0 0 22px rgba(217,119,87,0.8)" : "none",
              transform: `scale(${pulse})`,
            }}
          />
        );
      })}
      <div
        style={{
          marginLeft: 12,
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 26,
          letterSpacing: 2,
          color: COLORS.muted,
        }}
      >
        {active}/5
      </div>
    </div>
  );
};

// Lockup persistente da marca: logo oficial do Claude + "CLAUDE CODE".
const Lockup: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.45 + 0.55 * Math.sin(frame / 9);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          display: "flex",
          filter: `drop-shadow(0 0 ${6 + 12 * pulse}px rgba(217,119,87,0.55))`,
        }}
      >
        <BrandLogo name="claude" size={46} color={COLORS.coral} />
      </div>
      <span
        style={{
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 32,
          letterSpacing: 4,
          color: COLORS.text,
        }}
      >
        CLAUDE CODE
      </span>
    </div>
  );
};

// Punch do fim da cena: pílula coral que carimba (scale + glow).
// Renderiza DENTRO da área de demo, então o topo é relativo a DEMO_TOP.
export const Punch: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({
    frame: frame - at,
    fps,
    config: { damping: 13, stiffness: 160 },
  });
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);
  return (
    <div
      style={{
        position: "absolute",
        top: PUNCH_TOP - DEMO_TOP,
        left: 0,
        width: 1080,
        textAlign: "center",
        opacity: frame < at ? 0 : interpolate(s, [0, 0.4], [0, 1], CLAMP),
        transform: `scale(${0.78 + 0.22 * s})`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          padding: "13px 34px",
          borderRadius: 999,
          background: "rgba(217,119,87,0.16)",
          border: `1px solid ${COLORS.strokeActive}`,
          boxShadow: `0 0 ${20 + 26 * glow}px rgba(217,119,87,${(
            0.18 + 0.22 * glow
          ).toFixed(2)})`,
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 2,
          color: COLORS.coralLight,
        }}
      >
        {children}
      </span>
    </div>
  );
};

export const PluginStage: React.FC<{
  index: number;
  name: string;
  /** a tensão — entra antes do nome do plugin */
  problem: React.ReactNode;
  /** frame em que o badge + nome carimbam */
  nameAt?: number;
  /** selo opcional ao lado do nome (ex.: "oficial da Anthropic") */
  badge?: React.ReactNode;
  children: React.ReactNode;
}> = ({ index, name, problem, nameAt = 52, badge, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const probO = interpolate(frame, [4, 18], [0, 1], CLAMP);
  const probX = interpolate(frame, [4, 22], [-30, 0], CLAMP);

  const stamp = spring({
    frame: frame - nameAt,
    fps,
    config: { damping: 14, stiffness: 190 },
  });
  const nameO = interpolate(frame, [nameAt + 6, nameAt + 18], [0, 1], CLAMP);
  const nameX = interpolate(frame, [nameAt + 6, nameAt + 20], [-28, 0], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: "hidden" }}>
      {/* Grade de pontos ambiente com paralaxe lenta (nunca estático). */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "radial-gradient(rgba(244,236,224,0.05) 2px, transparent 2px)",
          backgroundSize: "76px 76px",
          backgroundPosition: `${-frame * 0.22}px ${-frame * 0.13}px`,
        }}
      />
      {/* Brilho quente ancorado na metade de cima. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(72% 42% at 50% 28%, rgba(217,119,87,0.13) 0%, rgba(217,119,87,0) 70%)",
        }}
      />

      <Drift>
        {/* Header persistente: lockup Claude Code + trilho 1→5. */}
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
          <Lockup />
          <ProgressRail active={index} />
        </div>
        <div
          style={{
            position: "absolute",
            top: 162,
            left: 80,
            right: 80,
            height: 1,
            background: COLORS.stroke,
          }}
        />

        {/* O PROBLEMA — abre a cena (tensão antes da solução). */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 82,
            right: 82,
            fontFamily: inter,
            fontWeight: 600,
            fontSize: 50,
            lineHeight: 1.16,
            color: COLORS.muted,
            opacity: probO,
            transform: `translateX(${probX}px)`,
          }}
        >
          {problem}
        </div>

        {/* A SOLUÇÃO — badge de índice + nome do plugin. */}
        <div
          style={{
            position: "absolute",
            top: 330,
            left: 82,
            right: 82,
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 26,
              background: COLORS.coral,
              border: `1px solid ${COLORS.coralLight}`,
              boxShadow: "0 0 46px rgba(217,119,87,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              opacity: frame < nameAt ? 0 : 1,
              transform: `scale(${0.5 + 0.5 * stamp}) rotate(${(1 - stamp) * -12}deg)`,
            }}
          >
            <span
              style={{
                fontFamily: inter,
                fontWeight: 800,
                fontSize: 54,
                color: COLORS.bg,
                letterSpacing: -2,
              }}
            >
              {String(index).padStart(2, "0")}
            </span>
          </div>
          <div
            style={{
              opacity: nameO,
              transform: `translateX(${nameX}px)`,
              display: "flex",
              alignItems: "baseline",
              gap: 22,
            }}
          >
            <span
              style={{
                fontFamily: mono,
                fontWeight: 700,
                fontSize: 62,
                color: COLORS.text,
                lineHeight: 1,
              }}
            >
              {name}
            </span>
            {badge}
          </div>
        </div>

        {/* Área do mini-demo (y 466 → ~850). */}
        <div style={{ position: "absolute", top: DEMO_TOP, left: 0, width: 1080 }}>
          {children}
        </div>
      </Drift>

      {/* Vinheta em espaço de tela — mantém o foco na metade de cima. */}
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(115% 70% at 50% 32%, rgba(23,19,16,0) 52%, rgba(10,8,6,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
