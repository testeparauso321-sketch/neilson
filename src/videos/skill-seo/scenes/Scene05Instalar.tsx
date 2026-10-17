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
import { GlassPanel, GlassPill, Grain, LiquidBackdrop, Vignette } from "../glass";
import { Flash, Rig } from "../rig";
import { Label, typedChars } from "../search";
import { BrandLogo } from "../../../logos/BrandLogo";

// Cena 05 — Instalar (111f / 3,7s · bloco 9 do handoff · terminal-inserts).
// Bloco curto, então o terminal é curto: cola o link, pede em português, a
// barra enche e a skill fica instalada. Nenhuma URL inventada — o que aparece
// é o chip do link, que é como a pessoa recebe.

export const INSTALAR_DURATION = 111;

const COLA = 8;
const PEDIDO = 30;
const ENTER = 56;
const OK = 78;
const CHIP = 92;

const FRASE = "instala essa skill pra mim";

export const Scene05Instalar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);
  const win = spring({ frame: frame - 1, fps, config: SPRING.soft });
  const cola = spring({ frame: frame - COLA, fps, config: SPRING.bouncy });

  const texto = typedChars(FRASE, frame, PEDIDO, ENTER - 4);
  const barra = interpolate(frame, [ENTER + 4, OK - 2], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.quad),
  });
  const ok = spring({ frame: frame - OK, fps, config: SPRING.bouncy });
  const chip = spring({ frame: frame - CHIP, fps, config: SPRING.snap });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="seo-inst" energy={1.25} />

      <Rig impacts={[COLA, ENTER, OK]} push={[1.14, 1.01]} pushFrames={54} origin="540px 440px">
        <div
          style={{
            position: "absolute",
            top: 186,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: interpolate(frame, [0, 8], [0, 1], CLAMP),
          }}
        >
          <Label size={28}>PRA BAIXAR A SKILL</Label>
        </div>

        <div
          style={{
            position: "absolute",
            left: 80,
            top: 240,
            width: 920,
            opacity: interpolate(win, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - win) * 36}px) scale(${0.95 + 0.05 * win})`,
          }}
        >
          <GlassPanel
            radius={32}
            blur={30}
            hot={interpolate(frame, [OK - 2, OK + 3, OK + 24], [0, 0.8, 0.16], CLAMP)}
            sweep={frame * 2.6}
            style={{ height: 430 }}
            contentStyle={{ height: "100%" }}
          >
            {/* Barra de título com a faísca. */}
            <div
              style={{
                height: 66,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "0 26px",
                borderBottom: `1px solid ${COLORS.rim}`,
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div
                  key={c}
                  style={{ width: 14, height: 14, borderRadius: "50%", background: c, opacity: 0.85 }}
                />
              ))}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  marginLeft: -40,
                }}
              >
                <BrandLogo name="claude" size={26} color={COLORS.coral} />
                <Label size={22} color={COLORS.text2}>
                  CLAUDE CODE
                </Label>
              </div>
            </div>

            <div style={{ padding: "26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Linha 1 — o link colado. */}
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: COLORS.coralLight }}>
                  {">"}
                </span>
                <div
                  style={{
                    opacity: frame < COLA ? 0 : interpolate(cola, [0, 0.3], [0, 1], CLAMP),
                    transform: `translateY(${(1 - cola) * -22}px) scale(${0.86 + 0.14 * cola})`,
                  }}
                >
                  <GlassPill blur={16} tint={0.7} style={{ padding: "10px 22px" }}>
                    <svg viewBox="0 0 24 24" width={24} height={24} aria-label="link">
                      <path
                        d="M9.5 14.5 L14.5 9.5 M10.5 6.5 L12.5 4.5 a4 4 0 0 1 6 6 L16.5 12.5 M13.5 17.5 L11.5 19.5 a4 4 0 0 1-6-6 L7.5 11.5"
                        fill="none"
                        stroke={COLORS.coralLight}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span
                      style={{
                        fontFamily: mono,
                        fontWeight: 500,
                        fontSize: 28,
                        color: COLORS.text2,
                        whiteSpace: "nowrap",
                      }}
                    >
                      link da skill
                    </span>
                  </GlassPill>
                </div>
              </div>

              {/* Linha 2 — o pedido, em português. */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, minHeight: 46 }}>
                <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 34, color: COLORS.coralLight }}>
                  {">"}
                </span>
                <span
                  style={{
                    fontFamily: mono,
                    fontWeight: 500,
                    fontSize: 34,
                    color: COLORS.text,
                    whiteSpace: "nowrap",
                  }}
                >
                  {texto}
                </span>
                <span
                  style={{
                    width: 16,
                    height: 36,
                    background: COLORS.coralLight,
                    opacity: frame < ENTER && frame % 12 < 7 ? 0.95 : 0.12,
                    boxShadow: `0 0 16px rgba(${COLORS.coralRGB},0.9)`,
                  }}
                />
              </div>

              {/* Saída. */}
              <div
                style={{
                  marginTop: 6,
                  opacity: interpolate(frame, [ENTER, ENTER + 5], [0, 1], CLAMP),
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: mono,
                    // text2, não muted: a banda specular do painel lava cinza.
                    fontWeight: 500,
                    fontSize: 30,
                    color: COLORS.text2,
                  }}
                >
                  baixando a skill{".".repeat(1 + (Math.floor(frame / 6) % 3))}
                </span>
                <div
                  style={{
                    height: 14,
                    borderRadius: 7,
                    background: "rgba(255,255,255,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${barra * 100}%`,
                      borderRadius: 7,
                      background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
                      boxShadow: `0 0 26px rgba(${COLORS.coralRGB},0.9)`,
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    opacity: frame < OK ? 0 : interpolate(ok, [0, 0.35], [0, 1], CLAMP),
                    transform: `translateX(${(1 - ok) * -20}px)`,
                  }}
                >
                  <span style={{ fontFamily: mono, fontWeight: 700, fontSize: 32, color: COLORS.ok }}>
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: mono,
                      fontWeight: 700,
                      fontSize: 32,
                      color: COLORS.text,
                    }}
                  >
                    skill instalada
                  </span>
                </div>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Fecho. */}
        <div
          style={{
            position: "absolute",
            top: 706,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < CHIP ? 0 : interpolate(chip, [0, 0.35], [0, 1], CLAMP),
            transform: `translateY(${(1 - chip) * 24}px)`,
          }}
        >
          <GlassPill blur={22} tint={0.8} hot={0.4} sweep={frame * 2.6}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 48,
                letterSpacing: 1,
                color: COLORS.coralLight,
                textShadow: `0 0 ${26 + 30 * pulse}px rgba(${COLORS.coralRGB},0.8)`,
              }}
            >
              PRONTO
            </span>
          </GlassPill>
        </div>
      </Rig>

      <Flash at={ENTER} len={4} peak={0.36} />
      <Flash at={OK} len={5} peak={0.5} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
