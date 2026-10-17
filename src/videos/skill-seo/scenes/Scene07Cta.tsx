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
import { Label, typedChars } from "../search";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 07 — CTA (180f / 6s · blocos 13–15 do handoff).
// A palavra falada, a da legenda e a da tela são a MESMA: PERGUNTAS. Ela é
// digitada no campo, salta pra fora e estilhaça o campo; depois entram os dois
// chips de entrega e a assinatura com a dica diária.

export const CTA_DURATION = 180;

const PALAVRA = "PERGUNTAS";
const SALTO = 48;

const ENTREGA = [
  { t: "o link da skill", at: 68 },
  { t: "no seu privado", at: 84 },
];

export const Scene07Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const campo = spring({ frame: frame - 4, fps, config: SPRING.soft });
  const texto = typedChars(PALAVRA, frame, 10, 44);
  const salto = spring({ frame: frame - SALTO, fps, config: SPRING.bouncy });
  const saiu = frame >= SALTO;
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  const assina = spring({ frame: frame - 112, fps, config: SPRING.snap });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="seo-cta" energy={1.35} />

      <Rig impacts={[SALTO, 68, 112]} push={[1.12, 1.01]} amount={0.95} origin="540px 420px">
        <div
          style={{
            position: "absolute",
            top: 172,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: interpolate(frame, [0, 10], [0, 1], CLAMP),
          }}
        >
          <Label size={30}>COMENTA AQUI EMBAIXO</Label>
        </div>

        {/* Campo de comentário. */}
        <div
          style={{
            position: "absolute",
            left: 150,
            top: 226,
            width: 780,
            opacity:
              frame < 4
                ? 0
                : saiu
                  ? interpolate(frame, [SALTO, SALTO + 12], [1, 0], CLAMP)
                  : interpolate(campo, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - campo) * 34}px) scale(${
              saiu ? interpolate(frame, [SALTO, SALTO + 12], [1, 1.16], CLAMP) : 1
            })`,
          }}
        >
          <GlassPanel
            radius={32}
            blur={28}
            sweep={frame * 2}
            style={{ height: 140 }}
            contentStyle={{
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
                fontSize: 50,
                letterSpacing: 2,
                color: texto.length > 0 ? COLORS.text : COLORS.faint,
              }}
            >
              {texto.length > 0 ? texto : "Comentar…"}
            </span>
            <span
              style={{
                width: 4,
                height: 52,
                background: COLORS.coralLight,
                opacity: texto.length < PALAVRA.length && frame % 12 < 7 ? 1 : 0.12,
                boxShadow: `0 0 16px rgba(${COLORS.coralRGB},0.9)`,
              }}
            />
          </GlassPanel>
        </div>

        {/* Cacos do campo. */}
        <div style={{ position: "absolute", left: 540, top: 296 }}>
          <Shards at={SALTO + 2} count={24} seed={31} duration={30} size={1} />
        </div>

        {/* A palavra em display. */}
        <div
          style={{
            position: "absolute",
            top: 368,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: saiu ? interpolate(salto, [0, 0.25], [0, 1], CLAMP) : 0,
            transform: `scale(${0.42 + 0.58 * salto}) rotate(${Math.sin(frame / 26) * 1.3}deg)`,
          }}
        >
          <span
            style={{
              fontFamily: geist,
              fontWeight: 900,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: -5,
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
            top: 552,
            left: 0,
            width: 1080,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {ENTREGA.map((c) => {
            const s = spring({ frame: frame - c.at, fps, config: SPRING.snap });
            return (
              <div
                key={c.t}
                style={{
                  opacity: frame < c.at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
                  transform: `translateY(${(1 - s) * 28}px)`,
                }}
              >
                <GlassPill blur={20} sweep={frame * 2.1 + c.at} style={{ padding: "14px 32px" }}>
                  <span
                    style={{
                      fontFamily: geist,
                      fontWeight: 700,
                      fontSize: 40,
                      color: COLORS.text,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.t}
                  </span>
                </GlassPill>
              </div>
            );
          })}
        </div>

        {/* Assinatura + dica diária. */}
        <div
          style={{
            position: "absolute",
            top: 756,
            left: 0,
            width: 1080,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 18,
            opacity: frame < 112 ? 0 : interpolate(assina, [0, 0.4], [0, 1], CLAMP),
            transform: `translateY(${(1 - assina) * 24}px)`,
          }}
        >
          <Word
            at={112}
            style={{
              fontFamily: mono,
              fontWeight: 700,
              fontSize: 42,
              letterSpacing: 4,
              color: COLORS.text2,
            }}
          >
            @luizbessa.ia
          </Word>
          <GlassPill blur={16} tint={0.5} sweep={frame * 2.4} style={{ padding: "10px 24px" }}>
            <div
              style={{
                transform: `rotate(${frame * 0.5}deg)`,
                filter: `drop-shadow(0 0 14px rgba(${COLORS.coralRGB},0.7))`,
                display: "flex",
              }}
            >
              <BrandLogo name="claude" size={30} color={COLORS.coral} />
            </div>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 600,
                fontSize: 30,
                color: COLORS.text2,
                whiteSpace: "nowrap",
              }}
            >
              todo dia uma dica
            </span>
          </GlassPill>
        </div>
      </Rig>

      <Flash at={SALTO} len={5} peak={0.58} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
