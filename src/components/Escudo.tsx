import { Search, Bug, Crosshair, Shield, Crown, Lock, Sparkle } from 'lucide-react'
import { nivelPorNumero, type SimboloNivel } from '@/data/niveisConfig'
import { cn } from '@/lib/utils'

const SHIELD_PATH = 'M32,22 L168,22 L168,128 L100,202 L32,128 Z'
const HALO_PATH = 'M24,14 L176,14 L176,133 L100,213 L24,133 Z'
const COR_LOCK_BASE = '#2a2f3d'
const COR_LOCK_ICONE = '#5c6478'
const COR_SIMBOLO = '#f8f9fc'

interface EscudoProps {
  nivel: number
  bloqueado?: boolean
  tamanho?: number
  brilhoPulsante?: boolean
  className?: string
  'data-testid'?: string
}

function SimboloCentral({ tipo, cor, tamanho }: { tipo: SimboloNivel; cor: string; tamanho: number }) {
  const strokeWidth = 2.5

  if (tipo === 'lupa') return <Search size={tamanho} color={cor} strokeWidth={strokeWidth} />
  if (tipo === 'inseto') return <Bug size={tamanho} color={cor} strokeWidth={strokeWidth} />
  if (tipo === 'alvo') return <Crosshair size={tamanho} color={cor} strokeWidth={strokeWidth} />

  if (tipo === 'lupa-inseto') {
    return (
      <div className="relative flex items-center justify-center" style={{ width: tamanho, height: tamanho }}>
        <Bug size={tamanho * 0.78} color={cor} strokeWidth={2.25} style={{ opacity: 0.9 }} />
        <Search
          size={tamanho * 0.6}
          color={cor}
          strokeWidth={2.75}
          className="absolute"
          style={{ bottom: -tamanho * 0.02, right: -tamanho * 0.06 }}
        />
      </div>
    )
  }

  if (tipo === 'inseto-escudo') {
    return (
      <div className="relative flex items-center justify-center" style={{ width: tamanho, height: tamanho }}>
        <Shield size={tamanho} color={cor} strokeWidth={2} fill={cor} fillOpacity={0.14} />
        <Bug size={tamanho * 0.48} color={cor} strokeWidth={2.5} className="absolute" style={{ top: tamanho * 0.06 }} />
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: tamanho, height: tamanho * 1.05 }}>
      <Search size={tamanho * 0.68} color={cor} strokeWidth={2.5} style={{ marginTop: tamanho * 0.22 }} />
      <Crown
        size={tamanho * 0.6}
        color={cor}
        strokeWidth={2.25}
        fill={cor}
        fillOpacity={0.9}
        className="absolute"
        style={{ top: -tamanho * 0.02 }}
      />
    </div>
  )
}

