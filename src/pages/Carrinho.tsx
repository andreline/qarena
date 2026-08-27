import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { produtos } from '@/data/produtos'
import { useCarrinhoStore } from '@/store/carrinhoStore'

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function Carrinho() {
  const itens = useCarrinhoStore((estado) => estado.itens)
  const atualizarQuantidade = useCarrinhoStore((estado) => estado.atualizarQuantidade)
  const remover = useCarrinhoStore((estado) => estado.remover)
  const [textoDigitado, setTextoDigitado] = useState<Record<string, string>>({})

  const itensComProduto = itens
    .map((item) => ({ item, produto: produtos.find((p) => p.id === item.produtoId) }))
    .filter((linha): linha is { item: typeof itens[number]; produto: NonNullable<(typeof produtos)[number]> } => !!linha.produto)

  const total = itensComProduto.reduce((soma, { produto }) => soma + produto.preco, 0)

  if (itensComProduto.length === 0) {
    return (
      <div className="container-arena flex flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-ink-muted">
          <ShoppingCart size={26} />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink">Seu carrinho está vazio</h1>
        <p className="max-w-sm text-ink-muted">Volte para a loja e escolha alguns produtos fictícios para testar o fluxo.</p>
        <Link to="/app/loja">
          <Button variante="primary" data-testid="carrinho-btn-ir-para-loja">
            Ir para a loja
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-arena flex flex-col gap-8 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Carrinho</h1>

      <div className="flex flex-col gap-4" data-testid="carrinho-lista-itens">
        {itensComProduto.map(({ item, produto }) => {
          const subtotal = produto.preco * item.quantidade

          return (
            <GlassCard
              key={item.produtoId}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              data-testid={`carrinho-item-${produto.id}`}
            >
              <div className="flex items-center gap-4">
                {produto.imagem ? (
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="h-11 w-11 shrink-0 rounded-xl border border-white/10 object-cover"
                  />
                ) : (
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-muted">
                    <produto.icone size={20} />
                  </span>
                )}
                <div>
                  <p className="font-display font-medium text-ink">{produto.nome}</p>
                  <p className="font-mono text-sm text-ink-muted">{formatoMoeda.format(produto.preco)} cada</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-base-800/60 px-2 py-1">
                  <button
                    type="button"
                    onClick={() => atualizarQuantidade(item.produtoId, item.quantidade - 1)}
                    data-testid={`carrinho-btn-diminuir-${produto.id}`}
                    aria-label="Diminuir quantidade"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-white/10 hover:text-ink cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={textoDigitado[produto.id] ?? String(item.quantidade)}
                    onKeyDown={(e) => {
                      const teclasPermitidas = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
                      if (teclasPermitidas.includes(e.key)) return
                      if (!/^\d$/.test(e.key)) e.preventDefault()
                    }}
                    onChange={(e) => {
                      const valor = e.target.value
                      setTextoDigitado((atual) => ({ ...atual, [produto.id]: valor }))
                      const numero = Number(valor)
                      if (valor !== '' && !Number.isNaN(numero)) {
                        atualizarQuantidade(item.produtoId, numero)
                      }
                    }}
                    onBlur={() =>
                      setTextoDigitado((atual) => {
                        const copia = { ...atual }
                        delete copia[produto.id]
                        return copia
                      })
                    }
                    data-testid={`carrinho-quantidade-${produto.id}`}
                    className="w-10 bg-transparent text-center font-mono text-sm text-ink outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => atualizarQuantidade(item.produtoId, item.quantidade + 1)}
                    data-testid={`carrinho-btn-aumentar-${produto.id}`}
                    aria-label="Aumentar quantidade"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-ink-muted hover:bg-white/10 hover:text-ink cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span data-testid={`carrinho-subtotal-${produto.id}`} className="w-24 text-right font-mono text-ink">
                  {formatoMoeda.format(subtotal)}
                </span>

                <button
                  type="button"
                  onClick={() => remover(item.produtoId)}
                  data-testid={`carrinho-btn-remover-${produto.id}`}
                  aria-label="Remover item"
                  className="text-ink-muted hover:text-danger cursor-pointer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </GlassCard>
          )
        })}
      </div>

      <GlassCard className="flex items-center justify-between p-6">
        <span className="font-display text-lg text-ink">Total</span>
        <span data-testid="carrinho-total" className="font-mono text-2xl text-neon-cyan">
          {formatoMoeda.format(total)}
        </span>
      </GlassCard>

      <div className="flex justify-end">
        <Link to="/app/checkout">
          <Button variante="primary" data-testid="carrinho-btn-checkout">
            Ir para o checkout
          </Button>
        </Link>
      </div>
    </div>
  )
}
