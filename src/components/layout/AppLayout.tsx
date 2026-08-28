import { Outlet, Link } from 'react-router-dom'
import { Store, ShoppingCart, User, Package, LogOut, ShieldCheck, Mail } from 'lucide-react'
import { Footer } from './Footer'
import { Escudo } from '@/components/Escudo'
import { useCarrinhoStore } from '@/store/carrinhoStore'
import { useEmailStore } from '@/store/emailStore'
import { useProgressoStore } from '@/store/progressoStore'
import { calcularNivelAtual, calcularProximoNivel, totalMissoes } from '@/data/niveisConfig'

interface AppLayoutProps {
  nome: string
  numeroConta: string
  creditos: number
  admin: boolean
  aoSair: () => void
}

const atalhos = [
  { rotulo: 'Loja', rota: '/app/loja', Icone: Store },
  { rotulo: 'Carrinho', rota: '/app/carrinho', Icone: ShoppingCart },
  { rotulo: 'Perfil', rota: '/app/perfil', Icone: User },
  { rotulo: 'Meus Pedidos', rota: '/app/pedidos', Icone: Package },
  { rotulo: 'Caixa de Entrada', rota: '/caixa-de-entrada', Icone: Mail },
]

export function AppLayout({ nome, numeroConta, creditos, admin, aoSair }: AppLayoutProps) {
  const quantidadeCarrinho = useCarrinhoStore((estado) => estado.quantidadeTotal)
  const emailsNaoLidos = useEmailStore((estado) => estado.emails.filter((e) => !e.lido).length)
  const missoesConcluidas = useProgressoStore((estado) => estado.missoesConcluidas)
  const nivelAtual = calcularNivelAtual(missoesConcluidas.length)
  const proximoNivel = calcularProximoNivel(missoesConcluidas.length)
  const percentualNivel = proximoNivel
    ? Math.min(
        100,
        ((missoesConcluidas.length - nivelAtual.missoesNecessarias) /
          (proximoNivel.missoesNecessarias - nivelAtual.missoesNecessarias)) *
          100,
      )
    : 100

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="arena-bg" aria-hidden="true" />
      <div className="arena-grid" aria-hidden="true" />

      <aside
        className="glass flex shrink-0 flex-col gap-6 border-b border-white/5 p-5 md:w-64 md:border-b-0 md:border-r"
        data-testid="app-sidebar"
      >
        <Link to="/app" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-purple/20 border border-neon-purple/40 font-display text-lg font-bold text-neon-cyan">
            Q
          </span>
          <span className="font-display text-lg font-semibold text-ink">QArena</span>
        </Link>

        <div className="rounded-xl border border-white/10 bg-base-800/60 p-4">
          <p data-testid="app-sidebar-nome" className="font-display font-semibold text-ink">
            {nome}
          </p>
          <p data-testid="app-sidebar-numero-conta" className="mt-1 font-mono text-sm text-neon-cyan">
            {numeroConta}
          </p>
          <p className="mt-2 text-xs text-ink-muted">Créditos QA</p>
          <p data-testid="app-sidebar-creditos" className="font-mono text-lg text-success">
            {creditos}
          </p>
        </div>

        <Link
          to="/progresso"
          data-testid="app-sidebar-resumo-progresso"
          className="flex items-center gap-3 rounded-xl border border-white/10 bg-base-800/60 p-3 transition-colors hover:border-neon-cyan/30"
        >
          <Escudo nivel={nivelAtual.numero} tamanho={40} />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className="truncate text-xs font-medium text-ink">{nivelAtual.nome}</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple"
                style={{ width: `${percentualNivel}%` }}
              />
            </div>
            <p className="text-[11px] text-ink-muted">{missoesConcluidas.length} de {totalMissoes} missões</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1" aria-label="Atalhos da área logada">
          {atalhos.map(({ rotulo, rota, Icone }) => (
            <Link
              key={rota}
              to={rota}
              data-testid={`app-sidebar-link-${rotulo.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-white/5 hover:text-ink"
            >
              <span className="flex items-center gap-2.5">
                <Icone size={18} />
                {rotulo}
              </span>
              {rota === '/app/carrinho' && quantidadeCarrinho > 0 && (
                <span
                  data-testid="app-sidebar-badge-carrinho"
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neon-cyan px-1.5 font-mono text-xs font-semibold text-base-900"
                >
                  {quantidadeCarrinho}
                </span>
              )}
              {rota === '/caixa-de-entrada' && emailsNaoLidos > 0 && (
                <span
                  data-testid="app-sidebar-badge-caixa-de-entrada"
                  className="flex h-5 min-w-5 items-center justify-center rounded-full bg-neon-cyan px-1.5 font-mono text-xs font-semibold text-base-900"
                >
                  {emailsNaoLidos}
                </span>
              )}
            </Link>
          ))}
          {admin && (
            <Link
              to="/admin"
              data-testid="app-sidebar-link-administracao"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-neon-purple transition-colors hover:bg-neon-purple/10"
            >
              <ShieldCheck size={18} />
              Administração
            </Link>
          )}
        </nav>

        <button
          type="button"
          onClick={aoSair}
          data-testid="app-sidebar-btn-sair"
          className="mt-auto flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger cursor-pointer"
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <div className="flex flex-1 flex-col">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
