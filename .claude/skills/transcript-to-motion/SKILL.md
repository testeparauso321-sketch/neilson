---
name: transcript-to-motion
description: Transform a raw video transcription (PT-BR, with or without timestamps) into a structured scene brief (brief.md) that drives fully-automatic Remotion motion-graphics generation for short-form vertical videos. Use whenever the user pastes a video transcription or asks for graphics for a video script.
metadata:
  tags: remotion, prompt-engineering, transcription, short-form, retention, vertical-video
---

# Transcript to Motion

Prompt-engineering layer of the transcript → motion-graphics pipeline. Input: a raw transcription pasted by the user. Output: `src/videos/<slug>/brief.md` — a structured scene brief that downstream generation follows exactly. Never ask the user questions; make every decision here.

## 1. Input detection

- Arquivo com cabeçalho `Fonte: corte aprovado (EditorClaude)` (gerado pelo `prepare_motion_handoff.py`) → **handoff**: blocos `m:ss.s → m:ss.s` com tempos REAIS do corte final, marcadores `TELA:` e seção `## Divergências` (presente só quando houve copy). Cada `TELA:` pertence ao bloco imediatamente ACIMA dele — o texto em tela aparece durante aquele bloco. Tem precedência sobre a detecção timestamped comum.
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

**Quando a fonte é handoff, os tempos são EXATOS — as regras de estimativa
não se aplicam:**
- Sem 150wpm, sem +20%, sem arredondar master para blocos de 5s: master =
  duração exata do corte; cada cena = soma exata dos seus blocos.
- Fronteira de cena SÓ em fronteira de bloco do handoff (o bloco é a menor
  unidade; 3–8 cenas continuam valendo).
- O texto do handoff é o que o usuário realmente FALOU (a seção Divergências
  só marca onde a copy não bateu) — usar como está, nunca "corrigir" de
  volta para a copy.
- `brief.md` registra `Fonte: handoff (corte aprovado <slug>)`.
- Cenas Loop continuam permitidas, mas não existe sobra de master a absorver.
- **Cauda de segurança nos CLIPES (regra desde 2026-08-06):** cada clipe
  individual renderiza com **+30 frames segurando o estado final** (animações
  com clamp; nenhuma animação nova). O master permanece exato. Motivo: o
  composer ancora cena por PALAVRA na timeline e o drift pode deixar a seção
  até ~0.6s maior que o bloco — sem cauda, o fim do clipe vira tela preta
  (visto no skill-seo: cenas 03/04/06 com +0.13/+0.38/+0.55s). Sobra é
  descartada no fatiamento; falta não tem conserto.

## 5. Retention rules (mandatory, short-form social video)

The audience is dopamine-driven; static frames kill retention.

- **Constant motion:** no static frames, ever. A visual beat (something enters, animates, transforms or exits) every 1.5–2s. Camera always has subtle drift/travel even "at rest".
- **Color & contrast:** vibrant accents on dark backgrounds; highlight keywords with animated color (glow, highlighter stroke, animated underline).
- **Hook hierarchy:** scene 01 (first 1–3s of speech) is the single most important scene of the video. It gets: `cinematic-camera` treatment, the largest kinetic text, the fastest pacing in the video, and the most detailed description in the brief. Other scenes retain; the hook captures.

## 6. Layout

Everything renders 1080×1920 @ 30fps. **`split-safe` is the DEFAULT layout for every scene — not the exception.** Reason (real user feedback): the user masks the bottom half of the frame in editing — their webcam occupies the bottom half 99% of the time.

- ALL informational content (text, logos, cards, terminals, diagrams) must sit in the TOP HALF of the frame: y between 0 and 960 of the 1080×1920 frame, with a ~48px safety margin from the frame edges and from the midline (y=960).
- The BACKGROUND (color, gradient, ambient particles) may fill the entire frame — it keeps visual continuity under the user's mask.
- `fullscreen` is a rare exception, reserved for impact moments (typically the hook). The brief must justify every `fullscreen` use.

## 6b. Brand logos

While segmenting, detect spoken mentions of brands/apps and record them in the brief's "Conceito visual" column using the canonical names from the `src/logos/` registry. Spoken PT-BR aliases → canonical name:

- cloud, claude, cloud code → `claude`
- gpt, chat gpt → `openai`
- gemini, gêmini → `gemini`
- other obvious ones: youtube, github, reddit, x/twitter, hacker news, tiktok, instagram, n8n, vercel, supabase, notion, cursor, anthropic

Scenes must use the `BrandLogo` component instead of drawing or writing the brand name whenever the logo exists in the registry.

## 7. Output: brief.md

Write `src/videos/<slug>/brief.md` (PT-BR, the user reads this). Slug: short kebab-case from the video topic. Format:

```markdown
# Brief: <título curto>

Fonte: <timestamped|plain|handoff (corte aprovado <slug>)> · Fala estimada: <N>s · Master: <M>s · Cenas: <K>

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
