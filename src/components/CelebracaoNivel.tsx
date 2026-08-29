import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Gift } from 'lucide-react'
import { Escudo } from './Escudo'
import { GlassCard } from './ui/GlassCard'
import { Button } from './ui/Button'
import { BotaoCopiar } from './ui/BotaoCopiar'
import { cn } from '@/lib/utils'
import { totalMissoes, type NivelConfig } from '@/data/niveisConfig'

interface CelebracaoNivelProps {
  nivel: NivelConfig
  missoesConcluidas: number
  aoFinalizar: () => void
}

type Etapa = 'nivel' | 'recompensa'

function usePrefersReducedMotion(): boolean {
  const [reduzido, setReduzido] = useState(false)

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduzido(consulta.matches)
    function aoMudar() {
      setReduzido(consulta.matches)
    }
    consulta.addEventListener('change', aoMudar)
    return () => consulta.removeEventListener('change', aoMudar)
  }, [])

  return reduzido
}

const CORES_PARTICULA = ['#22d3ee', '#8b5cf6', '#ec4faf']
const CORES_PARTICULA_OURO = ['#22d3ee', '#8b5cf6', '#ec4faf', '#ffd45e', '#ffd45e']
const CORES_CONFETE = ['#22d3ee', '#8b5cf6', '#ec4faf', '#ffd45e']

interface Particula {
  id: number
  cor: string
  left: number
  dx: number
  delay: number
  tamanho: number
}

interface Confete {
  id: number
  cor: string
  left: number
  delay: number
  duracao: number
}

function gerarParticulas(quantidade: number, dourado: boolean): Particula[] {
  const cores = dourado ? CORES_PARTICULA_OURO : CORES_PARTICULA
  return Array.from({ length: quantidade }, (_, i) => ({
    id: i,
    cor: cores[i % cores.length],
    left: 32 + Math.random() * 36,
    dx: (Math.random() - 0.5) * 180,
    delay: Math.random() * 260,
    tamanho: 5 + Math.random() * 5,
  }))
}

function gerarConfete(quantidade: number): Confete[] {
  return Array.from({ length: quantidade }, (_, i) => ({
    id: i,
    cor: CORES_CONFETE[i % CORES_CONFETE.length],
    left: Math.random() * 100,
    delay: Math.random() * 1.6,
    duracao: 2.1 + Math.random() * 1.3,
  }))
}

