import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, COLORS, geist, mono, SPRING } from "../theme";
import { GlassPanel, GlassPill, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig, Shards, Word } from "../rig";

// Cena 06 — CTA (300f / 10s). A palavra é digitada dentro de um campo de
// comentário em vidro, salta pra fora, o campo estilhaça e ADMIN vira display.
// "meu grupo", nunca "nossa comunidade" — identidade solo no @luizbessa.ia.

export const CTA_DURATION = 300;

const PALAVRA = "ADMIN";
const SALTO = 88; // a palavra pula pra fora do campo

export const Scene06Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const campo = spring({ frame: frame - 6, fps, config: SPRING.soft });
  const chars = Math.round(interpolate(frame, [26, 68], [0, PALAVRA.length], CLAMP));

  const salto = spring({ frame: frame - SALTO, fps, config: SPRING.bouncy });
  const saiu = frame >= SALTO;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  const chips = [
    { t: "o passo a passo", at: 140 },
    { t: "convite pro meu grupo", at: 158 },
  ];

  const handle = spring({ frame: frame - 196, fps, config: SPRING.snap });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="cta" energy={1.25} />

      <Rig impacts={[SALTO, 140, 196]} push={[1.1, 1.01]} amount={0.9} origin="540px 400px">
        {/* Instrução curta. */}
        <div
          style={{
            position: "absolute",
            top: 126,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: mono,
            fontWeight: 500,
            fontSize: 30,
            letterSpacing: 7,
            color: COLORS.muted,
            opacity: interpolate(frame, [0, 12], [0, 1], CLAMP),
          }}
        >
          COMENTA AQUI EMBAIXO
        </div>

        {/* Campo de comentário em vidro. */}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 198,
            width: 780,
            opacity:
              frame < 6
                ? 0
                : saiu
                  ? interpolate(frame, [SALTO, SALTO + 12], [1, 0], CLAMP)
                  : interpolate(campo, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - campo) * 32}px) scale(${
              saiu ? interpolate(frame, [SALTO, SALTO + 12], [1, 1.14], CLAMP) : 1
            })`,
          }}
        >
          <GlassPanel radius={32} blur={28} sweep={frame * 2} style={{ height: 148 }}>
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0 34px",
              }}
            >
              <span
                style={{
                  fontFamily: geist,
                  fontWeight: 800,
                  fontSize: 52,
                  letterSpacing: 3,
                  color: chars > 0 ? COLORS.text : COLORS.faint,
                }}
              >
                {chars > 0 ? PALAVRA.slice(0, chars) : "Comentar…"}
              </span>
              <span
                style={{
                  width: 4,
                  height: 52,
                  background: COLORS.coralLight,
                  opacity: chars < PALAVRA.length && frame % 12 < 7 ? 1 : 0.12,
                  boxShadow: `0 0 16px rgba(${COLORS.coralRGB},0.9)`,
                }}
              />
            </div>
          </GlassPanel>
        </div>

        {/* Cacos do campo estilhaçando. */}
        <div style={{ position: "absolute", left: 540, top: 272 }}>
          <Shards at={SALTO + 2} count={24} seed={17} duration={30} size={1} />
        </div>

        {/* ADMIN em display. */}
        <div
          style={{
            position: "absolute",
            top: 390,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: saiu ? interpolate(salto, [0, 0.25], [0, 1], CLAMP) : 0,
            transform: `scale(${0.4 + 0.6 * salto}) rotate(${Math.sin(frame / 26) * 1.4}deg)`,
          }}
        >
          <span
            style={{
              fontFamily: geist,
              fontWeight: 900,
              fontSize: 196,
              lineHeight: 1,
              letterSpacing: -6,
              color: COLORS.coral,
              textShadow: `0 0 ${70 + 70 * pulse}px rgba(${COLORS.coralRGB},${(
                0.55 + 0.35 * pulse
              ).toFixed(2)})`,
            }}
          >
            {PALAVRA}
          </span>
        </div>

        {/* O que a pessoa recebe. */}
        <div
          style={{
            position: "absolute",
            top: 634,
            left: 0,
            width: 1080,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          {chips.map((c) => {
            const s = spring({ frame: frame - c.at, fps, config: SPRING.snap });
            return (
              <div
                key={c.t}
                style={{
                  opacity: frame < c.at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                  transform: `translateY(${(1 - s) * 28}px)`,
                }}
              >
                <GlassPill blur={20} sweep={frame * 2.1 + c.at} style={{ padding: "13px 30px" }}>
                  <span
                    style={{
                      fontFamily: geist,
                      fontWeight: 700,
                      fontSize: 38,
                      color: COLORS.text,
                    }}
                  >
                    {c.t}
                  </span>
                </GlassPill>
              </div>
            );
          })}
        </div>

        {/* Assinatura. */}
        <div
          style={{
            position: "absolute",
            top: 834,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: frame < 196 ? 0 : interpolate(handle, [0, 0.4], [0, 1], CLAMP),
            transform: `translateY(${(1 - handle) * 22}px)`,
          }}
        >
          <Word
            at={196}
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: 4,
              color: COLORS.text2,
            }}
          >
            @luizbessa.ia
          </Word>
        </div>
      </Rig>

      <Flash at={SALTO} len={5} peak={0.55} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
