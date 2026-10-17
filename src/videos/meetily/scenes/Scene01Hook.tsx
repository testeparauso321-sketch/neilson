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
import { ChromaText, GlassPanel, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig, Word } from "../rig";
import { clock, RecDot, Waveform } from "../audio";

// Cena 01 — Hook (135f / 4,5s). Quatro segundos e meio, três batidas, zero
// respiro: no frame 0 já tem reunião acontecendo (onda viva + REC + cronômetro
// correndo) e a câmera já está em push-in. As três batidas são exatamente a
// frase falada: NÃO ENTRO MAIS → EM REUNIÃO COM CLIENTE → SEM ISSO.

export const HOOK_DURATION = 135;

const B1 = 26; // "NÃO ENTRO MAIS"
const B2 = 60; // "EM REUNIÃO COM CLIENTE"
const B3 = 92; // cronômetro trava, onda congela, "SEM ISSO"

const DURACAO = 47 * 60 + 12; // a call inteira, em segundos

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Vibração global — alta desde o frame 0, pico em cada batida.
  const vib = interpolate(
    frame,
    [0, 20, B1 - 1, B1 + 2, B2, B2 + 3, B3 - 1, B3 + 2, B3 + 14],
    [1.1, 0.72, 0.8, 1.6, 0.7, 1.35, 0.8, 1.9, 0.1],
    CLAMP,
  );
  const chroma = vib * 5.4 + Math.sin(frame * 4.3) * vib * 3;

  // Cronômetro: corre acelerando até travar em 47:12.
  const t = interpolate(frame, [0, B3], [0, DURACAO], {
    ...CLAMP,
    easing: Easing.in(Easing.quad),
  });
  const segundos = frame >= B3 ? DURACAO : t;

  // A onda morre quando a call encerra — vira quase linha.
  const amp = interpolate(frame, [B3, B3 + 10], [1, 0.12], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const hot = Math.max(
    interpolate(frame, [B3 - 2, B3, B3 + 16], [0, 1, 0.1], CLAMP),
    interpolate(frame, [B1 - 2, B1, B1 + 12], [0, 0.7, 0.08], CLAMP),
    vib * 0.22,
  );

  // Batida 2 com morph líquido (squash/stretch na mola gel).
  const m2 = spring({ frame: frame - B2, fps, config: SPRING.gel });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  // Risca coral cortando "SEM ISSO".
  const risca = interpolate(frame, [B3 + 6, B3 + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="mt-hook" energy={2} />

      <Rig impacts={[B1, B2, B3]} push={[1.22, 1.02]} pushFrames={52} origin="540px 430px">
        {/* Contexto da call — sem nome de cliente (regra dura do vault). */}
        <div
          style={{
            position: "absolute",
            top: 164,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: mono,
            fontWeight: 500,
            fontSize: 29,
            letterSpacing: 8,
            color: COLORS.muted,
            opacity: interpolate(frame, [0, 8], [0, 1], CLAMP),
            transform: `translateX(${Math.sin(frame * 5.1) * vib * 4}px)`,
          }}
        >
          TERÇA-FEIRA · 14:03
        </div>

        {/* --- Painel da reunião acontecendo --- */}
        <div
          style={{
            position: "absolute",
            left: 110,
            top: 216,
            width: 860,
            transform: `translate(${Math.sin(frame * 5.7) * vib * 6}px, ${
              Math.cos(frame * 6.3) * vib * 5
            }px) rotate(${Math.sin(frame * 4.1) * vib * 0.45}deg)`,
          }}
        >
          <GlassPanel radius={42} blur={32} hot={hot} sweep={frame * 2.6} style={{ height: 262 }}>
            <div
              style={{
                height: "100%",
                padding: "28px 44px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Waveform
                width={772}
                height={118}
                bars={44}
                amp={amp}
                speed={1.35}
                seed={1.7}
                playhead={interpolate(frame, [0, B3], [0.05, 1], CLAMP)}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <RecDot label={frame >= B3 ? "ENCERRADA" : "GRAVANDO"} size={20} />
                <ChromaText
                  amount={chroma}
                  style={{
                    fontFamily: mono,
                    fontWeight: 700,
                    fontSize: 62,
                    letterSpacing: 1,
                    color: COLORS.text,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {clock(segundos)}
                </ChromaText>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* --- Batida 1 --- */}
        <div
          style={{
            position: "absolute",
            top: 528,
            left: 0,
            width: 1080,
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: geist,
              fontWeight: 900,
              fontSize: 96,
              letterSpacing: -3,
              color: COLORS.text,
              textShadow: "0 10px 46px rgba(0,0,0,0.75)",
            }}
          >
            <Word at={B1} config={SPRING.bouncy} rise={62} style={{ marginRight: 26 }}>
              NÃO
            </Word>
            <Word at={B1 + 4} config={SPRING.bouncy} rise={62} style={{ marginRight: 26 }}>
              ENTRO
            </Word>
            <Word at={B1 + 8} config={SPRING.bouncy} rise={62}>
              MAIS
            </Word>
          </span>
        </div>

        {/* --- Batida 2 --- */}
        <div
          style={{
            position: "absolute",
            top: 646,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: frame < B2 ? 0 : interpolate(m2, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - m2) * 70}px) scaleY(${1 - (1 - m2) * 0.24})`,
            transformOrigin: "50% 0%",
          }}
        >
          <span
            style={{
              fontFamily: geist,
              fontWeight: 700,
              fontSize: 62,
              letterSpacing: -1,
              color: COLORS.text2,
              opacity: 0.9,
            }}
          >
            EM REUNIÃO COM CLIENTE
          </span>
        </div>

        {/* --- Batida 3 --- */}
        <div
          style={{
            position: "absolute",
            top: 738,
            left: 0,
            width: 1080,
            textAlign: "center",
          }}
        >
          <span
            style={{
              position: "relative",
              display: "inline-block",
              fontFamily: geist,
              fontWeight: 900,
              fontSize: 118,
              letterSpacing: -4,
              color: COLORS.coral,
              textShadow: `0 0 ${52 + 56 * pulse}px rgba(${COLORS.coralRGB},${(
                0.5 + 0.35 * pulse
              ).toFixed(2)})`,
            }}
          >
            <Word at={B3} config={SPRING.bouncy} rise={40} style={{ marginRight: 30 }}>
              SEM
            </Word>
            <Word at={B3 + 5} config={SPRING.bouncy} rise={40}>
              ISSO
            </Word>
            {/* Risca: o "sem isso" é o que fica riscado da rotina antiga. */}
            <span
              style={{
                position: "absolute",
                left: -18,
                right: -18,
                top: "56%",
                height: 10,
                borderRadius: 5,
                transformOrigin: "left center",
                transform: `scaleX(${risca}) skewY(-1.2deg)`,
                background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
                boxShadow: `0 0 34px rgba(${COLORS.coralRGB},0.9)`,
              }}
            />
          </span>
        </div>
      </Rig>

      <Flash at={B1} len={4} peak={0.42} />
      <Flash at={B3} len={5} peak={0.72} />
      <Grain opacity={0.07} />
      <Vignette />
    </AbsoluteFill>
  );
};
