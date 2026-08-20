import { Coffee, Shirt, Sticker, Backpack, Package, type LucideIcon } from 'lucide-react'

export type CorProduto = 'cyan' | 'purple' | 'magenta'

export interface Produto {
  id: string
  nome: string
  descricao: string
  categoria: string
  preco: number
  estoque: number
  icone: LucideIcon
  cor: CorProduto
  imagem: string
}

export const categorias = ['Todos', 'Canecas', 'Camisetas', 'Adesivos', 'Acessórios']

export const produtos: Produto[] = [
  {
    id: 'caneca-bug-hunter',
    nome: 'Caneca Bug Hunter',
    descricao: 'Para tomar café enquanto você caça o próximo bug.',
    categoria: 'Canecas',
    preco: 39.9,
    estoque: 12,
    icone: Coffee,
    cor: 'cyan',
    imagem: '/produtos/caneca-bug-hunter.jpg',
  },
  {
    id: 'caneca-erro-404',
    nome: 'Caneca Erro 404',
    descricao: 'Café não encontrado. Tente novamente mais tarde.',
    categoria: 'Canecas',
    preco: 39.9,
    estoque: 0,
    icone: Coffee,
    cor: 'purple',
    imagem: '/produtos/caneca-erro-404.jpg',
  },
  {
    id: 'camiseta-qa-do-zero',
    nome: 'Camiseta QA do Zero',
    descricao: 'Para usar no primeiro dia como analista de qualidade.',
    categoria: 'Camisetas',
    preco: 79.9,
    estoque: 8,
    icone: Shirt,
    cor: 'magenta',
    imagem: '/produtos/camiseta-qa-do-zero.jpg',
  },
  {
    id: 'camiseta-testei-e-quebrei',
    nome: 'Camiseta Testei e Quebrei',
    descricao: 'Aquele orgulho de achar o bug que ninguém viu.',
    categoria: 'Camisetas',
    preco: 79.9,
    estoque: 5,
    icone: Shirt,
    cor: 'cyan',
    imagem: '/produtos/camiseta-testei-e-quebrei.jpg',
  },
  {
    id: 'adesivo-nao-reproduz',
    nome: 'Adesivo Não Reproduz na Minha Máquina',
    descricao: 'A frase mais clássica de todo desenvolvedor.',
    categoria: 'Adesivos',
    preco: 9.9,
    estoque: 30,
    icone: Sticker,
    cor: 'purple',
    imagem: '/produtos/adesivo-nao-reproduz.jpg',
  },
  {
    id: 'adesivo-encontrei-um-bug',
    nome: 'Adesivo Encontrei Um Bug',
    descricao: 'Cole no notebook e mostre orgulho da profissão.',
    categoria: 'Adesivos',
    preco: 9.9,
    estoque: 30,
    icone: Sticker,
    cor: 'magenta',
    imagem: '/produtos/adesivo-encontrei-um-bug.jpg',
  },
  {
    id: 'mochila-qarena',
    nome: 'Mochila QArena',
    descricao: 'Espaço de sobra para o notebook e para os bugs que você vai carregar.',
    categoria: 'Acessórios',
    preco: 149.9,
    estoque: 3,
    icone: Backpack,
    cor: 'cyan',
    imagem: '/produtos/mochila-qarena.jpg',
  },
  {
    id: 'garrafa-hidratacao-qa',
    nome: 'Garrafa de Hidratação do QA',
    descricao: 'Testar dá sede. Mantenha-se hidratado entre um cenário e outro.',
    categoria: 'Acessórios',
    preco: 49.9,
    estoque: 15,
    icone: Package,
    cor: 'purple',
    imagem: '/produtos/garrafa-hidratacao-qa.jpg',
  },
]
