# Transcript → Motion Graphics Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Colar uma transcrição de vídeo em qualquer Claude Code aberto em `motion-graphics/` gera automaticamente (zero perguntas) `out/<slug>/master.mp4` + `out/<slug>/clips/*.mp4` em 1080×1920@30fps.

**Architecture:** Uma skill de prompt engineering (`transcript-to-motion`) converte transcrição → `brief.md` (roteiro de cenas com regras de retenção); um `CLAUDE.md` no projeto dispara a pipeline automaticamente e define convenções; as 4 skills de formato já instaladas (`motion-graphics`, `cinematic-camera`, `terminal-inserts`, `article-highlights`) geram as cenas. Spec: `docs/superpowers/specs/2026-07-22-transcript-to-motion-pipeline-design.md`.

**Tech Stack:** Remotion 4.0.496, React 19, TypeScript, skills Claude Code (markdown).

**Divisão Maestri:** Task 1 → terminal *Skill-Writer* · Task 2 → terminal *Pipeline-Builder* (paralelo com Task 1) · Task 3 → terminal *Produtor* (após 1 e 2) · Task 4 → maestro.

---

### Task 1: Skill `transcript-to-motion`

**Files:**
- Create: `.claude/skills/transcript-to-motion/SKILL.md`

- [ ] **Step 1: Escrever o SKILL.md com exatamente este conteúdo**

````markdown
---
name: transcript-to-motion
description: Transform a raw video transcription (PT-BR, with or without timestamps) into a structured scene brief (brief.md) that drives fully-automatic Remotion motion-graphics generation for short-form vertical videos. Use whenever the user pastes a video transcription or asks for graphics for a video script.
metadata:
  tags: remotion, prompt-engineering, transcription, short-form, retention, vertical-video
---

# Transcript to Motion

Prompt-engineering layer of the transcript → motion-graphics pipeline. Input: a raw transcription pasted by the user. Output: `src/videos/<slug>/brief.md` — a structured scene brief that downstream generation follows exactly. Never ask the user questions; make every decision here.

## 1. Input detection

- Lines like `00:19`, `[00:19]`, SRT/VTT cues → **timestamped**: use real times for each block.
- Plain prose → **plain**: estimate duration by word count at **150 words/min PT-BR** (2.5 words/s).
- Mixed (some blocks stamped): use real times where present, estimate inside blocks by word share.
- Anything ambiguous: treat as plain text and proceed. Never stop to ask.

## 2. Segmentation

Split the speech into 3–8 contiguous scenes (for ~1 min of video). Cut on idea boundaries: hook, problem, mechanism, proof/demo, how-to, CTA. Every second of speech belongs to exactly one scene.

## 3. Scene → format-skill mapping

| Speech content | Skill to use for the scene |
|---|---|
| CLI, commands, Claude Code running, agents executing, installs | `terminal-inserts` |
| News, releases, launches, articles, stats, star counts, numbers | `article-highlights` |
| Concepts, comparisons, diagrams, impact statements, lists | `motion-graphics` (kinetic text / diagrams) |
| Opening hook + all scene transitions | `cinematic-camera` treatment on top |

## 4. Duration & safety margin

- Scene duration = speech time of its excerpt **+20%**, minimum 3s.
- Master duration = estimated total ×1.2, rounded UP to the next 5s block.
- Mark loopable scenes (ambient diagrams, terminals ticking) — they absorb any leftover master time with seamless loops.

## 5. Retention rules (mandatory, short-form social video)

The audience is dopamine-driven; static frames kill retention.

- **Constant motion:** no static frames, ever. A visual beat (something enters, animates, transforms or exits) every 1.5–2s. Camera always has subtle drift/travel even "at rest".
- **Color & contrast:** vibrant accents on dark backgrounds; highlight keywords with animated color (glow, highlighter stroke, animated underline).
- **Hook hierarchy:** scene 01 (first 1–3s of speech) is the single most important scene of the video. It gets: `cinematic-camera` treatment, the largest kinetic text, the fastest pacing in the video, and the most detailed description in the brief. Other scenes retain; the hook captures.

## 6. Layout

Everything renders 1080×1920 @ 30fps. Scenes likely to be used in the user's split-screen edit (webcam bottom half) are marked `split-safe`: all critical content in the TOP HALF of the frame. Full-impact scenes (hook, CTA) are `fullscreen`: content may use the whole frame, keeping 96px margins.

## 7. Output: brief.md

Write `src/videos/<slug>/brief.md` (PT-BR, the user reads this). Slug: short kebab-case from the video topic. Format:

```markdown
# Brief: <título curto>

Fonte: <timestamped|plain> · Fala estimada: <N>s · Master: <M>s · Cenas: <K>

| # | Trecho (resumo) | Conceito visual | Skill | Dur. | Loop | Layout |
|---|---|---|---|---|---|---|
| 01 | "Esse repositório faz..." | <descrição detalhada do hook> | cinematic-camera + motion-graphics | 6s | não | fullscreen |
| 02 | ... | ... | terminal-inserts | 12s | sim | split-safe |

## Cena 01 — Hook (PRIORIDADE MÁXIMA)
<2–4 frases: elementos, movimento de câmera, beats visuais, cores>

## Cena 02 — <nome>
<1–2 frases por cena: elementos, beats, cores>
```

## 8. Handoff

After writing brief.md, generation follows it scene by scene using the mapped skills plus `remotion-best-practices`. The brief is the contract: durations, layouts and retention rules in it are non-negotiable downstream.
````

- [ ] **Step 2: Verificar estrutura**

