export const templateBugReport = `## Título do bug


**Tela:**

**Passos para reproduzir:**
1.
2.
3.

**Resultado esperado:**


**Resultado atual:**


**Severidade:** (crítica / alta / média / baixa)

**Ambiente:** QArena (ambiente de treino)
`

export const exemploBugReportPreenchido = `## Título do bug
Cupom QA10 aplica um desconto menor do que o anunciado

**Tela:**
Checkout

**Passos para reproduzir:**
1. Adicionar qualquer produto ao carrinho
2. Ir para o Checkout
3. Aplicar o cupom QA10
4. Conferir o valor do desconto exibido

**Resultado esperado:**
O cupom anuncia 10% de desconto, então o valor descontado deveria ser exatamente 10% do subtotal.

**Resultado atual:**
O valor descontado corresponde a aproximadamente metade do que os 10% anunciados representariam.

**Severidade:** Alta

**Ambiente:** QArena (ambiente de treino)
`
