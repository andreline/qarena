# QArena: o playground dos QAs

Ambiente de treino para QAs praticarem testes manuais, testes exploratórios e bug report em uma loja fictícia com 33 bugs plantados de propósito.

Projeto educacional criado por [Andreline Lira](https://github.com/andreline), parte do ecossistema **QA do Zero**.

Ambiente fictício. Todos os dados, produtos e pedidos são simulados para fins de estudo. Nunca use dados reais aqui.

**Site publicado:** [qarenaqa.vercel.app](https://qarenaqa.vercel.app)

## O que é

O QArena simula uma loja fictícia com cadastro, login, carrinho, cupom, checkout, perfil e pedidos, para quem está aprendendo QA praticar em um ambiente seguro, sem depender de um sistema real. A pessoa cria a própria conta, navega pelo site e vai encontrando problemas plantados de propósito em cada tela, do jeito que aconteceria em um sistema de produção de verdade.

## Laboratórios

| Tela | Bugs plantados |
| --- | --- |
| Cadastro | 6 |
| Login | 6 |
| Loja | 3 |
| Carrinho | 3 |
| Cupom e Checkout | 7 |
| Perfil do Usuário | 4 |
| Meus Pedidos | 4 |
| **Total** | **33** |

O gabarito completo (com aviso de spoiler) fica na página **Central de Bugs**, dentro do próprio site.

## Funcionalidades

- Cadastro e login reais, com sessão persistente no navegador
- Rota protegida para a área logada
- Loja com busca, filtro por categoria e carrinho de compras
- Cupom de desconto e checkout com créditos QA
- Perfil editável e histórico de pedidos
- Página de Requisitos, com o comportamento esperado de cada tela
- Massa de dados pronta para copiar (usuários e cupons de teste)
- Missões QA, desafios guiados de investigação
- Central de Bugs, o gabarito completo

## Stack

| Camada | Tecnologia |
| --- | --- |
| Build | Vite |
| UI | React 19 |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Rotas | React Router v7 |
| Estado | Zustand (com persistência em `localStorage`) |
| Deploy | Vercel |

Este projeto é 100% front-end. Não existe backend, banco de dados ou autenticação real, tudo funciona no navegador de quem acessa.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Para gerar a build de produção:

```bash
npm run build
```

## Estrutura de pastas

```
src/
├── components/    # componentes de interface e de layout
├── data/          # dados estáticos (produtos, cupons, bugs, missões, laboratórios)
├── pages/         # uma página por rota
├── store/         # estado global (Zustand): sessão, carrinho, pedidos, missões
└── lib/           # funções utilitárias (máscaras, validações, classes CSS)
```

## Convenção de testes

Todo elemento interativo do site tem um atributo `data-testid`, no padrão `{contexto}-{tipo}-{nome}` (por exemplo, `login-btn-entrar`), pensado para facilitar tanto o teste manual quanto a automação.

## Licença

Todos os direitos reservados. Este código é aberto para visualização e fins de estudo, mas não está licenciado para cópia, redistribuição ou reuso, integral ou parcial, sem autorização prévia de [Andreline Lira](https://github.com/andreline).
