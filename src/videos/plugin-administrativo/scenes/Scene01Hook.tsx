import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, geist, mono, SPRING } from "../theme";
import { ChromaText, GlassPanel, GlassPill, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig, Shards, Word } from "../rig";

// Cena 01 — Hook (210f / 7s). O vídeo inteiro se decide aqui, então nada entra
// devagar: no frame 0 já tem contador correndo, vidro vibrando e câmera em
// push-in. Beats: contador dispara → TRAVA (flash + shake) → chip do que aquilo
// é → RISCA coral + glitch → "UM PLUGIN" sobe com morph líquido → "RESOLVEU
// TUDO" carimba. Tudo na faixa split-safe SAFE_TOP..SAFE_BOTTOM — o push-in
// 1.2x do Rig empurra o topo pra cima no f0, por isso o rótulo autora em 152
// (renderiza ~96, nunca abaixo de y=90).

export const HOOK_DURATION = 210;

// Custo de mercado de contratar um auxiliar administrativo — é referência de
// CUSTO, não promessa de resultado (regra dura do vault). Trocar aqui.
const SALARIO = 2400;

const LOCK = 38; // contador trava
const RISCA = 66; // risca coral atravessa
const PLUGIN = 88; // painel "UM PLUGIN" sobe
const RESOLVEU = 130; // carimbo final

