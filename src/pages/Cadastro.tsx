import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Modal } from '@/components/ui/Modal'
import { BotaoCopiar } from '@/components/ui/BotaoCopiar'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore, type Usuario } from '@/store/authStore'
import { formatarCPF, formatarTelefone, validarCPF } from '@/lib/mascaras'

interface ErrosCadastro {
  nome?: string
  email?: string
  cpf?: string
  telefone?: string
  senha?: string
  confirmarSenha?: string
}

export function Cadastro() {
  const cadastrar = useAuthStore((estado) => estado.cadastrar)
  const { mostrarToast } = useToast()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [aceiteTermos, setAceiteTermos] = useState(false)
  const [comCreditos, setComCreditos] = useState(true)
  const [erros, setErros] = useState<ErrosCadastro>({})

  const [modalAberto, setModalAberto] = useState(false)
  const [contaCriada, setContaCriada] = useState<Usuario | null>(null)

  function validar(): ErrosCadastro {
    const novosErros: ErrosCadastro = {}

    if (!nome.trim()) novosErros.nome = 'Informe seu nome completo'

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) novosErros.email = 'Informe um e-mail em um formato válido'

    if (!validarCPF(cpf)) novosErros.cpf = 'Informe um CPF válido'

    if (telefone.replace(/\D/g, '').length < 10) novosErros.telefone = 'Informe um telefone válido'

    if (senha.length < 6) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres'

    if (!confirmarSenha) novosErros.confirmarSenha = 'Confirme a sua senha'

    return novosErros
  }

  function aoSubmeter(evento: FormEvent) {
    evento.preventDefault()

    const novosErros = validar()
    setErros(novosErros)

    mostrarToast('Conta criada com sucesso! Confira o número da sua conta.', 'sucesso')

    if (Object.keys(novosErros).length > 0) return

    const usuario = cadastrar({ nome, email, cpf, telefone, senha, comCreditos })
    setContaCriada(usuario)
    setModalAberto(true)
  }

  function aoFecharModal() {
    setModalAberto(false)
  }

  function aoIrParaLogin() {
    setModalAberto(false)
    navigate('/login')
  }

  return (
    <div className="container-arena flex justify-center py-16">
      <GlassCard className="w-full max-w-lg p-6 md:p-8">
        <h1 className="font-display text-2xl font-bold text-ink">Criar minha conta</h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Seus dados ficam só no seu navegador. Nada é enviado para nenhum servidor.
        </p>

        <form onSubmit={aoSubmeter} className="mt-6 flex flex-col gap-4" noValidate>
          <Input
            label="Nome completo"
            data-testid="cadastro-input-nome"
            testIdErro="cadastro-msg-erro-nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            erro={erros.nome}
            placeholder="Como você quer ser chamado por aqui"
          />

          <Input
            label="E-mail"
            type="email"
            data-testid="cadastro-input-email"
            testIdErro="cadastro-msg-erro-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            erro={erros.email}
            placeholder="seuemail@exemplo.com"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="CPF"
              data-testid="cadastro-input-cpf"
              testIdErro="cadastro-msg-erro-cpf"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              erro={erros.cpf}
              placeholder="000.000.000-00"
              inputMode="numeric"
            />

            <Input
              label="Telefone"
              data-testid="cadastro-input-telefone"
              testIdErro="cadastro-msg-erro-telefone"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              erro={erros.telefone}
              placeholder="(00) 00000-0000"
              inputMode="numeric"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Senha"
              type="password"
              data-testid="cadastro-input-senha"
              testIdErro="cadastro-msg-erro-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              erro={erros.senha}
              placeholder="Mínimo de 6 caracteres"
            />

            <Input
              label="Confirmar senha"
              type="password"
              data-testid="cadastro-input-confirmar-senha"
              testIdErro="cadastro-msg-erro-confirmar-senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              erro={erros.confirmarSenha}
              placeholder="Repita a senha"
            />
          </div>

          <label className="flex items-start gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              data-testid="cadastro-checkbox-termos"
              checked={aceiteTermos}
              onChange={(e) => setAceiteTermos(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-base-800 accent-neon-cyan"
            />
            Li e aceito os termos de uso deste ambiente fictício de testes
          </label>

          <label className="flex items-start gap-2.5 text-sm text-ink-muted">
            <input
              type="checkbox"
              data-testid="cadastro-checkbox-creditos"
              checked={comCreditos}
              onChange={(e) => setComCreditos(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-white/20 bg-base-800 accent-neon-cyan"
            />
            Criar conta com créditos QA para testes (1000 créditos)
          </label>

          <Button type="submit" variante="primary" data-testid="cadastro-btn-cadastrar" className="mt-2">
            Criar minha conta
          </Button>

          <p className="text-center text-sm text-ink-muted">
            Já tem conta?{' '}
            <Link to="/login" className="text-neon-cyan hover:underline" data-testid="cadastro-link-login">
              Entrar
            </Link>
          </p>
        </form>
      </GlassCard>

      <Modal aberto={modalAberto} aoFechar={aoFecharModal} titulo="Conta criada" testId="modal-cadastro-sucesso">
        <p className="text-sm text-ink-muted">
          A sua conta foi criada. Guarde o número dela, você vai usar para se reconhecer no ambiente.
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-base-900/60 px-4 py-3">
          <span data-testid="modal-cadastro-numero-conta" className="font-mono text-lg text-neon-cyan">
            {contaCriada?.numeroConta}
          </span>
          <BotaoCopiar
            valor={contaCriada?.numeroConta ?? ''}
            testId="modal-cadastro-btn-copiar"
          />
        </div>

        <Button
          variante="primary"
          className="mt-6 w-full"
          onClick={aoIrParaLogin}
          data-testid="modal-cadastro-btn-ir-login"
        >
          Ir para o login
        </Button>
      </Modal>
    </div>
  )
}
