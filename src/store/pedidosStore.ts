import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemPedido {
  produtoId: string
  quantidade: number
  precoUnitario: number
}

export interface Pedido {
  id: string
  numeroPedido: string
  usuarioId: string
  itens: ItemPedido[]
  subtotal: number
  desconto: number
  total: number
  cupomUsado: string | null
  criadoEm: string
}

type DadosNovoPedido = Omit<Pedido, 'id' | 'numeroPedido' | 'criadoEm'>

interface PedidosState {
  pedidos: Pedido[]
  proximoNumero: number
  criarPedido: (dados: DadosNovoPedido) => Pedido
}

export const usePedidosStore = create<PedidosState>()(
  persist(
    (set, get) => ({
      pedidos: [],
      proximoNumero: 1,

      criarPedido: (dados) => {
        const estado = get()
        const numeroPedido = `PED-${String(estado.proximoNumero).padStart(4, '0')}`

        const pedido: Pedido = {
          ...dados,
          id: crypto.randomUUID(),
          numeroPedido,
          criadoEm: new Date().toISOString(),
        }

        set({ pedidos: [...estado.pedidos, pedido], proximoNumero: estado.proximoNumero + 1 })
        return pedido
      },
    }),
    { name: 'qarena-pedidos' },
  ),
)
