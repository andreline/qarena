# Automação de testes no QArena

Este documento explica como abordar a automação de testes end-to-end no QArena, com exemplos em Cypress e em Playwright. Não é um projeto de automação pronto, é um guia para quem quiser montar o seu.

## Por que o QArena é fácil de automatizar

- Todo elemento interativo tem `data-testid`, no padrão `{contexto}-{tipo}-{nome}`. Nunca use texto visível ou classe CSS como seletor.
- Não existe backend. Os dados ficam em `localStorage`, então dá para resetar o estado do ambiente sem precisar de banco de dados nem de mocks de rede.
- Os quatro usuários de teste da Massa de Dados sempre existem, mesmo em um navegador limpo, então testes de login não dependem de um cadastro prévio.

## Limpando o estado entre testes

Antes de cada teste (ou de cada suíte), vale limpar as chaves do `localStorage` para garantir um ambiente previsível:

- `qarena-auth`: contas cadastradas e sessão
- `qarena-carrinho`: itens do carrinho
- `qarena-pedidos`: histórico de pedidos
- `qarena-missoes`: progresso das Missões QA

## Fluxos recomendados para automação

| Fluxo | Passos | Por que vale automatizar |
| --- | --- | --- |
| Cadastro completo | Preencher formulário válido, confirmar modal, copiar número da conta | Golden path, roda em toda alteração no formulário |
| Login com massa de dados | Entrar com `usuario.sucesso@qazero.com` | Base de praticamente todos os outros fluxos |
| Rota protegida | Acessar `/app` deslogado e confirmar redirecionamento para `/login` | Garante que a autenticação continua obrigatória |
| Compra completa | Loja → adicionar produto → carrinho → checkout → finalizar compra | O fluxo mais longo do site, ótimo candidato a teste de regressão |
| Sessão persistente | Logar, recarregar a página, confirmar que continua logado | Depende da store, quebra fácil em refatorações |

## Exemplo em Cypress

```js
// cypress/e2e/login.cy.js
describe('Login', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/login')
  })

  it('entra com um usuário válido da massa de dados', () => {
    cy.get('[data-testid="login-input-email"]').type('usuario.sucesso@qazero.com')
    cy.get('[data-testid="login-input-senha"]').type('Qa@123456')
    cy.get('[data-testid="login-btn-entrar"]').click()

    cy.url().should('include', '/app')
    cy.get('[data-testid="dashboard-saudacao"]').should('be.visible')
  })
})
```

## Exemplo em Playwright

```ts
// tests/login.spec.ts
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page, context }) => {
  await context.clearCookies()
  await page.goto('/login')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('entra com um usuário válido da massa de dados', async ({ page }) => {
  await page.getByTestId('login-input-email').fill('usuario.sucesso@qazero.com')
  await page.getByTestId('login-input-senha').fill('Qa@123456')
  await page.getByTestId('login-btn-entrar').click()

  await expect(page).toHaveURL(/\/app/)
  await expect(page.getByTestId('dashboard-saudacao')).toBeVisible()
})
```

## Onde os testes de bug ficam mais interessantes

Os 33 bugs do QArena (catalogados na Central de Bugs) são bons candidatos a testes de regressão negativos: escreva o teste esperando o comportamento **correto**, descrito na página de Requisitos. Enquanto o bug existir, o teste falha, exatamente como aconteceria em um projeto real, e vira uma forma de acompanhar quais bugs já foram corrigidos ao longo do tempo.
