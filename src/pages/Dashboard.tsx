import { Link } from 'react-router-dom'
import { Store, ShoppingCart, User, Package, ClipboardList } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'

const atalhos = [
  { rotulo: 'Loja', rota: '/app/loja', Icone: Store, disponivel: true },
  { rotulo: 'Carrinho', rota: '/app/carrinho', Icone: ShoppingCart, disponivel: true },
  { rotulo: 'Perfil', rota: '/app/perfil', Icone: User, disponivel: true },
  { rotulo: 'Meus Pedidos', rota: '/app/pedidos', Icone: Package, disponivel: true },
]

export function Dashboard() {
  const usuario = useAuthStore((estado) => estado.usuarioLogado)

  if (!usuario) return null

  if (!usuario.permissao) {
    return <div className="container-arena py-16" data-testid="dashboard-conteudo" />
  }

  return (
    <div className="container-arena flex flex-col gap-8 py-12" data-testid="dashboard-conteudo">
      <div>
        <h1 data-testid="dashboard-saudacao" className="font-display text-3xl font-bold text-ink">
          Olá, {usuario.nome.split(' ')[0]}
        </h1>
        <p className="mt-1 text-ink-muted">Bem-vindo de volta ao seu ambiente de treino.</p>
      </div>

      <GlassCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-ink-muted">Número da conta</p>
          <p data-testid="dashboard-numero-conta" className="font-mono text-lg text-neon-cyan">
            {usuario.numeroConta}
          </p>
        </div>
        <div>
          <p className="text-sm text-ink-muted">Créditos QA</p>
          <p data-testid="dashboard-creditos" className="font-mono text-lg text-success">
            {usuario.creditos}
          </p>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col gap-3 border-neon-purple/30 p-6 sm:flex-row sm:items-center">
        <ClipboardList size={22} className="shrink-0 text-neon-purple" />
        <p className="text-sm text-ink-muted">
          Antes de começar a testar, dê uma olhada na página de{' '}
          <Link to="/requisitos" className="text-neon-cyan hover:underline" data-testid="dashboard-lembrete-requisitos">
            Requisitos
          </Link>
          . É lá que você encontra o comportamento esperado de cada tela.
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {atalhos.map(({ rotulo, rota, Icone, disponivel }) => {
          const cartaoConteudo = (
            <GlassCard
              data-testid={`dashboard-card-${rotulo.toLowerCase().replace(/\s+/g, '-')}`}
              className={cardClasses(disponivel)}
            >
              <div className="flex items-center justify-between">
                <Icone size={22} className="text-ink-muted" />
                <Badge tom={disponivel ? 'success' : 'muted'}>{disponivel ? 'Disponível' : 'Em breve'}</Badge>
              </div>
              <span className="font-display font-semibold text-ink">{rotulo}</span>
            </GlassCard>
          )

          return disponivel ? (
            <Link key={rota} to={rota}>
              {cartaoConteudo}
            </Link>
          ) : (
            <div key={rota}>{cartaoConteudo}</div>
          )
        })}
      </div>
    </div>
  )
}

function cardClasses(disponivel: boolean) {
  return `flex flex-col gap-3 p-5 transition-all duration-200 ${
    disponivel ? 'hover:-translate-y-1 hover:border-neon-cyan/40' : 'opacity-70'
  }`
}
