import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight, Target, Lightbulb } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { missoes, type GrupoMissao } from '@/data/missoes'
import { totalMissoes } from '@/data/niveisConfig'
import { useProgressoStore } from '@/store/progressoStore'
import { cn } from '@/lib/utils'

const corPorNivel: Record<GrupoMissao, 'success' | 'warning' | 'danger' | 'magenta'> = {
  Iniciante: 'success',
  Explorador: 'warning',
  Analista: 'magenta',
  Especialista: 'danger',
}

const grupos: GrupoMissao[] = ['Iniciante', 'Explorador', 'Analista', 'Especialista']

const laboratoriosDasMissoes = Array.from(new Set(missoes.map((m) => m.laboratorio)))

type EstadoMissao = 'nao-iniciada' | 'em-andamento' | 'concluida'

function IndicadorMissao({ estado, usouDica }: { estado: EstadoMissao; usouDica: boolean }) {
  const titulo =
    estado === 'concluida'
      ? 'Missão concluída'
      : estado === 'em-andamento'
        ? 'Missão em andamento. Abra a missão para concluir'
        : 'Abra a missão para concluir'

  return (
    <span
      title={titulo}
      data-testid="missao-indicador"
      data-estado={estado}
      className={cn(
        'relative mt-0.5 flex h-6 w-6 shrink-0 cursor-default items-center justify-center rounded-full border transition-colors',
        estado === 'concluida' && 'border-neon-cyan bg-neon-cyan text-base-900',
        estado === 'em-andamento' && 'border-neon-cyan bg-neon-cyan/15 text-transparent',
        estado === 'nao-iniciada' && 'border-white/20 text-transparent',
      )}
    >
      {estado === 'concluida' && <Check size={14} />}
      {estado === 'em-andamento' && <span className="h-2 w-2 rounded-full bg-neon-cyan" />}
      {usouDica && estado !== 'nao-iniciada' && (
        <Lightbulb size={10} className="absolute -bottom-1 -right-1 rounded-full bg-base-900 text-warning" />
      )}
    </span>
  )
}

export function Missoes() {
  const missoesConcluidas = useProgressoStore((estado) => estado.missoesConcluidas)
  const missoesEmAndamento = useProgressoStore((estado) => estado.missoesEmAndamento)
  const dicasUsadas = useProgressoStore((estado) => estado.dicasUsadas)

  const [filtroNivel, setFiltroNivel] = useState<GrupoMissao | 'Todos'>('Todos')
  const [filtroLaboratorio, setFiltroLaboratorio] = useState<string>('Todos')

  const missoesFiltradas = missoes.filter((missao) => {
    const combinaNivel = filtroNivel === 'Todos' || missao.nivel === filtroNivel
    const combinaLaboratorio = filtroLaboratorio === 'Todos' || missao.laboratorio === filtroLaboratorio
    return combinaNivel && combinaLaboratorio
  })

  return (
    <div className="container-arena flex flex-col gap-8 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-neon-purple/30 bg-neon-purple/10 text-neon-purple">
          <Target size={26} />
        </span>
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Missões QA</h1>
        <p className="max-w-2xl text-ink-muted">
          Desafios guiados para praticar seu raciocínio de investigação. Nenhuma missão entrega o bug de bandeja,
          elas só apontam onde olhar. A conclusão só acontece dentro da missão.
        </p>
        <Badge tom="cyan" data-testid="missoes-progresso">
          {missoesConcluidas.length} de {totalMissoes} concluídas
        </Badge>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
        <select
          value={filtroNivel}
          onChange={(e) => setFiltroNivel(e.target.value as GrupoMissao | 'Todos')}
          data-testid="missoes-select-nivel"
          className="h-10 rounded-lg border border-white/10 bg-base-800/80 px-3 text-sm text-ink outline-none focus:border-neon-cyan"
        >
          <option value="Todos">Todos os níveis</option>
          {grupos.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={filtroLaboratorio}
          onChange={(e) => setFiltroLaboratorio(e.target.value)}
          data-testid="missoes-select-laboratorio"
          className="h-10 rounded-lg border border-white/10 bg-base-800/80 px-3 text-sm text-ink outline-none focus:border-neon-cyan"
        >
          <option value="Todos">Todos os laboratórios</option>
          {laboratoriosDasMissoes.map((lab) => (
            <option key={lab} value={lab}>
              {lab}
            </option>
          ))}
        </select>
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4" data-testid="missoes-lista">
        {missoesFiltradas.map((missao) => {
          const concluida = missoesConcluidas.includes(missao.id)
          const emAndamento = missoesEmAndamento.includes(missao.id)
          const estado: EstadoMissao = concluida ? 'concluida' : emAndamento ? 'em-andamento' : 'nao-iniciada'

          return (
            <Link
              key={missao.id}
              to={`/missoes/${missao.id}`}
              data-testid={`missoes-link-${missao.id}`}
            >
              <GlassCard
                className={cn('flex items-start gap-4 p-5 transition-colors hover:border-white/20', concluida && 'border-success/30')}
                data-testid={`missoes-item-${missao.id}`}
              >
                <IndicadorMissao estado={estado} usouDica={dicasUsadas.includes(missao.id)} />

                <div className="flex flex-1 items-center justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-ink-muted">{missao.numero}.</span>
                      <h2 className="font-display font-semibold text-ink">{missao.nome}</h2>
                      <Badge tom="muted">{missao.laboratorio}</Badge>
                      <Badge tom={corPorNivel[missao.nivel]}>{missao.nivel}</Badge>
                    </div>
                    <p className="text-sm text-ink-muted">{missao.objetivo}</p>
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-ink-muted" />
                </div>
              </GlassCard>
            </Link>
          )
        })}

        {missoesFiltradas.length === 0 && (
          <p className="py-8 text-center text-ink-muted" data-testid="missoes-msg-vazio">
            Nenhuma missão encontrada com esses filtros.
          </p>
        )}
      </div>
    </div>
  )
}
