import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Prova, PROVA_DURATION } from "./scenes/Scene02Prova";
import { Scene03Diferencial, DIFERENCIAL_DURATION } from "./scenes/Scene03Diferencial";
import { Scene04Fila, FILA_DURATION } from "./scenes/Scene04Fila";
import { Scene05Calendario, CALENDARIO_DURATION } from "./scenes/Scene05Calendario";
import { Scene06Payoff, PAYOFF_DURATION } from "./scenes/Scene06Payoff";
import { Scene07Cta, CTA_DURATION } from "./scenes/Scene07Cta";
import { COLORS } from "./theme";

// Master 55s @30fps = 1650 frames (fala 44s ×1,2 → bloco de 55s).
// A sobra é absorvida pelas cenas loopáveis: 04 (+45), 05 (+90), 07 (+60).
const FILA_IN_MASTER = FILA_DURATION + 45; // 300
const CALENDARIO_IN_MASTER = CALENDARIO_DURATION + 90; // 390
const CTA_IN_MASTER = CTA_DURATION + 60; // 225

export const MASTER_DURATION =
  HOOK_DURATION +
  PROVA_DURATION +
  DIFERENCIAL_DURATION +
  FILA_IN_MASTER +
  CALENDARIO_IN_MASTER +
  PAYOFF_DURATION +
  CTA_IN_MASTER; // = 1650

export const Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK_DURATION}>
          <Scene01Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PROVA_DURATION}>
          <Scene02Prova />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DIFERENCIAL_DURATION}>
          <Scene03Diferencial />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FILA_IN_MASTER}>
          <Scene04Fila />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CALENDARIO_IN_MASTER}>
          <Scene05Calendario />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PAYOFF_DURATION}>
          <Scene06Payoff />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_IN_MASTER}>
          <Scene07Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
