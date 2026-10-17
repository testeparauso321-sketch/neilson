import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, geist, SPRING } from "../theme";
import { GlassPanel, GlassPill, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig } from "../rig";
import { Label, QueryRow } from "../search";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 04 — De onde vem o relatório (162f / 5,4s · blocos 7–8 do handoff).
// O relatório da cena 02 volta pequeno no topo, um fio o liga ao painel do
// Search Console que se monta sozinho, o carimbo GRÁTIS cai (é o argumento de
// negócio do bloco) e o cadeado abre com a skill do lado.

export const CONSOLE_DURATION = 162;

const MONTA = 14;
const GRATIS = 52;
const CADEADO = 96;
const CHIP = 132;

const PAINEL_TOP = 300;
const CURVA =
  "M 0 148 L 78 132 L 156 138 L 234 104 L 312 112 L 390 78 L 468 86 L 546 52 L 624 60 L 702 26 L 780 34 L 858 8";

const LINHAS = [
  { q: "quanto custa uma cozinha planejada", vol: 2184, share: 1 },
  { q: "cozinha planejada pequena preço", vol: 1310, share: 0.6 },
];

const PASSOS = [
  { t: "confere o teu site", at: CADEADO + 8 },
  { t: "libera o acesso ao painel", at: CADEADO + 26 },
];

/** Cadeado de vidro: a haste sobe e o corpo acende quando abre. */
const Cadeado: React.FC<{ open: number }> = ({ open }) => (
  // viewBox com folga em cima: aberta, a haste sobe e sai do quadro — foi o que
  // cortou o cadeado no primeiro teste.
  <svg viewBox="-4 -14 50 62" width={58} height={72} aria-label="cadeado">
    <path
      d="M11 20 V14 a9 9 0 0 1 18 0 V20"
      fill="none"
      stroke={open > 0.5 ? COLORS.coralLight : COLORS.muted}
      strokeWidth="4"
      strokeLinecap="round"
      transform={`translate(${open * 9}, ${-open * 8}) rotate(${open * 16}, 20, 20)`}
    />
    <rect
      x="6"
      y="19"
      width="28"
      height="23"
      rx="6"
      fill={
        open > 0.5 ? `rgba(${COLORS.coralRGB},0.42)` : "rgba(255,255,255,0.12)"
      }
      stroke={open > 0.5 ? COLORS.coralLight : COLORS.muted}
      strokeWidth="2.4"
    />
  </svg>
);

