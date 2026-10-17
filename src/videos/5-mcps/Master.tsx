import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Perplexity, PERPLEXITY_DURATION } from "./scenes/Scene02Perplexity";
import { Scene03Playwright, PLAYWRIGHT_DURATION } from "./scenes/Scene03Playwright";
import { Scene04Firecrawl, FIRECRAWL_DURATION } from "./scenes/Scene04Firecrawl";
import { Scene05Glyph, GLYPH_DURATION } from "./scenes/Scene05Glyph";
import { Scene06Chrome, CHROME_DURATION } from "./scenes/Scene06Chrome";
import { Scene07Fecho, FECHO_DURATION } from "./scenes/Scene07Fecho";
import { Scene08Cta, CTA_DURATION } from "./scenes/Scene08Cta";
import { COLORS } from "./theme";

// Master 60s @30fps = 1800 frames (fala 55s → folga até bloco de 60s).
// A sobra de 60 frames é absorvida pela cena 08 (loopável): 210 → 270.
const CTA_IN_MASTER = CTA_DURATION + 60;

export const MASTER_DURATION =
  HOOK_DURATION +
  PERPLEXITY_DURATION +
  PLAYWRIGHT_DURATION +
  FIRECRAWL_DURATION +
  GLYPH_DURATION +
  CHROME_DURATION +
  FECHO_DURATION +
  CTA_IN_MASTER; // = 1800

export const Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK_DURATION}>
          <Scene01Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PERPLEXITY_DURATION}>
          <Scene02Perplexity />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PLAYWRIGHT_DURATION}>
          <Scene03Playwright />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FIRECRAWL_DURATION}>
          <Scene04Firecrawl />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GLYPH_DURATION}>
          <Scene05Glyph />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CHROME_DURATION}>
          <Scene06Chrome />
        </Series.Sequence>
        <Series.Sequence durationInFrames={FECHO_DURATION}>
          <Scene07Fecho />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_IN_MASTER}>
          <Scene08Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
