import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Ticket, X, ShoppingCart } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { produtos } from '@/data/produtos'
import { cupons, type Cupom } from '@/data/cupons'
import { useCarrinhoStore } from '@/store/carrinhoStore'
import { useAuthStore } from '@/store/authStore'
import { usePedidosStore } from '@/store/pedidosStore'

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

function rotuloCupom(cupom: Cupom): string {
  if (cupom.tipo === 'fixo') return `${formatoMoeda.format(cupom.valorFixo ?? 0)} de desconto`
  return `${cupom.percentualAnunciado}% de desconto`
}

export function Checkout() {
  const itensCarrinho = useCarrinhoStore((estado) => estado.itens)
  const limparCarrinho = useCarrinhoStore((estado) => estado.limpar)
  const usuario = useAuthStore((estado) => estado.usuarioLogado)
  const debitarCreditos = useAuthStore((estado) => estado.debitarCreditos)
  const criarPedido = usePedidosStore((estado) => estado.criarPedido)
  const pedidos = usePedidosStore((estado) => estado.pedidos)

  const [codigoCupom, setCodigoCupom] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState<Cupom | null>(null)
  const [descontoAplicado, setDescontoAplicado] = useState(0)
  const [erroCupom, setErroCupom] = useState('')
  const [pedidoConcluido, setPedidoConcluido] = useState<{ numero: string; total: number } | null>(null)

  const itensComProduto = itensCarrinho
    .map((item) => ({ item, produto: produtos.find((p) => p.id === item.produtoId) }))
    .filter(
      (linha): linha is { item: (typeof itensCarrinho)[number]; produto: NonNullable<(typeof produtos)[number]> } =>
        !!linha.produto,
    )

  const subtotal = itensComProduto.reduce((soma, { item, produto }) => soma + produto.preco * item.quantidade, 0)
  const total = Math.max(subtotal - descontoAplicado, 0)

  function aoAplicarCupom() {
    setErroCupom('')
    const cupom = cupons.find((c) => c.codigo === codigoCupom)
    if (!cupom) return

    if (cupom.categoriaRestrita) {
      const temCategoria = itensComProduto.some(({ produto }) => produto.categoria === cupom.categoriaRestrita)
      if (!temCategoria) {
        setErroCupom(`Este cupom é válido apenas para produtos da categoria ${cupom.categoriaRestrita}.`)
        return
      }
    }

    if (cupom.usoUnico && usuario) {
      const jaUsado = pedidos.some((p) => p.usuarioId === usuario.id && p.cupomUsado === cupom.codigo)
      if (jaUsado) {
        setErroCupom('Você já usou este cupom antes.')
        return
      }
    }

    const desconto = cupom.tipo === 'fixo' ? Math.min(cupom.valorFixo ?? 0, subtotal) : subtotal * ((cupom.percentualAplicado ?? 0) / 100)

    setCupomAplicado(cupom)
    setDescontoAplicado(desconto)
    setCodigoCupom('')
  }

  function aoRemoverCupom() {
    setCupomAplicado(null)
  }

  function aoFinalizarCompra() {
    if (!usuario) return

    debitarCreditos(total)

    const pedido = criarPedido({
      usuarioId: usuario.id,
      itens: itensComProduto.map(({ item, produto }) => ({
        produtoId: produto.id,
        quantidade: item.quantidade,
        precoUnitario: produto.preco,
      })),
      subtotal,
      desconto: descontoAplicado,
      frete: 0,
      total,
      cupomUsado: cupomAplicado?.codigo ?? null,
      formaPagamento: 'Créditos QA',
      enderecoEntrega: 'Endereço cadastrado na conta',
      codigoRastreio: null,
    })

    limparCarrinho()
    setPedidoConcluido({ numero: pedido.numeroPedido, total })
  }

  if (!usuario) return null

  if (pedidoConcluido) {
    return (
      <div className="container-arena flex flex-col items-center gap-4 py-20 text-center" data-testid="checkout-sucesso">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
          <CheckCircle2 size={28} />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink">Pedido realizado</h1>
        <p data-testid="checkout-numero-pedido" className="font-mono text-lg text-neon-cyan">
          {pedidoConcluido.numero}
        </p>
        <p className="text-ink-muted">
          Total pago com créditos QA: <span className="font-mono text-ink">{formatoMoeda.format(pedidoConcluido.total)}</span>
        </p>
        <div className="mt-2 flex gap-3">
          <Link to="/app/loja">
            <Button variante="secondary" data-testid="checkout-btn-continuar-comprando">
              Continuar comprando
            </Button>
          </Link>
          <Link to="/app">
            <Button variante="primary" data-testid="checkout-btn-ir-dashboard">
              Ir para o início
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (itensComProduto.length === 0) {
    return (
      <div className="container-arena flex flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-ink-muted">
          <ShoppingCart size={26} />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink">Seu carrinho está vazio</h1>
        <p className="max-w-sm text-ink-muted">Volte para a loja e escolha alguns produtos antes de ir para o checkout.</p>
        <Link to="/app/loja">
          <Button variante="primary">Ir para a loja</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-arena flex flex-col gap-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Checkout</h1>

      <GlassCard className="flex flex-col gap-3 p-6" data-testid="checkout-resumo">
        <h2 className="font-display font-semibold text-ink">Resumo do pedido</h2>
        {itensComProduto.map(({ item, produto }) => (
          <div key={produto.id} className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-3">
              {produto.imagem ? (
                <img src={produto.imagem} alt={produto.nome} className="h-9 w-9 rounded-lg border border-white/10 object-cover" />
              ) : (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-muted">
                  <produto.icone size={16} />
                </span>
              )}
              <span className="text-ink-muted">
                {produto.nome} <span className="font-mono">x{item.quantidade}</span>
              </span>
            </div>
            <span className="font-mono text-ink">{formatoMoeda.format(produto.preco * item.quantidade)}</span>
          </div>
        ))}
      </GlassCard>

      <GlassCard className="flex flex-col gap-3 p-6">
        <h2 className="font-display font-semibold text-ink">Cupom de desconto</h2>
        {cupomAplicado ? (
          <div className="flex items-center justify-between rounded-lg border border-neon-cyan/30 bg-neon-cyan/5 px-4 py-3">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-neon-cyan" />
              <span data-testid="checkout-cupom-aplicado" className="font-mono text-sm text-ink">
                {cupomAplicado.codigo}
              </span>
              <Badge tom="cyan">{rotuloCupom(cupomAplicado)}</Badge>
            </div>
            <button
              type="button"
              onClick={aoRemoverCupom}
              data-testid="checkout-btn-remover-cupom"
              aria-label="Remover cupom"
              className="text-ink-muted hover:text-danger cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                value={codigoCupom}
                onChange={(e) => setCodigoCupom(e.target.value)}
                placeholder="Código do cupom"
                data-testid="checkout-input-cupom"
                className="flex-1"
              />
              <Button variante="secondary" onClick={aoAplicarCupom} data-testid="checkout-btn-aplicar-cupom">
                Aplicar
              </Button>
            </div>
            {erroCupom && (
              <p data-testid="checkout-msg-erro-cupom" className="text-sm text-danger">
                {erroCupom}
              </p>
            )}
          </div>
        )}
      </GlassCard>

      <GlassCard className="flex flex-col gap-2 p-6">
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span>Subtotal</span>
          <span data-testid="checkout-subtotal" className="font-mono text-ink">
            {formatoMoeda.format(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-ink-muted">
          <span>Desconto</span>
          <span data-testid="checkout-desconto" className="font-mono text-success">
            -{formatoMoeda.format(descontoAplicado)}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="font-display font-semibold text-ink">Total</span>
          <span data-testid="checkout-total" className="font-mono text-xl text-neon-cyan">
            {formatoMoeda.format(total)}
          </span>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-ink-muted">Seus créditos QA</p>
          <p data-testid="checkout-creditos-disponiveis" className="font-mono text-lg text-ink">
            {usuario.creditos}
          </p>
        </div>
        <Button variante="primary" onClick={aoFinalizarCompra} data-testid="checkout-btn-finalizar">
          Finalizar compra com créditos QA
        </Button>
      </GlassCard>
    </div>
  )
}
