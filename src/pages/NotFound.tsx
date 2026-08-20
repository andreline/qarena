import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'

export function NotFound() {
  return (
    <div className="container-arena flex min-h-[70vh] flex-col items-center justify-center gap-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neon-magenta/10 border border-neon-magenta/30 text-neon-magenta">
        <Search size={28} />
      </span>

      <h1 className="text-gradient font-display text-5xl font-extrabold">404</h1>
      <p className="max-w-md text-ink-muted">
        Nesta versão do QArena, só a home está pronta. As demais telas ainda vão ser plantadas, junto com os bugs
        delas.
      </p>

      <GlassCard className="w-full max-w-md p-4 text-left" data-testid="not-found-comparativo">
        <p className="font-mono text-sm text-ink-muted">
          <span className="text-success">resultado esperado</span>: uma tela existente
          <br />
          <span className="text-danger">resultado atual</span>: rota não encontrada
        </p>
      </GlassCard>

      <Link to="/">
        <Button variante="primary" data-testid="not-found-btn-voltar">
          Voltar para o início
        </Button>
      </Link>
    </div>
  )
}
