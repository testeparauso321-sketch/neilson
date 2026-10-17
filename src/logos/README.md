# Logos de marcas

Registro central de logos SVG para as cenas: `<BrandLogo name="claude" size={120} />` — `color` sobrescreve a cor oficial (ex.: branco em fundo escuro); anime pelo wrapper da cena, nunca dentro do componente.

## Como adicionar uma nova marca

1. Procure em https://simpleicons.org — existindo, importe o `si<Nome>` em `registry.ts` e adicione `minhamarca: fromSimpleIcon("minhamarca", siMinhamarca)` ao mapa `LOGOS`.
2. Não existindo, crie uma entrada manual `{ slug, title, path, hex, viewBox }` com o path do SVG oficial (press kit da marca) e comente a fonte — veja `OPENAI` como exemplo.
3. Se a marca é falada de outro jeito nas transcrições PT-BR, mapeie o apelido em `ALIASES` (ex.: `"chat gpt" → "openai"`).

Rode `npm run lint` antes de commitar.
