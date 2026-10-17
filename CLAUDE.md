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
- `split-safe` is the DEFAULT for every scene: informational content only in the TOP HALF of the frame (the background may fill the whole frame); `fullscreen` is a rare exception the brief must justify.
