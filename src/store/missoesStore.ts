import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface MissoesState {
  concluidas: string[]
  alternarConclusao: (id: string) => void
}

export const useMissoesStore = create<MissoesState>()(
  persist(
    (set, get) => ({
      concluidas: [],

      alternarConclusao: (id) => {
        const estado = get()
        const jaConcluida = estado.concluidas.includes(id)
        set({
          concluidas: jaConcluida
            ? estado.concluidas.filter((item) => item !== id)
            : [...estado.concluidas, id],
        })
      },
    }),
    { name: 'qarena-missoes' },
  ),
)
