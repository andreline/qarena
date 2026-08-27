import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pedidosSeed, type PedidoSeed, type ItemPedido, type StatusPedido } from '@/data/pedidos'

export type { ItemPedido, StatusPedido }

export interface Pedido extends PedidoSeed {
  id: string
}

type DadosNovoPedido = Omit<Pedido, 'id' | 'numeroPedido' | 'criadoEm' | 'status'>

const statusPossiveis: StatusPedido[] = ['Pago', 'Enviado', 'Entregue']

interface PedidosState {
  pedidos: Pedido[]
  proximoNumero: number
  criarPedido: (dados: DadosNovoPedido) => Pedido
}

export const usePedidosStore = create<PedidosState>()(
  persist(
    (set, get) => ({
      pedidos: pedidosSeed.map((seed) => ({ ...seed, id: seed.numeroPedido })),
      proximoNumero: 1019,

      criarPedido: (dados) => {
        const estado = get()
        const numeroPedido = `PED-${estado.proximoNumero}`
        const status: StatusPedido = statusPossiveis[Math.floor(Math.random() * statusPossiveis.length)]

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
