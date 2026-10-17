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
import { Flash, Rig, Shards } from "../rig";
import { Label } from "../search";

// Cena 06 — O teste (192f / 6,4s · blocos 10–12 do handoff).
// Primeiro o selo (ele mesmo baixou e testou — a prova é o fosso), depois a
// comparação: o cartão SEM com dicas genéricas riscadas e o cartão COM aceso.

export const PROVA_DURATION = 192;

const SELO = 4;
const SAI = 50; // o selo vira chip no topo
const SEM = 58;
const RISCA = 106;
const COM = 120;
const FECHO = 168;

const GENERICO = ["poste mais", "use hashtags", "faça vídeos curtos"];
const REAL = ["as perguntas do seu cliente", "30 ideias de posts", "FAQ pronto pro site"];

const Item: React.FC<{ t: string; at: number; ok: boolean }> = ({ t, at, ok }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: SPRING.snap });
  const marca = interpolate(frame, [at + 6, at + 16], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: frame < at ? 0 : interpolate(s, [0, 0.35], [0, 1], CLAMP),
        transform: `translateX(${(1 - s) * (ok ? 26 : -26)}px)`,
      }}
    >
      <svg viewBox="0 0 24 24" width={30} height={30} style={{ flex: "none" }}>
        <path
          d={ok ? "M4 13 L10 19 L20 5" : "M6 6 L18 18 M18 6 L6 18"}
          fill="none"
          stroke={ok ? COLORS.coralLight : COLORS.faint}
          strokeWidth="3.2"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - marca}
          style={{
            filter: ok ? `drop-shadow(0 0 12px rgba(${COLORS.coralRGB},0.9))` : undefined,
          }}
        />
      </svg>
      <span
        style={{
          position: "relative",
          fontFamily: geist,
          fontWeight: ok ? 700 : 500,
          fontSize: 30,
          letterSpacing: -0.4,
          color: ok ? COLORS.text : COLORS.muted,
          lineHeight: 1.15,
        }}
      >
        {t}
        {ok ? null : (
          <span
            style={{
              position: "absolute",
              left: -4,
              right: -4,
              top: "52%",
              height: 3,
              borderRadius: 2,
              background: COLORS.faint,
              transformOrigin: "left center",
              transform: `scaleX(${marca})`,
            }}
          />
        )}
      </span>
    </div>
  );
};

