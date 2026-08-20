import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type TomBadge = 'cyan' | 'blue' | 'purple' | 'magenta' | 'success' | 'warning' | 'danger' | 'muted'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tom?: TomBadge
}

const classesTom: Record<TomBadge, string> = {
  cyan: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30',
  blue: 'bg-neon-blue/10 text-neon-blue border-neon-blue/30',
  purple: 'bg-neon-purple/10 text-neon-purple border-neon-purple/30',
  magenta: 'bg-neon-magenta/10 text-neon-magenta border-neon-magenta/30',
  success: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  muted: 'bg-white/5 text-ink-muted border-white/10',
}

export function Badge({ tom = 'muted', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium font-mono',
        classesTom[tom],
        className,
      )}
      {...props}
    />
  )
}
