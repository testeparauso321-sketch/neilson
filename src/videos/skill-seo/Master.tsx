import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Scene01Hook, HOOK_DURATION } from "./scenes/Scene01Hook";
import { Scene02Relatorio, RELATORIO_DURATION } from "./scenes/Scene02Relatorio";
import { Scene03Gera, GERA_DURATION } from "./scenes/Scene03Gera";
import { Scene04Console, CONSOLE_DURATION } from "./scenes/Scene04Console";
import { Scene05Instalar, INSTALAR_DURATION } from "./scenes/Scene05Instalar";
import { Scene06Prova, PROVA_DURATION } from "./scenes/Scene06Prova";
import { Scene07Cta, CTA_DURATION } from "./scenes/Scene07Cta";
import { COLORS } from "./theme";

// Master 39,3s @30fps = 1179 frames — a duração EXATA do corte aprovado
// (handoff_0508). Toda fronteira de cena cai numa fronteira de bloco do
// handoff, então não há folga a distribuir: cada cena vale a soma dos tempos
// dos seus blocos.
//
//   01 hook       159f   (0:00,0–0:05,3)   blocos 1–2
//   02 relatório  129f   (0:05,3–0:09,6)   bloco 3
//   03 gera       246f   (0:09,6–0:17,8)   blocos 4–6
//   04 console    162f   (0:17,8–0:23,2)   blocos 7–8
//   05 instalar   111f   (0:23,2–0:26,9)   bloco 9
//   06 prova      192f   (0:26,9–0:33,3)   blocos 10–12
//   07 cta        180f   (0:33,3–0:39,3)   blocos 13–15

export const MASTER_DURATION =
  HOOK_DURATION +
  RELATORIO_DURATION +
  GERA_DURATION +
  CONSOLE_DURATION +
  INSTALAR_DURATION +
  PROVA_DURATION +
  CTA_DURATION; // = 1179

export const Master: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <Series>
        <Series.Sequence durationInFrames={HOOK_DURATION}>
          <Scene01Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={RELATORIO_DURATION}>
          <Scene02Relatorio />
        </Series.Sequence>
        <Series.Sequence durationInFrames={GERA_DURATION}>
          <Scene03Gera />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CONSOLE_DURATION}>
          <Scene04Console />
        </Series.Sequence>
        <Series.Sequence durationInFrames={INSTALAR_DURATION}>
          <Scene05Instalar />
        </Series.Sequence>
        <Series.Sequence durationInFrames={PROVA_DURATION}>
          <Scene06Prova />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CTA_DURATION}>
          <Scene07Cta />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
