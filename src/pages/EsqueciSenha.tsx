import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck, Inbox } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAuthStore } from '@/store/authStore'

export function EsqueciSenha() {
  const solicitarRecuperacaoSenha = useAuthStore((estado) => estado.solicitarRecuperacaoSenha)

  const [email, setEmail] = useState('')
  const [erroEmail, setErroEmail] = useState('')
  const [resultado, setResultado] = useState<{ emailExiste: boolean } | null>(null)

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()

    if (!email.trim().includes('.') || !email.includes('@')) {
      setErroEmail('Informe um e-mail em um formato válido')
      return
    }

    setErroEmail('')
    const resposta = solicitarRecuperacaoSenha(email)
    setResultado(resposta)
  }

  return (
    <div className="container-arena flex justify-center py-16">
      <GlassCard className="w-full max-w-md p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Esqueci minha senha</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Informe o e-mail da sua conta para receber um link de recuperação.
        </p>

        {resultado ? (
          <div className="mt-6 flex flex-col items-center gap-3 text-center" data-testid="esqueci-senha-resultado">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan">
              <MailCheck size={22} />
            </span>
            {resultado.emailExiste ? (
              <>
                <p data-testid="esqueci-senha-msg-sucesso" className="text-sm text-ink-muted">
                  Enviamos um link de recuperação para o seu e-mail. Confira sua caixa de entrada.
                </p>
                <Link to="/caixa-de-entrada" className="w-full">
                  <Button variante="primary" data-testid="esqueci-senha-btn-abrir-caixa" className="w-full">
                    <Inbox size={16} />
                    Abrir caixa de entrada
                  </Button>
                </Link>
              </>
            ) : (
              <p data-testid="esqueci-senha-msg-nao-cadastrado" className="text-sm text-danger">
                E-mail não cadastrado.
              </p>
            )}
            <Link to="/login" className="text-sm text-neon-cyan hover:underline" data-testid="esqueci-senha-link-voltar">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form onSubmit={aoSubmeter} className="mt-6 flex flex-col gap-4" noValidate>
            <Input
              label="E-mail"
              type="text"
              data-testid="esqueci-senha-input-email"
              testIdErro="esqueci-senha-msg-erro-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              erro={erroEmail}
              placeholder="seuemail@exemplo.com"
            />

            <Button type="submit" variante="primary" data-testid="esqueci-senha-btn-enviar" className="mt-2">
              Enviar link de recuperação
            </Button>

            <Link
              to="/login"
              className="self-center text-sm text-ink-muted hover:text-ink"
              data-testid="esqueci-senha-link-cancelar"
            >
              Voltar para o login
            </Link>
          </form>
        )}
      </GlassCard>
    </div>
  )
}
