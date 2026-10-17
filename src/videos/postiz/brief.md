# Brief: Postiz — a IA que posta sozinha em todas as suas redes

Fonte: timestamped · Fala estimada: 44s (0:00→0:44, tempos reais) · Master: 55s (fala 44s ×1,2 → bloco de 55s; cenas loopáveis 04/05/07 absorvem a sobra) · Cenas: 7

Formato **descoberta → prova → diferencial → payoff → CTA**. Herda o sistema visual Claude (fundo escuro quente, coral/argila, creme, spark). O gancho é que a ferramenta é movida pelo **Claude** — então o coral é temático, não só estético.

**Decisão de layout — TODAS as cenas são `split-safe`, inclusive gancho e CTA.** Motivo (feedback real): o usuário mascara a metade de baixo do frame com a webcam 99% das vezes. Conteúdo informativo (texto, logos, cards) fica na **METADE DE CIMA** (y 60→900); o fundo (spark, gradiente, grade de pontos) preenche o frame inteiro para continuidade sob a máscara. Nenhum `fullscreen` — a impacto vem de push-in, glow e micro-shake dentro da faixa segura.

**Nota de roteiro (fala × tela):** no CTA a FALA diz comenta *"repo"*, mas a TELA diz comenta *"Post"*. Como a cena renderiza a TELA, a palavra-chave exibida é **POST**. Trocar é 1 string (`Scene07Cta`) caso o certo seja "repo".

| # | Trecho (resumo) | Conceito visual | Skill | Dur. | Loop | Layout |
|---|---|---|---|---|---|---|
| 01 | "Agora tem uma IA que posta e agenda em todas as suas redes sozinha… você pede, ela monta a semana inteira." TELA: DE GRAÇA. NO SEU PC. | Gancho: karaokê gigante "UMA IA QUE POSTA **SOZINHA**" (coral wipe + micro-shake), leque de logos das redes, punch "DE GRAÇA · NO SEU PC" com glow; SparkBurst do Claude atrás | cinematic-camera + motion-graphics | 5s | não | split-safe |
| 02 | "Eu construo sistema em produção, testo de verdade. Essa chama Postiz — 30 mil de olho nela no GitHub." | Reveal do wordmark **POSTIZ** com traço marca-texto coral; card GitHub com contador ★ 0→30.000 e partículas de estrela; selo "testo de verdade" | article-highlights | 7s | não | split-safe |
| 03 | "Agendar post tem várias, tipo o Buffer. **Mas** aqui você conversa com o Claude." | Comparação: chips cinzas "Buffer / agendadores" (mortos) → pivô "MAS" coral → logo do **Claude** (coral) acende + balão de chat "escreve meus posts da semana" digitando | motion-graphics | 5,5s | não | split-safe |
| 04 | "Você fala, ele escreve os post, joga tudo na fila pra publicar — e você não abre painel nenhum." | Mecanismo: painel de chat (você→Claude) gera 3 cards de post que **voam pra fila** de publicação que enche; selo "SEM ABRIR PAINEL · 0 cliques" | terminal-inserts + motion-graphics | 8,5s | sim | split-safe |
| 05 | "Um calendário só pro Insta, TikTok, YouTube, LinkedIn… tudo de um lugar. E n8n pluga direto." | Hub "1 CALENDÁRIO" no centro distribui posts para 4 logos de rede (BrandLogo) em ciclo; logo **n8n** conecta por linha tracejada animada "pluga direto" | motion-graphics | 10s | sim | split-safe |
| 06 | "E o melhor: roda no seu PC, de graça e sem limite. Código aberto. Botar pra rodar é o que eu faço no dia a dia." | Payoff impacto: "DE GRAÇA / SEM LIMITE" gigante coral; selos OPEN SOURCE · SELF-HOSTED · ∞ SEM LIMITE; mini-terminal `npx postiz` com pulso verde "rodando de verdade" | motion-graphics + terminal-inserts | 7s | não | split-safe |
| 07 | "Quer o link? Comenta 'repo' que eu mando no direct. E me segue." TELA: comenta "Post" | CTA: "COMENTA" cinético + **POST** gigante coral com glow pulsante e câmera respirando; pílulas LINK NO DIRECT · ME SEGUE; SparkBurst atrás | cinematic-camera + motion-graphics | 5,5s | sim | split-safe |

