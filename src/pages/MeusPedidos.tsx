import { useState } from 'react'
import { Package } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import { usePedidosStore, type StatusPedido } from '@/store/pedidosStore'
import { useCatalogoProdutos } from '@/store/catalogoAdminStore'
import { cn } from '@/lib/utils'

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const formatoData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

const statusFiltros: Array<StatusPedido | 'Todos'> = [
  'Todos',
  'Aguardando pagamento',
  'Pago',
  'Em separação',
  'Enviado',
  'Entregue',
  'Cancelado',
  'Devolvido',
]

const corPorStatus: Record<StatusPedido, 'warning' | 'cyan' | 'success' | 'danger' | 'muted'> = {
  'Aguardando pagamento': 'warning',
  Pago: 'cyan',
  'Em separação': 'cyan',
  Enviado: 'cyan',
  Entregue: 'success',
  Cancelado: 'danger',
  Devolvido: 'muted',
}

function slugStatus(status: string): string {
  return status
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export function MeusPedidos() {
  const produtos = useCatalogoProdutos()
  const usuario = useAuthStore((estado) => estado.usuarioLogado)
  const pedidos = usePedidosStore((estado) => estado.pedidos)
  const [filtroStatus, setFiltroStatus] = useState<StatusPedido | 'Todos'>('Todos')

  if (!usuario) return null

  const pedidosDoUsuario = pedidos

  if (pedidosDoUsuario.length === 0) {
    return (
      <div className="container-arena flex flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-ink-muted">
          <Package size={26} />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink">Você ainda não tem pedidos</h1>
        <p className="max-w-sm text-ink-muted">Depois de finalizar uma compra no checkout, ela aparece aqui.</p>
      </div>
    )
  }

  return (
    <div className="container-arena flex flex-col gap-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Meus pedidos</h1>

      <div className="flex flex-wrap gap-2" data-testid="pedidos-filtros-status">
        {statusFiltros.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFiltroStatus(status)}
            data-testid={`pedidos-btn-filtro-${slugStatus(status)}`}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer',
              filtroStatus === status
                ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan'
                : 'border-white/10 text-ink-muted hover:text-ink',
            )}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4" data-testid="pedidos-lista">
        {pedidosDoUsuario.map((pedido) => (
          <GlassCard key={pedido.id} className="flex flex-col gap-4 p-6" data-testid={`pedidos-item-${pedido.numeroPedido}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p data-testid={`pedidos-numero-${pedido.numeroPedido}`} className="font-mono text-lg text-neon-cyan">
                  {pedido.numeroPedido}
                </p>
                <p className="text-xs text-ink-muted">{formatoData.format(new Date(pedido.criadoEm))}</p>
              </div>
              <Badge tom={corPorStatus[pedido.status]}>{pedido.status}</Badge>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3">
              {pedido.itens.map((item) => {
                const produto = produtos.find((p) => p.id === item.produtoId)
                if (!produto) return null
                return (
                  <div key={item.produtoId} className="flex items-center justify-between text-sm text-ink-muted">
                    <span>
                      {produto.nome} <span className="font-mono">x{item.quantidade}</span>
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-sm text-ink-muted">Total</span>
              <span data-testid={`pedidos-total-${pedido.numeroPedido}`} className="font-mono text-lg text-ink">
                {formatoMoeda.format(pedido.subtotal)}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