export const Scene06Prova: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  // --- selo -----------------------------------------------------------------
  const selo = spring({ frame: frame - SELO, fps, config: SPRING.gel });
  const anel = interpolate(frame, [SELO + 6, SELO + 40], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const seloOut = interpolate(frame, [SAI, SAI + 10], [1, 0], CLAMP);

  // --- cartões --------------------------------------------------------------
  const semS = spring({ frame: frame - SEM, fps, config: SPRING.soft });
  const comS = spring({ frame: frame - COM, fps, config: SPRING.bouncy });
  const apaga = interpolate(frame, [COM, COM + 14], [0, 1], CLAMP);
  const risca = interpolate(frame, [RISCA, RISCA + 14], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const chipTopo = interpolate(frame, [SAI + 2, SAI + 12], [0, 1], CLAMP);
  const fecho = spring({ frame: frame - FECHO, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="seo-prova" energy={1.4} />

      <Rig impacts={[SELO + 8, SEM, COM, FECHO]} push={[1.16, 1.01]} pushFrames={58} origin="540px 430px">
        {/* ---- selo: eu mesmo testei ---- */}
        <div
          style={{
            position: "absolute",
            left: 540,
            top: 430,
            opacity: seloOut,
            transform: `translate(-50%, -50%) scale(${(0.72 + 0.28 * selo) * (0.9 + 0.1 * seloOut)})`,
          }}
        >
          <Shards at={SELO} count={20} seed={9} mode="in" duration={30} size={1.1} />
          <svg width={360} height={360} viewBox="0 0 360 360" style={{ display: "block" }}>
            <circle
              cx="180"
              cy="180"
              r="160"
              fill="rgba(255,255,255,0.05)"
              stroke={COLORS.rim}
              strokeWidth="2"
            />
            <circle
              cx="180"
              cy="180"
              r="160"
              fill="none"
              stroke={COLORS.coral}
              strokeWidth="6"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - anel}
              transform="rotate(-90 180 180)"
              style={{ filter: `drop-shadow(0 0 18px rgba(${COLORS.coralRGB},0.9))` }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <Label size={24} color={COLORS.muted}>
              EU MESMO
            </Label>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 58,
                letterSpacing: -2,
                lineHeight: 1.05,
                color: COLORS.text,
                textAlign: "center",
              }}
            >
              BAIXEI
              <br />E TESTEI
            </span>
          </div>
        </div>

        {/* ---- chip do selo no topo ---- */}
        <div
          style={{
            position: "absolute",
            top: 186,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: chipTopo,
            transform: `translateY(${(1 - chipTopo) * -18}px)`,
          }}
        >
          <GlassPill blur={18} sweep={frame * 2}>
            <Label size={26} color={COLORS.text2}>
              EU BAIXEI E TESTEI
            </Label>
          </GlassPill>
        </div>

        {/* ---- cartão SEM ---- */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 300,
            width: 460,
            opacity: frame < SEM ? 0 : interpolate(semS, [0, 0.3], [0, 1], CLAMP) * (1 - apaga * 0.55),
            transform: `translateY(${(1 - semS) * 40}px) rotate(${apaga * -2.6}deg) scale(${
              (0.92 + 0.08 * semS) * (1 - apaga * 0.05)
            })`,
          }}
        >
          <GlassPanel
            radius={30}
            blur={24}
            sweep={frame * 2}
            style={{ height: 344 }}
            contentStyle={{
              height: "100%",
              padding: "26px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Label size={24} color={COLORS.faint}>
              SEM A SKILL
            </Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 6 }}>
              {GENERICO.map((t, i) => (
                <Item key={t} t={t} at={SEM + 12 + i * 14} ok={false} />
              ))}
            </div>
          </GlassPanel>

          {/* Risca no cartão inteiro. */}
          <div
            style={{
              position: "absolute",
              left: -12,
              right: -12,
              top: 168,
              height: 8,
              borderRadius: 4,
              transformOrigin: "left center",
              transform: `scaleX(${risca}) skewY(-2.4deg)`,
              background: `linear-gradient(90deg, ${COLORS.coralDeep}, ${COLORS.coralLight})`,
              boxShadow: `0 0 30px rgba(${COLORS.coralRGB},0.85)`,
            }}
          />
        </div>

        {/* ---- cartão COM ---- */}
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 300,
            width: 460,
            opacity: frame < COM ? 0 : interpolate(comS, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - comS) * 46}px) scale(${0.88 + 0.12 * comS})`,
          }}
        >
          <GlassPanel
            radius={30}
            blur={26}
            hot={0.45 + 0.2 * pulse}
            tint={0.9}
            sweep={frame * 2.6}
            style={{ height: 344 }}
            contentStyle={{
              height: "100%",
              padding: "26px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Label size={24} color={COLORS.coralLight}>
              COM A SKILL
            </Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 6 }}>
              {REAL.map((t, i) => (
                <Item key={t} t={t} at={COM + 12 + i * 14} ok />
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* ---- fecho ---- */}
        <div
          style={{
            position: "absolute",
            top: 690,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < FECHO ? 0 : interpolate(fecho, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - fecho) * 26}px) scale(${0.84 + 0.16 * fecho})`,
          }}
        >
          <GlassPill blur={22} tint={1} hot={0.5} sweep={frame * 2.8}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 50,
                letterSpacing: -1,
                color: COLORS.coralLight,
                textShadow: `0 0 ${28 + 32 * pulse}px rgba(${COLORS.coralRGB},0.85)`,
                whiteSpace: "nowrap",
              }}
            >
              MUITO MAIS COMPLETO
            </span>
          </GlassPill>
        </div>
      </Rig>

      <Flash at={SELO + 8} len={5} peak={0.42} />
      <Flash at={COM} len={5} peak={0.5} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
