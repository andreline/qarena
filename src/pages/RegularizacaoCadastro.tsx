import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/authStore'
import { formatarCPF, formatarTelefone } from '@/lib/mascaras'

export function RegularizacaoCadastro() {
  const usuario = useAuthStore((estado) => estado.usuarioLogado)
  const regularizarCadastro = useAuthStore((estado) => estado.regularizarCadastro)
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const [cpf, setCpf] = useState(usuario?.cpf ?? '')
  const [telefone, setTelefone] = useState(usuario?.telefone ?? '')
  const [endereco, setEndereco] = useState(usuario?.endereco ?? '')

  if (!usuario) return null

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()
    regularizarCadastro({ cpf, telefone, endereco })
    mostrarToast('Cadastro regularizado com sucesso', 'sucesso')
    navigate('/app')
  }

  const pendencias = [
    { rotulo: 'CPF não confirmado', confirmado: usuario.pendencias.cpfConfirmado },
    { rotulo: 'Telefone não confirmado', confirmado: usuario.pendencias.telefoneConfirmado },
    { rotulo: 'Endereço não cadastrado', confirmado: usuario.pendencias.enderecoCadastrado },
  ]

  return (
    <div className="container-arena flex justify-center py-16">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <GlassCard className="flex flex-col gap-3 border-warning/30 p-6" data-testid="regularizacao-aviso">
          <div className="flex items-center gap-2 text-warning">
            <AlertTriangle size={20} />
            <h1 className="font-display text-xl font-bold text-ink">Cadastro pendente de regularização</h1>
          </div>
          <p className="text-sm text-ink-muted">
            Precisamos que você confirme alguns dados antes de continuar usando sua conta.
          </p>
        </GlassCard>

        <GlassCard className="flex flex-col gap-3 p-6">
          <h2 className="font-display font-semibold text-ink">O que está pendente</h2>
          <ul className="flex flex-col gap-2" data-testid="regularizacao-lista-pendencias">
            {pendencias.map((item) => (
              <li key={item.rotulo} className="flex items-center justify-between gap-3 text-sm text-ink-muted">
                {item.rotulo}
                <Badge tom={item.confirmado ? 'success' : 'danger'}>
                  {item.confirmado ? 'Confirmado' : 'Pendente'}
                </Badge>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4 p-6">
          <h2 className="font-display font-semibold text-ink">Confirmar meus dados</h2>
          <form onSubmit={aoSubmeter} className="flex flex-col gap-4" noValidate>
            <Input
              label="CPF"
              data-testid="regularizacao-input-cpf"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              placeholder="000.000.000-00"
              inputMode="numeric"
            />
            <p className="-mt-2 text-xs text-warning">
              Não use o seu CPF de verdade! Gere um CPF fictício em{' '}
              <Link
                to="/massa-de-dados"
                className="underline hover:text-warning/80"
                data-testid="regularizacao-link-gerador-cpf"
              >
                Massa de Dados
              </Link>
              .
            </p>
            <Input
              label="Telefone"
              data-testid="regularizacao-input-telefone"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(00) 00000-0000"
              inputMode="numeric"
            />
            <Input
              label="Endereço"
              data-testid="regularizacao-input-endereco"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, cidade - UF"
            />
            <Button type="submit" variante="primary" data-testid="regularizacao-btn-regularizar" className="mt-2">
              Regularizar cadastro
            </Button>
          </form>
        </GlassCard>

        <Link
          to="/app"
          className="self-center text-xs text-ink-muted/50 hover:text-ink-muted"
          data-testid="regularizacao-link-continuar-mesmo-assim"
        >
          Continuar mesmo assim
        </Link>
      </div>
    </div>
  )
}
