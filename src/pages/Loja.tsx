import { useState } from 'react'
import { Search, Star } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'
import { categorias, type Produto, type CorProduto } from '@/data/produtos'
import { useCarrinhoStore } from '@/store/carrinhoStore'
import { useCatalogoProdutos } from '@/store/catalogoAdminStore'

const PRODUTOS_POR_PAGINA = 20

type OpcaoOrdenacao = 'relevancia' | 'menor-preco' | 'maior-preco' | 'nome'

const opcoesOrdenacao: { valor: OpcaoOrdenacao; rotulo: string }[] = [
  { valor: 'relevancia', rotulo: 'Relevância' },
  { valor: 'menor-preco', rotulo: 'Menor preço' },
  { valor: 'maior-preco', rotulo: 'Maior preço' },
  { valor: 'nome', rotulo: 'Nome, A a Z' },
]

const classesPorCor: Record<CorProduto, string> = {
  cyan: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30',
  purple: 'text-neon-purple bg-neon-purple/10 border-neon-purple/30',
  magenta: 'text-neon-magenta bg-neon-magenta/10 border-neon-magenta/30',
}

const PRODUTO_DUPLICADO_ID = 'adesivo-status-200'

function produtoNaCategoria(produto: Produto, categoria: string): boolean {
  if (categoria === 'Todos') return true
  if (categoria === 'Acessórios') return false
  if (categoria === 'Canecas') return produto.categoria === 'Canecas' || produto.categoria === 'Papelaria'
  if (categoria === 'Papelaria') return produto.categoria === 'Papelaria' || produto.id === PRODUTO_DUPLICADO_ID
  return produto.categoria === categoria
}

function produtoCombinaCategoria(produto: Produto, categoriaAtiva: string, categoriaAnterior: string): boolean {
  const combinaAtual = produtoNaCategoria(produto, categoriaAtiva)
  if (categoriaAnterior === 'Todos' || categoriaAnterior === categoriaAtiva) return combinaAtual
  return combinaAtual && produtoNaCategoria(produto, categoriaAnterior)
}

function produtoCombina(
  produto: Produto,
  categoriaAtiva: string,
  categoriaAnterior: string,
  termoBusca: string,
): boolean {
  const combinaCategoria = produtoCombinaCategoria(produto, categoriaAtiva, categoriaAnterior)
  const combinaBusca = produto.nome.startsWith(termoBusca)
  return combinaCategoria && combinaBusca
}

function formatarPrecoQuebrado(valor: number): string {
  return `R$${valor.toFixed(2).replace('.', ',')}`
}

