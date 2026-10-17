import "./index.css";
import { Composition } from "remotion";
import { ClaudeCowork } from "./ClaudeCowork/ClaudeCowork";
import { DURATION, FPS, VIEW_W, VIEW_H } from "./ClaudeCowork/config";
import { Master, MASTER_DURATION } from "./videos/ultimos-30-dias/Master";
import { Scene01Hook, HOOK_DURATION } from "./videos/ultimos-30-dias/scenes/Scene01Hook";
import { Scene02Repo, REPO_DURATION } from "./videos/ultimos-30-dias/scenes/Scene02Repo";
import {
  Scene03Pesquisa,
  PESQUISA_DURATION,
} from "./videos/ultimos-30-dias/scenes/Scene03Pesquisa";
import {
  Scene04Ranking,
  RANKING_DURATION,
} from "./videos/ultimos-30-dias/scenes/Scene04Ranking";
import { Scene05Resumo, RESUMO_DURATION } from "./videos/ultimos-30-dias/scenes/Scene05Resumo";
import {
  Scene06Instalacao,
  INSTALACAO_DURATION,
} from "./videos/ultimos-30-dias/scenes/Scene06Instalacao";
import { Scene07Demo, DEMO_DURATION } from "./videos/ultimos-30-dias/scenes/Scene07Demo";
import { Scene08Cta, CTA_DURATION } from "./videos/ultimos-30-dias/scenes/Scene08Cta";
import { Master as McpMaster, MASTER_DURATION as MCP_MASTER_DURATION } from "./videos/5-mcps/Master";
import { Scene01Hook as McpHook, HOOK_DURATION as MCP_HOOK_DURATION } from "./videos/5-mcps/scenes/Scene01Hook";
import {
  Scene02Perplexity,
  PERPLEXITY_DURATION,
} from "./videos/5-mcps/scenes/Scene02Perplexity";
import {
  Scene03Playwright,
  PLAYWRIGHT_DURATION,
} from "./videos/5-mcps/scenes/Scene03Playwright";
import {
  Scene04Firecrawl,
  FIRECRAWL_DURATION,
} from "./videos/5-mcps/scenes/Scene04Firecrawl";
import { Scene05Glyph, GLYPH_DURATION } from "./videos/5-mcps/scenes/Scene05Glyph";
import { Scene06Chrome, CHROME_DURATION } from "./videos/5-mcps/scenes/Scene06Chrome";
import { Scene07Fecho, FECHO_DURATION } from "./videos/5-mcps/scenes/Scene07Fecho";
import {
  Scene08Cta as McpCta,
  CTA_DURATION as MCP_CTA_DURATION,
} from "./videos/5-mcps/scenes/Scene08Cta";
import {
  Master as PostizMaster,
  MASTER_DURATION as POSTIZ_MASTER_DURATION,
} from "./videos/postiz/Master";
import {
  Scene01Hook as PostizHook,
  HOOK_DURATION as POSTIZ_HOOK_DURATION,
} from "./videos/postiz/scenes/Scene01Hook";
import { Scene02Prova, PROVA_DURATION } from "./videos/postiz/scenes/Scene02Prova";
import {
  Scene03Diferencial,
  DIFERENCIAL_DURATION,
} from "./videos/postiz/scenes/Scene03Diferencial";
import { Scene04Fila, FILA_DURATION } from "./videos/postiz/scenes/Scene04Fila";
import {
  Scene05Calendario,
  CALENDARIO_DURATION,
} from "./videos/postiz/scenes/Scene05Calendario";
import { Scene06Payoff, PAYOFF_DURATION } from "./videos/postiz/scenes/Scene06Payoff";
import {
  Scene07Cta as PostizCta,
  CTA_DURATION as POSTIZ_CTA_DURATION,
} from "./videos/postiz/scenes/Scene07Cta";
import { Scene08Producao, PRODUCAO_DURATION } from "./videos/postiz/scenes/Scene08Producao";
import { Scene09MudaJogo, MUDAJOGO_DURATION } from "./videos/postiz/scenes/Scene09MudaJogo";
import {
  Master as PluginsMaster,
  MASTER_DURATION as PLUGINS_MASTER_DURATION,
} from "./videos/5-plugins/Master";
import {
  Scene01Hook as PluginsHook,
  HOOK_DURATION as PLUGINS_HOOK_DURATION,
} from "./videos/5-plugins/scenes/Scene01Hook";
import {
  Scene02Ponytail,
  PONYTAIL_DURATION,
} from "./videos/5-plugins/scenes/Scene02Ponytail";
import {
  Scene03CodeReview,
  CODEREVIEW_DURATION,
} from "./videos/5-plugins/scenes/Scene03CodeReview";
import {
  Scene04ClaudeMem,
  CLAUDEMEM_DURATION,
} from "./videos/5-plugins/scenes/Scene04ClaudeMem";
import {
  Scene05Context7,
  CONTEXT7_DURATION,
} from "./videos/5-plugins/scenes/Scene05Context7";
import {
  Scene06Superpowers,
  SUPERPOWERS_DURATION,
} from "./videos/5-plugins/scenes/Scene06Superpowers";
import {
  Scene07Cta as PluginsCta,
  CTA_DURATION as PLUGINS_CTA_DURATION,
} from "./videos/5-plugins/scenes/Scene07Cta";

