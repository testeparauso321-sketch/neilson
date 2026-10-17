import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Repo, REPO_DURATION } from "./scenes/Scene02Repo";
import { Scene03Pesquisa, PESQUISA_DURATION } from "./scenes/Scene03Pesquisa";
import { Scene04Ranking, RANKING_DURATION } from "./scenes/Scene04Ranking";
import { Scene05Resumo, RESUMO_DURATION } from "./scenes/Scene05Resumo";
import { Scene06Instalacao, INSTALACAO_DURATION } from "./scenes/Scene06Instalacao";
import { Scene07Demo, DEMO_DURATION } from "./scenes/Scene07Demo";
import { Scene08Cta, CTA_DURATION } from "./scenes/Scene08Cta";
import { COLORS } from "./theme";

// Master 85s @30fps = 2550 frames (fala 68s × 1,2 → bloco de 5s).
// A sobra de 30 frames é absorvida pela cena 07 (loopável): 510 → 540.
const DEMO_IN_MASTER = DEMO_DURATION + 30;

export const MASTER_DURATION =
  HOOK_DURATION +
  REPO_DURATION +
  PESQUISA_DURATION +
  RANKING_DURATION +
  RESUMO_DURATION +
  INSTALACAO_DURATION +
  DEMO_IN_MASTER +
  CTA_DURATION; // = 2550

export const Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK_DURATION}>
          <Scene01Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={REPO_DURATION}>
          <Scene02Repo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PESQUISA_DURATION}>
          <Scene03Pesquisa />
        </Series.Sequence>
        <Series.Sequence durationInFrames={RANKING_DURATION}>
          <Scene04Ranking />
        </Series.Sequence>
        <Series.Sequence durationInFrames={RESUMO_DURATION}>
          <Scene05Resumo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={INSTALACAO_DURATION}>
          <Scene06Instalacao />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DEMO_IN_MASTER}>
          <Scene07Demo />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_DURATION}>
          <Scene08Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
