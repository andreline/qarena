import { UserX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/authStore'

export function ContaInativa() {
  const usuario = useAuthStore((estado) => estado.usuarioLogado)
  const reativarConta = useAuthStore((estado) => estado.reativarConta)
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  if (!usuario) return null

  function aoReativar() {
    reativarConta()
    mostrarToast('Conta reativada com sucesso', 'sucesso')
    navigate('/app')
  }

  return (
    <div className="container-arena flex justify-center py-20">
      <GlassCard className="flex w-full max-w-md flex-col items-center gap-4 p-8 text-center" data-testid="conta-inativa-conteudo">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-warning/30 bg-warning/10 text-warning">
          <UserX size={26} />
        </span>
        <h1 className="font-display text-2xl font-bold text-ink">Sua conta está inativa</h1>
        <p className="text-sm text-ink-muted">
          Você não acessa esta conta há um bom tempo. Para continuar usando o QArena, reative sua conta.
        </p>
        <Button variante="primary" onClick={aoReativar} data-testid="conta-inativa-btn-reativar" className="mt-2">
          Reativar minha conta
        </Button>
      </GlassCard>
    </div>
  )
}