export const Scene04Console: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  const painel = spring({ frame: frame - MONTA, fps, config: SPRING.soft });
  const fio = interpolate(frame, [6, 24], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const curva = interpolate(frame, [MONTA + 8, MONTA + 52], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const gratis = spring({ frame: frame - GRATIS, fps, config: SPRING.bouncy });
  const abre = interpolate(frame, [CADEADO, CADEADO + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const chip = spring({ frame: frame - CHIP, fps, config: SPRING.snap });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="seo-console" energy={1.2} />

      <Rig impacts={[GRATIS, CADEADO, CHIP]} push={[1.12, 1.01]} pushFrames={66} origin="540px 440px">
        {/* O relatório da cena 02, pequeno. */}
        <div
          style={{
            position: "absolute",
            left: 330,
            top: 180,
            width: 420,
            opacity: interpolate(frame, [0, 8], [0, 1], CLAMP),
          }}
        >
          <GlassPanel
            radius={20}
            blur={20}
            sweep={frame * 2}
            lens={false}
            style={{ height: 84 }}
            contentStyle={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "0 24px",
            }}
          >
            <div style={{ flex: "none", whiteSpace: "nowrap" }}>
              <Label size={20} color={COLORS.faint}>
                RELATÓRIO
              </Label>
            </div>
            <div
              style={{
                flex: 1,
                height: 9,
                borderRadius: 5,
                background: "rgba(255,255,255,0.26)",
              }}
            />
          </GlassPanel>
        </div>

        {/* Fio ligando o relatório ao painel: é dali que ele vem. */}
        <div
          style={{
            position: "absolute",
            left: 538,
            top: 264,
            width: 4,
            height: 36 * fio,
            borderRadius: 2,
            background: `linear-gradient(180deg, rgba(${COLORS.coralRGB},0.2), ${COLORS.coralLight})`,
            boxShadow: `0 0 20px rgba(${COLORS.coralRGB},0.8)`,
          }}
        />

        {/* Painel do Search Console. */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: PAINEL_TOP,
            width: 940,
            opacity: interpolate(painel, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - painel) * 44}px) scale(${0.94 + 0.06 * painel})`,
          }}
        >
          <GlassPanel
            radius={34}
            blur={30}
            hot={interpolate(frame, [GRATIS - 2, GRATIS + 2, GRATIS + 24], [0, 0.8, 0.14], CLAMP)}
            sweep={frame * 2.4}
            style={{ height: 366 }}
            contentStyle={{
              height: "100%",
              padding: "26px 36px",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* O cadeado vive à ESQUERDA do título: o canto direito é do
                carimbo GRÁTIS, e um cobria o outro no primeiro teste. */}
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ flex: "none", transform: `scale(${0.82 + abre * 0.12})` }}>
                <Cadeado open={abre} />
              </div>
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 800,
                  fontSize: 40,
                  letterSpacing: -1,
                  color: COLORS.text,
                  whiteSpace: "nowrap",
                }}
              >
                Search Console
              </span>
              <div style={{ flex: "none", whiteSpace: "nowrap" }}>
                <Label size={20} color={COLORS.faint}>
                  GOOGLE
                </Label>
              </div>
            </div>

            {/* Curva de procuras se desenhando. */}
            <svg width={868} height={158} viewBox="0 0 868 158" style={{ marginTop: -4 }}>
              <line
                x1="0"
                y1="156"
                x2="868"
                y2="156"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="2"
                strokeDasharray="6 10"
              />
              <path
                d={CURVA}
                fill="none"
                stroke={COLORS.coralLight}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - curva}
                style={{
                  filter: `drop-shadow(0 0 16px rgba(${COLORS.coralRGB},0.8))`,
                }}
              />
              <circle
                cx={curva * 858}
                cy={158 - 10 - curva * 140}
                r={curva > 0.02 ? 9 + pulse * 3 : 0}
                fill={COLORS.coralLight}
                opacity={0.95}
              />
            </svg>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: -6 }}>
              {LINHAS.map((l, i) => (
                <QueryRow
                  key={l.q}
                  q={l.q}
                  vol={l.vol}
                  share={l.share}
                  t={interpolate(frame, [MONTA + 26 + i * 10, MONTA + 44 + i * 10], [0, 1], CLAMP)}
                  width={868}
                  fontSize={26}
                />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Carimbo GRÁTIS. */}
        <div
          style={{
            position: "absolute",
            left: 686,
            top: 262,
            opacity: frame < GRATIS ? 0 : interpolate(gratis, [0, 0.3], [0, 1], CLAMP),
            transform: `rotate(-9deg) scale(${1.7 - 0.7 * gratis})`,
          }}
        >
          <GlassPill blur={20} tint={1} hot={0.6} sweep={frame * 3}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 54,
                letterSpacing: 2,
                color: COLORS.coralLight,
                textShadow: `0 0 ${30 + 34 * pulse}px rgba(${COLORS.coralRGB},0.85)`,
              }}
            >
              GRÁTIS
            </span>
          </GlassPill>
        </div>

        {/* A skill abrindo o acesso. */}
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 700,
            width: 820,
            opacity: interpolate(frame, [CADEADO - 6, CADEADO + 4], [0, 1], CLAMP),
            transform: `translateY(${interpolate(frame, [CADEADO - 6, CADEADO + 6], [26, 0], CLAMP)}px)`,
          }}
        >
          <GlassPanel
            radius={28}
            blur={24}
            hot={abre * 0.3}
            sweep={frame * 2.1}
            style={{ height: 132 }}
            contentStyle={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 26,
              padding: "0 30px",
            }}
          >
            <div
              style={{
                transform: `rotate(${frame * 0.6}deg)`,
                filter: `drop-shadow(0 0 22px rgba(${COLORS.coralRGB},0.7))`,
                flex: "none",
              }}
            >
              <BrandLogo name="claude" size={62} color={COLORS.coral} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
              {PASSOS.map((p) => {
                const on = interpolate(frame, [p.at, p.at + 8], [0, 1], CLAMP);
                return (
                  <div key={p.t} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        border: `2px solid ${on > 0.5 ? COLORS.coralLight : COLORS.faint}`,
                        background: on > 0.5 ? `rgba(${COLORS.coralRGB},0.5)` : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: "none",
                      }}
                    >
                      <svg viewBox="0 0 24 24" width={18} height={18}>
                        <path
                          d="M5 13 L10 18 L19 6"
                          fill="none"
                          stroke={COLORS.text}
                          strokeWidth="3.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          pathLength={1}
                          strokeDasharray={1}
                          strokeDashoffset={1 - on}
                        />
                      </svg>
                    </div>
                    <span
                      style={{
                        fontFamily: geist,
                        fontWeight: 600,
                        fontSize: 32,
                        color: on > 0.5 ? COLORS.text : COLORS.muted,
                      }}
                    >
                      {p.t}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                opacity: frame < CHIP ? 0 : interpolate(chip, [0, 0.4], [0, 1], CLAMP),
                transform: `scale(${0.7 + 0.3 * chip})`,
                flex: "none",
              }}
            >
              <Label size={22} color={COLORS.coralLight}>
                ACESSO
                <br />
                LIBERADO
              </Label>
            </div>
          </GlassPanel>
        </div>
      </Rig>

      <Flash at={GRATIS} len={5} peak={0.5} />
      <Flash at={CADEADO} len={4} peak={0.3} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
