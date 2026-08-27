import {
  UserPlus,
  LogIn,
  Store,
  ShoppingCart,
  Ticket,
  User,
  Package,
  Target,
  type LucideIcon,
} from 'lucide-react'
import { bugs } from './bugs'

export type CorLab = 'cyan' | 'purple' | 'magenta'

export interface Lab {
  id: string
  nome: string
  descricao: string
  rota: string
  icone: LucideIcon
  cor: CorLab
  telas: string[]
  disponivel: boolean
}

function contarBugsPorTelas(telas: string[]): number {
  return bugs.filter((bug) => telas.includes(bug.tela)).length
}

const labsBase: Lab[] = [
  {
    id: 'cadastro',
    nome: 'Cadastro',
    descricao: 'Crie sua conta no QArena e desconfie de cada campo. Aceite de termos, CPF e confirmação de senha escondem armadilhas.',
    rota: '/cadastro',
    icone: UserPlus,
    cor: 'purple',
    telas: ['Cadastro'],
    disponivel: true,
  },
  {
    id: 'login',
    nome: 'Login',
    descricao: 'A porta de entrada do sistema. Teste usuários bloqueados, mensagens de erro e validação de campos.',
    rota: '/login',
    icone: LogIn,
    cor: 'cyan',
    telas: ['Login'],
    disponivel: true,
  },
  {
    id: 'loja',
    nome: 'Loja',
    descricao: 'A vitrine de produtos fictícios do QArena. Investigue preços, estoque, busca, ordenação e filtros com atenção redobrada.',
    rota: '/app/loja',
    icone: Store,
    cor: 'magenta',
    telas: ['Loja'],
    disponivel: true,
  },
  {
    id: 'carrinho',
    nome: 'Carrinho',
    descricao: 'Some, remova e altere quantidades. O total exibido nem sempre bate com o que deveria ser cobrado.',
    rota: '/app/carrinho',
    icone: ShoppingCart,
    cor: 'cyan',
    telas: ['Carrinho'],
    disponivel: true,
  },
  {
    id: 'checkout',
    nome: 'Cupom e Checkout',
    descricao: 'O laboratório mais concorrido. Aqui mora o cupom que anuncia 10% de desconto mas aplica só 5%.',
    rota: '/app/checkout',
    icone: Ticket,
    cor: 'purple',
    telas: ['Checkout'],
    disponivel: true,
  },
  {
    id: 'perfil',
    nome: 'Perfil do Usuário',
    descricao: 'Edite seus dados cadastrais e veja se as validações realmente protegem as informações da conta.',
    rota: '/app/perfil',
    icone: User,
    cor: 'magenta',
    telas: ['Perfil do Usuário'],
    disponivel: true,
  },
  {
    id: 'pedidos',
    nome: 'Meus Pedidos',
    descricao: 'Acompanhe o histórico de compras simuladas e confira se o status de cada pedido faz sentido.',
    rota: '/app/pedidos',
    icone: Package,
    cor: 'cyan',
    telas: ['Meus Pedidos'],
    disponivel: true,
  },
  {
    id: 'missoes',
    nome: 'Missões QA',
    descricao: 'Desafios guiados para praticar seu raciocínio de teste com objetivos claros a cada etapa.',
    rota: '/missoes',
    icone: Target,
    cor: 'purple',
    telas: [],
    disponivel: true,
  },
]

export const labs: (Lab & { bugs: number })[] = labsBase.map((lab) => ({
  ...lab,
  bugs: contarBugsPorTelas(lab.telas),
}))

export const totalBugs = bugs.length
