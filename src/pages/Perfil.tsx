import { useState, type FormEvent } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store/authStore'

interface ErrosDados {
  nome?: string
  email?: string
}

interface ErrosSenha {
  senhaAtual?: string
  novaSenha?: string
  confirmarNovaSenha?: string
}

export function Perfil() {
  const usuario = useAuthStore((estado) => estado.usuarioLogado)
  const atualizarPerfil = useAuthStore((estado) => estado.atualizarPerfil)
  const { mostrarToast } = useToast()

  const [nome, setNome] = useState(usuario?.nome ?? '')
  const [email, setEmail] = useState(usuario?.email ?? '')
  const [telefone, setTelefone] = useState(usuario?.telefone ?? '')
  const [errosDados, setErrosDados] = useState<ErrosDados>({})

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('')
  const [errosSenha, setErrosSenha] = useState<ErrosSenha>({})

  if (!usuario) return null

  function aoSalvarDados(evento: FormEvent) {
    evento.preventDefault()

    const novosErros: ErrosDados = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novosErros.email = 'Informe um e-mail em um formato válido'
    setErrosDados(novosErros)
    if (Object.keys(novosErros).length > 0) return

    atualizarPerfil({ nome, email })
    mostrarToast('Dados atualizados com sucesso', 'sucesso')
  }

  function aoAlterarSenha(evento: FormEvent) {
    evento.preventDefault()

    const novosErros: ErrosSenha = {}
    if (novaSenha.length < 6) novosErros.novaSenha = 'A nova senha deve ter pelo menos 6 caracteres'
    if (confirmarNovaSenha !== novaSenha) novosErros.confirmarNovaSenha = 'A confirmação não é igual à nova senha'
    setErrosSenha(novosErros)
    if (Object.keys(novosErros).length > 0) return

    atualizarPerfil({ senha: novaSenha })
    setSenhaAtual('')
    setNovaSenha('')
    setConfirmarNovaSenha('')
    mostrarToast('Senha alterada com sucesso', 'sucesso')
  }

  return (
    <div className="container-arena flex flex-col gap-6 py-12">
      <h1 className="font-display text-3xl font-bold text-ink">Perfil do usuário</h1>

      <GlassCard className="flex flex-col gap-4 p-6">
        <h2 className="font-display font-semibold text-ink">Meus dados</h2>
        <form onSubmit={aoSalvarDados} className="flex flex-col gap-4" noValidate>
          <Input
            label="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            data-testid="perfil-input-nome"
          />
          <Input
            label="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            erro={errosDados.email}
            testIdErro="perfil-msg-erro-email"
            data-testid="perfil-input-email"
          />
          <Input
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            data-testid="perfil-input-telefone"
          />
          <Button type="submit" variante="primary" data-testid="perfil-btn-salvar-dados" className="self-start">
            Salvar dados
          </Button>
        </form>
      </GlassCard>

      <GlassCard className="flex flex-col gap-4 p-6">
        <h2 className="font-display font-semibold text-ink">Alterar senha</h2>
        <form onSubmit={aoAlterarSenha} className="flex flex-col gap-4" noValidate>
          <Input
            label="Senha atual"
            type="password"
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            erro={errosSenha.senhaAtual}
            testIdErro="perfil-msg-erro-senha-atual"
            data-testid="perfil-input-senha-atual"
          />
          <Input
            label="Nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            erro={errosSenha.novaSenha}
            testIdErro="perfil-msg-erro-nova-senha"
            data-testid="perfil-input-nova-senha"
          />
          <Input
            label="Confirmar nova senha"
            type="password"
            value={confirmarNovaSenha}
            onChange={(e) => setConfirmarNovaSenha(e.target.value)}
            erro={errosSenha.confirmarNovaSenha}
            testIdErro="perfil-msg-erro-confirmar-nova-senha"
            data-testid="perfil-input-confirmar-nova-senha"
          />
          <Button type="submit" variante="secondary" data-testid="perfil-btn-alterar-senha" className="self-start">
            Alterar senha
          </Button>
        </form>
      </GlassCard>
    </div>
  )
}
