import { createContext, useCallback, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type TipoToast = 'sucesso' | 'erro' | 'aviso'

interface ItemToast {
  id: number
  mensagem: string
  tipo: TipoToast
}

interface ToastContextValor {
  mostrarToast: (mensagem: string, tipo?: TipoToast) => void
}

const ToastContext = createContext<ToastContextValor | null>(null)

const configuracaoTipo: Record<TipoToast, { classe: string; Icone: typeof CheckCircle2 }> = {
  sucesso: { classe: 'border-success/40 text-success', Icone: CheckCircle2 },
  erro: { classe: 'border-danger/40 text-danger', Icone: XCircle },
  aviso: { classe: 'border-warning/40 text-warning', Icone: AlertTriangle },
}

let proximoId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ItemToast[]>([])

  const removerToast = useCallback((id: number) => {
    setToasts((atual) => atual.filter((item) => item.id !== id))
  }, [])

  const mostrarToast = useCallback(
    (mensagem: string, tipo: TipoToast = 'sucesso') => {
      const id = proximoId++
      setToasts((atual) => [...atual, { id, mensagem, tipo }])
      setTimeout(() => removerToast(id), 4000)
    },
    [removerToast],
  )

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2" data-testid="toast-container">
        {toasts.map((item) => {
          const { classe, Icone } = configuracaoTipo[item.tipo]
          return (
            <div
              key={item.id}
              data-testid={`toast-${item.tipo}`}
              className={cn(
                'glass flex items-center gap-2.5 rounded-lg bg-base-800/95 px-4 py-3 text-sm text-ink shadow-lg animate-in',
                classe,
              )}
            >
              <Icone size={18} className="shrink-0" />
              <span className="pr-2">{item.mensagem}</span>
              <button
                type="button"
                onClick={() => removerToast(item.id)}
                aria-label="Fechar aviso"
                className="ml-1 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const contexto = useContext(ToastContext)
  if (!contexto) throw new Error('useToast precisa estar dentro de ToastProvider')
  return contexto
}
