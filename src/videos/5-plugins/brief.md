# Brief: 5 plugins do Claude Code (formato LISTA)

Fonte: timestamped (copy v2, blocos 0:00→1:07) · Fala estimada: 67s · Master: 70s · Cenas: 7

Réplica de formato do **#0 (5 MCPs)**: 5 itens, lista, keyword de uma palavra (**PLUGINS**), mesma
faixa de duração. Herda o sistema visual do #0 — trilho de progresso 1→5, badge de índice coral,
nome do plugin em mono — para que a variável testada seja o tema, não a estética.

**Diferença estrutural vs #0 (é o que a copy v2 pede):** cada item abre com o **PROBLEMA**, não com
o nome do plugin. A cena inteira segue `PROBLEMA → PLUGIN → DEMO → PUNCH`. A tensão vem antes da
solução.

**Layout — TODAS as cenas são `split-safe`, inclusive gancho e CTA.** Conteúdo informativo na
METADE DE CIMA (y 92→910); fundo (grade de pontos, spark, gradiente, vinheta) sangra no frame
inteiro para continuidade sob a máscara da webcam. Nenhum `fullscreen` — impacto vem de push-in,
glow, carimbo e micro-shake dentro da faixa segura.

**"Claude Code" na primeira frase e no primeiro frame:** o gancho carimba `NO CLAUDE CODE` com o
BrandLogo oficial do Claude, e o header de todas as cenas de corpo mantém o lockup Claude Code.

| # | Trecho (resumo) | Conceito visual | Skill | Dur. | Loop | Layout |
|---|---|---|---|---|---|---|
| 01 | Gancho — "Queria ter conhecido esses 5 plugins do Claude Code 6 meses atrás. Teria economizado 100 horas." TELA: 6 MESES PERDIDOS NO CLAUDE CODE | Karaokê "6 MESES" + **PERDIDOS** carimbando gigante em coral com micro-shake; chip `[claude] NO CLAUDE CODE`; **5 PLUGINS** (5 gigante, planta a lista) e punch **−100 HORAS** com contador | cinematic-camera + motion-graphics | 6s | não | split-safe |
| 02 | 1 — Ponytail: "O Claude escreve código demais. O Ponytail corta: metade do código, mais rápido, mais barato." | Bloco de código incha (linhas empilham, contador 148 linhas) → lâmina coral varre → metade das linhas evapora e o bloco encolhe (68 linhas); chips −54% CÓDIGO · +27% MAIS RÁPIDO · −20% MAIS BARATO | motion-graphics | 11s | não | split-safe |
| 03 | 2 — Code Review (oficial da Anthropic): "revisa antes de ir pro ar e aponta o que vai quebrar" | Terminal 3D: `claude /code-review` digitado → varredura de 24 arquivos com spinner → 3 achados reais com ✗ coral → `✓ 3 problemas achados antes do deploy`; selo com BrandLogo **Anthropic** "oficial" | terminal-inserts | 11s | não | split-safe |
| 04 | 3 — Claude Mem: "Fecha hoje, abre amanhã: lembra do projeto inteiro. Nunca mais reexplicar." | Sessão ONTEM fecha e 3 chips de contexto (stack · decisões · convenções) **voam** para o cofre de memória coral; sessão HOJE abre e os chips voltam com `↺ contexto restaurado ✓`; ciclo loopável | motion-graphics + terminal-inserts | 11s | sim | split-safe |
| 05 | 4 — Context7: "código que nem existe mais → puxa a doc atualizada na hora" | Linha de código com API morta (`auth.session()`) sublinhada em coral + selo `removido na v2` → card de doc `context7 · atualizado hoje` entra → a linha **se reescreve** em `auth.getSession()` com ✓ verde | motion-graphics + terminal-inserts | 11s | sim | split-safe |
| 06 | 5 — Superpowers: "força planejar, testar e só depois codar — igual dev sênior. Uso nos sistemas que entrego." | Atalho "direto pro código" bate numa **barreira coral** (bloqueado, shake) → o trilho correto acende em ordem: PLANO ✓ → TESTE (barra vermelha→verde) → CÓDIGO ✓; faixa de fosso "uso nos sistemas que entrego pra cliente" | motion-graphics | 11s | não | split-safe |
| 07 | CTA — "Comenta PLUGINS que eu te mando os cinco com o link de instalação." | "COMENTA" cinético + **PLUGINS** gigante coral com glow pulsante e câmera respirando; pílulas OS 5 PLUGINS · LINK DE INSTALAÇÃO · NO DIRECT; SparkBurst atrás | cinematic-camera + motion-graphics | 6s (9s no master) | sim | split-safe |

Os blocos 01→06 têm **exatamente** a duração dos timestamps da copy, então cada cena começa no
segundo escrito no roteiro (0:00 / 0:06 / 0:17 / 0:28 / 0:39 / 0:50 / 1:01). A folga do master
(70s − 67s = 90 frames) fica **toda no fim**, na cena 07 (loopável), para não desalinhar nada.

## Decisão sobre o CTA duplo (checagem "espelhar o #0")

A copy pergunta se o #0 usou CTA único ou duplo. O #0 está no repo (`src/videos/5-mcps/scenes/Scene08Cta.tsx`)
e usa **CTA duplo**: "COMENTA MCP" + subline *"e me segue que vem mais"*. Para manter a replicação
limpa, a cena 07 daqui repete o mesmo padrão duplo com a mesma subline. Se a decisão for CTA único,
é apagar uma `<div>` em `Scene07Cta.tsx`.

