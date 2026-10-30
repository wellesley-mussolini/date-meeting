@AGENTS.md

# date-meeting

Next.js (App Router) + TypeScript + Tailwind CSS. Código-fonte em `src/`, alias `@/*` → `src/*`.

## Princípios de código (contrato do repositório)

Todo código novo ou tocado segue estes princípios; violação bloqueia o merge.

- **SOLID**
  - Responsabilidade única: cada módulo, componente ou função tem um motivo para mudar. Componente de tela não busca dados, não valida regra de negócio e não formata ao mesmo tempo.
  - Aberto/fechado: estender por composição e parâmetro, não por `if` de caso especial espalhado.
  - Substituição de Liskov: implementações de um mesmo contrato são intercambiáveis sem o consumidor saber qual recebeu.
  - Segregação de interfaces: tipos e props pequenos e específicos; nada de prop "faz-tudo" opcional.
  - Inversão de dependência: regra de negócio depende de abstração (tipo/interface), não de banco, `fetch` ou SDK concreto.
- **Nomenclatura**: segue `~/.claude/rules/nomenclatura.md`. Símbolos do domínio em português, verbo concreto + objeto (`buscarEncontroPorId`, nunca `handleData`), sem nome opaco ou genérico. Convenções de arquivo do framework (`page.tsx`, `layout.tsx`, `route.ts`) ficam como o Next.js exige.
- **Reaproveitamento**: antes de criar, procure se já existe. Lógica repetida em dois lugares vira uma função ou componente compartilhado, nomeado pela operação que faz e não pelo primeiro consumidor.
- **Clean code**: funções curtas e com um nível de abstração; sem código morto, sem `any`, sem fallback que esconde erro; comentário só para o porquê não óbvio.
- **TDD**: toda feature ou correção começa pelo teste falhando (Red → Green → Refactor), com Vitest e Testing Library. A contraprova (tirar a correção e ver o teste falhar) roda numa cópia isolada, fora da pasta que o `next dev` observa, para a mutação não aparecer na tela de quem está rodando o app.
- **Estilo**: só Tailwind. Nada de arquivo `.css` próprio além do `globals.css` que carrega o Tailwind.
- **Conferência visual**: componente visual ganha história no Storybook; o resultado é conferido por screenshot, não só pelo código.

## Fundo animado (`src/componentes/fundo-animado`)

Recria em SVG o vídeo de referência `coracao.mp4` como fundo fixo de todo o app: três cenas (campo, túnel, espiral) com os cortes medidos quadro a quadro em `linhaDoTempo.ts`.

- É SVG de propósito, não WebGL: o fundo precisa aparecer em qualquer navegador e celular. Com WebGL, navegador sem aceleração de hardware não desenhava nada.
- Todo movimento é função do tempo (`useAnimacaoDaCena`), então uma história do Storybook congela qualquer instante (`segundoInicial` + `congelado`) para comparar com o quadro do vídeo.

## Comandos

- `npm run dev`: servidor de desenvolvimento
- `npm run build`: build de produção (inclui typecheck)
- `npm run lint`: ESLint
- `npm test`: testes (Vitest)
- `npm run storybook`: Storybook na porta 6006