import {
  Master as RegrasMaster,
  MASTER_DURATION as REGRAS_MASTER_DURATION,
} from "./videos/4-regras/Master";
import {
  Scene01Hook as RegrasHook,
  HOOK_DURATION as REGRAS_HOOK_DURATION,
} from "./videos/4-regras/scenes/Scene01Hook";
import { Scene02Regras, REGRAS_DURATION } from "./videos/4-regras/scenes/Scene02Regras";
import { Scene03Escala, ESCALA_DURATION } from "./videos/4-regras/scenes/Scene03Escala";
import { Scene04Dores, DORES_DURATION } from "./videos/4-regras/scenes/Scene04Dores";
import { Scene05Demo, DEMO_DURATION as REGRAS_DEMO_DURATION } from "./videos/4-regras/scenes/Scene05Demo";
import { Scene06Fosso, FOSSO_DURATION } from "./videos/4-regras/scenes/Scene06Fosso";
import {
  Scene07Cta as RegrasCta,
  CTA_DURATION as REGRAS_CTA_DURATION,
} from "./videos/4-regras/scenes/Scene07Cta";

import {
  Master as AdminMaster,
  MASTER_DURATION as ADMIN_MASTER_DURATION,
} from "./videos/plugin-administrativo/Master";
import {
  Scene01Hook as AdminHook,
  HOOK_DURATION as ADMIN_HOOK_DURATION,
} from "./videos/plugin-administrativo/scenes/Scene01Hook";
import {
  Scene02Prova as AdminProva,
  PROVA_DURATION as ADMIN_PROVA_DURATION,
} from "./videos/plugin-administrativo/scenes/Scene02Prova";
import {
  Scene03Escala as AdminEscala,
  ESCALA_DURATION as ADMIN_ESCALA_DURATION,
} from "./videos/plugin-administrativo/scenes/Scene03Escala";
import {
  Scene04Tutorial,
  TUTORIAL_DURATION,
} from "./videos/plugin-administrativo/scenes/Scene04Tutorial";
import {
  Scene05Fosso as AdminFosso,
  FOSSO_DURATION as ADMIN_FOSSO_DURATION,
} from "./videos/plugin-administrativo/scenes/Scene05Fosso";
import {
  Scene06Cta as AdminCta,
  CTA_DURATION as ADMIN_CTA_DURATION,
} from "./videos/plugin-administrativo/scenes/Scene06Cta";

