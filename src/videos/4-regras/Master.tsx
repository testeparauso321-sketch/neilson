import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Regras, REGRAS_DURATION } from "./scenes/Scene02Regras";
import { Scene03Escala, ESCALA_DURATION } from "./scenes/Scene03Escala";
import { Scene04Dores, DORES_DURATION } from "./scenes/Scene04Dores";
import { Scene05Demo, DEMO_DURATION } from "./scenes/Scene05Demo";
import { Scene06Fosso, FOSSO_DURATION } from "./scenes/Scene06Fosso";
import { Scene07Cta, CTA_DURATION } from "./scenes/Scene07Cta";
import { TONE } from "./theme";

// Master 55s @30fps = 1650 frames. As cenas 01→06 têm exatamente a duração dos
// blocos da copy, então cada cena começa no segundo escrito no roteiro
// (0:00 / 0:05 / 0:11 / 0:16 / 0:28 / 0:36 / 0:44). A folga (1650 − 1500 = 150f)
// fica toda no fim, na cena 07 (loopável), pra não desalinhar nada.
//
// A alternância de fundo é BRANCO / cinza / BRANCO / cinza / BRANCO / cinza /
// BRANCO — cada corte troca a superfície do papel (ver brief.md).
const CTA_IN_MASTER = CTA_DURATION + 150;

export const MASTER_DURATION =
  HOOK_DURATION +
  REGRAS_DURATION +
  ESCALA_DURATION +
  DORES_DURATION +
  DEMO_DURATION +
  FOSSO_DURATION +
  CTA_IN_MASTER; // = 1650

export const Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: TONE.white.bg }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK_DURATION}>
          <Scene01Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={REGRAS_DURATION}>
          <Scene02Regras />
        </Series.Sequence>
        <Series.Sequence durationInFrames={ESCALA_DURATION}>
          <Scene03Escala />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DORES_DURATION}>
          <Scene04Dores />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DEMO_DURATION}>
          <Scene05Demo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FOSSO_DURATION}>
          <Scene06Fosso />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_IN_MASTER}>
          <Scene07Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
