export interface Missao {
  id: string
  titulo: string
  tela: string
  desafio: string
}

export const missoes: Missao[] = [
  {
    id: 'cadastro-sob-suspeita',
    titulo: 'Cadastro sob suspeita',
    tela: 'Cadastro',
    desafio:
      'Tente cadastrar uma conta pulando alguma etapa, ou preenchendo um campo de um jeito que não deveria ser aceito. Anote o que você esperava que acontecesse e o que realmente aconteceu.',
  },
  {
    id: 'portas-trancadas',
    titulo: 'Portas trancadas',
    tela: 'Login',
    desafio:
      'Use os quatro usuários da Massa de Dados para testar o login. Algum deles consegue (ou não consegue) entrar de um jeito diferente do que você esperava?',
  },
  {
    id: 'vitrine-enganosa',
    titulo: 'Vitrine enganosa',
    tela: 'Loja',
    desafio: 'Use o filtro de categoria e a busca da loja ao mesmo tempo. Os resultados realmente batem com o que você pediu?',
  },
  {
    id: 'matematica-de-carrinho',
    titulo: 'Matemática de carrinho',
    tela: 'Carrinho',
    desafio: 'Adicione mais de uma unidade de um produto, altere a quantidade e confira o total com uma calculadora. Fechou a conta?',
  },
  {
    id: 'o-cupom-suspeito',
    titulo: 'O cupom suspeito',
    tela: 'Checkout',
    desafio: 'Aplique o cupom QA10 no checkout e confira, na mão, se o desconto é mesmo o percentual anunciado.',
  },
  {
    id: 'meus-dados-minhas-regras',
    titulo: 'Meus dados, minhas regras',
    tela: 'Perfil do Usuário',
    desafio: 'Tente trocar sua senha informando a senha atual errada de propósito. O sistema deveria deixar?',
  },
  {
    id: 'pedidos-de-outra-pessoa',
    titulo: 'Pedidos de outra pessoa',
    tela: 'Meus Pedidos',
    desafio: 'Crie um pedido com duas contas diferentes e compare o que cada uma enxerga na tela de Meus Pedidos.',
  },
  {
    id: 'cacador-completo',
    titulo: 'Caçador completo',
    tela: 'Todo o QArena',
    desafio: 'Depois de investigar sozinho, vá até a Central de Bugs e confira quantos dos 33 bugs você encontrou por conta própria.',
  },
]
