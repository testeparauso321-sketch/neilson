# Brief: O plugin que substituiu o funcionário do administrativo

Fonte: timestamped · Fala estimada: 58s · Master: 70s · Cenas: 6

**Direção de arte: LIQUID GLASS (iOS 26 / macOS Tahoe).**
Preto absoluto OLED (#000000) como base, painéis de vidro translúcido com refração
de borda, specular highlight varrendo, lente que clareia a quina, e um único acento
coral (#D97757) para palavra-chave e número. Tipografia Geist (display) + Geist Mono.
Fundo sempre líquido: blobs de luz deformados por `feTurbulence` + `feDisplacementMap`,
nunca parado. Ver `theme.ts` e `glass.tsx`.

## Referências pesquisadas (Liquid Glass)

- Apple Newsroom / WWDC25 — material translúcido que **refrata** (lensing) em vez de
  só borrar; specular highlights que respondem ao movimento; sombras adaptativas.
- kube.io "Liquid Glass in the Browser" — cadeia `feImage → feDisplacementMap`
  (canal R = eixo X, canal G = eixo Y, 128 = neutro), perfil de superfície
  **convex squircle** (`y = ⁴√(1-(1-x)⁴)`) que é o que a Apple usa; specular como
  camada separada em `blend mode: overlay`.
- Molas Apple: `spring(response: 0.3, dampingFraction: 0.6)` e `bouncy(0.35–0.4)` —
  traduzidas para `spring({damping: 13–18, stiffness: 150–260})` no Remotion.
- Regra de modo escuro: elementos pequenos invertem claro/escuro, os grandes só
  adaptam — por isso os painéis grandes ficam sempre no vidro escuro.

## Adaptação técnica no Remotion

`backdrop-filter` com filtro SVG (`url(#id)`) é Chromium-only e caro em 1080×1920×2100f.
Solução usada, que renderiza rápido e mantém a leitura óptica:

1. **Refração real** aplicada ao *fundo* (`filter: url(#liquid)`, suportado 100%),
   não ao backdrop — os blobs se deformam de verdade, frame a frame.
2. **Frost** no painel via `backdrop-filter: blur() saturate() brightness()`.
3. **Lente de borda**: anel de 14px com `backdrop-filter: blur(2px) brightness(1.55)`
   recortado por `mask-composite: xor` — imita a luz concentrada na quina.
4. **Rim cromático**: `conic-gradient` em borda mascarada (branco/prata + sopro de coral).
5. **Specular**: banda de gradiente varrendo em `mix-blend-mode: screen`.

## Tabela de cenas

| # | Trecho (resumo) | Conceito visual | Skill | Dur. | Loop | Layout |
|---|---|---|---|---|---|---|
| 01 | "Eu ia contratar um funcionário pro administrativo, mas instalei esse plugin no lugar e resolveu tudo." | Contador de salário subindo violentamente atrás do vidro → trava → é riscado → "UM PLUGIN" → "RESOLVEU TUDO" | cinematic-camera + motion-graphics | 7s | não | split-safe |
| 02 | "Olha o que ele fez sozinho. Mostrou todo mundo que faltava me pagar e gerou um follow-up personalizado pra cada cliente." | Painel de vidro "EM ABERTO": linhas de clientes anonimizados entram com valor e dias de atraso → cada linha cospe um card de follow-up escrito sozinho | terminal-inserts + motion-graphics | 12s | não | split-safe |
| 03 | "São 31 tarefas empacotadas: cobrar fatura vencida, planejar a folha, organizar o CRM, revisar contrato, criar vaga." | Contador **31** gigante + esteira de chips de vidro com as tarefas passando em duas faixas contrárias | motion-graphics | 12s | sim | split-safe |
| 04 | "Baixa o app do Claude, aba Customizados, Browse Plugins, pesquisa Small Business, instala e personaliza." | Janela de vidro estilo macOS Tahoe: 5 passos com cursor, chip de passo (1/5…5/5), barra de progresso líquida | motion-graphics + terminal-inserts | 22s | não | split-safe |
| 05 | "Eu construo sistema rodando pra cliente. Quando aparece coisa assim, eu testo antes de indicar." | Selo de vidro "TESTADO ANTES DE INDICAR" montando a partir de cacos + três chips de prova | motion-graphics | 7s | não | split-safe |
| 06 | "Comenta ADMIN aqui embaixo que eu te mando o passo a passo e o convite pro meu grupo." | Campo de comentário em vidro digitando **ADMIN**, palavra explode em coral, handle @luizbessa.ia | motion-graphics | 10s | não | split-safe |

**Total: 2100 frames = 70s @ 30fps.**

## Cena 01 — Hook (PRIORIDADE MÁXIMA · 210f)

Sem intro, sem respiro: no frame 0 já existe um painel de vidro gigante **vibrando**
com um contador de dinheiro correndo (R$ 0 → R$ 2.400/mês) e a câmera em push-in de
1.18 → 1.02. Os dígitos têm *chroma split* (cópia ciano deslocada +x, cópia coral −x)
proporcional à vibração, então quanto mais rápido o número sobe, mais a tela "treme".
No f38 o contador **trava** — flash branco de 2 frames, shake de tela inteira, e o
rim do vidro pulsa. No f52 entra o chip "1 FUNCIONÁRIO · ADMINISTRATIVO". No f66 uma
**risca coral** atravessa o número da esquerda pra direita e o painel inteiro
dessatura e glitcha por 6 frames. No f88 um painel novo sobe de baixo com morph
líquido e trava em **UM PLUGIN**. No f130 **RESOLVEU TUDO** carimba em coral com
halo pulsante. Fundo: 4 blobs de luz deformados por turbulência, grão, e uma grade
de pontos em paralaxe. Nunca há 2 frames iguais.

> O valor R$ 2.400 é ilustrativo do **custo de contratar** (faixa de mercado de
> auxiliar administrativo), não é promessa de resultado — está isolado na constante
> `SALARIO` de `Scene01Hook.tsx` pra trocar em 1 linha.

## Cena 02 — A prova (360f)

Painel de vidro largo, cabeçalho "EM ABERTO". Linhas de clientes entram em stagger
de 9 frames — **anonimizadas** (`CLIENTE ▓▓▓▓▓ 01`, valor, dias de atraso em coral),
com um borrão de tarja sobre o nome, o que também reforça que é tela real. Batida 2:
uma varredura de scanner desce pelas linhas. Batida 3: de cada linha sai um card de
follow-up de vidro menor com o texto sendo digitado, cada um diferente do outro. Batida
final: chip "5 FOLLOW-UPS · PERSONALIZADOS" e o contador de "não digitei uma palavra":
**0 palavras digitadas**.

## Cena 03 — A escala (360f, loopável)

**31** em display gigante com contagem por spring e halo coral, atrás um anel de vidro
girando. Abaixo, duas esteiras de chips de vidro correndo em direções opostas com as
tarefas ditas na fala (cobrar fatura vencida, planejar a folha, organizar o CRM,
revisar contrato, criar vaga…) — a esteira é de translate contínuo, então a cena
absorve sobra de tempo em loop perfeito. Fecha com "O ADMINISTRATIVO INTEIRO".

## Cena 04 — Tutorial (660f)

Janela de vidro estilo macOS Tahoe (barra de título com os 3 pontos em vidro, sidebar
translúcida). 5 passos de ~132f cada, com cursor de vidro animando entre alvos e
clique com onda de impacto: (1) baixar o app no computador, (2) aba **Customizados**,
(3) **Browse Plugins**, (4) buscar **Small Business** e instalar, (5) personalizar pro
negócio. Chip de passo no topo (1/5 … 5/5) e barra de progresso líquida coral. Cada
troca de passo faz o conteúdo da janela deslizar com blur direcional.

## Cena 05 — Fosso (210f)

Cacos de vidro voam de fora pra dentro e montam um selo circular: **TESTADO ANTES DE
INDICAR**, com anel coral que se desenha em 40 frames. Três chips orbitam: "sistema
rodando", "cliente real", "eu testo primeiro". Câmera em órbita lenta. Nenhum nome de
cliente aparece — regra dura do vault.

## Cena 06 — CTA (300f)

Campo de comentário em vidro, cursor piscando, digita **ADMIN** letra a letra em mono.
No fim a palavra salta pra fora do campo, vira display coral gigante com halo e o
campo se dissolve em cacos. Abaixo, dois chips de vidro: "passo a passo" e "convite pro
meu grupo" (nunca "nossa comunidade"). Rodapé: **@luizbessa.ia**.
