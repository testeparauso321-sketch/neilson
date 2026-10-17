import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Prova, PROVA_DURATION } from "./scenes/Scene02Prova";
import { Scene03Local, LOCAL_DURATION } from "./scenes/Scene03Local";
import { Scene04Tutorial, TUTORIAL_DURATION } from "./scenes/Scene04Tutorial";
import { Scene05Fosso, FOSSO_DURATION } from "./scenes/Scene05Fosso";
import { Scene06Cta, CTA_DURATION } from "./scenes/Scene06Cta";
import { COLORS } from "./theme";

// Master 55s @30fps = 1650 frames. A fala tem 50s (blocos do roteiro), então
// cada cena carrega o seu bloco + folga — sempre sobra B-roll na edição, nunca
// falta.
//
//   01 hook       135f   (0:00–0:04.5)
//   02 prova      390f   (0:04.5–0:17.5)
//   03 local      330f   (0:17.5–0:28.5)
//   04 tutorial   330f   (0:28.5–0:39.5)
//   05 fosso      255f   (0:39.5–0:48)
//   06 cta        210f   (0:48–0:55)

export const MASTER_DURATION =
  HOOK_DURATION +
  PROVA_DURATION +
  LOCAL_DURATION +
  TUTORIAL_DURATION +
  FOSSO_DURATION +
  CTA_DURATION; // = 1650

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
        <Series.Sequence durationInFrames={LOCAL_DURATION}>
          <Scene03Local />
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