export function CelebracaoNivel({ nivel, missoesConcluidas, aoFinalizar }: CelebracaoNivelProps) {
  const reduzido = usePrefersReducedMotion()
  const [etapa, setEtapa] = useState<Etapa>('nivel')
  const nivel6 = nivel.numero === 6

  const particulas = useMemo(() => (reduzido ? [] : gerarParticulas(nivel6 ? 34 : 18, nivel6)), [reduzido, nivel6])
  const confetes = useMemo(() => (reduzido ? [] : gerarConfete(50)), [reduzido])

  function avancar() {
    if (nivel.cupons && nivel.cupons.length > 0) {
      setEtapa('recompensa')
    } else {
      aoFinalizar()
    }
  }

  useEffect(() => {
    if (etapa !== 'nivel') return
    const duracao = nivel6 ? 16000 : 8000
    const temporizador = setTimeout(avancar, duracao)
    return () => clearTimeout(temporizador)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapa])

  if (etapa === 'nivel') {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-base-900/90 backdrop-blur-md animate-fundo-escurecer"
        data-testid="celebracao-nivel"
      >
        <div
          aria-hidden="true"
          className={cn('pointer-events-none absolute h-[150vmax] w-[150vmax]', !reduzido && 'animate-raios')}
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${nivel.gradiente[0]}26 12deg, transparent 45deg, transparent 180deg, ${nivel.gradiente[1]}26 195deg, transparent 225deg, transparent 360deg)`,
          }}
        />

        {particulas.map((p) => (
          <span
            key={p.id}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 animate-particula rounded-full"
            style={
              {
                left: `${p.left}%`,
                width: p.tamanho,
                height: p.tamanho,
                backgroundColor: p.cor,
                animationDelay: `${p.delay}ms`,
                '--dx': `${p.dx}px`,
              } as CSSProperties
            }
          />
        ))}

        <div className="relative flex flex-col items-center gap-3 px-6 text-center">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 animate-clarao rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent 65%)',
                animationDelay: '340ms',
              }}
            />
            <div className="animate-escudo-entrada">
              <Escudo nivel={nivel.numero} tamanho={200} brilhoPulsante data-testid="celebracao-escudo" />
            </div>
          </div>

          <div
            className="flex flex-col gap-1.5 animate-fade-simples"
            style={{ animationDelay: '420ms', animationFillMode: 'both' }}
          >
            <p className="font-mono text-sm text-neon-cyan" data-testid="celebracao-nivel-numero">
              Nível {nivel.numero} alcançado
            </p>
            <h2 className="font-display text-3xl font-bold text-ink">{nivel.nome}</h2>
            <p className="text-sm text-ink-muted">
              Você concluiu {missoesConcluidas} das {totalMissoes} missões
            </p>
          </div>

          <Button
            variante="primary"
            onClick={avancar}
            data-testid="celebracao-btn-continuar"
            className="mt-3 animate-fade-simples"
            style={{ animationDelay: '600ms', animationFillMode: 'both' }}
          >
            Continuar caçando
          </Button>
        </div>
      </div>
    )
  }

  const cupons = nivel.cupons ?? []

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-base-900/95 backdrop-blur-md"
      data-testid="celebracao-recompensa"
    >
      {confetes.map((c) => (
        <span
          key={c.id}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 h-2.5 w-1.5 animate-confete"
          style={{
            left: `${c.left}%`,
            backgroundColor: c.cor,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duracao}s`,
          }}
        />
      ))}

      <div className="relative flex w-full max-w-sm flex-col items-center gap-5 px-6 text-center">
        <Escudo nivel={nivel.numero} tamanho={110} />

        <GlassCard className="flex w-full flex-col items-center gap-4 p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
            <Gift size={24} />
          </span>
          <p className="text-sm text-ink-muted">{cupons.length > 1 ? 'Seus prêmios' : 'Seu prêmio'}</p>
          <h2 className="font-display text-2xl font-bold text-ink" data-testid="celebracao-recompensa-titulo">
            {cupons.length > 1
              ? `Você desbloqueou ${cupons.length} cupons de desconto!`
              : `${cupons[0].percentual}% de desconto no curso ${cupons[0].curso}`}
          </h2>

          <div className="flex w-full flex-col gap-4">
            {cupons.map((cupom) => (
              <div key={cupom.codigo} className="flex flex-col items-center gap-2">
                {cupons.length > 1 && (
                  <p className="text-sm text-ink-muted">
                    {cupom.percentual}% off — {cupom.curso}
                  </p>
                )}
                <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-neon-cyan/50 bg-neon-cyan/5 px-6 py-3">
                  <span className="font-mono text-xl text-neon-cyan" data-testid={`celebracao-cupom-codigo-${cupom.codigo}`}>
                    {cupom.codigo}
                  </span>
                </div>
                <BotaoCopiar valor={cupom.codigo} testId={`celebracao-btn-copiar-cupom-${cupom.codigo}`} rotulo="Copiar cupom" />
              </div>
            ))}
          </div>

          <Link to="/cursos" onClick={aoFinalizar} className="w-full">
            <Button variante="primary" data-testid="celebracao-btn-conhecer-curso" className="w-full">
              {cupons.length > 1 ? 'Conhecer os cursos' : 'Conhecer o curso'}
            </Button>
          </Link>

          <p className="text-xs text-ink-muted/70">
            {cupons.length > 1 ? 'Seus cupons ficam salvos' : 'Seu cupom fica salvo'} na aba de progresso, você pode
            voltar quando quiser.
          </p>
        </GlassCard>

        <Button variante="ghost" tamanho="sm" onClick={aoFinalizar} data-testid="celebracao-btn-fechar">
          Fechar
        </Button>
      </div>
    </div>
  )
}
