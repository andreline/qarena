import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemCarrinho {
  produtoId: string
  quantidade: number
}

interface CarrinhoState {
  itens: ItemCarrinho[]
  quantidadeTotal: number
  adicionar: (produtoId: string) => void
  atualizarQuantidade: (produtoId: string, quantidade: number) => void
  remover: (produtoId: string) => void
  limpar: () => void
}

export const useCarrinhoStore = create<CarrinhoState>()(
  persist(
    (set, get) => ({
      itens: [],
      quantidadeTotal: 0,

      adicionar: (produtoId) => {
        const estado = get()
        const existente = estado.itens.find((item) => item.produtoId === produtoId)
        const novosItens = existente
          ? estado.itens.map((item) =>
              item.produtoId === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item,
            )
          : [...estado.itens, { produtoId, quantidade: 1 }]

        set({ itens: novosItens, quantidadeTotal: estado.quantidadeTotal + 1 })
      },

      atualizarQuantidade: (produtoId, quantidade) => {
        const estado = get()
        const itemAtual = estado.itens.find((item) => item.produtoId === produtoId)
        if (!itemAtual) return
        const diferenca = quantidade - itemAtual.quantidade

        set({
          itens: estado.itens.map((item) => (item.produtoId === produtoId ? { ...item, quantidade } : item)),
          quantidadeTotal: estado.quantidadeTotal + diferenca,
        })
      },

      remover: (produtoId) => {
        const estado = get()
        set({ itens: estado.itens.filter((item) => item.produtoId !== produtoId) })
      },

      limpar: () => set({ itens: [], quantidadeTotal: 0 }),
    }),
    { name: 'qarena-carrinho' },
  ),
)
