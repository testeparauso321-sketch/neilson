import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { CLAMP, COLORS, inter, mono } from "../theme";
import { PluginStage, Punch } from "../plugin";

// Cena 04 — Claude Mem (330f / 11s, split-safe, loopável, motion-graphics +
// terminal). PROBLEMA: sessão nova = reexplicar tudo → a sessão de ONTEM fecha e
// os 3 chips de contexto VOAM para o cofre de memória → a sessão de HOJE abre e
// os chips voltam com "contexto restaurado". Ciclo de 110f × 3 = 330f (loopa).

export const CLAUDEMEM_DURATION = 330;

const CYCLE = 165;

const CHIPS = ["stack", "decisões", "convenções"];

// Geometria (coordenadas relativas à área de demo, que começa em y=466).
const PANEL_TOP = 130;
const SLOT_TOP = 222;
const SLOT_STEP = 42;
const LEFT_X = 106;
const RIGHT_X = 602;
const VAULT_CX = 540;
const VAULT_CY = 48;

const ease = Easing.inOut(Easing.cubic);

const Chip: React.FC<{ index: number; label: string }> = ({ index, label }) => {
  const frame = useCurrentFrame();
  const phase = frame % CYCLE;

  const outAt = 30 + index * 10;
  const inAt = 85 + index * 8;

  const t1 = interpolate(phase, [outAt, outAt + 26], [0, 1], { ...CLAMP, easing: ease });
  const t2 = interpolate(phase, [inAt, inAt + 24], [0, 1], { ...CLAMP, easing: ease });

  const homeX = LEFT_X;
  const homeY = SLOT_TOP + index * SLOT_STEP;
  const vaultX = VAULT_CX - 104 + (index - 1) * 10;
  const vaultY = VAULT_CY - 22 + (index - 1) * 5;
  const newX = RIGHT_X;
  const newY = SLOT_TOP + index * SLOT_STEP;

  const flying = t2 > 0;
  const t = flying ? t2 : t1;
  const x = flying ? vaultX + (newX - vaultX) * t2 : homeX + (vaultX - homeX) * t1;
  const yBase = flying ? vaultY + (newY - vaultY) * t2 : homeY + (vaultY - homeY) * t1;
  const arc = -66 * Math.sin(Math.PI * t);
  const scale = flying ? 0.68 + 0.32 * t2 : 1 - 0.32 * t1;

  // O chip é ABSORVIDO pelo cofre (some ao chegar) e RENASCE dele — assim o
  // rótulo "MEMÓRIA" nunca fica coberto.
  const absorbed = flying
    ? interpolate(t2, [0, 0.22], [0, 1], CLAMP)
    : interpolate(t1, [0.78, 1], [1, 0], CLAMP);

  const opacity =
    absorbed *
    interpolate(phase, [0, 8], [0, 1], CLAMP) *
    interpolate(phase, [148, CYCLE], [1, 0], CLAMP);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: yBase + arc,
        width: 208,
        height: 40,
        borderRadius: 12,
        background: COLORS.cardActive,
        border: `1px solid ${COLORS.strokeActive}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: mono,
        fontWeight: 500,
        fontSize: 26,
        color: COLORS.coralLight,
        boxShadow: "0 10px 26px rgba(0,0,0,0.45)",
        opacity,
        transform: `scale(${scale})`,
        zIndex: 4,
      }}
    >
      {label}
    </div>
  );
};

const SessionPanel: React.FC<{
  left: number;
  title: string;
  sub: string;
  subColor: string;
  subAt: number;
  active: number;
}> = ({ left, title, sub, subColor, subAt, active }) => {
  const frame = useCurrentFrame();
  const phase = frame % CYCLE;
  const subO = interpolate(phase, [subAt, subAt + 10], [0, 1], CLAMP);
  return (
    <div
      style={{
        position: "absolute",
        top: PANEL_TOP,
        left,
        width: 420,
        height: 220,
        borderRadius: 24,
        background: COLORS.term,
        border: `1px solid ${active > 0.6 ? COLORS.strokeActive : COLORS.stroke}`,
        boxShadow: `0 26px 60px rgba(0,0,0,0.5), 0 0 ${
          26 * active
        }px rgba(217,119,87,${(0.28 * active).toFixed(2)})`,
        padding: "20px 24px",
        opacity: 0.4 + 0.6 * active,
      }}
    >
      <div
        style={{
          fontFamily: inter,
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 4,
          color: active > 0.6 ? COLORS.text : COLORS.muted,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 4,
          fontFamily: mono,
          fontSize: 21,
          color: subColor,
          opacity: subO,
          whiteSpace: "pre",
        }}
      >
        {sub}
      </div>
    </div>
  );
};

export const Scene04ClaudeMem: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = frame % CYCLE;

  // Sessão de ontem acesa no começo do ciclo; a de hoje acende no fim.
  const oldActive =
    interpolate(phase, [0, 6], [0, 1], CLAMP) *
    interpolate(phase, [26, 40], [1, 0.12], CLAMP);
  const newActive = interpolate(phase, [80, 96], [0.12, 1], CLAMP);

  // Cofre pulsa a cada chip que chega.
  const arrivals = [56, 66, 76];
  const vaultPulse = arrivals.reduce(
    (acc, a) => Math.max(acc, interpolate(phase, [a, a + 3, a + 18], [0, 1, 0], CLAMP)),
    0,
  );
  const breathe = 0.5 + 0.5 * Math.sin(frame / 12);

  return (
    <PluginStage
      index={3}
      name="Claude Mem"
      problem={
        <>
          Sessão nova ={" "}
          <span style={{ color: COLORS.text, fontWeight: 800 }}>reexplicar tudo</span>.
        </>
      }
    >
      {/* Cofre de memória. */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: VAULT_CX - 170,
          width: 340,
          height: 96,
          borderRadius: 22,
          background: COLORS.bgLift,
          border: `1px solid ${COLORS.strokeActive}`,
          boxShadow: `0 0 ${28 + 46 * vaultPulse + 14 * breathe}px rgba(217,119,87,${(
            0.3 + 0.4 * vaultPulse
          ).toFixed(2)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          transform: `scale(${1 + 0.05 * vaultPulse})`,
          zIndex: 2,
        }}
      >
        {/* Pilha (memória persistida). */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 40,
                height: 9,
                borderRadius: 4,
                background: COLORS.coral,
                opacity: 0.45 + 0.55 * Math.max(vaultPulse, i === 0 ? breathe * 0.5 : 0.2),
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 4,
            color: COLORS.coralLight,
          }}
        >
          MEMÓRIA
        </span>
      </div>

      {/* Trilhos entre as sessões e o cofre. */}
      <svg
        width={1080}
        height={380}
        viewBox="0 0 1080 380"
        style={{ position: "absolute", top: 0, left: 0, opacity: 0.35 }}
      >
        <path
          d="M 292 190 C 330 110, 330 60, 366 50"
          fill="none"
          stroke={COLORS.strokeActive}
          strokeWidth={2}
          strokeDasharray="6 14"
          strokeDashoffset={-frame * 0.9}
        />
        <path
          d="M 714 50 C 750 60, 750 110, 788 190"
          fill="none"
          stroke={COLORS.strokeActive}
          strokeWidth={2}
          strokeDasharray="6 14"
          strokeDashoffset={-frame * 0.9}
        />
      </svg>

      {/* Sessões. */}
      <SessionPanel
        left={82}
        title="ONTEM"
        sub="session ended"
        subColor={COLORS.muted}
        subAt={28}
        active={oldActive}
      />
      <SessionPanel
        left={578}
        title="HOJE"
        sub="↺ contexto restaurado ✓"
        subColor={COLORS.green}
        subAt={130}
        active={newActive}
      />

      {/* Chips de contexto voando ONTEM → cofre → HOJE. */}
      {CHIPS.map((c, i) => (
        <Chip key={c} index={i} label={c} />
      ))}

      <Punch at={250}>NUNCA MAIS DO ZERO</Punch>
    </PluginStage>
  );
};
