# Brief: Meetily — a ata de reunião que roda no teu computador

Fonte: timestamped · Fala estimada: 50s · Master: 55s · Cenas: 6

**Direção de arte: LIQUID GLASS (iOS 26 / macOS Tahoe)** — mesma da
`plugin-administrativo`. Preto absoluto OLED (#000000), painéis de vidro
translúcido com refração de borda, specular varrendo, e o coral (#D97757) como
acento único. Tipografia Geist + Geist Mono. Fundo sempre líquido (`feTurbulence`
+ `feDisplacementMap`), nunca parado. Ver `theme.ts` e `glass.tsx`.

**Assinatura visual deste vídeo** (o que o diferencia do anterior): a **onda de
áudio**. Ela é o fio condutor — nasce no gancho como reunião correndo, vira ata
estruturada na cena 02, fica presa dentro da máquina na cena 03 e volta a correr
quando o botão de gravar é apertado na cena 04. Módulo próprio: `audio.tsx`
(`Waveform`, `RecDot`, `Machine`).

## Travas do roteiro aplicadas ao B-roll

| Trava | Como foi tratada aqui |
|---|---|
| 2 — nenhum nome de cliente na tela | A ata da cena 02 usa `CLIENTE ▓▓▓▓▓▓` tarjado. A tarja também reforça que é tela real. Regra dura do vault. |
| 4 — conferir se o plano grátis basta | As duas afirmações de preço vivem nas constantes `PRECO` de `Scene03Local.tsx`. Se o tier grátis não bastar, troca em 1 linha (ou apaga o chip). |
| 5 — keyword falada = keyword da legenda | **REUNIÃO** é a única palavra que aparece em display coral no CTA. |
| 6 — o CTA sai com o convite pro grupo | Chip explícito "convite pro meu grupo" na cena 06 (nunca "nossa comunidade"). |

Nenhuma cena escreve jargão (Whisper, transcrição, open source, MIT). O que
aparece na tela é resultado de negócio: *o que ficou combinado, quem faz o quê,
o prazo, não sobe pra lugar nenhum, dois minutos*.

## Tabela de cenas

| # | Trecho (resumo) | Conceito visual | Skill | Dur. | Loop | Layout |
|---|---|---|---|---|---|---|
| 01 | "Eu não entro mais em reunião com cliente sem isso." | Reunião correndo atrás do vidro (onda + REC + cronômetro), tipografia cinética em 3 batidas | cinematic-camera + motion-graphics | 4,5s | não | split-safe |
| 02 | "Terminei a call, abri e já tinha o resumo… eu não anotei uma linha." | Janela de vidro "ATA DA REUNIÃO": cliente tarjado, 3 blocos (COMBINADO / QUEM FAZ / PRAZO) se escrevendo sozinhos | motion-graphics + article-highlights | 13s | não | split-safe |
| 03 | "Roda tudo no teu computador… não sobe pra servidor de ninguém. Sem mensalidade, sem conta." | Máquina de vidro dentro de um cerco: pacotes de áudio batem na parede e voltam, wi-fi desliga e nada para | motion-graphics | 11s | não | split-safe |
| 04 | "Entra no link, baixa o instalador, abre e manda gravar. Dois minutos." | Janela única com cursor: link → instalador (macOS/Windows) → abrir → botão GRAVAR pressionado | motion-graphics + terminal-inserts | 11s | não | split-safe |
| 05 | "Eu monto sistema rodando pra cliente, então testo antes de indicar." | Selo de vidro montando a partir de cacos + chips de prova orbitando | motion-graphics | 8,5s | não | split-safe |
| 06 | "Comenta REUNIÃO que eu te mando o link e o convite pro meu grupo." | Campo de comentário digitando REUNIÃO, palavra salta em coral, dois chips + handle | motion-graphics | 7s | não | split-safe |

**Total: 1650 frames = 55s @ 30fps** (fala de 50s + folga de sobra pra edição —
sempre sobra B-roll, nunca falta).

Mapa de tempo: 01 `0–135` · 02 `135–525` · 03 `525–855` · 04 `855–1185` ·
05 `1185–1440` · 06 `1440–1650`.

## Cena 01 — Hook (PRIORIDADE MÁXIMA · 135f)

4,5 segundos, três batidas, zero respiro. No frame 0 já existe uma reunião
acontecendo: painel de vidro com **onda de áudio viva**, ponto **REC** pulsando
e cronômetro correndo (`00:00` → `47:12`), tudo vibrando com *chroma split*
(cópia ciano +x, cópia coral −x) proporcional à vibração. Câmera em push-in
1.24 → 1.02 e deriva permanente.

Batidas: **f0** reunião correndo · **f26** "NÃO ENTRO MAIS" carimba sobre o
painel com flash + shake · **f60** "EM REUNIÃO COM CLIENTE" entra por baixo com
morph líquido · **f92** o cronômetro trava, a onda congela e **SEM ISSO** estampa
em coral com halo pulsante, atravessado por uma risca. O painel esquenta
(`hot`) em cada batida. Fundo em `energy: 2` — é o gancho, o líquido fica agitado.

## Cena 02 — A prova (390f)

O take que decide o vídeo. Janela de vidro estilo macOS Tahoe com barra de
título e cabeçalho **ATA DA REUNIÃO** — abaixo, a linha de contexto com o nome
do cliente **tarjado** (`CLIENTE ▓▓▓▓▓▓`), duração `47 min` e a marca de que
acabou de terminar. A onda da cena 01 aparece por 20 frames no topo e **colapsa**
em linhas de texto: é a transição de "conversa" para "ata".

Três blocos entram em stagger, cada um com o rótulo em mono e os itens sendo
**escritos sozinhos** (typing), com uma varredura de scanner descendo antes de
cada bloco: `O QUE FICOU COMBINADO` (3 itens), `QUEM FAZ O QUÊ` (2 linhas com
chip de dono — "eu" e "cliente", nunca nome), `PRAZO` (chips de data em coral).
Fecho (f322): o carimbo de vidro **EU NÃO ANOTEI UMA LINHA** cai por cima da
janela, com "uma linha" em coral e halo pulsante.

## Cena 03 — O diferencial (330f)

Cena-assinatura. Ao centro, uma **máquina de vidro** (laptop) com a onda rodando
dentro dela; ao redor, um **cerco** circular de vidro que é a fronteira do
computador. Pacotes de áudio orbitam dentro; três deles tentam sair na direção
de ícones de "servidor" nas quinas e **batem na parede**, que acende em coral e
solta uma ondulação — os servidores apagam. Chip: `NÃO SOBE PRA LUGAR NENHUM`.

Batida seguinte: o ícone de **wi-fi desliga** (risca coral atravessando), flash
branco — e nada para: a onda continua correndo e a ata continua se escrevendo
dentro da máquina. Chip `SEM INTERNET · CONTINUA RODANDO`. Fecho: dois chips de
preço, **SEM MENSALIDADE** e **SEM CONTA**, isolados na constante `PRECO`
(trava 4 do roteiro — se o tier grátis não bastar, troca aqui).

## Cena 04 — Tutorial (330f)

Uma janela só, do começo ao fim, com cursor de vidro andando entre os alvos e
clique com onda de impacto. 4 passos de ~82f, chip de passo (1/4…4/4) e barra de
progresso líquida coral: (1) **abrir o link** — barra de endereço com a URL sendo
digitada; (2) **baixar o instalador do teu sistema** — dois cartões, macOS e
Windows, com a barra de download enchendo; (3) **abrir** — ícone do app saltando
com o "primeira vez" resolvido; (4) **mandar gravar** — botão circular grande de
GRAVAR sendo pressionado, que dispara a onda de áudio de volta e o cronômetro
começa do `00:00`. Fecha com o chip **2 MINUTOS**.

## Cena 05 — Fosso (255f)

Cacos de vidro voam de fora pra dentro e montam um selo circular: **EU USO EM
REUNIÃO DE VERDADE**, com anel coral se desenhando em 40 frames e câmera em
órbita lenta. Três chips orbitam com a prova: "sistema rodando pra cliente",
"testo antes de indicar", "reunião de verdade". Nenhum nome de cliente — regra
dura do vault.

## Cena 06 — CTA (210f)

Campo de comentário em vidro, cursor piscando, **REUNIÃO** sendo digitada letra
a letra em mono. A palavra salta pra fora, o campo estilhaça em cacos e REUNIÃO
vira display coral gigante com halo pulsante. Abaixo, dois chips de vidro: "o
link" e "convite pro meu grupo". Rodapé: **@luizbessa.ia**.
