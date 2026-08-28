import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { Music2, Gift, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { InstagramIcon, LinkedinIcon, GithubIcon } from '@/components/icons/IconesSociais'
import { redes } from '@/data/redes'
import { aberturaSobre, secoesSobre, tituloRedesSobre, convitecursoSobre } from '@/data/sobre'

const iconesPorRede: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  tiktok: Music2,
  github: GithubIcon,
}

const idsComCard = new Set(['formacao', 'como-foi-feito'])

export function Sobre() {
  return (
    <div className="container-arena flex flex-col gap-16 py-16">
      <section className="flex flex-col items-center gap-8 lg:flex-row lg:items-center">
        <div className="relative shrink-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 scale-110 rounded-full blur-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.45), rgba(124,58,237,0.4), rgba(233,53,193,0.45))' }}
          />
          <div
            className="rounded-full p-[3px]"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #7c3aed, #e935c1)' }}
          >
            <img
              src="/andreline.jpg"
              alt="Andreline Lira, criadora da QArena"
              data-testid="sobre-foto"
              className="h-48 w-48 rounded-full border-4 border-base-900 object-cover sm:h-56 sm:w-56"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 text-center lg:text-left">
          <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">{aberturaSobre.titulo}</h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink-muted">{aberturaSobre.texto}</p>
        </div>
      </section>

      <div className="mx-auto flex w-full max-w-2xl flex-col gap-14">
        {secoesSobre.map((secao) =>
          idsComCard.has(secao.id) ? (
            <GlassCard key={secao.id} className="flex flex-col gap-3 p-6 sm:p-8" data-testid={`sobre-secao-${secao.id}`}>
              <h2 className="font-display text-xl font-semibold text-ink">{secao.titulo}</h2>
              {secao.paragrafos.map((paragrafo) => (
                <p key={paragrafo} className="leading-relaxed text-ink-muted">
                  {paragrafo}
                </p>
              ))}
            </GlassCard>
          ) : (
            <div key={secao.id} className="flex flex-col gap-3" data-testid={`sobre-secao-${secao.id}`}>
              <h2 className="font-display text-xl font-semibold text-ink">{secao.titulo}</h2>
              {secao.paragrafos.map((paragrafo) => (
                <p key={paragrafo} className="leading-relaxed text-ink-muted">
                  {paragrafo}
                </p>
              ))}
            </div>
          ),
        )}

        <div className="flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-xl font-semibold text-ink">{tituloRedesSobre}</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {redes.map((rede) => {
              const Icone = iconesPorRede[rede.id]
              return (
                <a
                  key={rede.id}
                  href={rede.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`sobre-link-${rede.id}`}
                  className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan"
                >
                  <Icone size={18} />
                  {rede.nome}
                </a>
              )
            })}
          </div>
        </div>

        <GlassCard className="flex flex-col items-center gap-3 p-6 text-center sm:p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
            <Gift size={20} />
          </span>
          <p className="max-w-lg text-sm leading-relaxed text-ink-muted" data-testid="sobre-convite-curso">
            {convitecursoSobre.textoAntes}
            <strong className="font-semibold text-ink">{convitecursoSobre.destaque}</strong>
            {convitecursoSobre.textoDepois}
          </p>
          <Link to="/cursos">
            <Button variante="primary" data-testid="sobre-btn-cursos">
              Conhecer os cursos
              <ArrowRight size={16} />
            </Button>
          </Link>
        </GlassCard>
      </div>
    </div>
  )
}
