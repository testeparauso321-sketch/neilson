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
import { ChromaText, GlassPanel, GlassPill, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig, Word } from "../rig";
import { Label, Magnifier, SearchField, typedChars } from "../search";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 01 — Hook (159f / 5,3s · blocos 1–2 do handoff).
//
// Metade A (f0–f84): três buscas de gente de verdade se escrevendo em rajada e
// sendo puxadas pela faísca do Claude → carimbo "O QUE O SEU CLIENTE PESQUISA".
// Metade B (f84–f159): corte seco pros dois sites; o fluxo de cliques troca de
// lado e "NO SEU SITE" estampa em coral.

export const HOOK_DURATION = 159;

const CORTE = 84; // fronteira do bloco 1 → 2 (2,6s × 30 = 78; corte no beat)
const B_CARIMBO = 52; // "o que o seu cliente pesquisa"
const B_VIRA = 108; // o fluxo troca de site
const B_PAYOFF = 120; // "NO SEU SITE"

const QUERIES = [
  { t: "quanto custa uma cozinha planejada", from: 1, to: 20, fly: 22 },
  { t: "vale a pena cozinha planejada?", from: 28, to: 44, fly: 46 },
  { t: "cozinha planejada pequena preço", from: 52, to: 68, fly: 70 },
];

// Versão curta pro campo pequeno da metade B (o campo grande cabe a frase toda).
const CURTA = "quanto custa cozinha planejada";

const FAISCA = { x: 122, y: 214 }; // centro da faísca do Claude (canto superior esq.)
const CAMPO = { x: 540, y: 341 }; // centro do campo de busca

