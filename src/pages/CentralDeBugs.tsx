import { useState } from 'react'
import { AlertTriangle, Bug as BugIcon } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { bugs, totalBugsCatalogados } from '@/data/bugs'

function agruparPorTela(): Map<string, typeof bugs> {
  const grupos = new Map<string, typeof bugs>()
  for (const bug of bugs) {
    const lista = grupos.get(bug.tela) ?? []
    lista.push(bug)
    grupos.set(bug.tela, lista)
  }
  return grupos
}

export function CentralDeBugs() {
  const [revelado, setRevelado] = useState(false)
  const grupos = agruparPorTela()

  if (!revelado) {
    return (
      <div className="container-arena flex flex-col items-center gap-5 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-warning/30 bg-warning/10 text-warning">
          <AlertTriangle size={28} />
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">Central de Bugs</h1>
        <p className="max-w-lg text-ink-muted">
          Aqui está o gabarito com os {totalBugsCatalogados} bugs plantados no QArena. Isso é spoiler puro: se você
          ainda não testou por conta própria, a recomendação é voltar depois de ter investigado as telas sozinho.
        </p>
        <Button variante="primary" onClick={() => setRevelado(true)} data-testid="central-bugs-btn-revelar">
          Já testei, quero ver o gabarito
        </Button>
      </div>
    )
  }

  return (
    <div className="container-arena flex flex-col gap-8 py-16" data-testid="central-bugs-conteudo">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Central de Bugs</h1>
        <p className="mx-auto max-w-2xl text-ink-muted">
          O gabarito completo. {totalBugsCatalogados} bugs, organizados por tela.
        </p>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        {Array.from(grupos.entries()).map(([tela, bugsDaTela]) => (
          <div key={tela} className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <BugIcon size={18} className="text-neon-magenta" />
              <h2 className="font-display text-lg font-semibold text-ink">{tela}</h2>
              <Badge tom="muted">{bugsDaTela.length}</Badge>
            </div>

            <div className="flex flex-col gap-3">
              {bugsDaTela.map((bug) => (
                <GlassCard key={bug.id} className="flex flex-col gap-2 p-5" data-testid={`central-bugs-item-${bug.id.toLowerCase()}`}>
                  <Badge tom="cyan" className="w-fit font-mono">
                    {bug.id}
                  </Badge>
                  <p className="text-sm text-ink-muted">
                    <span className="text-success">Esperado:</span> {bug.comportamentoEsperado}
                  </p>
                  <p className="text-sm text-ink-muted">
                    <span className="text-danger">Atual:</span> {bug.comportamentoAtual}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
