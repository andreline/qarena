import type { ComponentType } from 'react'
import { GraduationCap, ExternalLink, Music2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { InstagramIcon, LinkedinIcon, GithubIcon } from '@/components/icons/IconesSociais'
import { cursos } from '@/data/cursos'
import { redes } from '@/data/redes'

const iconesPorRede: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  tiktok: Music2,
  github: GithubIcon,
}

export function Cursos() {
  return (
    <div className="container-arena flex flex-col gap-16 py-16">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">Meus cursos</h1>
        <p className="mx-auto max-w-2xl text-ink-muted">
          Gostou de praticar aqui? O QArena é só uma parte do caminho. No curso completo, a Andreline te leva do
          zero até o seu primeiro trabalho como QA.
        </p>
      </div>

      <section className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {cursos.map((curso) => (
          <GlassCard key={curso.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between" data-testid={`cursos-card-${curso.id}`}>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
                <GraduationCap size={22} />
              </span>
              <div>
                <h2 className="font-display text-lg font-semibold text-ink">{curso.nome}</h2>
                <p className="mt-1 text-sm text-ink-muted">{curso.descricao}</p>
              </div>
            </div>
            <a href={curso.url} target="_blank" rel="noopener noreferrer" className="shrink-0">
              <Button variante="primary" data-testid={`cursos-btn-acessar-${curso.id}`} className="w-full sm:w-auto">
                Conhecer o curso
                <ExternalLink size={16} />
              </Button>
            </a>
          </GlassCard>
        ))}
      </section>

      <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5">
        <h2 className="font-display text-xl font-semibold text-ink">Onde me encontrar</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {redes.map((rede) => {
            const Icone = iconesPorRede[rede.id]
            return (
              <a
                key={rede.id}
                href={rede.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`cursos-link-social-${rede.id}`}
                className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan"
              >
                {Icone && <Icone size={18} />}
                {rede.nome}
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}