Run: `head -8 .claude/skills/transcript-to-motion/SKILL.md`
Expected: frontmatter com `name: transcript-to-motion` e `description:` não vazio.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/transcript-to-motion/
git commit -m "feat: skill transcript-to-motion (prompt engineering + retenção)"
```

---

### Task 2: `CLAUDE.md` do projeto + pasta de vídeos

**Files:**
- Create: `CLAUDE.md`
- Create: `src/videos/.gitkeep`

- [ ] **Step 1: Escrever CLAUDE.md com exatamente este conteúdo**

````markdown
# Motion Graphics Factory

Remotion project that turns video transcriptions into short-form vertical motion graphics for the user's social videos (Claude Code / AI / tech topics).

## GOLDEN RULE — automatic pipeline

If the user pastes content that looks like a video transcription (SRT/VTT, timestamped lines like `00:19`, or continuous PT-BR spoken prose), DO NOT ask anything. Run the full pipeline:

1. Derive a short kebab-case `<slug>` from the topic.
2. Invoke the `transcript-to-motion` skill → produces `src/videos/<slug>/brief.md`.
3. Build every scene in `src/videos/<slug>/scenes/` following the brief exactly, using the mapped skills (`motion-graphics`, `cinematic-camera`, `terminal-inserts`, `article-highlights`) + `remotion-best-practices`.
4. Build `src/videos/<slug>/Master.tsx` sequencing all scenes to the brief's master duration.
5. Register compositions in `src/Root.tsx` (see conventions). NEVER remove existing registrations (e.g. `ClaudeCowork`).
6. `npm run lint` — fix until clean before rendering.
7. Render: master first, then every clip (see commands). If one clip fails, render the rest and report failures at the end.
8. Report a table: composition, file path, duration, resolution.

## Conventions

- Format: **1080×1920 @ 30fps**, always.
- One video = one folder: `src/videos/<slug>/` (`brief.md`, `Master.tsx`, `scenes/Scene01Hook.tsx`, `Scene02*.tsx`, …).
- Composition ids: `<slug>-master`, `<slug>-01-hook`, `<slug>-02-<name>`, …
- Renders go to `out/<slug>/master.mp4` and `out/<slug>/clips/<nn>-<name>.mp4` (`out/` is gitignored).
- Commit generated code (scenes, Master, brief.md) after a successful render.

## Commands

```bash
npm run lint                                              # eslint + tsc — must pass before rendering
npx remotion render <slug>-master out/<slug>/master.mp4   # master (always rendered)
npx remotion render <slug>-01-hook out/<slug>/clips/01-hook.mp4
npx remotion studio                                       # preview
```

## Quality bar (see transcript-to-motion skill for full rules)

- No static frames — visual beat every 1.5–2s, camera always drifting.
- Vibrant color accents on dark backgrounds; animated keyword highlights.
- Scene 01 (hook) is the most important scene of the video — biggest craft investment.
- `split-safe` scenes keep critical content in the top half of the frame.
````

- [ ] **Step 2: Criar a pasta de vídeos**

```bash
mkdir -p src/videos && touch src/videos/.gitkeep
```

- [ ] **Step 3: Verificar**

Run: `head -5 CLAUDE.md && ls src/videos/`
Expected: título "Motion Graphics Factory"; `.gitkeep` listado.

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md src/videos/.gitkeep
git commit -m "feat: CLAUDE.md com pipeline automática + convenções"
```

---

### Task 3: Teste de aceitação end-to-end (vídeo "ultimos-30-dias")

**Files:**
- Read: `docs/superpowers/test-data/transcricao-ultimos-30-dias.md`
- Create: `src/videos/ultimos-30-dias/**` (brief, Master, cenas)
- Modify: `src/Root.tsx` (adicionar registros; preservar `ClaudeCowork`)

- [ ] **Step 1: Executar a pipeline como usuário real** — abrir a transcrição do arquivo de teste e segui-la EXATAMENTE como o CLAUDE.md manda (invocar `transcript-to-motion`, gerar brief, cenas, master, registrar, lint). A transcrição é timestamped (blocos 00:00 e 00:19); esperar ~5–7 cenas, hook sobre "seu Claude melhor que o de todo mundo", cenas de terminal (pesquisa simultânea Reddit/X/YouTube/HN), article-highlights (40 mil estrelas, upvotes/views/Polymarket), how-to (copiar link → colar no Claude), CTA ("comenta 30").

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: exit 0 (corrigir até passar).

- [ ] **Step 3: Renderizar master + clipes**

```bash
npx remotion render ultimos-30-dias-master out/ultimos-30-dias/master.mp4
# + um render por cena em out/ultimos-30-dias/clips/<nn>-<name>.mp4
```

- [ ] **Step 4: Verificar critérios de aceitação**

Run: `npx remotion ffprobe out/ultimos-30-dias/master.mp4 2>&1 | grep -E "Duration|1080x1920" && ls out/ultimos-30-dias/clips/`
Expected: resolução 1080x1920; duração do master ≥ total estimado da fala ×1.2 (calcular do brief; ballpark 60–85s); ≥3 clipes presentes.

- [ ] **Step 5: Commit (código apenas; `out/` é gitignored)**

```bash
git add src/videos/ultimos-30-dias/ src/Root.tsx
git commit -m "feat: vídeo ultimos-30-dias — primeiro E2E da pipeline"
```

---

### Task 4: Encerramento (maestro)

- [ ] **Step 1:** Revisar brief e MP4s contra as regras de retenção (movimento constante, cor, hook forte) — anotar desvios como melhorias futuras das skills.
- [ ] **Step 2:** Reportar ao usuário a tabela final de saídas + como usar a pipeline no dia a dia (colar transcrição em Claude Code na pasta OU no terminal Produtor do Maestri).
- [ ] **Step 3:** Atualizar memória do projeto (pipeline pronta, convenções, terminal Produtor).
