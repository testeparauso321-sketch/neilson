import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, geist, SPRING } from "../theme";
import { GlassPanel, GlassPill, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig, Word } from "../rig";

// Cena 03 — A ESCALA (360f / 12s, loopável). "31 tarefas empacotadas". O número
// conta com mola, e três esteiras de chips de vidro correm em direções alternadas
// — translate contínuo com duas cópias da lista, então a cena fecha em loop
// perfeito e absorve sobra de tempo no master.

export const ESCALA_DURATION = 360;

const TOTAL = 31;

// Linguagem de negócio, nunca jargão técnico (regra dura do vault).
const BELTS: string[][] = [
  ["cobrar fatura vencida", "planejar a folha", "organizar o CRM", "revisar contrato", "criar vaga"],
  ["conciliar o extrato", "montar orçamento", "responder proposta", "agendar reunião", "emitir nota fiscal"],
  ["controlar estoque", "atualizar cadastro", "cobrar assinatura", "fechar o caixa", "montar relatório"],
];

const CHIP_W = 384;
const GAP = 24;
const PITCH = CHIP_W + GAP;

const Belt: React.FC<{ items: string[]; dir: 1 | -1; speed: number; row: number }> = ({
  items,
  dir,
  speed,
  row,
}) => {
  const frame = useCurrentFrame();
  const cycle = items.length * PITCH;
  const raw = (frame * speed) % cycle;
  const x = dir === -1 ? -raw : raw - cycle;

  return (
    <div style={{ position: "absolute", left: 0, width: 1080, height: 96, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          display: "flex",
          gap: GAP,
          transform: `translateX(${x}px)`,
        }}
      >
        {[...items, ...items, ...items].map((t, i) => (
          <div
            key={i}
            style={{
              width: CHIP_W,
              flexShrink: 0,
            }}
          >
            <GlassPanel
              radius={26}
              blur={16}
              lens={false}
              sweep={frame * 1.4 + i * 30 + row * 60}
              style={{ height: 88 }}
            >
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  padding: "0 18px",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    background: COLORS.coral,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: geist,
                    fontWeight: 600,
                    fontSize: 31,
                    color: COLORS.text2,
                    whiteSpace: "nowrap",
                    letterSpacing: -0.3,
                  }}
                >
                  {t}
                </span>
              </div>
            </GlassPanel>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Scene03Escala: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const conta = spring({ frame: frame - 8, fps, config: { damping: 15, stiffness: 90 } });
  const n = Math.round(interpolate(conta, [0, 1], [0, TOTAL], CLAMP));
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);

  const fecho = spring({ frame: frame - 300, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="escala" energy={1.3} />

      <Rig impacts={[8, 62, 300]} push={[1.12, 1.02]} amount={0.9} origin="540px 260px">
        {/* Anel de vidro girando atrás do número. */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 288,
            width: 420,
            height: 420,
            marginLeft: -210,
            marginTop: -210,
            borderRadius: "50%",
            border: `2px solid rgba(255,255,255,0.13)`,
            transform: `rotate(${frame * 0.6}deg)`,
            boxShadow: `inset 0 0 60px rgba(255,255,255,0.07), 0 0 70px rgba(${COLORS.coralRGB},${(
              0.1 +
              0.1 * pulse
            ).toFixed(2)})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 288,
            width: 520,
            height: 520,
            marginLeft: -260,
            marginTop: -260,
            borderRadius: "50%",
            borderTop: `3px solid rgba(${COLORS.coralRGB},0.55)`,
            borderRight: "3px solid transparent",
            borderBottom: "3px solid transparent",
            borderLeft: "3px solid transparent",
            transform: `rotate(${-frame * 1.1}deg)`,
          }}
        />

        {/* 31 TAREFAS */}
        <div
          style={{
            position: "absolute",
            top: 178,
            left: 0,
            width: 1080,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 26,
          }}
        >
          <span
            style={{
              fontFamily: geist,
              fontWeight: 900,
              fontSize: 208,
              lineHeight: 1,
              letterSpacing: -10,
              color: COLORS.text,
              fontVariantNumeric: "tabular-nums",
              textShadow: `0 0 ${60 + 50 * pulse}px rgba(255,255,255,0.28), 0 10px 50px rgba(0,0,0,0.7)`,
              transform: `scale(${0.6 + 0.4 * conta})`,
              opacity: interpolate(conta, [0, 0.2], [0, 1], CLAMP),
            }}
          >
            {n}
          </span>
          <Word
            at={54}
            config={SPRING.bouncy}
            style={{
              fontFamily: geist,
              fontWeight: 800,
              fontSize: 82,
              letterSpacing: -1,
              color: COLORS.coralLight,
              textShadow: `0 0 ${34 + 30 * pulse}px rgba(${COLORS.coralRGB},0.6)`,
            }}
          >
            TAREFAS
          </Word>
        </div>

        {/* Esteiras. */}
        <div style={{ position: "absolute", top: 400, left: 0, width: 1080 }}>
          <Belt items={BELTS[0]} dir={-1} speed={2.1} row={0} />
        </div>
        <div style={{ position: "absolute", top: 512, left: 0, width: 1080 }}>
          <Belt items={BELTS[1]} dir={1} speed={1.7} row={1} />
        </div>
        <div style={{ position: "absolute", top: 624, left: 0, width: 1080 }}>
          <Belt items={BELTS[2]} dir={-1} speed={2.5} row={2} />
        </div>

        {/* Fecho. */}
        <div
          style={{
            position: "absolute",
            top: 762,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < 300 ? 0 : interpolate(fecho, [0, 0.35], [0, 1], CLAMP),
            transform: `translateY(${(1 - fecho) * 30}px)`,
          }}
        >
          <GlassPill blur={24} hot={0.25} sweep={frame * 2.3} style={{ padding: "16px 36px" }}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 800,
                fontSize: 46,
                letterSpacing: -0.5,
                color: COLORS.text,
              }}
            >
              O ADMINISTRATIVO INTEIRO
            </span>
          </GlassPill>
        </div>
      </Rig>

      {/* Máscaras laterais: as esteiras somem no vidro, não no corte seco. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 360,
          width: 1080,
          height: 400,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.92) 6%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 76%, rgba(0,0,0,0.92) 94%, #000 100%)",
        }}
      />

      <Flash at={62} len={4} peak={0.28} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
