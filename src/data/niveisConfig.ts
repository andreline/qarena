export type SimboloNivel = 'lupa' | 'inseto' | 'lupa-inseto' | 'alvo' | 'inseto-capturado' | 'coroa-grande'

export interface CupomNivel {
  codigo: string
  percentual: number
}

export interface NivelConfig {
  numero: number
  nome: string
  missoesNecessarias: number
  simbolo: SimboloNivel
  gradiente: [string, string]
  comCoroa: boolean
  cupom?: CupomNivel
}

export const niveis: NivelConfig[] = [
  {
    numero: 1,
    nome: 'Estagiário de Testes',
    missoesNecessarias: 0,
    simbolo: 'lupa',
    gradiente: ['#64748b', '#334155'],
    comCoroa: false,
  },
  {
    numero: 2,
    nome: 'Caçador Iniciante',
    missoesNecessarias: 4,
    simbolo: 'inseto',
    gradiente: ['#b87333', '#8a5522'],
    comCoroa: false,
  },
  {
    numero: 3,
    nome: 'Explorador de Bugs',
    missoesNecessarias: 8,
    simbolo: 'lupa-inseto',
    gradiente: ['#c0c8d8', '#8892a8'],
    comCoroa: false,
  },
  {
    numero: 4,
    nome: 'Analista Afiado',
    missoesNecessarias: 12,
    simbolo: 'alvo',
    gradiente: ['#67e8f9', '#0891b2'],
    comCoroa: true,
    cupom: { codigo: 'QARENA5', percentual: 5 },
  },
  {
    numero: 5,
    nome: 'Bug Hunter',
    missoesNecessarias: 16,
    simbolo: 'inseto-capturado',
    gradiente: ['#ffd45e', '#d99e1f'],
    comCoroa: true,
    cupom: { codigo: 'QARENA10', percentual: 10 },
  },
  {
    numero: 6,
    nome: 'Lenda da QArena',
    missoesNecessarias: 20,
    simbolo: 'coroa-grande',
    gradiente: ['#22d3ee', '#c026d3'],
    comCoroa: true,
    cupom: { codigo: 'QARENA15', percentual: 15 },
  },
]

export const totalMissoes = 20

export function nivelPorNumero(numero: number): NivelConfig {
  return niveis.find((n) => n.numero === numero) ?? niveis[0]
}

export function calcularNivelAtual(quantidadeConcluidas: number): NivelConfig {
  let atual = niveis[0]
  for (const nivel of niveis) {
    if (quantidadeConcluidas >= nivel.missoesNecessarias) atual = nivel
  }
  return atual
}

export function calcularProximoNivel(quantidadeConcluidas: number): NivelConfig | null {
  const atual = calcularNivelAtual(quantidadeConcluidas)
  return niveis.find((n) => n.numero === atual.numero + 1) ?? null
}

export function cuponsDesbloqueados(quantidadeConcluidas: number): CupomNivel[] {
  return niveis
    .filter((n) => n.cupom && quantidadeConcluidas >= n.missoesNecessarias)
    .map((n) => n.cupom as CupomNivel)
}
