export type SimboloNivel = 'lupa' | 'inseto' | 'lupa-inseto' | 'alvo' | 'inseto-escudo' | 'coroa-lupa'

export interface CupomNivel {
  codigo: string
  percentual: number
  curso: string
}

export interface NivelConfig {
  numero: number
  nome: string
  missoesNecessarias: number
  simbolo: SimboloNivel
  gradiente: string[]
  neon: string
  cupons?: CupomNivel[]
}

export const niveis: NivelConfig[] = [
  {
    numero: 1,
    nome: 'Estagiário de Testes',
    missoesNecessarias: 0,
    simbolo: 'lupa',
    gradiente: ['#5b6480', '#1a1d2e'],
    neon: '#8892a8',
  },
  {
    numero: 2,
    nome: 'Caçador Iniciante',
    missoesNecessarias: 4,
    simbolo: 'inseto',
    gradiente: ['#2f6fd8', '#0e1f45'],
    neon: '#3b82f6',
  },
  {
    numero: 3,
    nome: 'Explorador de Bugs',
    missoesNecessarias: 8,
    simbolo: 'lupa-inseto',
    gradiente: ['#16a8c4', '#062b36'],
    neon: '#22d3ee',
  },
  {
    numero: 4,
    nome: 'Analista Afiado',
    missoesNecessarias: 12,
    simbolo: 'alvo',
    gradiente: ['#7c3aed', '#1e0d3d'],
    neon: '#a855f7',
    cupons: [{ codigo: 'QARENA5', percentual: 5, curso: 'QA do Zero' }],
  },
  {
    numero: 5,
    nome: 'Bug Hunter',
    missoesNecessarias: 16,
    simbolo: 'inseto-escudo',
    gradiente: ['#e935c1', '#3d0a33'],
    neon: '#f472d0',
    cupons: [{ codigo: 'QARENA10', percentual: 10, curso: 'QA do Zero' }],
  },
  {
    numero: 6,
    nome: 'Lenda da QArena',
    missoesNecessarias: 20,
    simbolo: 'coroa-lupa',
    gradiente: ['#22d3ee', '#8b5cf6', '#ec4faf'],
    neon: '#22d3ee',
    cupons: [
      { codigo: 'QARENA15', percentual: 15, curso: 'QA do Zero' },
      { codigo: 'QARENACLAUDE15', percentual: 15, curso: 'IA para QA e Tech: Claude Além do Prompt' },
    ],
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
    .filter((n) => quantidadeConcluidas >= n.missoesNecessarias)
    .flatMap((n) => n.cupons ?? [])
}
