import { useState, useEffect, type FormEvent } from 'react'
import { Search, Plus, Pencil, Trash2, PackageCheck, PackageX, ShieldCheck } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { categorias, type Produto } from '@/data/produtos'
import { useCatalogoAdminStore, useCatalogoProdutos, type DadosNovoProduto } from '@/store/catalogoAdminStore'

const formatoMoeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const categoriasFormulario = categorias.filter((c) => c !== 'Todos')

const imagensDisponiveis = [
  '/produtos/adesivo-encontrei-um-bug.jpg',
  '/produtos/adesivo-nao-reproduz.jpg',
  '/produtos/camiseta-qa-do-zero.jpg',
  '/produtos/camiseta-testei-e-quebrei.jpg',
  '/produtos/caneca-bug-hunter.jpg',
  '/produtos/caneca-erro-404.jpg',
  '/produtos/garrafa-hidratacao-qa.jpg',
  '/produtos/mochila-qarena.jpg',
]

type FonteImagem = 'nenhuma' | 'url' | 'projeto'

interface FormularioProduto {
  nome: string
  descricao: string
  categoria: string
  preco: string
  precoPromocional: string
  estoque: string
  ativo: boolean
  fonteImagem: FonteImagem
  imagemUrl: string
  imagemProjeto: string
}

function formularioVazio(): FormularioProduto {
  return {
    nome: '',
    descricao: '',
    categoria: categoriasFormulario[0],
    preco: '',
    precoPromocional: '',
    estoque: '',
    ativo: true,
    fonteImagem: 'nenhuma',
    imagemUrl: '',
    imagemProjeto: imagensDisponiveis[0],
  }
}

function formularioDoProduto(produto: Produto): FormularioProduto {
  const imagemEhDoProjeto = produto.imagem ? imagensDisponiveis.includes(produto.imagem) : false
  return {
    nome: produto.nome,
    descricao: produto.descricao,
    categoria: produto.categoria,
    preco: String(produto.preco),
    precoPromocional: produto.precoPromocional !== undefined ? String(produto.precoPromocional) : '',
    estoque: String(produto.estoque),
    ativo: produto.ativo,
    fonteImagem: !produto.imagem ? 'nenhuma' : imagemEhDoProjeto ? 'projeto' : 'url',
    imagemUrl: !imagemEhDoProjeto ? (produto.imagem ?? '') : '',
    imagemProjeto: imagemEhDoProjeto ? (produto.imagem as string) : imagensDisponiveis[0],
  }
}

interface ResumoCatalogo {
  total: number
  semEstoque: number
  inativos: number
  emPromocao: number
}

function calcularResumo(produtos: Produto[]): ResumoCatalogo {
  return {
    total: produtos.length,
    semEstoque: produtos.filter((p) => p.estoque <= 0).length,
    inativos: produtos.filter((p) => !p.ativo).length,
    emPromocao: produtos.filter((p) => p.precoPromocional !== undefined).length,
  }
}

