export interface Cupom {
  codigo: string
  percentualAnunciado: number
  percentualAplicado: number
  validoAte: string
  descricao: string
}

export const cupons: Cupom[] = [
  {
    codigo: 'QA10',
    percentualAnunciado: 10,
    percentualAplicado: 5,
    validoAte: '2027-12-31',
    descricao: 'Cupom de boas-vindas, 10% de desconto',
  },
  {
    codigo: 'BEMVINDO15',
    percentualAnunciado: 15,
    percentualAplicado: 15,
    validoAte: '2027-12-31',
    descricao: '15% de desconto para novos alunos',
  },
  {
    codigo: 'PROMOEXPIRADA',
    percentualAnunciado: 20,
    percentualAplicado: 20,
    validoAte: '2024-01-01',
    descricao: 'Promoção antiga, já deveria estar fora do ar',
  },
]
