import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Prova, PROVA_DURATION } from "./scenes/Scene02Prova";
import { Scene03Escala, ESCALA_DURATION } from "./scenes/Scene03Escala";
import { Scene04Tutorial, TUTORIAL_DURATION } from "./scenes/Scene04Tutorial";
import { Scene05Fosso, FOSSO_DURATION } from "./scenes/Scene05Fosso";
import { Scene06Cta, CTA_DURATION } from "./scenes/Scene06Cta";
import { COLORS } from "./theme";

// Master 70s @30fps = 2100 frames. Cada cena carrega a duração do seu bloco da
// copy + 20% de margem (regra do transcript-to-motion), então a soma já fecha
// exatos 2100 — sem folga solta em lugar nenhum.
//
//   01 hook      210f   (0:00–0:06)
//   02 prova     360f   (0:06–0:16)
//   03 escala    360f   (0:16–0:26)
//   04 tutorial  660f   (0:26–0:44)
//   05 fosso     210f   (0:44–0:50)
//   06 cta       300f   (0:50–0:58)

export const MASTER_DURATION =
  HOOK_DURATION +
  PROVA_DURATION +
  ESCALA_DURATION +
  TUTORIAL_DURATION +
  FOSSO_DURATION +
  CTA_DURATION; // = 2100

export const Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK_DURATION}>
          <Scene01Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PROVA_DURATION}>
          <Scene02Prova />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ESCALA_DURATION}>
          <Scene03Escala />
        </Series.Sequence>
        <Series.Sequence durationInFrames={TUTORIAL_DURATION}>
          <Scene04Tutorial />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FOSSO_DURATION}>
          <Scene05Fosso />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_DURATION}>
          <Scene06Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
