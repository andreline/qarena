# QArena: o playground dos QAs

Ambiente de treino para QAs praticarem testes manuais, testes exploratórios e bug report em uma loja fictícia com 81 bugs plantados de propósito.

Projeto educacional criado por [Andreline Lira](https://github.com/andreline), Engenheira de Qualidade de Software Sênior, parte do ecossistema **QA do Zero**.

Ambiente fictício. Todos os dados, produtos e pedidos são simulados para fins de estudo. Nunca use dados reais aqui.

**Site publicado:** [qarenaqa.vercel.app](https://qarenaqa.vercel.app)

## O que é

O QArena simula um sistema fictício completo (cadastro, login, loja, carrinho, cupom, checkout, perfil, pedidos, área administrativa, recuperação de senha e uma caixa de e-mail simulada), para quem está aprendendo QA praticar em um ambiente seguro, sem depender de um sistema real. A pessoa cria a própria conta, navega pelo site e vai encontrando problemas plantados de propósito em cada tela, do jeito que aconteceria em um sistema de produção de verdade. Existem também perfis de teste prontos (cadastro pendente, administrador, conta inativa, primeiro acesso) que reproduzem sempre o mesmo cenário, mesmo com várias pessoas testando ao mesmo tempo.

Além de caçar bug livremente, o QArena tem uma trilha de **Missões QA** guiadas, com níveis, escudos e cupons de desconto reais para o curso, para dar uma progressão de jogo ao treino.

## Laboratórios

| Tela | Bugs plantados |
| --- | --- |
| Cadastro | 7 |
| Login | 12 |
| Loja | 15 |
| Carrinho | 5 |
| Cupom e Checkout | 7 |
| Perfil do Usuário | 5 |
| Meus Pedidos | 4 |
| Área Administrativa | 8 |
| Recuperação de Senha | 7 |
| Caixa de Entrada | 10 |
| **Total nos laboratórios** | **80** |

Existe ainda 1 bug extra de exemplo na página de Massa de Dados, totalizando **81 bugs** no ambiente.

O gabarito completo (com aviso de spoiler) fica na página **Central de Bugs**, dentro do próprio site.

## Funcionalidades

- Cadastro e login reais, com sessão persistente no navegador
- Rota protegida para a área logada
- Perfis de teste prontos e reutilizáveis: cadastro pendente, administrador, conta inativa e primeiro acesso
- Loja com busca, filtro por categoria e carrinho de compras
- Cupom de desconto e checkout com créditos QA
- Perfil editável e histórico de pedidos
- Área administrativa para gerenciar o catálogo de produtos
- Fluxo de recuperação de senha, com link e token
- Caixa de entrada simulada, com os e-mails que o sistema dispara
- Página de Requisitos, com o comportamento esperado de cada tela
- Massa de dados pronta para copiar (usuários, cupons e CPFs de teste)
- Missões QA guiadas, com níveis, escudos animados e cupons de desconto reais
- Painel de progresso, com trilha de níveis e backup/restauração via código
- Central de Bugs, o gabarito completo
- Página sobre a criadora, sem nenhum bug plantado

## Missões, níveis e progresso

A trilha de missões (`/missoes`) tem 20 desafios guiados, cada um ligado a um bug de verdade do catálogo. Concluir uma missão exige acertar em qual tela o problema acontece e qual era o resultado esperado, não só marcar como feito.

Ao completar missões, a pessoa sobe de nível (de Estagiário de Testes até Lenda da QArena) e ganha um escudo animado próprio de cada nível. Os três últimos níveis destravam cupons de desconto reais para o curso **QA do Zero**. Como o projeto não tem backend, o progresso fica salvo no `localStorage` do navegador; a página de Progresso (`/progresso`) tem um recurso de backup que gera um código para restaurar o progresso em outro navegador ou aparelho.

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
├── components/    # componentes de interface e de layout (inclui o Escudo dos níveis)
├── data/          # dados estáticos (produtos, cupons, bugs, missões, laboratórios, níveis)
├── pages/         # uma página por rota
├── store/         # estado global (Zustand): sessão, carrinho, catálogo admin, pedidos, e-mails, progresso
└── lib/           # funções utilitárias (máscaras, validações, classes CSS)
```

## Convenção de testes

Todo elemento interativo do site tem um atributo `data-testid`, no padrão `{contexto}-{tipo}-{nome}` (por exemplo, `login-btn-entrar`), pensado para facilitar tanto o teste manual quanto a automação.

## Licença

Todos os direitos reservados. Este código é aberto para visualização e fins de estudo, mas não está licenciado para cópia, redistribuição ou reuso, integral ou parcial, sem autorização prévia de [Andreline Lira](https://github.com/andreline).
