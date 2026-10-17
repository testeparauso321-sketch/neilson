import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Ponytail, PONYTAIL_DURATION } from "./scenes/Scene02Ponytail";
import { Scene03CodeReview, CODEREVIEW_DURATION } from "./scenes/Scene03CodeReview";
import { Scene04ClaudeMem, CLAUDEMEM_DURATION } from "./scenes/Scene04ClaudeMem";
import { Scene05Context7, CONTEXT7_DURATION } from "./scenes/Scene05Context7";
import { Scene06Superpowers, SUPERPOWERS_DURATION } from "./scenes/Scene06Superpowers";
import { Scene07Cta, CTA_DURATION } from "./scenes/Scene07Cta";
import { COLORS } from "./theme";

// Master 70s @30fps = 2100 frames. As cenas 01→06 têm exatamente a duração dos
// blocos da copy (0:00 / 0:06 / 0:17 / 0:28 / 0:39 / 0:50 / 1:01), então cada
// cena começa no segundo escrito no roteiro. A folga (2100 − 2010 = 90f) fica
// toda no fim, na cena 07 (loopável), pra não desalinhar nada.
const CTA_IN_MASTER = CTA_DURATION + 90;

export const MASTER_DURATION =
  HOOK_DURATION +
  PONYTAIL_DURATION +
  CODEREVIEW_DURATION +
  CLAUDEMEM_DURATION +
  CONTEXT7_DURATION +
  SUPERPOWERS_DURATION +
  CTA_IN_MASTER; // = 2100

export const Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK_DURATION}>
          <Scene01Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PONYTAIL_DURATION}>
          <Scene02Ponytail />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CODEREVIEW_DURATION}>
          <Scene03CodeReview />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CLAUDEMEM_DURATION}>
          <Scene04ClaudeMem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CONTEXT7_DURATION}>
          <Scene05Context7 />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SUPERPOWERS_DURATION}>
          <Scene06Superpowers />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_IN_MASTER}>
          <Scene07Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