No master, a sobra (55s − 47,5s) é absorvida pelas cenas loopáveis: 04 (+45f), 05 (+90f), 07 (+60f).

## Cena 01 — Hook (PRIORIDADE MÁXIMA)

Fundo escuro quente (#171310), câmera já em push-in no frame 0 (nunca estática). **3 estímulos simultâneos no primeiro frame:** (1) "UMA IA QUE POSTA" começando a estourar palavra a palavra, (2) SparkBurst do Claude pulsando atrás (metade de cima), (3) grade de pontos deslizando em paralaxe no frame inteiro. Beat 1 (0–1,8s): karaokê "UMA IA QUE POSTA" em Fraunces creme gigante, coral varrendo por baixo; então **"SOZINHA"** carimba enorme em coral com flare do SparkBurst + micro-shake. Beat 2 (1,8–3,2s): "em TODAS as suas redes" com um leque de 4 chips de logo (Insta·TikTok·YouTube·LinkedIn) abrindo com stagger. Beat 3 (3,2–5s): o punch da TELA — "DE GRAÇA · NO SEU PC" carimba, "DE GRAÇA" coral com glow pulsante. Pacing mais rápido do vídeo: ~1,2s por beat. Tudo na metade de cima; spark/gradiente sangram no frame todo.

## Cena 02 — Prova (Postiz + 30k GitHub)

Split-safe. Header POSTIZ. Sobrancelha "EU TESTO DE VERDADE" em coral. Wordmark **POSTIZ** (Fraunces) entra e um traço marca-texto coral (estilo rough) varre por trás. Abaixo, um card GitHub: logo do GitHub (creme) + ★ pulsando + contador subindo 0 → **30.000** com leve overshoot, "de olho no repo" e partículas de estrela subindo. Rodapé "código aberto · testado em produção". Contador é one-shot (não loopa).

## Cena 03 — Diferencial (conversa com o Claude)

Split-safe. Header POSTIZ · "O DIFERENCIAL". Linha de cima: "AGENDAR POST? TEM VÁRIAS" com um chip **Buffer** e dois chips genéricos cinzas/mortos (sem brilho). Um **"MAS"** coral gigante faz o pivô (wipe). Então o logo do **Claude** (coral) escala com micro-spark e um balão de chat digita `escreve meus posts da semana →` — a diferença é conversar, não preencher painel. Não loopa (tem pivô de estado).

## Cena 04 — Fila (mecanismo, loopável)

Split-safe. Header POSTIZ · "SEM PAINEL". À esquerda, um mini-painel de chat: linha do usuário `monta minha semana` → Claude responde gerando 3 mini-cards de post (com textinho). Cada card gerado **voa** para uma coluna de FILA à direita (slots Seg/Ter/Qua…) que vai enchendo com ✓ "agendado". Selo carimba "SEM ABRIR PAINEL · 0 cliques". O ciclo gerar→enfileirar loopa sem emenda para absorver a sobra do master.

## Cena 05 — Calendário multi-rede (loopável)

Split-safe. Header POSTIZ · "UM SÓ LUGAR". Um hub central "1 CALENDÁRIO" pulsa; dele saem mini-posts que viajam por linhas até 4 nós de rede com os **BrandLogos** (Instagram, TikTok, YouTube, LinkedIn), cada um acendendo com ✓ ao receber. Em ciclo (loop). Embaixo, o logo do **n8n** conecta por uma linha tracejada animada com o rótulo "automação · pluga direto". Distribuição loopa.

## Cena 06 — Payoff (grátis + open source)

Split-safe. Header POSTIZ · "O MELHOR". Sobrancelha "A VERSÃO NO SEU PC". "DE GRAÇA" gigante coral com glow + "SEM LIMITE" ao lado (∞). Três selos entram com stagger: OPEN SOURCE · SELF-HOSTED · SEM LIMITE. Um mini-terminal com `> npx postiz` e um dot verde pulsando "rodando de verdade" reforça a credibilidade (faço isso no dia a dia). Impacto one-shot.

## Cena 07 — CTA "Comenta POST" (loopável)

Split-safe. "COMENTA" cinético creme no topo; **POST** gigante em Fraunces coral com glow pulsante e push-in/out de câmera respirando; duas pílulas entram com stagger — LINK NO DIRECT · ME SEGUE; "pra não perder as próximas" em linha menor; SparkBurst do Claude cintilando ao fundo (frame inteiro). O pulso do "POST" fecha o ciclo para loop.