/** A busca digitada descola do campo e é puxada pela faísca. */
const FlyingQuery: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  if (frame < at || t >= 1) return null;

  // Arco: sai do campo, sobe e cai dentro da faísca.
  const x = CAMPO.x + (FAISCA.x - CAMPO.x) * t;
  const y = CAMPO.y + (FAISCA.y - CAMPO.y) * t - Math.sin(t * Math.PI) * 78;
  const s = 1 - 0.72 * t;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${t * -8}deg)`,
        opacity: interpolate(t, [0, 0.15, 0.82, 1], [0, 1, 0.9, 0], CLAMP),
      }}
    >
      <GlassPill blur={14} tint={0.6} style={{ padding: "10px 22px" }}>
        <Magnifier size={22} color={COLORS.coralLight} />
        <span
          style={{
            fontFamily: geist,
            fontWeight: 600,
            fontSize: 26,
            color: COLORS.text2,
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </span>
      </GlassPill>
    </div>
  );
};

/** Fluxo de cliques: pontinhos que caem do campo dentro de um dos dois sites. */
const Flow: React.FC<{ tx: number; ty: number }> = ({ tx, ty }) => {
  const frame = useCurrentFrame();
  const dots = 14;
  return (
    <>
      {Array.from({ length: dots }, (_, i) => {
        const p = ((frame * 0.02 + i / dots) % 1 + 1) % 1;
        const sx = 540 + Math.sin(i * 2.3) * 120;
        const sy = 278;
        const x = sx + (tx - sx) * p;
        const y = sy + (ty - sy) * p + Math.sin(p * Math.PI) * 26;
        const o = interpolate(p, [0, 0.1, 0.8, 1], [0, 1, 0.85, 0], CLAMP);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 12,
              height: 12,
              marginLeft: -6,
              marginTop: -6,
              borderRadius: "50%",
              background: COLORS.coralLight,
              opacity: o * 0.9,
              boxShadow: `0 0 18px rgba(${COLORS.coralRGB},0.95)`,
            }}
          />
        );
      })}
    </>
  );
};

/** Mini-wireframe de site dentro do cartão. */
const SiteRows: React.FC<{ lit: number }> = ({ lit }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
    {[1, 0.72, 0.86, 0.5].map((w, i) => (
      <div
        key={i}
        style={{
          height: i === 0 ? 18 : 11,
          width: `${w * 100}%`,
          borderRadius: 6,
          background:
            i === 0 && lit > 0.5
              ? `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`
              : `rgba(255,255,255,${(0.1 + 0.28 * lit).toFixed(3)})`,
          boxShadow: i === 0 && lit > 0.5 ? `0 0 24px rgba(${COLORS.coralRGB},0.7)` : undefined,
        }}
      />
    ))}
  </div>
);

const Card: React.FC<{
  title: string;
  x: number;
  at: number;
  lit: number;
  dim: number;
  risca: number;
}> = ({ title, x, at, lit, dim, risca }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.bouncy });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 318,
        width: 460,
        opacity: frame < at ? 0 : interpolate(s, [0, 0.3], [0, 1], CLAMP) * (1 - dim * 0.55),
        transform: `translateY(${(1 - s) * 46}px) scale(${0.86 + 0.14 * s}) rotate(${
          dim * -2.4
        }deg)`,
      }}
    >
      <GlassPanel
        radius={30}
        blur={26}
        hot={lit * 0.75}
        tint={lit}
        sweep={frame * 2.2 + at}
        style={{ height: 236 }}
        contentStyle={{
          height: "100%",
          padding: "26px 30px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Label size={24} color={lit > 0.5 ? COLORS.coralLight : COLORS.muted}>
          {title}
        </Label>
        <SiteRows lit={lit} />
      </GlassPanel>

      {/* Risca no concorrente. */}
      <div
        style={{
          position: "absolute",
          left: -10,
          right: -10,
          top: 118,
          height: 9,
          borderRadius: 5,
          transformOrigin: "left center",
          transform: `scaleX(${risca}) skewY(-2deg)`,
          background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
          boxShadow: `0 0 30px rgba(${COLORS.coralRGB},0.9)`,
        }}
      />
    </div>
  );
};

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vibração global: alta no frame 0, pico em cada batida.
  const vib = interpolate(
    frame,
    [0, 18, B_CARIMBO - 2, B_CARIMBO + 3, CORTE - 2, CORTE + 4, B_PAYOFF - 2, B_PAYOFF + 3, B_PAYOFF + 18],
    [1.15, 0.72, 0.8, 1.55, 0.85, 1.3, 0.9, 1.8, 0.35],
    CLAMP,
  );
  const chroma = vib * 4.6 + Math.sin(frame * 4.7) * vib * 2.6;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  // --- metade A -------------------------------------------------------------
  const faseA = interpolate(frame, [CORTE - 6, CORTE], [1, 0], CLAMP);
  const q = QUERIES.reduce((acc, item) => (frame >= item.from ? item : acc), QUERIES[0]);
  const texto = frame >= q.fly ? "" : typedChars(q.t, frame, q.from, q.to);
  const faiscaHot = QUERIES.reduce(
    (acc, item) => Math.max(acc, interpolate(frame, [item.fly + 12, item.fly + 16, item.fly + 30], [0, 1, 0], CLAMP)),
    0,
  );

  // --- metade B -------------------------------------------------------------
  const faseB = interpolate(frame, [CORTE, CORTE + 8], [0, 1], CLAMP);
  const vira = interpolate(frame, [B_VIRA, B_VIRA + 10], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const alvoX = 290 + (790 - 290) * vira;
  const payoff = spring({ frame: frame - B_PAYOFF, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="seo-hook" energy={2} />

      <Rig
        impacts={[B_CARIMBO, CORTE, B_VIRA, B_PAYOFF]}
        push={[1.22, 1.02]}
        pushFrames={54}
        origin="540px 430px"
      >
        {/* ---------------- metade A ---------------- */}
        <div style={{ position: "absolute", inset: 0, opacity: faseA }}>
          {/* Faísca do Claude: puxa as buscas. */}
          <div
            style={{
              position: "absolute",
              left: FAISCA.x,
              top: FAISCA.y,
              transform: `translate(-50%, -50%) scale(${1 + faiscaHot * 0.26 + pulse * 0.04}) rotate(${
                frame * 0.8
              }deg)`,
              filter: `drop-shadow(0 0 ${26 + 60 * faiscaHot}px rgba(${COLORS.coralRGB},${(
                0.55 + 0.4 * faiscaHot
              ).toFixed(2)}))`,
            }}
          >
            <BrandLogo name="claude" size={96} color={COLORS.coral} />
          </div>

          <div
            style={{
              position: "absolute",
              right: 74,
              top: 182,
              textAlign: "right",
              opacity: interpolate(frame, [0, 10], [0, 1], CLAMP),
              transform: `translateX(${Math.sin(frame * 5.1) * vib * 4}px)`,
            }}
          >
            <Label size={28}>AGORA MESMO · NO GOOGLE</Label>
          </div>

          {/* Campo de busca vivo desde o frame 0. */}
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 268,
              transform: `translate(${Math.sin(frame * 5.7) * vib * 5}px, ${
                Math.cos(frame * 6.1) * vib * 4
              }px) rotate(${Math.sin(frame * 4.3) * vib * 0.35}deg)`,
            }}
          >
            <SearchField
              text={texto}
              width={940}
              height={146}
              fontSize={40}
              typing={frame < q.to + 4}
              hot={faiscaHot * 0.5 + vib * 0.12}
              sweep={frame * 2.6}
            />
          </div>

          {QUERIES.map((item) => (
            <FlyingQuery key={item.t} text={item.t} at={item.fly} />
          ))}

          {/* Carimbo da metade A. */}
          <div
            style={{
              position: "absolute",
              top: 470,
              left: 0,
              width: 1080,
              textAlign: "center",
              fontFamily: geist,
              fontWeight: 900,
              fontSize: 70,
              lineHeight: 1.12,
              letterSpacing: -2,
              color: COLORS.text,
              textShadow: "0 12px 48px rgba(0,0,0,0.8)",
            }}
          >
            <div>
              <Word at={B_CARIMBO} config={SPRING.bouncy} rise={58} style={{ marginRight: 18 }}>
                O QUE O
              </Word>
              <Word at={B_CARIMBO + 4} config={SPRING.bouncy} rise={58}>
                SEU CLIENTE
              </Word>
            </div>
            <div style={{ color: COLORS.coral, fontSize: 104, letterSpacing: -4 }}>
              <ChromaText amount={chroma * 0.6}>
                <Word at={B_CARIMBO + 9} config={SPRING.bouncy} rise={58}>
                  PESQUISA
                </Word>
              </ChromaText>
            </div>
          </div>
        </div>

        {/* ---------------- metade B ---------------- */}
        <div style={{ position: "absolute", inset: 0, opacity: faseB }}>
          {/* O campo continua no topo, agora pequeno: as buscas não param. */}
          <div
            style={{
              position: "absolute",
              left: 180,
              top: 180,
              transform: `translateY(${(1 - faseB) * -30}px)`,
            }}
          >
            <SearchField
              text={CURTA}
              width={720}
              height={96}
              fontSize={27}
              typing={false}
              sweep={frame * 2.2}
            />
          </div>

          <Flow tx={alvoX} ty={436} />

          <Card
            title="CONCORRENTE"
            x={60}
            at={CORTE + 2}
            lit={0}
            dim={vira}
            risca={interpolate(frame, [B_VIRA + 4, B_VIRA + 16], [0, 1], {
              ...CLAMP,
              easing: Easing.out(Easing.cubic),
            })}
          />
          <Card title="SEU SITE" x={560} at={CORTE + 8} lit={vira} dim={0} risca={0} />

          {/* Payoff. */}
          <div
            style={{
              position: "absolute",
              top: 618,
              left: 0,
              width: 1080,
              textAlign: "center",
              opacity: frame < B_PAYOFF ? 0 : interpolate(payoff, [0, 0.28], [0, 1], CLAMP),
              transform: `scale(${0.62 + 0.38 * payoff})`,
            }}
          >
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 108,
                letterSpacing: -4,
                color: COLORS.coral,
                textShadow: `0 0 ${64 + 62 * pulse}px rgba(${COLORS.coralRGB},${(
                  0.55 + 0.35 * pulse
                ).toFixed(2)})`,
              }}
            >
              NO SEU SITE
            </span>
            <div style={{ marginTop: 12 }}>
              <Label size={30} color={COLORS.muted}>
                NÃO NO DO CONCORRENTE
              </Label>
            </div>
          </div>
        </div>
      </Rig>

      <Flash at={B_CARIMBO} len={4} peak={0.5} />
      <Flash at={CORTE} len={5} peak={0.62} />
      <Flash at={B_PAYOFF} len={5} peak={0.6} />
      <Grain opacity={0.07} />
      <Vignette />
    </AbsoluteFill>
  );
};