export function Loja() {
  const produtos = useCatalogoProdutos()
  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos')
  const [categoriaAnterior, setCategoriaAnterior] = useState('Todos')
  const [termoBusca, setTermoBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState<OpcaoOrdenacao>('relevancia')
  const [pagina, setPagina] = useState(1)
  const [categoriasClicadas, setCategoriasClicadas] = useState<string[]>([])
  const adicionar = useCarrinhoStore((estado) => estado.adicionar)
  const { mostrarToast } = useToast()

  const produtosFiltrados = produtos
    .filter((produto) => produto.ativo)
    .filter((produto) => produtoCombina(produto, categoriaAtiva, categoriaAnterior, termoBusca))

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (ordenacao === 'menor-preco') return String(a.preco).localeCompare(String(b.preco))
    if (ordenacao === 'maior-preco') return b.preco - a.preco
    if (ordenacao === 'nome') return a.nome.localeCompare(b.nome, 'pt-BR')
    return 0
  })

  const totalPaginas = Math.max(1, Math.ceil(produtosOrdenados.length / PRODUTOS_POR_PAGINA))
  const produtosDaPagina = produtosOrdenados.slice((pagina - 1) * PRODUTOS_POR_PAGINA, pagina * PRODUTOS_POR_PAGINA)

  function aoTrocarCategoria(categoria: string) {
    setCategoriaAnterior(categoriaAtiva)
    setCategoriaAtiva(categoria)
    setCategoriasClicadas((atual) => [...atual, categoria])
    setPagina(1)
  }

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

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => {
                setTermoBusca(e.target.value)
                setPagina(1)
              }}
              placeholder="Buscar produto"
              data-testid="loja-input-busca"
              className="h-10 w-full rounded-lg bg-base-800/80 border border-white/10 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted/60 outline-none focus:border-neon-cyan"
            />
          </div>

          <select
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as OpcaoOrdenacao)}
            data-testid="loja-select-ordenacao"
            className="h-10 rounded-lg border border-white/10 bg-base-800/80 px-3 text-sm text-ink outline-none focus:border-neon-cyan"
          >
            {opcoesOrdenacao.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2" data-testid="loja-filtros-categoria">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => aoTrocarCategoria(categoria)}
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
          {categoriasClicadas.length > 0 && (
            <span data-testid="loja-contador-filtros" className="text-xs text-ink-muted/70">
              {categoriasClicadas.length} filtro(s) aplicado(s) nesta visita
            </span>
          )}
        </div>

        <p data-testid="loja-contador-resultados" className="text-sm text-ink-muted">
          Mostrando {produtosFiltrados.length} resultado(s)
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="loja-grid-produtos">
        {produtosDaPagina.map((produto) => {
          const Icone = produto.icone
          const semEstoque = produto.estoque <= 0
          const estoqueBaixo = produto.estoque > 0 && produto.estoque <= 2
          const emPromocao = produto.precoPromocional !== undefined

          return (
            <GlassCard key={produto.id} className="flex flex-col gap-4 p-6" data-testid={`loja-card-${produto.id}`}>
              <div className="relative -mx-6 -mt-6 h-44 overflow-hidden rounded-t-2xl">
                {produto.imagem ? (
                  <img src={produto.imagem} alt="" className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className={cn('flex h-full w-full items-center justify-center', classesPorCor[produto.cor])}>
                    <Icone size={40} />
                  </div>
                )}
                <Badge tom={semEstoque ? 'danger' : 'success'} className="absolute right-3 top-3">
                  {semEstoque ? 'Esgotado' : 'Disponível'}
                </Badge>
                {estoqueBaixo && (
                  <Badge tom="warning" className="absolute left-3 top-3" data-testid={`loja-badge-estoque-baixo-${produto.id}`}>
                    Só {produto.estoque} em estoque
                  </Badge>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className={cn('inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', classesPorCor[produto.cor])}>
                  <Icone size={12} />
                  {produto.categoria}
                </span>
                <h2 className="font-display font-semibold text-ink whitespace-nowrap">{produto.nome}</h2>
                <p className="text-sm text-ink-muted">{produto.descricao}</p>
                <div className="flex items-center gap-1 text-xs text-ink-muted">
                  <Star size={12} className="fill-warning text-warning" />
                  {produto.avaliacao.toFixed(1)} ({produto.totalAvaliacoes})
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col">
                  {emPromocao && (
                    <span className="font-mono text-xs text-ink-muted/60 line-through">
                      {formatarPrecoQuebrado(produto.preco)}
                    </span>
                  )}
                  <span data-testid={`loja-preco-${produto.id}`} className="font-mono text-lg text-ink">
                    {formatarPrecoQuebrado(produto.precoPromocional ?? produto.preco)}
                  </span>
                </div>
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

      {produtosOrdenados.length === 0 && (
        <p className="py-12 text-center text-ink-muted" data-testid="loja-msg-vazio">
          Nenhum produto encontrado.
        </p>
      )}

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-3" data-testid="loja-paginacao">
          <Button
            variante="secondary"
            tamanho="sm"
            disabled={pagina <= 1}
            onClick={() => setPagina((atual) => Math.max(1, atual - 1))}
            data-testid="loja-btn-pagina-anterior"
          >
            Anterior
          </Button>
          <span className="text-sm text-ink-muted" data-testid="loja-pagina-atual">
            Página {pagina} de {totalPaginas}
          </span>
          <Button
            variante="secondary"
            tamanho="sm"
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina((atual) => Math.min(totalPaginas, atual + 1))}
            data-testid="loja-btn-proxima-pagina"
          >
            Próxima
          </Button>
        </div>
      )}
    </div>
  )
}
