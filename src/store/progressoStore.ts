import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface BugReportMissao {
  titulo: string
  preCondicao: string
  passos: string
  resultadoAtual: string
  resultadoEsperado: string
  severidade: string
  prioridade: string
  observacoes: string
  salvoEm: string
}

interface ProgressoState {
  missoesConcluidas: string[]
  missoesEmAndamento: string[]
  dicasUsadas: string[]
  bugReports: Record<string, BugReportMissao>
  niveisCelebrados: number[]
  primeiroAcesso: string | null
  contadorSessoes: number

  registrarSessao: () => void
  abrirMissao: (id: string) => void
  concluirMissao: (id: string) => void
  usarDica: (id: string) => void
  salvarBugReport: (id: string, dados: Omit<BugReportMissao, 'salvoEm'>) => void
  marcarNivelCelebrado: (numero: number) => void
  resetarProgresso: () => void
  exportarBackup: () => string
  importarBackup: (codigo: string) => boolean
}

const estadoInicial = {
  missoesConcluidas: [] as string[],
  missoesEmAndamento: [] as string[],
  dicasUsadas: [] as string[],
  bugReports: {} as Record<string, BugReportMissao>,
  niveisCelebrados: [] as number[],
  primeiroAcesso: null as string | null,
  contadorSessoes: 0,
}

const PREFIXO_BACKUP = 'QARENA-BKP1:'

function codificarBackup(dados: unknown): string {
  const json = JSON.stringify(dados)
  return PREFIXO_BACKUP + btoa(unescape(encodeURIComponent(json)))
}

function decodificarBackup(codigo: string): Partial<typeof estadoInicial> | null {
  try {
    const limpo = codigo.replace(/\s+/g, '')
    if (!limpo.startsWith(PREFIXO_BACKUP)) return null
    const json = decodeURIComponent(escape(atob(limpo.slice(PREFIXO_BACKUP.length))))
    const dados = JSON.parse(json)
    if (!dados || !Array.isArray(dados.missoesConcluidas)) return null
    return dados
  } catch {
    return null
  }
}

export const useProgressoStore = create<ProgressoState>()(
  persist(
    (set, get) => ({
      ...estadoInicial,

      registrarSessao: () => {
        const estado = get()
        set({
          primeiroAcesso: estado.primeiroAcesso ?? new Date().toISOString(),
          contadorSessoes: estado.contadorSessoes + 1,
        })
      },

      abrirMissao: (id) => {
        const estado = get()
        if (estado.missoesConcluidas.includes(id) || estado.missoesEmAndamento.includes(id)) return
        set({ missoesEmAndamento: [...estado.missoesEmAndamento, id] })
      },

      concluirMissao: (id) => {
        const estado = get()
        if (estado.missoesConcluidas.includes(id)) return
        set({
          missoesConcluidas: [...estado.missoesConcluidas, id],
          missoesEmAndamento: estado.missoesEmAndamento.filter((item) => item !== id),
        })
      },

      usarDica: (id) => {
        const estado = get()
        if (estado.dicasUsadas.includes(id)) return
        set({ dicasUsadas: [...estado.dicasUsadas, id] })
      },

      salvarBugReport: (id, dados) => {
        const estado = get()
        set({
          bugReports: {
            ...estado.bugReports,
            [id]: { ...dados, salvoEm: new Date().toISOString() },
          },
        })
      },

      marcarNivelCelebrado: (numero) => {
        const estado = get()
        if (estado.niveisCelebrados.includes(numero)) return
        set({ niveisCelebrados: [...estado.niveisCelebrados, numero] })
      },

      resetarProgresso: () => set({ ...estadoInicial }),

      exportarBackup: () => {
        const estado = get()
        return codificarBackup({
          missoesConcluidas: estado.missoesConcluidas,
          missoesEmAndamento: estado.missoesEmAndamento,
          dicasUsadas: estado.dicasUsadas,
          bugReports: estado.bugReports,
          niveisCelebrados: estado.niveisCelebrados,
          primeiroAcesso: estado.primeiroAcesso,
          contadorSessoes: estado.contadorSessoes,
        })
      },

      importarBackup: (codigo) => {
        const dados = decodificarBackup(codigo)
        if (!dados) return false
        set({
          missoesConcluidas: dados.missoesConcluidas ?? [],
          missoesEmAndamento: dados.missoesEmAndamento ?? [],
          dicasUsadas: dados.dicasUsadas ?? [],
          bugReports: dados.bugReports ?? {},
          niveisCelebrados: dados.niveisCelebrados ?? [],
          primeiroAcesso: dados.primeiroAcesso ?? null,
          contadorSessoes: dados.contadorSessoes ?? 0,
        })
        return true
      },
    }),
    { name: 'qarena-progresso' },
  ),
)
