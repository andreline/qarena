import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type VarianteBotao = 'primary' | 'secondary' | 'ghost' | 'danger'
type TamanhoBotao = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
  tamanho?: TamanhoBotao
}

const classesVariante: Record<VarianteBotao, string> = {
  primary:
    'bg-neon-cyan text-base-900 font-semibold hover:shadow-[0_0_24px_rgba(34,211,238,0.55)] focus-visible:shadow-[0_0_24px_rgba(34,211,238,0.55)]',
  secondary:
    'glass text-ink hover:border-neon-cyan/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]',
  ghost:
    'bg-transparent text-ink-muted hover:text-ink hover:bg-white/5',
  danger:
    'bg-transparent border border-danger/50 text-danger hover:bg-danger/10 hover:shadow-[0_0_20px_rgba(248,113,113,0.3)]',
}

const classesTamanho: Record<TamanhoBotao, string> = {
  sm: 'h-9 px-3 text-sm rounded-lg',
  md: 'h-11 px-5 text-base rounded-xl',
}

export function Button({
  variante = 'primary',
  tamanho = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-display transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none cursor-pointer',
        classesVariante[variante],
        classesTamanho[tamanho],
        className,
      )}
      {...props}
    />
  )
}
