import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { KeyRound, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

interface ErrosRedefinir {
  novaSenha?: string
  geral?: string
}

function calcularForca(senha: string): { nivel: 0 | 1 | 2 | 3; rotulo: string; cor: string } {
  let pontos = 0
  if (senha.length >= 8) pontos++
  if (/[A-Z]/.test(senha)) pontos++
  if (/[0-9]/.test(senha)) pontos++
  if (/[^A-Za-z0-9]/.test(senha)) pontos++

  if (senha.length === 0) return { nivel: 0, rotulo: '', cor: 'bg-white/10' }
  if (pontos <= 1) return { nivel: 1, rotulo: 'Fraca', cor: 'bg-danger' }
  if (pontos <= 2) return { nivel: 2, rotulo: 'Média', cor: 'bg-warning' }
  return { nivel: 3, rotulo: 'Forte', cor: 'bg-success' }
}

export function RedefinirSenha() {
  const [parametros] = useSearchParams()
  const token = parametros.get('token') ?? ''
  const buscarUsuarioPorToken = useAuthStore((estado) => estado.buscarUsuarioPorToken)
  const redefinirSenha = useAuthStore((estado) => estado.redefinirSenha)
  const navigate = useNavigate()

  const usuario = buscarUsuarioPorToken(token)

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
  const [erros, setErros] = useState<ErrosRedefinir>({})
  const [concluido, setConcluido] = useState(false)

  const forca = calcularForca(novaSenha)

  if (!usuario) {
    return (
      <div className="container-arena flex justify-center py-16">
        <GlassCard className="flex w-full max-w-md flex-col items-center gap-3 p-8 text-center" data-testid="redefinir-senha-link-invalido">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-danger/30 bg-danger/10 text-danger">
            <AlertTriangle size={22} />
          </span>
          <h1 className="font-display text-xl font-bold text-ink">Link inválido</h1>
          <p className="text-sm text-ink-muted">Este link de redefinição de senha não é válido.</p>
          <Link to="/esqueci-senha" className="text-sm text-neon-cyan hover:underline">
            Solicitar um novo link
          </Link>
        </GlassCard>
      </div>
    )
  }

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()

    if (novaSenha.length < 8) {
      setErros({ novaSenha: 'A nova senha deve ter pelo menos 8 caracteres' })
      return
    }

    setErros({})
    const resultado = redefinirSenha(token, novaSenha)

    if (!resultado.sucesso) {
      setErros({ geral: resultado.erro })
      return
    }

    setConcluido(true)
  }

  if (concluido) {
    return (
      <div className="container-arena flex justify-center py-16">
        <GlassCard className="flex w-full max-w-md flex-col items-center gap-3 p-8 text-center" data-testid="redefinir-senha-sucesso">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
            <KeyRound size={22} />
          </span>
          <h1 className="font-display text-xl font-bold text-ink">Senha redefinida</h1>
          <p className="text-sm text-ink-muted">Sua senha foi alterada com sucesso. Use a nova senha para entrar.</p>
          <Button variante="primary" onClick={() => navigate('/login')} data-testid="redefinir-senha-btn-ir-login">
            Ir para o login
          </Button>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="container-arena flex justify-center py-16">
      <GlassCard className="w-full max-w-md p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Redefinir senha</h1>
        <p className="mt-1.5 text-sm text-ink-muted">Olá, {usuario.nome.split(' ')[0]}. Escolha uma nova senha.</p>

        <form onSubmit={aoSubmeter} className="mt-6 flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Input
              label="Nova senha"
              type="password"
              data-testid="redefinir-senha-input-nova-senha"
              testIdErro="redefinir-senha-msg-erro-nova-senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              erro={erros.novaSenha}
              placeholder="Mínimo de 8 caracteres"
            />
            <div className="flex gap-1.5" data-testid="redefinir-senha-indicador-forca">
              {[1, 2, 3].map((nivel) => (
                <span
                  key={nivel}
                  className={cn('h-1.5 flex-1 rounded-full', forca.nivel >= nivel ? forca.cor : 'bg-white/10')}
                />
              ))}
            </div>
            {forca.rotulo && (
              <span className="text-xs text-ink-muted" data-testid="redefinir-senha-forca-rotulo">
                Força da senha: {forca.rotulo}
              </span>
            )}
          </div>

          <Input
            label="Confirmar nova senha"
            type="password"
            data-testid="redefinir-senha-input-confirmar-senha"
            value={confirmarNovaSenha}
            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
            placeholder="Repita a nova senha"
          />

          {erros.geral && (
            <p data-testid="redefinir-senha-msg-erro-geral" className="text-sm text-danger">
              {erros.geral}
            </p>
          )}

          <Button type="submit" variante="primary" data-testid="redefinir-senha-btn-salvar" className="mt-2">
            Redefinir senha
          </Button>
        </form>
      </GlassCard>
    </div>
  )
}
