# Brief: As 4 regras que consertam o Claude

Fonte: timestamped (copy pronta, blocos 0:00→0:50) · Fala estimada: 50s · Master: 55s · Cenas: 7

**Direção de arte NOVA para este vídeo — "mesa de papel".** Os vídeos anteriores (#0 5 MCPs,
postiz, 5 plugins) são escuros. Este inverte: **papel claro, tinta escura, tudo desenhado à mão**.
Nada de realismo — é ilustração: caneta tremida, marca-texto de ponta grossa, post-its, fita
crepe, adesivos, setas rabiscadas, estrelas de caneta. As formas são geradas por SVG com jitter
determinístico (`random()` do Remotion), então "treme" como traço humano sem nunca variar entre
renders.

**Alternância de fundo por clipe (pedido explícito do usuário):** cada cena alterna a superfície do
papel entre **branco** e **cinza**, para que no corte final os clipes conversem por contraste:

| cena | 01 | 02 | 03 | 04 | 05 | 06 | 07 |
|---|---|---|---|---|---|---|---|
| tom | **branco** | cinza | **branco** | cinza | **branco** | cinza | **branco** |

**Layout — TODAS as cenas são `split-safe`**, inclusive gancho e CTA. Conteúdo informativo só na
METADE DE CIMA (y 90→910); o papel, a grana, as linhas de caderno e os rabiscos de fundo sangram no
frame inteiro para dar continuidade sob a máscara da webcam.

**Tipografia:** `Permanent Marker` nos carimbos/punches, `Caveat` nas anotações à mão,
`Fraunces` nos headlines, `Inter` nas etiquetas, `JetBrains Mono` no código.

| # | Trecho (resumo) | Conceito visual | Skill | Dur. | Loop | Layout |
|---|---|---|---|---|---|---|
| 01 | 0:00 Gancho p1 — "O melhor engenheiro da Tesla reclamou do Claude num post." TELA: — | Print do post **desenhado**: cartão de papel cai na mesa com fita crepe nos cantos, nome rasurado (ninguém real é identificado), chip TESLA, reclamação em Caveat, logo oficial do Claude circulado a caneta vermelha + seta "de novo". Zero texto de tela (a copy pede TELA vazia) | cinematic-camera + article-highlights | 5s | não | split-safe (papel **branco**) |
| 02 | 0:05 Gancho p2 — "24 horas depois veio a solução: 4 regras que você cola no teu Claude." TELA: **4 REGRAS** | Carimbo `24H DEPOIS` com relógio de caneta girando → corte seco: a **folha inteira** do `CLAUDE.md` cabe numa tela só, 4 regras em mono, checkbox marcado à mão uma a uma + marca-texto nas keywords → carimbo **4 REGRAS** torto com círculo de caneta | motion-graphics | 6s | não | split-safe (papel **cinza**) |
| 03 | 0:11 Escala + stake — "mais estrela que o Next.js inteiro… separa o código que roda do que quebra na frente do cliente." TELA: **188 MIL ⭐** | Estrelas de caneta pipocando + contador subindo até **188 MIL**; barras rabiscadas em papel quadriculado comparando com o Next.js; a folha **rasga no meio**: `RODA` (✓ verde) vs `QUEBRA` (rabisco vermelho) | article-highlights + motion-graphics | 5s | não | split-safe (papel **branco**) |
| 04 | 0:16 As 4 dores — "escreve código demais / ignora metade / diz que terminou / inventa função" | Mural 2×2 de **post-its** que grudam com stagger, cada um com micro-demo rodando: contador 20→400 linhas · checklist com 2 itens riscados · balão "pronto!" levando carimbo `NÃO TESTOU` · `client.magicFix()` com sublinhado tremido e etiqueta "não existe" | motion-graphics | 12s | não | split-safe (papel **cinza**) |
| 05 | 0:28 **O take que decide o vídeo** — "Mesmo prompt, com e sem o arquivo. Olha a diferença." | Split screen em duas folhas: **SEM O ARQUIVO** (esq., vermelha) e **COM O ARQUIVO** (dir., verde). O mesmo prompt num post-it em cima com seta bifurcando. Digitação simultânea: esq. inventa `sdk.autoFix()` → rabisco + carimbo `QUEBRA`; dir. usa `sdk.repair()` com chip `conferido na doc` → carimbo `RODA` | motion-graphics + terminal-inserts | 8s | não | split-safe (papel **branco**) |
| 06 | 0:36 Fosso — "roda em todo sistema que eu entrego pra cliente. Ferramenta é bastidor." VISUAL: rosto | Cena **arejada** (o rosto é o protagonista): pilha de folhas de entrega recebendo carimbo `ENTREGUE ✓` uma a uma em loop, contador de cliente subindo; ao lado, a etiqueta `FERRAMENTA` cai na gaveta riscada enquanto `CÓDIGO FUNCIONANDO` fica no holofote | motion-graphics | 8s | sim | split-safe (papel **cinza**) |
| 07 | 0:44 CTA — "Comenta REGRAS aqui embaixo." TELA: comenta **"REGRAS"** | Balão de fala desenhado com **REGRAS** em marcador pulsando; seta rabiscada apontando pra caixa de comentário; 3 adesivos entram tortos — O ARQUIVO · ONDE COLAR · NO DIRECT | cinematic-camera + motion-graphics | 6s (11s no master) | sim | split-safe (papel **branco**) |

