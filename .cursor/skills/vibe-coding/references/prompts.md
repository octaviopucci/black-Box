# Prompts prontos (vibe-coding)

Copie/adapte ou deixe o agente seguir a skill — o conteúdo já está embutido na
Fase correspondente.

## Brainstorm

```
Antes de escrever qualquer código pra isso: [PEDIDO].

Não comece a implementar. Primeiro:
- Pergunte o que falta pra fechar o escopo.
- Se existir mais de uma interpretação razoável, apresente lado a lado — não
  escolha uma calado.
- Levante suposições que eu provavelmente tenho e não deixei explícitas —
  padrões do repo, o que não tocar, performance.
```

## Plano

```
Escopo fechado: [RESUMO DO ESCOPO].

Escreva um plano passo a passo. Cada passo precisa de verificação explícita —
comando, teste ou comportamento observável — nunca "deveria funcionar".
Marque cada passo com Files: e Depends-on:.
Mostre o plano e espere meu ok antes de codar.
```

## Ondas paralelas

```
Execute a Onda [N] do plano: [T01, T02, ...], despachadas juntas, um
especialista por task. Nenhum implementador commita — cada um implementa,
testa o que é seu, e reporta exatamente quais arquivos mudou. Eu, como
orquestrador, commito depois — uma task por vez, na ordem [T01 → T02 → ...],
capturando o HEAD atual imediatamente antes de cada commit.
```

Ver também [parallel-waves.md](parallel-waves.md).

## Revisao

```
Revise o diff da Onda [N] ([tasks]) com revisores independentes em paralelo:
code-reviewer, security-reviewer (se auth/input), e especialista da stack.
Nenhum revisor vê o achado dos outros. Depois sintetize: junte duplicatas,
descarte achados sem cenário concreto de falha, ranqueie CRITICAL / HIGH /
MEDIUM / LOW no formato arquivo:linha — severidade — alegação — cenário.
```

## Memória

```
Algo desta sessão merece memória? Critério: uma sessão futura ficaria surpresa
de não saber isso antes de trabalhar? Se sim, proponha entrada pra MEMORY.md
+ arquivo em .cursor/memory/ com frontmatter type: architecture | business-rule |
feedback | reference.
```