## Cena 01 — Hook (PRIORIDADE MÁXIMA)

Fundo escuro quente (#171310), câmera em push-in já no frame 0. **3 estímulos no primeiro frame:**
(1) "6 MESES" começando a estourar palavra a palavra, (2) SparkBurst do Claude pulsando atrás,
(3) grade de pontos em paralaxe no frame inteiro. Beat 1 (0–0,9s): karaokê coral varrendo sob
"6 MESES" em Fraunces creme. Beat 2 (0,9–2s): **"PERDIDOS"** carimba gigante em coral com flare do
spark + micro-shake de câmera. Beat 3 (2–3,4s): chip `[logo Claude] NO CLAUDE CODE` — a marca no
primeiro terço. Beat 4 (3,4–4,6s): **"5"** gigante + "PLUGINS" planta o formato lista e a keyword.
Beat 5 (4,6–6s): punch da promessa — **"−100 HORAS"** com contador subindo e glow pulsante. Pacing
mais rápido do vídeo: ~1,2s por beat. Tudo entre y 196 e 900.

## Cena 02 — Ponytail (o corta-código)

Split-safe, scaffold de plugin (trilho 1/5, badge 01). Problema no topo: "O Claude escreve **código
demais**". Demo: um painel de código já empilhando linhas no frame 0 (uma a cada 4 frames) até 14
linhas gordas, com contador `148 linhas` subindo e a borda pulsando coral (inchado). Aos ~3,5s uma
**lâmina coral** varre o painel na horizontal: metade das linhas evapora com stagger, o painel
encolhe (spring) e o contador cai para `68 linhas`. Depois entram 3 chips com os números
verdadeiros: **−54% código**, **+27% mais rápido**, **−20% mais barato**, e a linha verde
`✓ mesmo resultado`. Punch: "METADE DO CÓDIGO".

## Cena 03 — Code Review (o achador de bug)

Split-safe, badge 02, selo `oficial` com o **BrandLogo da Anthropic**. Problema: "O bug aparece
**depois** do deploy". Demo em terminal 3D (entra de baixo com perspectiva): comando
`claude /code-review` digitado ~1 char/frame, `┌ analisando 24 arquivos` com spinner braille e barra
de varredura, depois 3 achados em linhas CLI autênticas com ✗ coral (`◇ auth.ts:42 — token sem
expiração ✗`, `◇ api/pay.ts:88 — erro não tratado ✗`, `◇ db.ts:15 — query sem índice ✗`), fechando
com `✓ 3 problemas achados antes do deploy` em verde. Punch: "ACHA ANTES DO TEU CLIENTE".

## Cena 04 — Claude Mem (o que lembra) — loopável

Split-safe, badge 03. Problema: "Sessão nova = **reexplicar tudo**". Demo em 3 tempos que loopa:
(1) painel **ONTEM** com 3 chips de contexto (stack · decisões · convenções) e `session ended`;
(2) os chips **voam** em arco para um cofre de memória coral no centro que pulsa ao receber;
(3) painel **HOJE** abre vazio e os chips voltam voando, imprimindo `↺ contexto restaurado ✓` e
`lembra: Next 16 · Supabase · 3 decisões`. O ciclo fecha sem emenda. Punch: "NUNCA MAIS DO ZERO",
com o chip "reexplicar tudo" recebendo um risco coral.

## Cena 05 — Context7 (a doc de hoje) — loopável

Split-safe, badge 04. Problema: "Ele usa API que **nem existe mais**". Demo: painel de código com
`const { data } = await supabase.auth.session()` — a chamada morta ganha sublinhado coral tremido e
o selo `removido na v2`. Entra pela direita um card de doc (`context7 · supabase-js@latest ·
atualizado hoje`) com linhas carregando; um feixe coral liga o card à linha errada e ela **se
reescreve char a char** em `supabase.auth.getSession()` com ✓ verde. Punch: "DOC DE HOJE · CÓDIGO
QUE RODA". O ciclo errado→certo loopa.

## Cena 06 — Superpowers (o disciplinador)

Split-safe, badge 05 — o item de maior investimento depois do gancho (é o fosso pessoal). Problema:
"Ele quer **codar antes de pensar**". Demo: uma seta de atalho tenta pular direto do prompt para
CÓDIGO e bate numa **barreira coral** que treme e acende `bloqueado`; então o trilho correto acende
em ordem, um nó por vez: **PLANO** (3 ticks de checklist) → **TESTE** (barra vermelha que vira
verde, `3/3 passou`) → **CÓDIGO** (✓). Fecha com a faixa de fosso: "uso nos sistemas que entrego
pra cliente" e o punch "IGUAL DEV SÊNIOR".

## Cena 07 — CTA "Comenta PLUGINS" (loopável)

Split-safe. "COMENTA" cinético creme; **PLUGINS** gigante em Fraunces coral com glow pulsante e
câmera respirando (push-in/out); três pílulas entram com stagger — OS 5 PLUGINS · LINK DE INSTALAÇÃO
· NO DIRECT; subline "e me segue que vem mais" (CTA duplo, igual ao #0); SparkBurst do Claude
cintilando ao fundo no frame inteiro. O pulso do "PLUGINS" fecha o ciclo para loop — é essa cena que
absorve os 3s de folga do master.
