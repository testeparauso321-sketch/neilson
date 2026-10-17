# Brief: A skill que descobre o que o cliente pesquisa no Google

Fonte: handoff (corte aprovado 0508) · Fala: 39,3s · Master: 39,3s (1179f) · Cenas: 7

Handoff: `~/development/EditorClaude/output/handoff_0508.md` — 15 blocos, corte de
39,3s, **Copy: NENHUMA** (texto 100% ASR). Tempos EXATOS do corte: sem estimativa
de 150 wpm, sem folga de +20%, master = duração exata do corte. Toda fronteira de
cena cai em fronteira de bloco.

**Direção de arte: LIQUID GLASS (iOS 26 / macOS Tahoe)** — a mesma de `meetily` e
`plugin-administrativo`. Preto absoluto (#000000), painéis de vidro com refração
de borda, specular varrendo, coral (#D97757) como acento único. Geist + Geist
Mono. Fundo sempre líquido (`feTurbulence` + `feDisplacementMap`). Ver `theme.ts`
e `glass.tsx` (a cópia com o fix do `contentStyle`).

**Assinatura visual deste vídeo: a BUSCA.** A pergunta que uma pessoa de verdade
digita é o fio condutor — nasce sendo digitada no gancho, empilha como linha com
volume no relatório, alimenta o gerador de posts, mora dentro do painel e volta
no FAQ. Módulo próprio: `search.tsx` (`SearchField`, `QueryRow`, `Magnifier`,
`Cursor`, `Label`).

## Decisões de linguagem (público = dono de negócio, não técnico)

| Regra | Como foi aplicada |
|---|---|
| Keyword de tela = resultado de negócio, nunca jargão | Na tela só entra *cliente, seu site, concorrente, ideias de posts, perguntas, grátis*. Nenhum "SEO", "keyword", "ranking", "indexação", "prompt". |
| Marca com logo no registro entra como logo, não como texto | `BrandLogo name="claude"` nas cenas 03, 05 e 07. Google/Search Console não estão no registro → aparecem como texto do painel. |
| Nome de cliente nunca aparece (regra dura do vault) | O exemplo é o segmento falado ("cozinha planejada"), sem empresa nenhuma. |
| Nenhuma promessa sem prova | A cena 06 é o teste que o Luiz mesmo fez — comparação sem número inventado. |
| Identidade | `@luizbessa.ia` no CTA. |

O número **2 mil** (cena 02) é o único dado numérico do vídeo e vem da fala. Ele
vive na constante `DESTAQUE` de `Scene02Relatorio.tsx`.

## Tabela de cenas

| # | Trecho (blocos) | Conceito visual | Skill | Dur. | Loop | Layout |
|---|---|---|---|---|---|---|
| 01 | 1–2 · "Agora o Claude descobre o que o seu cliente pesquisa no Google / cria posts pra ele ficar no seu site e não no do concorrente" | Buscas de gente real sendo digitadas em rajada; a faísca puxa; corte para os dois sites e o fluxo troca de lado | cinematic-camera + motion-graphics | 159f · 5,3s | não | split-safe |
| 02 | 3 · "Tudo fica em um relatório… pesquisaram quanto custa uma cozinha planejada mais de 2 mil vezes" | Janela RELATÓRIO com 4 linhas de busca + barra de volume; a linha do exemplo acende e o número conta até passar de 2 mil | article-highlights | 129f · 4,3s | não | split-safe |
| 03 | 4–6 · "A skill vai pegar esse relatório e gerar 30 ideias de posts… e além disso um FAQ pro seu site sair melhor nas procuras" | Relatório é sugado pela faísca → grade de 30 cartões de post (contador 1→30) → cartão de FAQ abrindo → lista de procura em que o site sobe pro 1º | motion-graphics | 246f · 8,2s | não | split-safe |
| 04 | 7–8 · "Esse relatório vem do Search Console, um painel grátis do Google… ela te ajuda a ter acesso" | Painel SEARCH CONSOLE se montando (curva desenhando + linhas de busca), carimbo GRÁTIS, cadeado abrindo com checklist de acesso | motion-graphics + article-highlights | 162f · 5,4s | não | split-safe |
| 05 | 9 · "pra baixar essa skill você só precisa colar o link dela no Claude Code e pedir para instalar" | Terminal de vidro: link colado, pedido digitado em português, barra de instalação e ✓ instalada | terminal-inserts | 111f · 3,7s | não | split-safe |
| 06 | 10–12 · "Eu mesmo baixei e testei. Sem a skill o Claude solta dicas nada a ver; com ela os resultados são muito mais completos" | Selo EU MESMO TESTEI montando de cacos → cartão SEM (dicas genéricas riscadas) → cartão COM (itens reais em coral) | motion-graphics | 192f · 6,4s | não | split-safe |
| 07 | 13–15 · "Comentem a palavra PERGUNTAS / eu mando o link no privado / me segue, todo dia uma dica de Claude Code" | Campo de comentário digitando PERGUNTAS, a palavra salta e estilhaça o campo, dois chips de entrega, handle + dica diária | motion-graphics | 180f · 6,0s | não | split-safe |

**Total: 1179 frames = 39,3s @ 30fps — igual ao corte, frame a frame.**

Mapa de tempo (frames absolutos = tempos do handoff × 30):
01 `0–159` (0:00,0–0:05,3) · 02 `159–288` (0:05,3–0:09,6) ·
03 `288–534` (0:09,6–0:17,8) · 04 `534–696` (0:17,8–0:23,2) ·
05 `696–807` (0:23,2–0:26,9) · 06 `807–999` (0:26,9–0:33,3) ·
07 `999–1179` (0:33,3–0:39,3).

## Cena 01 — Hook (PRIORIDADE MÁXIMA · 159f)

Duas metades, corte seco no meio (f84 = fronteira do bloco 1 → 2), zero respiro.

**Metade A (f0–f84) — o que ele pesquisa.** No frame 0 já tem gente digitando: o
campo de busca de vidro está vivo e três perguntas de verdade se escrevem em
rajada ("quanto custa uma cozinha planejada", "vale a pena cozinha planejada",
"cozinha planejada em quanto tempo fica pronta"), cada uma trocando com flash e
chroma split. A faísca do Claude (`BrandLogo`, canto superior
esquerdo) **puxa cada busca**: assim que a frase fecha, ela descola do campo como
um chip de vidro, faz um arco e some dentro da faísca, que esquenta. Em **f52**
carimba a linha display **O QUE O SEU CLIENTE** (branco, 70px) + **PESQUISA**
(coral, 104px, com chroma split), palavra a palavra em mola bouncy, com flash +
shake. Câmera em push-in 1,22 → 1,02, fundo em `energy: 2`.

**Metade B (f84–f159) — pra onde vai o clique.** Corte: o campo encolhe pro topo
e entram dois cartões — **CONCORRENTE** (à esquerda, cinza) e **SEU SITE** (à
direita). O fluxo de pontinhos que sai do campo cai no concorrente até **f108**,
quando a corrente vira: os pontos redirecionam pro seu site, o cartão do
concorrente apaga e leva uma risca coral. Em **f120** estampa **NO SEU SITE** em
coral com halo pulsando. Impactos de câmera em f52, f84, f108 e f120.

## Cena 02 — O relatório (129f)

Janela de vidro **RELATÓRIO** com cabeçalho "o que perguntaram · vezes". Quatro
linhas entram em stagger (f6/f16/f26/f36), cada uma com a barra de volume
crescendo. Em **f52** um scanner coral desce e trava na linha do exemplo:
`quanto custa uma cozinha planejada` acende, escala e o número conta de 0 até
passar de 2 mil (f52→f88, `fontVariantNumeric: tabular-nums`). Fecho em f96 com
o chip **MAIS DE 2 MIL VEZES** em coral. Câmera com push suave e deriva.

## Cena 03 — O que a skill gera (246f)

Três batidas encadeadas, cada uma comendo a anterior.

**f0–f34:** a janela do relatório reaparece pequena no topo e é **sugada** por um
feixe até a faísca do Claude no centro, que esquenta e estoura (flash).
**f36–f96:** da faísca abre a **grade de 30 cartões de post** (5×6, entrada
stagger com mola) enquanto o contador coral vai de 1 a **30** ao lado do rótulo
"ideias de posts" (a cada 7 cartões um acende em coral — os que já viraram post).
**f104–f176:** a grade sai e o **cartão de FAQ** desdobra com o cabeçalho
`FAQ · as perguntas que eles digitam`; as três perguntas são as buscas do
relatório, cada uma com a lupa ao lado e a barra da resposta se abrindo por
baixo — é assim que "base no que o público pesquisou" aparece sem escrever isso.
**f182–f246:** tudo sai e entra a lista de procura — quatro posições de vidro,
com o **SEU SITE** subindo da 4ª pra 1ª (os outros descem um degrau), e a
posição 1 acende em coral.

## Cena 04 — De onde vem o relatório (162f)

O relatório da cena 02 volta no topo e um fio o liga pra baixo, ao painel
**Search Console**, que se monta: curva de linha desenhando em 44 frames
(`pathLength` + `strokeDashoffset`), eixo pontilhado e duas linhas de busca
aparecendo dentro. Em **f52** o carimbo **GRÁTIS** cai em coral sobre a quina do
painel, com flash e shake (é o argumento de negócio do bloco). Em **f96** o
cadeado — que fica à ESQUERDA do título, porque a quina direita é do carimbo —
abre, e a checklist se marca sozinha ao lado da faísca: `confere o teu site` →
`libera o acesso ao painel` → selo **ACESSO LIBERADO**.

## Cena 05 — Instalar (111f · terminal-inserts)

Janela de terminal de vidro com a faísca do Claude na barra de título. **f6:** o
chip do link cai e é colado depois do prompt (`⌘V` piscando). **f30:** o pedido é
digitado em português — `instala essa skill pra mim` — letra a letra em mono.
**f54:** enter, e as linhas de saída sobem: `baixando…` com barra de progresso
líquida coral e depois `✓ skill instalada`. **f92:** o chip **PRONTO** sela.
Ritmo curto de propósito: o bloco tem 3,7s.

## Cena 06 — O teste (192f)

**f0–f54:** cacos de vidro voam de fora pra dentro e montam o selo **EU MESMO
BAIXEI E TESTEI**, com anel coral desenhando (`<circle>` + `strokeDasharray`,
nunca `border` + máscara). **f56:** o selo vira chip no topo e entra o cartão
**SEM A SKILL**: três dicas genéricas em cinza ("poste mais", "use hashtags",
"faça vídeos curtos"), cada uma recebendo um ✗ e uma risca. **f120:** entra o
cartão **COM A SKILL**, aceso e com `hot`: as perguntas reais do cliente, as 30
ideias e o FAQ, com ✓ em coral — enquanto o cartão da esquerda apaga e inclina.

## Cena 07 — CTA (180f)

Campo de comentário de vidro com o cursor piscando: **PERGUNTAS** é digitado
letra a letra (f10→f44). Em **f48** a palavra salta pra fora, o campo estilhaça
em cacos e PERGUNTAS vira display coral gigante com halo pulsante. Dois chips de
entrega entram embaixo (`o link da skill`, `no seu privado`). Em **f112** fecha a
assinatura: **@luizbessa.ia** em mono e o chip `todo dia uma dica` com a faísca
do Claude ao lado.
