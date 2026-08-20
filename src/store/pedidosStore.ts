import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ItemPedido {
  produtoId: string
  quantidade: number
  precoUnitario: number
}

export type StatusPedido = 'Processando' | 'Enviado' | 'Entregue'

export interface Pedido {
  id: string
  numeroPedido: string
  usuarioId: string
  itens: ItemPedido[]
  subtotal: number
  desconto: number
  total: number
  cupomUsado: string | null
  status: StatusPedido
  criadoEm: string
}

type DadosNovoPedido = Omit<Pedido, 'id' | 'numeroPedido' | 'criadoEm' | 'status'>

const statusPossiveis: StatusPedido[] = ['Processando', 'Enviado', 'Entregue']

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
        const status = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)]

        const pedido: Pedido = {
          ...dados,
          id: crypto.randomUUID(),
          numeroPedido,
          status,
          criadoEm: new Date().toISOString(),
        }

        set({ pedidos: [...estado.pedidos, pedido], proximoNumero: estado.proximoNumero + 1 })
        return pedido
      },
    }),
    { name: 'qarena-pedidos' },
  ),
)
