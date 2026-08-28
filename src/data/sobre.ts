export interface SecaoSobre {
  id: string
  titulo: string
  paragrafos: string[]
}

export const aberturaSobre = {
  titulo: 'Prazer, eu sou a Andreline',
  texto:
    'Engenheira de Qualidade de Software Sênior, com quase dez anos de estrada em QA. E fui eu que construí a QArena, do primeiro requisito até o último bug plantado.',
}

export const secoesSobre: SecaoSobre[] = [
  {
    id: 'formacao',
    titulo: 'Minha formação',
    paragrafos: [
      'Sou pós-graduada em Gestão da Qualidade de Software e em Gestão Ágil de Projetos.',
      'Passei esses anos todos trabalhando com requisito, cenário de teste, critério de aceite e processo de qualidade dentro de time de produto. É de onde vem tudo que eu ensino: não é teoria de livro, é o que eu faço no meu dia.',
    ],
  },
  {
    id: 'diversao',
    titulo: 'Eu gosto que qualidade seja divertida',
    paragrafos: [
      'Quando eu entrei na área, tudo era muito técnico. Termo difícil, texto engessado, um monte de gente falando complicado sobre coisa que dava pra explicar de forma simples. E eu sempre achei isso estranho, porque tecnologia é divertida. Falar sobre tecnologia não precisa ser chato.',
      'Então eu ensino do jeito que eu queria ter aprendido: direto, prático e leve. Sem lenga lenga técnica, sem enfeite, sem parecer manual de instrução. Dá pra ser profissional e ser divertida ao mesmo tempo, e é assim que eu gosto de trabalhar.',
    ],
  },
  {
    id: 'nao-e-so-achar-bug',
    titulo: 'Qualidade não é só achar bug',
    paragrafos: [
      'Muita gente entra em QA achando que o trabalho é caçar erro na tela. É parte do trabalho, mas é a menor parte dele.',
      'Qualidade começa lá atrás, quando a ideia ainda é só ideia. Está no refinamento, no requisito, na pergunta que você faz antes de alguém escrever a primeira linha de código. E continua depois da entrega, no que você observa, mede e melhora.',
      'Eu quero formar QA que planeja, que refina, que constrói junto com o time. Não só quem aponta o que quebrou.',
    ],
  },
  {
    id: 'porque-a-qarena-existe',
    titulo: 'Por que a QArena existe',
    paragrafos: [
      'Eu ensino, passo atividade, passo missão, peço bug report, mando fazer teste exploratório, falo de cenário e de regressão. E sempre batia a mesma coisa: praticar onde?',
      'Sempre usei alguns ambientes de prática muito bons, que ajudam demais e que eu indico até hoje. Só que eu queria algo mais completo. Um ambiente meu, com mais fluxos conectados, com requisito documentado tela por tela, e com bugs que eu mesma escolhi plantar pensando exatamente no que eu ensino em cada aula.',
      'Quando terminei, achei tão legal que resolvi abrir pra todo mundo, público e gratuito.',
    ],
  },
  {
    id: 'pra-todo-mundo',
    titulo: 'A QArena é pra todo mundo',
    paragrafos: [
      'Não é só pra QA.',
      'Dev que quer entender como o teste enxerga o código dele, pessoa de produto que quer treinar a escrever requisito melhor, designer que quer olhar consistência de interface, gente em transição de carreira, estudante, curioso. Todo mundo é bem-vindo.',
      'A ideia é se divertir e aprender. Usa pra documentação, pra bug report, pra montar plano de teste, pra treinar prompt de IA, pra praticar automação. É ambiente de treino, então usa do jeito que fizer sentido pra você.',
    ],
  },
  {
    id: 'como-foi-feito',
    titulo: 'Como este site foi feito',
    paragrafos: [
      'Com toda a transparência: codar nunca foi o meu forte.',
      'O que eu fiz foi a parte que é minha. Desenhei o produto inteiro antes de existir uma linha de código: arquitetura, fluxo de navegação, identidade visual, catálogo de bugs intencionais, requisito de cada tela, o que eu queria que desse pra testar em cada ponto.',
      'Só depois disso abri o Claude Code e mandei construir por etapas. Ele construía, eu testava, achava coisa errada, mandava voltar, corrigia, aprovava e seguia pra próxima. Vibe Coding, e foi muito doido ver isso saindo do papel em um dia.',
    ],
  },
  {
    id: 'nao-para',
    titulo: 'Isso aqui não para',
    paragrafos: [
      'A QArena vai continuar evoluindo. Sempre vai ter tela nova, bug novo, missão nova, conteúdo novo.',
      'O código está todo aberto no GitHub, então dá pra acompanhar por lá. E eu produzo bastante conteúdo sobre qualidade nas minhas redes, então me segue lá também pra ficar por dentro do que está saindo.',
    ],
  },
]

export const tituloRedesSobre = 'Vem comigo'

export const convitecursoSobre = {
  textoAntes: 'Se você quer ir além da prática, eu tenho o curso ',
  destaque: 'QA do Zero: A Base que Todo Analista de Qualidade Precisa Ter',
  textoDepois:
    ', feito pra quem está começando ou em transição de carreira. Tem também a Comunidade QA do Zero, onde a galera troca ideia e tira dúvida.',
}
