# Regras de copy — Story Quiz

Tom padrão: **Caveman** (vibe-coding) + voz humana do funil BASE.

---

## Princípios

1. **Fatiar, não colar** — máx 3 parágrafos + 3 bullets por pitch
2. **Micro-compromisso** — cada CTA pede um "sim" pequeno, não "compre agora"
3. **Voz do chão** — quem já viveu o problema (se a VSL usa primeira pessoa)
4. **Especificidade** — números, situações concretas, zero abstração
5. **Rastreabilidade** — campo `why` em todo passo

---

## Formato

| Regra | Certo | Errado |
|-------|-------|--------|
| Travessões | "Eu caí. Negociei. Voltei." | "Eu caí — negociei — voltei" |
| CTAs | `QUERO CONTINUAR` | `Clique aqui para continuar` |
| Títulos | 2 linhas: normal + highlight | parágrafo inteiro no title |
| Perguntas | frase completa | "Opção A" |
| Maiúsculas | CTAs e kicker | body inteiro |

---

## CTAs por fase

| Fase | Tom | Exemplos |
|------|-----|----------|
| Hook | curiosidade | QUERO CONTINUAR, FICA COMIGO |
| Dor | identificação | EU TÔ CANSADO DISSO, ISSO SOU EU |
| Reframe | esperança | QUERO SAIR DESSE CICLO, SIM EU TOPO |
| Filtro | desafio | EU QUERO SEGUIR, PODE ME TESTAR |
| Mecanismo | lógica | ISSO FAZ SENTIDO, ENTENDI |
| Prova | pertencimento | EU VOU ENTRAR, QUERO ESTAR COM VOCÊS |
| Transformação | desejo | EU QUERO ISSO PRA MIM |
| Fechamento | ação | QUERO MEU ACESSO, QUERO COMEÇAR |

Varie — não repetir o mesmo CTA 3x seguidas.

---

## Anti-slop (proibido)

Palavras/frases de template IA:

- "transforme sua jornada"
- "potencialmente"
- "desbloqueie seu potencial"
- "solução inovadora"
- "neste artigo/vídeo"
- "é importante ressaltar"
- travessão (—) em qualquer lugar

Carregue `anti-ai-landing` se o quiz for visual premium além do template BASE.

---

## Perguntas — voz do lead

Escreva opções como o **lead falaria**, não como o expert classificaria:

| Expert (ruim) | Lead (bom) |
|---------------|------------|
| Nível iniciante | Fico perdido. Não sei por onde começar de verdade. |
| Falta de disciplina | Eu sei o que fazer, mas a fissura me pega e eu caio. |
| Avatar 3 | Me comparo, travo, e volto pro alívio fácil. |

3 opções por pergunta (4–8 no `padrao` se nicho exige).

---

## Oferta — luck frame

O par `luckTitle` + `luckBody` cria frame de "não foi acaso":

```typescript
luckTitle: 'Olha. Vou falar reto.',
luckBody: 'Você veio até aqui clicando sim. Isso não foi acaso...',
```

Personalize com base na jornada do quiz, não genérico.

---

## Provas

Formato:

```typescript
{
  name: 'Marcos',
  meta: '34 anos · parou com cigarro · 287 dias limpo',
  quote: 'Citação curta, voz real, resultado específico.',
}
```

Só inclua se a VSL trouxer depoimentos reais. Meta = idade + contexto + resultado.

---

## Disclaimer

Se produto de saúde/financeiro/infantil, inclua disclaimer legal da VSL em
`offerCopy.disclaimer`. Nunca remover avisos existentes.

---

## Adaptação de tom

| Tom | Quando | Ajuste |
|-----|--------|--------|
| Caveman (padrão) | info produto, superação | frases curtas, "tá", "pra" |
| Formal | B2B, advocacia | "você", sem gíria; CTAs iguais |
| Técnico | SaaS dev | manter CTAs; body mais preciso |

Peça tom no intake se a VSL for formal — não force Caveman em copy corporativa.
