import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAuthStore } from '@/store/authStore'

interface ErrosLogin {
  email?: string
  geral?: string
}

function emailTemFormatoValido(valor: string): boolean {
  return valor.trim().length > 3 && valor.includes('.')
}

export function Login() {
  const login = useAuthStore((estado) => estado.login)
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [lembrarMe, setLembrarMe] = useState(false)
  const [erros, setErros] = useState<ErrosLogin>({})

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()

    if (!emailTemFormatoValido(email)) {
      setErros({ email: 'Informe um e-mail em um formato válido' })
      return
    }

    const resultado = login(email, senha)

    if (!resultado.sucesso) {
      setErros({ geral: resultado.erro })
      return
    }

    setErros({})

    if (resultado.usuario?.cadastroPendente) {
      navigate('/regularizacao', { replace: true })
      return
    }

    if (resultado.usuario?.inativo) {
      navigate('/conta-inativa', { replace: true })
      return
    }

    const estadoRota = location.state as { de?: string } | null
    navigate(estadoRota?.de ?? '/app', { replace: true })
  }

  return (
    <div className="container-arena flex justify-center py-16">
      <GlassCard className="w-full max-w-md p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Entrar no QArena</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Use a conta que você criou ou uma das contas de teste.</p>

        <form onSubmit={aoSubmeter} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label="E-mail"
            type="text"
            data-testid="login-input-email"
            testIdErro="login-msg-erro-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            erro={erros.email}
            placeholder="seuemail@exemplo.com"
          />

          <Input
            label="Senha"
            type="password"
            data-testid="login-input-senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={lembrarMe}
                onChange={(e) => setLembrarMe(e.target.checked)}
                data-testid="login-checkbox-lembrar-me"
                className="h-4 w-4 rounded border-white/20 bg-base-800/80 accent-neon-cyan"
              />
              Lembrar-me
            </label>
            <Link
              to="/esqueci-senha"
              className="text-xs text-neon-cyan hover:underline"
              data-testid="login-link-esqueci-senha"
            >
              Esqueci minha senha
            </Link>
          </div>

          {erros.geral && (
            <p data-testid="login-msg-erro-geral" className="text-sm text-danger">
              {erros.geral}
            </p>
          )}

          <Button type="submit" variante="primary" data-testid="login-btn-entrar" className="mt-2">
            Entrar
          </Button>

          <div className="flex flex-col items-center gap-2 text-sm text-ink-muted">
            <p>
              Ainda não tem conta?{' '}
              <Link to="/cadastro" className="text-neon-cyan hover:underline" data-testid="login-link-cadastro">
                Criar conta
              </Link>
            </p>
            <Link
              to="/massa-de-dados"
              className="text-xs text-ink-muted/70 hover:text-ink-muted"
              data-testid="login-link-massa-de-dados"
            >
              Precisa de uma conta de teste pronta? Veja a massa de dados
            </Link>
          </div>
        </form>
      </GlassCard>
    </div>
  )
}
