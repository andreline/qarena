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

export type CorLab = 'cyan' | 'purple' | 'magenta'

export interface Lab {
  id: string
  nome: string
  descricao: string
  rota: string
  icone: LucideIcon
  cor: CorLab
  bugs: number
  disponivel: boolean
}

export const labs: Lab[] = [
  {
    id: 'cadastro',
    nome: 'Cadastro',
    descricao: 'Crie sua conta no QArena e desconfie de cada campo. Aceite de termos, CPF e confirmação de senha escondem armadilhas.',
    rota: '/cadastro',
    icone: UserPlus,
    cor: 'purple',
    bugs: 6,
    disponivel: true,
  },
  {
    id: 'login',
    nome: 'Login',
    descricao: 'A porta de entrada do sistema. Teste usuários bloqueados, mensagens de erro e validação de campos.',
    rota: '/login',
    icone: LogIn,
    cor: 'cyan',
    bugs: 6,
    disponivel: true,
  },
  {
    id: 'loja',
    nome: 'Loja',
    descricao: 'A vitrine de produtos fictícios do QArena. Investigue preços, estoque e filtros com atenção redobrada.',
    rota: '/app/loja',
    icone: Store,
    cor: 'magenta',
    bugs: 3,
    disponivel: true,
  },
  {
    id: 'carrinho',
    nome: 'Carrinho',
    descricao: 'Some, remova e altere quantidades. O total exibido nem sempre bate com o que deveria ser cobrado.',
    rota: '/app/carrinho',
    icone: ShoppingCart,
    cor: 'cyan',
    bugs: 3,
    disponivel: true,
  },
  {
    id: 'checkout',
    nome: 'Cupom e Checkout',
    descricao: 'O laboratório mais concorrido. Aqui mora o cupom que anuncia 10% de desconto mas aplica só 5%.',
    rota: '/app/checkout',
    icone: Ticket,
    cor: 'purple',
    bugs: 7,
    disponivel: false,
  },
  {
    id: 'perfil',
    nome: 'Perfil do Usuário',
    descricao: 'Edite seus dados cadastrais e veja se as validações realmente protegem as informações da conta.',
    rota: '/app/perfil',
    icone: User,
    cor: 'magenta',
    bugs: 4,
    disponivel: false,
  },
  {
    id: 'pedidos',
    nome: 'Meus Pedidos',
    descricao: 'Acompanhe o histórico de compras simuladas e confira se o status de cada pedido faz sentido.',
    rota: '/app/pedidos',
    icone: Package,
    cor: 'cyan',
    bugs: 4,
    disponivel: false,
  },
  {
    id: 'missoes',
    nome: 'Missões QA',
    descricao: 'Desafios guiados para praticar seu raciocínio de teste com objetivos claros a cada etapa.',
    rota: '/missoes',
    icone: Target,
    cor: 'purple',
    bugs: 0,
    disponivel: false,
  },
]

export const totalBugs = labs.reduce((total, lab) => total + lab.bugs, 0)
