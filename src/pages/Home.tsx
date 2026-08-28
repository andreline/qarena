import { Link } from 'react-router-dom'
import { ClipboardCheck, FlaskConical, Search, UserPlus, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { labs, totalBugs, type CorLab } from '@/data/labs'
import { cn } from '@/lib/utils'

const classesPorCor: Record<CorLab, { icone: string; borda: string }> = {
  cyan: { icone: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/30', borda: 'hover:border-neon-cyan/40' },
  purple: { icone: 'text-neon-purple bg-neon-purple/10 border-neon-purple/30', borda: 'hover:border-neon-purple/40' },
  magenta: { icone: 'text-neon-magenta bg-neon-magenta/10 border-neon-magenta/30', borda: 'hover:border-neon-magenta/40' },
}

const passos = [
  {
    numero: '01',
    titulo: 'Criar conta e entrar',
    descricao: 'Cadastre a sua conta de teste e faça login para acessar a área logada do QArena.',
    Icone: UserPlus,
  },
  {
    numero: '02',
    titulo: 'Consultar os requisitos',
    descricao: 'Leia o comportamento esperado de cada tela antes de começar a investigar.',
    Icone: ClipboardCheck,
  },
  {
    numero: '03',
    titulo: 'Testar e observar',
    descricao: 'Compare o resultado esperado com o resultado atual em cada ação que você realizar.',
    Icone: Search,
  },
  {
    numero: '04',
    titulo: 'Documentar e conferir',
    descricao: 'Registre o bug encontrado e confira depois se ele bate com o gabarito da Central de Bugs.',
    Icone: FlaskConical,
  },
]

export function Home() {
  return (
    <div className="container-arena flex flex-col gap-24 py-16 md:py-24">
      <section className="flex flex-col items-center gap-6 text-center">
        <Badge tom="cyan" data-testid="home-badge-bugs">
          Ambiente de treino, {totalBugs} bugs plantados
        </Badge>

        <h1 className="text-gradient font-display text-5xl font-extrabold leading-tight md:text-7xl">
          QArena
        </h1>
        <p className="font-display text-xl text-ink-muted md:text-2xl">o playground dos QAs</p>

        <p className="max-w-2xl text-balance text-ink-muted">
          Um ambiente criado para você praticar testes, encontrar bugs, documentar problemas e desenvolver seu
          raciocínio como QA.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/cadastro">
            <Button variante="primary" data-testid="home-btn-criar-conta">
              Criar minha conta
            </Button>
          </Link>
          <Link to="/login">
            <Button variante="secondary" data-testid="home-btn-ja-tenho-conta">
              Já tenho conta
            </Button>
          </Link>
        </div>

        <p className="font-mono text-sm text-ink-muted/80">
          &quot;Um ambiente para errar, investigar, documentar e aprender como um QA de verdade.&quot;
        </p>
      </section>

      <section>
        <GlassCard className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col items-center gap-1 p-6 text-center">
            <span data-testid="home-stat-laboratorios" className="font-display text-3xl font-bold text-neon-cyan">
              {labs.length}
            </span>
            <span className="text-sm text-ink-muted">laboratórios de teste</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-6 text-center">
            <span data-testid="home-stat-bugs" className="font-display text-3xl font-bold text-neon-magenta">
              {totalBugs}
            </span>
            <span className="text-sm text-ink-muted">bugs plantados</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-6 text-center">
            <span className="font-display text-3xl font-bold text-neon-purple">100%</span>
            <span className="text-sm text-ink-muted">front-end, sem backend</span>
          </div>
        </GlassCard>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Laboratórios</h2>
          <p className="text-ink-muted">Escolha uma tela e comece a investigar.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => {
            const cores = classesPorCor[lab.cor]
            const Icone = lab.icone
            const conteudoCard = (
              <GlassCard
                className={cn(
                  'flex h-full flex-col gap-4 p-6 transition-all duration-200',
                  lab.disponivel ? cn('hover:-translate-y-1', cores.borda) : 'opacity-70',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('flex h-11 w-11 items-center justify-center rounded-xl border', cores.icone)}>
                    <Icone size={22} />
                  </span>
                  <Badge tom={lab.disponivel ? 'success' : 'muted'}>
                    {lab.disponivel ? 'Disponível' : 'Em breve'}
                  </Badge>
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-display text-lg font-semibold text-ink">{lab.nome}</h3>
                  <p className="text-sm text-ink-muted">{lab.descricao}</p>
                </div>
                <p className="mt-auto font-mono text-xs text-ink-muted/80">
                  {lab.bugs} {lab.bugs === 1 ? 'bug plantado' : 'bugs plantados'}
                </p>
              </GlassCard>
            )

            return lab.disponivel ? (
              <Link key={lab.id} to={lab.rota} data-testid={`home-card-${lab.id}`}>
                {conteudoCard}
              </Link>
            ) : (
              <div key={lab.id} data-testid={`home-card-${lab.id}`}>
                {conteudoCard}
              </div>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Como funciona</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((passo) => (
            <GlassCard key={passo.numero} className="flex flex-col gap-3 p-6">
              <span className="font-mono text-sm text-neon-cyan">{passo.numero}</span>
              <passo.Icone size={22} className="text-ink-muted" />
              <h3 className="font-display font-semibold text-ink">{passo.titulo}</h3>
              <p className="text-sm text-ink-muted">{passo.descricao}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-2xl items-center justify-center">
        <Link
          to="/sobre"
          data-testid="home-link-sobre"
          className="glass flex items-center gap-4 rounded-2xl px-6 py-4 transition-colors hover:border-neon-cyan/30"
        >
          <img
            src="/andreline.jpg"
            alt="Andreline Lira, criadora da QArena"
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
          <p className="text-sm text-ink-muted">
            Feito por Andreline Lira, Analista de Qualidade Sênior.{' '}
            <span className="inline-flex items-center gap-1 text-neon-cyan">
              Conheça quem criou este ambiente
              <ArrowRight size={14} />
            </span>
          </p>
        </Link>
      </section>
    </div>
  )
}
