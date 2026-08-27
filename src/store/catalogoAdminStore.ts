import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Package } from 'lucide-react'
import { produtos as produtosBase, type Produto } from '@/data/produtos'
import { useAuthStore } from './authStore'

export type ProdutoAdmin = Omit<Produto, 'icone'>
export type EdicaoProduto = Partial<Omit<Produto, 'id' | 'icone'>>
export type DadosNovoProduto = Omit<ProdutoAdmin, 'id' | 'sku'>

interface CatalogoAdminState {
  produtosEditados: Record<string, EdicaoProduto>
  produtosCriados: ProdutoAdmin[]
  produtosExcluidos: string[]
  proximoNumeroSku: number
  editarProduto: (id: string, dados: EdicaoProduto) => void
  alternarEstoque: (id: string) => void
  alternarAtivo: (id: string) => void
  criarProduto: (dados: DadosNovoProduto) => void
  excluirProduto: (id: string) => void
}

function gerarIdProduto(nome: string): string {
  const slug = nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return `${slug}-${Date.now().toString(36)}`
}

export const useCatalogoAdminStore = create<CatalogoAdminState>()(
  persist(
    (set, get) => ({
      produtosEditados: {},
      produtosCriados: [],
      produtosExcluidos: [],
      proximoNumeroSku: 1,

      editarProduto: (id, dados) => {
        const estado = get()
        if (estado.produtosCriados.some((p) => p.id === id)) {
          set({
            produtosCriados: estado.produtosCriados.map((p) => (p.id === id ? { ...p, ...dados } : p)),
          })
          return
        }
        set({
          produtosEditados: {
            ...estado.produtosEditados,
            [id]: { ...estado.produtosEditados[id], ...dados },
          },
        })
      },

      alternarEstoque: (id) => {
        const estado = get()
        const base = produtosBase.find((p) => p.id === id) ?? estado.produtosCriados.find((p) => p.id === id)
        if (!base) return
        const editado = estado.produtosEditados[id]
        const estoqueAtual = editado?.estoque ?? base.estoque
        const novoEstoque = estoqueAtual > 0 ? 0 : base.estoque > 0 ? base.estoque : 10
        get().editarProduto(id, { estoque: novoEstoque })
      },

      alternarAtivo: (id) => {
        const estado = get()
        const base = produtosBase.find((p) => p.id === id) ?? estado.produtosCriados.find((p) => p.id === id)
        if (!base) return
        const editado = estado.produtosEditados[id]
        const ativoAtual = editado?.ativo ?? base.ativo
        get().editarProduto(id, { ativo: !ativoAtual })
      },

      criarProduto: (dados) => {
        const estado = get()
        const sku = `QAR-ADM-${String(estado.proximoNumeroSku).padStart(3, '0')}`
        const novo: ProdutoAdmin = { ...dados, id: gerarIdProduto(dados.nome), sku }
        set({
          produtosCriados: [...estado.produtosCriados, novo],
          proximoNumeroSku: estado.proximoNumeroSku + 1,
        })
      },

      excluirProduto: (id) => {
        const estado = get()
        if (estado.produtosCriados.some((p) => p.id === id)) {
          set({ produtosCriados: estado.produtosCriados.filter((p) => p.id !== id) })
          return
        }
        set({ produtosExcluidos: [...estado.produtosExcluidos, id] })
      },
    }),
    { name: 'qarena-catalogo-admin' },
  ),
)

export function useCatalogoProdutos(): Produto[] {
  const admin = useAuthStore((estado) => estado.usuarioLogado?.admin ?? false)
  const produtosEditados = useCatalogoAdminStore((estado) => estado.produtosEditados)
  const produtosCriados = useCatalogoAdminStore((estado) => estado.produtosCriados)
  const produtosExcluidos = useCatalogoAdminStore((estado) => estado.produtosExcluidos)

  if (!admin) return produtosBase

  const base = produtosBase
    .filter((p) => !produtosExcluidos.includes(p.id))
    .map((p) => (produtosEditados[p.id] ? { ...p, ...produtosEditados[p.id] } : p))

  const criados = produtosCriados
    .filter((p) => !produtosExcluidos.includes(p.id))
    .map((p) => ({ ...p, icone: Package }) as Produto)

  return [...base, ...criados]
}
