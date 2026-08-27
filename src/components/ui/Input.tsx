import type { InputHTMLAttributes } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  erro?: string
  testIdErro?: string
}

export function Input({ label, erro, testIdErro, id, className, ...props }: InputProps) {
  const idGerado = useId()
  const idCampo = id ?? idGerado

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={idCampo} className="text-sm font-medium text-ink-muted">
          {label}
        </label>
      )}
      <input
        id={idCampo}
        className={cn(
          'h-11 rounded-lg bg-base-800/80 border px-3.5 text-ink placeholder:text-ink-muted/60 outline-none transition-colors duration-200 focus:border-neon-cyan',
          erro ? 'border-danger/60' : 'border-white/10',
          className,
        )}
        {...props}
      />
      {erro && (
        <span data-testid={testIdErro} className="text-sm text-danger">
          {erro}
        </span>
      )}
    </div>
  )
}
