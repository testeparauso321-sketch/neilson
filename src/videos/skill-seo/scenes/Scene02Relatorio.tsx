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
import { Label, QueryRow } from "../search";

// Cena 02 — O relatório (129f / 4,3s · bloco 3 do handoff).
// As buscas do gancho viram linha: pergunta de um lado, quantas vezes
// perguntaram do outro. O scanner desce, trava na linha do exemplo e o número
// rola até passar de 2 mil — o único dado do vídeo, e ele vem da fala.

export const RELATORIO_DURATION = 129;

const DESTAQUE = 2184; // "mais de 2 mil vezes" (fala do bloco 3)
const SCANNER = 44;
const CHIP = 92;

const LINHAS = [
  { q: "quanto custa uma cozinha planejada", vol: DESTAQUE, share: 1, at: 6 },
  { q: "cozinha planejada pequena preço", vol: 1310, share: 0.6, at: 16 },
  { q: "vale a pena cozinha planejada?", vol: 968, share: 0.44, at: 26 },
  { q: "cozinha planejada fica pronta quando", vol: 641, share: 0.29, at: 36 },
];

const WIN_TOP = 226;
const ROW_TOP = 374;
const ROW_STEP = 82;
// A linha vive DENTRO da janela: 110 + 820 = 930, e a janela fecha em 1010.
// Com o realce (scale 1.03 a partir da esquerda) ela chega em 955 — ainda
// dentro. Foi o que estourou no primeiro teste.
const ROW_X = 110;
const ROW_W = 820;

export const Scene02Relatorio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const win = spring({ frame: frame - 2, fps, config: SPRING.soft });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 7);

  // Scanner: desce e trava na primeira linha.
  const scan = interpolate(frame, [SCANNER, SCANNER + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const scanY = interpolate(scan, [0, 1], [WIN_TOP + 92, ROW_TOP - 12], CLAMP);
  const travado = interpolate(frame, [SCANNER + 8, SCANNER + 16], [0, 1], CLAMP);

  // O número rola devagar e só fecha em 2.184 no fim da batida.
  const conta = interpolate(frame, [8, 88], [0, DESTAQUE], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const chip = spring({ frame: frame - CHIP, fps, config: SPRING.bouncy });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      <LiquidBackdrop idPrefix="seo-rel" energy={1.15} />

      <Rig impacts={[SCANNER + 10, CHIP]} push={[1.14, 1.01]} pushFrames={70} origin="540px 440px">
        <div
          style={{
            position: "absolute",
            top: 178,
            left: 0,
            width: 1080,
            textAlign: "center",
            opacity: interpolate(frame, [0, 10], [0, 1], CLAMP),
          }}
        >
          <Label size={28}>TUDO NUM RELATÓRIO SÓ</Label>
        </div>

        {/* Janela do relatório. */}
        <div
          style={{
            position: "absolute",
            left: 70,
            top: WIN_TOP,
            width: 940,
            opacity: interpolate(win, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - win) * 40}px) scale(${0.94 + 0.06 * win})`,
          }}
        >
          <GlassPanel
            radius={36}
            blur={30}
            hot={travado * 0.22}
            sweep={frame * 2.2}
            style={{ height: 490 }}
            contentStyle={{ height: "100%", position: "relative" }}
          >
            {/* Barra de título. */}
            <div
              style={{
                height: 68,
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "0 30px",
                borderBottom: `1px solid ${COLORS.rim}`,
              }}
            >
              {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    background: c,
                    opacity: 0.85,
                  }}
                />
              ))}
              <div style={{ flex: 1, textAlign: "center", marginLeft: -60 }}>
                <Label size={24} color={COLORS.text2}>
                  RELATÓRIO
                </Label>
              </div>
            </div>

            {/* Cabeçalho da tabela. */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "22px 36px 0",
              }}
            >
              <Label size={21} color={COLORS.faint}>
                O QUE PERGUNTARAM
              </Label>
              <Label size={21} color={COLORS.faint}>
                VEZES
              </Label>
            </div>
          </GlassPanel>
        </div>

        {/* Linhas — fora do painel para o scanner poder acender uma só. */}
        {LINHAS.map((l, i) => {
          const t = interpolate(frame, [l.at, l.at + 16], [0, 1], {
            ...CLAMP,
            easing: Easing.out(Easing.cubic),
          });
          const active = i === 0 ? travado : 0;
          return (
            <div
              key={l.q}
              style={{
                position: "absolute",
                left: ROW_X,
                top: ROW_TOP + i * ROW_STEP,
                transform: `scale(${1 + active * 0.03})`,
                transformOrigin: "0% 50%",
                opacity: i === 0 ? 1 : 1 - travado * 0.42,
              }}
            >
              <QueryRow
                q={l.q}
                vol={i === 0 ? conta : l.vol * Math.min(1, t * 1.3)}
                share={l.share}
                t={t}
                active={active}
                width={ROW_W}
                fontSize={31}
              />
            </div>
          );
        })}

        {/* Scanner coral. */}
        <div
          style={{
            position: "absolute",
            left: 96,
            top: scanY,
            width: 880,
            height: 74,
            borderRadius: 18,
            border: `2px solid rgba(${COLORS.coralRGB},${(0.35 + 0.45 * travado * pulse).toFixed(2)})`,
            background: `linear-gradient(90deg, rgba(${COLORS.coralRGB},0.16), rgba(${COLORS.coralRGB},0.04))`,
            boxShadow: `0 0 ${30 + 40 * travado}px rgba(${COLORS.coralRGB},${(
              0.3 + 0.35 * travado
            ).toFixed(2)})`,
            opacity: interpolate(frame, [SCANNER - 4, SCANNER + 2], [0, 1], CLAMP),
          }}
        />

        {/* Fecho: o número que a fala entrega. */}
        <div
          style={{
            position: "absolute",
            top: 744,
            left: 0,
            width: 1080,
            display: "flex",
            justifyContent: "center",
            opacity: frame < CHIP ? 0 : interpolate(chip, [0, 0.3], [0, 1], CLAMP),
            transform: `translateY(${(1 - chip) * 30}px) scale(${0.8 + 0.2 * chip})`,
          }}
        >
          <GlassPill blur={22} tint={0.9} hot={0.5} sweep={frame * 2.4}>
            <span
              style={{
                fontFamily: geist,
                fontWeight: 900,
                fontSize: 52,
                letterSpacing: -1,
                color: COLORS.coralLight,
                textShadow: `0 0 ${28 + 34 * pulse}px rgba(${COLORS.coralRGB},0.8)`,
                whiteSpace: "nowrap",
              }}
            >
              MAIS DE 2 MIL VEZES
            </span>
            <span
              style={{
                fontFamily: mono,
                fontWeight: 500,
                fontSize: 26,
                letterSpacing: 3,
                color: COLORS.muted,
              }}
            >
              NO GOOGLE
            </span>
          </GlassPill>
        </div>
      </Rig>

      <Flash at={SCANNER + 10} len={4} peak={0.34} />
      <Flash at={CHIP} len={5} peak={0.5} />
      <Grain />
      <Vignette />
    </AbsoluteFill>
  );
};
