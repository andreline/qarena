import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEmailStore } from './emailStore'
import { montarEmailRecuperacaoSenha, REMETENTE_QARENA } from '@/data/templatesEmail'

export interface Pendencias {
  cpfConfirmado: boolean
  telefoneConfirmado: boolean
  enderecoCadastrado: boolean
}

export interface Usuario {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  endereco: string
  senha: string
  numeroConta: string
  creditos: number
  bloqueado: boolean
  permissao: boolean
  contaSuspensa: boolean
  admin: boolean
  cadastroPendente: boolean
  inativo: boolean
  primeiroAcesso: boolean
  pendencias: Pendencias
  criadoEm: string
}

export interface DadosCadastro {
  nome: string
  email: string
  cpf: string
  telefone: string
  senha: string
  comCreditos: boolean
}

export interface ResultadoAuth {
  sucesso: boolean
  erro?: string
  usuario?: Usuario
}

export interface DadosRegularizacao {
  cpf: string
  telefone: string
  endereco: string
}

export interface TokenRecuperacao {
  token: string
  email: string
  criadoEm: string
}

interface AuthState {
  usuarios: Usuario[]
  usuarioLogado: Usuario | null
  proximoNumeroConta: number
  tokensRecuperacao: TokenRecuperacao[]
  cadastrar: (dados: DadosCadastro) => Usuario
  login: (email: string, senha: string) => ResultadoAuth
  logout: () => void
  atualizarPerfil: (dados: Partial<Usuario>) => void
  debitarCreditos: (valor: number) => void
  regularizarCadastro: (dados: DadosRegularizacao) => void
  reativarConta: () => void
  solicitarRecuperacaoSenha: (email: string) => { emailExiste: boolean }
  buscarUsuarioPorToken: (token: string) => Usuario | undefined
  redefinirSenha: (token: string, novaSenha: string) => ResultadoAuth
}

const usuariosSeed: Usuario[] = [
  {
    id: 'seed-1',
    nome: 'Usuário Sucesso',
    email: 'usuario.sucesso@qazero.com',
    cpf: '123.456.789-09',
    telefone: '(11) 91234-5678',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0001',
    creditos: 1000,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2',
    nome: 'Usuário Bloqueado',
    email: 'usuario.bloqueado@qazero.com',
    cpf: '234.567.890-10',
    telefone: '(11) 92345-6789',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0002',
    creditos: 500,
    bloqueado: true,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-3',
    nome: 'Usuário Sem Permissão',
    email: 'usuario.sempermissao@qazero.com',
    cpf: '345.678.901-21',
    telefone: '(11) 93456-7890',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0003',
    creditos: 500,
    bloqueado: false,
    permissao: false,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-4',
    nome: 'Usuário Suspenso',
    email: 'usuario.suspenso@qazero.com',
    cpf: '456.789.012-32',
    telefone: '(11) 94567-8901',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0004',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: true,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-5',
    nome: 'Usuário Com Um Nome Extremamente Longo Para Testar Quebra De Layout Na Tela',
    email: 'usuario.nomelongo@qazero.com',
    cpf: '567.890.123-43',
    telefone: '(11) 95678-9012',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0005',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-09-14T00:00:00.000Z',
  },
  {
    id: 'seed-6',
    nome: 'José da Conceição Neto',
    email: 'usuario.acentos@qazero.com',
    cpf: '678.901.234-54',
    telefone: '(11) 96789-0123',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0006',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-10-02T00:00:00.000Z',
  },
  {
    id: 'seed-7',
    nome: 'Li',
    email: 'usuario.nomecurto@qazero.com',
    cpf: '789.012.345-65',
    telefone: '(11) 97890-1234',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0007',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-10-20T00:00:00.000Z',
  },
  {
    id: 'seed-8',
    nome: 'Usuário Sem Telefone',
    email: 'usuario.semtelefone@qazero.com',
    cpf: '890.123.456-76',
    telefone: '',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0008',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-11-05T00:00:00.000Z',
  },
  {
    id: 'seed-9',
    nome: 'Usuário Sem Saldo',
    email: 'usuario.semsaldo@qazero.com',
    cpf: '901.234.567-87',
    telefone: '(11) 99012-3456',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0009',
    creditos: 0,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-11-22T00:00:00.000Z',
  },
  {
    id: 'seed-10',
    nome: 'Usuário Sem Pedidos',
    email: 'usuario.sempedidos@qazero.com',
    cpf: '012.345.678-98',
    telefone: '(11) 90123-4567',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0010',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-12-10T00:00:00.000Z',
  },
  {
    id: 'seed-11',
    nome: 'Usuário Cliente Frequente',
    email: 'usuario.commuitospedidos@qazero.com',
    cpf: '123.456.780-19',
    telefone: '(11) 91234-0987',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0011',
    creditos: 800,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-08-01T00:00:00.000Z',
  },
  {
    id: 'seed-12',
    nome: 'Usuário Completo',
    email: 'usuario.completo@qazero.com',
    cpf: '234.567.801-20',
    telefone: '(11) 92345-1098',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0012',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2026-01-15T00:00:00.000Z',
  },
  {
    id: 'seed-13',
    nome: 'Usuário Pendente',
    email: 'usuario.pendente@qazero.com',
    cpf: '',
    telefone: '',
    endereco: '',
    senha: 'Qa@123456',
    numeroConta: 'QA-0013',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: true,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: false, telefoneConfirmado: false, enderecoCadastrado: false },
    criadoEm: '2026-06-10T00:00:00.000Z',
  },
  {
    id: 'seed-14',
    nome: 'Administradora QArena',
    email: 'admin@qazero.com',
    cpf: '345.678.912-31',
    telefone: '(11) 93456-2109',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0014',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: true,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'seed-15',
    nome: 'Usuário Inativo',
    email: 'usuario.inativo@qazero.com',
    cpf: '456.789.123-42',
    telefone: '(11) 94567-3210',
    endereco: 'Rua Fictícia, 100, São Paulo - SP',
    senha: 'Qa@123456',
    numeroConta: 'QA-0015',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: true,
    primeiroAcesso: false,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
    criadoEm: '2024-08-20T00:00:00.000Z',
  },
  {
    id: 'seed-16',
    nome: 'Usuário Primeiro Acesso',
    email: 'usuario.primeiroacesso@qazero.com',
    cpf: '567.891.234-53',
    telefone: '(11) 95678-4321',
    endereco: '',
    senha: 'Qa@123456',
    numeroConta: 'QA-0016',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    admin: false,
    cadastroPendente: false,
    inativo: false,
    primeiroAcesso: true,
    pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: false },
    criadoEm: '2026-08-20T00:00:00.000Z',
  },
]