import {
  Master as MeetilyMaster,
  MASTER_DURATION as MEETILY_MASTER_DURATION,
} from "./videos/meetily/Master";
import {
  Scene01Hook as MeetilyHook,
  HOOK_DURATION as MEETILY_HOOK_DURATION,
} from "./videos/meetily/scenes/Scene01Hook";
import {
  Scene02Prova as MeetilyProva,
  PROVA_DURATION as MEETILY_PROVA_DURATION,
} from "./videos/meetily/scenes/Scene02Prova";
import { Scene03Local, LOCAL_DURATION } from "./videos/meetily/scenes/Scene03Local";
import {
  Scene04Tutorial as MeetilyTutorial,
  TUTORIAL_DURATION as MEETILY_TUTORIAL_DURATION,
} from "./videos/meetily/scenes/Scene04Tutorial";
import {
  Scene05Fosso as MeetilyFosso,
  FOSSO_DURATION as MEETILY_FOSSO_DURATION,
} from "./videos/meetily/scenes/Scene05Fosso";
import {
  Scene06Cta as MeetilyCta,
  CTA_DURATION as MEETILY_CTA_DURATION,
} from "./videos/meetily/scenes/Scene06Cta";

import {
  Master as SeoMaster,
  MASTER_DURATION as SEO_MASTER_DURATION,
} from "./videos/skill-seo/Master";
import {
  Scene01Hook as SeoHook,
  HOOK_DURATION as SEO_HOOK_DURATION,
} from "./videos/skill-seo/scenes/Scene01Hook";
import {
  Scene02Relatorio,
  RELATORIO_DURATION,
} from "./videos/skill-seo/scenes/Scene02Relatorio";
import { Scene03Gera, GERA_DURATION } from "./videos/skill-seo/scenes/Scene03Gera";
import { Scene04Console, CONSOLE_DURATION } from "./videos/skill-seo/scenes/Scene04Console";
import { Scene05Instalar, INSTALAR_DURATION } from "./videos/skill-seo/scenes/Scene05Instalar";
import {
  Scene06Prova as SeoProva,
  PROVA_DURATION as SEO_PROVA_DURATION,
} from "./videos/skill-seo/scenes/Scene06Prova";
import {
  Scene07Cta as SeoCta,
  CTA_DURATION as SEO_CTA_DURATION,
} from "./videos/skill-seo/scenes/Scene07Cta";