As cenas 01→06 têm **exatamente** a duração dos blocos da copy, então cada cena começa no segundo
escrito no roteiro (0:00 / 0:05 / 0:11 / 0:16 / 0:28 / 0:36 / 0:44). A folga do master
(55s − 50s = 150 frames) fica **toda no fim**, na cena 07 (loopável) — o pulso do balão e os
adesivos respirando absorvem os 5s sem emenda.

## ⚠️ Números a conferir no dia da gravação

A própria copy marca "(conferir no dia)". Os dois números da cena 03 estão em constantes no topo de
`scenes/Scene03Escala.tsx` (`STARS_K` e `NEXT_K`) — é trocar dois números e re-renderizar:

- **188 MIL ⭐** — estrelas do repositório do arquivo.
- **~135 MIL** — estrelas do Next.js (a barra de comparação usa esse valor).

Se no dia a diferença for outra, a barra se ajusta sozinha (a largura é proporcional).

## Decisões de conteúdo

- **Ninguém real é identificado.** O post da cena 01 é uma ilustração à mão: o nome aparece
  **rasurado** (três squiggles de caneta) e só o chip `TESLA` fica legível, exatamente como a fala
  ("o melhor engenheiro da Tesla") pede — sem inventar handle, foto ou print de post real.
- **O arquivo é rotulado `CLAUDE.md`**, que é onde as regras de fato são coladas ("você cola no teu
  Claude").
- **As 4 regras da cena 02 espelham 1:1 as 4 dores da cena 04** (excesso → mínimo; ignora → uma por
  uma; diz que terminou → só depois de rodar; inventa → verifica). É essa simetria que faz o vídeo
  fechar: a cena 04 é a dor, a cena 02 já mostrou o antídoto na mesma ordem.
- **CTA único** (a copy pede só "comenta REGRAS"), diferente do CTA duplo do #0 e do 5-plugins.

## Cena 01 — Hook (PRIORIDADE MÁXIMA)

Papel branco, câmera já em push-in no frame 0. **3 estímulos no primeiro frame:** (1) o cartão do
post entrando em queda com rotação, (2) as tiras de fita crepe batendo nos cantos com micro-shake da
câmera, (3) rabiscos de fundo em paralaxe. Beat 1 (0–1,2s): o cartão pousa, a fita gruda, o shake
bate. Beat 2 (1,2–2,4s): a reclamação se escreve à mão (char a char em Caveat) e os contadores de
engajamento sobem. Beat 3 (2,4–3,4s): **caneta vermelha circula o logo oficial do Claude** com traço
que se desenha (stroke-dasharray) e a seta "de novo" entra torta. Beat 4 (3,4–5s): marca-texto
amarelo varre "não testou" e a câmera abre revelando a mesa inteira. Pacing mais rápido do vídeo:
~1,2s por beat. Tudo entre y 150 e 900.

## Cena 02 — 4 REGRAS (papel cinza)

Abre com o carimbo `24H DEPOIS` girando os ponteiros do relógio a caneta (0–1,2s). Corte seco
(escala + flash de papel) para a folha inteira do `CLAUDE.md` com aba de arquivo em adesivo — as
**4 regras cabem numa tela só**, que é o ponto da fala. Cada regra recebe um ✓ desenhado à mão com
stagger de 12f e um marca-texto na keyword (`mínimo`, `TODAS`, `rodar`, `verifique`). Fecha com
**4 REGRAS** em marcador, torto 4°, com círculo de caneta se desenhando ao redor.

## Cena 03 — Escala + stake (papel branco)

Papel quadriculado. Beat 1 (0–2s): estrelas de caneta pipocam em posições determinísticas enquanto o
contador sobe até **188 MIL** em marcador. Beat 2 (2–3,2s): duas barras rabiscadas se preenchem —
`Next.js` e `este arquivo` — e a segunda passa da primeira com um "puxão" de spring. Beat 3
(3,2–5s): o papel **rasga no meio** (borda serrilhada gerada com jitter) e os dois lados separam:
`RODA` com ✓ verde à esquerda, `QUEBRA` com rabisco vermelho à direita. O rasgo é o stake.

## Cena 04 — As 4 dores (papel cinza)

Mural 2×2 de post-its (amarelo, rosa, azul, verde), cada um torto num ângulo diferente e com fita
crepe. Eles grudam em sequência (~2,6s cada) com pancada e micro-shake; o post-it ativo fica em
escala 1.0 e os anteriores caem para 0.94 com opacidade 0.75, mas **nenhum deles congela** — cada um
mantém sua micro-animação em loop (o contador de linhas continua subindo, o cursor continua piscando,
o carimbo continua respirando). Contador `1/4 → 4/4` a caneta no canto. Último beat: círculo de
caneta ao redor dos quatro.

## Cena 05 — O take que decide (papel branco)

Post-it do prompt no topo com seta bifurcando em duas folhas. As duas colunas digitam ao **mesmo
tempo** (mono, ~1 char/2f) para o olho comparar sozinho. Esquerda: `sdk.autoFix(x)` ganha sublinhado
tremido vermelho, etiqueta à mão "essa função não existe" e carimbo `QUEBRA` torto. Direita:
`sdk.repair(x)` ganha chip `conferido na doc ✓` e carimbo `RODA` verde. Câmera em push-in lento na
bifurcação — sem cortes, a comparação inteira num plano só.

## Cena 06 — Fosso (papel cinza, loopável)

Cena deliberadamente arejada — o rosto é o protagonista deste bloco. Pilha de folhas de entrega no
topo recebendo carimbo `ENTREGUE ✓` uma a uma, com o contador de cliente subindo e voltando (loop
sem emenda). À direita, a etiqueta `FERRAMENTA` desliza pra dentro de uma gaveta riscada enquanto
`CÓDIGO FUNCIONANDO` fica sozinho no holofote de caneta. Texto mínimo: quem fala é a fala.

## Cena 07 — CTA "comenta REGRAS" (papel branco, loopável)

Balão de fala desenhado (traço tremido que se desenha) com **REGRAS** em Permanent Marker pulsando
em coral; seta rabiscada apontando pra baixo, para uma caixa de comentário desenhada com cursor
piscando. Três adesivos entram tortos com stagger — O ARQUIVO · ONDE COLAR · NO DIRECT — e ficam
respirando. É esta cena que absorve os 5s de folga do master: o pulso do balão e a respiração dos
adesivos são cíclicos, então qualquer duração extra fecha sem emenda.
