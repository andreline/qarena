export type TipoCupom = 'percentual' | 'fixo'

export interface Cupom {
  codigo: string
  tipo: TipoCupom
  percentualAnunciado?: number
  percentualAplicado?: number
  valorFixo?: number
  categoriaRestrita?: string
  usoUnico?: boolean
  validoAte: string
  descricao: string
}

export const cupons: Cupom[] = [
  {
    codigo: 'QA10',
    tipo: 'percentual',
    percentualAnunciado: 10,
    percentualAplicado: 5,
    validoAte: '2027-12-31',
    descricao: 'Cupom de boas-vindas, 10% de desconto',
  },
  {
    codigo: 'BEMVINDO15',
    tipo: 'percentual',
    percentualAnunciado: 15,
    percentualAplicado: 15,
    validoAte: '2027-12-31',
    descricao: '15% de desconto para novos alunos',
  },
  {
    codigo: 'PROMOEXPIRADA',
    tipo: 'percentual',
    percentualAnunciado: 20,
    percentualAplicado: 20,
    validoAte: '2024-01-01',
    descricao: 'Promoção antiga, já deveria estar fora do ar',
  },
  {
    codigo: 'MENOS15REAIS',
    tipo: 'fixo',
    valorFixo: 15,
    validoAte: '2027-12-31',
    descricao: 'R$ 15,00 de desconto direto, sem percentual',
  },
  {
    codigo: 'PAPELARIA10',
    tipo: 'percentual',
    percentualAnunciado: 10,
    percentualAplicado: 10,
    categoriaRestrita: 'Papelaria',
    validoAte: '2027-12-31',
    descricao: '10% de desconto, válido só para produtos de Papelaria',
  },
  {
    codigo: 'PRIMEIRACOMPRA',
    tipo: 'percentual',
    percentualAnunciado: 8,
    percentualAplicado: 8,
    usoUnico: true,
    validoAte: '2027-12-31',
    descricao: '8% de desconto, uso único por conta',
  },
  {
    codigo: 'verao2026',
    tipo: 'percentual',
    percentualAnunciado: 12,
    percentualAplicado: 12,
    validoAte: '2027-03-31',
    descricao: '12% de desconto de verão',
  },
]
