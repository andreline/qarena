import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TipoEmail =
  | 'boas-vindas'
  | 'recuperacao-senha'
  | 'senha-alterada'
  | 'pedido-confirmado'
  | 'pedido-enviado'
  | 'pedido-cancelado'
  | 'cupom-desbloqueado'

export interface Email {
  id: string
  remetente: string
  destinatario: string
  assunto: string
  corpo: string
  dataEnvio: string
  lido: boolean
  tipo: TipoEmail
}

type DadosNovoEmail = Omit<Email, 'id' | 'dataEnvio' | 'lido'>

interface EmailState {
  emails: Email[]
  criarEmail: (dados: DadosNovoEmail) => Email
}

export const useEmailStore = create<EmailState>()(
  persist(
    (set, get) => ({
      emails: [],

      criarEmail: (dados) => {
        const estado = get()
        const email: Email = {
          ...dados,
          id: crypto.randomUUID(),
          dataEnvio: new Date().toISOString(),
          lido: false,
        }
        set({ emails: [email, ...estado.emails] })
        return email
      },
    }),
    { name: 'qarena-emails' },
  ),
)
