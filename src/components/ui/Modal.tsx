import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ModalProps {
  aberto: boolean
  aoFechar: () => void
  titulo?: string
  children: ReactNode
  testId?: string
  className?: string
}

export function Modal({ aberto, aoFechar, titulo, children, testId, className }: ModalProps) {
  useEffect(() => {
    if (!aberto) return

    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') aoFechar()
    }

    window.addEventListener('keydown', aoPressionarTecla)
    return () => window.removeEventListener('keydown', aoPressionarTecla)
  }, [aberto, aoFechar])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-base-900/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      data-testid={testId}
    >
      <div className={cn('glass relative w-full max-w-md rounded-2xl bg-base-800/95 p-6', className)}>
        <button
          type="button"
          onClick={aoFechar}
          aria-label="Fechar"
          data-testid={testId ? `${testId}-btn-fechar` : undefined}
          className="absolute right-4 top-4 text-ink-muted transition-colors hover:text-ink cursor-pointer"
        >
          <X size={20} />
        </button>
        {titulo && <h2 className="mb-4 font-display text-xl font-semibold text-ink pr-8">{titulo}</h2>}
        {children}
      </div>
    </div>
  )
}
