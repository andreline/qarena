import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BotaoCopiarProps {
  valor: string
  testId?: string
  className?: string
  rotulo?: string
}

function copiarComFallback(valor: string) {
  const textarea = document.createElement('textarea')
  textarea.value = valor
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function BotaoCopiar({ valor, testId, className, rotulo = 'Copiar' }: BotaoCopiarProps) {
  const [copiado, setCopiado] = useState(false)

  async function aoClicar() {
    try {
      await navigator.clipboard.writeText(valor)
    } catch {
      try {
        copiarComFallback(valor)
      } catch {
        // ambiente nao permite copiar automaticamente, segue sem travar a tela
      }
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={aoClicar}
      data-testid={testId}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:border-neon-cyan/40 hover:text-neon-cyan cursor-pointer',
        className,
      )}
    >
      {copiado ? <Check size={14} /> : <Copy size={14} />}
      {copiado ? 'Copiado' : rotulo}
    </button>
  )
}