export function AdminProdutos() {
  const catalogo = useCatalogoProdutos()
  const editarProduto = useCatalogoAdminStore((estado) => estado.editarProduto)
  const criarProduto = useCatalogoAdminStore((estado) => estado.criarProduto)
  const excluirProduto = useCatalogoAdminStore((estado) => estado.excluirProduto)
  const alternarEstoque = useCatalogoAdminStore((estado) => estado.alternarEstoque)
  const alternarAtivo = useCatalogoAdminStore((estado) => estado.alternarAtivo)
  const { mostrarToast } = useToast()

  const [termoBusca, setTermoBusca] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos')
  const [situacaoEstoque, setSituacaoEstoque] = useState<'todos' | 'disponivel' | 'esgotado'>('todos')

  const [modalAberto, setModalAberto] = useState(false)
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null)
  const [formulario, setFormulario] = useState<FormularioProduto>(formularioVazio())

  const [resumo, setResumo] = useState<ResumoCatalogo>(() => calcularResumo(catalogo))

  useEffect(() => {
    setResumo(calcularResumo(catalogo))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const produtosFiltrados = catalogo.filter((produto) => {
    const combinaCategoria = categoriaFiltro === 'Todos' || produto.categoria === categoriaFiltro
    const combinaEstoque =
      situacaoEstoque === 'todos' ||
      (situacaoEstoque === 'disponivel' && produto.estoque > 0) ||
      (situacaoEstoque === 'esgotado' && produto.estoque <= 0)
    const termo = termoBusca.trim().toLowerCase()
    const combinaBusca =
      termo.length === 0 ||
      produto.nome.toLowerCase().includes(termo) ||
      produto.sku.toLowerCase().includes(termo)
    return combinaCategoria && combinaEstoque && combinaBusca
  })

  function abrirCriacao() {
    setIdEmEdicao(null)
    setFormulario(formularioVazio())
    setModalAberto(true)
  }

  function abrirEdicao(produto: Produto) {
    setIdEmEdicao(produto.id)
    setFormulario(formularioDoProduto(produto))
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
  }

  function imagemDoFormulario(): string | undefined {
    if (formulario.fonteImagem === 'url') return formulario.imagemUrl || undefined
    if (formulario.fonteImagem === 'projeto') return formulario.imagemProjeto
    return undefined
  }

  function aoSubmeterFormulario(evento: FormEvent) {
    evento.preventDefault()

    const dados = {
      nome: formulario.nome,
      descricao: formulario.descricao,
      categoria: formulario.categoria,
      preco: Number(formulario.preco),
      precoPromocional: formulario.precoPromocional !== '' ? Number(formulario.precoPromocional) : undefined,
      estoque: Number(formulario.estoque),
      ativo: formulario.ativo,
      avaliacao: 5,
      totalAvaliacoes: 0,
      tags: [] as string[],
      cor: 'cyan' as const,
      imagem: imagemDoFormulario(),
    }

    if (idEmEdicao) {
      editarProduto(idEmEdicao, dados)
      mostrarToast('Produto atualizado', 'sucesso')
    } else {
      criarProduto(dados satisfies DadosNovoProduto)
      mostrarToast('Produto criado', 'sucesso')
    }

    setModalAberto(false)
  }

  function aoExcluir(produto: Produto) {
    excluirProduto(produto.id)
    mostrarToast(`${produto.nome} excluído`, 'sucesso')
  }

  return (
    <div className="container-arena flex flex-col gap-8 py-12" data-testid="admin-conteudo">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={24} className="text-neon-cyan" />
          <h1 className="font-display text-3xl font-bold text-ink">Área administrativa</h1>
        </div>
        <Button variante="primary" onClick={abrirCriacao} data-testid="admin-btn-novo-produto">
          <Plus size={18} />
          Novo produto
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" data-testid="admin-painel-resumo">
        <GlassCard className="p-5">
          <p className="text-sm text-ink-muted">Total de produtos</p>
          <p data-testid="admin-resumo-total" className="mt-1 font-mono text-2xl text-ink">
            {resumo.total}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-ink-muted">Sem estoque</p>
          <p data-testid="admin-resumo-sem-estoque" className="mt-1 font-mono text-2xl text-danger">
            {resumo.semEstoque}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-ink-muted">Inativos</p>
          <p data-testid="admin-resumo-inativos" className="mt-1 font-mono text-2xl text-warning">
            {resumo.inativos}
          </p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-sm text-ink-muted">Em promoção</p>
          <p data-testid="admin-resumo-em-promocao" className="mt-1 font-mono text-2xl text-neon-cyan">
            {resumo.emPromocao}
          </p>
        </GlassCard>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar por nome ou SKU"
            data-testid="admin-input-busca"
            className="h-10 w-full rounded-lg bg-base-800/80 border border-white/10 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted/60 outline-none focus:border-neon-cyan"
          />
        </div>

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          data-testid="admin-select-categoria"
          className="h-10 rounded-lg border border-white/10 bg-base-800/80 px-3 text-sm text-ink outline-none focus:border-neon-cyan"
        >
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={situacaoEstoque}
          onChange={(e) => setSituacaoEstoque(e.target.value as typeof situacaoEstoque)}
          data-testid="admin-select-estoque"
          className="h-10 rounded-lg border border-white/10 bg-base-800/80 px-3 text-sm text-ink outline-none focus:border-neon-cyan"
        >
          <option value="todos">Todas as situações</option>
          <option value="disponivel">Disponível</option>
          <option value="esgotado">Esgotado</option>
        </select>
      </div>

      <div className="flex flex-col gap-3" data-testid="admin-lista-produtos">
        {produtosFiltrados.map((produto) => (
          <GlassCard
            key={produto.id}
            className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            data-testid={`admin-item-${produto.id}`}
          >
            <div className="flex items-center gap-4">
              {produto.imagem ? (
                <img src={produto.imagem} alt="" className="h-12 w-12 rounded-lg border border-white/10 object-cover" />
              ) : (
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-muted">
                  <produto.icone size={20} />
                </span>
              )}
              <div>
                <p className="font-display font-medium text-ink">{produto.nome}</p>
                <p className="font-mono text-xs text-ink-muted">
                  {produto.sku} · {produto.categoria}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span data-testid={`admin-preco-${produto.id}`} className="font-mono text-sm text-ink">
                {formatoMoeda.format(produto.precoPromocional ?? produto.preco)}
              </span>
              <Badge tom={produto.estoque > 0 ? 'success' : 'danger'} data-testid={`admin-badge-estoque-${produto.id}`}>
                {produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Esgotado'}
              </Badge>
              <Badge
                tom={produto.ativo ? 'cyan' : 'muted'}
                onClick={() => alternarAtivo(produto.id)}
                data-testid={`admin-badge-situacao-${produto.id}`}
                className="cursor-pointer"
              >
                {produto.ativo ? 'Ativo' : 'Inativo'}
              </Badge>

              <button
                type="button"
                onClick={() => alternarEstoque(produto.id)}
                data-testid={`admin-btn-alternar-estoque-${produto.id}`}
                aria-label={produto.estoque > 0 ? 'Marcar fora de estoque' : 'Marcar dentro de estoque'}
                className="text-ink-muted hover:text-neon-cyan cursor-pointer"
              >
                {produto.estoque > 0 ? <PackageX size={18} /> : <PackageCheck size={18} />}
              </button>

              <button
                type="button"
                onClick={() => abrirEdicao(produto)}
                data-testid={`admin-btn-editar-${produto.id}`}
                aria-label="Editar produto"
                className="text-ink-muted hover:text-ink cursor-pointer"
              >
                <Pencil size={18} />
              </button>

              <button
                type="button"
                onClick={() => aoExcluir(produto)}
                data-testid={`admin-btn-excluir-${produto.id}`}
                aria-label="Excluir produto"
                className="text-ink-muted hover:text-danger cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </GlassCard>
        ))}

        {produtosFiltrados.length === 0 && (
          <p className="py-12 text-center text-ink-muted" data-testid="admin-msg-vazio">
            Nenhum produto encontrado.
          </p>
        )}
      </div>

      <Modal
        aberto={modalAberto}
        aoFechar={fecharModal}
        titulo={idEmEdicao ? 'Editar produto' : 'Novo produto'}
        testId="admin-modal-produto"
        className="max-w-lg"
      >
        <form onSubmit={aoSubmeterFormulario} className="flex flex-col gap-4" noValidate>
          <Input
            label="Nome"
            data-testid="admin-form-nome"
            value={formulario.nome}
            onChange={(e) => setFormulario((f) => ({ ...f, nome: e.target.value }))}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-muted">Descrição</label>
            <textarea
              value={formulario.descricao}
              onChange={(e) => setFormulario((f) => ({ ...f, descricao: e.target.value }))}
              data-testid="admin-form-descricao"
              rows={3}
              className="rounded-lg bg-base-800/80 border border-white/10 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-neon-cyan"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-muted">Categoria</label>
            <select
              value={formulario.categoria}
              onChange={(e) => setFormulario((f) => ({ ...f, categoria: e.target.value }))}
              data-testid="admin-form-categoria"
              className="h-11 rounded-lg border border-white/10 bg-base-800/80 px-3.5 text-sm text-ink outline-none focus:border-neon-cyan"
            >
              {categoriasFormulario.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Preço"
              type="number"
              step="0.01"
              data-testid="admin-form-preco"
              value={formulario.preco}
              onChange={(e) => setFormulario((f) => ({ ...f, preco: e.target.value }))}
              required
            />
            <Input
              label="Preço promocional"
              type="number"
              step="0.01"
              data-testid="admin-form-preco-promocional"
              value={formulario.precoPromocional}
              onChange={(e) => setFormulario((f) => ({ ...f, precoPromocional: e.target.value }))}
              placeholder="Opcional"
            />
          </div>

          <Input
            label="Estoque"
            type="text"
            inputMode="numeric"
            data-testid="admin-form-estoque"
            value={formulario.estoque}
            onChange={(e) => setFormulario((f) => ({ ...f, estoque: e.target.value }))}
            required
          />

          <label className="flex items-center gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              checked={formulario.ativo}
              onChange={(e) => setFormulario((f) => ({ ...f, ativo: e.target.checked }))}
              data-testid="admin-form-ativo"
              className="h-4 w-4 rounded border-white/20 bg-base-800 accent-neon-cyan"
            />
            Produto ativo
          </label>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink-muted">Imagem</label>
            <select
              value={formulario.fonteImagem}
              onChange={(e) => setFormulario((f) => ({ ...f, fonteImagem: e.target.value as FonteImagem }))}
              data-testid="admin-form-fonte-imagem"
              className="h-11 rounded-lg border border-white/10 bg-base-800/80 px-3.5 text-sm text-ink outline-none focus:border-neon-cyan"
            >
              <option value="nenhuma">Sem imagem (usa ícone)</option>
              <option value="url">Informar URL</option>
              <option value="projeto">Escolher imagem do projeto</option>
            </select>
          </div>

          {formulario.fonteImagem === 'url' && (
            <Input
              label="URL da imagem"
              data-testid="admin-form-imagem-url"
              value={formulario.imagemUrl}
              onChange={(e) => setFormulario((f) => ({ ...f, imagemUrl: e.target.value }))}
              placeholder="https://..."
            />
          )}

          {formulario.fonteImagem === 'projeto' && (
            <select
              value={formulario.imagemProjeto}
              onChange={(e) => setFormulario((f) => ({ ...f, imagemProjeto: e.target.value }))}
              data-testid="admin-form-imagem-projeto"
              className="h-11 rounded-lg border border-white/10 bg-base-800/80 px-3.5 text-sm text-ink outline-none focus:border-neon-cyan"
            >
              {imagensDisponiveis.map((src) => (
                <option key={src} value={src}>
                  {src.replace('/produtos/', '')}
                </option>
              ))}
            </select>
          )}

          <Button type="submit" variante="primary" className="mt-2" data-testid="admin-form-btn-salvar">
            {idEmEdicao ? 'Salvar alterações' : 'Criar produto'}
          </Button>
        </form>
      </Modal>
    </div>
  )
}