const brl = (n: number) =>
  Math.max(0, Math.round(n)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vibração global: alta desde o frame 0, pico no travamento, some depois.
  const vib = interpolate(
    frame,
    [0, 26, LOCK - 1, LOCK + 1, LOCK + 12, RISCA, RISCA + 8],
    [1.15, 0.8, 1.05, 1.8, 0.12, 0.1, 0.06],
    CLAMP,
  );
  const chroma = vib * 6.5 + Math.sin(frame * 4.1) * vib * 3.4;

  // Contador: rampa rápida com ruído por cima pra os dígitos "rodarem".
  const ramp = interpolate(frame, [0, LOCK], [0, SALARIO], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const noise =
    frame < LOCK ? Math.sin(frame * 7.7) * 130 + Math.sin(frame * 3.3) * 90 : 0;
  const valor = frame >= LOCK ? SALARIO : Math.max(0, ramp + noise);

  // Glitch curto logo depois da risca.
  const glitch = frame >= RISCA && frame < RISCA + 9 ? 1 : 0;
  const slice = Math.sin(frame * 11) * 26 * glitch;

  // Risca coral atravessando o número.
  const strike = interpolate(frame, [RISCA, RISCA + 9], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const morto = interpolate(frame, [RISCA + 4, RISCA + 16], [0, 1], CLAMP);

  // "UM PLUGIN" — mola gel com squash/stretch (o morph líquido).
  const plug = spring({ frame: frame - PLUGIN, fps, config: SPRING.gel });
  const plugSx = 1 + (1 - plug) * 0.2;
  const plugSy = 1 - (1 - plug) * 0.26;

  // Carimbo final.
  const stamp = spring({ frame: frame - RESOLVEU, fps, config: SPRING.bouncy });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7.5);

  const hotPanel = Math.max(
    interpolate(frame, [LOCK - 2, LOCK, LOCK + 14], [0, 1, 0.12], CLAMP),
    vib * 0.25,
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="hook" energy={1.9} />

      <Rig impacts={[LOCK, RISCA, PLUGIN, RESOLVEU]} push={[1.2, 1.02]} pushFrames={52}>
        {/* Anéis de choque saindo do contador — movimento já no frame 0. */}
        {[0, 1, 2].map((i) => {
          const p = ((frame / 34 + i / 3) % 1);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 540,
                top: 324,
                width: 300 + p * 900,
                height: 300 + p * 900,
                marginLeft: -(300 + p * 900) / 2,
                marginTop: -(300 + p * 900) / 2,
                borderRadius: "50%",
                border: `1.5px solid rgba(255,255,255,${(0.16 * (1 - p)).toFixed(3)})`,
                opacity: 1 - p,
              }}
            />
          );
        })}

        {/* Rótulo do que o número é. */}
        <div
          style={{
            position: "absolute",
            top: 152,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: mono,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 8,
            color: COLORS.muted,
            opacity: interpolate(frame, [0, 8], [0, 1], CLAMP),
            transform: `translateX(${Math.sin(frame * 5.3) * vib * 4}px)`,
          }}
        >
          CUSTO DE CONTRATAR
        </div>

        {/* --- Painel do contador --- */}
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 206,
            width: 840,
            transform: `translate(${Math.sin(frame * 5.9) * vib * 7 + slice}px, ${
              Math.cos(frame * 6.7) * vib * 5
            }px) rotate(${Math.sin(frame * 4.4) * vib * 0.5}deg)`,
          }}
        >
          <GlassPanel
            radius={44}
            blur={34}
            hot={hotPanel}
            sweep={frame * 2.4}
            style={{ height: 244 }}
          >
            <div
              style={{
                position: "relative",
                height: "100%",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 20,
                // A dessaturação vive aqui, e não no painel, pra a risca coral
                // continuar viva enquanto o número morre.
                filter: `saturate(${1 - morto * 0.9}) brightness(${1 - morto * 0.28})`,
              }}
            >
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 600,
                  fontSize: 60,
                  color: COLORS.text2,
                  opacity: 0.82,
                }}
              >
                R$
              </span>
              <ChromaText
                amount={chroma}
                style={{
                  fontFamily: geist,
                  fontWeight: 800,
                  fontSize: 150,
                  lineHeight: 1,
                  letterSpacing: -5,
                  color: COLORS.text,
                  fontVariantNumeric: "tabular-nums",
                  textShadow: "0 8px 44px rgba(0,0,0,0.6)",
                }}
              >
                {brl(valor)}
              </ChromaText>
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 600,
                  fontSize: 44,
                  color: COLORS.muted,
                }}
              >
                /mês
              </span>
            </div>

            {/* Risca coral — irmã do bloco dessaturado, senão morreria junto. */}
            <div
              style={{
                position: "absolute",
                left: 54,
                right: 54,
                top: 118,
                height: 14,
                transformOrigin: "left center",
                transform: `scaleX(${strike}) skewY(-1.5deg)`,
                background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coral} 38%, ${COLORS.coralLight})`,
                borderRadius: 7,
                boxShadow: `0 0 40px rgba(${COLORS.coralRGB},0.95), 0 0 90px rgba(${COLORS.coralRGB},0.5)`,
              }}
            />
          </GlassPanel>
        </div>

        {/* Chip: a unidade humana do número. */}
        <div
          style={{
            position: "absolute",
            top: 486,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: interpolate(frame, [52, 62], [0, 1], CLAMP),
            transform: `translateY(${interpolate(frame, [52, 66], [26, 0], {
              ...CLAMP,
              easing: Easing.out(Easing.cubic),
            })}px)`,
          }}
        >
          <GlassPill blur={22} sweep={frame * 1.8} style={{ padding: "16px 34px" }}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 800,
                fontSize: 38,
                letterSpacing: 2,
                color: COLORS.text,
              }}
            >
              1 FUNCIONÁRIO
            </span>
            <span style={{ color: COLORS.faint, fontSize: 30 }}>·</span>
            <span
              style={{
                fontFamily: mono,
                fontWeight: 500,
                fontSize: 30,
                letterSpacing: 3,
                color: COLORS.muted,
              }}
            >
              ADMINISTRATIVO
            </span>
          </GlassPill>
        </div>

        {/* --- "UM PLUGIN" sobe com morph líquido --- */}
        <div
          style={{
            position: "absolute",
            left: 190,
            top: 586,
            width: 700,
            opacity: frame < PLUGIN ? 0 : interpolate(plug, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - plug) * 150}px) scale(${plugSx}, ${plugSy})`,
            transformOrigin: "50% 100%",
          }}
        >
          <GlassPanel
            radius={40}
            blur={30}
            hot={interpolate(frame, [PLUGIN, PLUGIN + 10, PLUGIN + 26], [1, 0.5, 0.1], CLAMP)}
            sweep={frame * 2.9}
            tint={0.6}
            style={{ height: 156 }}
          >
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 22,
              }}
            >
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 900,
                  fontSize: 86,
                  letterSpacing: -2,
                  color: COLORS.text,
                }}
              >
                UM
              </span>
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 900,
                  fontSize: 86,
                  letterSpacing: -2,
                  color: COLORS.coralLight,
                  textShadow: `0 0 ${34 + 30 * pulse}px rgba(${COLORS.coralRGB},0.75)`,
                }}
              >
                PLUGIN
              </span>
            </div>
          </GlassPanel>
        </div>

        {/* Cacos da quebra do número, no momento da risca. */}
        <div style={{ position: "absolute", left: 540, top: 328 }}>
          <Shards at={RISCA + 1} count={20} seed={5} duration={30} size={0.9} />
        </div>

        {/* --- Carimbo final --- */}
        <div
          style={{
            position: "absolute",
            top: 782,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: frame < RESOLVEU ? 0 : interpolate(stamp, [0, 0.28], [0, 1], CLAMP),
            transform: `scale(${0.55 + 0.45 * stamp}) rotate(${
              Math.sin(frame / 23) * 1.1
            }deg)`,
          }}
        >
          <span
            style={{
              fontFamily: geist,
              fontWeight: 900,
              fontSize: 104,
              letterSpacing: -2,
              color: COLORS.coral,
              textShadow: `0 0 ${52 + 58 * pulse}px rgba(${COLORS.coralRGB},${(
                0.5 + 0.35 * pulse
              ).toFixed(2)})`,
            }}
          >
            <Word at={RESOLVEU} config={SPRING.bouncy}>
              RESOLVEU
            </Word>{" "}
            <Word at={RESOLVEU + 7} config={SPRING.bouncy}>
              TUDO
            </Word>
          </span>
        </div>
      </Rig>

      <Flash at={LOCK} len={5} peak={0.8} />
      <Flash at={RISCA} len={4} peak={0.45} />
      <Flash at={PLUGIN} len={4} peak={0.3} />
      <Grain opacity={0.07} />
      <Vignette />
    </AbsoluteFill>
  );
};