export function Escudo({
  nivel,
  bloqueado = false,
  tamanho = 160,
  brilhoPulsante = false,
  className,
  'data-testid': testId,
}: EscudoProps) {
  const config = nivelPorNumero(nivel)
  const nivel6 = nivel === 6 && !bloqueado
  const pulsar = (brilhoPulsante || nivel6) && !bloqueado
  const gradId = `escudo-grad-${nivel}`
  const altura = tamanho * 1.1
  const mostrarDetalhes = tamanho >= 60 && !bloqueado
  const cores = config.gradiente

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', pulsar && 'animate-escudo-pulso', className)}
      style={{ width: tamanho, height: altura, opacity: bloqueado ? 0.3 : 1 }}
      data-testid={testId}
    >
      {!bloqueado && (
        <div
          aria-hidden
          className="absolute rounded-full"
          style={{
            width: tamanho * 1.05,
            height: tamanho * 1.05,
            background: `radial-gradient(circle, ${cores[0]} 0%, transparent 68%)`,
            opacity: 0.5,
            filter: `blur(${Math.max(tamanho * 0.13, 10)}px)`,
          }}
        />
      )}

      <svg
        viewBox="0 0 200 220"
        width={tamanho}
        height={altura}
        className={cn('relative', nivel6 && 'animate-escudo-hue-lenta')}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            {bloqueado ? (
              <stop offset="0%" stopColor={COR_LOCK_BASE} />
            ) : cores.length >= 3 ? (
              <>
                <stop offset="0%" stopColor={cores[0]} />
                <stop offset="50%" stopColor={cores[1]} />
                <stop offset="100%" stopColor={cores[2]} />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor={cores[0]} />
                <stop offset="100%" stopColor={cores[1]} />
              </>
            )}
            {bloqueado && <stop offset="100%" stopColor={COR_LOCK_BASE} />}
          </linearGradient>
          <clipPath id={`escudo-clip-${nivel}-${bloqueado ? 'l' : 'u'}`}>
            <path d={SHIELD_PATH} />
          </clipPath>
        </defs>

        {!bloqueado && <path d={HALO_PATH} fill="none" stroke={config.neon} strokeWidth="5" opacity="0.85" />}

        <path
          d={SHIELD_PATH}
          fill={`url(#${gradId})`}
          stroke={bloqueado ? '#14171f' : '#0b0f19'}
          strokeWidth={bloqueado ? 2 : 2.5}
        />

        {!bloqueado && (
          <g clipPath={`url(#escudo-clip-${nivel}-u)`}>
            <polygon points="32,22 168,22 168,75 32,105" fill="#ffffff" opacity="0.16" />
            <line x1="55" y1="196" x2="140" y2="26" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="4" />
            <line x1="85" y1="196" x2="165" y2="30" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="3" />
          </g>
        )}
      </svg>

      {mostrarDetalhes && (
        <svg
          viewBox="0 0 200 220"
          width={tamanho}
          height={altura}
          className={cn('absolute inset-0', nivel6 && 'animate-arco-girar')}
          style={{ transformOrigin: '100px 112px' }}
          aria-hidden
        >
          <path d="M14,58 Q0,112 14,166" stroke={config.neon} strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M23,48 Q7,112 23,176" stroke={config.neon} strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
          <path d="M186,58 Q200,112 186,166" stroke={config.neon} strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M177,48 Q193,112 177,176" stroke={config.neon} strokeWidth="2" fill="none" opacity="0.3" strokeLinecap="round" />
        </svg>
      )}

      <div
        className="absolute flex items-center justify-center"
        style={{ top: altura * 0.28, width: tamanho, height: altura * 0.42 }}
      >
        {bloqueado ? (
          <Lock size={Math.max(tamanho * 0.22, 16)} color={COR_LOCK_ICONE} strokeWidth={2} />
        ) : (
          <SimboloCentral tipo={config.simbolo} cor={COR_SIMBOLO} tamanho={altura * 0.37} />
        )}
      </div>

      {nivel6 && mostrarDetalhes && (
        <>
          <Sparkle
            size={Math.max(tamanho * 0.09, 10)}
            className="absolute animate-brilho-cintilar"
            style={{ top: altura * 0.05, left: -tamanho * 0.03 }}
            color="#ffd45e"
            fill="#ffd45e"
            fillOpacity={0.85}
          />
          <Sparkle
            size={Math.max(tamanho * 0.07, 8)}
            className="absolute animate-brilho-cintilar"
            style={{ top: altura * 0.68, right: -tamanho * 0.04, animationDelay: '0.8s' }}
            color="#ffd45e"
            fill="#ffd45e"
            fillOpacity={0.8}
          />
          <Sparkle
            size={Math.max(tamanho * 0.06, 7)}
            className="absolute animate-brilho-cintilar"
            style={{ bottom: -altura * 0.01, left: tamanho * 0.32, animationDelay: '1.6s' }}
            color="#ffd45e"
            fill="#ffd45e"
            fillOpacity={0.7}
          />
        </>
      )}
    </div>
  )
}
