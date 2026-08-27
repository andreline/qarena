import { Link } from 'react-router-dom'
import { Check, ChevronRight, Target } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { missoes, type NivelMissao } from '@/data/missoes'
import { useMissoesStore } from '@/store/missoesStore'
import { cn } from '@/lib/utils'

const corPorNivel: Record<NivelMissao, 'success' | 'warning' | 'danger'> = {
  Fácil: 'success',
  Médio: 'warning',
  Difícil: 'danger',
}

export function Missoes() {
  const concluidas = useMissoesStore((estado) => estado.concluidas)
  const alternarConclusao = useMissoesStore((estado) => estado.alternarConclusao)

  const totalConcluidas = concluidas.length

  return (
    <div className="container-arena flex flex-col gap-8 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-purple/30 bg-neon-purple/10 text-neon-purple">
          <Target size={26} />
        </span>
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Missões QA</h1>
        <p className="max-w-2xl text-ink-muted">
          Desafios guiados para praticar seu raciocínio de investigação. Nenhuma missão entrega o bug de bandeja,
          elas só apontam onde olhar.
        </p>
        <Badge tom="cyan" data-testid="missoes-progresso">
          {totalConcluidas} de {missoes.length} concluídas
        </Badge>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        {missoes.map((missao) => {
          const concluida = concluidas.includes(missao.id)
          return (
            <GlassCard
              key={missao.id}
              className={cn('flex items-start gap-4 p-5 transition-colors', concluida && 'border-success/30')}
              data-testid={`missoes-item-${missao.id}`}
            >
              <button
                type="button"
                onClick={() => alternarConclusao(missao.id)}
                data-testid={`missoes-btn-concluir-${missao.id}`}
                aria-label={concluida ? 'Marcar como não concluída' : 'Marcar como concluída'}
                className={cn(
                  'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors cursor-pointer',
                  concluida
                    ? 'border-success bg-success/20 text-success'
                    : 'border-white/20 text-transparent hover:border-white/40',
                )}
              >
                <Check size={14} />
              </button>

              <Link to={`/missoes/${missao.id}`} className="flex flex-1 items-center justify-between gap-3" data-testid={`missoes-link-${missao.id}`}>
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display font-semibold text-ink">{missao.titulo}</h2>
                    <Badge tom="muted">{missao.tela}</Badge>
                    <Badge tom={corPorNivel[missao.nivel]}>{missao.nivel}</Badge>
                  </div>
                  <p className="text-sm text-ink-muted">{missao.desafio}</p>
                </div>
                <ChevronRight size={20} className="shrink-0 text-ink-muted" />
              </Link>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
