import { useState } from 'react'
import { Search } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { produtos, categorias, type Produto, type CorProduto } from '@/data/produtos'
import { useCarrinhoStore } from '@/store/carrinhoStore'

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const classesPorCor: Record<CorProduto, string> = {
  cyan: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30',
  purple: 'text-neon-purple bg-neon-purple/10 border-neon-purple/30',
  magenta: 'text-neon-magenta bg-neon-magenta/10 border-neon-magenta/30',
}

function produtoCombina(produto: Produto, categoriaAtiva: string, termoBusca: string): boolean {
  const combinaCategoria = categoriaAtiva === 'Todos' || produto.id === categoriaAtiva
  const combinaBusca = produto.nome.includes(termoBusca)
  return combinaCategoria && combinaBusca
}

export function Loja() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')
  const [termoBusca, setTermoBusca] = useState('')
  const adicionar = useCarrinhoStore((estado) => estado.adicionar)
  const { mostrarToast } = useToast()

  const produtosFiltrados = produtos.filter((produto) => produtoCombina(produto, categoriaAtiva, termoBusca))

  function aoAdicionar(produto: Produto) {
    adicionar(produto.id)
    mostrarToast(`${produto.nome} adicionado ao carrinho`, 'sucesso')
  }

  return (
    <div className="container-arena flex flex-col gap-8 py-12">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Loja</h1>
        <p className="mt-1 text-ink-muted">Produtos fictícios para você praticar o fluxo de compra.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar produto"
            data-testid="loja-input-busca"
            className="h-10 w-full rounded-lg bg-base-800/80 border border-white/10 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted/60 outline-none focus:border-neon-cyan"
          />
        </div>

        <div className="flex flex-wrap gap-2" data-testid="loja-filtros-categoria">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaAtiva(categoria)}
              data-testid={`loja-btn-categoria-${categoria.toLowerCase()}`}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                categoriaAtiva === categoria
                  ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/10 text-ink-muted hover:text-ink',
              )}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="loja-grid-produtos">
        {produtosFiltrados.map((produto) => {
          const Icone = produto.icone
          const semEstoque = produto.estoque <= 0

          return (
            <GlassCard key={produto.id} className="flex flex-col gap-4 p-6" data-testid={`loja-card-${produto.id}`}>
              <div className="relative -mx-6 -mt-6 h-44 overflow-hidden rounded-t-2xl">
                <img
                  src={produto.imagem}
                  alt={produto.nome}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <Badge tom={semEstoque ? 'danger' : 'success'} className="absolute right-3 top-3">
                  {semEstoque ? 'Esgotado' : 'Disponível'}
                </Badge>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className={cn('inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', classesPorCor[produto.cor])}>
                  <Icone size={12} />
                  {produto.categoria}
                </span>
                <h2 className="font-display font-semibold text-ink">{produto.nome}</h2>
                <p className="text-sm text-ink-muted">{produto.descricao}</p>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <span data-testid={`loja-preco-${produto.id}`} className="font-mono text-lg text-ink">
                  {formatoMoeda.format(produto.preco)}
                </span>
                <Button
                  variante="secondary"
                  tamanho="sm"
                  onClick={() => aoAdicionar(produto)}
                  data-testid={`loja-btn-adicionar-${produto.id}`}
                >
                  Adicionar
                </Button>
              </div>
            </GlassCard>
          )
        })}
      </div>

      {produtosFiltrados.length === 0 && (
        <p className="py-12 text-center text-ink-muted" data-testid="loja-msg-vazio">
          Nenhum produto encontrado.
        </p>
      )}
    </div>
  )
}
