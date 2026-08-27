export type NivelMissao = 'Fácil' | 'Médio' | 'Difícil'

export interface Missao {
  id: string
  titulo: string
  tela: string
  nivel: NivelMissao
  objetivo: string
  desafio: string
  oQueInvestigar: string[]
  massaDadosRecomendada?: string
  dica?: string
}

export const missoes: Missao[] = [
  {
    id: 'cadastro-sob-suspeita',
    titulo: 'Cadastro sob suspeita',
    tela: 'Cadastro',
    nivel: 'Fácil',
    objetivo: 'Testar os limites de validação do formulário de Cadastro.',
    desafio:
      'Tente cadastrar uma conta pulando alguma etapa, ou preenchendo um campo de um jeito que não deveria ser aceito. Anote o que você esperava que acontecesse e o que realmente aconteceu.',
    oQueInvestigar: [
      'O que acontece se você não marcar o aceite dos termos?',
      'O que acontece se você digitar um CPF com números aleatórios?',
      'O que acontece se a senha e a confirmação de senha forem diferentes?',
    ],
    massaDadosRecomendada: 'Um CPF fictício gerado em Massa de Dados, e um e-mail qualquer ainda não usado.',
    dica: 'Preste atenção no que a tela mostra logo depois de clicar em "Criar minha conta", antes mesmo de conferir se a conta foi criada de verdade.',
  },
  {
    id: 'portas-trancadas',
    titulo: 'Portas trancadas',
    tela: 'Login',
    nivel: 'Fácil',
    objetivo: 'Testar o comportamento do login para diferentes tipos de usuário.',
    desafio:
      'Use os usuários da Massa de Dados para testar o login. Algum deles consegue (ou não consegue) entrar de um jeito diferente do que você esperava?',
    oQueInvestigar: [
      'O usuário bloqueado consegue entrar?',
      'O usuário suspenso consegue entrar?',
      'O que a tela mostra quando a senha está incorreta?',
    ],
    massaDadosRecomendada: 'Os usuários de teste disponíveis em Massa de Dados.',
  },
  {
    id: 'vitrine-enganosa',
    titulo: 'Vitrine enganosa',
    tela: 'Loja',
    nivel: 'Médio',
    objetivo: 'Testar se a busca e o filtro da Loja realmente restringem os resultados ao que foi pedido.',
    desafio: 'Use o filtro de categoria e a busca da loja ao mesmo tempo. Os resultados realmente batem com o que você pediu?',
    oQueInvestigar: [
      'Escolha uma categoria específica. A lista de produtos muda?',
      'Digite o nome de um produto todo em letras minúsculas. Ele aparece?',
    ],
    dica: 'Tente combinar categoria e busca ao mesmo tempo, e veja se um interfere no outro.',
  },
  {
    id: 'matematica-de-carrinho',
    titulo: 'Matemática de carrinho',
    tela: 'Carrinho',
    nivel: 'Médio',
    objetivo: 'Conferir se os cálculos do carrinho batem com a matemática simples.',
    desafio: 'Adicione mais de uma unidade de um produto, altere a quantidade e confira o total com uma calculadora. Fechou a conta?',
    oQueInvestigar: [
      'Some duas ou mais unidades de um mesmo item e confira o subtotal da linha.',
      'Remova um item e veja se o contador do carrinho, na barra lateral, acompanha.',
      'Diminua a quantidade de um item até o limite mínimo.',
    ],
    dica: 'Uma calculadora resolve mais rápido do que parece.',
  },
  {
    id: 'o-cupom-suspeito',
    titulo: 'O cupom suspeito',
    tela: 'Cupom e Checkout',
    nivel: 'Médio',
    objetivo: 'Verificar se o desconto de um cupom bate com o percentual que ele promete.',
    desafio: 'Aplique o cupom QA10 no checkout e confira, na mão, se o desconto é mesmo o percentual anunciado.',
    oQueInvestigar: [
      'Aplique o cupom e anote o valor do desconto exibido.',
      'Calcule quanto 10% do subtotal deveria valer.',
      'Compare os dois números.',
    ],
    massaDadosRecomendada: 'Cupom QA10, disponível em Massa de Dados.',
  },
  {
    id: 'meus-dados-minhas-regras',
    titulo: 'Meus dados, minhas regras',
    tela: 'Perfil do Usuário',
    nivel: 'Difícil',
    objetivo: 'Testar se as validações do Perfil realmente protegem a conta.',
    desafio: 'Tente trocar sua senha informando a senha atual errada de propósito. O sistema deveria deixar?',
    oQueInvestigar: [
      'Tente trocar a senha informando a senha atual errada.',
      'Tente salvar o formulário de dados com o nome em branco.',
      'Tente editar seu e-mail para um que já pertence a outra conta.',
    ],
    dica: 'Nem toda validação que parece existir na tela realmente bloqueia alguma coisa.',
  },
  {
    id: 'pedidos-de-outra-pessoa',
    titulo: 'Pedidos de outra pessoa',
    tela: 'Meus Pedidos',
    nivel: 'Difícil',
    objetivo: 'Verificar se o histórico de pedidos respeita a separação entre contas diferentes.',
    desafio: 'Crie um pedido com duas contas diferentes e compare o que cada uma enxerga na tela de Meus Pedidos.',
    oQueInvestigar: [
      'Finalize uma compra com a primeira conta.',
      'Saia e entre com uma segunda conta.',
      'Veja se a segunda conta enxerga o pedido da primeira em Meus Pedidos.',
    ],
    massaDadosRecomendada: 'Duas contas diferentes, cadastradas por você ou da Massa de Dados.',
  },
  {
    id: 'cacador-completo',
    titulo: 'Caçador completo',
    tela: 'Todo o QArena',
    nivel: 'Difícil',
    objetivo: 'Consolidar tudo o que você encontrou sozinho e conferir seu placar final.',
    desafio: 'Depois de investigar sozinho, vá até a Central de Bugs e confira quantos dos bugs você encontrou por conta própria.',
    oQueInvestigar: [
      'Revise suas anotações de todas as missões anteriores.',
      'Vá até a Central de Bugs e compare com o que você encontrou.',
    ],
    dica: 'Não é sobre acertar tudo, é sobre construir o hábito de desconfiar do que a tela mostra.',
  },
]