const idsContasReutilizaveis = ['seed-13', 'seed-15']

function usuarioSeedOriginal(id: string): Usuario | undefined {
  return usuariosSeed.find((u) => u.id === id)
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuarios: usuariosSeed,
      usuarioLogado: null,
      proximoNumeroConta: 17,
      tokensRecuperacao: [],

      cadastrar: (dados) => {
        const estado = get()
        const numeroConta = `QA-${String(estado.proximoNumeroConta).padStart(4, '0')}`

        const novoUsuario: Usuario = {
          id: crypto.randomUUID(),
          nome: dados.nome,
          email: dados.email,
          cpf: dados.cpf,
          telefone: dados.telefone,
          endereco: '',
          senha: dados.senha,
          numeroConta,
          creditos: dados.comCreditos ? 1000 : 0,
          bloqueado: false,
          permissao: true,
          contaSuspensa: false,
          admin: false,
          cadastroPendente: false,
          inativo: false,
          primeiroAcesso: false,
          pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
          criadoEm: new Date().toISOString(),
        }

        set({
          usuarios: [...estado.usuarios, novoUsuario],
          proximoNumeroConta: estado.proximoNumeroConta + 1,
        })

        return novoUsuario
      },

      login: (email, senha) => {
        const estado = get()
        const usuario = estado.usuarios.find((u) => u.email === email)

        if (!usuario) return { sucesso: false, erro: 'Usuário não encontrado' }
        if (usuario.senha !== senha) return { sucesso: false, erro: 'Usuário não encontrado' }
        if (usuario.contaSuspensa) return { sucesso: false, erro: 'Esta conta está suspensa e sem acesso ao sistema.' }

        set({ usuarioLogado: usuario })
        return { sucesso: true, usuario }
      },

      logout: () => {
        const estado = get()
        const usuarioSaindo = estado.usuarioLogado

        if (usuarioSaindo && idsContasReutilizaveis.includes(usuarioSaindo.id)) {
          const original = usuarioSeedOriginal(usuarioSaindo.id)
          if (original) {
            set({
              usuarioLogado: null,
              usuarios: estado.usuarios.map((u) => (u.id === original.id ? original : u)),
            })
            return
          }
        }

        set({ usuarioLogado: null })
      },

      atualizarPerfil: (dados) => {
        const estado = get()
        if (!estado.usuarioLogado) return
        const atualizado = { ...estado.usuarioLogado, ...dados }
        set({
          usuarioLogado: atualizado,
          usuarios: estado.usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)),
        })
      },

      debitarCreditos: (valor) => {
        const estado = get()
        if (!estado.usuarioLogado) return
        const atualizado = { ...estado.usuarioLogado, creditos: estado.usuarioLogado.creditos - valor }
        set({
          usuarioLogado: atualizado,
          usuarios: estado.usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)),
        })
      },

      regularizarCadastro: (dados) => {
        const estado = get()
        if (!estado.usuarioLogado) return
        const atualizado: Usuario = {
          ...estado.usuarioLogado,
          cpf: dados.cpf,
          telefone: dados.telefone,
          endereco: dados.endereco,
          pendencias: { cpfConfirmado: true, telefoneConfirmado: true, enderecoCadastrado: true },
        }
        set({
          usuarioLogado: atualizado,
          usuarios: estado.usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)),
        })
      },

      reativarConta: () => {
        const estado = get()
        if (!estado.usuarioLogado) return
        const atualizado = { ...estado.usuarioLogado, inativo: false }
        set({
          usuarioLogado: atualizado,
          usuarios: estado.usuarios.map((u) => (u.id === atualizado.id ? atualizado : u)),
        })
      },

      solicitarRecuperacaoSenha: (email) => {
        const estado = get()
        const usuario = estado.usuarios.find((u) => u.email === email)
        if (!usuario) return { emailExiste: false }

        const token = crypto.randomUUID()
        const novoToken: TokenRecuperacao = { token, email, criadoEm: new Date().toISOString() }
        set({ tokensRecuperacao: [...estado.tokensRecuperacao, novoToken] })

        const link = `${window.location.origin}/redefinir-senha?token=${token}`
        const { assunto, corpo } = montarEmailRecuperacaoSenha(usuario.nome, link)
        useEmailStore.getState().criarEmail({
          remetente: REMETENTE_QARENA,
          destinatario: email,
          assunto,
          corpo,
          tipo: 'recuperacao-senha',
        })

        return { emailExiste: true }
      },

      buscarUsuarioPorToken: (token) => {
        const estado = get()
        const registro = estado.tokensRecuperacao.find((t) => t.token === token)
        if (!registro) return undefined
        return estado.usuarios.find((u) => u.email === registro.email)
      },

      redefinirSenha: (token, _novaSenha) => {
        const estado = get()
        const registro = estado.tokensRecuperacao.find((t) => t.token === token)
        if (!registro) return { sucesso: false, erro: 'Link inválido ou expirado.' }
        const usuario = estado.usuarios.find((u) => u.email === registro.email)
        if (!usuario) return { sucesso: false, erro: 'Link inválido ou expirado.' }
        return { sucesso: true, usuario }
      },
    }),
    {
      name: 'qarena-auth',
      merge: (persistedState, currentState) => {
        const persistido = (persistedState ?? {}) as Partial<AuthState>
        const usuariosPersistidos: Usuario[] = Array.isArray(persistido.usuarios) ? persistido.usuarios : []
        const persistidosPorId = new Map(usuariosPersistidos.map((u) => [u.id, u]))
        const idsSeedAtual = new Set(usuariosSeed.map((u) => u.id))

        const usuariosMesclados = usuariosSeed.map((seedUser) => {
          if (idsContasReutilizaveis.includes(seedUser.id)) return seedUser
          const persistidoUser = persistidosPorId.get(seedUser.id)
          return persistidoUser ? { ...seedUser, ...persistidoUser } : seedUser
        })

        const contasCriadas = usuariosPersistidos.filter((u) => !idsSeedAtual.has(u.id))
        const todosUsuarios = [...usuariosMesclados, ...contasCriadas]

        const logadoPersistido = persistido.usuarioLogado
        const usuarioLogadoMesclado = logadoPersistido
          ? (todosUsuarios.find((u) => u.id === logadoPersistido.id) ?? null)
          : null

        return {
          ...currentState,
          ...persistido,
          usuarios: todosUsuarios,
          usuarioLogado: usuarioLogadoMesclado,
          proximoNumeroConta:
            typeof persistido.proximoNumeroConta === 'number'
              ? persistido.proximoNumeroConta
              : currentState.proximoNumeroConta,
        }
      },
    },
  ),
)
