import { Search, Bug, Crosshair, Crown, Lock } from 'lucide-react'
import { nivelPorNumero, type SimboloNivel } from '@/data/niveisConfig'
import { cn } from '@/lib/utils'

const SHIELD_PATH =
  'M100,16 C128,16 156,26 172,36 L172,108 C172,158 148,190 100,214 C52,190 28,158 28,108 L28,36 C44,26 72,16 100,16 Z'

const SHIELD_INNER_PATH =
  'M100,30 C122,30 144,38 158,46 L158,106 C158,148 138,175 100,198 C62,175 42,148 42,106 L42,46 C56,38 78,30 100,30 Z'

interface EscudoProps {
  nivel: number
  bloqueado?: boolean
  tamanho?: number
  brilhoPulsante?: boolean
  girando?: boolean
  className?: string
  'data-testid'?: string
}

function SimboloCentral({ tipo, cor }: { tipo: SimboloNivel; cor: string }) {
  const props = { size: 40, color: cor, strokeWidth: 2.25 }

  if (tipo === 'lupa') return <Search {...props} />
  if (tipo === 'inseto') return <Bug {...props} />
  if (tipo === 'alvo') return <Crosshair {...props} />
  if (tipo === 'lupa-inseto') {
    return (
      <div className="relative flex items-center justify-center">
        <Bug size={30} color={cor} strokeWidth={2} style={{ opacity: 0.85 }} />
        <Search size={22} color={cor} strokeWidth={2.5} className="absolute -bottom-1.5 -right-2" />
      </div>
    )
  }
  if (tipo === 'inseto-capturado') {
    return (
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border-2" style={{ borderColor: cor }}>
        <Bug size={22} color={cor} strokeWidth={2.25} />
      </div>
    )
  }
  return (
    <div className="relative flex flex-col items-center gap-0.5">
      <Crown size={26} color={cor} strokeWidth={2.25} fill={cor} fillOpacity={0.25} />
      <div className="flex items-center gap-0.5">
        <Bug size={16} color={cor} strokeWidth={2} />
        <Search size={13} color={cor} strokeWidth={2.5} />
      </div>
    </div>
  )
}

export function Escudo({
  nivel,
  bloqueado = false,
  tamanho = 160,
  brilhoPulsante = false,
  girando = false,
  className,
  'data-testid': testId,
}: EscudoProps) {
  const config = nivelPorNumero(nivel)
  const gradId = `escudo-grad-${nivel}`
  const shineId = `escudo-shine-${nivel}`
  const [corA, corB] = config.gradiente
  const altura = tamanho * 1.1

  return (
    <div
      className={cn('relative inline-flex shrink-0 items-center justify-center', brilhoPulsante && 'animate-escudo-pulso', className)}
      style={{ width: tamanho, height: altura }}
      data-testid={testId}
    >
      <svg viewBox="0 0 200 220" width={tamanho} height={altura} className={cn(girando && 'animate-escudo-girando')}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bloqueado ? '#3a4356' : corA} />
            <stop offset="100%" stopColor={bloqueado ? '#1c2233' : corB} />
          </linearGradient>
          <linearGradient id={shineId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="30%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="48%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`clip-${nivel}-${bloqueado ? 'l' : 'u'}`}>
            <path d={SHIELD_PATH} />
          </clipPath>
        </defs>

        <path
          d={SHIELD_PATH}
          fill={`url(#${gradId})`}
          stroke={bloqueado ? '#0f1420' : '#0b0f19'}
          strokeWidth={5}
          opacity={bloqueado ? 0.55 : 1}
        />

        <path
          d={SHIELD_INNER_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
          opacity={bloqueado ? 0.15 : 0.45}
        />

        {!bloqueado && (
          <rect
            x="0"
            y="0"
            width="200"
            height="220"
            fill={`url(#${shineId})`}
            clipPath={`url(#clip-${nivel}-u)`}
          />
        )}

        <g clipPath={`url(#clip-${nivel}-${bloqueado ? 'l' : 'u'})`}>
          <path
            d="M15,150 L60,190 L60,205 L15,165 Z"
            fill={bloqueado ? '#151a28' : '#0b0f19'}
            opacity={bloqueado ? 0.6 : 0.85}
          />
          <path
            d="M185,150 L140,190 L140,205 L185,165 Z"
            fill={bloqueado ? '#151a28' : '#0b0f19'}
            opacity={bloqueado ? 0.6 : 0.85}
          />
          <rect x="15" y="150" width="170" height="26" fill={bloqueado ? '#151a28' : '#0b0f19'} opacity={bloqueado ? 0.6 : 0.85} />
        </g>

        {!bloqueado && (
          <text
            x="100"
            y="167"
            textAnchor="middle"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="11.5"
            fontWeight="700"
            letterSpacing="0.02em"
            fill="#e8ecf5"
          >
            {config.nome.length > 20 ? config.nome.split(' ').slice(0, 2).join(' ') : config.nome}
          </text>
        )}
      </svg>

      <div className="absolute" style={{ top: altura * 0.32 }}>
        {bloqueado ? <Lock size={34} color="#5d687f" strokeWidth={2} /> : <SimboloCentral tipo={config.simbolo} cor="#0b0f19" />}
      </div>

      {config.comCoroa && !bloqueado && (
        <div className="absolute" style={{ top: -tamanho * 0.08 }}>
          <Crown size={tamanho * 0.22} color={corA} fill={corA} fillOpacity={0.35} strokeWidth={2} />
        </div>
      )}
    </div>
  )
}
