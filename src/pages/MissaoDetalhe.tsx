import { Link, useParams } from 'react-router-dom'
import { Check, ChevronLeft, Database, Lightbulb, ListChecks, Target } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { missoes, type NivelMissao } from '@/data/missoes'
import { useMissoesStore } from '@/store/missoesStore'
import { cn } from '@/lib/utils'

const corPorNivel: Record<NivelMissao, 'success' | 'warning' | 'danger'> = {
  Fácil: 'success',
  Médio: 'warning',
  Difícil: 'danger',
}

export function MissaoDetalhe() {
  const { slug } = useParams()
  const concluidas = useMissoesStore((estado) => estado.concluidas)
  const alternarConclusao = useMissoesStore((estado) => estado.alternarConclusao)

  const missao = missoes.find((item) => item.id === slug)

  if (!missao) {
    return (
      <div className="container-arena flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Missão não encontrada</h1>
        <Link to="/missoes">
          <Button variante="primary" data-testid="missao-detalhe-btn-voltar-nao-encontrada">
            Voltar para as missões
          </Button>
        </Link>
      </div>
    )
  }

  const concluida = concluidas.includes(missao.id)

  return (
    <div className="container-arena flex flex-col gap-6 py-16">
      <Link to="/missoes" className="flex w-fit items-center gap-1.5 text-sm text-ink-muted hover:text-ink" data-testid="missao-detalhe-link-voltar">
        <ChevronLeft size={16} />
        Voltar para as missões
      </Link>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tom="muted">{missao.tela}</Badge>
            <Badge tom={corPorNivel[missao.nivel]}>{missao.nivel}</Badge>
            {concluida && <Badge tom="success">Concluída</Badge>}
          </div>
          <h1 className="font-display text-3xl font-bold text-ink" data-testid="missao-detalhe-titulo">
            {missao.titulo}
          </h1>
        </div>

        <GlassCard className="flex flex-col gap-3 p-6">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-neon-cyan" />
            <h2 className="font-display font-semibold text-ink">Objetivo</h2>
          </div>
          <p className="text-sm text-ink-muted" data-testid="missao-detalhe-objetivo">
            {missao.objetivo}
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <div className="flex items-center gap-2">
            <ListChecks size={18} className="text-neon-purple" />
            <h2 className="font-display font-semibold text-ink">O que investigar</h2>
          </div>
          <ul className="flex flex-col gap-2.5" data-testid="missao-detalhe-investigar">
            {missao.oQueInvestigar.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-ink-muted">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-neon-purple" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>

        {missao.massaDadosRecomendada && (
          <GlassCard className="flex flex-col gap-3 p-6">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-neon-magenta" />
              <h2 className="font-display font-semibold text-ink">Massa de dados recomendada</h2>
            </div>
            <p className="text-sm text-ink-muted" data-testid="missao-detalhe-massa-dados">
              {missao.massaDadosRecomendada}
            </p>
          </GlassCard>
        )}

        {missao.dica && (
          <div className="flex items-start gap-3 rounded-lg border border-warning/20 bg-warning/5 px-4 py-3 text-sm text-warning" data-testid="missao-detalhe-dica">
            <Lightbulb size={18} className="mt-0.5 shrink-0" />
            {missao.dica}
          </div>
        )}

        <Button
          variante={concluida ? 'secondary' : 'primary'}
          onClick={() => alternarConclusao(missao.id)}
          data-testid="missao-detalhe-btn-concluir"
          className="self-start"
        >
          <Check size={16} className={cn(!concluida && 'opacity-50')} />
          {concluida ? 'Marcar como não concluída' : 'Marcar como concluída'}
        </Button>
      </div>
    </div>
  )
}
