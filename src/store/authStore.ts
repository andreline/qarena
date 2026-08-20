import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Usuario {
  id: string
  nome: string
  email: string
  cpf: string
  telefone: string
  senha: string
  numeroConta: string
  creditos: number
  bloqueado: boolean
  permissao: boolean
  contaSuspensa: boolean
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
}

interface AuthState {
  usuarios: Usuario[]
  usuarioLogado: Usuario | null
  proximoNumeroConta: number
  cadastrar: (dados: DadosCadastro) => Usuario
  login: (email: string, senha: string) => ResultadoAuth
  logout: () => void
  atualizarPerfil: (dados: Partial<Usuario>) => void
  debitarCreditos: (valor: number) => void
}

const usuariosSeed: Usuario[] = [
  {
    id: 'seed-1',
    nome: 'Usuário Sucesso',
    email: 'usuario.sucesso@qazero.com',
    cpf: '123.456.789-09',
    telefone: '(11) 91234-5678',
    senha: 'Qa@123456',
    numeroConta: 'QA-0001',
    creditos: 1000,
    bloqueado: false,
    permissao: true,
    contaSuspensa: false,
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-2',
    nome: 'Usuário Bloqueado',
    email: 'usuario.bloqueado@qazero.com',
    cpf: '234.567.890-10',
    telefone: '(11) 92345-6789',
    senha: 'Qa@123456',
    numeroConta: 'QA-0002',
    creditos: 500,
    bloqueado: true,
    permissao: true,
    contaSuspensa: false,
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-3',
    nome: 'Usuário Sem Permissão',
    email: 'usuario.sempermissao@qazero.com',
    cpf: '345.678.901-21',
    telefone: '(11) 93456-7890',
    senha: 'Qa@123456',
    numeroConta: 'QA-0003',
    creditos: 500,
    bloqueado: false,
    permissao: false,
    contaSuspensa: false,
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'seed-4',
    nome: 'Usuário Suspenso',
    email: 'usuario.suspenso@qazero.com',
    cpf: '456.789.012-32',
    telefone: '(11) 94567-8901',
    senha: 'Qa@123456',
    numeroConta: 'QA-0004',
    creditos: 500,
    bloqueado: false,
    permissao: true,
    contaSuspensa: true,
    criadoEm: '2026-01-01T00:00:00.000Z',
  },
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuarios: usuariosSeed,
      usuarioLogado: null,
      proximoNumeroConta: 5,

      cadastrar: (dados) => {
        const estado = get()
        const numeroConta = `QA-${String(estado.proximoNumeroConta).padStart(4, '0')}`

        const novoUsuario: Usuario = {
          id: crypto.randomUUID(),
          nome: dados.nome,
          email: dados.email,
          cpf: dados.cpf,
          telefone: dados.telefone,
          senha: dados.senha,
          numeroConta,
          creditos: dados.comCreditos ? 1000 : 0,
          bloqueado: false,
          permissao: true,
          contaSuspensa: false,
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
        return { sucesso: true }
      },

      logout: () => set({ usuarioLogado: null }),

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
    }),
    { name: 'qarena-auth' },
  ),
)