const V = { fps: 30, width: 1080, height: 1920 } as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ClaudeCowork"
        component={ClaudeCowork}
        durationInFrames={DURATION}
        fps={FPS}
        width={VIEW_W}
        height={VIEW_H}
      />
      <Composition
        id="ultimos-30-dias-master"
        component={Master}
        durationInFrames={MASTER_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-01-hook"
        component={Scene01Hook}
        durationInFrames={HOOK_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-02-repo"
        component={Scene02Repo}
        durationInFrames={REPO_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-03-pesquisa"
        component={Scene03Pesquisa}
        durationInFrames={PESQUISA_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-04-ranking"
        component={Scene04Ranking}
        durationInFrames={RANKING_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-05-resumo"
        component={Scene05Resumo}
        durationInFrames={RESUMO_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-06-instalacao"
        component={Scene06Instalacao}
        durationInFrames={INSTALACAO_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-07-demo"
        component={Scene07Demo}
        durationInFrames={DEMO_DURATION}
        {...V}
      />
      <Composition
        id="ultimos-30-dias-08-cta"
        component={Scene08Cta}
        durationInFrames={CTA_DURATION}
        {...V}
      />

      {/* Vídeo: 5 MCPs */}
      <Composition
        id="5-mcps-master"
        component={McpMaster}
        durationInFrames={MCP_MASTER_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-01-hook"
        component={McpHook}
        durationInFrames={MCP_HOOK_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-02-perplexity"
        component={Scene02Perplexity}
        durationInFrames={PERPLEXITY_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-03-playwright"
        component={Scene03Playwright}
        durationInFrames={PLAYWRIGHT_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-04-firecrawl"
        component={Scene04Firecrawl}
        durationInFrames={FIRECRAWL_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-05-glyph"
        component={Scene05Glyph}
        durationInFrames={GLYPH_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-06-chrome"
        component={Scene06Chrome}
        durationInFrames={CHROME_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-07-fecho"
        component={Scene07Fecho}
        durationInFrames={FECHO_DURATION}
        {...V}
      />
      <Composition
        id="5-mcps-08-cta"
        component={McpCta}
        durationInFrames={MCP_CTA_DURATION}
        {...V}
      />

      {/* Vídeo: Postiz — a IA que posta sozinha */}
      <Composition
        id="postiz-master"
        component={PostizMaster}
        durationInFrames={POSTIZ_MASTER_DURATION}
        {...V}
      />
      <Composition
        id="postiz-01-hook"
        component={PostizHook}
        durationInFrames={POSTIZ_HOOK_DURATION}
        {...V}
      />
      <Composition
        id="postiz-02-prova"
        component={Scene02Prova}
        durationInFrames={PROVA_DURATION}
        {...V}
      />
      <Composition
        id="postiz-03-diferencial"
        component={Scene03Diferencial}
        durationInFrames={DIFERENCIAL_DURATION}
        {...V}
      />
      <Composition
        id="postiz-04-fila"
        component={Scene04Fila}
        durationInFrames={FILA_DURATION}
        {...V}
      />
      <Composition
        id="postiz-05-calendario"
        component={Scene05Calendario}
        durationInFrames={CALENDARIO_DURATION}
        {...V}
      />
      <Composition
        id="postiz-06-payoff"
        component={Scene06Payoff}
        durationInFrames={PAYOFF_DURATION}
        {...V}
      />
      <Composition
        id="postiz-07-cta"
        component={PostizCta}
        durationInFrames={POSTIZ_CTA_DURATION}
        {...V}
      />
      {/* Insert de credibilidade — TESTE fundo branco (fora do master) */}
      <Composition
        id="postiz-08-producao"
        component={Scene08Producao}
        durationInFrames={PRODUCAO_DURATION}
        {...V}
      />
      <Composition
        id="postiz-09-muda-jogo"
        component={Scene09MudaJogo}
        durationInFrames={MUDAJOGO_DURATION}
        {...V}
      />

      {/* Vídeo: 5 plugins do Claude Code (réplica de formato do #0) */}
      <Composition
        id="5-plugins-master"
        component={PluginsMaster}
        durationInFrames={PLUGINS_MASTER_DURATION}
        {...V}
      />
      <Composition
        id="5-plugins-01-hook"
        component={PluginsHook}
        durationInFrames={PLUGINS_HOOK_DURATION}
        {...V}
      />
      <Composition
        id="5-plugins-02-ponytail"
        component={Scene02Ponytail}
        durationInFrames={PONYTAIL_DURATION}
        {...V}
      />
      <Composition
        id="5-plugins-03-code-review"
        component={Scene03CodeReview}
        durationInFrames={CODEREVIEW_DURATION}
        {...V}
      />
      <Composition
        id="5-plugins-04-claude-mem"
        component={Scene04ClaudeMem}
        durationInFrames={CLAUDEMEM_DURATION}
        {...V}
      />
      <Composition
        id="5-plugins-05-context7"
        component={Scene05Context7}
        durationInFrames={CONTEXT7_DURATION}
        {...V}
      />
      <Composition
        id="5-plugins-06-superpowers"
        component={Scene06Superpowers}
        durationInFrames={SUPERPOWERS_DURATION}
        {...V}
      />
      <Composition
        id="5-plugins-07-cta"
        component={PluginsCta}
        durationInFrames={PLUGINS_CTA_DURATION}
        {...V}
      />

      {/* Vídeo: as 4 regras que consertam o Claude (direção "mesa de papel") */}
      <Composition
        id="4-regras-master"
        component={RegrasMaster}
        durationInFrames={REGRAS_MASTER_DURATION}
        {...V}
      />
      <Composition
        id="4-regras-01-hook"
        component={RegrasHook}
        durationInFrames={REGRAS_HOOK_DURATION}
        {...V}
      />
      <Composition
        id="4-regras-02-regras"
        component={Scene02Regras}
        durationInFrames={REGRAS_DURATION}
        {...V}
      />
      <Composition
        id="4-regras-03-escala"
        component={Scene03Escala}
        durationInFrames={ESCALA_DURATION}
        {...V}
      />
      <Composition
        id="4-regras-04-dores"
        component={Scene04Dores}
        durationInFrames={DORES_DURATION}
        {...V}
      />
      <Composition
        id="4-regras-05-demo"
        component={Scene05Demo}
        durationInFrames={REGRAS_DEMO_DURATION}
        {...V}
      />
      <Composition
        id="4-regras-06-fosso"
        component={Scene06Fosso}
        durationInFrames={FOSSO_DURATION}
        {...V}
      />
      <Composition
        id="4-regras-07-cta"
        component={RegrasCta}
        durationInFrames={REGRAS_CTA_DURATION}
        {...V}
      />

      {/* Vídeo: o plugin que substituiu o administrativo (direção Liquid Glass) */}
      <Composition
        id="plugin-administrativo-master"
        component={AdminMaster}
        durationInFrames={ADMIN_MASTER_DURATION}
        {...V}
      />
      <Composition
        id="plugin-administrativo-01-hook"
        component={AdminHook}
        durationInFrames={ADMIN_HOOK_DURATION}
        {...V}
      />
      <Composition
        id="plugin-administrativo-02-prova"
        component={AdminProva}
        durationInFrames={ADMIN_PROVA_DURATION}
        {...V}
      />
      <Composition
        id="plugin-administrativo-03-escala"
        component={AdminEscala}
        durationInFrames={ADMIN_ESCALA_DURATION}
        {...V}
      />
      <Composition
        id="plugin-administrativo-04-tutorial"
        component={Scene04Tutorial}
        durationInFrames={TUTORIAL_DURATION}
        {...V}
      />
      <Composition
        id="plugin-administrativo-05-fosso"
        component={AdminFosso}
        durationInFrames={ADMIN_FOSSO_DURATION}
        {...V}
      />
      <Composition
        id="plugin-administrativo-06-cta"
        component={AdminCta}
        durationInFrames={ADMIN_CTA_DURATION}
        {...V}
      />

      {/* Vídeo: Meetily — a ata de reunião que roda no teu computador */}
      <Composition
        id="meetily-master"
        component={MeetilyMaster}
        durationInFrames={MEETILY_MASTER_DURATION}
        {...V}
      />
      <Composition
        id="meetily-01-hook"
        component={MeetilyHook}
        durationInFrames={MEETILY_HOOK_DURATION}
        {...V}
      />
      <Composition
        id="meetily-02-prova"
        component={MeetilyProva}
        durationInFrames={MEETILY_PROVA_DURATION}
        {...V}
      />
      <Composition
        id="meetily-03-local"
        component={Scene03Local}
        durationInFrames={LOCAL_DURATION}
        {...V}
      />
      <Composition
        id="meetily-04-tutorial"
        component={MeetilyTutorial}
        durationInFrames={MEETILY_TUTORIAL_DURATION}
        {...V}
      />
      <Composition
        id="meetily-05-fosso"
        component={MeetilyFosso}
        durationInFrames={MEETILY_FOSSO_DURATION}
        {...V}
      />
      <Composition
        id="meetily-06-cta"
        component={MeetilyCta}
        durationInFrames={MEETILY_CTA_DURATION}
        {...V}
      />

      {/* Vídeo: a skill que descobre o que o cliente pesquisa no Google */}
      <Composition
        id="skill-seo-master"
        component={SeoMaster}
        durationInFrames={SEO_MASTER_DURATION}
        {...V}
      />
      <Composition
        id="skill-seo-01-hook"
        component={SeoHook}
        durationInFrames={SEO_HOOK_DURATION}
        {...V}
      />
      <Composition
        id="skill-seo-02-relatorio"
        component={Scene02Relatorio}
        durationInFrames={RELATORIO_DURATION}
        {...V}
      />
      <Composition
        id="skill-seo-03-gera"
        component={Scene03Gera}
        durationInFrames={GERA_DURATION}
        {...V}
      />
      <Composition
        id="skill-seo-04-console"
        component={Scene04Console}
        durationInFrames={CONSOLE_DURATION}
        {...V}
      />
      <Composition
        id="skill-seo-05-instalar"
        component={Scene05Instalar}
        durationInFrames={INSTALAR_DURATION}
        {...V}
      />
      <Composition
        id="skill-seo-06-prova"
        component={SeoProva}
        durationInFrames={SEO_PROVA_DURATION}
        {...V}
      />
      <Composition
        id="skill-seo-07-cta"
        component={SeoCta}
        durationInFrames={SEO_CTA_DURATION}
        {...V}
      />
    </>
  );
};
