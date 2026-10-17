# Pipeline Transcrição → Motion Graphics — Design

**Data:** 2026-07-22
**Status:** Aprovado pelo usuário (abordagem C — híbrida)

## Objetivo

O usuário cola a transcrição de um vídeo curto (40s–1min, vertical, sobre Claude Code/IA/tecnologia) em qualquer sessão de Claude Code aberta em `motion-graphics/` e, **sem nenhuma pergunta intermediária**, recebe:

1. `out/<slug>/master.mp4` — vídeo completo 1080×1920 com todos os motion graphics sequenciados na duração total + margem de segurança
2. `out/<slug>/clips/*.mp4` — cada cena renderizada separadamente para montagem livre no editor

O usuário compõe no editor de vídeo dele (webcam embaixo / graphic em cima, ou graphic fullscreen). O Remotion **não** compõe a webcam.

## Contexto

- Projeto Remotion 4.0.496 (blank, React 19) em `MotionSkills/motion-graphics/`, repo git próprio
- 14 skills instaladas em `.claude/skills/`: 4 de motion graphics (`motion-graphics`, `cinematic-camera`, `terminal-inserts`, `article-highlights`) + 10 oficiais (`remotion-*`, `mediabunny`)
- Já existe uma composição `ClaudeCowork` (teste anterior do usuário) registrada em `src/Root.tsx` — **deve ser preservada como está**; vídeos novos seguem a convenção nova
- Workspace orquestrado via Maestri (canvas com terminais de agentes)

## Decisões aprovadas

| Decisão | Escolha |
|---|---|
| Saída | Composições por cena + master; master.mp4 renderizado automaticamente sempre |
| Transcrição | Auto-detectar: timestamps (SRT/VTT/Whisper/CapCut) → tempos reais; texto puro → estimativa ~150 palavras/min (PT-BR) |
| Formato | Sempre 1080×1920 @ 30fps |
| Margem de segurança | Cena = tempo do trecho +20% (mín. 3s); master = total estimado ×1.2, arredondado p/ cima em blocos de 5s; excedente preenchido por cenas loopáveis |
| Automação | 100% automática, zero checkpoints |
| Organização | Projeto único; um vídeo = uma pasta `src/videos/<slug>/` |
| Idiomas | SKILL.md e CLAUDE.md em inglês (convenção agent-facing); `brief.md` gerado em PT-BR (leitura do usuário) |

## Componente 1 — Skill `transcript-to-motion`

Local: `.claude/skills/transcript-to-motion/SKILL.md`. É a skill de **prompt engineering**: transforma transcrição crua em roteiro de cenas estruturado ANTES de qualquer código.

**Responsabilidades:**

1. **Detecção de formato** — timestamps presentes → usar tempos reais; texto puro → estimar por contagem de palavras (150 wpm)
2. **Segmentação** — dividir a transcrição em momentos-chave (tipicamente 3–8 cenas para 1 min); cada cena cobre um trecho contíguo da fala
3. **Mapeamento trecho → skill de formato:**
   - CLI, comandos, Claude Code executando, agentes rodando, instalações → `terminal-inserts`
   - Notícia, release, lançamento, artigo, dado, estatística → `article-highlights`
   - Conceito, comparação, diagrama, texto de impacto → `motion-graphics` (kinetic text / diagramas)
   - Hook de abertura e transições entre cenas → tratamento `cinematic-camera`
4. **Cálculo de duração** com margem (regra da tabela acima) e marcação de quais cenas são loopáveis
5. **Layout** — toda cena é 1080×1920; cenas destinadas ao split são marcadas `split-safe`: conteúdo crítico na metade superior do quadro
6. **Saída:** `src/videos/<slug>/brief.md` — tabela: nº, trecho da fala, conceito visual, skill, duração, loop (s/n), layout (fullscreen/split-safe). O brief é o prompt refinado que orienta a geração das cenas.

### Regras de retenção (parte integrante da skill)

Vídeos são para redes sociais de formato curto — audiência com atenção fragmentada. Regras obrigatórias que o brief impõe a toda cena:

- **Movimento constante:** nenhum frame estático. Beat visual a cada 1.5–2s (algo novo entra, anima, transforma ou sai). Câmera sempre com drift/travel sutil mesmo em "repouso"
- **Cor e contraste:** acentos vibrantes sobre fundos escuros; keywords com destaque colorido (highlight, glow, sublinhado animado)
- **Hierarquia de hook:** a cena 01 (hook, primeiros 1–3s da fala) é a mais importante do vídeo — recebe o maior investimento: tratamento `cinematic-camera`, kinetic text grande, ritmo mais rápido do vídeo. As demais cenas servem à retenção; o hook serve à captura. O brief deve marcar o hook explicitamente e descrevê-lo com mais detalhe que as outras cenas

## Componente 2 — `CLAUDE.md` do projeto (gatilho automático)

Local: `motion-graphics/CLAUDE.md`. Regra de ouro no topo:

> Se o usuário colar conteúdo que pareça transcrição de vídeo (SRT/VTT, linhas com timestamps, ou texto corrido de fala em PT-BR), NÃO pergunte nada. Execute a pipeline completa: slug → skill `transcript-to-motion` → construir cenas → registrar composições → lint → renderizar master + clipes → reportar caminhos dos MP4s.

Também documenta: convenções de estrutura/nomes, formato 1080×1920@30fps, comandos de render, regra de preservação do `ClaudeCowork`, e aponta para as skills de formato.

## Componente 3 — Estrutura por vídeo

```
src/videos/<slug>/
  brief.md              ← roteiro de cenas gerado pela skill
  Master.tsx            ← composição <slug>-master (sequência completa)
  scenes/Scene01Hook.tsx, Scene02*.tsx…  ← composição <slug>-01-hook, <slug>-02-*…
out/<slug>/
  master.mp4
  clips/01-hook.mp4, 02-*.mp4…
```

- `src/Root.tsx` registra as composições de cada vídeo (import por pasta); `ClaudeCowork` permanece registrado
- Slug derivado do tema da transcrição (kebab-case, curto)

## Componente 4 — Render e QA (automático)

1. `npm run lint` (eslint + tsc) antes de qualquer render — falhou, corrige antes de renderizar
2. `npx remotion render <slug>-master out/<slug>/master.mp4` + um render por cena em `out/<slug>/clips/`
3. Se uma cena falhar no render: renderizar as demais, reportar a falha no final (não abortar o lote)
4. Verificação final: duração do master ≥ total estimado da fala + margem; reportar tabela de saídas com caminhos e durações

## Componente 5 — Camada Maestri

- **Construção (agora):** terminais criados via maestro no canvas — **Skill-Writer** (escreve `transcript-to-motion`) e **Pipeline-Builder** (CLAUDE.md + convenções + Root.tsx), em paralelo; o maestro coordena e integra
- **Validação:** teste end-to-end com transcrição de exemplo (~40s sobre Claude Code) até gerar MP4s reais
- **Produção (depois):** terminal **Produtor** fica aberto em `motion-graphics/` no canvas como porta de entrada; colar a transcrição nele executa a mesma pipeline que qualquer Claude Code executaria — Maestri é conveniência, não dependência

## Tratamento de erros

- Transcrição ambígua (não parece fala nem tem timestamps): ainda assim tratar como texto puro e seguir — a regra é não perguntar
- Falha de lint: corrigir e re-rodar até passar antes de renderizar
- Falha de render de cena individual: continuar o lote, reportar ao final
- Falha de render do master: reportar imediatamente com o erro (é o artefato principal)

## Teste de aceitação

Colar uma transcrição de exemplo em PT-BR (~40s, tema Claude Code) numa sessão limpa e verificar, sem nenhuma interação extra:

1. `brief.md` criado com cenas, durações com margem, hook marcado e regras de retenção aplicadas
2. Composições registradas e visíveis no `npx remotion studio`
3. `out/<slug>/master.mp4` e `out/<slug>/clips/*.mp4` existem, 1080×1920, duração do master ≥ estimado + margem

## Fora de escopo (YAGNI)

- Migrar `ClaudeCowork` para a convenção nova
- Composição da webcam no Remotion (fica no editor do usuário)
- Upload/publicação automática nas redes
- TTS, legendas queimadas ou sincronização por fonema
- O "agente melhorador de skills" (projeto futuro separado — este design apenas mantém as skills versionadas para viabilizá-lo)
